// Rift Vault — servidor local mínimo (sin dependencias externas)
// Sirve la app y hace de puente hacia la API de RiftScribe desde el servidor,
// donde las restricciones CORS del navegador no aplican.

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const API_HOST = 'riftscribe.gg';
const PUBLIC_DIR = path.join(__dirname, 'public');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

function proxyToRiftscribe(targetPath, res) {
  // Solo se permiten peticiones GET a rutas que empiecen por /api/, por seguridad.
  if (!targetPath.startsWith('/api/')) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Ruta no permitida' }));
    return;
  }

  const options = {
    hostname: API_HOST,
    path: targetPath,
    method: 'GET',
    headers: { 'Accept': 'application/json', 'User-Agent': 'RiftVault-LocalApp/1.0' },
    timeout: 10000,
  };

  const req = https.request(options, (apiRes) => {
    let chunks = [];
    apiRes.on('data', (c) => chunks.push(c));
    apiRes.on('end', () => {
      const body = Buffer.concat(chunks);
      res.writeHead(apiRes.statusCode || 502, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(body);
    });
  });

  req.on('timeout', () => {
    req.destroy(new Error('Tiempo de espera agotado al contactar con riftscribe.gg'));
  });

  req.on('error', (err) => {
    console.error('Error contactando con RiftScribe:', err.message);
    if (!res.headersSent) {
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'No se pudo contactar con riftscribe.gg: ' + err.message }));
    }
  });

  req.end();
}

function serveStatic(reqPath, res) {
  let filePath = path.join(PUBLIC_DIR, reqPath === '/' ? 'index.html' : reqPath);

  // Evita salir del directorio public/
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403); res.end('Forbidden'); return;
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('No encontrado: ' + reqPath);
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(content);
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (url.pathname === '/api/proxy') {
    const target = url.searchParams.get('path');
    if (!target) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Falta el parámetro "path"' }));
      return;
    }
    proxyToRiftscribe(target, res);
    return;
  }

  serveStatic(url.pathname, res);
});

server.listen(PORT, () => {
  console.log(`\n  Rift Vault corriendo en http://localhost:${PORT}\n`);
  console.log('  Abre esa dirección en tu navegador. Pulsa Ctrl+C para detener el servidor.\n');
});

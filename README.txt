RIFT VAULT — Stock de cartas de Riftbound
==========================================

Requisito: tener Node.js instalado (cualquier versión reciente).
Puedes comprobarlo abriendo una terminal y escribiendo: node -v
Si no lo tienes, descárgalo gratis en https://nodejs.org (elige la versión "LTS").

CÓMO ARRANCAR LA APP
---------------------
1. Abre una terminal (o símbolo del sistema) en esta carpeta (la que contiene
   este archivo, server.js y la carpeta public/).

2. Ejecuta:

       node server.js

3. Verás un mensaje como:

       Rift Vault corriendo en http://localhost:3000

4. Abre esa dirección (http://localhost:3000) en tu navegador.

5. Para detener la app, vuelve a la terminal y pulsa Ctrl+C.

Cada vez que quieras volver a usar la app, repite los pasos 1-4.

POR QUÉ HACE FALTA UN SERVIDOR
-------------------------------
La API de cartas (riftscribe.gg) no permite que un navegador la consulte
directamente por motivos de seguridad (CORS). server.js hace de intermediario:
tu navegador le pide los datos a tu propio servidor local, y es ese servidor
—no el navegador— quien contacta con riftscribe.gg. Así se evita el bloqueo
por completo y no dependemos de proxies gratuitos de terceros, que son poco
fiables.

DÓNDE SE GUARDA TU COLECCIÓN Y TUS MAZOS
------------------------------------------
Todo se guarda en el propio navegador (localStorage), en tu ordenador. No se
envía a ningún servidor externo. Si abres la app en otro navegador o la
borras del historial/datos del sitio, no verás la misma colección: es un
almacenamiento local por navegador, no una cuenta en la nube.

ESTRUCTURA DE ARCHIVOS
------------------------
server.js         -> el servidor local (sin dependencias que instalar)
public/index.html -> toda la app (interfaz + lógica)

/* ============ THEME ============ */
const STORAGE_THEME = 'rv_theme_v1';
function applyTheme(theme){
    if(theme){ document.documentElement.setAttribute('data-theme', theme); }
    else{ document.documentElement.removeAttribute('data-theme'); }
    document.querySelectorAll('.theme-swatch').forEach(s=>{
        s.classList.toggle('active', (s.dataset.theme || '') === (theme || ''));
    });
    localStorage.setItem(STORAGE_THEME, theme || '');
}
function initTheme(){
    const saved = localStorage.getItem(STORAGE_THEME) || '';
    applyTheme(saved);
    document.querySelectorAll('.theme-swatch').forEach(s=>{
        s.onclick = ()=> applyTheme(s.dataset.theme || '');
    });
}
initTheme();

/* ============ CONFIG ============ */
const API_BASE = 'https://riftscribe.gg';
const STORAGE_STOCK = 'rv_stock_v1';
const STORAGE_DECKS = 'rv_decks_v1';

const FACTION_COLORS = {
    'fury': '#e2543c', 'calm': '#3ea8d8', 'mind': '#a06be0',
    'body': '#4caf6b', 'order': '#e8c368', 'chaos': '#8a8a95',
};

/* ============ STATE ============ */
let state = {
    view: 'search',
    stock: JSON.parse(localStorage.getItem(STORAGE_STOCK) || '{}'),      // { cardId: {qty, card} }
    decks: JSON.parse(localStorage.getItem(STORAGE_DECKS) || '{}'),      // { deckId: {id,name,cards:{cardId:qty}} }
    activeDeckId: null,
    searchResults: [],
    searchQuery: '',
    searchLoading: false,
    searchError: null,
    collectionGroupBy: 'faction',
    filterOptions: null,
};

const searchCache = new Map(); // query -> normalized results, evita repetir peticiones a la API

function saveStock(){ localStorage.setItem(STORAGE_STOCK, JSON.stringify(state.stock)); }
function saveDecks(){ localStorage.setItem(STORAGE_DECKS, JSON.stringify(state.decks)); }

/* ============ HELPERS ============ */
function factionColor(name){
    if(!name) return '#6b6680';
    const key = String(name).toLowerCase().trim();
    if(FACTION_COLORS[key]) return FACTION_COLORS[key];
    // deterministic fallback color from string hash
    let hash = 0;
    for(let i=0;i<key.length;i++){ hash = key.charCodeAt(i) + ((hash<<5)-hash); }
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 55%, 58%)`;
}

function extractImage(raw){
    let img = null;
    if(raw.image){ img = typeof raw.image === 'string' ? raw.image : (raw.image.medium || raw.image.small || raw.image.large); }
    else if(raw.images){
        if(Array.isArray(raw.images)){
            const front = raw.images.find(i=>i.type==='front') || raw.images[0];
            img = front && (front.medium||front.small||front.large||front.url);
        } else {
            img = raw.images.medium || raw.images.small || raw.images.large ||
                (raw.images.front && (raw.images.front.medium||raw.images.front.small||raw.images.front.large));
        }
    }
    else if(raw.image_url) img = raw.image_url;
    else if(raw.image_uri) img = raw.image_uri;
    if(!img) return null;
    if(/^https?:\/\//.test(img)) return img;
    return API_BASE.replace(/\/$/,'') + '/' + img.replace(/^\//,'');
}

function normalizeCard(raw){
    const id = raw.id || raw.card_id || raw.full_id || `${raw.set_id||raw.set||'X'}-${raw.number||raw.collector_number||Math.random().toString(36).slice(2)}`;
    const setId = raw.set_id || raw.set || (raw.expansion && raw.expansion.id) || (raw.set && raw.set.id) || 'N/A';
    const setName = (raw.expansion && raw.expansion.name) || (raw.set && raw.set.name) || raw.set_name || setId;
    const faction = raw.faction || raw.color || raw.domain || raw.energy ||
        (Array.isArray(raw.factions) ? raw.factions.join(' / ') : null) || 'Sin dominio';
    return {
        id: String(id),
        name: raw.name || raw.card_name || 'Carta sin nombre',
        set: String(setId),
        setName: setName,
        faction: faction,
        rarity: raw.rarity || 'N/A',
        type: raw.type || raw.card_type || '',
        number: raw.collector_number || raw.number || '',
        image: extractImage(raw),
    };
}

const CORS_PROXIES = [
    (url)=> 'https://api.codetabs.com/v1/proxy?quest=' + encodeURIComponent(url),
    (url)=> 'https://api.allorigins.win/raw?url=' + encodeURIComponent(url),
    (url)=> 'https://corsproxy.io/?url=' + encodeURIComponent(url),
    (url)=> 'https://thingproxy.freeboard.io/fetch/' + url,
];

function sleep(ms){ return new Promise(r=>setTimeout(r, ms)); }

async function apiGet(path){
    const target = API_BASE + path;
    let lastErr;
    for(const wrap of CORS_PROXIES){
        for(let attempt=0; attempt<2; attempt++){
            try{
                const res = await fetch(wrap(target), { headers:{ 'Accept':'application/json' } });
                if(res.status === 429){ await sleep(700); continue; }
                if(!res.ok) throw new Error('HTTP ' + res.status);
                const text = await res.text();
                return JSON.parse(text);
            }catch(e){
                lastErr = e;
            }
        }
    }
    throw new Error('No se pudo contactar con la API (' + (lastErr && lastErr.message) + ')');
}

function toArray(data){
    if(Array.isArray(data)) return data;
    if(data && Array.isArray(data.cards)) return data.cards;
    if(data && Array.isArray(data.data)) return data.data;
    if(data && Array.isArray(data.results)) return data.results;
    return [];
}

let toastTimer;
function showToast(msg){
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(()=>t.classList.remove('show'), 2200);
}

function esc(s){ return String(s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

/* ============ STOCK ACTIONS ============ */
function addToStock(card, delta=1){
    const entry = state.stock[card.id] || { qty:0, card };
    entry.qty = Math.max(0, entry.qty + delta);
    entry.card = card;
    if(entry.qty === 0){ delete state.stock[card.id]; }
    else { state.stock[card.id] = entry; }
    saveStock();
}
function stockQty(cardId){ return state.stock[cardId] ? state.stock[cardId].qty : 0; }

/* ============ DECK ACTIONS ============ */
function createDeck(){
    const id = 'd_' + Date.now();
    state.decks[id] = { id, name: 'Nuevo mazo', cards: {} };
    saveDecks();
    return id;
}
function deckCardQty(deck, cardId){ return deck.cards[cardId] || 0; }
function setDeckCardQty(deck, card, qty){
    if(qty <= 0){ delete deck.cards[card.id]; }
    else { deck.cards[card.id] = qty; deck._cache = deck._cache || {}; deck._cache[card.id] = card; }
    saveDecks();
}
function deckTotalCount(deck){ return Object.values(deck.cards).reduce((a,b)=>a+b,0); }

/* ============ EXPORT / IMPORT (copia de seguridad) ============ */
function exportData(){
    const payload = {
        app: 'rift-vault',
        version: 1,
        exportedAt: new Date().toISOString(),
        stock: state.stock,
        decks: state.decks,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const date = new Date().toISOString().slice(0,10);
    a.href = url;
    a.download = `rift-vault-backup-${date}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast('Copia de seguridad descargada');
}

function importData(file){
    const reader = new FileReader();
    reader.onload = (e)=>{
        try{
            const data = JSON.parse(e.target.result);
            if(!data || typeof data !== 'object' || (!data.stock && !data.decks)){
                showToast('El archivo no parece una copia de seguridad válida');
                return;
            }
            const replace = confirm('¿Reemplazar tu colección y mazos actuales por los del archivo? Pulsa "Cancelar" para combinarlos en vez de reemplazarlos.');
            if(replace){
                state.stock = data.stock || {};
                state.decks = data.decks || {};
            } else {
                state.stock = { ...state.stock, ...(data.stock || {}) };
                state.decks = { ...state.decks, ...(data.decks || {}) };
            }
            saveStock();
            saveDecks();
            showToast('Copia de seguridad importada');
            render();
        }catch(err){
            showToast('No se pudo leer el archivo: ' + err.message);
        }
    };
    reader.readAsText(file);
}

/* ============ RENDER ROOT ============ */
function render(){
    document.querySelectorAll('nav button').forEach(b=>{
        b.classList.toggle('active', b.dataset.view === state.view);
    });
    const main = document.getElementById('main');
    if(state.view === 'search') main.innerHTML = renderSearchView();
    else if(state.view === 'collection') main.innerHTML = renderCollectionView();
    else if(state.view === 'decks'){
        main.innerHTML = state.activeDeckId ? renderDeckBuilder() : renderDecksView();
    }
    attachHandlers();
}

/* ============ SEARCH VIEW ============ */
function renderCardTile(card, opts={}){
    const qty = stockQty(card.id);
    const color = factionColor(card.faction);
    const delay = (opts.index || 0) * 0.035;
    const imgHtml = card.image
        ? `<img src="${esc(card.image)}" alt="${esc(card.name)}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=noimg>${esc(card.name)}</div>'">`
        : `<div class="noimg">${esc(card.name)}</div>`;
    return `
    <div class="card-tile" data-card-id="${esc(card.id)}" style="animation-delay:${delay}s">
      <div class="thumb">
        ${imgHtml}
        ${qty > 0 ? `<span class="qty-badge">x${qty}</span>` : ''}
      </div>
      <div class="info">
        <div class="name">${esc(card.name)}</div>
        <div class="meta">
          <span><span class="color-dot" style="background:${color}"></span>${esc(card.faction)}</span>
          <span>${esc(card.set)}</span>
        </div>
        <div class="meta"><span>${esc(card.rarity)}</span><span>${esc(card.number ? '#'+card.number : '')}</span></div>
        <div class="actions">
          ${opts.deckMode
        ? `<button class="btn btn-gold btn-full btn-sm add-to-deck" data-card='${esc(JSON.stringify(card))}'>Añadir al mazo</button>`
        : `<button class="btn btn-gold btn-full btn-sm add-to-stock" data-card='${esc(JSON.stringify(card))}'>+ Añadir</button>`
    }
        </div>
      </div>
    </div>`;
}

function renderSearchView(){
    return `
    <div class="view-title">
      <div>
        <h1>Buscador de cartas</h1>
        <p>Encuentra cualquier carta de Riftbound y añádela a tu colección.</p>
      </div>
    </div>
    <div class="search-bar">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <input id="search-input" type="text" placeholder="Busca por nombre (ej. Jinx, Ashe, Ornn...)" value="${esc(state.searchQuery)}" autocomplete="off">
    </div>
    <div class="search-hint">Escribe al menos 2 letras. Los datos vienen de la API pública de RiftScribe.</div>
    <div id="search-results" style="margin-top:20px;">
      ${renderSearchResults()}
    </div>
  `;
}

function renderSearchResults(){
    if(state.searchLoading){
        return `<div class="loading"><div class="spin"></div> Buscando cartas…</div>`;
    }
    if(state.searchError){
        return `<div class="empty-state"><h3>No se pudo conectar con la API</h3><p>${esc(state.searchError)}<br>Los proxies gratuitos a veces se saturan durante unos segundos.</p><button class="btn btn-gold" id="retry-search-btn" style="margin-top:10px;">Reintentar</button></div>`;
    }
    if(!state.searchQuery || state.searchQuery.length < 2){
        return `<div class="empty-state"><h3>Empieza a escribir</h3><p>Los resultados aparecerán aquí a medida que busques.</p></div>`;
    }
    if(state.searchResults.length === 0){
        return `<div class="empty-state"><h3>Sin resultados</h3><p>No se encontraron cartas para "${esc(state.searchQuery)}".</p></div>`;
    }
    return `<div class="card-grid">${state.searchResults.map((c,i)=>renderCardTile(c,{index:i})).join('')}</div>`;
}

let searchDebounce;
async function runSearch(q){
    state.searchQuery = q;
    if(!q || q.length < 2){ state.searchResults = []; state.searchError = null; document.getElementById('search-results').innerHTML = renderSearchResults(); return; }

    const cacheKey = q.trim().toLowerCase();
    if(searchCache.has(cacheKey)){
        state.searchResults = searchCache.get(cacheKey);
        state.searchError = null;
        state.searchLoading = false;
        if(state.view === 'search'){
            document.getElementById('search-results').innerHTML = renderSearchResults();
            attachHandlers();
        }
        return;
    }

    state.searchLoading = true;
    state.searchError = null;
    document.getElementById('search-results').innerHTML = renderSearchResults();
    try{
        const data = await apiGet('/api/cards/search?q=' + encodeURIComponent(q) + '&limit=24');
        state.searchResults = toArray(data).map(normalizeCard);
        searchCache.set(cacheKey, state.searchResults);
    }catch(e){
        state.searchError = e.message || 'Error de red';
        state.searchResults = [];
    }
    state.searchLoading = false;
    if(state.view === 'search'){
        document.getElementById('search-results').innerHTML = renderSearchResults();
        attachHandlers();
    }
}

/* ============ COLLECTION VIEW ============ */
function renderCollectionView(){
    const entries = Object.values(state.stock);
    const totalCards = entries.reduce((a,e)=>a+e.qty,0);
    const uniqueCards = entries.length;
    const factionsCount = new Set(entries.map(e=>e.card.faction)).size;
    const setsCount = new Set(entries.map(e=>e.card.set)).size;

    if(entries.length === 0){
        return `
      <div class="view-title"><div><h1>Mi colección</h1><p>Aún no has añadido cartas.</p></div></div>
      <div class="empty-state">
        <h3>Tu bóveda está vacía</h3>
        <p>Ve al <strong>Buscador</strong> y añade tus primeras cartas para empezar a llevar el stock.</p>
      </div>`;
    }

    const groupBy = state.collectionGroupBy;
    const groups = {};
    entries.forEach(e=>{
        const key = groupBy === 'faction' ? e.card.faction : `${e.card.set} · ${e.card.setName || ''}`;
        (groups[key] = groups[key] || []).push(e);
    });
    const sortedKeys = Object.keys(groups).sort();

    const groupsHtml = sortedKeys.map(key=>{
        const items = groups[key].sort((a,b)=>a.card.name.localeCompare(b.card.name));
        const color = groupBy === 'faction' ? factionColor(key) : '#6b6680';
        const count = items.reduce((a,e)=>a+e.qty,0);
        return `
      <div class="group">
        <div class="group-header">
          <span class="swatch" style="background:${color}"></span>
          <h3>${esc(key)}</h3>
          <span class="count">${count} cartas · ${items.length} únicas</span>
        </div>
        <div class="card-grid">${items.map((e,i)=>renderStockTile(e,i)).join('')}</div>
      </div>`;
    }).join('');

    return `
    <div class="view-title">
      <div><h1>Mi colección</h1><p>Tu stock organizado ${groupBy==='faction'?'por color':'por expansión'}.</p></div>
    </div>
    <div class="stats-row">
      <div class="stat-card"><div class="num">${totalCards}</div><div class="lbl">Cartas totales</div></div>
      <div class="stat-card"><div class="num">${uniqueCards}</div><div class="lbl">Cartas únicas</div></div>
      <div class="stat-card"><div class="num">${factionsCount}</div><div class="lbl">Dominios</div></div>
      <div class="stat-card"><div class="num">${setsCount}</div><div class="lbl">Expansiones</div></div>
    </div>
    <div class="filters-row">
      <span class="chip ${groupBy==='faction'?'active':''}" data-groupby="faction">Agrupar por color</span>
      <span class="chip ${groupBy==='set'?'active':''}" data-groupby="set">Agrupar por expansión</span>
    </div>
    ${groupsHtml}
  `;
}

function renderStockTile(entry, index=0){
    const card = entry.card;
    const color = factionColor(card.faction);
    const delay = (index % 12) * 0.035;
    const imgHtml = card.image
        ? `<img src="${esc(card.image)}" alt="${esc(card.name)}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=noimg>${esc(card.name)}</div>'">`
        : `<div class="noimg">${esc(card.name)}</div>`;
    return `
    <div class="card-tile" style="animation-delay:${delay}s">
      <div class="thumb">${imgHtml}<span class="qty-badge">x${entry.qty}</span></div>
      <div class="info">
        <div class="name">${esc(card.name)}</div>
        <div class="meta"><span><span class="color-dot" style="background:${color}"></span>${esc(card.faction)}</span><span>${esc(card.set)}</span></div>
        <div class="actions">
          <div class="stepper">
            <button class="stock-dec" data-card='${esc(JSON.stringify(card))}'>−</button>
            <span>${entry.qty}</span>
            <button class="stock-inc" data-card='${esc(JSON.stringify(card))}'>+</button>
          </div>
        </div>
      </div>
    </div>`;
}

/* ============ DECKS VIEW ============ */
function renderDecksView(){
    const decks = Object.values(state.decks);
    const cardsHtml = decks.map(d=>`
    <div class="deck-card" data-open-deck="${esc(d.id)}">
      <div class="dname">${esc(d.name)}</div>
      <div class="dmeta">${deckTotalCount(d)} cartas · ${Object.keys(d.cards).length} únicas</div>
    </div>`).join('');
    return `
    <div class="view-title">
      <div><h1>Mazos</h1><p>Organiza tus cartas en mazos de juego.</p></div>
    </div>
    <div class="deck-list">
      ${cardsHtml}
      <div class="new-deck-card" id="new-deck-btn">+ Nuevo mazo</div>
    </div>
    ${decks.length===0 ? `<div class="empty-state"><h3>Ningún mazo todavía</h3><p>Crea uno y añade cartas desde tu colección.</p></div>` : ''}
  `;
}

function renderDeckBuilder(){
    const deck = state.decks[state.activeDeckId];
    if(!deck){ state.activeDeckId = null; return renderDecksView(); }
    deck._cache = deck._cache || {};

    const rows = Object.entries(deck.cards).map(([cardId, qty])=>{
        const card = deck._cache[cardId] || (state.stock[cardId] && state.stock[cardId].card) || { id:cardId, name:cardId, faction:'', set:'' };
        return { card, qty };
    }).sort((a,b)=>a.card.name.localeCompare(b.card.name));

    const factionTotals = {};
    rows.forEach(r=>{ factionTotals[r.card.faction] = (factionTotals[r.card.faction]||0) + r.qty; });
    const total = deckTotalCount(deck);
    const barSegments = Object.entries(factionTotals).map(([f,c])=>{
        const pct = total ? (c/total*100) : 0;
        return `<div style="width:${pct}%; background:${factionColor(f)}" title="${esc(f)}"></div>`;
    }).join('');
    const legendRows = Object.entries(factionTotals).map(([f,c])=>`
    <div class="legend-row">
      <span class="left"><span class="color-dot" style="background:${factionColor(f)}"></span>${esc(f)}</span>
      <span>${c}</span>
    </div>`).join('');

    const rowsHtml = rows.map(r=>{
        const imgHtml = r.card.image ? `<img src="${esc(r.card.image)}" onerror="this.style.display='none'">` : `<div style="width:32px;height:44px;background:var(--bg-alt);border-radius:4px;"></div>`;
        return `
      <div class="deck-row">
        ${imgHtml}
        <div style="flex:1;">
          <div class="rname">${esc(r.card.name)}</div>
          <div class="rmeta">${esc(r.card.faction||'')} · ${esc(r.card.set||'')}</div>
        </div>
        <div class="stepper">
          <button class="deck-dec" data-card='${esc(JSON.stringify(r.card))}'>−</button>
          <span>${r.qty}</span>
          <button class="deck-inc" data-card='${esc(JSON.stringify(r.card))}'>+</button>
        </div>
      </div>`;
    }).join('') || `<div class="empty-state">Aún no hay cartas en este mazo. Añade desde el panel de la derecha.</div>`;

    const collectionEntries = Object.values(state.stock).sort((a,b)=>a.card.name.localeCompare(b.card.name));
    const collectionHtml = collectionEntries.map(e=>{
        const inDeck = deckCardQty(deck, e.card.id);
        return `
      <div class="deck-row">
        ${e.card.image ? `<img src="${esc(e.card.image)}" onerror="this.style.display='none'">` : `<div style="width:32px;height:44px;background:var(--bg-alt);border-radius:4px;"></div>`}
        <div style="flex:1;">
          <div class="rname">${esc(e.card.name)}</div>
          <div class="rmeta">Posees ${e.qty} · En mazo ${inDeck}</div>
        </div>
        <button class="btn btn-ghost btn-sm add-to-deck" data-card='${esc(JSON.stringify(e.card))}' ${inDeck>=e.qty?'disabled':''}>+</button>
      </div>`;
    }).join('') || `<div class="empty-state" style="padding:20px;">No tienes cartas en tu colección todavía. Búscalas primero en el Buscador.</div>`;

    return `
    <div class="back-link" id="back-to-decks">← Volver a mazos</div>
    <div class="deck-header">
      <input type="text" id="deck-name-input" value="${esc(deck.name)}">
      <button class="btn btn-danger btn-sm" id="delete-deck-btn">Eliminar mazo</button>
    </div>
    <div class="deck-builder">
      <div>
        <h3 style="margin:0 0 10px; font-size:14px; color:var(--text-dim);">Cartas en el mazo (${total})</h3>
        <div class="deck-list-rows">${rowsHtml}</div>
      </div>
      <div>
        <div class="deck-side-panel" style="margin-bottom:16px;">
          <h3>Balance de dominios</h3>
          <div class="color-bar">${barSegments || ''}</div>
          <div class="legend">${legendRows || '<div class="rmeta" style="color:var(--text-dim)">Sin cartas aún</div>'}</div>
        </div>
        <div class="deck-side-panel">
          <h3>Añadir desde tu colección</h3>
          <div class="deck-list-rows" style="max-height:400px;">${collectionHtml}</div>
        </div>
      </div>
    </div>
  `;
}

/* ============ EXPORT / IMPORT UI (sidebar, se conecta una sola vez) ============ */
function initDataButtons(){
    const exportBtn = document.getElementById('export-btn');
    const importBtn = document.getElementById('import-btn');
    const importInput = document.getElementById('import-input');
    if(exportBtn) exportBtn.onclick = exportData;
    if(importBtn && importInput){
        importBtn.onclick = ()=> importInput.click();
        importInput.onchange = (e)=>{
            const file = e.target.files[0];
            if(file) importData(file);
            importInput.value = '';
        };
    }
}
initDataButtons();

/* ============ EVENT HANDLERS ============ */
function attachHandlers(){
    document.querySelectorAll('nav button').forEach(b=>{
        b.onclick = ()=>{ state.view = b.dataset.view; if(b.dataset.view!=='decks') state.activeDeckId=null; render(); };
    });

    const searchInput = document.getElementById('search-input');
    if(searchInput){
        searchInput.oninput = (e)=>{
            const v = e.target.value;
            clearTimeout(searchDebounce);
            searchDebounce = setTimeout(()=>runSearch(v), 350);
        };
    }

    const retryBtn = document.getElementById('retry-search-btn');
    if(retryBtn) retryBtn.onclick = ()=> runSearch(state.searchQuery);

    document.querySelectorAll('.add-to-stock').forEach(btn=>{
        btn.onclick = ()=>{
            const card = JSON.parse(btn.dataset.card);
            addToStock(card, 1);
            showToast(`${card.name} añadida a tu colección`);
            render();
        };
    });

    document.querySelectorAll('.stock-inc').forEach(btn=>{
        btn.onclick = ()=>{ const card = JSON.parse(btn.dataset.card); addToStock(card, 1); render(); };
    });
    document.querySelectorAll('.stock-dec').forEach(btn=>{
        btn.onclick = ()=>{ const card = JSON.parse(btn.dataset.card); addToStock(card, -1); render(); };
    });

    document.querySelectorAll('.chip[data-groupby]').forEach(chip=>{
        chip.onclick = ()=>{ state.collectionGroupBy = chip.dataset.groupby; render(); };
    });

    const newDeckBtn = document.getElementById('new-deck-btn');
    if(newDeckBtn) newDeckBtn.onclick = ()=>{ const id = createDeck(); state.activeDeckId = id; render(); };

    document.querySelectorAll('[data-open-deck]').forEach(el=>{
        el.onclick = ()=>{ state.activeDeckId = el.dataset.openDeck; render(); };
    });

    const backBtn = document.getElementById('back-to-decks');
    if(backBtn) backBtn.onclick = ()=>{ state.activeDeckId = null; render(); };

    const deckNameInput = document.getElementById('deck-name-input');
    if(deckNameInput){
        deckNameInput.oninput = (e)=>{
            const deck = state.decks[state.activeDeckId];
            deck.name = e.target.value;
            saveDecks();
        };
    }

    const deleteDeckBtn = document.getElementById('delete-deck-btn');
    if(deleteDeckBtn){
        deleteDeckBtn.onclick = ()=>{
            if(confirm('¿Eliminar este mazo? Esta acción no se puede deshacer.')){
                delete state.decks[state.activeDeckId];
                saveDecks();
                state.activeDeckId = null;
                render();
            }
        };
    }

    document.querySelectorAll('.add-to-deck').forEach(btn=>{
        btn.onclick = ()=>{
            const card = JSON.parse(btn.dataset.card);
            const deck = state.decks[state.activeDeckId];
            if(!deck) return;
            deck._cache = deck._cache || {};
            deck._cache[card.id] = card;
            setDeckCardQty(deck, card, deckCardQty(deck, card.id) + 1);
            render();
        };
    });
    document.querySelectorAll('.deck-inc').forEach(btn=>{
        btn.onclick = ()=>{
            const card = JSON.parse(btn.dataset.card);
            const deck = state.decks[state.activeDeckId];
            setDeckCardQty(deck, card, deckCardQty(deck, card.id) + 1);
            render();
        };
    });
    document.querySelectorAll('.deck-dec').forEach(btn=>{
        btn.onclick = ()=>{
            const card = JSON.parse(btn.dataset.card);
            const deck = state.decks[state.activeDeckId];
            setDeckCardQty(deck, card, deckCardQty(deck, card.id) - 1);
            render();
        };
    });
}

/* ============ INIT ============ */
render();
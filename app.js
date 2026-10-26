'use strict';

/* =========================================================
   GORV - ventas, inventario y método AGI
   Dos calidades (normal y premium) y tres lugares:
   Bodega, Morelos (M) y Carrillo (C).
   Datos guardados en el navegador (localStorage).
   IMPORTANTE: la llave KEY no cambia, así los datos de
   versiones anteriores se conservan.
   ========================================================= */

const KEY = 'richiscaps_v2';
const LOC = { bodega: 'Bodega', M: 'Morelos', C: 'Carrillo' };
const TIPO = { normal: 'Normal', premium: 'Premium' };
const TIPOS = ['normal', 'premium'];
const LOCS = ['bodega', 'M', 'C'];
const KINDS = ['one', 'two', 'prem'];          // tipos de venta: gorra $89 · promo 2 por $170 · premium $185
const KEYK = { n1: 'one', n2: 'two', p: 'prem' };   // apartado de la pantalla Hoy -> tipo de venta

const DEFAULTS = {
  settings: {
    season: 'normal',          // 'normal' | 'alta'
    theme: 'auto',             // 'auto' (el del celular) | 'light' | 'dark'
    low: 5,                    // aviso de inventario bajo (total por calidad)
    prices: {
      normal: { one: 89, two: 170 },
      alta:   { one: 95, two: 180 },
      premium: 185
    },
    // Por gorra vendida: A e I son fijos; G = lo que sobra del precio.
    agi: {
      normal:  { A: 50,  I: 30 },
      premium: { A: 100, I: 60 }
    }
  },
  stock: {
    normal:  { bodega: 0, M: 0, C: 0 },
    premium: { bodega: 0, M: 0, C: 0 }
  },
  costs: { normal: 28, premium: 60 },   // costo promedio por gorra
  sales: [],   // {id,tk,date,loc,kind,k,n,pm,qty,total,A,G,I,cost,season}  kind: one|two|prem · k: cuántas de ese tipo
  buys: [],    // {id,date,type,qty,unitCost,prevCost}
  meta: { lastBackup: null }
};

const clone = o => JSON.parse(JSON.stringify(o));
function merge(base, over) {
  if (typeof base !== 'object' || base === null || Array.isArray(base)) return over === undefined ? base : over;
  const out = {};
  for (const k in base) out[k] = merge(base[k], over ? over[k] : undefined);
  for (const k in (over || {})) if (!(k in out)) out[k] = over[k];
  return out;
}
// Una "línea" de venta: k ventas del mismo tipo. Recibe los datos (d) para poder usarse al cargar.
function lineOf(d, kind, k, season) {
  const pr = d.settings.prices, ag = d.settings.agi, set = pr[season] || pr.normal;
  const n = kind === 'one' ? k : kind === 'two' ? 2 * k : 0, pm = kind === 'prem' ? k : 0;
  const total = kind === 'one' ? k * set.one : kind === 'two' ? k * set.two : k * pr.premium;
  const A = n * ag.normal.A + pm * ag.premium.A, I = n * ag.normal.I + pm * ag.premium.I;
  return { kind, k, n, pm, qty: n + pm, total, A, G: total - A - I, I, cost: n * d.costs.normal + pm * d.costs.premium };
}

// Las ventas guardadas por versiones anteriores eran un solo registro con "n" normales y "pm" premium.
// Aquí se separan en una línea por tipo (gorra $89, promo $170, premium $185) sin cambiar total ni inventario.
function upgrade(d) {
  if (!d.sales.some(s => !s.kind)) return d;
  d.sales = d.sales.flatMap(s => {
    if (s.kind) return [s];
    const n = s.n || 0, pm = s.pm || 0, season = s.season || 'normal';
    const parts = [['one', n % 2], ['two', Math.floor(n / 2)], ['prem', pm]].filter(p => p[1] > 0);
    if (!parts.length) return [s];
    const lines = parts.map(([kind, k]) => lineOf(d, kind, k, season));
    const diff = (s.total || 0) - lines.reduce((a, l) => a + l.total, 0);   // por si cambiaste precios después
    lines[0].total += diff; lines[0].G += diff;
    return lines.map((l, i) => ({ ...l, id: s.id + (i ? 'abc'[i] : ''), tk: s.id, date: s.date, loc: s.loc, season }));
  });
  return d;
}

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY));
    if (raw) return upgrade(merge(clone(DEFAULTS), raw));
  } catch (e) {}
  return clone(DEFAULTS);
}
let S = load();
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(S)); }
  catch (e) { toast('No se pudo guardar. Descarga un respaldo ya.'); }
}
// pide al navegador que no borre los datos si el celular se queda sin espacio
if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});

/* ---------- utilidades ---------- */
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money = n => '$' + (Math.round(n * 100) / 100).toLocaleString('es-MX');
const pad = n => String(n).padStart(2, '0');
const fmt = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const todayStr = () => fmt(new Date());
const parseD = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const monthKey = s => s.slice(0, 7);
const MES = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
const MESL = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const DIAS = ['dom','lun','mar','mié','jue','vie','sáb'];
const monthLabel = k => { const [y, m] = k.split('-'); return `${MES[m - 1]} ${y}`; };
const monthLong = k => { const [y, m] = k.split('-'); return `${MESL[m - 1]} ${y}`; };
const addMonth = (k, d) => { const [y, m] = k.split('-').map(Number), t = new Date(y, m - 1 + d, 1); return `${t.getFullYear()}-${pad(t.getMonth() + 1)}`; };
const short = n => n >= 1000 ? '$' + (Math.round(n / 100) / 10).toLocaleString('es-MX') + 'k' : '$' + Math.round(n);
const dateLabel = s => { const d = parseD(s); return `${d.getDate()} ${MES[d.getMonth()]} ${d.getFullYear()}`; };
const longDate = s => { const d = parseD(s); return `${DIAS[d.getDay()]} ${d.getDate()} ${MES[d.getMonth()]}`; };
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const num = id => parseFloat($(id).value) || 0;
const tot = t => S.stock[t].bodega + S.stock[t].M + S.stock[t].C;
const plural = (n, a, b) => n === 1 ? a : b;

let toastTimer;
function toast(msg, act) {
  const t = $('#toast');
  t.innerHTML = esc(msg) + (act ? ` <button onclick="${act.fn}">${act.label}</button>` : '');
  t.style.pointerEvents = act ? 'auto' : 'none';
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), act ? 6000 : 2400);
}

/* ---------- cálculo de venta + AGI ---------- */
// Cada tipo de venta se calcula aparte (ver lineOf): gorra $89, promo 2 por $170 y premium $185.
// Ahorro e Inversión son fijos por gorra; la Ganancia es lo que sobra del precio.
const line = (kind, k) => lineOf(S, kind, k, S.settings.season);

const Z = ()=> ({ qty: 0, total: 0, A: 0, G: 0, I: 0, cost: 0 });
function sum(list) {
  return list.reduce((a, s) => {
    a.qty += s.qty; a.total += s.total; a.A += s.A; a.G += s.G; a.I += s.I; a.cost += s.cost || 0;
    return a;
  }, Z());
}
function agg(keyFn) {
  const m = {};
  S.sales.forEach(s => {
    const k = keyFn(s.date), o = m[k] || (m[k] = Z());
    o.qty += s.qty; o.total += s.total; o.A += s.A; o.G += s.G; o.I += s.I; o.cost += s.cost || 0;
  });
  return m;
}

/* ---------- estado de pantalla ---------- */
const TITLES = { hoy: 'Hoy', panel: 'Panel', stock: 'Inventario', ventas: 'Ventas', ajustes: 'Ajustes' };
let tab = 'hoy', saleLoc = 'M', saleDate = null;     // saleDate null = hoy
let cart1 = 0, cart2 = 0, cartP = 0;                 // ticket en curso: gorras $89, promos de 2, premium
let pmo = null;                                      // mes que muestra el panel (null = el mes actual)
let hist = { loc: 'all', month: 'all', limit: 30 };  // ventas
const curDate = () => saleDate || todayStr();

/* Barra de abajo: una burbuja de cristal (.lens) se desliza hasta la sección elegida */
const TAB_ORDER = ['hoy', 'panel', 'stock', 'ventas', 'ajustes'];
const nav = $('nav'), lens = document.createElement('span');
lens.className = 'lens'; lens.setAttribute('aria-hidden', 'true'); nav.prepend(lens);

function go(t) {
  const prev = tab, changed = t !== tab;
  tab = t; render(); window.scrollTo(0, 0);
  if (changed) {
    const v = $('#view');              // la pantalla entra desde el lado hacia el que te mueves
    v.style.setProperty('--dx', (TAB_ORDER.indexOf(t) > TAB_ORDER.indexOf(prev) ? 26 : -26) + 'px');
    v.classList.remove('enter'); void v.offsetWidth; v.classList.add('enter');
    lens.classList.remove('move'); void lens.offsetWidth; lens.classList.add('move');   // la burbuja se estira al viajar
  }
}
const buzz = ms => { try { if (navigator.vibrate) navigator.vibrate(ms); } catch (e) {} };   // vibración corta al cobrar
function render() {
  applyTheme();                         // también al restaurar un respaldo o borrar todo
  document.querySelectorAll('nav button').forEach(b => b.classList.toggle('on', b.dataset.t === tab));
  nav.style.setProperty('--i', TAB_ORDER.indexOf(tab));
  $('#title').textContent = TITLES[tab];
  $('#subtitle').textContent = longDate(todayStr());
  $('#view').innerHTML = VIEWS[tab]();
  renderTicket();
  updateNet();
}
function updateNet() {
  const n = $('#netBadge');
  if (n) n.hidden = navigator.onLine !== false;
}

/* ---------- componentes ---------- */
function agiLine(o) {
  return `<span class="agi"><i class="a"></i>${money(o.A)}<i class="g"></i>${money(o.G)}<i class="i"></i>${money(o.I)}</span>`;
}
function donut(o) {
  const segs = [[o.A, 'var(--A)'], [o.G, 'var(--G)'], [o.I, 'var(--I)']];
  const t = Math.max(segs.reduce((a, s) => a + Math.max(0, s[0]), 0), 1);
  let off = 25;
  const rings = segs.map(([v, c]) => {
    const p = Math.max(0, v) / t * 100;
    const el = p ? `<circle cx="21" cy="21" r="15.9155" fill="none" stroke="${c}" stroke-width="5" stroke-dasharray="${p} ${100 - p}" stroke-dashoffset="${off}"/>` : '';
    off -= p; return el;
  }).join('');
  return `<svg class="donut" viewBox="0 0 42 42" role="img" aria-label="Reparto Ahorro, Ganancia e Inversión">
    <circle cx="21" cy="21" r="15.9155" fill="none" stroke="rgba(255,255,255,.14)" stroke-width="5"/>${rings}
    <text x="21" y="21" text-anchor="middle" dominant-baseline="central" font-size="8" font-weight="900" font-style="italic" fill="#fff">${o.qty}</text>
    <text x="21" y="28" text-anchor="middle" font-size="3" fill="#b8bbc2">gorras</text></svg>`;
}
const locOptions = sel => LOCS.map(l => `<option value="${l}" ${l === sel ? 'selected' : ''}>${LOC[l]}</option>`).join('');
const tipoOptions = () => TIPOS.map(t => `<option value="${t}">${TIPO[t]}</option>`).join('');
const acc = (title, body) => `<details class="acc"><summary>${title}</summary><div class="accb">${body}</div></details>`;

/* Iconos de las 3 categorías: gorra $89, promo 2 por $170 y premium $185 */
const CAP = '<path d="M11 33C11 19 20 10 32 10c11 0 18 8 19 21"/><path d="M32 10c-4 6-5 15-3 23"/><path d="M8 33h43c6 0 10 3 11 6-7 2-38 2-54-1z"/><circle cx="32" cy="9" r="1.6" fill="currentColor" stroke="none"/>';
const SVG = b => `<svg viewBox="0 0 64 48" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${b}</svg>`;
const ICONS = {
  one: SVG(CAP),
  two: SVG(`<g transform="translate(12 -2) scale(.7)" opacity=".5">${CAP}</g><g transform="translate(-1 11) scale(.82)">${CAP}</g>`),
  prem: SVG(`<g transform="translate(0 6) scale(.9)">${CAP}</g><path d="M53 3l1.7 4.6L59 9.3l-4.3 1.7L53 15.6l-1.7-4.6L47 9.3l4.3-1.7z" fill="currentColor" stroke-width="1.6"/><path d="M60 19l.9 2.2 2.1.9-2.1.9L60 25.2l-.9-2.2-2.1-.9 2.1-.9z" fill="currentColor" stroke-width="1"/>`)
};
const tile = (kind, sm) => `<span class="tile t-${ICONS[kind] ? kind : 'one'}${sm ? ' sm' : ''}">${ICONS[kind] || ICONS.one}</span>`;

function saleName(s) {
  const u = s.k ? s.total / s.k : s.total, x = s.k > 1 ? s.k + ' × ' : '';
  if (s.kind === 'two') return `${x}Promo 2 por ${money(u)}`;
  if (s.kind === 'prem') return `${x}Premium ${money(u)}`;
  return `${x}Gorra ${money(u)}`;
}

/* =========================================================
   PANTALLA: HOY  (registrar ventas con ticket)
   Tres apartados separados: gorra $89, promo 2 por $170 y premium $185.
   ========================================================= */
function clampCart() {                      // el ticket nunca pasa de lo que hay en el local
  const hN = S.stock.normal[saleLoc], hP = S.stock.premium[saleLoc];
  cart1 = Math.min(cart1, hN);
  cart2 = Math.min(cart2, Math.floor((hN - cart1) / 2));
  cartP = Math.min(cartP, hP);
}
const room = key => {                       // cuántas más se pueden agregar de ese apartado
  const left = S.stock.normal[saleLoc] - cart1 - 2 * cart2;
  return key === 'n1' ? left : key === 'n2' ? Math.floor(left / 2) : S.stock.premium[saleLoc] - cartP;
};
const cartLines = () => [['one', cart1], ['two', cart2], ['prem', cartP]]
  .filter(x => x[1] > 0).map(([kd, k]) => line(kd, k));

function hoy() {
  const st = S.settings, pr = st.prices, set = pr[st.season];
  const d = curDate();
  const daySales = S.sales.filter(s => s.date === d);
  const dayAll = sum(daySales);
  const mine = daySales.filter(s => s.loc === saleLoc).sort((a, b) => b.id.localeCompare(a.id));
  const other = saleLoc === 'M' ? 'C' : 'M';
  const haveN = S.stock.normal[saleLoc], haveP = S.stock.premium[saleLoc];
  clampCart();

  const prod = (key, name, desc, stockTxt, out, n) => `
    <div class="prod ${key}">
      ${tile(KEYK[key])}
      <div class="pi"><b>${name}</b><span>${desc}</span></div>
      <div class="pr">
        <small class="${out ? 'out' : ''}">${stockTxt}</small>
        <div class="step">
          <button aria-label="Quitar ${name}" onclick="cart('${key}',-1)" ${n < 1 ? 'disabled' : ''}>−</button>
          <b class="num">${n}</b>
          <button class="plus" aria-label="Agregar ${name}" onclick="cart('${key}',1)" ${room(key) < 1 ? 'disabled' : ''}>+</button>
        </div>
      </div>
      <div class="pg"><span>Reparto de cada una</span>${agiLine(line(KEYK[key], 1))}</div>
    </div>`;

  const rows = mine.length ? mine.map(s => `
    <div class="srow">${tile(s.kind, true)}<div><b>${saleName(s)}</b><small>${agiLine(s)}</small></div>
      <span class="amt num">${money(s.total)}</span>
      <button class="x" aria-label="Borrar venta" onclick="delSale('${s.id}')">✕</button></div>`).join('')
    : '<p class="empty">Aún no hay ventas en este local. Agrega gorras al ticket para empezar.</p>';

  return `
    <section class="hero ${saleLoc}">
      <div class="locs">
        <button class="${saleLoc === 'M' ? 'on' : ''}" onclick="setLoc('M')">Morelos</button>
        <button class="${saleLoc === 'C' ? 'on' : ''}" onclick="setLoc('C')">Carrillo</button>
      </div>
      <p class="hl">${saleDate ? 'Ventas del ' + dateLabel(saleDate) : 'Registrado hoy'}</p>
      <div class="big num">${money(dayAll.total)}</div>
      <p class="hs">${dayAll.qty} ${plural(dayAll.qty, 'gorra', 'gorras')} · aquí ${money(sum(mine).total)}, en ${LOC[other]} ${money(sum(daySales.filter(s => s.loc === other)).total)}</p>
    </section>

    ${saleDate ? `<div class="alert red"><b>Estás registrando un día anterior.</b>
      <button class="ghost" onclick="setDate('')">Volver a hoy</button></div>` : ''}

    <section class="sheet">
      <div class="season">
        <span>Precios de</span>
        <div class="pills">
          <button class="${st.season === 'normal' ? 'on' : ''}" onclick="setSeason('normal')">Temporada normal</button>
          <button class="${st.season === 'alta' ? 'on' : ''}" onclick="setSeason('alta')">Temporada alta</button>
        </div>
      </div>
      <h2 class="ask">¿Qué se vendió en ${LOC[saleLoc]}?</h2>
      ${prod('n1', `Gorra ${money(set.one)}`, '1 gorra normal',
        haveN < 1 ? 'Sin existencias en ' + LOC[saleLoc] : `Quedan ${haveN} normales en ${LOC[saleLoc]}`, haveN < 1, cart1)}
      ${prod('n2', `Promo ${money(set.two)}`, `2 gorras normales · ahorras ${money(2 * set.one - set.two)}`,
        haveN < 2 ? 'Sin existencias en ' + LOC[saleLoc] : `Alcanza para ${Math.floor(haveN / 2)} ${plural(Math.floor(haveN / 2), 'promo', 'promos')}`, haveN < 2, cart2)}
      ${prod('p', `Premium ${money(pr.premium)}`, '1 gorra premium',
        haveP < 1 ? 'Sin existencias en ' + LOC[saleLoc] : `Quedan ${haveP} en ${LOC[saleLoc]}`, haveP < 1, cartP)}
    </section>

    <section class="list">
      <h2>Registrado ${saleDate ? '' : 'hoy '}en ${LOC[saleLoc]}</h2>
      ${rows}
    </section>

    ${acc('Registrar ventas de otro día', `<input type="date" value="${curDate()}" max="${todayStr()}" onchange="setDate(this.value)">`)}`;
}

function renderTicket() {
  const t = $('#ticket');
  const caps = cart1 + 2 * cart2 + cartP;
  document.body.classList.toggle('tk', tab === 'hoy' && caps > 0);
  if (tab !== 'hoy' || caps === 0) { t.hidden = true; t.innerHTML = ''; return; }
  const set = S.settings.prices[S.settings.season];
  const total = cartLines().reduce((a, l) => a + l.total, 0);
  const parts = [];
  if (cart1) parts.push(`${cart1} × ${money(set.one)}`);
  if (cart2) parts.push(`${cart2} ${plural(cart2, 'promo', 'promos')}`);
  if (cartP) parts.push(`${cartP} premium`);
  t.hidden = false;
  t.className = saleLoc;
  t.innerHTML = `<div class="tkd">${LOC[saleLoc]} · ${parts.join(' + ')}</div>
    <div class="tkinfo"><b class="num">${money(total)}</b></div>
    <button class="vac" aria-label="Vaciar ticket" onclick="clearCart()">Vaciar</button>
    <button class="cobrar" onclick="cobrar()">Cobrar</button>`;
}

/* =========================================================
   PANTALLA: PANEL  (solo meses)
   Un mes a la vez, con el AGI de cada tipo de venta,
   en total y por local (Morelos y Carrillo).
   ========================================================= */
const curMo = () => pmo || monthKey(todayStr());

const chips = o => `<div class="chips">
    <div class="cA"><small>Ahorro</small><b class="num">${money(o.A)}</b></div>
    <div class="cG"><small>Ganancia</small><b class="num">${money(o.G)}</b></div>
    <div class="cI"><small>Inversión</small><b class="num">${money(o.I)}</b></div></div>`;

function kindName(kind, ks) {               // "Gorra $89", "Promo 2 gorras $170", "Premium $185"
  const pr = S.settings.prices, set = pr[S.settings.season];
  const cur = kind === 'one' ? set.one : kind === 'two' ? set.two : pr.premium;
  const us = ks.length ? [...new Set(ks.map(s => s.total / s.k))].sort((a, b) => a - b) : [cur];
  const price = us.length > 1 ? `${money(us[0])}–${money(us[us.length - 1])}` : money(us[0]);
  return { one: 'Gorra', two: 'Promo 2 gorras', prem: 'Premium' }[kind] + ' ' + price;
}

function kindBlock(kind, list, sc) {
  const ks = list.filter(s => s.kind === kind), o = sum(ks), units = ks.reduce((a, s) => a + (s.k || 0), 0);
  const sub = !units ? 'Sin ventas' : kind === 'two'
    ? `${units} ${plural(units, 'promo', 'promos')} · ${o.qty} gorras`
    : `${units} ${plural(units, 'vendida', 'vendidas')}`;
  return `<div class="kind ${units ? '' : 'zero'}" data-scope="${sc}" data-kind="${kind}">
    <div class="kh">${tile(kind, true)}<div><b>${kindName(kind, ks)}</b><small>${sub}</small></div><span class="amt num">${money(o.total)}</span></div>
    ${chips(o)}</div>`;
}

function scope(sc, title, list, withTotals) {
  const o = sum(list);
  return `<section class="list scope" data-scope="${sc}">
    <div class="sch"><h2 class="${sc === 'all' ? '' : 'l' + sc}">${title}</h2><span class="amt num">${money(o.total)}</span></div>
    <p class="scs">${o.qty} ${plural(o.qty, 'gorra', 'gorras')} · margen ${money(o.total - o.cost)}</p>
    ${withTotals ? chips(o) : ''}
    ${KINDS.map(k => kindBlock(k, list, sc)).join('')}
  </section>`;
}

function chartMonths(sel) {                 // últimos 6 meses; el elegido va en negro
  const now = monthKey(todayStr()), months = [];
  for (let i = 5; i >= 0; i--) months.push(addMonth(now, -i));
  const map = agg(monthKey), vals = months.map(k => (map[k] || Z()).total);
  const max = Math.max(...vals, 1);
  return `<div class="chart">` + months.map((k, i) =>
    `<button class="col ${k === sel ? 'sel' : ''}" onclick="setMonth('${k}')" aria-label="${monthLong(k)}: ${money(vals[i])}">` +
    `${vals[i] ? `<b>${short(vals[i])}</b>` : ''}<i style="height:${vals[i] / max * 78}%"></i>` +
    `<small>${MES[+k.slice(5) - 1]}</small></button>`).join('') + `</div>`;
}

function panel() {
  const now = monthKey(todayStr()), mo = curMo();
  const firstSale = S.sales.reduce((m, s) => monthKey(s.date) < m ? monthKey(s.date) : m, now);
  const list = S.sales.filter(s => monthKey(s.date) === mo), o = sum(list);
  const low = TIPOS.filter(t => tot(t) <= S.settings.low);

  const lb = S.meta.lastBackup;
  const days = lb ? Math.floor((Date.now() - lb) / 86400000) : null;
  const backupWarn = S.sales.length && (days === null || days >= 7)
    ? `<div class="alert red"><span><b>Haz un respaldo.</b> ${days === null ? 'Aún no has descargado ninguno.' : `El último fue hace ${days} días.`} Si se borra el navegador, pierdes todo.</span>
        <button class="ghost" onclick="exportData()">Descargar</button></div>` : '';
  const lowWarn = low.length
    ? `<div class="alert"><span><b>Poco inventario:</b> ${low.map(t => `${TIPO[t]} (${tot(t)})`).join(', ')}.</span>
        <button class="ghost" onclick="go('stock')">Ver</button></div>` : '';

  const mp = o.total - o.cost;
  const map = agg(monthKey), keys = Object.keys(map).sort().reverse().slice(0, 24);
  const months = keys.length ? keys.map(k => { const p = map[k];
    return `<button class="srow mrow ${k === mo ? 'sel' : ''}" onclick="setMonth('${k}')">
      <div><b>${monthLong(k)}</b><small>${p.qty} ${plural(p.qty, 'gorra', 'gorras')} · ${agiLine(p)}</small></div>
      <span class="amt num">${money(p.total)}</span></button>`;
  }).join('') : '<p class="empty">Cuando registres ventas, aquí verás cada mes.</p>';

  return `
    ${backupWarn}${lowWarn}
    <div class="monthnav">
      <button class="mn" aria-label="Mes anterior" onclick="shiftMonth(-1)" ${mo <= firstSale ? 'disabled' : ''}>‹</button>
      <div class="mt"><b id="monthName">${monthLong(mo)}</b>
        ${mo === now ? '<small>Mes actual</small>' : `<button class="link" onclick="setMonth('${now}')">Ir al mes actual</button>`}</div>
      <button class="mn" aria-label="Mes siguiente" onclick="shiftMonth(1)" ${mo >= now ? 'disabled' : ''}>›</button>
    </div>

    <section class="hero dark">
      <div class="hleft">
        <p class="hl">Ingresos del mes</p>
        <div class="big num">${money(o.total)}</div>
        <div class="lg">
          <span><i class="a"></i>Ahorro <b>${money(o.A)}</b></span>
          <span><i class="g"></i>Ganancia <b>${money(o.G)}</b></span>
          <span><i class="i"></i>Inversión <b>${money(o.I)}</b></span>
        </div>
      </div>
      ${donut(o)}
    </section>
    ${list.length ? '' : '<p class="empty">No hay ventas registradas en este mes.</p>'}
    <button class="sharebtn" onclick="openSummary()">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 15V4M8 8l4-4 4 4M5 12v7a1 1 0 001 1h12a1 1 0 001-1v-7"/></svg>
      Compartir resumen del mes</button>

    <section class="list"><h2>Margen del mes</h2>
      <div class="kv"><span>Ingresos</span><b class="num">${money(o.total)}</b></div>
      <div class="kv"><span>Costo de las gorras vendidas</span><b class="num">${money(o.cost)}</b></div>
      <div class="kv total"><span>Margen bruto${o.total ? ` (${Math.round(mp / o.total * 100)}%)` : ''}</span><b class="num">${money(mp)}</b></div>
    </section>

    ${scope('all', 'AGI por tipo de venta', list, false)}
    ${scope('M', 'Morelos', list.filter(s => s.loc === 'M'), true)}
    ${scope('C', 'Carrillo', list.filter(s => s.loc === 'C'), true)}

    <section class="list"><h2>Últimos 6 meses</h2>${chartMonths(mo)}</section>

    <section class="list"><h2>Cada mes</h2>${months}</section>`;
}

/* =========================================================
   PANTALLA: INVENTARIO
   ========================================================= */
function stock() {
  const card = t => {
    const s = S.stock[t], T = tot(t), isLow = T <= S.settings.low, mx = Math.max(s.bodega, s.M, s.C, 1);
    return `<section class="sk ${isLow ? 'low' : ''}">
      <div class="skh"><div><h2>${TIPO[t]}</h2><div class="big num">${T}</div></div>
        ${isLow ? '<span class="pill red">Poco inventario</span>' : ''}</div>
      ${LOCS.map(l => `<div class="loc"><span class="${l === 'bodega' ? '' : 'l' + l}">${LOC[l]}</span>
        <div class="meter"><i class="m${l}" style="width:${s[l] / mx * 100}%"></i></div><b class="num">${s[l]}</b></div>`).join('')}
      <p class="sub">Costo promedio ${money(S.costs[t])} por gorra</p></section>`;
  };

  const recent = S.buys.length ? `<h3>Últimas compras</h3>` + [...S.buys].reverse().slice(0, 5).map((b, i) => `
    <div class="srow"><div><b>${b.qty} ${TIPO[b.type].toLowerCase()}${b.qty === 1 ? '' : 's'}</b>
      <small>${dateLabel(b.date)} · ${money(b.unitCost)} c/u</small></div>
      ${i === 0 ? `<button class="ghost danger" onclick="undoBuy()">Deshacer</button>` : ''}</div>`).join('') : '';

  const fix = t => `<h3>${TIPO[t]}</h3><div class="grid3">
    ${LOCS.map(l => `<div><label>${LOC[l]}</label><input id="c_${t}_${l}" type="number" inputmode="numeric" value="${S.stock[t][l]}"></div>`).join('')}</div>`;

  return `
    ${card('normal')}${card('premium')}
    ${acc('Mover gorras entre lugares', `
      <p class="sub">Por ejemplo, de Bodega a Morelos cuando surtes el local.</p>
      <label>Calidad</label><select id="mvT">${tipoOptions()}</select>
      <div class="grid2">
        <div><label>De</label><select id="mvFrom">${locOptions('bodega')}</select></div>
        <div><label>A</label><select id="mvTo">${locOptions('M')}</select></div>
      </div>
      <label>Cantidad</label><input id="mvQty" type="number" inputmode="numeric" placeholder="0">
      <button class="primary" onclick="mover()">Mover</button>`)}
    ${acc('Registrar una compra', `
      <p class="sub">Las gorras entran a Bodega y se actualiza el costo promedio.</p>
      <label>Calidad</label><select id="buyT">${tipoOptions()}</select>
      <div class="grid2">
        <div><label>Cantidad</label><input id="buyQty" type="number" inputmode="numeric" placeholder="0"></div>
        <div><label>Costo por gorra</label><input id="buyCost" type="number" inputmode="decimal" placeholder="28"></div>
      </div>
      <button class="primary" onclick="comprar()">Guardar compra</button>${recent}`)}
    ${acc('Corregir conteo', `
      <p class="sub">Escribe lo que realmente tienes en cada lugar.</p>
      ${fix('normal')}${fix('premium')}
      <button class="primary" onclick="corregir()">Guardar conteo</button>`)}`;
}

/* =========================================================
   PANTALLA: VENTAS (historial por día)
   ========================================================= */
function setHist(k, v) { hist[k] = v; hist.limit = 30; render(); }
function moreHist() { hist.limit += 30; render(); }

function ventas() {
  const all = [...S.sales].sort((a, b) => (b.date + b.id).localeCompare(a.date + a.id));
  if (!all.length) return '<p class="empty big-empty">Aún no hay ventas. Cuando cobres la primera en Hoy, aparecerá aquí.</p>';
  const months = [...new Set(all.map(s => monthKey(s.date)))];
  const sales = all.filter(s => (hist.loc === 'all' || s.loc === hist.loc) && (hist.month === 'all' || monthKey(s.date) === hist.month));
  const dayTot = {};
  sales.forEach(s => { const o = dayTot[s.date] || (dayTot[s.date] = { total: 0, qty: 0 }); o.total += s.total; o.qty += s.qty; });
  const all2 = sum(sales);

  const head = `<div class="filters">
      <div><label>Local</label><select onchange="setHist('loc',this.value)">
        <option value="all">Todos</option>
        <option value="M" ${hist.loc === 'M' ? 'selected' : ''}>Morelos</option>
        <option value="C" ${hist.loc === 'C' ? 'selected' : ''}>Carrillo</option></select></div>
      <div><label>Mes</label><select onchange="setHist('month',this.value)">
        <option value="all">Todos</option>
        ${months.map(m => `<option value="${m}" ${hist.month === m ? 'selected' : ''}>${monthLabel(m)}</option>`).join('')}</select></div>
    </div>
    <p class="sum"><span>${sales.length} ${plural(sales.length, 'venta', 'ventas')} · ${all2.qty} gorras</span><b class="num">${money(all2.total)}</b></p>`;
  if (!sales.length) return head + '<p class="empty">No hay ventas con ese filtro. Cambia el local o el mes.</p>';

  let html = '', last = '';
  sales.slice(0, hist.limit).forEach(s => {
    if (s.date !== last) {
      html += `<div class="dayh"><b>${longDate(s.date)}</b><span class="num">${money(dayTot[s.date].total)}</span></div>`;
      last = s.date;
    }
    html += `<div class="srow">${tile(s.kind, true)}
      <div><b>${saleName(s)}</b><small class="meta"><span class="l${s.loc}">${LOC[s.loc] || ''}</span>${agiLine(s)}</small></div>
      <span class="amt num">${money(s.total)}</span>
      <button class="x" aria-label="Borrar venta" onclick="delSale('${s.id}')">✕</button></div>`;
  });
  const more = sales.length > hist.limit
    ? `<button class="primary" onclick="moreHist()">Ver más (${sales.length - hist.limit} restantes)</button>` : '';
  return head + html + more;
}

/* =========================================================
   PANTALLA: AJUSTES
   ========================================================= */
function ajustes() {
  const st = S.settings, p = st.prices;
  const gN = p.normal.one - st.agi.normal.A - st.agi.normal.I;
  const gP = p.premium - st.agi.premium.A - st.agi.premium.I;
  return `
    <section class="list"><h2>Apariencia</h2>
      <div class="pills" role="group" aria-label="Tema">
        ${[['auto', 'Automático'], ['light', 'Claro'], ['dark', 'Oscuro']].map(([v, l]) =>
          `<button class="${st.theme === v ? 'on' : ''}" onclick="setTheme('${v}')">${l}</button>`).join('')}
      </div>
      <p class="sub">Automático usa el modo claro u oscuro de tu celular.</p>
    </section>
    <section class="list"><h2>Precios de venta</h2>
      <div class="grid2">
        <div><label>Normal: 1 gorra</label><input id="n1" type="number" inputmode="decimal" value="${p.normal.one}"></div>
        <div><label>Normal: 2 gorras</label><input id="n2" type="number" inputmode="decimal" value="${p.normal.two}"></div>
        <div><label>Temp. alta: 1 gorra</label><input id="a1" type="number" inputmode="decimal" value="${p.alta.one}"></div>
        <div><label>Temp. alta: 2 gorras</label><input id="a2" type="number" inputmode="decimal" value="${p.alta.two}"></div>
      </div>
      <label>Premium (1 gorra)</label><input id="pp" type="number" inputmode="decimal" value="${p.premium}">
    </section>
    <section class="list"><h2>Método AGI por gorra</h2>
      <p class="sub">Ahorro e Inversión son fijos. La Ganancia es lo que sobra del precio de venta.
        Con tus montos actuales sobran ${money(gN)} en una normal y ${money(gP)} en una premium.</p>
      <div class="grid2">
        <div><label>Normal: Ahorro</label><input id="nA" type="number" inputmode="decimal" value="${st.agi.normal.A}"></div>
        <div><label>Normal: Inversión</label><input id="nI" type="number" inputmode="decimal" value="${st.agi.normal.I}"></div>
        <div><label>Premium: Ahorro</label><input id="pA" type="number" inputmode="decimal" value="${st.agi.premium.A}"></div>
        <div><label>Premium: Inversión</label><input id="pI" type="number" inputmode="decimal" value="${st.agi.premium.I}"></div>
      </div>
      <label>Avisar inventario bajo desde (gorras en total por calidad)</label>
      <input id="low" type="number" inputmode="numeric" value="${st.low}">
      <button class="primary" onclick="saveSettings()">Guardar ajustes</button>
    </section>
    <section class="list"><h2>Tus datos</h2>
      <p class="sub">Viven en este celular. Descarga un respaldo de vez en cuando.</p>
      <div class="btns">
        <button class="ghost" onclick="exportData()">Descargar respaldo</button>
        <button class="ghost" onclick="exportCSV()">Ventas a Excel (CSV)</button>
        <button class="ghost" onclick="$('#importFile').click()">Restaurar respaldo</button>
        <button class="ghost danger" onclick="resetAll()">Borrar todo</button>
      </div>
    </section>`;
}

const VIEWS = { hoy, panel, stock, ventas, ajustes };

/* ---------- acciones: ticket y venta ---------- */
function setSeason(v) { S.settings.season = v; save(); render(); }
// Tema: 'auto' sigue al celular. index.html ya lo aplica antes de pintar; aquí se mantiene al día.
const darkMQ = matchMedia('(prefers-color-scheme: dark)');
function applyTheme() {
  const t = S.settings.theme, dark = t === 'dark' || (t !== 'light' && darkMQ.matches);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  document.querySelector('meta[name="theme-color"]').content = dark ? '#0e0d13' : '#ffffff';
}
darkMQ.addEventListener('change', applyTheme);
function setTheme(v) { S.settings.theme = v; save(); render(); }
function setLoc(l) { saleLoc = l; cart1 = cart2 = cartP = 0; render(); }
function setDate(v) {
  if (v > todayStr()) { toast('No puedes registrar ventas de días futuros'); v = ''; }
  saleDate = (!v || v === todayStr()) ? null : v; render();
}
function setMonth(k) {                    // panel: elegir un mes (no se puede pasar del mes actual)
  const now = monthKey(todayStr());
  if (k > now) return;
  pmo = k === now ? null : k; render(); window.scrollTo(0, 0);
}
function shiftMonth(d) { setMonth(addMonth(curMo(), d)); }

function cart(key, d) {
  if (key === 'n1') cart1 = Math.max(0, cart1 + d);
  else if (key === 'n2') cart2 = Math.max(0, cart2 + d);
  else cartP = Math.max(0, cartP + d);
  clampCart(); render();
  const b = document.querySelector(`.prod.${key} .step b`);
  if (b) b.classList.add('pop');
}
function clearCart() { cart1 = cart2 = cartP = 0; render(); }

function cobrar() {
  const lines = cartLines();
  if (!lines.length) return;
  const needN = lines.reduce((a, l) => a + l.n, 0), needP = lines.reduce((a, l) => a + l.pm, 0);
  if (S.stock.normal[saleLoc] < needN) return toast(`No hay suficientes normales en ${LOC[saleLoc]}`);
  if (S.stock.premium[saleLoc] < needP) return toast(`No hay suficientes premium en ${LOC[saleLoc]}`);
  const tk = uid(), date = curDate(), season = S.settings.season;
  lines.forEach((l, i) => S.sales.push({ ...l, id: tk + i, tk, date, loc: saleLoc, season }));   // un registro por tipo
  S.stock.normal[saleLoc] -= needN; S.stock.premium[saleLoc] -= needP;
  const total = lines.reduce((a, l) => a + l.total, 0);
  cart1 = cart2 = cartP = 0;
  save(); render(); buzz(18);
  toast(`Cobrado ${money(total)} · ${LOC[saleLoc]}`, { label: 'Deshacer', fn: `undoSale('${tk}')` });
}

function removeSale(id) {
  const s = S.sales.find(x => x.id === id);
  if (!s) return false;
  if (S.stock.normal[s.loc] !== undefined) { S.stock.normal[s.loc] += s.n; S.stock.premium[s.loc] += s.pm; }
  S.sales = S.sales.filter(x => x.id !== id);
  save();
  return true;
}
function undoSale(tk) {                    // deshace todo el ticket (todos sus tipos)
  const ids = S.sales.filter(s => s.tk === tk || s.id === tk).map(s => s.id);
  if (!ids.length) return;
  ids.forEach(id => removeSale(id));
  buzz(10); toast('Venta deshecha'); render();
}
function delSale(id) {
  if (!confirm('¿Borrar esta venta? Las gorras regresan al inventario del local.')) return;
  removeSale(id); render();
}

/* ---------- acciones: inventario ---------- */
function mover() {
  const t = $('#mvT').value, from = $('#mvFrom').value, to = $('#mvTo').value, q = Math.floor(num('#mvQty'));
  if (from === to) return toast('Elige lugares distintos');
  if (q < 1) return toast('Escribe cuántas gorras');
  if (q > S.stock[t][from]) return toast(`Solo hay ${S.stock[t][from]} en ${LOC[from]}`);
  S.stock[t][from] -= q; S.stock[t][to] += q;
  save(); toast(`${q} ${TIPO[t].toLowerCase()} a ${LOC[to]}`); render();
}

function comprar() {
  const t = $('#buyT').value, q = Math.floor(num('#buyQty')), uc = num('#buyCost');
  if (q < 1) return toast('Escribe cuántas gorras compraste');
  if (uc <= 0) return toast('Escribe el costo por gorra');
  const have = tot(t), prevCost = S.costs[t];
  S.costs[t] = Math.round(((have * S.costs[t] + q * uc) / (have + q)) * 100) / 100; // costo promedio
  S.stock[t].bodega += q;
  S.buys.push({ id: uid(), date: todayStr(), type: t, qty: q, unitCost: uc, prevCost });
  save(); toast(`+${q} ${TIPO[t].toLowerCase()} en Bodega`); render();
}

function undoBuy() {                       // solo la última compra
  const b = S.buys[S.buys.length - 1];
  if (!b) return;
  if (S.stock[b.type].bodega < b.qty) return toast('Esas gorras ya salieron de Bodega; usa Corregir conteo');
  if (!confirm(`¿Deshacer la compra de ${b.qty} ${TIPO[b.type].toLowerCase()}? Se restan de Bodega.`)) return;
  S.stock[b.type].bodega -= b.qty;
  if (b.prevCost !== undefined) S.costs[b.type] = b.prevCost;
  S.buys.pop();
  save(); toast('Compra deshecha'); render();
}

function corregir() {
  if (!confirm('Esto reemplaza las existencias actuales con lo que escribiste. ¿Continuar?')) return;
  TIPOS.forEach(t => LOCS.forEach(l => { S.stock[t][l] = Math.max(0, Math.floor(num(`#c_${t}_${l}`))); }));
  save(); toast('Conteo guardado'); render();
}

/* ---------- ajustes y respaldo ---------- */
function saveSettings() {
  const st = S.settings;
  const ids = ['#n1', '#n2', '#a1', '#a2', '#pp', '#nA', '#nI', '#pA', '#pI'];
  if (ids.some(i => num(i) < 0)) return toast('No uses números negativos');
  if (num('#n1') <= 0 || num('#n2') <= 0 || num('#a1') <= 0 || num('#a2') <= 0 || num('#pp') <= 0) return toast('Los precios deben ser mayores a 0');
  if (num('#nA') + num('#nI') > num('#n1') || num('#pA') + num('#pI') > num('#pp'))
    return toast('Ahorro + Inversión no puede pasar del precio de 1 gorra');
  st.prices.normal = { one: num('#n1'), two: num('#n2') };
  st.prices.alta = { one: num('#a1'), two: num('#a2') };
  st.prices.premium = num('#pp');
  st.agi.normal = { A: num('#nA'), I: num('#nI') };
  st.agi.premium = { A: num('#pA'), I: num('#pI') };
  st.low = Math.max(0, Math.floor(num('#low')));
  save(); toast('Ajustes guardados'); render();
}

function download(blob, name) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
function exportData() {
  download(new Blob([JSON.stringify(S, null, 2)], { type: 'application/json' }), `gorv-respaldo-${todayStr()}.json`);
  S.meta.lastBackup = Date.now(); save();
  if (tab === 'panel') render();
}
function exportCSV() {
  if (!S.sales.length) return toast('Aún no hay ventas');
  const KN = { one: 'Gorra', two: 'Promo 2 gorras', prem: 'Premium' };
  const rows = [['Fecha', 'Local', 'Tipo', 'Ventas', 'Gorras', 'Total', 'Ahorro', 'Ganancia', 'Inversion', 'Costo']];
  [...S.sales].sort((a, b) => (a.date + a.id).localeCompare(b.date + b.id)).forEach(s =>
    rows.push([s.date, LOC[s.loc] || s.loc, KN[s.kind] || '', s.k || '', s.qty, s.total, s.A, s.G, s.I, s.cost || 0]));
  download(new Blob(['﻿' + rows.map(r => r.join(',')).join('\n')], { type: 'text/csv;charset=utf-8' }), `gorv-ventas-${todayStr()}.csv`);
}

$('#importFile').addEventListener('change', e => {
  const f = e.target.files[0]; if (!f) return;
  const r = new FileReader();
  r.onload = () => {
    try {
      const d = JSON.parse(r.result);
      if (!d.stock || !d.sales) throw 0;
      if (!confirm('Esto reemplaza los datos actuales. ¿Continuar?')) return;
      S = upgrade(merge(clone(DEFAULTS), d));
      save(); toast('Respaldo restaurado'); render();
    } catch (err) { toast('Archivo no válido'); }
  };
  r.readAsText(f); e.target.value = '';
});

function resetAll() {
  if (!confirm('¿Borrar TODOS los datos de la app?')) return;
  if (!confirm('Esta acción no se puede deshacer. ¿Seguro?')) return;
  S = clone(DEFAULTS); cart1 = cart2 = cartP = 0; save(); render();
}

/* =========================================================
   RESUMEN DEL MES  (imagen lista para mandar por WhatsApp)
   Se dibuja con canvas, sin librerías, y funciona sin internet.
   ========================================================= */
const FONT = '"Helvetica Neue",Helvetica,Arial,sans-serif';
const loadImg = src => new Promise(ok => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => ok(null); i.src = src; });
const svgImg = (kind, color) => loadImg('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
  ICONS[kind].replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" width="128" height="96" ').replace(/currentColor/g, color)));
const kindShort = (kind, ks) => kindName(kind, ks).replace('Promo 2 gorras', 'Promo');

function rr(c, x, y, w, h, r) {
  c.beginPath(); c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
}
function txt(c, s, x, y, o = {}) {
  const size = o.s || 30;
  c.font = `${o.i ? 'italic ' : ''}${o.w || 600} ${size}px ${FONT}`;
  c.fillStyle = o.c || '#0c0c0d'; c.textAlign = o.a || 'left'; c.textBaseline = 'alphabetic';
  try { c.letterSpacing = o.i ? (-0.03 * size) + 'px' : '0px'; } catch (e) {}
  c.fillText(s, x, y);
}

async function summaryBlob(mo) {
  const list = S.sales.filter(s => monthKey(s.date) === mo), o = sum(list), mp = o.total - o.cost;
  const W = 1080, PAD = 56, IW = W - PAD * 2;
  const scopes = [['all', 'Por tipo de venta', list, '#0c0c0d'], ['M', 'Morelos', list.filter(s => s.loc === 'M'), '#c93a12'], ['C', 'Carrillo', list.filter(s => s.loc === 'C'), '#08788d']];
  const TILE = { one: ['#ffffff', '#f1eef6', '#0c0c0d'], two: ['#ffd6e5', '#ffb4cd', '#a21b50'], prem: ['#ffe48f', '#f1b02f', '#2b1d00'] };
  const [logo, ...ic] = await Promise.all([loadImg('icon-192.png'), ...KINDS.map(k => svgImg(k, TILE[k][2]))]);
  const icons = { one: ic[0], two: ic[1], prem: ic[2] };

  const SC_H = 100 + 342 + 36, TOP = 760;
  const H = TOP + scopes.length * SC_H + 110;
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  const c = cv.getContext('2d');

  // fondo con manchas de color (el mismo de la app)
  c.fillStyle = '#f4f2f8'; c.fillRect(0, 0, W, H);
  const orb = (x, y, r, col) => { const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, col); g.addColorStop(1, col.replace(/[\d.]+\)$/, '0)')); c.fillStyle = g; c.fillRect(0, 0, W, H); };
  orb(60, 80, 640, 'rgba(255,150,110,.55)'); orb(W, 420, 560, 'rgba(255,120,175,.40)'); orb(0, H * .45, 680, 'rgba(110,225,180,.45)');
  orb(W, H * .8, 680, 'rgba(176,148,255,.46)'); orb(W * .5, H * .3, 480, 'rgba(255,214,110,.30)');

  const glass = (x, y, w, h, r) => {
    c.save(); c.shadowColor = 'rgba(60,40,100,.16)'; c.shadowBlur = 40; c.shadowOffsetY = 12;
    rr(c, x, y, w, h, r); c.fillStyle = 'rgba(255,255,255,.68)'; c.fill(); c.restore();
    rr(c, x + 1, y + 1, w - 2, h - 2, r); c.strokeStyle = 'rgba(255,255,255,.95)'; c.lineWidth = 2; c.stroke();
  };
  const tile = (kind, x, y, sz) => {
    const g = c.createLinearGradient(x, y, x + sz, y + sz); g.addColorStop(0, TILE[kind][0]); g.addColorStop(1, TILE[kind][1]);
    c.save(); c.shadowColor = 'rgba(60,40,100,.18)'; c.shadowBlur = 12; c.shadowOffsetY = 4;
    rr(c, x, y, sz, sz, sz * .32); c.fillStyle = g; c.fill(); c.restore();
    if (icons[kind]) c.drawImage(icons[kind], x + sz * .14, y + sz * .2, sz * .72, sz * .54);
  };

  // encabezado
  if (logo) { c.save(); c.shadowColor = 'rgba(24,18,48,.28)'; c.shadowBlur = 20; c.shadowOffsetY = 6; rr(c, PAD, 56, 104, 104, 28); c.fillStyle = '#000'; c.fill(); c.restore();
    c.save(); rr(c, PAD, 56, 104, 104, 28); c.clip(); c.drawImage(logo, PAD, 56, 104, 104); c.restore(); }
  txt(c, 'Resumen del mes', PAD + 130, 100, { s: 32, c: '#5a5d65' });
  txt(c, monthLong(mo), PAD + 130, 156, { s: 66, w: 900, i: 1 });

  // tarjeta oscura con los ingresos y la dona A/G/I
  const hy = 200, hh = 330;
  c.save(); c.shadowColor = 'rgba(40,24,90,.28)'; c.shadowBlur = 44; c.shadowOffsetY = 16;
  rr(c, PAD, hy, IW, hh, 48); c.fillStyle = '#0e0e14'; c.fill(); c.restore();
  c.save(); rr(c, PAD, hy, IW, hh, 48); c.clip();
  const orb2 = (x, y, r, col) => { const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, col); g.addColorStop(1, col.replace(/[\d.]+\)$/, '0)')); c.fillStyle = g; c.fillRect(PAD, hy, IW, hh); };
  orb2(W - PAD, hy, 560, 'rgba(130,96,255,.62)'); orb2(PAD, hy + hh, 520, 'rgba(30,190,120,.45)'); orb2(W * .5, hy + hh + 40, 360, 'rgba(255,190,70,.30)');
  c.restore();
  rr(c, PAD + 1, hy + 1, IW - 2, hh - 2, 48); c.strokeStyle = 'rgba(255,255,255,.2)'; c.lineWidth = 2; c.stroke();
  txt(c, 'Ingresos del mes', PAD + 48, hy + 82, { s: 32, c: '#d3d5db' });
  txt(c, money(o.total), PAD + 48, hy + 205, { s: 128, w: 900, i: 1, c: '#fff' });
  txt(c, `${o.qty} ${plural(o.qty, 'gorra', 'gorras')} · margen ${money(mp)}${o.total ? ` (${Math.round(mp / o.total * 100)} %)` : ''}`, PAD + 48, hy + 272, { s: 32, c: '#d3d5db' });
  {
    const cx = W - PAD - 150, cy = hy + hh / 2, r = 92, tot = Math.max(1, Math.max(0, o.A) + Math.max(0, o.G) + Math.max(0, o.I));
    c.lineWidth = 34; c.lineCap = 'butt'; c.strokeStyle = 'rgba(255,255,255,.14)'; c.beginPath(); c.arc(cx, cy, r, 0, Math.PI * 2); c.stroke();
    let a0 = -Math.PI / 2;
    [[o.A, '#3ddc97'], [o.G, '#ffc53d'], [o.I, '#9c86ff']].forEach(([v, col]) => {
      const a1 = a0 + Math.max(0, v) / tot * Math.PI * 2; if (a1 > a0) { c.strokeStyle = col; c.beginPath(); c.arc(cx, cy, r, a0, a1); c.stroke(); } a0 = a1;
    });
    txt(c, String(o.qty), cx, cy + 14, { s: 56, w: 900, i: 1, c: '#fff', a: 'center' });
    txt(c, 'gorras', cx, cy + 46, { s: 24, c: '#b8bbc2', a: 'center' });
  }

  // Ahorro / Ganancia / Inversión
  const cw = (IW - 40) / 3;
  [['Ahorro', o.A, 'rgba(205,243,227,.92)', '#0d7a4d'], ['Ganancia', o.G, 'rgba(253,238,196,.95)', '#85590a'], ['Inversión', o.I, 'rgba(228,221,255,.95)', '#5a3bf0']].forEach(([lab, v, bg, col], i) => {
    const x = PAD + i * (cw + 20);
    rr(c, x, 562, cw, 150, 34); c.fillStyle = bg; c.fill();
    rr(c, x + 1, 563, cw - 2, 148, 34); c.strokeStyle = 'rgba(255,255,255,.9)'; c.lineWidth = 2; c.stroke();
    txt(c, lab, x + cw / 2, 616, { s: 28, w: 700, c: '#5a5d65', a: 'center' });
    txt(c, money(v), x + cw / 2, 682, { s: 56, w: 900, i: 1, c: col, a: 'center' });
  });

  // una tabla por ámbito: los dos locales juntos, Morelos y Carrillo
  const COL = { u: 462, t: 636, A: 760, G: 878, I: 996 };
  scopes.forEach(([key, title, sl, color], n) => {
    const y0 = TOP + n * SC_H, so = sum(sl), smp = so.total - so.cost;
    txt(c, title, PAD, y0 + 44, { s: 44, w: 800, c: color });
    txt(c, money(so.total), W - PAD, y0 + 48, { s: 56, w: 900, i: 1, a: 'right' });
    txt(c, `${so.qty} ${plural(so.qty, 'gorra', 'gorras')} · margen ${money(smp)}`, PAD, y0 + 84, { s: 28, c: '#5a5d65' });
    const cy0 = y0 + 104; glass(PAD, cy0, IW, 342, 40);
    const hy0 = cy0 + 44;
    [['u', 'Ventas'], ['t', 'Total'], ['A', 'Ahorro'], ['G', 'Ganancia'], ['I', 'Inversión']].forEach(([k, lab]) => txt(c, lab, COL[k], hy0, { s: 22, w: 700, c: '#5a5d65', a: 'right' }));
    KINDS.forEach((kind, i) => {
      const ks = sl.filter(s => s.kind === kind), ko = sum(ks), units = ks.reduce((a, s) => a + (s.k || 0), 0);
      const ry = hy0 + 18 + i * 68, mid = ry + 34, dim = units ? 1 : .45;
      c.globalAlpha = dim;
      if (i) { c.fillStyle = 'rgba(24,18,48,.1)'; c.fillRect(PAD + 28, ry, IW - 56, 2); }
      tile(kind, PAD + 28, ry + 8, 52);
      txt(c, kindShort(kind, ks), PAD + 28 + 52 + 16, mid + 10, { s: 28, w: 800 });
      txt(c, String(units), COL.u, mid + 10, { s: 28, w: 700, c: '#5a5d65', a: 'right' });
      txt(c, money(ko.total), COL.t, mid + 10, { s: 28, w: 900, i: 1, a: 'right' });
      txt(c, money(ko.A), COL.A, mid + 10, { s: 27, w: 900, i: 1, c: '#0d7a4d', a: 'right' });
      txt(c, money(ko.G), COL.G, mid + 10, { s: 27, w: 900, i: 1, c: '#85590a', a: 'right' });
      txt(c, money(ko.I), COL.I, mid + 10, { s: 27, w: 900, i: 1, c: '#5a3bf0', a: 'right' });
      c.globalAlpha = 1;
    });
    const ty = hy0 + 18 + 3 * 68; c.fillStyle = '#0c0c0d'; c.fillRect(PAD + 28, ty, IW - 56, 3);
    const tm = ty + 36 + 12;
    txt(c, 'Total', PAD + 28, tm, { s: 28, w: 800 });
    txt(c, String(sl.reduce((a, s) => a + (s.k || 0), 0)), COL.u, tm, { s: 28, w: 700, c: '#5a5d65', a: 'right' });
    txt(c, money(so.total), COL.t, tm, { s: 28, w: 900, i: 1, a: 'right' });
    txt(c, money(so.A), COL.A, tm, { s: 27, w: 900, i: 1, c: '#0d7a4d', a: 'right' });
    txt(c, money(so.G), COL.G, tm, { s: 27, w: 900, i: 1, c: '#85590a', a: 'right' });
    txt(c, money(so.I), COL.I, tm, { s: 27, w: 900, i: 1, c: '#5a3bf0', a: 'right' });
  });

  txt(c, `Gorv · generado el ${dateLabel(todayStr())}`, W / 2, H - 52, { s: 26, c: '#5a5d65', a: 'center' });
  return new Promise(ok => cv.toBlob(ok, 'image/png'));
}

/* hoja que sube desde abajo (como las de iOS): se cierra tocando el fondo o arrastrando hacia abajo */
const sheet = document.createElement('div');
sheet.id = 'sheet';
sheet.innerHTML = '<div class="scrim"></div><div class="card" role="dialog" aria-modal="true" aria-label="Resumen del mes"><div class="gz"><div class="grab"></div></div><div class="sbody"></div></div>';
document.body.append(sheet);
const sbody = sheet.querySelector('.sbody');
let dragY0 = null, sumFile = null, sumUrl = null;
const closeSheet = () => sheet.classList.remove('open');
sheet.querySelector('.scrim').addEventListener('click', closeSheet);
sheet.addEventListener('pointerdown', e => { if (e.target.closest('.gz')) { dragY0 = e.clientY; sheet.classList.add('drag'); } });
sheet.addEventListener('pointermove', e => { if (dragY0 !== null) sheet.style.setProperty('--drag', Math.max(0, e.clientY - dragY0) + 'px'); });
const endDrag = e => {
  if (dragY0 === null) return;
  const dy = e.clientY - dragY0; dragY0 = null;
  sheet.classList.remove('drag'); sheet.style.setProperty('--drag', '0px');
  if (dy > 110) closeSheet();
};
sheet.addEventListener('pointerup', endDrag);
sheet.addEventListener('pointercancel', endDrag);

async function openSummary() {
  const mo = curMo();
  if (!S.sales.some(s => monthKey(s.date) === mo)) return toast('No hay ventas en este mes');
  sbody.innerHTML = '<p class="sub wait">Preparando tu resumen…</p>';
  sheet.classList.add('open');
  const blob = await summaryBlob(mo);
  sumFile = new File([blob], `gorv-resumen-${mo}.png`, { type: 'image/png' });
  if (sumUrl) URL.revokeObjectURL(sumUrl);
  sumUrl = URL.createObjectURL(blob);
  sbody.innerHTML = `<h2>Resumen de ${monthLong(mo)}</h2>
    <div class="sumwrap"><img class="sumimg" src="${sumUrl}" alt="Resumen de ${monthLong(mo)}"></div>
    <div class="sacts"><button class="primary" onclick="shareSummary()">Compartir</button>
      <button class="ghost" onclick="saveSummary()">Guardar imagen</button></div>`;
}
function shareSummary() {
  if (navigator.canShare && navigator.canShare({ files: [sumFile] }))
    navigator.share({ files: [sumFile], title: 'Resumen del mes · Gorv' }).catch(() => {});
  else saveSummary();
}
function saveSummary() { download(sumFile, sumFile.name); toast('Imagen guardada'); }

/* ---------- arranque / modo sin internet ---------- */
window.addEventListener('online', updateNet);
window.addEventListener('offline', updateNet);
{                                       // atajos al mantener presionado el ícono: ?tab=hoy|panel|stock
  const q = new URLSearchParams(location.search).get('tab');
  if (q && VIEWS[q]) tab = q;
}
render();
requestAnimationFrame(() => requestAnimationFrame(() => nav.classList.add('anim')));   // sin animar la posición inicial
{                                       // animación de entrada: solo al abrir la app (no al cambiar de pestaña ni al recargar en la misma sesión)
  let first = false;
  try { first = !sessionStorage.getItem('gorv_launch'); sessionStorage.setItem('gorv_launch', '1'); } catch (e) {}
  const forced = /[?&]splash=1/.test(location.search);
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (forced || (first && !calm && !navigator.webdriver)) {
    const el = document.createElement('div');
    el.id = 'launch';
    el.innerHTML = '<div class="lc"><div class="logo"><img src="icon-192.png" alt=""></div><b>Gorv</b></div>';
    document.body.append(el);
    const done = () => {
      if (el.classList.contains('out')) return;
      el.classList.add('out');
      const v = $('#view');             // el contenido entra mientras el telón se disuelve
      v.style.setProperty('--dx', '0px'); v.classList.remove('enter'); void v.offsetWidth; v.classList.add('enter');
      setTimeout(() => el.remove(), 520);
    };
    el.addEventListener('pointerdown', done);      // tocar la pantalla lo salta
    setTimeout(done, 1300);
  }
}
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
    navigator.serviceWorker.ready.then(() => {
      if (!localStorage.getItem('gorv_offline_ok')) {
        localStorage.setItem('gorv_offline_ok', '1');
        toast('Lista para usar sin internet');
      }
    });
  });
}

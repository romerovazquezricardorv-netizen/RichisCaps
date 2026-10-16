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

const DEFAULTS = {
  settings: {
    season: 'normal',          // 'normal' | 'alta'
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
  sales: [],   // {id,date,loc,n,pm,qty,total,A,G,I,cost,season}
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
function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY));
    if (raw) return merge(clone(DEFAULTS), raw);
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
const weekKey = s => { const d = parseD(s); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return fmt(d); }; // semana inicia lunes
const monthKey = s => s.slice(0, 7);
const MES = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
const DIAS = ['dom','lun','mar','mié','jue','vie','sáb'];
const weekLabel = k => { const a = parseD(k), b = new Date(a); b.setDate(b.getDate() + 6); return `${a.getDate()} ${MES[a.getMonth()]} al ${b.getDate()} ${MES[b.getMonth()]}`; };
const monthLabel = k => { const [y, m] = k.split('-'); return `${MES[m - 1]} ${y}`; };
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
function calc(n, pm) {              // n = normales, pm = premium
  const st = S.settings, pr = st.prices, ag = st.agi;
  const set = pr[st.season] || pr.normal;
  // normales: de 2 en 2 al precio de pareja, la sobrante al precio de una
  const total = Math.floor(n / 2) * set.two + (n % 2) * set.one + pm * pr.premium;
  const A = n * ag.normal.A + pm * ag.premium.A;
  const I = n * ag.normal.I + pm * ag.premium.I;
  return { qty: n + pm, total, A, I, G: total - A - I, cost: n * S.costs.normal + pm * S.costs.premium };
}

const Z = () => ({ qty: 0, total: 0, A: 0, G: 0, I: 0, cost: 0 });
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
let cartN = 0, cartP = 0;                            // ticket en curso
let range = 'week', per = 'week';                    // panel
let hist = { loc: 'all', month: 'all', limit: 30 };  // ventas
const curDate = () => saleDate || todayStr();

function go(t) {
  const changed = t !== tab;
  tab = t; render(); window.scrollTo(0, 0);
  if (changed) {                       // la pantalla entra con un fade corto; reiniciamos la animación
    const v = $('#view');
    v.classList.remove('enter'); void v.offsetWidth; v.classList.add('enter');
  }
}
const buzz = ms => { try { if (navigator.vibrate) navigator.vibrate(ms); } catch (e) {} };   // vibración corta al cobrar
function render() {
  document.querySelectorAll('nav button').forEach(b => b.classList.toggle('on', b.dataset.t === tab));
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
function agiBar(o) {
  const t = Math.max(o.total, 1);
  const pc = v => Math.max(0, v) / t * 100;
  return `<div class="bar"><i class="a" style="width:${pc(o.A)}%"></i><i class="g" style="width:${pc(o.G)}%"></i><i class="i" style="width:${pc(o.I)}%"></i></div>`;
}
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

function saleName(s) {
  const parts = [];
  if (s.n === 2) parts.push('Promo 2 normales');
  else if (s.n) parts.push(`${s.n} ${plural(s.n, 'normal', 'normales')}`);
  if (s.pm) parts.push(`${s.pm} premium`);
  return parts.join(' y ');
}

/* =========================================================
   PANTALLA: HOY  (vender con ticket)
   ========================================================= */
function hoy() {
  const st = S.settings, pr = st.prices, set = pr[st.season];
  const d = curDate();
  const daySales = S.sales.filter(s => s.date === d);
  const dayAll = sum(daySales);
  const mine = daySales.filter(s => s.loc === saleLoc).sort((a, b) => b.id.localeCompare(a.id));
  const other = saleLoc === 'M' ? 'C' : 'M';
  const haveN = S.stock.normal[saleLoc], haveP = S.stock.premium[saleLoc];
  cartN = Math.min(cartN, haveN); cartP = Math.min(cartP, haveP);

  const prod = (key, name, desc, have, n) => `
    <div class="prod ${key}">
      <div class="pi"><b>${name}</b><span>${desc}</span>
        <small class="${have < 1 ? 'out' : ''}">${have < 1 ? 'Sin existencias en ' + LOC[saleLoc] : 'Quedan ' + have + ' en ' + LOC[saleLoc]}</small></div>
      <div class="step">
        <button aria-label="Quitar ${name}" onclick="cart('${key}',-1)" ${n < 1 ? 'disabled' : ''}>−</button>
        <b class="num">${n}</b>
        <button class="plus" aria-label="Agregar ${name}" onclick="cart('${key}',1)" ${n >= have ? 'disabled' : ''}>+</button>
      </div>
    </div>`;

  const rows = mine.length ? mine.map(s => `
    <div class="srow"><div><b>${saleName(s)}</b><small>${agiLine(s)}</small></div>
      <span class="amt num">${money(s.total)}</span>
      <button class="x" aria-label="Borrar venta" onclick="delSale('${s.id}')">✕</button></div>`).join('')
    : '<p class="empty">Aún no hay ventas en este local. Agrega gorras al ticket para empezar.</p>';

  return `
    <section class="hero ${saleLoc}">
      <div class="locs">
        <button class="${saleLoc === 'M' ? 'on' : ''}" onclick="setLoc('M')">Morelos</button>
        <button class="${saleLoc === 'C' ? 'on' : ''}" onclick="setLoc('C')">Carrillo</button>
      </div>
      <p class="hl">${saleDate ? 'Ventas del ' + dateLabel(saleDate) : 'Vendido hoy'}</p>
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
      ${prod('n', 'Gorra normal', `${money(set.one)} c/u · 2 por ${money(set.two)}`, haveN, cartN)}
      ${prod('p', 'Gorra premium', `${money(pr.premium)} c/u`, haveP, cartP)}
    </section>

    <section class="list">
      <h2>Ventas en ${LOC[saleLoc]} ${saleDate ? '' : 'hoy'}</h2>
      ${rows}
    </section>

    ${acc('Registrar ventas de otro día', `<input type="date" value="${curDate()}" max="${todayStr()}" onchange="setDate(this.value)">`)}`;
}

function renderTicket() {
  const t = $('#ticket');
  const n = cartN + cartP;
  document.body.classList.toggle('tk', tab === 'hoy' && n > 0);
  if (tab !== 'hoy' || n === 0) { t.hidden = true; t.innerHTML = ''; return; }
  const c = calc(cartN, cartP);
  t.hidden = false;
  t.className = saleLoc;
  t.innerHTML = `<div class="tkinfo"><small>${n} ${plural(n, 'gorra', 'gorras')} para ${LOC[saleLoc]}${cartN >= 2 ? ' · promo' : ''}</small>
      <b class="num">${money(c.total)}</b></div>
    <button class="vac" aria-label="Vaciar ticket" onclick="clearCart()">Vaciar</button>
    <button class="cobrar" onclick="cobrar()">Cobrar</button>`;
}

/* =========================================================
   PANTALLA: PANEL
   ========================================================= */
function inRange(s) {
  const t = todayStr();
  if (range === 'week') return weekKey(s.date) === weekKey(t);
  if (range === 'month') return monthKey(s.date) === monthKey(t);
  return true;
}
function chart7() {
  const days = [];
  for (let i = 6; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); days.push(fmt(d)); }
  const vals = days.map(k => S.sales.filter(s => s.date === k).reduce((a, s) => a + s.total, 0));
  const max = Math.max(...vals, 1), D = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
  return `<div class="chart">` + days.map((k, i) =>
    `<div class="col ${i === 6 ? 'today' : ''}">${vals[i] ? `<b>${money(vals[i])}</b>` : ''}` +
    `<i style="height:${vals[i] / max * 78}%"></i><small>${D[parseD(k).getDay()]}</small></div>`).join('') + `</div>`;
}

function panel() {
  const today = todayStr();
  const list = S.sales.filter(inRange), o = sum(list);
  const label = range === 'week' ? 'Esta semana, ' + weekLabel(weekKey(today)) : range === 'month' ? 'Este mes, ' + monthLabel(monthKey(today)) : 'Desde que empezaste';
  const low = TIPOS.filter(t => tot(t) <= S.settings.low);

  const lb = S.meta.lastBackup;
  const days = lb ? Math.floor((Date.now() - lb) / 86400000) : null;
  const backupWarn = S.sales.length && (days === null || days >= 7)
    ? `<div class="alert red"><span><b>Haz un respaldo.</b> ${days === null ? 'Aún no has descargado ninguno.' : `El último fue hace ${days} días.`} Si se borra el navegador, pierdes todo.</span>
        <button class="ghost" onclick="exportData()">Descargar</button></div>` : '';
  const lowWarn = low.length
    ? `<div class="alert"><span><b>Poco inventario:</b> ${low.map(t => `${TIPO[t]} (${tot(t)})`).join(', ')}.</span>
        <button class="ghost" onclick="go('stock')">Ver</button></div>` : '';

  const loc = l => { const t = sum(list.filter(s => s.loc === l));
    return `<div class="lrow"><div class="lt"><b class="l${l}">${LOC[l]}</b><span class="num">${money(t.total)}</span></div>
      <div class="meter"><i class="m${l}" style="width:${t.total / Math.max(o.total, 1) * 100}%"></i></div>
      <small>${t.qty} ${plural(t.qty, 'gorra', 'gorras')} · ganancia ${money(t.G)}</small></div>`; };

  const mp = o.total - o.cost;
  const keyFn = per === 'week' ? weekKey : monthKey, lab = per === 'week' ? weekLabel : monthLabel;
  const map = agg(keyFn), keys = Object.keys(map).sort().reverse().slice(0, per === 'week' ? 8 : 12);
  const periods = keys.length ? keys.map(k => { const p = map[k];
    return `<div class="srow"><div><b>${lab(k)}</b><small>${p.qty} ${plural(p.qty, 'gorra', 'gorras')} · ${agiLine(p)}</small></div><span class="amt num">${money(p.total)}</span></div>`;
  }).join('') : '<p class="empty">Cuando registres ventas, aquí verás cada periodo.</p>';

  return `
    ${backupWarn}${lowWarn}
    <div class="pills wide">
      <button class="${range === 'week' ? 'on' : ''}" onclick="setRange('week')">Semana</button>
      <button class="${range === 'month' ? 'on' : ''}" onclick="setRange('month')">Mes</button>
      <button class="${range === 'all' ? 'on' : ''}" onclick="setRange('all')">Todo</button>
    </div>

    <section class="hero dark">
      <div class="hleft">
        <p class="hl">${label}</p>
        <div class="big num">${money(o.total)}</div>
        <div class="lg">
          <span><i class="a"></i>Ahorro <b>${money(o.A)}</b></span>
          <span><i class="g"></i>Ganancia <b>${money(o.G)}</b></span>
          <span><i class="i"></i>Inversión <b>${money(o.I)}</b></span>
        </div>
      </div>
      ${donut(o)}
    </section>

    <section class="list"><h2>Últimos 7 días</h2>${chart7()}</section>

    <section class="list"><h2>Por local</h2>${loc('M')}${loc('C')}</section>

    <section class="list"><h2>Margen del periodo</h2>
      <div class="kv"><span>Ingresos</span><b class="num">${money(o.total)}</b></div>
      <div class="kv"><span>Costo de las gorras vendidas</span><b class="num">${money(o.cost)}</b></div>
      <div class="kv total"><span>Margen bruto${o.total ? ` (${Math.round(mp / o.total * 100)}%)` : ''}</span><b class="num">${money(mp)}</b></div>
    </section>

    <section class="list"><h2>Cada periodo</h2>
      <div class="pills wide">
        <button class="${per === 'week' ? 'on' : ''}" onclick="setPer('week')">Por semana</button>
        <button class="${per === 'month' ? 'on' : ''}" onclick="setPer('month')">Por mes</button>
      </div>${periods}
    </section>`;
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
    html += `<div class="srow"><i class="dot ${s.loc}"></i>
      <div><b>${saleName(s)}</b><small>${LOC[s.loc] || ''} · ${agiLine(s)}</small></div>
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
function setLoc(l) { saleLoc = l; cartN = cartP = 0; render(); }
function setDate(v) {
  if (v > todayStr()) { toast('No puedes registrar ventas de días futuros'); v = ''; }
  saleDate = (!v || v === todayStr()) ? null : v; render();
}
function setRange(v) { range = v; render(); }
function setPer(v) { per = v; render(); }

function cart(key, d) {
  if (key === 'n') cartN = Math.max(0, Math.min(S.stock.normal[saleLoc], cartN + d));
  else cartP = Math.max(0, Math.min(S.stock.premium[saleLoc], cartP + d));
  render();
  const b = document.querySelector(`.prod.${key} .step b`);
  if (b) b.classList.add('pop');
}
function clearCart() { cartN = cartP = 0; render(); }

function cobrar() {
  const n = cartN, pm = cartP;
  if (n + pm < 1) return;
  if (S.stock.normal[saleLoc] < n) return toast(`No hay suficientes normales en ${LOC[saleLoc]}`);
  if (S.stock.premium[saleLoc] < pm) return toast(`No hay suficientes premium en ${LOC[saleLoc]}`);
  const c = calc(n, pm), id = uid();
  S.sales.push({ id, date: curDate(), loc: saleLoc, n, pm, qty: c.qty, total: c.total,
    A: c.A, G: c.G, I: c.I, cost: c.cost, season: S.settings.season });
  S.stock.normal[saleLoc] -= n; S.stock.premium[saleLoc] -= pm;
  cartN = cartP = 0;
  save(); render(); buzz(18);
  toast(`Cobrado ${money(c.total)} · ${LOC[saleLoc]}`, { label: 'Deshacer', fn: `undoSale('${id}')` });
}

function removeSale(id) {
  const s = S.sales.find(x => x.id === id);
  if (!s) return false;
  if (S.stock.normal[s.loc] !== undefined) { S.stock.normal[s.loc] += s.n; S.stock.premium[s.loc] += s.pm; }
  S.sales = S.sales.filter(x => x.id !== id);
  save();
  return true;
}
function undoSale(id) { if (removeSale(id)) { buzz(10); toast('Venta deshecha'); render(); } }
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
  const rows = [['Fecha', 'Local', 'Normales', 'Premium', 'Gorras', 'Total', 'Ahorro', 'Ganancia', 'Inversion', 'Costo']];
  [...S.sales].sort((a, b) => (a.date + a.id).localeCompare(b.date + b.id)).forEach(s =>
    rows.push([s.date, LOC[s.loc] || s.loc, s.n, s.pm, s.qty, s.total, s.A, s.G, s.I, s.cost || 0]));
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
      S = merge(clone(DEFAULTS), d);
      save(); toast('Respaldo restaurado'); render();
    } catch (err) { toast('Archivo no válido'); }
  };
  r.readAsText(f); e.target.value = '';
});

function resetAll() {
  if (!confirm('¿Borrar TODOS los datos de la app?')) return;
  if (!confirm('Esta acción no se puede deshacer. ¿Seguro?')) return;
  S = clone(DEFAULTS); cartN = cartP = 0; save(); render();
}

/* ---------- arranque / modo sin internet ---------- */
window.addEventListener('online', updateNet);
window.addEventListener('offline', updateNet);
{                                       // atajos al mantener presionado el ícono: ?tab=hoy|panel|stock
  const q = new URLSearchParams(location.search).get('tab');
  if (q && VIEWS[q]) tab = q;
}
render();
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

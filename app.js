'use strict';

/* =========================================================
   GORV - inventario, ventas y método AGI
   Dos calidades (normal y premium) y tres lugares:
   Bodega, Morelos (M) y Carrillo (C).
   Datos guardados en el navegador (localStorage).
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
      premium: { A: 100, I: 60 }   // ajusta estos montos a tu gusto
    }
  },
  stock: {
    normal:  { bodega: 0, M: 0, C: 0 },
    premium: { bodega: 0, M: 0, C: 0 }
  },
  costs: { normal: 28, premium: 60 },   // costo promedio por gorra
  sales: [],   // {id,date,loc,n,pm,qty,total,A,G,I,cost,season}
  buys: []     // {id,date,type,qty,unitCost}
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
const save = () => localStorage.setItem(KEY, JSON.stringify(S));

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
const weekLabel = k => { const a = parseD(k), b = new Date(a); b.setDate(b.getDate() + 6); return `${a.getDate()} ${MES[a.getMonth()]} al ${b.getDate()} ${MES[b.getMonth()]}`; };
const monthLabel = k => { const [y, m] = k.split('-'); return `${MES[m - 1]} ${y}`; };
const dateLabel = s => { const d = parseD(s); return `${d.getDate()} ${MES[d.getMonth()]} ${d.getFullYear()}`; };
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const num = id => parseFloat($(id).value) || 0;
const tot = t => S.stock[t].bodega + S.stock[t].M + S.stock[t].C;

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

function agg(keyFn, filterFn) {
  const m = {};
  S.sales.forEach(s => {
    if (filterFn && !filterFn(s)) return;
    const k = keyFn(s.date);
    const o = m[k] || (m[k] = { qty: 0, total: 0, A: 0, G: 0, I: 0 });
    o.qty += s.qty; o.total += s.total; o.A += s.A; o.G += s.G; o.I += s.I;
  });
  return m;
}

/* ---------- navegación ---------- */
let tab = 'resumen', saleLoc = 'M', saleDate = null;   // saleDate null = hoy
const curDate = () => saleDate || todayStr();
let lastTap = { k: '', t: 0 };

function go(t) { tab = t; render(); window.scrollTo(0, 0); }
function render() {
  document.querySelectorAll('nav button').forEach(b => b.classList.toggle('on', b.dataset.t === tab));
  const b = $('#seasonBadge');
  b.textContent = S.settings.season === 'alta' ? 'Temporada alta' : 'Temporada normal';
  b.className = 'badge ' + (S.settings.season === 'alta' ? 'alta' : '');
  $('#view').innerHTML = VIEWS[tab]();
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
function agiBoxes(o) {
  return `<div class="split">
    <div class="cA"><b>${money(o.A)}</b><small>Ahorro</small></div>
    <div class="cG"><b>${money(o.G)}</b><small>Ganancia</small></div>
    <div class="cI"><b>${money(o.I)}</b><small>Inversión</small></div></div>`;
}
function periodCard(title, o) {
  return `<div class="card"><h3>${title}</h3>
    <div class="big">${money(o.total)}</div>
    <div class="sub">${o.qty} gorra${o.qty === 1 ? '' : 's'} vendida${o.qty === 1 ? '' : 's'}</div>
    ${agiBoxes(o)}${agiBar(o)}</div>`;
}
function table(map, labelFn, limit) {
  const keys = Object.keys(map).sort().reverse().slice(0, limit);
  if (!keys.length) return '<p class="empty">Aún no hay ventas registradas.</p>';
  return `<div class="scroll"><table><tr><th></th><th>Gorras</th><th>Ingreso</th><th>A</th><th>G</th><th>I</th></tr>` +
    keys.map(k => { const o = map[k];
      return `<tr><td>${labelFn(k)}</td><td>${o.qty}</td><td>${money(o.total)}</td><td>${money(o.A)}</td><td>${money(o.G)}</td><td>${money(o.I)}</td></tr>`;
    }).join('') + '</table></div>';
}
function stockTable() {
  const row = t => { const s = S.stock[t];
    return `<tr><td>${TIPO[t]}</td><td>${s.bodega}</td><td>${s.M}</td><td>${s.C}</td><td><b>${tot(t)}</b></td></tr>`; };
  return `<div class="scroll"><table><tr><th></th><th>Bodega</th><th class="lM">Morelos</th><th class="lC">Carrillo</th><th>Total</th></tr>${row('normal')}${row('premium')}</table></div>`;
}
const locOptions = sel => LOCS.map(l => `<option value="${l}" ${l === sel ? 'selected' : ''}>${LOC[l]}</option>`).join('');
const tipoOptions = () => TIPOS.map(t => `<option value="${t}">${TIPO[t]}</option>`).join('');

/* ---------- vistas ---------- */
function resumen() {
  const zero = { qty: 0, total: 0, A: 0, G: 0, I: 0 };
  const wk = agg(weekKey), mo = agg(monthKey);
  const cm = monthKey(todayStr());
  const w = wk[weekKey(todayStr())] || zero;
  const m = mo[cm] || zero;
  const all = S.sales.reduce((a, s) => ({ qty: a.qty + s.qty, total: a.total + s.total, A: a.A + s.A, G: a.G + s.G, I: a.I + s.I }), { ...zero });
  const low = TIPOS.filter(t => tot(t) <= S.settings.low);

  const byLoc = { M: { ...zero }, C: { ...zero } };
  S.sales.filter(s => monthKey(s.date) === cm && byLoc[s.loc]).forEach(s => {
    const o = byLoc[s.loc]; o.qty += s.qty; o.total += s.total; o.A += s.A; o.G += s.G; o.I += s.I;
  });
  const locRows = ['M', 'C'].map(l => { const o = byLoc[l];
    return `<tr><td class="l${l}"><b>${LOC[l]}</b></td><td>${o.qty}</td><td>${money(o.total)}</td><td>${money(o.A)}</td><td>${money(o.G)}</td><td>${money(o.I)}</td></tr>`; }).join('');

  return `
    ${periodCard('Esta semana', w)}
    ${periodCard('Este mes', m)}
    <div class="card"><h3>Este mes por local</h3>
      <div class="scroll"><table><tr><th></th><th>Gorras</th><th>Ingreso</th><th>A</th><th>G</th><th>I</th></tr>${locRows}</table></div></div>
    <div class="card"><h3>Acumulado total</h3>
      <div class="sub">${all.qty} gorras vendidas · ${money(all.total)} de ingresos</div>
      ${agiBoxes(all)}${agiBar(all)}</div>
    <div class="card ${low.length ? 'warn' : ''}"><h3>Inventario</h3>
      ${stockTable()}
      ${low.length ? `<p><b>Poco inventario:</b> ${low.map(t => `${TIPO[t]} (${tot(t)})`).join(', ')}</p>` : ''}</div>
    <h2>Por semana</h2><div class="card">${table(wk, weekLabel, 8)}</div>
    <h2>Por mes</h2><div class="card">${table(mo, monthLabel, 12)}</div>`;
}

function saleName(s) {
  const parts = [];
  if (s.n === 2) parts.push('Promo 2 normales');
  else if (s.n) parts.push(`${s.n} normal${s.n === 1 ? '' : 'es'}`);
  if (s.pm) parts.push(`${s.pm} premium`);
  return parts.join(' y ');
}

function vender() {
  const st = S.settings, pr = st.prices, set = pr[st.season];
  const day = S.sales.filter(s => s.date === curDate() && s.loc === saleLoc).sort((a, b) => b.id.localeCompare(a.id));
  const dayTot = day.reduce((a, s) => ({ qty: a.qty + s.qty, total: a.total + s.total }), { qty: 0, total: 0 });

  const btn = (cls, title, n, pm) => {
    const c = calc(n, pm), have = S.stock[pm ? 'premium' : 'normal'][saleLoc], dis = have < n + pm;
    return `<button class="sale ${cls}" ${dis ? 'disabled' : ''} onclick="venta(${n},${pm})">
      <span class="t">${title}</span><span class="p">${money(c.total)}</span>
      <span class="m">${dis ? 'Sin existencias en ' + LOC[saleLoc] : 'Quedan ' + have + ' en ' + LOC[saleLoc]}<br>Ahorro ${money(c.A)} · Ganancia ${money(c.G)} · Inversión ${money(c.I)}</span>
    </button>`;
  };
  const list = day.length ? day.map(s => `
    <div class="row"><div><b>${money(s.total)}</b><small>${saleName(s)}</small></div>
      <button class="ghost danger" onclick="delSale('${s.id}')">Borrar</button></div>`).join('')
    : '<p class="empty">Todavía no hay ventas en este local.</p>';

  return `
    <h3>¿Dónde vendes?</h3>
    <div class="seg">
      <button class="bM ${saleLoc === 'M' ? 'on' : ''}" onclick="setLoc('M')">Morelos</button>
      <button class="bC ${saleLoc === 'C' ? 'on' : ''}" onclick="setLoc('C')">Carrillo</button>
    </div>
    <div class="seg">
      <button class="${st.season === 'normal' ? 'on' : ''}" onclick="setSeason('normal')">Precio normal</button>
      <button class="${st.season === 'alta' ? 'on' : ''}" onclick="setSeason('alta')">Temporada alta</button>
    </div>
    ${saleDate ? `<div class="card warn"><b>Registrando ventas del ${dateLabel(saleDate)}</b>
      <div class="btns"><button class="ghost" onclick="setDate('')">Volver a hoy</button></div></div>` : ''}
    ${btn('one', `1 gorra normal`, 1, 0)}
    ${btn('two', `Promo 2 gorras normales`, 2, 0)}
    ${btn('prem', 'Gorra premium', 0, 1)}
    <div class="card"><h3>${saleDate ? dateLabel(saleDate) : 'Hoy'} en <span class="l${saleLoc}">${LOC[saleLoc]}</span></h3>
      <div class="big">${money(dayTot.total)}</div>
      <div class="sub">${dayTot.qty} gorra${dayTot.qty === 1 ? '' : 's'} vendida${dayTot.qty === 1 ? '' : 's'}</div>
      <div style="margin-top:8px">${list}</div></div>
    <div class="card"><label style="margin-top:0">¿Vas a registrar ventas de otro día?</label>
      <input type="date" value="${curDate()}" onchange="setDate(this.value)"></div>`;
}

function inventario() {
  const fix = t => `<h3 style="margin-top:12px">${TIPO[t]}</h3><div class="grid3">
    ${LOCS.map(l => `<div><label class="l${l}">${LOC[l]}</label><input id="c_${t}_${l}" type="number" inputmode="numeric" value="${S.stock[t][l]}"></div>`).join('')}</div>`;
  return `
    <div class="card"><h3>Existencias</h3>${stockTable()}
      <div class="sub" style="margin-top:8px">Costo promedio: Normal ${money(S.costs.normal)} · Premium ${money(S.costs.premium)}</div></div>

    <div class="card"><h3>Mover gorras</h3>
      <div class="sub">Por ejemplo, de Bodega a Morelos cuando surtes el local.</div>
      <label>Calidad</label><select id="mvT">${tipoOptions()}</select>
      <div class="grid2">
        <div><label>De</label><select id="mvFrom">${locOptions('bodega')}</select></div>
        <div><label>A</label><select id="mvTo">${locOptions('M')}</select></div>
      </div>
      <label>Cantidad</label><input id="mvQty" type="number" inputmode="numeric" placeholder="0">
      <button class="primary" onclick="mover()">Mover</button></div>

    <div class="card"><h3>Registrar compra (entra a Bodega)</h3>
      <label>Calidad</label><select id="buyT">${tipoOptions()}</select>
      <div class="grid2">
        <div><label>Cantidad</label><input id="buyQty" type="number" inputmode="numeric" placeholder="0"></div>
        <div><label>Costo por gorra</label><input id="buyCost" type="number" inputmode="decimal" placeholder="28"></div>
      </div>
      <button class="primary" onclick="comprar()">Guardar compra</button></div>

    <div class="card"><h3>Corregir conteo</h3>
      <div class="sub">Escribe lo que realmente tienes en cada lugar.</div>
      ${fix('normal')}${fix('premium')}
      <button class="primary" onclick="corregir()">Guardar conteo</button></div>`;
}

function historial() {
  const sales = [...S.sales].sort((a, b) => (b.date + b.id).localeCompare(a.date + a.id));
  if (!sales.length) return '<p class="empty">Aún no hay ventas.</p>';
  return sales.slice(0, 100).map(s => {
    return `
    <div class="card"><div class="row" style="border:0;padding:0">
      <div><b>${money(s.total)}</b><small>${dateLabel(s.date)} · <span class="l${s.loc}">${LOC[s.loc] || ''}</span></small></div>
      <button class="ghost danger" onclick="delSale('${s.id}')">Borrar</button></div>
      <div class="sub">${saleName(s)}</div>
      ${agiBoxes(s)}${agiBar(s)}</div>`;
  }).join('');
}

function ajustes() {
  const st = S.settings, p = st.prices;
  return `
    <div class="card"><h3>Precios de venta</h3>
      <div class="grid2">
        <div><label>Normal: 1 gorra</label><input id="n1" type="number" inputmode="decimal" value="${p.normal.one}"></div>
        <div><label>Normal: 2 gorras</label><input id="n2" type="number" inputmode="decimal" value="${p.normal.two}"></div>
        <div><label>Temp. alta: 1 gorra</label><input id="a1" type="number" inputmode="decimal" value="${p.alta.one}"></div>
        <div><label>Temp. alta: 2 gorras</label><input id="a2" type="number" inputmode="decimal" value="${p.alta.two}"></div>
      </div>
      <label>Premium (1 gorra)</label><input id="pp" type="number" inputmode="decimal" value="${p.premium}"></div>
    <div class="card"><h3>Método AGI por gorra</h3>
      <div class="sub">Ahorro e Inversión son fijos. La Ganancia es lo que sobra del precio de venta.</div>
      <div class="grid2">
        <div><label>Normal: Ahorro</label><input id="nA" type="number" inputmode="decimal" value="${st.agi.normal.A}"></div>
        <div><label>Normal: Inversión</label><input id="nI" type="number" inputmode="decimal" value="${st.agi.normal.I}"></div>
        <div><label>Premium: Ahorro</label><input id="pA" type="number" inputmode="decimal" value="${st.agi.premium.A}"></div>
        <div><label>Premium: Inversión</label><input id="pI" type="number" inputmode="decimal" value="${st.agi.premium.I}"></div>
      </div>
      <label>Avisar inventario bajo desde (gorras en total por calidad)</label><input id="low" type="number" inputmode="numeric" value="${st.low}">
      <button class="primary" onclick="saveSettings()">Guardar ajustes</button></div>
    <div class="card"><h3>Respaldo de datos</h3>
      <div class="sub">Tus datos viven en este celular. Descarga un respaldo de vez en cuando.</div>
      <div class="btns">
        <button class="ghost" onclick="exportData()">Descargar respaldo</button>
        <button class="ghost" onclick="$('#importFile').click()">Restaurar respaldo</button>
        <button class="ghost danger" onclick="resetAll()">Borrar todo</button></div></div>`;
}

const VIEWS = { resumen, vender, inventario, historial, ajustes };

/* ---------- acciones: venta ---------- */
function setSeason(v) { S.settings.season = v; save(); render(); }
function setLoc(l) { saleLoc = l; render(); }
function setDate(v) { saleDate = (!v || v === todayStr()) ? null : v; render(); }

function venta(n, pm) {                       // n = normales, pm = premium
  const key = `${n}-${pm}-${saleLoc}`, now = Date.now();
  if (lastTap.k === key && now - lastTap.t < 450) return;   // evita doble toque accidental
  lastTap = { k: key, t: now };
  const t = pm ? 'premium' : 'normal';
  if (S.stock[t][saleLoc] < n + pm) return toast(`No hay existencias de ${TIPO[t].toLowerCase()} en ${LOC[saleLoc]}`);
  const c = calc(n, pm), id = uid();
  S.sales.push({ id, date: curDate(), loc: saleLoc, n, pm, qty: c.qty, total: c.total,
    A: c.A, G: c.G, I: c.I, cost: c.cost, season: S.settings.season });
  S.stock[t][saleLoc] -= n + pm;
  save(); render();
  toast(`Venta guardada: ${money(c.total)} · ${LOC[saleLoc]}`, { label: 'Deshacer', fn: `undoSale('${id}')` });
}

function removeSale(id) {
  const s = S.sales.find(x => x.id === id);
  if (!s) return false;
  if (S.stock.normal[s.loc] !== undefined) { S.stock.normal[s.loc] += s.n; S.stock.premium[s.loc] += s.pm; }
  S.sales = S.sales.filter(x => x.id !== id);
  save();
  return true;
}
function undoSale(id) { if (removeSale(id)) { toast('Venta deshecha'); render(); } }
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
  const have = tot(t);
  S.costs[t] = Math.round(((have * S.costs[t] + q * uc) / (have + q)) * 100) / 100; // costo promedio
  S.stock[t].bodega += q;
  S.buys.push({ id: uid(), date: todayStr(), type: t, qty: q, unitCost: uc });
  save(); toast(`+${q} ${TIPO[t].toLowerCase()} en Bodega`); render();
}

function corregir() {
  TIPOS.forEach(t => LOCS.forEach(l => { S.stock[t][l] = Math.max(0, Math.floor(num(`#c_${t}_${l}`))); }));
  save(); toast('Conteo guardado'); render();
}

/* ---------- ajustes y respaldo ---------- */
function saveSettings() {
  const st = S.settings;
  st.prices.normal = { one: num('#n1'), two: num('#n2') };
  st.prices.alta = { one: num('#a1'), two: num('#a2') };
  st.prices.premium = num('#pp');
  st.agi.normal = { A: num('#nA'), I: num('#nI') };
  st.agi.premium = { A: num('#pA'), I: num('#pI') };
  st.low = Math.max(0, Math.floor(num('#low')));
  save(); toast('Ajustes guardados'); render();
}

function exportData() {
  const blob = new Blob([JSON.stringify(S, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `gorv-respaldo-${todayStr()}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
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
  S = clone(DEFAULTS); save(); render();
}

/* ---------- arranque / modo sin internet ---------- */
window.addEventListener('online', updateNet);
window.addEventListener('offline', updateNet);
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

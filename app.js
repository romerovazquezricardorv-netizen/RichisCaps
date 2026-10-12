'use strict';

/* =========================================================
   MIS GORRAS - inventario, ventas y método AGI
   Datos guardados en el navegador (localStorage).
   Para cambiar precios o montos AGI usa la pestaña Ajustes.
   ========================================================= */

const KEY = 'gorras_app_v1';

const DEFAULTS = {
  settings: {
    season: 'normal',          // 'normal' | 'alta'
    low: 3,                    // alerta de stock bajo
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
  products: [],   // {id,name,type,cost,stock}
  sales: [],      // {id,date,qty,total,A,G,I,cost,season,items[]}
  buys: []        // {id,date,productId,name,qty,unitCost}
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
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const num = id => parseFloat($(id).value) || 0;

let toastTimer;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}

/* ---------- cálculo de venta + AGI ---------- */
function calc(items) {              // items: [{p, qty}]
  const st = S.settings, pr = st.prices, ag = st.agi;
  let n = 0, pm = 0, cost = 0;
  items.forEach(({ p, qty }) => {
    if (p.type === 'premium') pm += qty; else n += qty;
    cost += qty * p.cost;
  });
  const set = pr[st.season] || pr.normal;
  // normales: de 2 en 2 al precio de pareja, la sobrante al precio de una
  const totalN = Math.floor(n / 2) * set.two + (n % 2) * set.one;
  const total = totalN + pm * pr.premium;
  const A = n * ag.normal.A + pm * ag.premium.A;
  const I = n * ag.normal.I + pm * ag.premium.I;
  return { qty: n + pm, total, A, I, G: total - A - I, cost };
}

function agg(keyFn) {
  const m = {};
  S.sales.forEach(s => {
    const k = keyFn(s.date);
    const o = m[k] || (m[k] = { qty: 0, total: 0, A: 0, G: 0, I: 0 });
    o.qty += s.qty; o.total += s.total; o.A += s.A; o.G += s.G; o.I += s.I;
  });
  return m;
}

/* ---------- navegación ---------- */
let tab = 'resumen', cart = {}, saleDate = todayStr();

function go(t) { tab = t; render(); window.scrollTo(0, 0); }
function render() {
  document.querySelectorAll('nav button').forEach(b => b.classList.toggle('on', b.dataset.t === tab));
  const b = $('#seasonBadge');
  b.textContent = S.settings.season === 'alta' ? 'Temporada alta' : 'Temporada normal';
  b.className = 'badge ' + (S.settings.season === 'alta' ? 'alta' : '');
  $('#view').innerHTML = VIEWS[tab]();
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

/* ---------- vistas ---------- */
function resumen() {
  const zero = { qty: 0, total: 0, A: 0, G: 0, I: 0 };
  const wk = agg(weekKey), mo = agg(monthKey);
  const w = wk[weekKey(todayStr())] || zero;
  const m = mo[monthKey(todayStr())] || zero;
  const all = S.sales.reduce((a, s) => ({ qty: a.qty + s.qty, total: a.total + s.total, A: a.A + s.A, G: a.G + s.G, I: a.I + s.I }), { ...zero });
  const stock = S.products.reduce((a, p) => a + p.stock, 0);
  const low = S.products.filter(p => p.stock <= S.settings.low);
  return `
    ${periodCard('Esta semana', w)}
    ${periodCard('Este mes', m)}
    <div class="card"><h3>Acumulado total</h3>
      <div class="sub">${all.qty} gorras vendidas · ${money(all.total)} de ingresos</div>
      ${agiBoxes(all)}${agiBar(all)}</div>
    <div class="card ${low.length ? 'warn' : ''}"><h3>Inventario</h3>
      <div class="big">${stock}</div><div class="sub">gorras en stock</div>
      ${low.length ? `<p><b>Stock bajo:</b> ${low.map(p => `${esc(p.name)} (${p.stock})`).join(', ')}</p>` : ''}</div>
    <h2>Por semana</h2><div class="card">${table(wk, weekLabel, 8)}</div>
    <h2>Por mes</h2><div class="card">${table(mo, monthLabel, 12)}</div>`;
}

function vender() {
  const items = S.products.filter(p => cart[p.id]).map(p => ({ p, qty: cart[p.id] }));
  const c = calc(items);
  const pr = S.settings.prices, set = pr[S.settings.season];
  const list = S.products.length ? S.products.map(p => `
    <div class="row"><div><b>${esc(p.name)}</b> <span class="tag ${p.type}">${p.type}</span>
      <small>Stock: ${p.stock}</small></div>
      <div class="qty"><button onclick="chg('${p.id}',-1)">−</button><span>${cart[p.id] || 0}</span><button onclick="chg('${p.id}',1)">+</button></div>
    </div>`).join('') : '<p class="empty">Primero agrega gorras en Inventario.</p>';
  return `
    <div class="seg">
      <button class="${S.settings.season === 'normal' ? 'on' : ''}" onclick="setSeason('normal')">Precio normal</button>
      <button class="${S.settings.season === 'alta' ? 'on' : ''}" onclick="setSeason('alta')">Temporada alta</button>
    </div>
    <div class="sub">Normal: ${money(set.one)} una o 2 por ${money(set.two)} · Premium: ${money(pr.premium)}</div>
    <div class="card" style="margin-top:10px">${list}</div>
    <div class="card"><h3>Venta actual</h3>
      <div class="big">${money(c.total)}</div><div class="sub">${c.qty} gorra${c.qty === 1 ? '' : 's'}</div>
      ${agiBoxes(c)}${agiBar(c)}
      <label>Fecha de la venta</label>
      <input type="date" value="${saleDate}" onchange="saleDate=this.value||todayStr()">
      <button class="primary" onclick="registrar()">Registrar venta</button>
    </div>`;
}

function inventario() {
  const list = S.products.length ? S.products.map(p => `
    <div class="row"><div><b>${esc(p.name)}</b> <span class="tag ${p.type}">${p.type}</span>
      <small>Stock: <b>${p.stock}</b> · Costo prom.: ${money(p.cost)}</small>
      <div class="btns">
        <button class="ghost" onclick="restock('${p.id}')">Reponer</button>
        <button class="ghost" onclick="adjust('${p.id}')">Ajustar stock</button>
        <button class="ghost danger" onclick="delProd('${p.id}')">Borrar</button>
      </div></div></div>`).join('') : '<p class="empty">Agrega tu primer modelo de gorra.</p>';
  return `
    <div class="card"><h3>Agregar modelo</h3>
      <label>Nombre (modelo / color)</label><input id="pName" placeholder="Ej. NY negra">
      <div class="grid2">
        <div><label>Tipo</label><select id="pType"><option value="normal">Normal</option><option value="premium">Premium</option></select></div>
        <div><label>Costo por gorra</label><input id="pCost" type="number" inputmode="decimal" placeholder="28"></div>
      </div>
      <label>Stock inicial</label><input id="pStock" type="number" inputmode="numeric" placeholder="0">
      <button class="primary" onclick="addProduct()">Guardar modelo</button></div>
    <h2>Mis gorras</h2><div class="card">${list}</div>`;
}

function historial() {
  const sales = [...S.sales].sort((a, b) => (b.date + b.id).localeCompare(a.date + a.id));
  if (!sales.length) return '<p class="empty">Aún no hay ventas.</p>';
  return sales.slice(0, 100).map(s => `
    <div class="card"><div class="row" style="border:0;padding:0">
      <div><b>${money(s.total)}</b><small>${parseD(s.date).getDate()} ${MES[parseD(s.date).getMonth()]} ${parseD(s.date).getFullYear()} · ${s.qty} gorra${s.qty === 1 ? '' : 's'}</small></div>
      <button class="ghost danger" onclick="delSale('${s.id}')">Borrar</button></div>
      <div class="sub">${s.items.map(i => `${i.qty}× ${esc(i.name)}`).join(', ')}</div>
      ${agiBoxes(s)}${agiBar(s)}</div>`).join('');
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
      <label>Avisar stock bajo desde (gorras)</label><input id="low" type="number" inputmode="numeric" value="${st.low}">
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

function chg(id, d) {
  const p = S.products.find(x => x.id === id);
  if (!p) return;
  const nv = Math.max(0, Math.min(p.stock, (cart[id] || 0) + d));
  if (nv) cart[id] = nv; else delete cart[id];
  render();
}

function registrar() {
  const items = S.products.filter(p => cart[p.id]).map(p => ({ p, qty: cart[p.id] }));
  if (!items.length) return toast('Agrega gorras a la venta');
  const c = calc(items);
  S.sales.push({
    id: uid(), date: saleDate || todayStr(), qty: c.qty, total: c.total,
    A: c.A, G: c.G, I: c.I, cost: c.cost, season: S.settings.season,
    items: items.map(({ p, qty }) => ({ id: p.id, name: p.name, type: p.type, qty, cost: p.cost }))
  });
  items.forEach(({ p, qty }) => { p.stock -= qty; });
  cart = {}; saleDate = todayStr();
  save(); toast(`Venta guardada: ${money(c.total)}`); render();
}

function delSale(id) {
  const s = S.sales.find(x => x.id === id);
  if (!s || !confirm('¿Borrar esta venta? Las gorras regresan al stock.')) return;
  s.items.forEach(i => { const p = S.products.find(x => x.id === i.id); if (p) p.stock += i.qty; });
  S.sales = S.sales.filter(x => x.id !== id);
  save(); render();
}

/* ---------- acciones: inventario ---------- */
function addProduct() {
  const name = $('#pName').value.trim();
  if (!name) return toast('Escribe el nombre del modelo');
  S.products.push({ id: uid(), name, type: $('#pType').value, cost: num('#pCost'), stock: Math.max(0, Math.floor(num('#pStock'))) });
  save(); toast('Modelo guardado'); render();
}

function restock(id) {
  const p = S.products.find(x => x.id === id); if (!p) return;
  const qty = Math.floor(parseFloat(prompt('¿Cuántas gorras compraste?', '')));
  if (!qty || qty < 1) return;
  const uc = parseFloat(prompt('Costo por gorra en esta compra', p.cost));
  if (isNaN(uc)) return;
  p.cost = Math.round(((p.stock * p.cost + qty * uc) / (p.stock + qty)) * 100) / 100; // costo promedio
  p.stock += qty;
  S.buys.push({ id: uid(), date: todayStr(), productId: p.id, name: p.name, qty, unitCost: uc });
  save(); toast(`+${qty} al stock`); render();
}

function adjust(id) {
  const p = S.products.find(x => x.id === id); if (!p) return;
  const v = parseInt(prompt(`Stock real de "${p.name}"`, p.stock), 10);
  if (isNaN(v) || v < 0) return;
  p.stock = v; save(); render();
}

function delProd(id) {
  const p = S.products.find(x => x.id === id);
  if (!p || !confirm(`¿Borrar "${p.name}"? Las ventas pasadas se conservan.`)) return;
  S.products = S.products.filter(x => x.id !== id); delete cart[id];
  save(); render();
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
  a.download = `gorras-respaldo-${todayStr()}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

$('#importFile').addEventListener('change', e => {
  const f = e.target.files[0]; if (!f) return;
  const r = new FileReader();
  r.onload = () => {
    try {
      const d = JSON.parse(r.result);
      if (!d.products || !d.sales) throw 0;
      if (!confirm('Esto reemplaza los datos actuales. ¿Continuar?')) return;
      S = merge(clone(DEFAULTS), d); save(); toast('Respaldo restaurado'); render();
    } catch (err) { toast('Archivo no válido'); }
  };
  r.readAsText(f); e.target.value = '';
});

function resetAll() {
  if (!confirm('¿Borrar TODOS los datos de la app?')) return;
  if (!confirm('Esta acción no se puede deshacer. ¿Seguro?')) return;
  S = clone(DEFAULTS); cart = {}; save(); render();
}

/* ---------- arranque ---------- */
render();
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}

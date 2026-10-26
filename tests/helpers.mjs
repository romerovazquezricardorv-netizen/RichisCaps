// Utilidades compartidas por las pruebas: servidor local y datos de ejemplo.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const KEY = 'richiscaps_v2';           // misma llave que usa la app
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png' };

export function startServer() {
  const server = http.createServer((req, res) => {
    let p = decodeURIComponent(req.url.split('?')[0]);
    if (p.endsWith('/')) p += 'index.html';
    const f = path.join(ROOT, p);
    if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end('no encontrado'); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  });
  return new Promise(ok => server.listen(0, '127.0.0.1', () => ok({ server, url: `http://127.0.0.1:${server.address().port}` })));
}

export const seed = () => ({
  stock: { normal: { bodega: 20, M: 10, C: 5 }, premium: { bodega: 2, M: 3, C: 0 } },
  costs: { normal: 28, premium: 60 },
  sales: [], buys: [], meta: { lastBackup: Date.now() }
});

// ---- ventas de ejemplo: un mes actual y un mes anterior, en los dos locales y con los tres tipos ----
const pad = n => String(n).padStart(2, '0');
export const ymd = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const PRECIO = { one: [89, 50, 30, 1, 0, 28], two: [170, 100, 60, 2, 0, 56], prem: [185, 100, 60, 0, 1, 60] };   // precio, A, I, normales, premium, costo (por venta)
let seq = 0;
export function venta(kind, k, loc, date) {
  const [price, a, iv, n, pm, cost] = PRECIO[kind], total = price * k, A = a * k, I = iv * k;
  const id = 'ej' + String(seq++).padStart(4, '0');
  return { id, tk: id, date, loc, kind, k, n: n * k, pm: pm * k, qty: (n + pm) * k, total, A, G: total - A - I, I, cost: cost * k, season: 'normal' };
}
export function seedConVentas() {
  const d = seed(), hoy = new Date(), ant = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 15);
  const h = ymd(hoy), a = ymd(ant);
  d.sales.push(
    venta('one', 3, 'M', h), venta('two', 2, 'M', h), venta('prem', 1, 'M', h),
    venta('one', 2, 'C', h), venta('prem', 2, 'C', h),
    venta('one', 4, 'M', a), venta('two', 1, 'M', a), venta('prem', 1, 'C', a));
  return d;
}

export async function openApp(browser, url, { width = 390, height = 844, sw = 'block', data = seed(), path = '/index.html' } = {}) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 2, serviceWorkers: sw });
  await ctx.addInitScript(([k, v]) => { if (!localStorage.getItem(k)) localStorage.setItem(k, v); }, [KEY, JSON.stringify(data)]);
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(url + path);
  return { ctx, page, errors };
}

export const readData = page => page.evaluate(k => JSON.parse(localStorage.getItem(k)), KEY);

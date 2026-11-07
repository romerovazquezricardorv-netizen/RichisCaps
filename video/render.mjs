// Renderiza los cuadros 3D en paralelo con Chromium sin pantalla.
// Uso: node render.mjs <carpeta_salida> <total_cuadros> <fps> [procesos] [desde] [hasta] [paso]
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = require('/opt/node-tools/node_modules/playwright')); }

const root = path.dirname(fileURLToPath(import.meta.url));
const [out, totalS, fpsS, procS = '3', fromS = '0', toS, stepS = '1'] = process.argv.slice(2);
const total = +totalS, fps = +fpsS, nproc = +procS, from = +fromS, to = toS ? +toS : total, step = +stepS;
fs.mkdirSync(out, { recursive: true });

const types = { '.js': 'text/javascript', '.html': 'text/html', '.json': 'application/json' };
const server = http.createServer((q, s) => {
  const p = path.join(root, decodeURIComponent(q.url.split('?')[0]));
  fs.readFile(p, (e, d) => {
    if (e) { s.writeHead(404); return s.end(); }
    s.writeHead(200, { 'Content-Type': types[path.extname(p)] || 'application/octet-stream' });
    s.end(d);
  });
}).listen(0);
const port = server.address().port;

const frames = [];
for (let i = from; i < to; i += step) if (!fs.existsSync(path.join(out, `${String(i).padStart(5, '0')}.jpg`))) frames.push(i);
let next = 0, done = 0;
const t0 = Date.now();

async function worker() {
  const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  page.on('pageerror', e => console.error('ERROR página:', e.message));
  await page.goto(`http://localhost:${port}/escena3d/index.html?${process.env.ESCENA_QUERY || ''}`);
  await page.waitForFunction('window.ready === true', null, { timeout: 60000 });
  while (next < frames.length) {
    const i = frames[next++];
    const url = await page.evaluate(t => window.renderAt(t), i / fps);
    fs.writeFileSync(path.join(out, `${String(i).padStart(5, '0')}.jpg`), Buffer.from(url.split(',')[1], 'base64'));
    if (++done % 60 === 0) {
      const el = (Date.now() - t0) / 1000;
      console.log(`  3D: ${done}/${frames.length} cuadros, ${(el / done).toFixed(2)} s/cuadro, faltan ~${Math.round(el / done * (frames.length - done) / 60)} min`);
    }
  }
  await browser.close();
}
await Promise.all(Array.from({ length: nproc }, worker));
server.close();
console.log(`  3D listo: ${done} cuadros en ${((Date.now() - t0) / 1000).toFixed(0)} s`);

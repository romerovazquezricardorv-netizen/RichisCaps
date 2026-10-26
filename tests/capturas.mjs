// Genera capturas de las 5 pantallas en tests/screens/ para revisar el diseño:  npm run capturas
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { startServer, openApp, seedConVentas, ROOT } from './helpers.mjs';

const out = path.join(ROOT, 'tests', 'screens');
fs.mkdirSync(out, { recursive: true });
const { server, url } = await startServer();
const browser = await chromium.launch();
const { page } = await openApp(browser, url, { data: seedConVentas() });
await page.evaluate(() => { cart('n1', 2); cart('n2', 1); cart('p', 1); });      // un ticket con los tres tipos
for (const t of ['hoy', 'panel', 'stock', 'ventas', 'ajustes']) {
  await page.evaluate(x => go(x), t);
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(out, `${t}.png`), fullPage: t === 'panel' });
  console.log('captura', t);
}
await browser.close(); server.close();

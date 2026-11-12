// Pruebas de la Oficina del canal (oficina/):  npm test
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { startServer } from './helpers.mjs';

const { server, url } = await startServer();
const browser = await chromium.launch();
let fails = 0;
async function prueba(nombre, fn) {
  try { await fn(); console.log('  ✓', nombre); }
  catch (e) { fails++; console.log('  ✗', nombre, '\n     ', e.message.split('\n')[0]); }
}
async function abrir({ width = 390, scheme = 'light' } = {}) {
  const ctx = await browser.newContext({ viewport: { width, height: 844 }, colorScheme: scheme, serviceWorkers: 'block' });
  const page = await ctx.newPage(), errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(url + '/oficina/index.html');
  await page.waitForFunction(() => S.tendencias.ultimo > 0);
  return { ctx, page, errors };
}
const VISTAS = ['oficina', 'tendencias', 'guion', 'voz', 'animacion', 'miniaturas', 'studio', 'retencion', 'bandeja', 'ajustes'];

console.log('Oficina del canal · pruebas');

await prueba('la oficina tiene a los 7 integrantes y elige el nicho más en tendencia', async () => {
  const { ctx, page, errors } = await abrir();
  assert.equal(await page.locator('.desk').count(), 7);
  const r = await page.evaluate(() => ({ top: S.tendencias.ranking[0].id, elegido: nichoActual().id, orden: S.tendencias.ranking.map(x => x.score) }));
  assert.equal(r.elegido, r.top);
  assert.deepEqual(r.orden, [...r.orden].sort((a, b) => b - a));
  await ctx.close(); assert.deepEqual(errors, []);
});

await prueba('Tendencias manda alarma cuando un video hace 10× la media', async () => {
  const { ctx, page } = await abrir();
  const r = await page.evaluate(() => ({ hot: S.tendencias.videos.filter(v => v.ratio >= 10).length, alarmas: S.bandeja.filter(m => m.de === 'tendencias' && m.tipo === 'alarma').length }));
  assert.ok(r.hot >= 1, 'no hay videos a 10×'); assert.equal(r.alarmas, r.hot);
  await page.evaluate(() => escanear());   // no repite la alarma del mismo video
  const again = await page.evaluate(() => { const ids = S.bandeja.filter(m => m.de === 'tendencias').map(m => m.ref); return ids.length === new Set(ids).size; });
  assert.ok(again, 'alarma repetida');
  await ctx.close();
});

await prueba('producir: guion con gancho de 1 s, escenas únicas, 10 miniaturas y hora de publicar', async () => {
  const { ctx, page, errors } = await abrir();
  await page.evaluate(() => producir());
  const r = await page.evaluate(() => { const v = vid(); return {
    gancho: words(v.guion.lineas[0].texto).length, ini1: tiempos(v.guion.lineas)[1].ini,
    combos: v.escenas.map(key), total: S.combos.length, minis: v.minis.length, gana: v.ganadora,
    mejor: Math.max(...v.minis.map(m => m.ctr)), ctrGana: v.minis.find(m => m.k === v.ganadora).ctr,
    publicar: v.studio.publicar, titulo: v.studio.titulo }; });
  assert.ok(r.gancho <= 4); assert.equal(r.ini1, 1);
  assert.equal(new Set(r.combos).size, r.combos.length);
  assert.equal(r.minis, 10); assert.equal(r.ctrGana, r.mejor);
  assert.ok(new Date(r.publicar) > new Date()); assert.ok(r.titulo.length <= 100);
  // un segundo video no repite ninguna escena del primero
  await page.evaluate(() => { const v = nuevoVideo('otro tema de prueba'); asignarEscenas(v); });
  const u = await page.evaluate(() => { const all = S.videos.flatMap(v => v.escenas.map(key)); return all.length === new Set(all).size; });
  assert.ok(u, 'se repitió una escena');
  for (const h of VISTAS) { await page.evaluate(x => { location.hash = x; }, h); await page.waitForTimeout(60); }
  await ctx.close(); assert.deepEqual(errors, []);
});

await prueba('miniaturas: con clics reales gana la de mejor CTR real', async () => {
  const { ctx, page } = await abrir();
  await page.evaluate(() => { const v = nuevoVideo('prueba de miniaturas'); crearMinis(v); const peor = [...v.minis].sort((a, b) => a.ctr - b.ctr)[0];
    peor.real = { imp: '2000', clics: '300' }; v.minis.find(m => m !== peor).real = { imp: '2000', clics: '100' }; elegirGanadora(v); window.__peor = peor.k; });
  assert.equal(await page.evaluate(() => vid().ganadora), await page.evaluate(() => window.__peor));
  await ctx.close();
});

await prueba('Retención: si se van en el segundo 3, avisa al guionista y se reescribe el gancho', async () => {
  const { ctx, page } = await abrir();
  await page.evaluate(() => { const v = nuevoVideo('prueba de retención'); analizarRetencion(v, [[0, 100], [1, 80], [2, 65], [3, 52], [10, 40], [20, 30]], 'csv'); });
  const a = await page.evaluate(() => S.bandeja.find(m => m.de === 'retencion' && m.para === 'guion' && m.tipo === 'alarma'));
  assert.ok(a, 'no llegó el aviso'); assert.match(a.titulo, /segundo 3/);
  await page.evaluate(() => { location.hash = 'guion'; });
  const antes = await page.evaluate(() => ({ g: vid().guion.lineas[0].texto, f: vid().guion.formula }));
  await page.click('text=Reanalizar y reescribir gancho');
  const despues = await page.evaluate(() => ({ g: vid().guion.lineas[0].texto, f: vid().guion.formula, v: vid().version, abierto: S.bandeja.some(m => m.para === 'guion' && m.de === 'retencion' && !m.resuelto) }));
  assert.notEqual(despues.f, antes.f); assert.equal(despues.v, 2); assert.equal(despues.abierto, false);
  // una curva buena no manda alarma
  await page.evaluate(() => { S.bandeja = []; analizarRetencion(vid(), [[0, 100], [3, 85], [20, 60]], 'csv'); });
  assert.equal(await page.evaluate(() => S.bandeja.filter(m => m.tipo === 'alarma').length), 0);
  await ctx.close();
});

await prueba('sin scroll horizontal a 360 px en todas las vistas (claro y oscuro)', async () => {
  for (const scheme of ['light', 'dark']) {
    const { ctx, page } = await abrir({ width: 360, scheme });
    await page.evaluate(() => producir());
    for (const h of VISTAS) {
      await page.evaluate(x => { location.hash = x; }, h); await page.waitForTimeout(60);
      const sobra = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      assert.ok(sobra <= 0, `se desborda ${sobra}px en "${h}" (${scheme})`);
    }
    await ctx.close();
  }
});

await browser.close(); server.close();
if (fails) { console.log(`\n${fails} prueba(s) fallaron`); process.exit(1); }
console.log('\nTodo bien.');

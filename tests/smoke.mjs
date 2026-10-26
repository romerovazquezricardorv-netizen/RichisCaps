// Pruebas de humo con Playwright:  npm install && npx playwright install chromium && npm test
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { startServer, openApp, readData, seed, seedConVentas, venta, ymd } from './helpers.mjs';

const TABS = ['hoy', 'panel', 'stock', 'ventas', 'ajustes'];
const { server, url } = await startServer();
const browser = await chromium.launch();
let fails = 0;

async function prueba(nombre, fn) {
  try { await fn(); console.log('  ✓', nombre); }
  catch (e) { fails++; console.log('  ✗', nombre, '\n     ', e.message.split('\n')[0]); }
}
const plus = (page, sel, veces) => (async () => { for (let i = 0; i < veces; i++) await page.click(sel); })();
const cobrar = async (page, sel, veces) => { await plus(page, sel, veces); await page.click('#ticket .cobrar'); };
const N1 = '.prod.n1 .plus', N2 = '.prod.n2 .plus', P = '.prod.p .plus';          // los tres apartados de Hoy
const dinero = t => parseInt(t.replace(/[^0-9]/g, ''), 10);
// lee un número del panel: ámbito (all | M | C), tipo (one | two | prem) y cuenta (A | G | I | amt)
const celda = async (page, sc, kind, c) =>
  dinero(await page.textContent(`.kind[data-scope="${sc}"][data-kind="${kind}"] ${c === 'amt' ? '.amt' : '.c' + c + ' b'}`));

console.log('Gorv · pruebas de humo');

await prueba('carga y recorre las 5 pestañas sin errores', async () => {
  const { ctx, page, errors } = await openApp(browser, url, { data: seedConVentas() });
  for (const t of TABS) await page.evaluate(x => go(x), t);
  await ctx.close();
  assert.deepEqual(errors, []);
});

await prueba('sin scroll horizontal a 360, 390 y 412 px (con ventas y ticket lleno)', async () => {
  for (const width of [360, 390, 412]) {
    const { ctx, page } = await openApp(browser, url, { width, data: seedConVentas() });
    await page.evaluate(() => { cart('n1', 1); cart('n2', 1); cart('p', 1); });
    for (const t of TABS) {
      await page.evaluate(x => go(x), t);
      const sobra = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      assert.ok(sobra <= 0, `se desborda ${sobra}px en "${t}" a ${width}px`);
    }
    await ctx.close();
  }
});

/* ---------- 1. Hoy: tres apartados separados ---------- */

await prueba('Hoy tiene tres apartados separados: $89, promo $170 y premium $185', async () => {
  const { ctx, page } = await openApp(browser, url);
  const n = await page.locator('.prod').count();
  const t1 = await page.textContent('.prod.n1 .pi b'), t2 = await page.textContent('.prod.n2 .pi b'), t3 = await page.textContent('.prod.p .pi b');
  await ctx.close();
  assert.equal(n, 3);
  assert.ok(t1.includes('$89'), t1);
  assert.ok(t2.includes('$170'), t2);
  assert.ok(t3.includes('$185'), t3);
});

await prueba('gorra $89: cuesta $89 (A 50 · G 9 · I 30) y descuenta 1 del local', async () => {
  const { ctx, page } = await openApp(browser, url);
  await cobrar(page, N1, 1);
  const d = await readData(page);
  await ctx.close();
  const s = d.sales[0];
  assert.equal(d.sales.length, 1);
  assert.deepEqual([s.kind, s.k, s.total, s.A, s.G, s.I], ['one', 1, 89, 50, 9, 30]);
  assert.equal(d.stock.normal.M, 9);
});

await prueba('promo $170: un toque = $170 (A 100 · G 10 · I 60) y descuenta 2 normales', async () => {
  const { ctx, page } = await openApp(browser, url);
  await cobrar(page, N2, 1);
  const d = await readData(page);
  await ctx.close();
  const s = d.sales[0];
  assert.deepEqual([s.kind, s.k, s.n, s.total, s.A, s.G, s.I], ['two', 1, 2, 170, 100, 10, 60]);
  assert.equal(d.stock.normal.M, 8);
});

await prueba('premium $185 (A 100 · G 25 · I 60)', async () => {
  const { ctx, page } = await openApp(browser, url);
  await cobrar(page, P, 1);
  const d = await readData(page);
  await ctx.close();
  const s = d.sales[0];
  assert.deepEqual([s.kind, s.total, s.A, s.G, s.I], ['prem', 185, 100, 25, 60]);
  assert.equal(d.stock.premium.M, 2);
});

await prueba('ticket mixto: 2 de $89 + 1 promo + 1 premium = 3 registros; Deshacer los quita todos', async () => {
  const { ctx, page } = await openApp(browser, url);
  await plus(page, N1, 2); await plus(page, N2, 1); await plus(page, P, 1);
  const total = dinero(await page.textContent('#ticket .tkinfo b'));
  await page.click('#ticket .cobrar');
  const d = await readData(page);
  await page.click('#toast button');
  const d2 = await readData(page);
  await ctx.close();
  assert.equal(total, 178 + 170 + 185);
  assert.deepEqual(d.sales.map(s => [s.kind, s.total]).sort(), [['one', 178], ['prem', 185], ['two', 170]]);
  assert.equal(d.stock.normal.M, 10 - 2 - 2);
  assert.equal(d.stock.premium.M, 2);
  assert.equal(d2.sales.length, 0);
  assert.equal(d2.stock.normal.M, 10);
  assert.equal(d2.stock.premium.M, 3);
});

await prueba('temporada alta: gorra $95 y promo $180', async () => {
  const { ctx, page } = await openApp(browser, url);
  await page.evaluate(() => setSeason('alta'));
  await cobrar(page, N1, 1);
  await cobrar(page, N2, 1);
  const v = (await readData(page)).sales.map(s => s.total);
  await ctx.close();
  assert.deepEqual(v, [95, 180]);
});

await prueba('las gorras normales se comparten entre "$89" y "promo": no se vende de más', async () => {
  const data = seed(); data.stock.normal.M = 3;
  const { ctx, page } = await openApp(browser, url, { data });
  await page.click(N2);                                  // la promo usa 2 de las 3
  const unoLibre = !(await page.isDisabled(N1));
  await page.click(N1);                                  // queda 0
  const todoBloqueado = (await page.isDisabled(N1)) && (await page.isDisabled(N2));
  await ctx.close();
  assert.ok(unoLibre, 'debería quedar 1 para vender a $89');
  assert.ok(todoBloqueado, 'ya no debería dejar agregar más');
});

await prueba('Deshacer regresa la gorra al inventario', async () => {
  const { ctx, page } = await openApp(browser, url);
  await cobrar(page, N1, 1);
  await page.click('#toast button');
  const d = await readData(page);
  await ctx.close();
  assert.equal(d.sales.length, 0);
  assert.equal(d.stock.normal.M, 10);
});

await prueba('no deja vender lo que no hay (premium en Carrillo = 0)', async () => {
  const { ctx, page } = await openApp(browser, url);
  await page.evaluate(() => setLoc('C'));
  const bloqueado = await page.isDisabled(P);
  await ctx.close();
  assert.ok(bloqueado);
});

/* ---------- 2 y 3. Panel: solo meses, AGI por tipo y por local ---------- */

await prueba('el panel solo muestra meses (sin semana, sin "todo", sin últimos 7 días)', async () => {
  const { ctx, page } = await openApp(browser, url, { data: seedConVentas() });
  await page.evaluate(() => go('panel'));
  const texto = (await page.textContent('#view')).toLowerCase();
  const mes = await page.textContent('#monthName');
  await ctx.close();
  for (const prohibida of ['semana', 'últimos 7 días', 'por semana', 'todo']) assert.ok(!texto.includes(prohibida), `no debería decir "${prohibida}"`);
  assert.ok(/^(Enero|Febrero|Marzo|Abril|Mayo|Junio|Julio|Agosto|Septiembre|Octubre|Noviembre|Diciembre) \d{4}$/.test(mes.trim()), mes);
});

await prueba('panel: AGI de cada tipo, en total y por local (mes actual)', async () => {
  const { ctx, page } = await openApp(browser, url, { data: seedConVentas() });
  await page.evaluate(() => go('panel'));
  const hero = dinero(await page.textContent('.hero.dark .big'));
  const r = {
    // los dos locales juntos
    allOne: [await celda(page, 'all', 'one', 'amt'), await celda(page, 'all', 'one', 'A'), await celda(page, 'all', 'one', 'G'), await celda(page, 'all', 'one', 'I')],
    allTwo: [await celda(page, 'all', 'two', 'amt'), await celda(page, 'all', 'two', 'A'), await celda(page, 'all', 'two', 'G'), await celda(page, 'all', 'two', 'I')],
    allPrem: [await celda(page, 'all', 'prem', 'amt'), await celda(page, 'all', 'prem', 'A'), await celda(page, 'all', 'prem', 'G'), await celda(page, 'all', 'prem', 'I')],
    // Morelos
    mOne: [await celda(page, 'M', 'one', 'amt'), await celda(page, 'M', 'one', 'G')],
    mTwo: [await celda(page, 'M', 'two', 'amt'), await celda(page, 'M', 'two', 'A'), await celda(page, 'M', 'two', 'G'), await celda(page, 'M', 'two', 'I')],
    // Carrillo
    cOne: [await celda(page, 'C', 'one', 'amt'), await celda(page, 'C', 'one', 'G')],
    cTwo: [await celda(page, 'C', 'two', 'amt')],
    cPrem: [await celda(page, 'C', 'prem', 'amt'), await celda(page, 'C', 'prem', 'A'), await celda(page, 'C', 'prem', 'G'), await celda(page, 'C', 'prem', 'I')]
  };
  await ctx.close();
  assert.equal(hero, 1340);                                   // solo el mes actual; el mes anterior no se mezcla
  assert.deepEqual(r.allOne, [445, 250, 45, 150]);
  assert.deepEqual(r.allTwo, [340, 200, 20, 120]);
  assert.deepEqual(r.allPrem, [555, 300, 75, 180]);
  assert.deepEqual(r.mOne, [267, 27]);
  assert.deepEqual(r.mTwo, [340, 200, 20, 120]);
  assert.deepEqual(r.cOne, [178, 18]);
  assert.deepEqual(r.cTwo, [0]);                              // Carrillo no vendió promos: aparece en cero
  assert.deepEqual(r.cPrem, [370, 200, 50, 120]);
});

await prueba('panel: cada local tiene los tres tipos, también cuando no vendió', async () => {
  const { ctx, page } = await openApp(browser, url);
  await page.evaluate(() => go('panel'));
  const n = await page.locator('.kind').count();
  await ctx.close();
  assert.equal(n, 9);                                         // 3 tipos × (total, Morelos, Carrillo)
});

await prueba('panel: se cambia de mes con las flechas y el margen es del mes', async () => {
  const { ctx, page } = await openApp(browser, url, { data: seedConVentas() });
  await page.evaluate(() => go('panel'));
  const mesActual = (await page.textContent('#monthName')).trim();
  const sigBloqueado = await page.isDisabled('.mn[aria-label="Mes siguiente"]');
  await page.click('.mn[aria-label="Mes anterior"]');
  const mesAnt = (await page.textContent('#monthName')).trim();
  const hero = dinero(await page.textContent('.hero.dark .big'));
  const mTwo = await celda(page, 'M', 'two', 'amt');
  const antBloqueado = await page.isDisabled('.mn[aria-label="Mes anterior"]');
  const margen = dinero(await page.textContent('.kv.total b'));
  await page.click('.mn[aria-label="Mes siguiente"]');
  const vuelve = (await page.textContent('#monthName')).trim();
  await ctx.close();
  assert.ok(sigBloqueado, 'no se puede avanzar más allá del mes actual');
  assert.notEqual(mesAnt, mesActual);
  assert.equal(hero, 4 * 89 + 170 + 185);                     // 356 + 170 + 185 = 711
  assert.equal(mTwo, 170);
  assert.ok(antBloqueado, 'no hay meses anteriores al primero con ventas');
  assert.equal(margen, 711 - (4 * 28 + 56 + 60));             // ingresos - costo
  assert.equal(vuelve, mesActual);
});

await prueba('ventas viejas (un solo registro con n y pm) se separan por tipo sin perder dinero', async () => {
  const data = seed();
  data.sales.push({ id: 'viejo1', date: ymd(new Date()), loc: 'M', n: 3, pm: 1, qty: 4, total: 444, A: 250, G: 44, I: 150, cost: 144, season: 'normal' });
  const { ctx, page } = await openApp(browser, url, { data });
  const ventas = await page.evaluate(() => S.sales.map(s => [s.kind, s.k, s.total]).sort());
  await page.evaluate(() => go('panel'));
  const hero = dinero(await page.textContent('.hero.dark .big'));
  const promo = await celda(page, 'M', 'two', 'amt');
  await ctx.close();
  assert.deepEqual(ventas, [['one', 1, 89], ['prem', 1, 185], ['two', 1, 170]]);
  assert.equal(hero, 444);
  assert.equal(promo, 170);
});

/* ---------- diseño: iconos y barra de abajo ---------- */

await prueba('los 3 tipos tienen su icono de gorra (Hoy, Panel y Ventas)', async () => {
  const { ctx, page } = await openApp(browser, url, { data: seedConVentas() });
  const hoy = await page.$$eval('.prod .tile', t => t.map(x => [x.className.split(' ').find(c => c.startsWith('t-')), !!x.querySelector('svg')]));
  await page.evaluate(() => go('panel'));
  const panel = await page.locator('.kind .tile svg').count();
  await page.evaluate(() => go('ventas'));
  const ventas = await page.locator('.srow .tile svg').count();
  await ctx.close();
  assert.deepEqual(hoy, [['t-one', true], ['t-two', true], ['t-prem', true]]);
  assert.equal(panel, 9);
  assert.equal(ventas, 8);
});

await prueba('barra de abajo: la burbuja se desliza hasta la sección elegida', async () => {
  const { ctx, page } = await openApp(browser, url);
  const x = sel => page.evaluate(s => document.querySelector(s).getBoundingClientRect().x, sel);
  const inicio = await x('nav .lens');
  const botonInicio = await x('nav button[data-t="hoy"]');
  await page.click('nav button[data-t="ajustes"]');
  const dur = await page.evaluate(() => parseFloat(getComputedStyle(document.querySelector('nav .lens')).transitionDuration));
  const moviendo = await page.evaluate(() => document.querySelector('nav .lens').classList.contains('move'));
  await page.waitForTimeout(900);
  const fin = await x('nav .lens'), botonFin = await x('nav button[data-t="ajustes"]');
  await ctx.close();
  assert.ok(Math.abs(inicio - botonInicio) <= 1, 'al abrir, la burbuja está bajo "Hoy"');
  assert.ok(dur > 0.3, 'la burbuja debería animar su viaje (~0.5 s)');
  assert.ok(moviendo, 'la burbuja se estira mientras viaja');
  assert.ok(fin > inicio + 100 && Math.abs(fin - botonFin) <= 1, 'al terminar, la burbuja está bajo "Ajustes"');
});

await prueba('barra de abajo: con "reducir movimiento" la burbuja salta sin animar', async () => {
  const { ctx, page } = await openApp(browser, url);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.click('nav button[data-t="panel"]');
  const dur = await page.evaluate(() => parseFloat(getComputedStyle(document.querySelector('nav .lens')).transitionDuration));
  await ctx.close();
  assert.ok(dur < 0.01, `duración ${dur}`);
});

await prueba('el cristal esmerila donde pasa contenido por debajo (encabezado, barra y ticket)', async () => {
  const { ctx, page } = await openApp(browser, url);
  await page.evaluate(() => cart('n1', 1));
  const f = sel => page.evaluate(s => { const c = getComputedStyle(document.querySelector(s)); return c.backdropFilter || c.webkitBackdropFilter; }, sel);
  const r = [await f('header'), await f('nav'), await f('#ticket')];
  await ctx.close();
  for (const v of r) assert.ok(v && v.includes('blur'), `sin blur: ${v}`);
});

/* ---------- resumen del mes y animación de entrada ---------- */

await prueba('resumen del mes: abre la hoja, genera la imagen (1080 px) y la guarda', async () => {
  const { ctx, page, errors } = await openApp(browser, url, { data: seedConVentas() });
  await page.evaluate(() => go('panel'));
  await page.click('.sharebtn');
  await page.waitForSelector('#sheet.open img.sumimg', { timeout: 15000 });
  await page.waitForFunction(() => document.querySelector('.sumimg').naturalWidth > 0);
  const dim = await page.evaluate(() => { const i = document.querySelector('.sumimg'); return [i.naturalWidth, i.naturalHeight]; });
  const [descarga] = await Promise.all([page.waitForEvent('download'), page.click('#sheet button:has-text("Guardar imagen")')]);
  const nombre = descarga.suggestedFilename();
  await ctx.close();
  assert.equal(dim[0], 1080);
  assert.ok(dim[1] > 1800, `alto ${dim[1]}`);
  assert.ok(/^gorv-resumen-\d{4}-\d{2}\.png$/.test(nombre), nombre);
  assert.deepEqual(errors, []);
});

await prueba('resumen del mes: sin ventas en el mes avisa en vez de abrir la hoja', async () => {
  const { ctx, page } = await openApp(browser, url);
  await page.evaluate(() => go('panel'));
  await page.click('.sharebtn');
  const abierta = await page.evaluate(() => document.querySelector('#sheet').classList.contains('open'));
  const aviso = await page.textContent('#toast');
  await ctx.close();
  assert.ok(!abierta);
  assert.ok(aviso.includes('No hay ventas'), aviso);
});

await prueba('la hoja se cierra al tocar el fondo', async () => {
  const { ctx, page } = await openApp(browser, url, { data: seedConVentas() });
  await page.evaluate(() => go('panel'));
  await page.click('.sharebtn');
  await page.waitForSelector('#sheet.open');
  await page.mouse.click(195, 60);                       // arriba, sobre el fondo oscurecido
  await page.waitForFunction(() => !document.querySelector('#sheet').classList.contains('open'));
  await ctx.close();
});

await prueba('animación de entrada: aparece al abrir, se salta al tocar y no estorba en las demás pruebas', async () => {
  const normal = await openApp(browser, url);
  const sinTelon = await normal.page.locator('#launch').count();
  await normal.ctx.close();
  const { ctx, page } = await openApp(browser, url, { path: '/index.html?splash=1' });
  const visible = await page.locator('#launch').count();
  await page.mouse.click(195, 400);
  await page.waitForSelector('#launch', { state: 'detached', timeout: 3000 });
  const titulo = await page.textContent('#title');
  await ctx.close();
  assert.equal(sinTelon, 0);
  assert.equal(visible, 1);
  assert.equal(titulo.trim(), 'Hoy');
});

await prueba('animación de entrada: sola se retira a los ~1.3 s', async () => {
  const { ctx, page } = await openApp(browser, url, { path: '/index.html?splash=1' });
  await page.waitForSelector('#launch', { state: 'detached', timeout: 4000 });
  await ctx.close();
});

/* ---------- el resto ---------- */

await prueba('atajo del ícono: ?tab=panel abre el Panel', async () => {
  const { ctx, page } = await openApp(browser, url, { path: '/index.html?tab=panel' });
  const titulo = await page.textContent('#title');
  await ctx.close();
  assert.equal(titulo.trim(), 'Panel');
});

await prueba('funciona sin internet después de la primera visita', async () => {
  const { ctx, page } = await openApp(browser, url, { sw: 'allow' });
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.waitForFunction(() => navigator.serviceWorker.controller, null, { timeout: 10000 });
  await ctx.setOffline(true);
  await page.reload();
  const titulo = await page.textContent('#title');
  await ctx.close();
  assert.equal(titulo.trim(), 'Hoy');
});

await prueba('el movimiento existe y se apaga con "reducir movimiento"', async () => {
  const dur = page => page.evaluate(() => { const v = document.querySelector('#view'); const cs = getComputedStyle(v);
    return { nombre: cs.animationName, seg: parseFloat(cs.animationDuration) }; });
  const a = await openApp(browser, url);
  await a.page.evaluate(() => go('panel'));
  const normal = await dur(a.page);
  await a.ctx.close();
  const b = await openApp(browser, url);
  await b.page.emulateMedia({ reducedMotion: 'reduce' });
  await b.page.evaluate(() => go('panel'));
  const reducido = await dur(b.page);
  await b.ctx.close();
  assert.equal(normal.nombre, 'enter');
  assert.ok(normal.seg > 0.1, 'la entrada debería durar ~0.22 s');
  assert.ok(reducido.seg < 0.01, 'con reducir movimiento no debe animar');
});

await browser.close();
server.close();
console.log(fails ? `\n${fails} prueba(s) fallaron` : '\nTodo en orden ✔');
process.exit(fails ? 1 : 0);

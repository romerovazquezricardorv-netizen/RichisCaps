/* =========================================================
   OFICINA DEL CANAL
   Un equipo virtual de 7 integrantes que produce videos para YouTube:
   1 Tendencias · 2 Guion · 3 Voz y audio · 4 Animación · 5 Miniaturas · 6 Studio · 7 Retención
   Todo vive en el navegador (localStorage). Con una API key de YouTube
   Tendencias usa datos reales; con un ID de cliente OAuth, Studio sube
   el video y Retención lee la curva real. Sin eso, trabaja en modo demo.
   ========================================================= */
'use strict';
const KEY = 'oficina_v1';
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = () => Math.random().toString(36).slice(2, 9);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const fmt = n => n >= 1e6 ? (n / 1e6).toFixed(1).replace('.0', '') + ' M' : n >= 1e3 ? Math.round(n / 1e3) + ' mil' : String(Math.round(n));
const mmss = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
function hash(s) { let h = 2166136261; for (const c of String(s)) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0; }
function rng(seed) { let a = typeof seed === 'number' ? seed : hash(seed); return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const pick = (r, arr) => arr[Math.floor(r() * arr.length)];
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
const words = s => String(s).trim().split(/\s+/).filter(Boolean);
const WPS = 2.6;                          // palabras por segundo al narrar

/* ---------- el equipo ---------- */
const ICON = {
  tendencias: '<path d="M3 17l6-6 4 4 8-8M15 7h6v6"/>',
  guion: '<path d="M4 20h4L19 9l-4-4L4 16v4zM13 7l4 4"/>',
  voz: '<path d="M12 3a3 3 0 00-3 3v6a3 3 0 006 0V6a3 3 0 00-3-3zM5 11a7 7 0 0014 0M12 18v3"/>',
  animacion: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M10 9l5 3-5 3z"/>',
  miniaturas: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 15l5-5 4 4 3-3 6 6"/><circle cx="16" cy="9" r="1.5"/>',
  studio: '<path d="M12 16V4M7 9l5-5 5 5M4 20h16"/>',
  retencion: '<path d="M3 4v16h18M7 8c3 0 3 7 6 7s4-4 7-4"/>'
};
const TEAM = [
  { id: 'tendencias', n: 1, nombre: 'Lupe', rol: 'Tendencias', c: 'var(--c1)' },
  { id: 'guion', n: 2, nombre: 'Gael', rol: 'Guion', c: 'var(--c2)' },
  { id: 'voz', n: 3, nombre: 'Vale', rol: 'Voz y audio', c: 'var(--c3)' },
  { id: 'animacion', n: 4, nombre: 'Andrés', rol: 'Animación', c: 'var(--c4)' },
  { id: 'miniaturas', n: 5, nombre: 'Mia', rol: 'Miniaturas', c: 'var(--c5)' },
  { id: 'studio', n: 6, nombre: 'Sofi', rol: 'Studio', c: 'var(--c6)' },
  { id: 'retencion', n: 7, nombre: 'Rafa', rol: 'Retención', c: 'var(--c7)' }
];
const M = Object.fromEntries(TEAM.map(t => [t.id, t]));
const avatar = id => `<span class="av" style="--c:${M[id].c}"><svg viewBox="0 0 24 24">${ICON[id]}</svg></span>`;

/* ---------- nichos candidatos (Tendencias se queda con el que más sube) ---------- */
const NICHOS = [
  { id: 'curiosidades', nombre: 'Curiosidades y datos', q: 'curiosidades datos que no sabías', temas: ['el cerebro', 'el océano profundo', 'el espacio', 'los animales más raros', 'la comida chatarra'] },
  { id: 'misterios', nombre: 'Misterios sin resolver', q: 'misterios sin resolver', temas: ['el triángulo de las Bermudas', 'las ciudades perdidas', 'las señales del espacio', 'los barcos fantasma'] },
  { id: 'terror', nombre: 'Historias de terror animadas', q: 'historias de terror animadas', temas: ['la casa del vecino', 'el turno de noche', 'el elevador', 'la llamada de las 3 a.m.'] },
  { id: 'finanzas', nombre: 'Dinero y finanzas personales', q: 'finanzas personales ahorro', temas: ['ahorrar con poco sueldo', 'las tarjetas de crédito', 'invertir desde cero', 'los gastos hormiga'] },
  { id: 'ia', nombre: 'Inteligencia artificial', q: 'inteligencia artificial herramientas', temas: ['la IA que hace videos', 'los trabajos que cambian con la IA', 'los agentes de IA', 'la IA en el celular'] },
  { id: 'futbol', nombre: 'Fútbol', q: 'fútbol noticias', temas: ['los fichajes más caros', 'los goles imposibles', 'los estadios más grandes', 'las rachas históricas'] },
  { id: 'emprender', nombre: 'Emprender un negocio', q: 'emprender negocio desde cero', temas: ['vender por WhatsApp', 'un negocio con $1000', 'los errores al emprender', 'subir precios sin perder clientes'] },
  { id: 'streetwear', nombre: 'Gorras y streetwear', q: 'gorras streetwear', temas: ['las gorras más vendidas', 'cómo saber si una gorra es original', 'las marcas que todos copian', 'el drop que se agotó en minutos'] }
];

/* ---------- ganchos: lo que se dice en el segundo 1 (máx. 4 palabras) + el remate ---------- */
const GANCHOS = [
  { id: 'pregunta', nombre: 'Pregunta directa', punch: '¿Sabías esto?', sigue: '{Tema} esconde algo que casi nadie nota.' },
  { id: 'contraria', nombre: 'Opinión contraria', punch: 'Todos lo hacen mal.', sigue: 'Y con {tema} el error sale caro.' },
  { id: 'numero', nombre: 'Número concreto', punch: 'Tres segundos.', sigue: 'Es lo que tarda {tema} en cambiarlo todo.' },
  { id: 'prohibido', nombre: 'Lo prohibido', punch: 'Esto no debería existir.', sigue: 'Pero existe, y tiene que ver con {tema}.' },
  { id: 'resultado', nombre: 'Resultado primero', punch: 'Funcionó. Demasiado bien.', sigue: 'Probé {tema} y esto fue lo que pasó.' },
  { id: 'alto', nombre: 'Interrupción', punch: '¡Alto! No deslices.', sigue: 'Si te interesa {tema}, esto te va a servir.' },
  { id: 'historia', nombre: 'Mini historia', punch: 'Lo perdió todo.', sigue: 'Por culpa de {tema}. Y nadie lo vio venir.' },
  { id: 'reto', nombre: 'Reto al público', punch: 'Apuesto a que fallas.', sigue: 'Adivina qué tiene que ver {tema} con esto.' },
  { id: 'contraste', nombre: 'Contraste', punch: '$10 contra $1000.', sigue: 'Así de grande es la diferencia en {tema}.' },
  { id: 'misterio', nombre: 'Misterio', punch: 'Nadie sabe por qué.', sigue: 'Pero {tema} sigue pasando, y hoy lo explicamos.' }
];
const GIROS = ['Pero aquí viene lo raro…', 'Y espera, porque esto se pone peor.', 'Ahora, fíjate en este detalle.', 'Aquí es donde casi todos se equivocan.', 'Y esto nadie lo esperaba.'];

/* ---------- estado ---------- */
const DEF = () => ({
  cfg: { theme: 'auto', apiKey: '', clientId: '', region: 'MX', lang: 'es', outlier: 10, ret3: 70, auto: 30, formato: 'short', fijarNicho: '' },
  canal: { nombre: 'Mi canal', handle: '', conectado: null },
  tendencias: { ranking: [], videos: [], ultimo: 0, avisados: [], modo: 'demo' },
  videos: [], actual: null,
  combos: [],                               // combinaciones de escena ya usadas (nunca se repiten)
  formulas: {},                             // historial de cada gancho: usos y caídas en el segundo 3
  bandeja: [],
  audiencia: null,
  log: {}                                   // última línea de cada escritorio
});
let S;
try { S = Object.assign(DEF(), JSON.parse(localStorage.getItem(KEY)) || {}); S.cfg = Object.assign(DEF().cfg, S.cfg); } catch (e) { S = DEF(); }
if (!S.audiencia) S.audiencia = audienciaBase();
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { toast('No se pudo guardar: memoria llena'); } };
const vid = () => S.videos.find(v => v.id === S.actual) || null;
const working = new Set();
const mem = { voz: {}, video: {}, musica: {} };   // grabaciones y videos: solo en memoria (pesan mucho)

function audienciaBase() {   // patrón típico de audiencia hispana: tarde-noche, más fuerte en fin de semana
  return Array.from({ length: 7 }, (_, d) => Array.from({ length: 24 }, (_, h) => {
    let v = h < 7 ? .05 : h < 12 ? .2 + (h - 7) * .04 : h < 18 ? .45 + (h - 12) * .05 : h <= 21 ? .85 + (h === 20 ? .15 : 0) : .55 - (h - 22) * .15;
    if (d >= 5) v = Math.min(1, v + (h >= 11 && h <= 16 ? .2 : .05));
    return +clamp(v, 0, 1).toFixed(2);
  }));
}

/* ---------- avisos ---------- */
let toastT;
function toast(t, alarm) { const el = $('#toast'); el.textContent = t; el.classList.toggle('alarm', !!alarm); el.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('on'), alarm ? 5000 : 2600); }
function beep() {
  try { const a = new (window.AudioContext || window.webkitAudioContext)(); [0, .18, .36].forEach(t => { const o = a.createOscillator(), g = a.createGain(); o.frequency.value = 880; o.connect(g); g.connect(a.destination); g.gain.setValueAtTime(.2, a.currentTime + t); g.gain.exponentialRampToValueAtTime(.001, a.currentTime + t + .15); o.start(a.currentTime + t); o.stop(a.currentTime + t + .16); }); setTimeout(() => a.close(), 800); } catch (e) {}
}
function alerta({ de, para, tipo = 'info', titulo, texto, videoId = null, ref = null }) {
  S.bandeja.unshift({ id: uid(), de, para, tipo, titulo, texto, videoId, ref, ts: Date.now(), leido: false, resuelto: false });
  S.bandeja = S.bandeja.slice(0, 200);
  save();
  if (tipo === 'alarma') {
    beep(); navigator.vibrate?.([200, 100, 200]); toast('🚨 ' + titulo, true);
    if ('Notification' in window && Notification.permission === 'granted') try { new Notification(titulo, { body: texto, icon: '../icon-192.png' }); } catch (e) {}
  }
  badge();
}
function badge() { const n = S.bandeja.filter(m => !m.leido).length, d = $('#dot'); d.textContent = n > 99 ? '99+' : n; d.hidden = !n; }
function log(id, t) { S.log[id] = t; save(); const el = document.querySelector(`.desk[data-id="${id}"] .screen`); if (el) el.innerHTML = `<span class="ln">${esc(t)}</span>`; }
async function trabajando(id, fn) {
  working.add(id); document.querySelector(`.desk[data-id="${id}"]`)?.classList.add('working');
  try { return await fn(); } finally { working.delete(id); document.querySelector(`.desk[data-id="${id}"]`)?.classList.remove('working'); }
}

/* =========================================================
   1. TENDENCIAS
   ========================================================= */
async function yt(path, params) {
  const u = new URL('https://www.googleapis.com/youtube/v3/' + path);
  Object.entries({ ...params, key: S.cfg.apiKey }).forEach(([k, v]) => u.searchParams.set(k, v));
  const r = await fetch(u); const j = await r.json();
  if (!r.ok) throw new Error(j.error?.message || 'YouTube respondió ' + r.status);
  return j;
}
async function escanearReal() {
  const desde = new Date(Date.now() - 7 * 864e5).toISOString(), ranking = [], todos = [];
  for (const n of NICHOS) {
    log('tendencias', `Buscando "${n.nombre}"…`);
    const s = await yt('search', { part: 'snippet', q: n.q, type: 'video', order: 'viewCount', publishedAfter: desde, maxResults: 15, regionCode: S.cfg.region, relevanceLanguage: S.cfg.lang });
    const ids = s.items.map(i => i.id.videoId).filter(Boolean);
    if (!ids.length) { ranking.push({ id: n.id, score: 0, n: 0 }); continue; }
    const v = await yt('videos', { part: 'snippet,statistics', id: ids.join(',') });
    const chIds = [...new Set(v.items.map(i => i.snippet.channelId))];
    const ch = await yt('channels', { part: 'statistics', id: chIds.join(',') });
    const media = Object.fromEntries(ch.items.map(c => [c.id, (+c.statistics.viewCount || 0) / Math.max(1, +c.statistics.videoCount || 1)]));
    let score = 0;
    for (const i of v.items) {
      const views = +i.statistics.viewCount || 0, horas = Math.max(1, (Date.now() - new Date(i.snippet.publishedAt)) / 36e5);
      score += views / horas;
      todos.push({ id: i.id, nicho: n.id, title: i.snippet.title, channel: i.snippet.channelTitle, views, media: media[i.snippet.channelId] || 0, horas, url: 'https://youtu.be/' + i.id });
    }
    ranking.push({ id: n.id, score, n: v.items.length });
  }
  return { ranking, videos: todos };
}
function escanearDemo() {
  const dia = new Date().toISOString().slice(0, 10), ranking = [], todos = [], r0 = rng(dia + S.tendencias.ultimo);
  for (const n of NICHOS) {
    const r = rng(n.id + dia), base = 200 + r() * 1800 * (n.id === pick(rng(dia), NICHOS).id ? 2.4 : 1);
    let score = 0;
    for (let k = 0; k < 12; k++) {
      const media = 3000 + r() * 120000, horas = 4 + r() * 160;
      let views = media * Math.exp((r() - .5) * 1.6) * (base / 900);
      if (r0() < .015) views = media * (10 + r0() * 14);        // de vez en cuando, un video explota
      const t = pick(r, ['Lo que nadie te dice de {x}', '5 cosas de {x} que te van a volar la cabeza', 'Probé {x} por 30 días', 'El error más grande con {x}', 'Por qué {x} está cambiando todo', 'La verdad sobre {x}']).replace('{x}', pick(r, n.temas));
      score += views / horas;
      const vidId = 'demo' + hash(n.id + k + dia + t).toString(36);
      todos.push({ id: vidId, nicho: n.id, title: t, channel: 'Canal ' + cap(pick(r, ['nova', 'lumen', 'kairo', 'vela', 'orbe', 'zeta', 'rumbo', 'pixel'])), views: Math.round(views), media: Math.round(media), horas, url: '', tema: t });
    }
    ranking.push({ id: n.id, score, n: 12 });
  }
  // la primera vez siempre hay un caso para que se vea la alarma
  if (!S.tendencias.ultimo && !todos.some(v => v.views >= v.media * S.cfg.outlier)) { const v = todos.find(x => x.nicho === ranking.sort((a, b) => b.score - a.score)[0].id); v.views = Math.round(v.media * 13.4); }
  return { ranking, videos: todos };
}
async function escanear() {
  return trabajando('tendencias', async () => {
    log('tendencias', 'Revisando lo que pasa en YouTube…');
    let res, modo = S.cfg.apiKey ? 'real' : 'demo';
    try { res = modo === 'real' ? await escanearReal() : (await sleep(700), escanearDemo()); }
    catch (e) { log('tendencias', 'Error: ' + e.message); toast('Tendencias: ' + e.message); return; }
    res.ranking.sort((a, b) => b.score - a.score);
    const max = res.ranking[0]?.score || 1;
    res.ranking.forEach(x => x.pct = Math.round(x.score / max * 100));
    res.videos.forEach(v => v.ratio = v.media ? v.views / v.media : 0);
    S.tendencias = { ...S.tendencias, ranking: res.ranking, videos: res.videos, ultimo: Date.now(), modo };
    const top = nichoActual();
    // alarma: un video hace 10 veces (o lo que digas en Ajustes) la media de su canal
    const hot = res.videos.filter(v => v.ratio >= S.cfg.outlier && !S.tendencias.avisados.includes(v.id)).sort((a, b) => b.ratio - a.ratio);
    for (const v of hot) {
      S.tendencias.avisados.push(v.id);
      alerta({ de: 'tendencias', para: 'guion', tipo: 'alarma', ref: v.id,
        titulo: `Video a ${v.ratio.toFixed(1)}× la media`,
        texto: `"${v.title}" de ${v.channel} lleva ${fmt(v.views)} vistas; ese canal promedia ${fmt(v.media)}. Nicho: ${nombreNicho(v.nicho)}. Sirve como tema para el próximo guion.` });
    }
    S.tendencias.avisados = S.tendencias.avisados.slice(-500);
    log('tendencias', `Nicho #1: ${top.nombre}${hot.length ? ` · 🚨 ${hot.length} video(s) a +${S.cfg.outlier}×` : ''}`);
    save(); pintarTop();
    return top;
  });
}
const nombreNicho = id => (NICHOS.find(n => n.id === id) || {}).nombre || id;
function nichoActual() {
  const id = S.cfg.fijarNicho || S.tendencias.ranking[0]?.id || 'curiosidades';
  return NICHOS.find(n => n.id === id) || NICHOS[0];
}
function ideas() {   // temas para el guionista: primero los que explotaron en el nicho #1
  const n = nichoActual();
  const vs = S.tendencias.videos.filter(v => v.nicho === n.id).sort((a, b) => b.ratio - a.ratio).slice(0, 5);
  return vs.length ? vs.map(v => ({ tema: temaDe(v.title, n), from: v })) : n.temas.map(t => ({ tema: t }));
}
function temaDe(title, n) {
  const t = n.temas.find(x => title.toLowerCase().includes(x.toLowerCase()));
  return t || title.replace(/[#|].*$/, '').replace(/[“”"]/g, '').trim().slice(0, 60);
}

/* =========================================================
   2. GUION: gancho en el primer segundo
   ========================================================= */
function elegirFormula(excluir = []) {
  // primero las que nunca se han probado; luego la que menos se ha caído en el segundo 3
  const cand = GANCHOS.filter(g => !excluir.includes(g.id));
  return cand.map(g => { const f = S.formulas[g.id] || { usos: 0, caidas: 0 }; return { g, s: f.usos ? 1 - f.caidas / f.usos : 1.2 + Math.random() * .1 }; })
    .sort((a, b) => b.s - a.s)[0].g;
}
function crearGuion(tema, formula, formato) {
  const T = cap(tema), f = s => s.replace(/\{Tema\}/g, T).replace(/\{tema\}/g, tema);
  const r = rng(tema + formula.id), puntos = formato === 'largo' ? 5 : 3;
  const L = [
    { tipo: 'gancho', texto: formula.punch },
    { tipo: 'gancho2', texto: f(formula.sigue) },
    { tipo: 'promesa', texto: `Quédate hasta el final: el punto ${puntos} es el que nadie se espera.` }
  ];
  for (let i = 1; i <= puntos; i++) {
    L.push({ tipo: 'punto', texto: `${i === 1 ? 'Primero' : i === puntos ? 'Y por último' : `Número ${i}`}: [dato ${i} sobre ${tema}, concreto y con una cifra].` });
    if (formato === 'largo') L.push({ tipo: 'punto', texto: `[Ejemplo real o historia corta que demuestre el punto ${i}].` });
    if (i < puntos) L.push({ tipo: 'giro', texto: GIROS[(i + Math.floor(r() * 5)) % GIROS.length] });
  }
  L.push({ tipo: 'cierre', texto: `Así que la próxima vez que pienses en ${tema}, acuérdate del punto ${puntos}.` });
  L.push({ tipo: 'cta', texto: 'Suscríbete: mañana sale la parte 2.' });
  return L;
}
function tiempos(lineas) {
  let t = 0;
  return lineas.map((l, i) => { const d = i === 0 ? 1 : Math.max(1.2, words(l.texto).length / WPS); const r = { ini: t, dur: d }; t += d; return r; });
}
const duracion = v => { const ts = tiempos(v.guion.lineas); const l = ts[ts.length - 1]; return l ? l.ini + l.dur : 0; };
function revisarGancho(l0) {
  const n = words(l0).length;
  return n <= 4 ? { ok: true, t: `Gancho de ${n} palabra${n > 1 ? 's' : ''}: cabe en el primer segundo.` } : { ok: false, t: `El gancho tiene ${n} palabras: en 1 segundo caben 4 como máximo. Recórtalo.` };
}
function nuevoVideo(tema, from) {
  const formula = elegirFormula();
  const v = { id: uid(), creado: Date.now(), tema, nicho: nichoActual().id, from: from ? { title: from.title, ratio: from.ratio } : null,
    formato: S.cfg.formato, version: 1, guion: { formula: formula.id, lineas: crearGuion(tema, formula, S.cfg.formato), historial: [] },
    voz: { voz: '', vel: 1.05, tono: 1, musica: .25 }, escenas: [], minis: [], ganadora: null,
    studio: null, publicado: null, retencion: null, paso: { guion: true } };
  (S.formulas[formula.id] ||= { usos: 0, caidas: 0 }).usos++;
  S.videos.unshift(v); S.actual = v.id; save();
  log('guion', `v1 de "${tema}" · gancho: ${formula.punch}`);
  return v;
}
function reescribirGancho(v, motivo) {
  const prev = v.guion.formula, falladas = v.guion.historial.map(h => h.formula).concat(prev);
  const g = elegirFormula(falladas);
  v.guion.historial.push({ version: v.version, formula: prev, gancho: v.guion.lineas[0].texto, motivo, ts: Date.now() });
  v.version++; v.guion.formula = g.id;
  const nuevo = crearGuion(v.tema, g, v.formato);
  v.guion.lineas[0] = nuevo[0]; v.guion.lineas[1] = nuevo[1];
  (S.formulas[g.id] ||= { usos: 0, caidas: 0 }).usos++;
  // lo que dependía del gancho se tiene que rehacer
  v.paso = { guion: true }; v.escenas = []; v.minis = []; v.ganadora = null; v.studio = null; v.retencion = null; v.publicado = null;
  delete mem.voz[v.id]; delete mem.video[v.id];
  S.bandeja.filter(m => m.videoId === v.id && m.para === 'guion' && !m.resuelto).forEach(m => { m.resuelto = true; m.leido = true; });
  alerta({ de: 'guion', para: 'voz', titulo: `Guion v${v.version} listo`, texto: `Nuevo gancho para "${v.tema}": "${g.punch}" (${g.nombre}). Hay que volver a grabar la voz, las escenas 1 y 2 y la miniatura.`, videoId: v.id });
  log('guion', `v${v.version} · nuevo gancho: ${g.punch}`);
  save();
}

/* =========================================================
   3. VOZ Y AUDIO
   ========================================================= */
let voces = [];
function cargarVoces() { voces = (speechSynthesis?.getVoices?.() || []).filter(v => v.lang.toLowerCase().startsWith('es')); }
if ('speechSynthesis' in window) { cargarVoces(); speechSynthesis.onvoiceschanged = () => { cargarVoces(); if (ruta() === 'voz') render(); }; }
function leer(v, desde = 0) {
  if (!('speechSynthesis' in window)) return toast('Este navegador no tiene voz sintética');
  speechSynthesis.cancel();
  const ls = v.guion.lineas, voz = voces.find(x => x.name === v.voz.voz) || voces[0];
  ls.slice(desde).forEach((l, k) => {
    const u = new SpeechSynthesisUtterance(l.texto.replace(/\[|\]/g, ''));
    if (voz) u.voice = voz; u.lang = voz?.lang || 'es-MX'; u.rate = v.voz.vel; u.pitch = v.voz.tono;
    u.onstart = () => { document.querySelectorAll('.ln-s').forEach((el, i) => el.classList.toggle('speaking', i === desde + k)); };
    u.onend = () => { if (desde + k === ls.length - 1) document.querySelectorAll('.ln-s').forEach(el => el.classList.remove('speaking')); };
    speechSynthesis.speak(u);
  });
}
let grab = null;
async function grabarVoz(v, btn) {
  if (grab) { grab.rec.stop(); return; }
  let stream;
  try { stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } }); }
  catch (e) { return toast('No hay permiso para el micrófono'); }
  const rec = new MediaRecorder(stream), parts = [];
  rec.ondataavailable = e => e.data.size && parts.push(e.data);
  rec.onstop = () => { stream.getTracks().forEach(t => t.stop()); mem.voz[v.id] = new Blob(parts, { type: rec.mimeType }); grab = null; v.paso.voz = true; save(); log('voz', `Voz grabada para "${v.tema}"`); render(); };
  grab = { rec }; rec.start(); btn.textContent = '■ Detener grabación';
  // teleprompter: resalta cada línea a su tiempo
  const ts = tiempos(v.guion.lineas), t0 = performance.now();
  const tick = () => { if (!grab) return; const t = (performance.now() - t0) / 1000 * v.voz.vel; const i = ts.findIndex(x => t < x.ini + x.dur);
    document.querySelectorAll('.ln-s').forEach((el, k) => el.classList.toggle('speaking', k === i)); requestAnimationFrame(tick); };
  tick();
}
// música de fondo + "whoosh" en cada cambio de escena, generada aquí mismo (sin derechos de autor)
async function crearMusica(v) {
  const dur = Math.ceil(duracion(v)) + 1, sr = 44100, ctx = new OfflineAudioContext(2, sr * dur, sr), r = rng(v.id + v.version);
  const bpm = 92 + Math.floor(r() * 28), beat = 60 / bpm, master = ctx.createGain(); master.gain.value = v.voz.musica; master.connect(ctx.destination);
  const raiz = 110 * Math.pow(2, Math.floor(r() * 7) / 12);
  const prog = pick(r, [[0, 8, 3, 10], [0, 5, 8, 7], [0, 3, 8, 10], [0, 10, 8, 7]]);
  const noise = ctx.createBuffer(1, sr, sr); { const d = noise.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; }
  for (let bar = 0, t = 0; t < dur; bar++, t += beat * 4) {
    const semi = prog[bar % 4];
    [0, 3, 7, 12].forEach(iv => {   // acorde menor suave
      const o = ctx.createOscillator(), g = ctx.createGain(), lp = ctx.createBiquadFilter();
      o.type = 'sawtooth'; o.frequency.value = raiz * Math.pow(2, (semi + iv) / 12); lp.type = 'lowpass'; lp.frequency.value = 900;
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.045, t + .3); g.gain.linearRampToValueAtTime(0, t + beat * 4);
      o.connect(lp); lp.connect(g); g.connect(master); o.start(t); o.stop(t + beat * 4 + .05);
    });
    for (let b = 0; b < 4; b++) {
      const tb = t + b * beat; if (tb >= dur) break;
      const k = ctx.createOscillator(), kg = ctx.createGain();   // bombo
      k.frequency.setValueAtTime(140, tb); k.frequency.exponentialRampToValueAtTime(40, tb + .15);
      kg.gain.setValueAtTime(.6, tb); kg.gain.exponentialRampToValueAtTime(.001, tb + .25); k.connect(kg); kg.connect(master); k.start(tb); k.stop(tb + .3);
      const h = ctx.createBufferSource(), hp = ctx.createBiquadFilter(), hg = ctx.createGain();   // charles
      h.buffer = noise; hp.type = 'highpass'; hp.frequency.value = 7000; hg.gain.setValueAtTime(.08, tb + beat / 2); hg.gain.exponentialRampToValueAtTime(.001, tb + beat / 2 + .05);
      h.connect(hp); hp.connect(hg); hg.connect(master); h.start(tb + beat / 2, Math.random() * .5, .08);
    }
  }
  tiempos(v.guion.lineas).slice(1).forEach(({ ini }) => {   // whoosh en cada corte
    const s = ctx.createBufferSource(), bp = ctx.createBiquadFilter(), g = ctx.createGain(), t = Math.max(0, ini - .25);
    s.buffer = noise; bp.type = 'bandpass'; bp.Q.value = 2; bp.frequency.setValueAtTime(400, t); bp.frequency.exponentialRampToValueAtTime(4000, t + .3);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.5, t + .2); g.gain.linearRampToValueAtTime(0, t + .35);
    s.connect(bp); bp.connect(g); g.connect(ctx.destination); s.start(t, 0, .4);
  });
  const buf = await ctx.startRendering();
  mem.musica[v.id] = buf; v.paso.audio = true; save();
  log('voz', `Música ${bpm} BPM + ${v.guion.lineas.length - 1} whooshes listos`);
  return buf;
}
function wav(buf) {
  const ch = buf.numberOfChannels, len = buf.length * ch * 2 + 44, out = new DataView(new ArrayBuffer(len)); let p = 0;
  const s = t => { for (const c of t) out.setUint8(p++, c.charCodeAt(0)); }, u32 = x => { out.setUint32(p, x, true); p += 4; }, u16 = x => { out.setUint16(p, x, true); p += 2; };
  s('RIFF'); u32(len - 8); s('WAVE'); s('fmt '); u32(16); u16(1); u16(ch); u32(buf.sampleRate); u32(buf.sampleRate * ch * 2); u16(ch * 2); u16(16); s('data'); u32(buf.length * ch * 2);
  const data = Array.from({ length: ch }, (_, i) => buf.getChannelData(i));
  for (let i = 0; i < buf.length; i++) for (let c = 0; c < ch; c++) { out.setInt16(p, clamp(data[c][i], -1, 1) * 32767, true); p += 2; }
  return new Blob([out], { type: 'audio/wav' });
}
function descargar(blob, nombre) { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = nombre; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); }

/* =========================================================
   4. ANIMACIÓN: cada escena con una combinación que nunca se repite
   ========================================================= */
const FONDOS = ['degradado', 'rejilla', 'puntos', 'rayas', 'radial', 'rayos', 'ondas', 'bokeh'];
const MOVS = ['acercar', 'alejar', 'deslizar', 'subir', 'girar', 'maquina', 'rebote', 'dividir', 'pulso', 'glitch'];
const TRANS = ['fundido', 'barrido', 'iris', 'corte', 'destello', 'persiana'];
const PALS = [['#0f0c29', '#302b63', '#ffcc00', '#ffffff'], ['#ff512f', '#dd2476', '#fff200', '#ffffff'], ['#000000', '#1f1f1f', '#e62117', '#ffffff'],
  ['#11998e', '#38ef7d', '#0b3d2e', '#ffffff'], ['#fc466b', '#3f5efb', '#ffe259', '#ffffff'], ['#232526', '#414345', '#00f5d4', '#ffffff'],
  ['#ffe259', '#ffa751', '#1d1d1d', '#111111'], ['#141e30', '#243b55', '#ff6b6b', '#ffffff'], ['#f7f7f7', '#dfe6e9', '#e62117', '#111111'],
  ['#3a1c71', '#d76d77', '#ffaf7b', '#ffffff'], ['#000428', '#004e92', '#7dffb2', '#ffffff'], ['#42275a', '#734b6d', '#ffd166', '#ffffff']];
function asignarEscenas(v) {
  const usados = new Set(S.combos), r = rng(v.id + v.version + S.combos.length), esc_ = [];
  v.guion.lineas.forEach((l, i) => {
    let c, tries = 0;
    do { c = { fondo: Math.floor(r() * FONDOS.length), mov: Math.floor(r() * MOVS.length), pal: Math.floor(r() * PALS.length), trans: Math.floor(r() * TRANS.length) }; tries++; }
    while ((usados.has(key(c)) || (esc_.length && esc_[esc_.length - 1].mov === c.mov) || (esc_.length && esc_[esc_.length - 1].pal === c.pal)) && tries < 5000);
    usados.add(key(c)); esc_.push({ ...c, i, texto: l.texto.replace(/\[|\]/g, ''), tipo: l.tipo });
  });
  v.escenas = esc_; S.combos = [...usados]; v.paso.animacion = true; save();
  log('animacion', `${esc_.length} escenas únicas (${S.combos.length} usadas en total)`);
}
const key = c => `${c.fondo}.${c.mov}.${c.pal}.${c.trans}`;
function wrap(ctx, text, maxW) {
  const out = []; let line = '';
  for (const w of words(text)) { const t = line ? line + ' ' + w : w; if (ctx.measureText(t).width > maxW && line) { out.push(line); line = w; } else line = t; }
  if (line) out.push(line); return out;
}
function dibujarEscena(ctx, e, t, W, H, tAbs) {
  const [a, b, acc, ink] = PALS[e.pal], r = rng(e.i * 977 + e.pal);
  ctx.save();
  // fondo
  const g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, a); g.addColorStop(1, b); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.globalAlpha = .18; ctx.fillStyle = acc; ctx.strokeStyle = acc; ctx.lineWidth = 2;
  switch (FONDOS[e.fondo]) {
    case 'rejilla': { const s = 64, o = (tAbs * 30) % s; for (let x = -s + o; x < W; x += s) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); } for (let y = -s + o; y < H; y += s) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); } break; }
    case 'puntos': for (let x = 0; x < W; x += 48) for (let y = 0; y < H; y += 48) { ctx.beginPath(); ctx.arc(x + 24, y + 24, 4 + 3 * Math.sin(tAbs * 3 + x * .02 + y * .02), 0, 7); ctx.fill(); } break;
    case 'rayas': ctx.save(); ctx.translate(W / 2, H / 2); ctx.rotate(-.5); for (let x = -W * 1.5 + (tAbs * 60) % 80; x < W * 1.5; x += 80) ctx.fillRect(x, -H * 1.5, 34, H * 3); ctx.restore(); break;
    case 'radial': for (let k = 0; k < 6; k++) { ctx.beginPath(); ctx.arc(W / 2, H / 2, ((tAbs * 80 + k * 90) % 540), 0, 7); ctx.stroke(); } break;
    case 'rayos': ctx.save(); ctx.translate(W / 2, H / 2); ctx.rotate(tAbs * .2); for (let k = 0; k < 16; k++) { ctx.rotate(Math.PI / 8); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(W, -60); ctx.lineTo(W, 60); ctx.fill(); } ctx.restore(); break;
    case 'ondas': for (let k = 0; k < 7; k++) { ctx.beginPath(); for (let x = 0; x <= W; x += 16) ctx.lineTo(x, H * (.2 + k * .11) + Math.sin(x * .01 + tAbs * 2 + k) * 24); ctx.stroke(); } break;
    case 'bokeh': for (let k = 0; k < 18; k++) { ctx.globalAlpha = .1 + r() * .15; ctx.beginPath(); ctx.arc((r() * W + tAbs * 20 * (k % 3 + 1)) % W, r() * H, 30 + r() * 90, 0, 7); ctx.fill(); } break;
    default: ctx.globalAlpha = .25; ctx.beginPath(); ctx.arc(W * .8, H * .2, 220 + Math.sin(tAbs) * 20, 0, 7); ctx.fill();
  }
  ctx.globalAlpha = 1;
  // texto en movimiento
  const ease = x => 1 - Math.pow(1 - clamp(x, 0, 1), 3), p = ease(t / .35);
  const big = e.tipo === 'gancho' ? .13 : e.tipo === 'gancho2' ? .075 : .068;
  ctx.font = `900 ${Math.round(H * big)}px ${getComputedStyle(document.body).fontFamily}`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  let txt = e.texto; if (MOVS[e.mov] === 'maquina') txt = txt.slice(0, Math.ceil(txt.length * clamp(t / .6, 0, 1)));
  const lines = wrap(ctx, txt, W * .82), lh = H * big * 1.15, y0 = H / 2 - (lines.length - 1) * lh / 2;
  ctx.translate(W / 2, H / 2);
  switch (MOVS[e.mov]) {
    case 'acercar': { const s = .6 + .4 * p + t * .06; ctx.scale(s, s); break; }
    case 'alejar': { const s = 1.5 - .5 * p; ctx.scale(s, s); break; }
    case 'deslizar': ctx.translate((1 - p) * W, 0); break;
    case 'subir': ctx.translate(0, (1 - p) * H * .6); break;
    case 'girar': ctx.rotate((1 - p) * -.6); ctx.scale(p, p); break;
    case 'rebote': { const bnc = t < .5 ? Math.abs(Math.sin(t * 14)) * (1 - t * 2) * 60 : 0; ctx.translate(0, -bnc); break; }
    case 'pulso': { const s = 1 + Math.sin(tAbs * 6) * .04; ctx.scale(s, s); break; }
  }
  ctx.translate(-W / 2, -H / 2);
  lines.forEach((ln, k) => {
    const y = y0 + k * lh;
    let x = W / 2; if (MOVS[e.mov] === 'dividir') x += (k % 2 ? 1 : -1) * (1 - p) * W * .6;
    if (MOVS[e.mov] === 'glitch' && Math.random() < .25) { ctx.fillStyle = acc; ctx.fillText(ln, x + 6, y); ctx.fillStyle = '#00e5ff'; ctx.fillText(ln, x - 6, y); }
    ctx.lineWidth = H * .012; ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.strokeText(ln, x, y);
    ctx.fillStyle = k === 0 && e.tipo !== 'punto' ? acc : ink; ctx.fillText(ln, x, y);
  });
  ctx.restore();
  // transición de entrada
  const q = clamp(t / .12, 0, 1);
  if (q < 1) {
    ctx.save(); ctx.fillStyle = '#000';
    switch (TRANS[e.trans]) {
      case 'fundido': ctx.globalAlpha = 1 - q; ctx.fillRect(0, 0, W, H); break;
      case 'barrido': ctx.fillRect(W * q, 0, W, H); break;
      case 'iris': ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.arc(W / 2, H / 2, q * W * .75, 0, 7, true); ctx.fill(); break;
      case 'destello': ctx.fillStyle = '#fff'; ctx.globalAlpha = 1 - q; ctx.fillRect(0, 0, W, H); break;
      case 'persiana': for (let k = 0; k < 8; k++) ctx.fillRect(0, k * H / 8, W, H / 8 * (1 - q)); break;
    }
    ctx.restore();
  }
}
let play = null;
function reproducir(v, canvas, { grabar = false, audio = [] } = {}) {
  if (play) play.stop();
  const ctx = canvas.getContext('2d'), W = canvas.width, H = canvas.height, ts = tiempos(v.guion.lineas), total = duracion(v);
  let t0 = performance.now(), raf, ac, rec;
  const stop = () => { cancelAnimationFrame(raf); if (rec && rec.state !== 'inactive') rec.stop(); ac?.close(); play = null; };
  return new Promise(ok => {
    if (grabar) {
      const stream = canvas.captureStream(30); ac = new AudioContext(); const dest = ac.createMediaStreamDestination();
      audio.forEach(src => { if (src instanceof AudioBuffer) { const s = ac.createBufferSource(); s.buffer = src; s.connect(dest); s.start(); } else if (src instanceof HTMLMediaElement) { ac.createMediaElementSource(src).connect(dest); src.currentTime = 0; src.play(); } });
      dest.stream.getAudioTracks().forEach(tr => stream.addTrack(tr));
      const mime = ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm', 'video/mp4'].find(m => MediaRecorder.isTypeSupported(m)) || '';
      rec = new MediaRecorder(stream, mime ? { mimeType: mime, videoBitsPerSecond: 6e6 } : {}); const parts = [];
      rec.ondataavailable = e => e.data.size && parts.push(e.data); rec.onstop = () => ok(new Blob(parts, { type: rec.mimeType }));
      rec.start(250); t0 = performance.now();
    }
    const frame = () => {
      const t = (performance.now() - t0) / 1000;
      if (t >= total) { const e = v.escenas[v.escenas.length - 1]; if (e) dibujarEscena(ctx, e, 1, W, H, t); stop(); if (!grabar) ok(); return; }
      const i = ts.findIndex(x => t < x.ini + x.dur), e = v.escenas[i];
      if (e) dibujarEscena(ctx, e, (t - ts[i].ini) / ts[i].dur, W, H, t);
      const bar = document.querySelector('#prog'); if (bar) bar.style.width = (t / total * 100) + '%';
      raf = requestAnimationFrame(frame);
    };
    play = { stop: () => { stop(); ok(); } }; frame();
  });
}

/* =========================================================
   5. MINIATURAS: 10 versiones, se analiza cada una y gana la de más clics
   ========================================================= */
const LAYOUTS = ['izquierda', 'centro', 'antes-despues', 'numero', 'circulo', 'banda'];
const EMOJIS = ['😱', '🤯', '🔥', '👀', '⚠️', '💀', '💰', '❓', '🚫', '✅', '🧢', '📈'];
function textosMini(v) {
  const g = words(v.guion.lineas[0].texto.replace(/[¡!¿?.]/g, '')).slice(0, 4).join(' ').toUpperCase();
  const tw = words(v.tema).filter(w => w.length > 3).slice(-2).join(' ').toUpperCase();
  return [g, tw, `¿${tw}?`, 'NADIE LO SABÍA', 'NO LO HAGAS', `${tw} 😳`, 'ESTO CAMBIA TODO', 'LA VERDAD', 'MIRA ESTO', `3 ERRORES`].filter(t => t.trim().length > 1);
}
function crearMinis(v) {
  const r = rng(v.id + 'mini' + v.version), tx = textosMini(v), out = [];
  for (let k = 0; k < 10; k++) out.push({ k, layout: LAYOUTS[k % LAYOUTS.length], pal: (k * 5 + Math.floor(r() * 12)) % PALS.length, texto: tx[k % tx.length], emoji: EMOJIS[Math.floor(r() * EMOJIS.length)], borde: r() > .4, flecha: r() > .5, real: { imp: '', clics: '' } });
  v.minis = out; analizarMinis(v); v.paso.miniaturas = true; save();
}
function dibujarMini(ctx, m, W, H) {
  const [a, b, acc, ink] = PALS[m.pal], f = getComputedStyle(document.body).fontFamily;
  const g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, a); g.addColorStop(1, b); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.textBaseline = 'middle'; const big = (s, txt, x, y, al = 'left', col = ink, maxW = W * .55) => {
    ctx.font = `900 ${s}px ${f}`; ctx.textAlign = al; const ls = wrap(ctx, txt, maxW); const lh = s * 1.02, y0 = y - (ls.length - 1) * lh / 2;
    ls.forEach((l, i) => { const fill = i === 0 ? acc : col; ctx.lineWidth = s * .14; ctx.strokeStyle = luz(fill) < .2 ? '#fff' : '#000'; ctx.lineJoin = 'round'; if (m.borde) ctx.strokeText(l, x, y0 + i * lh); ctx.fillStyle = fill; ctx.fillText(l, x, y0 + i * lh); });
    return ls.length;
  };
  const emo = (s, x, y) => { ctx.font = `${s}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`; ctx.textAlign = 'center'; ctx.fillText(m.emoji, x, y); };
  switch (m.layout) {
    case 'izquierda': big(H * .2, m.texto, W * .05, H * .5); emo(H * .55, W * .78, H * .52); break;
    case 'centro': ctx.globalAlpha = .35; emo(H * .9, W * .5, H * .55); ctx.globalAlpha = 1; big(H * .2, m.texto, W * .5, H * .5, 'center', ink, W * .9); break;
    case 'antes-despues': ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.fillRect(0, 0, W / 2, H); emo(H * .4, W * .25, H * .45); ctx.globalAlpha = 1;
      ctx.font = `900 ${H * .1}px ${f}`; ctx.textAlign = 'center'; ctx.fillStyle = '#fff'; ctx.fillText('ANTES', W * .25, H * .85); ctx.fillStyle = acc; ctx.fillText('DESPUÉS', W * .75, H * .85);
      big(H * .14, m.texto, W * .75, H * .42, 'center', ink, W * .44); break;
    case 'numero': ctx.font = `900 ${H * .75}px ${f}`; ctx.textAlign = 'left'; ctx.fillStyle = acc; ctx.fillText(String((m.k % 7) + 3), W * .04, H * .54); big(H * .15, m.texto, W * .38, H * .5, 'left', ink, W * .58); break;
    case 'circulo': emo(H * .5, W * .68, H * .5); ctx.strokeStyle = '#e62117'; ctx.lineWidth = H * .03; ctx.beginPath(); ctx.arc(W * .68, H * .5, H * .34, 0, 7); ctx.stroke(); big(H * .17, m.texto, W * .04, H * .5, 'left', ink, W * .4); break;
    case 'banda': emo(H * .62, W * .5, H * .38); ctx.fillStyle = acc; ctx.fillRect(0, H * .7, W, H * .3); ctx.font = `900 ${H * .17}px ${f}`; ctx.textAlign = 'center'; ctx.fillStyle = ink === '#ffffff' && luz(acc) > .5 ? '#111' : '#fff'; ctx.fillText(m.texto, W / 2, H * .85, W * .94); break;
  }
  const fl = { circulo: [.47, .1, .8], banda: [.16, .3, .25] }[m.layout];   // la flecha apunta al emoji y nunca tapa el texto
  if (m.flecha && fl) { ctx.save(); ctx.translate(W * fl[0], H * fl[1]); ctx.rotate(fl[2]); ctx.scale(W / 1280, W / 1280); ctx.fillStyle = '#e62117'; ctx.strokeStyle = '#fff'; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(0, -18); ctx.lineTo(80, -18); ctx.lineTo(80, -44); ctx.lineTo(130, 0); ctx.lineTo(80, 44); ctx.lineTo(80, 18); ctx.lineTo(0, 18); ctx.closePath(); ctx.stroke(); ctx.fill(); ctx.restore(); }
}
function hex(c) { const n = parseInt(c.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
function luz(c) { const [r, g, b] = hex(c).map(x => { x /= 255; return x <= .03928 ? x / 12.92 : Math.pow((x + .055) / 1.055, 2.4); }); return .2126 * r + .7152 * g + .0722 * b; }
const contraste = (x, y) => { const [l1, l2] = [luz(x), luz(y)].sort((a, b) => b - a); return (l1 + .05) / (l2 + .05); };
function analizarMinis(v) {
  const cv = document.createElement('canvas'); cv.width = 320; cv.height = 180; const ctx = cv.getContext('2d', { willReadFrequently: true });
  for (const m of v.minis) {
    dibujarMini(ctx, m, 320, 180);
    const px = ctx.getImageData(0, 0, 320, 180).data; let sat = 0, n = 0;
    for (let i = 0; i < px.length; i += 16) { const mx = Math.max(px[i], px[i + 1], px[i + 2]), mn = Math.min(px[i], px[i + 1], px[i + 2]); sat += mx ? (mx - mn) / mx : 0; n++; }
    sat /= n;
    const [a, b, acc] = PALS[m.pal], nw = words(m.texto).length;
    const f = {
      contraste: clamp((Math.min(contraste(acc, a), contraste(acc, b)) * (m.borde ? 1.6 : 1) - 1) / 6, 0, 1),
      brevedad: nw <= 2 ? 1 : nw === 3 ? .85 : nw === 4 ? .6 : .3,
      foco: { circulo: 1, numero: .95, 'antes-despues': .9, izquierda: .8, banda: .75, centro: .6 }[m.layout],
      color: 1 - Math.abs(sat - .62) * 1.6,
      flecha: m.flecha && ['circulo', 'banda'].includes(m.layout) ? 1 : .7,
      curiosidad: /\?|NADIE|NO |VERDAD|ERROR/.test(m.texto) ? 1 : .7
    };
    const w = { contraste: .25, brevedad: .2, foco: .2, color: .12, flecha: .08, curiosidad: .15 };
    const s = Object.entries(w).reduce((t, [k, x]) => t + clamp(f[k], 0, 1) * x, 0);
    m.factores = f; m.ctr = +(2 + s * 9).toFixed(1);   // CTR estimado entre 2 % y 11 %
  }
  elegirGanadora(v);
}
function elegirGanadora(v) {
  const reales = v.minis.filter(m => +m.real.imp >= 1000);
  const ctrReal = m => +m.real.clics / +m.real.imp * 100;
  const win = reales.length ? reales.sort((a, b) => ctrReal(b) - ctrReal(a))[0] : [...v.minis].sort((a, b) => b.ctr - a.ctr)[0];
  v.ganadora = win.k; v.ganadoraReal = !!reales.length;
  log('miniaturas', `10 versiones · gana #${win.k + 1} (${reales.length ? ctrReal(win).toFixed(1) + '% real' : win.ctr + '% estimado'})`);
}
function miniBlob(v, tipo = 'image/jpeg') { const c = document.createElement('canvas'); c.width = 1280; c.height = 720; dibujarMini(c.getContext('2d'), v.minis.find(m => m.k === v.ganadora), 1280, 720); return new Promise(ok => c.toBlob(ok, tipo, .9)); }

/* =========================================================
   6. STUDIO: título, descripción y la hora en que está la audiencia
   ========================================================= */
const DIAS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
function mejorHora() {
  let best = { d: 0, h: 0, v: -1 };
  S.audiencia.forEach((row, d) => row.forEach((x, h) => { if (x > best.v) best = { d, h, v: x }; }));
  // se publica 1 hora antes del pico para que YouTube lo empiece a mover cuando llega la gente
  const hp = (best.h + 23) % 24, now = new Date(), dt = new Date(now);
  dt.setHours(hp, 0, 0, 0); const dow = (now.getDay() + 6) % 7, dPub = best.h === 0 ? (best.d + 6) % 7 : best.d;
  let add = (dPub - dow + 7) % 7; dt.setDate(now.getDate() + add); if (dt <= now) dt.setDate(dt.getDate() + 7);
  return { pico: best, fecha: dt };
}
function crearStudio(v) {
  const n = nichoActual(), T = cap(v.tema), g = GANCHOS.find(x => x.id === v.guion.formula);
  const opciones = [`${g.punch.replace(/[.]$/, '')} ${T}`, `La verdad sobre ${v.tema} (nadie te lo dice)`, `${T}: el error que casi todos cometen`, `3 cosas de ${v.tema} que no sabías`];
  const puntua = t => (t.length >= 35 && t.length <= 60 ? 3 : t.length <= 70 ? 1 : 0) + (/\d/.test(t) ? 1 : 0) + (/nadie|verdad|error|no sabías|\?/i.test(t) ? 1 : 0);
  const titulo = opciones.map(t => t.slice(0, 100)).sort((a, b) => puntua(b) - puntua(a))[0];
  const ts = tiempos(v.guion.lineas), cap_ = [];
  v.guion.lineas.forEach((l, i) => { if (['gancho', 'punto', 'cierre'].includes(l.tipo) && (!cap_.length || ts[i].ini - cap_[cap_.length - 1].t >= 10)) cap_.push({ t: ts[i].ini, l: l.tipo === 'gancho' ? 'Inicio' : l.texto.replace(/\[|\]/g, '').slice(0, 40) }); });
  const tag = s => '#' + s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/gi, '');
  const desc = [`${v.guion.lineas[1].texto.replace(/\[|\]/g, '')}`, '', `En este video: ${v.tema}.`, '',
    ...(duracion(v) > 60 && cap_.length >= 3 ? ['Capítulos:', ...cap_.map(c => `${mmss(c.t)} ${c.l}`), ''] : []),
    `Suscríbete a ${S.canal.nombre} para más de ${n.nombre.toLowerCase()}.`, '', [tag(n.nombre), tag(v.tema), v.formato === 'short' ? '#shorts' : ''].filter(Boolean).join(' ')].join('\n');
  const tags = [...new Set([v.tema, n.nombre, ...n.temas.slice(0, 3), ...words(v.tema).filter(w => w.length > 4)])].slice(0, 12);
  const { fecha, pico } = mejorHora();
  v.studio = { titulo, opciones, desc, tags, publicar: fecha.toISOString(), pico, privacidad: 'private' };
  v.paso.studio = true; save();
  log('studio', `Programado: ${fecha.toLocaleString('es-MX', { weekday: 'short', hour: '2-digit', minute: '2-digit' })}`);
}
// OAuth de Google (solo si pones tu ID de cliente en Ajustes)
function cargarScript(src) { return new Promise((ok, ko) => { if (document.querySelector(`script[src="${src}"]`)) return ok(); const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = () => ko(new Error('No se pudo cargar ' + src)); document.head.appendChild(s); }); }
let tok = null;
async function token() {
  if (tok && tok.exp > Date.now()) return tok.v;
  if (!S.cfg.clientId) throw new Error('Pon tu ID de cliente OAuth en Ajustes');
  await cargarScript('https://accounts.google.com/gsi/client');
  return new Promise((ok, ko) => {
    const c = google.accounts.oauth2.initTokenClient({ client_id: S.cfg.clientId,
      scope: 'https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/yt-analytics.readonly',
      callback: r => r.error ? ko(new Error(r.error)) : (tok = { v: r.access_token, exp: Date.now() + (r.expires_in - 60) * 1000 }, ok(tok.v)) });
    c.requestAccessToken();
  });
}
async function conectarCanal() {
  const t = await token();
  const r = await fetch('https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true', { headers: { Authorization: 'Bearer ' + t } }).then(r => r.json());
  const c = r.items?.[0]; if (!c) throw new Error('Esta cuenta todavía no tiene canal. Créalo en youtube.com/create_channel');
  S.canal = { ...S.canal, nombre: c.snippet.title, handle: c.snippet.customUrl || '', conectado: { id: c.id, subs: +c.statistics.subscriberCount || 0, vistas: +c.statistics.viewCount || 0 } };
  save(); pintarTop();
}
async function subir(v, blob) {
  const t = await token(), s = v.studio;
  log('studio', 'Subiendo a YouTube…');
  const meta = { snippet: { title: s.titulo, description: s.desc, tags: s.tags, categoryId: '24', defaultLanguage: 'es', defaultAudioLanguage: 'es' },
    status: { privacyStatus: 'private', publishAt: new Date(s.publicar).toISOString(), selfDeclaredMadeForKids: false } };
  let r = await fetch('https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status', { method: 'POST',
    headers: { Authorization: 'Bearer ' + t, 'Content-Type': 'application/json; charset=UTF-8', 'X-Upload-Content-Type': blob.type || 'video/webm', 'X-Upload-Content-Length': blob.size }, body: JSON.stringify(meta) });
  if (!r.ok) throw new Error((await r.json()).error?.message || 'No se pudo iniciar la subida');
  r = await fetch(r.headers.get('Location'), { method: 'PUT', headers: { 'Content-Type': blob.type || 'video/webm' }, body: blob });
  const j = await r.json(); if (!r.ok) throw new Error(j.error?.message || 'Falló la subida');
  const mb = await miniBlob(v);
  await fetch(`https://www.googleapis.com/upload/youtube/v3/thumbnails/set?videoId=${j.id}`, { method: 'POST', headers: { Authorization: 'Bearer ' + t, 'Content-Type': 'image/jpeg' }, body: mb }).catch(() => {});
  v.publicado = { ytId: j.id, ts: Date.now(), cuando: s.publicar, real: true }; v.paso.publicado = true; save();
  log('studio', `Subido y programado: youtu.be/${j.id}`);
  alerta({ de: 'studio', para: 'retencion', titulo: 'Video programado', texto: `"${s.titulo}" sale ${new Date(s.publicar).toLocaleString('es-MX')}. Revisa la retención cuando tenga vistas.`, videoId: v.id });
}

/* =========================================================
   7. RETENCIÓN: si la gente se va en el segundo 3, aviso al guionista
   ========================================================= */
function retEn(curva, s) {
  for (let i = 1; i < curva.length; i++) if (curva[i][0] >= s) { const [a, pa] = curva[i - 1], [b, pb] = curva[i]; return pa + (pb - pa) * ((s - a) / ((b - a) || 1)); }
  return curva[curva.length - 1]?.[1] ?? 100;
}
function simularRetencion(v) {
  const r = rng(v.id + v.version + 'ret'), q = (hash(v.guion.formula + v.tema) % 100) / 100, dur = duracion(v);
  const at3 = clamp(48 + q * 30 + (v.version - 1) * 9 + r() * 8, 35, 92), curva = [[0, 100]];
  for (let s = 1; s <= Math.ceil(dur); s++) {
    let p = s <= 3 ? 100 - (100 - at3) * (s / 3) : at3 * Math.exp(-(s - 3) / (dur * 1.6)) - (r() * 1.5);
    curva.push([s, +clamp(p, 0, 100).toFixed(1)]);
  }
  return curva;
}
function parsearCSV(txt) {
  const out = txt.split(/\n/).map(l => l.split(/[,;\t]/).map(x => x.trim().replace('%', ''))).filter(x => x.length >= 2 && !isNaN(parseFloat(x[0])) && !isNaN(parseFloat(x[1])))
    .map(([a, b]) => { let s = a.includes(':') ? a.split(':').reduce((t, x) => t * 60 + +x, 0) : +a; let p = +b; if (p <= 1.5) p *= 100; return [s, p]; });
  return out.sort((a, b) => a[0] - b[0]);
}
async function retencionReal(v) {
  const t = await token(), hoy = new Date().toISOString().slice(0, 10);
  const u = `https://youtubeanalytics.googleapis.com/v2/reports?ids=channel==MINE&startDate=2020-01-01&endDate=${hoy}&metrics=audienceWatchRatio&dimensions=elapsedVideoTimeRatio&filters=video==${v.publicado.ytId}`;
  const j = await fetch(u, { headers: { Authorization: 'Bearer ' + t } }).then(r => r.json());
  if (!j.rows?.length) throw new Error('YouTube todavía no tiene datos de retención de este video (tarda 1 o 2 días)');
  const dur = duracion(v); return [[0, 100], ...j.rows.map(([x, w]) => [x * dur, w * 100])];
}
function analizarRetencion(v, curva, fuente) {
  const at3 = retEn(curva, 3), umbral = S.cfg.ret3, ts = tiempos(v.guion.lineas), caidas = [];
  for (let s = 4; s < curva[curva.length - 1][0]; s += 1) { const d = retEn(curva, s - 2) - retEn(curva, s); if (d >= 8) { const i = ts.findIndex(x => s < x.ini + x.dur); caidas.push({ s, d: +d.toFixed(1), linea: i }); s += 3; } }
  v.retencion = { curva, at3: +at3.toFixed(1), fuente, ts: Date.now(), version: v.version, caidas }; v.paso.retencion = true;
  const f = S.formulas[v.guion.formula] ||= { usos: 1, caidas: 0 };
  if (at3 < umbral) {
    f.caidas++;
    alerta({ de: 'retencion', para: 'guion', tipo: 'alarma', videoId: v.id,
      titulo: `Se van en el segundo 3: queda ${at3.toFixed(0)}%`,
      texto: `"${v.tema}" (guion v${v.version}): en el segundo 3 solo queda el ${at3.toFixed(0)}% de la gente (meta: ${umbral}%). El gancho "${v.guion.lineas[0].texto}" (${GANCHOS.find(g => g.id === v.guion.formula).nombre}) no está reteniendo. Reanaliza y mejora el inicio.` });
    log('retencion', `🚨 ${at3.toFixed(0)}% en el seg. 3 → aviso a Guion`);
  } else {
    log('retencion', `Segundo 3: ${at3.toFixed(0)}% ✓ el gancho funciona`);
    if (caidas.length) alerta({ de: 'retencion', para: 'guion', videoId: v.id, titulo: `${caidas.length} caída(s) a mitad del video`, texto: caidas.map(c => `${mmss(c.s)}: −${c.d} pts en "${(v.guion.lineas[c.linea]?.texto || '').slice(0, 50)}"`).join(' · ') });
  }
  save();
}

/* =========================================================
   PRODUCCIÓN COMPLETA (los 7 trabajando en cadena)
   ========================================================= */
async function producir() {
  const b = $('#prodBtn'); if (b) b.disabled = true;
  try {
    if (!S.tendencias.ultimo || Date.now() - S.tendencias.ultimo > 36e5) await escanear();
    const idea = ideas()[0];
    let v; await trabajando('guion', async () => { await sleep(500); v = nuevoVideo(idea.tema, idea.from); }); render();
    await trabajando('voz', async () => { await crearMusica(v); }); render();
    await trabajando('animacion', async () => { await sleep(400); asignarEscenas(v); }); render();
    await trabajando('miniaturas', async () => { await sleep(400); crearMinis(v); }); render();
    await trabajando('studio', async () => { await sleep(300); crearStudio(v); }); render();
    log('retencion', 'Esperando a que se publique para medir');
    toast('Video listo: falta grabar la voz y subirlo');
  } finally { if (b) b.disabled = false; render(); }
}

/* =========================================================
   VISTAS
   ========================================================= */
const ruta = () => (location.hash.slice(1) || 'oficina');
function pintarTop() { $('#canal').textContent = S.canal.nombre; $('#nichoTop').textContent = 'Nicho: ' + nichoActual().nombre + (S.cfg.fijarNicho ? ' (fijado)' : S.tendencias.ultimo ? ' · el más en tendencia' : ''); badge(); }
const crumb = id => `<div class="crumb"><button onclick="location.hash='oficina'">‹ Oficina</button></div>
  <div class="row">${avatar(id)}<div class="grow"><h2>${M[id].n}. ${M[id].rol}</h2><p class="sub" style="margin:0">${esc(M[id].nombre)} · ${esc(S.log[id] || 'Sin actividad todavía')}</p></div></div>`;
const sinVideo = () => `<div class="card"><p>Todavía no hay un video en producción.</p><button class="btn pri" onclick="producirYVer()">Producir el primer video</button></div>`;
const bandejaDe = id => { const ms = S.bandeja.filter(m => m.para === id && !m.resuelto); return ms.length ? `<h3>Bandeja de ${esc(M[id].nombre)}</h3>${ms.map(msgHTML).join('')}` : ''; };
function msgHTML(m) {
  const v = S.videos.find(x => x.id === m.videoId);
  const acc = m.para === 'guion' && m.de === 'retencion' && m.tipo === 'alarma' && v && !m.resuelto ? `<button class="btn sm pri" onclick="reescribirYVer('${v.id}','${m.id}')">Reanalizar y reescribir gancho</button>`
    : m.de === 'tendencias' && m.ref && !m.resuelto ? `<button class="btn sm pri" onclick="usarIdea('${m.ref}','${m.id}')">Hacer guion con este tema</button>` : '';
  return `<div class="msg ${m.leido ? '' : 'unread'}">${avatar(m.de)}<div class="grow"><b>${esc(m.titulo)}</b>
    <small> · ${esc(M[m.de].nombre)} → ${esc(M[m.para]?.nombre || 'todos')} · ${new Date(m.ts).toLocaleString('es-MX', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</small>
    <p>${esc(m.texto)}</p><div class="row">${acc}${m.resuelto ? '<span class="chip ok">Resuelto</span>' : ''}</div></div></div>`;
}
function pipeHTML(v) {
  const pasos = [['guion', 'Guion'], ['audio', 'Voz y audio'], ['animacion', 'Animación'], ['miniaturas', 'Miniaturas'], ['studio', 'Studio'], ['publicado', 'Publicado'], ['retencion', 'Retención']];
  const sig = pasos.find(([k]) => !v.paso[k])?.[0];
  return `<div class="pipe">${pasos.map(([k, l]) => { const bad = k === 'retencion' && v.retencion && v.retencion.at3 < S.cfg.ret3;
    return `<div class="st ${bad ? 'bad' : v.paso[k] ? 'done' : ''} ${k === sig ? 'now' : ''}">${l}<i>${bad ? `${v.retencion.at3}% en seg. 3` : v.paso[k] ? 'listo' : k === sig ? 'sigue' : 'pendiente'}</i></div>`; }).join('')}</div>`;
}

const VISTAS = {
  oficina() {
    const v = vid(), unread = S.bandeja.filter(m => !m.leido).length, n = nichoActual();
    const estado = id => {
      const pend = S.bandeja.filter(m => m.para === id && !m.resuelto && m.tipo === 'alarma').length;
      if (working.has(id)) return '<span class="chip work">Trabajando…</span>';
      if (pend) return `<span class="chip bad">${pend} alerta${pend > 1 ? 's' : ''}</span>`;
      const map = { tendencias: S.tendencias.ultimo, guion: v, voz: v?.paso.audio, animacion: v?.paso.animacion, miniaturas: v?.paso.miniaturas, studio: v?.paso.studio, retencion: v?.paso.retencion };
      return map[id] ? '<span class="chip ok">Al día</span>' : '<span class="chip">En espera</span>';
    };
    return `
    <section class="hero">
      <h2>${esc(S.canal.nombre)}</h2>
      <p>${S.canal.conectado ? `Canal conectado · ${fmt(S.canal.conectado.subs)} suscriptores` : 'Canal sin conectar · '} Nicho más en tendencia: <b>${esc(n.nombre)}</b>${S.tendencias.modo === 'demo' ? ' (modo demo)' : ''}</p>
      <div class="kpis">
        <div class="kpi"><b>${S.videos.length}</b><span>videos en la oficina</span></div>
        <div class="kpi"><b>${S.tendencias.videos.filter(x => x.ratio >= S.cfg.outlier).length}</b><span>videos a +${S.cfg.outlier}× la media</span></div>
        <div class="kpi"><b>${S.videos.find(x => x.retencion)?.retencion.at3 ?? '—'}${S.videos.find(x => x.retencion) ? '%' : ''}</b><span>quedan en el seg. 3</span></div>
        <div class="kpi"><b>${unread}</b><span>avisos sin leer</span></div>
      </div>
      <div class="row"><button class="btn pri" id="prodBtn" onclick="producir()">▶ Producir un video</button><button class="btn" onclick="escanear().then(render)">Buscar tendencias</button></div>
    </section>
    ${v ? `<div class="card"><div class="row"><div class="grow"><b>En producción:</b> ${esc(v.tema)} <span class="chip">guion v${v.version}</span></div>
      ${S.videos.length > 1 ? `<select class="i" style="width:auto" onchange="S.actual=this.value;save();render()" aria-label="Video">${S.videos.map(x => `<option value="${x.id}" ${x.id === v.id ? 'selected' : ''}>${esc(x.tema.slice(0, 40))} · v${x.version}</option>`).join('')}</select>` : ''}</div>${pipeHTML(v)}</div>` : ''}
    <h3>El equipo</h3>
    <div class="desks">${TEAM.map(t => `<button class="desk ${working.has(t.id) ? 'working' : ''} ${S.bandeja.some(m => m.para === t.id && !m.resuelto && m.tipo === 'alarma') ? 'alert' : ''}" data-id="${t.id}" onclick="location.hash='${t.id}'">
      <span class="num">${t.n}</span>
      <span class="top">${avatar(t.id)}<span class="who"><b>${esc(t.nombre)}</b><span>${esc(t.rol)}</span></span></span>
      <span class="screen"><span class="ln">${esc(S.log[t.id] || '> listo para trabajar')}</span></span>
      <span class="foot">${estado(t.id)}</span></button>`).join('')}</div>
    ${!S.cfg.apiKey ? `<div class="note warn">Modo demo: las tendencias y la retención son simuladas. Pon tu API key de YouTube en <a href="#ajustes">Ajustes</a> para usar datos reales.</div>` : ''}`;
  },

  tendencias() {
    const t = S.tendencias, n = nichoActual();
    const vs = t.videos.filter(v => v.nicho === n.id).sort((a, b) => b.ratio - a.ratio);
    const hot = t.videos.filter(v => v.ratio >= S.cfg.outlier).sort((a, b) => b.ratio - a.ratio);
    return crumb('tendencias') + `
    <div class="card"><div class="row"><div class="grow"><b>Última revisión:</b> ${t.ultimo ? new Date(t.ultimo).toLocaleString('es-MX') : 'nunca'} <span class="chip">${t.modo === 'real' ? 'datos reales' : 'demo'}</span></div>
      <button class="btn pri" onclick="escanear().then(render)">Revisar ahora</button></div>
      <p class="sub" style="margin-top:8px">Busca los videos de los últimos 7 días de cada nicho, mide qué tan rápido suben (vistas por hora) y se queda con el nicho que más crece. Si un video hace <b>${S.cfg.outlier} veces</b> la media de su canal, suena la alarma. Revisa sola cada ${S.cfg.auto} min mientras la oficina está abierta.</p></div>
    ${hot.length ? `<h3>🚨 Videos a +${S.cfg.outlier}× la media</h3><div class="card"><ul class="list">${hot.slice(0, 8).map(v => `<li><div class="grow"><span class="t">${v.url ? `<a href="${v.url}" target="_blank" rel="noopener">${esc(v.title)}</a>` : esc(v.title)}</span><small>${esc(v.channel)} · ${esc(nombreNicho(v.nicho))} · ${fmt(v.views)} vistas, media del canal ${fmt(v.media)}</small></div><span class="ratio hot">${v.ratio.toFixed(1)}×</span></li>`).join('')}</ul></div>` : ''}
    <h3>Nichos por tendencia</h3>
    <div class="card"><ul class="list rank">${t.ranking.length ? t.ranking.map((r, i) => `<li><b>${i + 1}</b><div class="grow"><span class="t">${esc(nombreNicho(r.id))} ${r.id === n.id ? '<span class="chip ok">elegido</span>' : ''}</span><div class="bar" style="--c:var(--c1)"><span style="width:${r.pct}%"></span></div></div>
      <button class="btn sm" onclick="S.cfg.fijarNicho=S.cfg.fijarNicho==='${r.id}'?'':'${r.id}';save();pintarTop();render()">${S.cfg.fijarNicho === r.id ? 'Soltar' : 'Fijar'}</button></li>`).join('') : '<li>Aún no se revisa. Toca <b>Revisar ahora</b>.</li>'}</ul>
      ${S.cfg.fijarNicho ? `<p class="note warn">Nicho fijado a mano. Suéltalo para que Lupe siempre elija el que más está en tendencia.</p>` : ''}</div>
    ${vs.length ? `<h3>Lo más fuerte en ${esc(n.nombre)}</h3><div class="card"><ul class="list">${vs.slice(0, 10).map(v => `<li><div class="grow"><span class="t">${esc(v.title)}</span><small>${esc(v.channel)} · ${fmt(v.views)} vistas · hace ${Math.round(v.horas)} h</small></div><span class="ratio ${v.ratio >= S.cfg.outlier ? 'hot' : ''}">${v.ratio.toFixed(1)}×</span></li>`).join('')}</ul></div>` : ''}`;
  },

  guion() {
    const v = vid();
    const ideasHTML = `<h3>Ideas de Tendencias</h3><div class="card"><ul class="list">${ideas().map((x, i) => `<li><div class="grow"><span class="t">${esc(x.tema)}</span>${x.from ? `<small>Inspirado en "${esc(x.from.title)}" (${x.from.ratio.toFixed(1)}×)</small>` : ''}</div><button class="btn sm" onclick="nuevoDesdeIdea(${i})">Escribir</button></li>`).join('')}</ul>
      <div class="row" style="margin-top:8px"><input class="i grow" id="temaLibre" placeholder="O escribe tu propio tema"><button class="btn sm" onclick="const t=$('#temaLibre').value.trim(); if(t){nuevoVideo(t);render()}">Escribir</button></div></div>`;
    if (!v) return crumb('guion') + bandejaDe('guion') + ideasHTML;
    const ts = tiempos(v.guion.lineas), chk = revisarGancho(v.guion.lineas[0].texto), g = GANCHOS.find(x => x.id === v.guion.formula);
    return crumb('guion') + bandejaDe('guion') + `
    <div class="card"><div class="row"><div class="grow"><b>${esc(v.tema)}</b> <span class="chip">v${v.version}</span> <span class="chip">${v.formato === 'short' ? 'Short' : 'Video largo'} · ${mmss(duracion(v))}</span></div>
      <button class="btn sm" onclick="reescribirYVer('${v.id}')">Probar otro gancho</button></div>
      <p class="note ${chk.ok ? 'ok' : 'bad'}">${chk.ok ? '✓' : '✗'} ${chk.t} Fórmula: <b>${esc(g.nombre)}</b>.</p>
      <div class="script">${v.guion.lineas.map((l, i) => `<div class="ln-s ${l.tipo}"><span class="ts">${mmss(ts[i].ini)}<em>${{ gancho: 'gancho · 1 s', gancho2: 'remate', promesa: 'promesa', punto: 'punto', giro: 'giro', cierre: 'cierre', cta: 'llamada' }[l.tipo]}</em></span>
        <div contenteditable="true" class="${l.tipo === 'gancho' ? 'punch' : ''}" onblur="editarLinea(${i}, this.innerText)">${esc(l.texto)}</div></div>`).join('')}</div>
      <p class="sub" style="margin-top:8px">Toca cualquier línea para editarla. Lo que está entre [corchetes] lo llenas con el dato real. Los "giros" rompen el ritmo cada pocos segundos para que nadie se vaya.</p></div>
    ${v.guion.historial.length ? `<h3>Ganchos que ya se probaron</h3><div class="card"><ul class="list">${v.guion.historial.map(h => `<li><div class="grow"><span class="t">v${h.version}: "${esc(h.gancho)}"</span><small>${esc(h.motivo || '')}</small></div></li>`).join('')}</ul></div>` : ''}
    <h3>Cómo le va a cada gancho</h3><div class="card"><ul class="list">${GANCHOS.map(x => { const f = S.formulas[x.id]; return `<li><div class="grow"><span class="t">${esc(x.nombre)}: "${esc(x.punch)}"</span><small>${f ? `${f.usos} uso(s), ${f.caidas} caída(s) en el seg. 3` : 'sin probar'}</small></div></li>`; }).join('')}</ul></div>
    ${ideasHTML}`;
  },

  voz() {
    const v = vid(); if (!v) return crumb('voz') + sinVideo();
    const tieneVoz = !!mem.voz[v.id], tieneMus = !!mem.musica[v.id];
    return crumb('voz') + bandejaDe('voz') + `
    <div class="card"><h3 style="margin-top:0">Voz</h3>
      <div class="grid2"><div><label class="f">Voz sintética para escuchar el guion</label><select class="i" onchange="vid().voz.voz=this.value;save()">${voces.length ? voces.map(x => `<option ${x.name === v.voz.voz ? 'selected' : ''}>${esc(x.name)}</option>`).join('') : '<option>Voz del sistema</option>'}</select></div>
        <div class="row"><div class="grow"><label class="f">Velocidad ${v.voz.vel}</label><input type="range" min=".8" max="1.4" step=".05" value="${v.voz.vel}" oninput="vid().voz.vel=+this.value;this.previousElementSibling.textContent='Velocidad '+this.value;save()" style="width:100%"></div>
        <div class="grow"><label class="f">Tono ${v.voz.tono}</label><input type="range" min=".7" max="1.3" step=".05" value="${v.voz.tono}" oninput="vid().voz.tono=+this.value;this.previousElementSibling.textContent='Tono '+this.value;save()" style="width:100%"></div></div></div>
      <div class="row" style="margin-top:12px"><button class="btn" onclick="leer(vid())">▶ Escuchar guion</button><button class="btn" onclick="speechSynthesis.cancel()">■</button>
        <button class="btn red" onclick="grabarVoz(vid(), this)">● Grabar mi voz (teleprompter)</button>
        ${tieneVoz ? `<button class="btn" onclick="descargar(mem.voz[vid().id],'voz.webm')">Descargar voz</button><span class="chip ok">Voz grabada</span>` : ''}</div>
      <p class="sub" style="margin-top:8px">La voz sintética sirve para escuchar el ritmo. Para el video, graba tu voz: cada línea se ilumina a su tiempo. También puedes subir un audio hecho con otra herramienta.</p>
      <label class="btn sm" style="display:inline-flex;align-items:center">Subir audio de voz<input type="file" accept="audio/*" hidden onchange="mem.voz[vid().id]=this.files[0];vid().paso.voz=true;save();render()"></label></div>
    <div class="card"><h3 style="margin-top:0">Música y efectos</h3>
      <label class="f">Volumen de la música (debajo de la voz): ${Math.round(v.voz.musica * 100)}%</label><input type="range" min="0" max=".6" step=".05" value="${v.voz.musica}" onchange="vid().voz.musica=+this.value;save();render()" style="width:100%">
      <div class="row" style="margin-top:10px"><button class="btn pri" onclick="trabajando('voz',()=>crearMusica(vid())).then(render)">${tieneMus ? 'Rehacer música' : 'Crear música'}</button>
      ${tieneMus ? `<button class="btn" onclick="const a=new Audio(URL.createObjectURL(wav(mem.musica[vid().id])));a.play()">▶ Escuchar</button><button class="btn" onclick="descargar(wav(mem.musica[vid().id]),'musica.wav')">Descargar WAV</button>` : ''}</div>
      <p class="sub" style="margin-top:8px">Pista original generada aquí (sin derechos de autor), con un "whoosh" en cada corte de escena.</p></div>
    <div class="script">${v.guion.lineas.map(l => `<div class="ln-s ${l.tipo}"><span class="ts"></span><div>${esc(l.texto)}</div></div>`).join('')}</div>`;
  },

  animacion() {
    const v = vid(); if (!v) return crumb('animacion') + sinVideo();
    const ts = tiempos(v.guion.lineas);
    return crumb('animacion') + bandejaDe('animacion') + `
    <div class="card">${v.escenas.length ? `<canvas id="stage" class="stage" width="1280" height="720"></canvas><div class="bar" style="--c:var(--c4)"><span id="prog" style="width:0"></span></div>
      <div class="row" style="margin-top:10px"><button class="btn pri" onclick="reproducir(vid(), $('#stage'))">▶ Ver animación</button>
      <button class="btn" onclick="exportar(this)">Exportar video${mem.voz[v.id] ? ' con voz' : ''}${mem.musica[v.id] ? ' y música' : ''}</button>
      <button class="btn" onclick="asignarEscenas(vid());render()">Nuevas escenas</button>
      ${mem.video[v.id] ? `<button class="btn" onclick="descargar(mem.video[vid().id],'video.webm')">Descargar video</button>` : ''}</div>`
      : `<p>Sin escenas todavía.</p><button class="btn pri" onclick="asignarEscenas(vid());render()">Animar escenas</button>`}
      <p class="sub" style="margin-top:8px">Cada escena combina fondo, movimiento, paleta y transición. Andrés guarda cada combinación usada y <b>nunca repite una</b> (${S.combos.length} usadas de ${FONDOS.length * MOVS.length * PALS.length * TRANS.length} posibles).</p></div>
    ${v.escenas.length ? `<div class="scenes">${v.escenas.map((e, i) => `<div class="scene"><b>${mmss(ts[i]?.ini || 0)} · ${esc(e.texto)}</b><span class="sw" style="background:${PALS[e.pal][0]}"></span><span class="sw" style="background:${PALS[e.pal][2]}"></span> ${FONDOS[e.fondo]} · ${MOVS[e.mov]} · ${TRANS[e.trans]}</div>`).join('')}</div>` : ''}`;
  },

  miniaturas() {
    const v = vid(); if (!v) return crumb('miniaturas') + sinVideo();
    if (!v.minis.length) return crumb('miniaturas') + `<div class="card"><button class="btn pri" onclick="crearMinis(vid());render()">Crear 10 miniaturas</button></div>`;
    const w = v.minis.find(m => m.k === v.ganadora);
    return crumb('miniaturas') + bandejaDe('miniaturas') + `
    <div class="card"><div class="row"><div class="grow"><b>Ganadora: #${w.k + 1}</b> ${v.ganadoraReal ? '<span class="chip ok">por clics reales</span>' : '<span class="chip">por CTR estimado</span>'}</div>
      <button class="btn" onclick="crearMinis(vid());render()">Otras 10</button><button class="btn pri" onclick="miniBlob(vid()).then(b=>descargar(b,'miniatura.jpg'))">Descargar ganadora</button></div>
      <p class="sub" style="margin-top:8px">Mia analiza cada versión: contraste del texto, cuántas palabras tiene, si hay un punto focal (emoji, número, círculo), el color y la curiosidad. Con eso estima el CTR. Para saber cuál saca <b>más clics de verdad</b>, sube las 3 mejores a <i>Probar y comparar</i> en YouTube Studio y escribe aquí las impresiones y clics: con 1,000 impresiones o más, manda el dato real.</p></div>
    <div class="thumbs">${[...v.minis].sort((a, b) => (b.k === v.ganadora) - (a.k === v.ganadora) || b.ctr - a.ctr).map(m => `<div class="th ${m.k === v.ganadora ? 'win' : ''}">${m.k === v.ganadora ? '<span class="crown">GANADORA</span>' : ''}
      <canvas width="640" height="360" data-k="${m.k}"></canvas>
      <div class="meta"><span>#${m.k + 1} · ${m.layout}</span><span class="ctr">${+m.real.imp >= 1000 ? (m.real.clics / m.real.imp * 100).toFixed(1) + '%' : m.ctr + '%'}</span></div>
      <details><summary>Análisis</summary>${Object.entries(m.factores).map(([k, x]) => `${k}: ${Math.round(clamp(x, 0, 1) * 100)}`).join(' · ')}</details>
      <div class="real"><input class="i" inputmode="numeric" placeholder="Impresiones" value="${esc(m.real.imp)}" onchange="realMini(${m.k},'imp',this.value)"><input class="i" inputmode="numeric" placeholder="Clics" value="${esc(m.real.clics)}" onchange="realMini(${m.k},'clics',this.value)"></div></div>`).join('')}</div>`;
  },

  studio() {
    const v = vid(); if (!v) return crumb('studio') + sinVideo();
    if (!v.studio) return crumb('studio') + `<div class="card"><button class="btn pri" onclick="crearStudio(vid());render()">Preparar publicación</button></div>`;
    const s = v.studio, { pico } = mejorHora(), f = new Date(s.publicar);
    return crumb('studio') + bandejaDe('studio') + `
    <div class="card"><label class="f">Título (${s.titulo.length}/100)</label><input class="i" value="${esc(s.titulo)}" maxlength="100" onchange="vid().studio.titulo=this.value;save();render()">
      <div class="row" style="margin-top:6px">${s.opciones.map(o => `<button class="btn sm" onclick="vid().studio.titulo=this.textContent;save();render()">${esc(o)}</button>`).join('')}</div>
      <label class="f">Descripción</label><textarea class="i" rows="9" onchange="vid().studio.desc=this.value;save()">${esc(s.desc)}</textarea>
      <label class="f">Etiquetas</label><input class="i" value="${esc(s.tags.join(', '))}" onchange="vid().studio.tags=this.value.split(',').map(x=>x.trim()).filter(Boolean);save()"></div>
    <div class="card"><h3 style="margin-top:0">Hora de publicar</h3>
      <p>La audiencia llega a su pico el <b>${DIAS[pico.d]} a las ${pico.h}:00</b>. Sofi programa 1 hora antes: <b>${f.toLocaleString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}</b>.</p>
      <label class="f">Fecha y hora</label><input class="i" type="datetime-local" value="${new Date(f - f.getTimezoneOffset() * 6e4).toISOString().slice(0, 16)}" onchange="vid().studio.publicar=new Date(this.value).toISOString();save();render()">
      <label class="f">¿Cuándo está conectada tu audiencia? (toca para ajustar; cópialo de YouTube Studio › Estadísticas › Audiencia)</label>
      <div class="heat">${'<span></span>' + Array.from({ length: 24 }, (_, h) => `<span class="h">${h % 3 ? '' : h}</span>`).join('')}${S.audiencia.map((row, d) => `<span>${DIAS[d]}</span>` + row.map((x, h) => `<button style="--a:${.08 + x * .9}" class="${d === pico.d && h === pico.h ? 'best' : ''}" aria-label="${DIAS[d]} ${h}:00, ${Math.round(x * 100)}%" onclick="calor(${d},${h})"></button>`).join('')).join('')}</div>
      <div class="row" style="margin-top:8px"><button class="btn sm" onclick="crearStudio(vid());render()">Recalcular hora</button><button class="btn sm" onclick="S.audiencia=audienciaBase();save();render()">Patrón típico</button></div></div>
    <div class="card"><h3 style="margin-top:0">Subir</h3>
      ${v.publicado ? `<p class="note ok">${v.publicado.real ? `Subido: <a href="https://youtu.be/${v.publicado.ytId}" target="_blank" rel="noopener">youtu.be/${v.publicado.ytId}</a>` : 'Marcado como publicado'} · sale ${new Date(v.publicado.cuando).toLocaleString('es-MX')}</p>` : ''}
      <div class="row"><label class="btn">Elegir archivo de video<input type="file" accept="video/*" hidden onchange="mem.video[vid().id]=this.files[0];toast('Video listo para subir');render()"></label>
      <button class="btn pri" ${mem.video[v.id] && S.cfg.clientId ? '' : 'disabled'} onclick="subirYVer(this)">Subir y programar</button>
      <button class="btn" onclick="copiarPaquete()">Copiar título y descripción</button>
      ${v.publicado ? '' : `<button class="btn" onclick="marcarPublicado()">Ya lo subí a mano</button>`}</div>
      <p class="sub" style="margin-top:8px">${mem.video[v.id] ? `Video: ${(mem.video[v.id].size / 1e6).toFixed(1)} MB. ` : 'Exporta el video en Animación o elige el archivo final. '}${S.cfg.clientId ? 'Se sube como privado y YouTube lo hace público solo a la hora programada, con la miniatura ganadora.' : 'Para subir desde aquí pon tu ID de cliente OAuth en Ajustes. Mientras, copia el paquete y prográmalo en YouTube Studio.'}</p></div>`;
  },

  retencion() {
    const v = vid(); if (!v) return crumb('retencion') + sinVideo();
    const R = v.retencion;
    return crumb('retencion') + `
    <div class="card"><p>Rafa revisa la curva de retención. Si en el <b>segundo 3</b> queda menos del <b>${S.cfg.ret3}%</b> de la gente, le manda un aviso a Gael (Guion) para que reanalice y mejore el gancho.</p>
      <div class="row">${v.publicado?.real && S.cfg.clientId ? `<button class="btn pri" onclick="leerRetencion(this)">Leer de YouTube</button>` : ''}
        <button class="btn" onclick="analizarRetencion(vid(), simularRetencion(vid()), 'demo');render()">Simular (demo)</button></div>
      <label class="f">O pega la curva (segundo, % que sigue viendo). Se exporta en YouTube Studio › Estadísticas › Retención</label>
      <textarea class="i" id="csv" placeholder="0,100&#10;1,91&#10;2,84&#10;3,78&#10;…"></textarea>
      <button class="btn sm" style="margin-top:6px" onclick="const c=parsearCSV($('#csv').value); if(c.length<3) return toast('Faltan datos: pon al menos 3 filas'); analizarRetencion(vid(), c, 'csv'); render()">Analizar curva</button></div>
    ${R ? `<div class="card"><div class="row"><div class="grow"><b>Guion v${R.version}</b> · ${R.fuente === 'demo' ? 'datos simulados' : R.fuente === 'csv' ? 'datos pegados' : 'YouTube Analytics'}</div>
      <span class="chip ${R.at3 < S.cfg.ret3 ? 'bad' : 'ok'}">Seg. 3: ${R.at3}%</span></div>${grafica(R, v)}
      ${R.at3 < S.cfg.ret3 ? `<p class="note bad">La gente se va en el segundo 3. Aviso enviado a Gael (Guion). <a href="#guion">Ver bandeja de Guion</a></p>` : `<p class="note ok">El gancho retiene. ${R.caidas.length ? 'Hay caídas a mitad del video: Gael ya tiene el detalle.' : ''}</p>`}</div>` : ''}`;
  },

  bandeja() {
    S.bandeja.forEach(m => m.leido = true); save(); setTimeout(badge);
    return `<div class="crumb"><button onclick="location.hash='oficina'">‹ Oficina</button></div><h2>Bandeja de avisos</h2>
    ${'Notification' in window && Notification.permission !== 'granted' ? `<div class="note warn">Activa las notificaciones para que las alarmas suenen aunque estés en otra pestaña. <button class="btn sm" onclick="Notification.requestPermission().then(render)">Activar</button></div>` : ''}
    ${S.bandeja.length ? S.bandeja.map(msgHTML).join('') : '<p class="sub">Sin avisos.</p>'}
    ${S.bandeja.length ? `<button class="btn sm" onclick="S.bandeja=S.bandeja.filter(m=>!m.resuelto);save();render()">Borrar los resueltos</button>` : ''}`;
  },

  ajustes() {
    const c = S.cfg;
    return `<div class="crumb"><button onclick="location.hash='oficina'">‹ Oficina</button></div><h2>Ajustes</h2>
    <div class="card"><h3 style="margin-top:0">El canal</h3>
      <label class="f">Nombre del canal</label><input class="i" value="${esc(S.canal.nombre)}" onchange="S.canal.nombre=this.value||'Mi canal';save();pintarTop()">
      <p class="sub" style="margin-top:8px">El canal se crea con tu cuenta de Google en <a href="https://www.youtube.com/create_channel" target="_blank" rel="noopener">youtube.com/create_channel</a>. Después conéctalo aquí para ver suscriptores, subir videos y leer la retención.</p>
      <button class="btn" ${c.clientId ? '' : 'disabled'} onclick="conectarCanal().then(()=>{toast('Canal conectado');render()}).catch(e=>toast(e.message))">${S.canal.conectado ? 'Volver a conectar' : 'Conectar mi canal'}</button></div>
    <div class="card"><h3 style="margin-top:0">Conexión con YouTube</h3>
      <label class="f">API key de YouTube Data v3 (para Tendencias con datos reales)</label><input class="i" type="password" autocomplete="off" value="${esc(c.apiKey)}" onchange="S.cfg.apiKey=this.value.trim();save()">
      <label class="f">ID de cliente OAuth (para subir videos y leer retención)</label><input class="i" autocomplete="off" value="${esc(c.clientId)}" placeholder="xxxx.apps.googleusercontent.com" onchange="S.cfg.clientId=this.value.trim();save();render()">
      <p class="sub" style="margin-top:8px">Se sacan gratis en console.cloud.google.com: crea un proyecto, activa <i>YouTube Data API v3</i> y <i>YouTube Analytics API</i>, crea una API key y un ID de cliente OAuth tipo "Aplicación web" con esta dirección como origen autorizado. Se guardan solo en este navegador.</p></div>
    <div class="card"><h3 style="margin-top:0">Reglas del equipo</h3>
      <div class="grid2"><div><label class="f">Alarma de Tendencias: video a cuántas veces la media</label><input class="i" type="number" min="2" step="1" value="${c.outlier}" onchange="S.cfg.outlier=Math.max(2,+this.value||10);save()"></div>
      <div><label class="f">Retención mínima en el segundo 3 (%)</label><input class="i" type="number" min="10" max="99" value="${c.ret3}" onchange="S.cfg.ret3=clamp(+this.value||70,10,99);save()"></div>
      <div><label class="f">Revisar tendencias cada (minutos)</label><input class="i" type="number" min="5" value="${c.auto}" onchange="S.cfg.auto=Math.max(5,+this.value||30);save();programar()"></div>
      <div><label class="f">Formato</label><select class="i" onchange="S.cfg.formato=this.value;save()"><option value="short" ${c.formato === 'short' ? 'selected' : ''}>Short (menos de 1 min)</option><option value="largo" ${c.formato === 'largo' ? 'selected' : ''}>Video largo</option></select></div>
      <div><label class="f">País de las tendencias</label><input class="i" value="${esc(c.region)}" maxlength="2" onchange="S.cfg.region=this.value.toUpperCase()||'MX';save()"></div>
      <div><label class="f">Apariencia</label><select class="i" onchange="S.cfg.theme=this.value;save();tema()">${[['auto', 'Automático'], ['light', 'Claro'], ['dark', 'Oscuro']].map(([k, l]) => `<option value="${k}" ${c.theme === k ? 'selected' : ''}>${l}</option>`).join('')}</select></div></div></div>
    <div class="card"><div class="row"><button class="btn" onclick="descargar(new Blob([JSON.stringify(S)],{type:'application/json'}),'oficina-respaldo.json')">Descargar respaldo</button>
      <button class="btn" onclick="if(confirm('¿Borrar todo lo de la oficina?')){localStorage.removeItem(KEY);location.reload()}">Empezar de cero</button></div></div>`;
  }
};

function grafica(R, v) {
  const W = 640, H = 220, P = 30, max = Math.max(R.curva[R.curva.length - 1][0], 4);
  const x = s => P + (s / max) * (W - P - 10), y = p => 10 + (1 - p / 100) * (H - 40);
  const pts = R.curva.map(([s, p]) => `${x(s).toFixed(1)},${y(clamp(p, 0, 100)).toFixed(1)}`).join(' ');
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Curva de retención: ${R.at3}% en el segundo 3">
    ${[0, 50, 100].map(p => `<line x1="${P}" x2="${W - 10}" y1="${y(p)}" y2="${y(p)}" stroke="currentColor" opacity=".12"/><text x="${P - 6}" y="${y(p) + 4}" font-size="11" text-anchor="end" fill="currentColor" opacity=".6">${p}%</text>`).join('')}
    <line x1="${P}" x2="${W - 10}" y1="${y(S.cfg.ret3)}" y2="${y(S.cfg.ret3)}" stroke="var(--danger)" stroke-dasharray="4 4"/>
    <line x1="${x(3)}" x2="${x(3)}" y1="10" y2="${H - 30}" stroke="currentColor" opacity=".4" stroke-dasharray="3 3"/>
    <text x="${x(3) + 4}" y="22" font-size="11" fill="currentColor">seg. 3</text>
    <polyline points="${pts}" fill="none" stroke="var(--c7)" stroke-width="3" stroke-linejoin="round"/>
    <circle cx="${x(3)}" cy="${y(R.at3)}" r="6" fill="${R.at3 < S.cfg.ret3 ? 'var(--danger)' : 'var(--ok)'}"/>
    ${R.caidas.map(c => `<circle cx="${x(c.s)}" cy="${y(retEn(R.curva, c.s))}" r="4" fill="var(--danger)" opacity=".7"/>`).join('')}
    <text x="${P}" y="${H - 8}" font-size="11" fill="currentColor" opacity=".6">0:00</text><text x="${W - 10}" y="${H - 8}" font-size="11" text-anchor="end" fill="currentColor" opacity=".6">${mmss(max)}</text></svg>`;
}

/* ---------- acciones desde la vista ---------- */
function editarLinea(i, t) { const v = vid(); t = t.trim(); if (!t || v.guion.lineas[i].texto === t) return; v.guion.lineas[i].texto = t; save(); if (i === 0) render(); }
function nuevoDesdeIdea(i) { const x = ideas()[i]; nuevoVideo(x.tema, x.from); render(); }
function usarIdea(ref, mid) { const v = S.tendencias.videos.find(x => x.id === ref); if (!v) return toast('Ese video ya no está en la lista'); const m = S.bandeja.find(x => x.id === mid); if (m) m.resuelto = true; nuevoVideo(temaDe(v.title, NICHOS.find(n => n.id === v.nicho) || nichoActual()), v); location.hash = 'guion'; render(); }
function reescribirYVer(id, mid) { const v = S.videos.find(x => x.id === id); S.actual = id; const m = S.bandeja.find(x => x.id === mid); reescribirGancho(v, m ? m.titulo : 'Prueba manual'); toast(`Guion v${v.version}: gancho nuevo`); location.hash = 'guion'; render(); }
function realMini(k, campo, val) { const v = vid(); v.minis.find(m => m.k === k).real[campo] = val.replace(/\D/g, ''); elegirGanadora(v); save(); render(); }
function calor(d, h) { const x = S.audiencia[d][h]; S.audiencia[d][h] = x >= 1 ? 0 : +Math.min(1, x + .25).toFixed(2); save(); render(); }
async function producirYVer() { await producir(); }
async function exportar(btn) {
  const v = vid(); btn.disabled = true; btn.textContent = 'Grabando… (dura lo mismo que el video)';
  try {
    if (!mem.musica[v.id]) await crearMusica(v);
    const audio = [mem.musica[v.id]];
    if (mem.voz[v.id]) { const a = new Audio(URL.createObjectURL(mem.voz[v.id])); audio.push(a); }
    const blob = await trabajando('animacion', () => reproducir(v, $('#stage'), { grabar: true, audio }));
    mem.video[v.id] = blob; log('animacion', `Video exportado (${(blob.size / 1e6).toFixed(1)} MB)`); toast('Video listo: ya puedes descargarlo o subirlo en Studio');
  } catch (e) { toast('No se pudo exportar: ' + e.message); }
  render();
}
async function subirYVer(btn) { btn.disabled = true; try { await subir(vid(), mem.video[vid().id]); toast('Subido y programado'); } catch (e) { toast('Studio: ' + e.message); log('studio', 'Error: ' + e.message); } render(); }
function marcarPublicado() { const v = vid(); v.publicado = { ts: Date.now(), cuando: v.studio.publicar, real: false }; v.paso.publicado = true; save();
  alerta({ de: 'studio', para: 'retencion', titulo: 'Video publicado', texto: `"${v.studio.titulo}". Pega la curva de retención cuando tenga vistas.`, videoId: v.id }); render(); }
function copiarPaquete() { const s = vid().studio; navigator.clipboard?.writeText(`${s.titulo}\n\n${s.desc}\n\nEtiquetas: ${s.tags.join(', ')}\nPublicar: ${new Date(s.publicar).toLocaleString('es-MX')}`).then(() => toast('Copiado'), () => toast('No se pudo copiar')); }
async function leerRetencion(btn) { btn.disabled = true; try { analizarRetencion(vid(), await retencionReal(vid()), 'youtube'); } catch (e) { toast(e.message); } render(); }
function tema() { const t = S.cfg.theme; document.documentElement.dataset.theme = t === 'dark' || (t !== 'light' && matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light'; }

function render() {
  const r = ruta(), f = VISTAS[r] || VISTAS.oficina;
  if (play && r !== 'animacion') play.stop();
  $('#view').innerHTML = f();
  if (r === 'miniaturas') document.querySelectorAll('.th canvas').forEach(c => dibujarMini(c.getContext('2d'), vid().minis.find(m => m.k === +c.dataset.k), c.width, c.height));
  if (r === 'animacion' && $('#stage')) { const v = vid(); dibujarEscena($('#stage').getContext('2d'), v.escenas[0], .5, 1280, 720, 0); }
  pintarTop();
}
let timer;
function programar() { clearInterval(timer); timer = setInterval(() => escanear().then(() => { if (ruta() === 'oficina' || ruta() === 'tendencias') render(); }), S.cfg.auto * 6e4); }
window.addEventListener('hashchange', () => { render(); scrollTo(0, 0); });
matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', tema);
render(); programar();
if (!S.tendencias.ultimo) escanear().then(render);

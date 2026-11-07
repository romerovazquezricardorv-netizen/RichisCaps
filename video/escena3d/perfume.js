// Escenas 3D del video "¿Por qué tu perfume huele distinto?" (notas de salida, corazón y fondo).
// Igual que escena.js: window.renderAt(t) -> JPEG del cuadro t, todo función pura del tiempo.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const W = 1080, H = 1920;
const Q = new URLSearchParams(location.search);
const timeline = await (await fetch(Q.get('tl') || '/build/perfume/timeline.json')).json();

const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1);
renderer.setSize(W, H);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
renderer.transmissionResolutionScale = 0.5;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.55;
const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 30000);
const FOG = new THREE.Color(0x140c2c);
scene.fog = new THREE.Fog(FOG, 22, 70);

// ------------------------------------------------------------------ utilidades
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const prog = (t, a, b) => clamp((t - a) / Math.max(1e-6, b - a));
const easeIO = x => { x = clamp(x); return x * x * (3 - 2 * x); };
const easeOut = x => { x = clamp(x); return 1 - Math.pow(1 - x, 3); };
const spring = x => { x = clamp(x); return 1 - Math.exp(-6 * x) * Math.cos(9 * x); };
const lerp = (a, b, p) => a + (b - a) * p;
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const lerpV = (a, b, p) => a.clone().lerp(b, p);
function rng(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

// Posiciones de cada "set" en el mundo
const HERO = V(0, 0, 0), PYR = V(20, 0, 0), SKIN = V(-20, 0, 0), FAB = V(0, 0, -20), ROW = V(0, 0, 20), BLOT = V(20, 0, 20);

// ------------------------------------------------------------------ cielo, estrellas, polvo
const skyMat = new THREE.ShaderMaterial({
  side: THREE.BackSide, depthWrite: false,
  uniforms: { top: { value: new THREE.Color(0x3b1d6e) }, bot: { value: FOG.clone() } },
  vertexShader: `varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }`,
  fragmentShader: `uniform vec3 top, bot; varying vec3 vP;
    void main(){ float h = clamp(vP.y*0.5+0.5,0.,1.); gl_FragColor = vec4(mix(bot, top, smoothstep(0.5,0.95,h)),1.); }`,
});
const sky = new THREE.Mesh(new THREE.SphereGeometry(20000, 32, 16), skyMat);
scene.add(sky);
const stars = (() => {
  const r = rng(3), p = [];
  for (let i = 0; i < 1500; i++) {
    const a = r() * Math.PI * 2, y = r() * 0.9 + 0.08, s = Math.sqrt(1 - y * y);
    p.push(Math.cos(a) * s * 15000, y * 15000, Math.sin(a) * s * 15000);
  }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3));
  return new THREE.Points(g, new THREE.PointsMaterial({ color: 0xf2e6ff, size: 2, sizeAttenuation: false, transparent: true, opacity: 0.45, fog: false }));
})();
scene.add(stars);

function softDot() {
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const g = c.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.4, 'rgba(255,255,255,0.5)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}
const DOT = softDot();
const DUSTN = 220, dustBase = [];
{ const r = rng(11); for (let i = 0; i < DUSTN; i++) dustBase.push([r() * 24 - 12, r() * 7, r() * 24 - 12, r() * 6.28]); }
const dustGeo = new THREE.BufferGeometry();
dustGeo.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(DUSTN * 3), 3));
const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: 0xffd9f0, size: 0.07, map: DOT, transparent: true, opacity: 0.7, depthWrite: false, blending: THREE.AdditiveBlending }));
scene.add(dust);

// ------------------------------------------------------------------ luces
scene.add(new THREE.HemisphereLight(0xb79cff, 0x120b24, 0.7));
const key = new THREE.DirectionalLight(0xfff0e0, 2.4);
key.castShadow = true;
key.shadow.mapSize.set(1024, 1024);
Object.assign(key.shadow.camera, { left: -7, right: 7, top: 7, bottom: -7, near: 1, far: 40 });
key.shadow.bias = -0.0005;
scene.add(key, key.target);
const rim = new THREE.DirectionalLight(0xff8fd0, 1.6);
scene.add(rim, rim.target);
const glow = new THREE.PointLight(0xffb36b, 0, 9, 1.5);
scene.add(glow);

// ------------------------------------------------------------------ suelo brillante
const ground = new THREE.Mesh(new THREE.PlaneGeometry(4000, 4000),
  new THREE.MeshStandardMaterial({ color: 0x0f0a22, roughness: 0.32, metalness: 0.3 }));
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);
const grid = new THREE.GridHelper(300, 150, 0x3a2a7a, 0x231a52);
grid.position.y = 0.005;
grid.material.transparent = true;
grid.material.opacity = 0.25;
scene.add(grid);

// ------------------------------------------------------------------ materiales
const GOLD = new THREE.MeshStandardMaterial({ color: 0xd8ab55, metalness: 1, roughness: 0.22 });
const glassMat = () => new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 1, thickness: 0.6, roughness: 0.04, ior: 1.45, clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 1.4 });
const std = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.45, ...o });

// ------------------------------------------------------------------ frasco
function makeBottle(liquidColor = 0xffa94d, label = 'PARFUM') {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new RoundedBoxGeometry(1.6, 2.0, 0.95, 6, 0.14), glassMat());
  body.position.y = 1.0; body.castShadow = true;
  const lg = new RoundedBoxGeometry(1.34, 1, 0.7, 4, 0.08); lg.translate(0, 0.5, 0);
  const liquid = new THREE.Mesh(lg, new THREE.MeshStandardMaterial({ color: liquidColor, roughness: 0.15, emissive: liquidColor, emissiveIntensity: 0.25 }));
  liquid.position.y = 0.14;
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.2, 0.24, 32), GOLD); neck.position.y = 2.1;
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.12, 48), GOLD); collar.position.y = 2.25;
  const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.16, 24), GOLD); nozzle.position.y = 2.38;
  const cap = new THREE.Mesh(new RoundedBoxGeometry(0.78, 0.72, 0.78, 4, 0.08), new THREE.MeshStandardMaterial({ color: 0x15101f, metalness: 0.6, roughness: 0.18 }));
  cap.position.y = 2.68; cap.castShadow = true;
  const capBand = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.08, 0.8), GOLD); capBand.position.y = -0.3; cap.add(capBand);
  // etiqueta
  const c = document.createElement('canvas'); c.width = 512; c.height = 160;
  const x = c.getContext('2d'); x.fillStyle = '#d8ab55'; x.font = '600 68px Georgia, serif'; x.textAlign = 'center'; x.textBaseline = 'middle';
  x.fillText(label, 256, 70); x.font = '400 30px Georgia, serif'; x.fillText('EAU DE PARFUM', 256, 128);
  const plate = new THREE.Mesh(new THREE.PlaneGeometry(1.05, 0.33), new THREE.MeshStandardMaterial({ map: new THREE.CanvasTexture(c), transparent: true, roughness: 0.3, metalness: 0.4 }));
  plate.position.set(0, 1.0, 0.481);
  [neck, collar, nozzle].forEach(m => (m.castShadow = true));
  g.add(body, liquid, neck, collar, nozzle, cap, plate);
  g.userData = { liquid, cap };
  return g;
}
const hero = makeBottle();
hero.position.copy(HERO);
scene.add(hero);
const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.75, 0.18, 96), new THREE.MeshStandardMaterial({ color: 0x1c1433, metalness: 0.5, roughness: 0.2 }));
pedestal.position.set(HERO.x, 0.09, HERO.z); pedestal.receiveShadow = true;
scene.add(pedestal);
hero.position.y = 0.18;

// ------------------------------------------------------------------ rocío
const MIST = 700;
const mistGeo = new THREE.BufferGeometry();
mistGeo.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(MIST * 3), 3));
mistGeo.setAttribute('color', new THREE.Float32BufferAttribute(new Float32Array(MIST * 3), 3));
const mist = new THREE.Points(mistGeo, new THREE.PointsMaterial({ size: 0.16, map: DOT, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
mist.frustumCulled = false;
scene.add(mist);
const mistSeed = [];
{ const r = rng(77); for (let i = 0; i < MIST; i++) mistSeed.push([r(), r() * 2 - 1, r() * 2 - 1, r(), r()]); }
// origen, dirección (normalizada), t de disparo
function setMist(t, origin, dir, t0, tint = [1, 0.85, 0.95]) {
  const P = mistGeo.attributes.position, C = mistGeo.attributes.color;
  const up = V(0, 1, 0), side = dir.clone().cross(up).normalize(), up2 = side.clone().cross(dir).normalize();
  for (let i = 0; i < MIST; i++) {
    const [b, sx, sy, sp, lf] = mistSeed[i];
    const a = t - (t0 + b * 0.55), life = 1.6 + lf * 1.6;
    if (a <= 0 || a > life) { P.setXYZ(i, 0, -50, 0); C.setXYZ(i, 0, 0, 0); continue; }
    const v = 5 + sp * 4, k = 2.2, dist = v * (1 - Math.exp(-k * a)) / k;
    const spread = 0.28 * dist;
    const p = origin.clone().addScaledVector(dir, dist).addScaledVector(side, sx * spread).addScaledVector(up2, sy * spread);
    p.y += 0.12 * a;
    const f = Math.pow(1 - a / life, 1.5) * 0.55;
    P.setXYZ(i, p.x, p.y, p.z); C.setXYZ(i, tint[0] * f, tint[1] * f, tint[2] * f);
  }
  P.needsUpdate = C.needsUpdate = true;
}
function hideMist() { const P = mistGeo.attributes.position; for (let i = 0; i < MIST; i++) P.setXYZ(i, 0, -50, 0); P.needsUpdate = true; }

// ------------------------------------------------------------------ pirámide olfativa
const LAYERS = [
  { rb: 2.5, rt: 1.66, h: 0.95, color: 0xc4782f },   // fondo
  { rb: 1.6, rt: 0.86, h: 0.95, color: 0xff6aa8 },   // corazón
  { rb: 0.82, rt: 0.02, h: 0.95, color: 0xffe066 },  // salida
];
const pyr = new THREE.Group();
pyr.position.copy(PYR);
scene.add(pyr);
const layers = LAYERS.map(L => {
  const geo = new THREE.CylinderGeometry(L.rt, L.rb, L.h, 4, 1); geo.rotateY(Math.PI / 4);
  const m = new THREE.Mesh(geo, new THREE.MeshPhysicalMaterial({ color: L.color, roughness: 0.18, clearcoat: 1, metalness: 0.05, emissive: L.color, emissiveIntensity: 0.05, transparent: true, flatShading: true }));
  m.castShadow = m.receiveShadow = true;
  pyr.add(m);
  return m;
});
function setPyramid(t, rise, gap, focus) {
  // focus: índice de la capa destacada (0 fondo, 1 corazón, 2 salida) o -1; las de arriba ya "evaporadas" se ven tenues
  let y = 0;
  layers.forEach((m, i) => {
    const L = LAYERS[i];
    m.position.y = (y + L.h / 2) * rise + i * gap;
    y += L.h;
    m.scale.setScalar(Math.max(0.001, rise));
    const on = focus === i;
    m.material.emissiveIntensity = on ? 0.45 + 0.15 * Math.sin(t * 5) : 0.05;
    m.material.opacity = focus >= 0 && i > focus ? 0.22 : 1;
  });
  pyr.rotation.y = t * 0.25;
}

// ------------------------------------------------------------------ ingredientes estilizados
function petalRing(n, r, len, wid, color, tilt) {
  const g = new THREE.Group();
  for (let i = 0; i < n; i++) {
    const p = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 12), std(color, { roughness: 0.55 }));
    p.scale.set(len, 0.05, wid);
    const a = i / n * Math.PI * 2;
    p.position.set(Math.cos(a) * r, 0, Math.sin(a) * r);
    p.rotation.set(0, -a, tilt);
    g.add(p);
  }
  return g;
}
const ING = {
  limon: () => { const g = new THREE.Group(); const m = new THREE.Mesh(new THREE.SphereGeometry(0.45, 32, 24), std(0xf6d32b, { roughness: 0.6 })); m.scale.set(1.25, 1, 1); g.add(m);
    [-1, 1].forEach(s => { const c = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.18, 16), std(0xf6d32b)); c.rotation.z = -s * Math.PI / 2; c.position.x = s * 0.6; g.add(c); }); return g; },
  bergamota: () => { const g = new THREE.Group(); g.add(new THREE.Mesh(new THREE.SphereGeometry(0.42, 32, 24), std(0xb5cf45, { roughness: 0.6 })));
    const l = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 8), std(0x2f8a3a)); l.scale.set(1, 0.15, 0.5); l.position.set(0.12, 0.42, 0); g.add(l); return g; },
  toronja: () => { const g = new THREE.Group(); const m = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 24), std(0xf28a5b, { roughness: 0.6 })); g.add(m);
    return g; },
  jazmin: () => { const g = petalRing(5, 0.32, 0.36, 0.17, 0xfff8ea, 0.15); const c = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 12), std(0xf2c94c)); g.add(c); g.rotation.x = 1.1; return g; },
  rosa: () => { const g = new THREE.Group(); [[7, 0.36, 0.3, 0.2, 0.5], [6, 0.22, 0.24, 0.17, 0.9], [5, 0.1, 0.18, 0.13, 1.3]].forEach(([n, r, l, w, tl], k) => {
      const ring = petalRing(n, r, l, w, 0xd8325f, tl); ring.position.y = k * 0.08; ring.rotation.y = k * 0.4; g.add(ring); }); g.rotation.x = 0.9; return g; },
  lavanda: () => { const g = new THREE.Group(); const st = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.4, 8), std(0x4f8a4a)); g.add(st);
    for (let i = 0; i < 16; i++) { const b = new THREE.Mesh(new THREE.SphereGeometry(0.075, 12, 8), std(0x8e6bd6, { roughness: 0.5 })); const a = i * 2.4; b.position.set(Math.cos(a) * 0.07, 0.2 + i * 0.033, Math.sin(a) * 0.07); g.add(b); }
    g.rotation.z = 0.35; return g; },
  vainilla: () => { const g = new THREE.Group(); [-0.08, 0.1].forEach((x, k) => { const p = new THREE.Mesh(new THREE.CapsuleGeometry(0.06, 1.4, 6, 12), std(0x3a2214, { roughness: 0.7 })); p.position.x = x; p.rotation.z = (k ? -1 : 1) * 0.12 + Math.PI / 2; g.add(p); }); return g; },
  sandalo: () => { const g = new THREE.Group(); const log = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.3, 1.1, 24), std(0x8a5530, { roughness: 0.8 })); log.rotation.z = Math.PI / 2; g.add(log);
    [-1, 1].forEach(s => { const e = new THREE.Mesh(new THREE.CircleGeometry(0.28, 24), std(0xd2a06a)); e.position.x = s * 0.551; e.rotation.y = s * Math.PI / 2; g.add(e); }); return g; },
  ambar: () => { const g = new THREE.Group(); const m = new THREE.Mesh(new THREE.IcosahedronGeometry(0.42, 0), new THREE.MeshPhysicalMaterial({ color: 0xffa21f, transmission: 0.6, thickness: 0.6, roughness: 0.08, ior: 1.5, emissive: 0x7a3a00, emissiveIntensity: 0.5 })); m.scale.set(1, 1.2, 0.9); g.add(m); return g; },
};
const ingSets = {
  salida: [['limon', V(-1.0, 3.75, 2.2)], ['bergamota', V(0, 4.15, 2.5)], ['toronja', V(1.0, 3.75, 2.2)]],
  corazon: [['jazmin', V(-1.05, 2.4, 2.6)], ['rosa', V(0, 2.8, 2.9)], ['lavanda', V(1.05, 2.3, 2.6)]],
  fondo: [['vainilla', V(-1.1, 1.15, 3.0)], ['sandalo', V(0, 1.55, 3.3)], ['ambar', V(1.1, 1.15, 3.0)]],
};
const ingMeshes = {};
for (const [k, list] of Object.entries(ingSets)) {
  ingMeshes[k] = list.map(([name, p]) => { const m = ING[name](); m.position.copy(PYR).add(p); m.userData.base = m.position.clone(); m.traverse(o => (o.castShadow = true)); scene.add(m); return m; });
}
function setIngredients(set, t, cues) {
  ingMeshes[set].forEach((m, i) => {
    const c = cues[i];
    const p = c === undefined ? 0 : prog(t, c - 0.05, c + 0.55);
    m.visible = p > 0;
    m.scale.setScalar(Math.max(0.001, spring(p)) * 0.7);
    m.position.copy(m.userData.base); m.position.y += 0.08 * Math.sin(t * 2 + i);
    m.rotation.y = t * 0.6 + i;
  });
}

// ------------------------------------------------------------------ moléculas
const MOL = { salida: { n: 46, r: 0.085, c: 0xfff07a }, corazon: { n: 30, r: 0.13, c: 0xff7eb6 }, fondo: { n: 18, r: 0.21, c: 0xc0712f } };
const MOLN = MOL.salida.n + MOL.corazon.n + MOL.fondo.n;
const mol = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 2), new THREE.MeshStandardMaterial({ roughness: 0.25, metalness: 0.1, emissive: 0xffffff, emissiveIntensity: 0.12 }), MOLN);
mol.castShadow = true; mol.frustumCulled = false;
scene.add(mol);
const molInfo = [];
{
  const r = rng(9); let i = 0;
  for (const [tipo, M] of Object.entries(MOL)) for (let k = 0; k < M.n; k++) {
    const rr = 2.6 * Math.sqrt(r()), a = r() * 6.283;
    molInfo.push({ tipo, r: M.r, x: Math.cos(a) * rr, z: Math.sin(a) * rr, d: r(), w: r() * 6.28 });
    mol.setColorAt(i++, new THREE.Color(M.c));
  }
}
const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _p = V(0, 0, 0);
// estado(tipo) -> { show, leave (seg. en que empieza a irse o null), spread, drop (seg. en que cae o null) }
function setMolecules(t, center, surfaceY, estado) {
  let n = 0;
  for (const m of molInfo) {
    const e = estado(m.tipo);
    if (!e || !e.show) continue;
    let y = (typeof surfaceY === 'function' ? surfaceY(m.x, m.z) : surfaceY) + m.r * 0.85, s = m.r, x = m.x, z = m.z;
    if (e.drop !== undefined && e.drop !== null) {     // cae y rebota
      const td = e.drop + m.d * 0.5, a = t - td;
      if (a < 0) continue;
      const fall = 3.5 * Math.max(0, 1 - a / 0.45) ** 2;
      const bounce = a > 0.45 ? 0.25 * Math.exp(-(a - 0.45) * 7) * Math.abs(Math.sin((a - 0.45) * 14)) : 0;
      y += fall + bounce;
    }
    if (e.leave !== undefined && e.leave !== null) {   // se evapora: sube, ondula y se encoge
      const tl = e.leave + m.d * (e.spread ?? 1.2), a = t - tl;
      if (a > 0) {
        const dur = e.dur ?? 1.6, p = a / dur;
        if (p >= 1) continue;
        y += 4.5 * p * p + 0.6 * p;
        x += 0.3 * Math.sin(a * 5 + m.w); z += 0.3 * Math.cos(a * 4 + m.w);
        s *= 1 - p * 0.9;
      }
    }
    y += 0.04 * Math.sin(t * 3 + m.w);
    _p.set(center.x + x, y, center.z + z);
    _m.compose(_p, _q.identity(), V(s, s, s));
    mol.setMatrixAt(n, _m);
    mol.setColorAt(n, new THREE.Color(MOL[m.tipo].c));
    n++;
  }
  mol.count = n;
  mol.instanceMatrix.needsUpdate = true;
  if (mol.instanceColor) mol.instanceColor.needsUpdate = true;
}

// ------------------------------------------------------------------ piel, reloj, tela
const skin = new THREE.Mesh(new THREE.CylinderGeometry(3.1, 3.3, 0.4, 96), new THREE.MeshStandardMaterial({ color: 0xd99c7e, roughness: 0.55 }));
skin.position.set(SKIN.x, 0.2, SKIN.z); skin.receiveShadow = skin.castShadow = true;
scene.add(skin);
const skinRing = new THREE.Mesh(new THREE.TorusGeometry(3.22, 0.05, 12, 128), GOLD);
skinRing.rotation.x = Math.PI / 2; skinRing.position.set(SKIN.x, 0.4, SKIN.z);
scene.add(skinRing);
const clock = new THREE.Group();
{
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.05, 12, 96), GOLD); clock.add(ring);
  for (let i = 0; i < 12; i++) { const tk = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.16, 0.04), GOLD); const a = i / 12 * Math.PI * 2; tk.position.set(Math.sin(a) * 0.72, Math.cos(a) * 0.72, 0); tk.rotation.z = -a; clock.add(tk); }
  const face = new THREE.Mesh(new THREE.CircleGeometry(0.88, 64), new THREE.MeshStandardMaterial({ color: 0x1a1230, transparent: true, opacity: 0.75 })); face.position.z = -0.02; clock.add(face);
  const hand = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.62, 0.04), new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.6 }));
  hand.geometry.translate(0, 0.28, 0.03); clock.add(hand); clock.userData.hand = hand;
}
scene.add(clock);
const fabGeo = new THREE.PlaneGeometry(6.5, 5, 70, 54);
const fabH = (x, y) => 0.18 * Math.sin(x * 1.6 + y * 0.4) + 0.1 * Math.sin(y * 2.3 - x) + 0.05 * Math.sin(x * 5);
{ const p = fabGeo.attributes.position; for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i); p.setZ(i, fabH(x, y)); } fabGeo.computeVertexNormals(); }
const fabric = new THREE.Mesh(fabGeo, new THREE.MeshStandardMaterial({ color: 0x2b3470, roughness: 0.95, side: THREE.DoubleSide }));
fabric.rotation.x = -Math.PI / 2; fabric.position.set(FAB.x, 0.45, FAB.z); fabric.receiveShadow = true;
fabric.material.shadowSide = THREE.FrontSide;
scene.add(fabric);

// ------------------------------------------------------------------ fila de concentraciones
function textSprite(lines, w = 512, h = 220) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const x = c.getContext('2d'); x.textAlign = 'center'; x.textBaseline = 'middle';
  x.fillStyle = '#ffffff'; x.font = '700 60px Inter, Arial, sans-serif'; x.fillText(lines[0], w / 2, 70);
  x.fillStyle = '#d8ab55'; x.font = '600 52px Inter, Arial, sans-serif'; x.fillText(lines[1], w / 2, 160);
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false }));
  s.scale.set(1.9, 1.9 * h / w, 1);
  return s;
}
const ROWDEF = [['Colonia', '2–5 %', 0.16, 0xffe9a8], ['Eau de Toilette', '5–15 %', 0.4, 0xffc477], ['Eau de Parfum', '15–20 %', 0.62, 0xff9a4d], ['Extracto', '20–30 %', 0.95, 0xe4682a]];
const rowBottles = ROWDEF.map(([a, b, lvl, col], i) => {
  const g = makeBottle(col, ['COLOGNE', 'TOILETTE', 'PARFUM', 'EXTRAIT'][i]);
  g.scale.setScalar(0.8);
  g.position.set(ROW.x + (i - 1.5) * 1.8, 0, ROW.z);
  g.userData.level = lvl;
  const lab = textSprite([a, b]); lab.position.set(ROW.x + (i - 1.5) * 1.8, 0.12, ROW.z + 1.7); lab.scale.multiplyScalar(0.85);
  g.userData.label = lab;
  scene.add(g, lab);
  return g;
});
const spot = new THREE.SpotLight(0xffe2b0, 0, 12, 0.35, 0.6, 1);
scene.add(spot, spot.target);

// ------------------------------------------------------------------ tira de prueba (consejo)
const blotter = new THREE.Group();
{
  const strip = new THREE.Mesh(new THREE.BoxGeometry(0.34, 2.6, 0.02), std(0xfbf7ef, { roughness: 0.9 }));
  strip.position.y = 1.5; strip.castShadow = true;
  const tip = new THREE.Mesh(new THREE.ConeGeometry(0.17, 0.25, 4), std(0xfbf7ef, { roughness: 0.9 })); tip.rotation.z = Math.PI; tip.position.y = 0.08; tip.scale.z = 0.1;
  const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.55, 0.12, 48), GOLD); stand.position.y = 0.06;
  const pin = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.2, 0.06), GOLD); pin.position.y = 0.18;
  blotter.add(strip, stand, pin);
}
blotter.position.copy(BLOT); blotter.rotation.y = 0.35;
scene.add(blotter);
const blotBottle = makeBottle();
blotBottle.position.set(BLOT.x + 2.4, 0, BLOT.z + 0.3); blotBottle.rotation.y = -0.4; blotBottle.scale.setScalar(0.85);
scene.add(blotBottle);

// ------------------------------------------------------------------ estado por escena
const SETS = [hero, pedestal, pyr, skin, skinRing, clock, fabric, blotter, blotBottle, ...rowBottles, ...rowBottles.map(b => b.userData.label)];
function resetWorld() {
  SETS.forEach(o => (o.visible = false));
  Object.values(ingMeshes).flat().forEach(m => (m.visible = false));
  mol.count = 0;
  hideMist();
  glow.intensity = 0; spot.intensity = 0;
  hero.userData.cap.position.set(0, 2.68, 0); hero.userData.cap.rotation.set(0, 0, 0);
  scene.fog.near = 22; scene.fog.far = 70;
}
function lightAt(c) {
  key.position.copy(c).add(V(-5, 10, 7)); key.target.position.copy(c);
  rim.position.copy(c).add(V(6, 4, -8)); rim.target.position.copy(c);
}

const SCENES = {
  gancho(t, d, cue) {
    hero.visible = pedestal.visible = true; lightAt(HERO);
    const ts = cue.spray ?? 0.8;
    const cp = easeOut(prog(t, ts - 0.55, ts - 0.1));
    hero.userData.cap.position.set(-0.9 * cp, 2.68 + 0.9 * cp, 0.3 * cp); hero.userData.cap.rotation.set(0.4 * cp, 0, 0.6 * cp);
    setMist(t, V(HERO.x + 0.12, 2.57, HERO.z + 0.05), V(1, 0.12, 0.35).normalize(), ts);
    hero.rotation.y = -0.35 + 0.08 * Math.sin(t * 0.8);
    const p = easeIO(t / d);
    return { pos: lerpV(V(-1.0, 1.5, 8.2), V(-0.2, 2.0, 6.6), p), tgt: V(0.6, 1.7, 0), fov: 40 };
  },
  capas(t, d, cue) {
    pyr.visible = true; lightAt(PYR);
    const tc = cue.capas ?? d * 0.6;
    setPyramid(t, spring(prog(t, 0, 0.9)), 0.4 * easeOut(prog(t, tc, tc + 0.7)), -1);
    glow.position.copy(PYR).add(V(0, 2, 3)); glow.intensity = 6;
    const a = lerp(-0.5, 0.3, easeIO(t / d));
    return { pos: V(PYR.x + Math.sin(a) * 8.5, 3.2, PYR.z + Math.cos(a) * 8.5), tgt: PYR.clone().add(V(0, 1.6, 0)), fov: 40 };
  },
  salida(t, d, cue) {
    pyr.visible = true; lightAt(PYR);
    setPyramid(t, 1, 0.4, 2);
    setIngredients('salida', t, [cue.i1, cue.i2, cue.i3]);
    glow.position.copy(PYR).add(V(0, 4, 3)); glow.intensity = 8; glow.color.set(0xfff0a0);
    const p = easeIO(t / d);
    return { pos: lerpV(PYR.clone().add(V(-0.5, 4.3, 8.4)), PYR.clone().add(V(0.4, 4.0, 7.6)), p), tgt: PYR.clone().add(V(0, 3.6, 0)), fov: 40 };
  },
  ligeras(t, d, cue) {
    skin.visible = skinRing.visible = clock.visible = true; lightAt(SKIN);
    const te = cue.evap ?? d * 0.4;
    setMolecules(t, SKIN, 0.4, tipo => ({ show: true, leave: tipo === 'salida' ? te : null, spread: 1.4 }));
    clock.position.copy(SKIN).add(V(2.4, 2.3, -1.6)); clock.scale.setScalar(0.8);
    clock.userData.hand.rotation.z = -Math.PI * 2 * 0.25 * easeIO(prog(t, te, (cue.min ?? d * 0.7) + 0.4));
    const a = lerp(-0.25, 0.25, easeIO(t / d));
    return { pos: V(SKIN.x + Math.sin(a) * 7.5, 4.6, SKIN.z + Math.cos(a) * 7.5), tgt: SKIN.clone().add(V(0, 1.4, 0)), fov: 42 };
  },
  corazon(t, d, cue) {
    pyr.visible = true; lightAt(PYR);
    setPyramid(t, 1, 0.4, 1);
    setIngredients('corazon', t, [cue.i1, cue.i2, cue.i3]);
    glow.position.copy(PYR).add(V(0, 2.5, 3)); glow.intensity = 8; glow.color.set(0xff8fc0);
    const p = easeIO(t / d);
    return { pos: lerpV(PYR.clone().add(V(-0.6, 3.4, 8.8)), PYR.clone().add(V(0.5, 3.1, 8.0)), p), tgt: PYR.clone().add(V(0, 2.3, 0)), fov: 40 };
  },
  fondo(t, d, cue) {
    pyr.visible = true; lightAt(PYR);
    setPyramid(t, 1, 0.4, 0);
    setIngredients('fondo', t, [cue.i1, cue.i2, cue.i3]);
    glow.position.copy(PYR).add(V(0, 1.5, 3.5)); glow.intensity = 9; glow.color.set(0xffa050);
    const p = easeIO(t / d);
    return { pos: lerpV(PYR.clone().add(V(-0.6, 2.0, 9.4)), PYR.clone().add(V(0.5, 1.8, 8.6)), p), tgt: PYR.clone().add(V(0, 1.05, 0)), fov: 40 };
  },
  pesadas(t, d, cue) {
    skin.visible = skinRing.visible = clock.visible = true; lightAt(SKIN);
    setMolecules(t, SKIN, 0.4, tipo => tipo === 'fondo' ? { show: true, drop: 0.15 } : tipo === 'corazon' ? { show: true, leave: 0.1, spread: 1.0, dur: 2.2 } : null);
    clock.position.copy(SKIN).add(V(2.4, 2.3, -1.6)); clock.scale.setScalar(0.8);
    clock.userData.hand.rotation.z = -Math.PI * 2 * (0.25 + 1.75 * easeIO(prog(t, 0.3, (cue.seis ?? d * 0.8) + 0.3)));
    glow.position.copy(SKIN).add(V(0, 1.2, 2)); glow.intensity = 5; glow.color.set(0xffa050);
    const p = easeIO(t / d);
    return { pos: lerpV(SKIN.clone().add(V(3.0, 3.0, 6.4)), SKIN.clone().add(V(2.0, 2.4, 5.4)), p), tgt: SKIN.clone().add(V(0, 1.0, 0)), fov: 42 };
  },
  ropa(t, d, cue) {
    fabric.visible = true; lightAt(FAB);
    setMolecules(t, FAB, (x, z) => 0.45 + fabH(x, -z), tipo => tipo === 'fondo' ? { show: true, drop: 0.05 } : null);
    glow.position.copy(FAB).add(V(0, 1.5, 1.5)); glow.intensity = 6 + 2 * Math.sin(t * 4); glow.color.set(0xffa050);
    const a = lerp(0.6, 0.15, easeIO(t / d));
    return { pos: V(FAB.x + Math.sin(a) * 6.5, 4.2, FAB.z + Math.cos(a) * 6.5), tgt: FAB.clone().add(V(0, 0.4, 0)), fov: 40 };
  },
  concentracion(t, d, cue) {
    lightAt(ROW);
    rowBottles.forEach((b, i) => {
      b.visible = b.userData.label.visible = true;
      const lv = b.userData.level * easeOut(prog(t, 0.2 + i * 0.3, 1.2 + i * 0.3));
      b.userData.liquid.scale.y = Math.max(0.01, lv * 1.72);
      b.userData.label.material.opacity = easeOut(prog(t, 0.3 + i * 0.3, 0.8 + i * 0.3));
    });
    const c1 = cue.c1 ?? d * 0.35, c4 = cue.c4 ?? d * 0.75;
    const focus = t >= c4 - 0.1 ? 3 : t >= c1 - 0.1 ? 0 : -1;
    if (focus >= 0) {
      const b = rowBottles[focus];
      spot.position.set(b.position.x, 6, ROW.z + 2.5); spot.target.position.set(b.position.x, 0.8, ROW.z); spot.intensity = 60;
    }
    const tx = t < c4 - 0.4 ? lerp(0, -2.7, easeIO(prog(t, c1 - 0.6, c1 + 0.3))) : lerp(-2.7, 2.7, easeIO(prog(t, c4 - 0.4, c4 + 0.5)));
    const zc = lerp(11.5, 8.0, easeIO(prog(t, c1 - 0.6, c1 + 0.3)));
    return { pos: V(ROW.x + tx * 0.75, 2.6, ROW.z + zc), tgt: V(ROW.x + tx * 0.9, 1.7, ROW.z), fov: 40 };
  },
  consejo(t, d, cue) {
    blotter.visible = blotBottle.visible = true; lightAt(BLOT);
    const ts = 0.35;
    const nozzle = blotBottle.localToWorld(V(0, 2.4, 0));
    setMist(t, nozzle, V(-1, 0.05, -0.25).normalize(), ts, [1, 0.95, 0.6]);
    blotBottle.userData.cap.position.set(0.5, 3.2, 0); blotBottle.userData.cap.rotation.z = -0.6;
    const tn = cue.nojuz ?? d * 0.55;
    glow.position.copy(BLOT).add(V(0, 2, 1)); glow.color.set(0xfff0a0); glow.intensity = 6 * (1 - easeIO(prog(t, tn, tn + 1.2)));
    const p = easeIO(t / d);
    return { pos: lerpV(BLOT.clone().add(V(0.4, 2.2, 7.4)), BLOT.clone().add(V(0.9, 2.0, 6.2)), p), tgt: BLOT.clone().add(V(1.2, 1.5, 0)), fov: 40 };
  },
  final(t, d, cue) {
    hero.visible = pedestal.visible = true; lightAt(HERO);
    hero.rotation.y = -0.5 + 0.35 * easeIO(t / d);
    // moléculas de corazón girando alrededor del frasco
    const tf = cue.fin ?? d * 0.6;
    let n = 0;
    for (let i = 0; i < 30; i++) {
      const a = i / 30 * Math.PI * 2 + t * 0.8, burst = 1 + 0.6 * easeOut(prog(t, tf, tf + 0.8));
      const r = (1.5 + 0.3 * Math.sin(i * 1.7)) * burst, y = 0.6 + (i % 10) * 0.22 + 0.15 * Math.sin(t * 2 + i);
      _p.set(HERO.x + Math.cos(a) * r, y, HERO.z + Math.sin(a) * r);
      const s = 0.11 * easeOut(prog(t, 0.1 + i * 0.03, 0.6 + i * 0.03));
      _m.compose(_p, _q.identity(), V(s, s, s)); mol.setMatrixAt(n, _m); mol.setColorAt(n, new THREE.Color(MOL.corazon.c)); n++;
    }
    mol.count = n; mol.instanceMatrix.needsUpdate = true; mol.instanceColor.needsUpdate = true;
    glow.position.copy(HERO).add(V(0, 2, 2)); glow.color.set(0xff8fc0); glow.intensity = 7;
    const p = easeIO(t / d);
    return { pos: lerpV(V(0.3, 1.9, 7.0), V(0.1, 2.0, 5.0), p), tgt: V(0, 1.5, 0), fov: 40 };
  },
};

function segAt(t) {
  const S = timeline.segments;
  for (let i = 0; i < S.length; i++) if (t < S[i].end || i === S.length - 1) return S[i];
}

window.renderAt = t => {
  resetWorld();
  const seg = segAt(t);
  const lt = t - seg.start, d = seg.end - seg.start;
  const cue = {};
  for (const [k, v] of Object.entries(seg.cues || {})) cue[k] = v - seg.start;
  const sh = SCENES[seg.scene](lt, d, cue);
  camera.position.copy(sh.pos).add(V(Math.sin(t * 1.3) * 0.04, Math.sin(t * 1.7 + 1) * 0.03, Math.cos(t * 1.1) * 0.04));
  camera.fov = sh.fov * (1 - 0.07 * (1 - easeOut(lt / 0.45)));
  camera.updateProjectionMatrix();
  camera.lookAt(sh.tgt);
  sky.position.copy(camera.position);
  stars.position.copy(camera.position);
  // polvo alrededor del set actual
  const a = dust.geometry.attributes.position;
  for (let i = 0; i < DUSTN; i++) {
    const [x, y, z, ph] = dustBase[i];
    a.setXYZ(i, sh.tgt.x + x + Math.sin(t * 0.3 + ph) * 0.6, ((y + t * 0.15) % 7), sh.tgt.z + z + Math.cos(t * 0.25 + ph) * 0.6);
  }
  a.needsUpdate = true;
  renderer.render(scene, camera);
  return renderer.domElement.toDataURL('image/jpeg', 0.95);
};
window.ready = true;

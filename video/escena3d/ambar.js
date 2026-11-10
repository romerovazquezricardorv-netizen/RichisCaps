// Escenas 3D del video "Ámbar gris: el ingrediente de perfume que sale de una ballena".
// Reutiliza la base de bano.js (frasco, rocío, personajes, corazones...) y agrega mar, cachalote, calamares y playa.
// Igual que escena.js: window.renderAt(t) -> JPEG del cuadro t, todo función pura del tiempo.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

const W = 1080, H = 1920;
const Q = new URLSearchParams(location.search);
const timeline = await (await fetch(Q.get('tl') || '/build/ambar_gris/timeline.json')).json();
const font = await new FontLoader().loadAsync('/node_modules/three/examples/fonts/helvetiker_bold.typeface.json');

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
  { rb: 2.5, rt: 1.66, h: 0.95, color: 0xf08a24 },   // fondo (ámbar)
  { rb: 1.6, rt: 0.86, h: 0.95, color: 0xff3d8b },   // corazón (rosa intenso)
  { rb: 0.82, rt: 0.02, h: 0.95, color: 0xfff04a },  // salida (limón)
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
const DIM = new THREE.Color(0x2a2140);
// rise[i]: 0..1 entrada de cada capa; gap: separación; focus: capa destacada (0 fondo, 1 corazón, 2 salida) o -1;
// pop: 0..1 cuánto sale hacia la cámara la capa destacada; T: tiempo global (giro continuo entre cortes)
function setPyramid(T, rise, gap, focus, pop = 1) {
  let y = 0;
  layers.forEach((m, i) => {
    const L = LAYERS[i], r = Array.isArray(rise) ? rise[i] : rise;
    const on = focus === i;
    m.position.set(0, (y + L.h / 2) + i * gap + (1 - r) * 4.5, on ? 1.0 * pop : 0);
    y += L.h;
    m.scale.setScalar(Math.max(0.001, Math.min(1, r * 1.0)) * (on ? 1 + 0.12 * pop : 1));
    m.rotation.y = T * (on ? 0.9 : 0.3);
    m.material.color.set(L.color);
    if (focus >= 0 && !on) m.material.color.lerp(DIM, 0.55);
    m.material.emissive.set(L.color);
    m.material.emissiveIntensity = on ? 0.5 + 0.2 * Math.sin(T * 5) : focus >= 0 ? 0.02 : 0.12;
    m.material.opacity = 1;
    m.visible = r > 0.001;
  });
  pyr.rotation.y = 0;
}
// destellos de color alrededor de la capa destacada
const SPARKN = 160;
const sparkGeo = new THREE.BufferGeometry();
sparkGeo.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(SPARKN * 3), 3));
const sparks = new THREE.Points(sparkGeo, new THREE.PointsMaterial({ size: 0.16, map: DOT, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, color: 0xffffff }));
sparks.frustumCulled = false;
scene.add(sparks);
const sparkSeed = []; { const r = rng(31); for (let i = 0; i < SPARKN; i++) sparkSeed.push([r() * 6.28, r(), r(), r()]); }
function setSparks(T, center, radius, height, color, amount = 1) {
  sparks.visible = true;
  sparks.material.color.set(color);
  sparks.material.opacity = amount;
  const P = sparkGeo.attributes.position;
  for (let i = 0; i < SPARKN; i++) {
    const [a0, rr, h, sp] = sparkSeed[i];
    const a = a0 + T * (0.6 + sp * 0.8), r = radius * (0.8 + rr * 0.6);
    P.setXYZ(i, center.x + Math.cos(a) * r, center.y + (h - 0.5) * height + 0.15 * Math.sin(T * 2 + a0 * 3), center.z + Math.sin(a) * r);
  }
  P.needsUpdate = true;
}
// anillo de luz en el piso
const floorRing = new THREE.Mesh(new THREE.TorusGeometry(3.0, 0.05, 12, 160), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending }));
floorRing.rotation.x = Math.PI / 2;
const floorRing2 = floorRing.clone(); floorRing2.material = floorRing.material.clone(); floorRing2.scale.setScalar(1.25);
scene.add(floorRing, floorRing2);
function setFloorRings(T, center, color) {
  [floorRing, floorRing2].forEach((m, k) => {
    m.visible = true; m.position.set(center.x, 0.03, center.z);
    m.material.color.set(color);
    const ph = (T * 0.5 + k * 0.5) % 1;
    m.scale.setScalar(0.8 + ph * 0.9); m.material.opacity = 0.9 * (1 - ph);
  });
}
// bokeh de color al fondo
const BOKN = 70;
const bokGeo = new THREE.BufferGeometry();
bokGeo.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(BOKN * 3), 3));
const bokeh = new THREE.Points(bokGeo, new THREE.PointsMaterial({ size: 1.1, map: DOT, transparent: true, opacity: 0.35, depthWrite: false, blending: THREE.AdditiveBlending }));
bokeh.frustumCulled = false;
scene.add(bokeh);
const bokSeed = []; { const r = rng(57); for (let i = 0; i < BOKN; i++) bokSeed.push([r() * 26 - 13, r() * 9 + 0.5, -(r() * 12 + 7), r() * 6.28]); }
// paletas de fondo por escena: [cielo arriba, cielo abajo/niebla, bokeh]
const PALETA = {
  gancho: [0x5a1f7a, 0x170b2e, 0xff8fd0], capas: [0x4a1f8a, 0x160b30, 0xb98cff],
  salida: [0x0f6b62, 0x07201f, 0xfff04a], ligeras: [0x1b5f6e, 0x081a22, 0xfff07a],
  corazon: [0x7a1d63, 0x22081f, 0xff4f9a], fondo: [0x7a3d12, 0x241108, 0xffa23d],
  pesadas: [0x6b3a14, 0x1f1008, 0xffb060], ropa: [0x24307a, 0x0b0f2a, 0xffa23d],
  concentracion: [0x5a2a10, 0x180c06, 0xffc477], consejo: [0x1f5a6b, 0x071a20, 0xfff0a0],
  final: [0x7a1d63, 0x1c0a26, 0xff6fb0],
};

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
const LAYER_Y = [0.475, 1.425, 2.375];   // centro de cada capa sin separación
function setIngredients(set, t, cues, T) {
  const li = { fondo: 0, corazon: 1, salida: 2 }[set];
  ingMeshes[set].forEach((m, i) => {
    const c = cues[i];
    const p = c === undefined ? 0 : prog(t, c - 0.05, c + 0.55);
    m.visible = p > 0;
    m.scale.setScalar(Math.max(0.001, spring(p)) * 0.95);
    // órbita: cada ingrediente entra por el frente y gira alrededor de su capa
    const a = Math.PI / 2 + (i - 1) * 0.75 + 0.45 * Math.max(0, t - (c ?? 0)) ;
    const R = 2.5 + 0.2 * li;
    m.position.set(PYR.x + Math.cos(a) * R, LAYER_Y[li] + 0.45 * li + 0.6 + 0.12 * Math.sin(T * 2 + i), PYR.z + Math.sin(a) * R + 0.4);
    m.rotation.y = T * 0.8 + i; m.rotation.x = 0.2 * Math.sin(T + i);
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
  g.position.set(ROW.x + (i - 1.5) * 3.0, 0, ROW.z);
  g.userData.level = lvl;
  const lab = textSprite([a, b]); lab.position.set(ROW.x + (i - 1.5) * 3.0, 0.5, ROW.z + 1.7); lab.scale.multiplyScalar(0.85);
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

// ================================================================== PERSONAJES Y UTILERÍA (video "en cada piel")
const BU = V(0, 0, 40), PANS = V(40, 0, 0), DUO = V(-40, 0, 0), GYM = V(0, 0, -40), WIN = V(14, 0, -40), BAC = V(40, 0, 40), NOSE = V(-40, 0, 40);

function text3d(str, size, mat, depth = 0.2) {
  const g = new TextGeometry(str, { font, size, depth, curveSegments: 6, bevelEnabled: true, bevelThickness: depth * 0.25, bevelSize: size * 0.03, bevelSegments: 3 });
  g.computeBoundingBox(); const b = g.boundingBox; g.translate(-(b.max.x + b.min.x) / 2, 0, -(b.max.z + b.min.z) / 2);
  const m = new THREE.Mesh(g, mat); m.castShadow = true; return m;
}
const BLACK = new THREE.MeshStandardMaterial({ color: 0x111018, roughness: 0.3 });
const WHITE = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.25 });

// ------------------------------------------------------------------ personaje "blob" con ojos grandes
function makeBuddy(color) {
  const g = new THREE.Group(), body = new THREE.Group(); g.add(body);
  const mat = new THREE.MeshPhysicalMaterial({ color, roughness: 0.35, clearcoat: 1, clearcoatRoughness: 0.15 });
  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.72, 0.8, 10, 32), mat); torso.position.y = 1.12; torso.castShadow = true; body.add(torso);
  const eyes = [], pupils = [], brows = [];
  [-1, 1].forEach(s => {
    const e = new THREE.Mesh(new THREE.SphereGeometry(0.21, 24, 16), WHITE); e.position.set(s * 0.27, 1.62, 0.6); e.scale.z = 0.6; body.add(e); eyes.push(e);
    const p = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 12), BLACK); p.position.set(s * 0.27, 1.62, 0.72); body.add(p); pupils.push(p);
    const br = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.05, 0.05), BLACK); br.position.set(s * 0.27, 1.92, 0.62); body.add(br); brows.push(br);
    const ch = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 10), new THREE.MeshStandardMaterial({ color: 0xff7aa8, roughness: 0.6, transparent: true, opacity: 0.8 }));
    ch.position.set(s * 0.47, 1.4, 0.55); ch.scale.set(1, 0.6, 0.3); body.add(ch);
  });
  const smile = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.035, 8, 24, Math.PI), BLACK); smile.rotation.z = Math.PI; smile.position.set(0, 1.4, 0.69); body.add(smile);
  const frown = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.035, 8, 24, Math.PI), BLACK); frown.position.set(0, 1.28, 0.69); body.add(frown);
  const oMouth = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 12), BLACK); oMouth.scale.set(1, 1.3, 0.5); oMouth.position.set(0, 1.32, 0.7); body.add(oMouth);
  const arms = [-1, 1].map(s => {
    const piv = new THREE.Group(); piv.position.set(s * 0.68, 1.25, 0); body.add(piv);
    const a = new THREE.Mesh(new THREE.CapsuleGeometry(0.11, 0.4, 6, 12), mat); a.position.set(s * 0.12, -0.28, 0); a.castShadow = true; piv.add(a);
    piv.rotation.z = s * 0.35; return piv;
  });
  const hand = new THREE.Group(); hand.position.set(0.18, -0.55, 0.1); arms[1].add(hand);
  const nose = new THREE.Group();
  { const tipN = new THREE.Mesh(new THREE.SphereGeometry(0.17, 24, 16), new THREE.MeshPhysicalMaterial({ color: new THREE.Color(color).multiplyScalar(0.8), roughness: 0.35, clearcoat: 1 }));
    tipN.scale.set(1.15, 0.9, 1.0); nose.add(tipN);
    [-1, 1].forEach(s2 => { const n = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 8), BLACK); n.position.set(s2 * 0.07, -0.08, 0.12); n.scale.set(1.2, 0.6, 0.6); nose.add(n); }); }
  nose.position.set(0, 1.48, 0.76); nose.visible = false; body.add(nose);
  g.userData = { body, eyes, pupils, brows, smile, frown, oMouth, arms, hand, mat, nose };
  return g;
}
// o: { hop, squash, mood: 'smile'|'frown'|'o', look:[x,y], eye, blink, armR, armL, brow, shake, rotY }
function setBuddy(b, o = {}) {
  const u = b.userData, sq = o.squash ?? 0;
  b.visible = true;
  u.body.position.set(o.shake ? Math.sin(o.shake * 60) * 0.04 : 0, o.hop ?? 0, 0);
  u.body.scale.set(1 + sq * 0.5, 1 - sq, 1 + sq * 0.5);
  b.rotation.y = o.rotY ?? 0;
  const look = o.look ?? [0, 0], eye = o.eye ?? 1, blink = o.blink ?? 1;
  u.eyes.forEach((e, i) => { e.scale.set(eye, eye * blink, 0.6 * eye); });
  u.pupils.forEach((p, i) => { p.position.x = (i ? 0.27 : -0.27) + look[0] * 0.08; p.position.y = 1.62 + look[1] * 0.08; p.scale.setScalar(eye > 1.2 ? 1.25 : 1); p.visible = blink > 0.3; });
  const m = o.mood ?? 'smile';
  u.smile.visible = m === 'smile'; u.frown.visible = m === 'frown'; u.oMouth.visible = m === 'o';
  u.oMouth.scale.set(1, 1.3, 0.5).multiplyScalar(m === 'o' ? (o.mouthOpen ?? 1) : 1);
  const br = o.brow ?? 0; u.brows.forEach((x, i) => { x.rotation.z = (i ? -1 : 1) * br * 0.5; x.position.y = 1.92 + Math.abs(br) * 0.04; });
  u.arms[0].rotation.z = -0.35 - (o.armL ?? 0); u.arms[1].rotation.z = 0.35 + (o.armR ?? 0);
}
const you = makeBuddy(0x4f8dff);      // "tú"
const pal = makeBuddy(0xff6fb0);      // "tu amigo/a"
scene.add(you, pal);
const youBottle = makeBottle(0xff9ad0); youBottle.scale.setScalar(0.22); youBottle.rotation.z = -0.3; you.userData.hand.add(youBottle);
const palBottle = makeBottle(0xff9ad0); palBottle.scale.setScalar(0.22); palBottle.rotation.z = -0.3; pal.userData.hand.add(palBottle);

// corazones
const heartShape = new THREE.Shape();
heartShape.moveTo(0, 0.25); heartShape.bezierCurveTo(0, 0.3, -0.05, 0.4, -0.2, 0.4); heartShape.bezierCurveTo(-0.45, 0.4, -0.45, 0.12, -0.45, 0.12);
heartShape.bezierCurveTo(-0.45, -0.05, -0.3, -0.2, 0, -0.4); heartShape.bezierCurveTo(0.3, -0.2, 0.45, -0.05, 0.45, 0.12);
heartShape.bezierCurveTo(0.45, 0.12, 0.45, 0.4, 0.2, 0.4); heartShape.bezierCurveTo(0.08, 0.4, 0, 0.3, 0, 0.25);
const heartGeo = new THREE.ExtrudeGeometry(heartShape, { depth: 0.12, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 3 }); heartGeo.center();
const heartMat = new THREE.MeshStandardMaterial({ color: 0xff2d6f, roughness: 0.3, emissive: 0xff2d6f, emissiveIntensity: 0.35 });
const hearts = Array.from({ length: 6 }, () => { const h = new THREE.Mesh(heartGeo, heartMat); scene.add(h); return h; });
// center: punto de origen; t0: arranque; dur: vida
function setHearts(t, center, t0, n = 6, spread = 1.0) {
  hearts.forEach((h, i) => {
    const a = t - t0 - i * 0.12;
    if (i >= n || a < 0 || a > 2.2) { h.visible = false; return; }
    h.visible = true;
    const s = 0.55 * spring(a / 0.4) * (1 - clamp((a - 1.7) / 0.5));
    h.scale.setScalar(Math.max(0.001, s));
    h.position.set(center.x + Math.sin(i * 2.1) * spread * (0.5 + a * 0.3), center.y + a * 0.9, center.z + 0.2 + Math.cos(i * 1.7) * 0.3);
    h.rotation.set(0, Math.sin(a * 3 + i) * 0.5, Math.sin(a * 2 + i) * 0.2);
  });
}
// nube verde de "mal olor"
const stink = new THREE.Group();
{ const r = rng(13); for (let i = 0; i < 11; i++) { const m = new THREE.Mesh(new THREE.SphereGeometry(0.35 + r() * 0.3, 20, 14), new THREE.MeshStandardMaterial({ color: i % 2 ? 0x9ad04a : 0x7bbf3a, roughness: 0.8, emissive: 0x3a6a10, emissiveIntensity: 0.4, transparent: true, opacity: 0.88 })); m.userData.p = V(r() * 2 - 1, r() * 1.2, r() * 1 - 0.5); m.userData.ph = r() * 6.28; stink.add(m); } }
scene.add(stink);
function setStink(t, center, t0, size = 1) {
  const a = t - t0; stink.visible = a > 0;
  if (!stink.visible) return;
  stink.position.copy(center);
  stink.children.forEach((m, i) => {
    const s = spring(clamp((a - i * 0.03) / 0.5)) * size * (1 + 0.08 * Math.sin(t * 4 + m.userData.ph));
    m.scale.setScalar(Math.max(0.001, s));
    m.position.copy(m.userData.p).multiplyScalar(size * (1 + 0.3 * clamp(a / 2)));
    m.position.y += 0.15 * Math.sin(t * 2 + m.userData.ph);
  });
}
// botella de jarabe para la tos
function labelTex(text, bg, fg) {
  const c = document.createElement('canvas'); c.width = 512; c.height = 256; const x = c.getContext('2d');
  x.fillStyle = bg; x.fillRect(0, 0, 512, 256); x.fillStyle = fg; x.font = '900 92px Inter, Arial, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(text, 256, 128);
  return new THREE.CanvasTexture(c);
}
const syrup = new THREE.Group();
{
  const prof = [[0, 0], [0.5, 0], [0.52, 0.05], [0.52, 1.2], [0.42, 1.45], [0.22, 1.6], [0.2, 1.8], [0, 1.8]].map(([r, y]) => new THREE.Vector2(r, y));
  const b = new THREE.Mesh(new THREE.LatheGeometry(prof, 48), new THREE.MeshPhysicalMaterial({ color: 0x6b2c0a, roughness: 0.15, clearcoat: 1, transmission: 0.25, thickness: 0.4 }));
  const lab = new THREE.Mesh(new THREE.CylinderGeometry(0.53, 0.53, 0.6, 48, 1, true), new THREE.MeshStandardMaterial({ map: labelTex('JARABE', '#ffffff', '#e0262e'), roughness: 0.6 }));
  lab.position.y = 0.65; lab.rotation.y = -Math.PI / 2;
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.3, 32), new THREE.MeshStandardMaterial({ color: 0xe8262e, roughness: 0.4 })); cap.position.y = 1.9;
  syrup.add(b, lab, cap); syrup.traverse(o => (o.castShadow = true));
}
scene.add(syrup);

// ------------------------------------------------------------------ "química": matraz burbujeante
const flask = new THREE.Group();
{
  const prof = [[0, 0], [0.75, 0], [0.8, 0.08], [0.3, 1.1], [0.22, 1.5], [0.26, 1.55], [0, 1.55]].map(([r, y]) => new THREE.Vector2(r, y));
  flask.add(new THREE.Mesh(new THREE.LatheGeometry(prof, 48), glassMat()));
  const liq = new THREE.Mesh(new THREE.LatheGeometry([[0, 0.04], [0.68, 0.04], [0.5, 0.55], [0, 0.55]].map(([r, y]) => new THREE.Vector2(r, y)), 48), new THREE.MeshStandardMaterial({ color: 0x3affc8, emissive: 0x1aa080, emissiveIntensity: 0.6, roughness: 0.2 }));
  flask.add(liq); flask.userData.liq = liq;
}
scene.add(flask);
const bubbles = Array.from({ length: 14 }, (_, i) => { const m = new THREE.Mesh(new THREE.SphereGeometry(0.07 + (i % 3) * 0.03, 12, 8), new THREE.MeshPhysicalMaterial({ color: 0xbffff0, transmission: 0.6, roughness: 0.05, emissive: 0x3affc8, emissiveIntensity: 0.3 })); scene.add(m); return m; });

// ------------------------------------------------------------------ sartenes ("tu piel es la cocina")
function makePan(skinColor) {
  const g = new THREE.Group();
  const base = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.1, 0.3, 64), new THREE.MeshStandardMaterial({ color: 0x24242c, metalness: 0.7, roughness: 0.35 })); base.position.y = 0.15; g.add(base);
  const rimP = new THREE.Mesh(new THREE.TorusGeometry(1.25, 0.06, 10, 96), new THREE.MeshStandardMaterial({ color: 0x3a3a46, metalness: 0.8, roughness: 0.3 })); rimP.rotation.x = Math.PI / 2; rimP.position.y = 0.3; g.add(rimP);
  const handle = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.12, 0.22), new THREE.MeshStandardMaterial({ color: 0x5a3a22, roughness: 0.6 })); handle.position.set(1.9, 0.28, 0); g.add(handle);
  const skinIn = new THREE.Mesh(new THREE.CylinderGeometry(1.14, 1.14, 0.04, 64), new THREE.MeshStandardMaterial({ color: skinColor, roughness: 0.55 })); skinIn.position.y = 0.3; g.add(skinIn);
  g.traverse(o => { o.castShadow = o.receiveShadow = true; });
  return g;
}
const pans = [makePan(0xf0c09c), makePan(0x9a5e3e)];
pans.forEach((p, i) => { p.position.copy(PANS).add(V(0, 0, 0)); p.position.y = i ? 0 : 2.6; p.rotation.y = i ? Math.PI : 0; scene.add(p); });
pans[0].position.set(PANS.x - 0.4, 2.7, PANS.z); pans[1].position.set(PANS.x + 0.4, 0, PANS.z + 0.6);
const drops = [0, 1].map(() => { const m = new THREE.Mesh(new THREE.SphereGeometry(0.16, 24, 16), new THREE.MeshPhysicalMaterial({ color: 0xff9ad0, transmission: 0.5, roughness: 0.05, emissive: 0xff6fb0, emissiveIntensity: 0.4 })); m.scale.y = 1.3; scene.add(m); return m; });
const puffs = [0, 1].map(k => { const g = new THREE.Group(); const col = k ? 0xffd23a : 0xff6fd8; for (let i = 0; i < 7; i++) { const m = new THREE.Mesh(new THREE.SphereGeometry(0.17, 16, 12), new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 0.5, roughness: 0.6, transparent: true, opacity: 0.85 })); g.add(m); } scene.add(g); return g; });
function setPuff(g, t, t0, center) {
  const a = t - t0; g.visible = a > 0; if (!g.visible) return;
  g.position.copy(center);
  g.children.forEach((m, i) => { const ang = i / 7 * 6.283 + a; const r = 0.3 + a * 0.5; m.position.set(Math.cos(ang) * r, 0.3 + a * 0.55 + (i % 3) * 0.15, Math.sin(ang) * r); m.scale.setScalar(Math.max(0.001, spring(a / 0.4) * (1 - clamp((a - 1.4) / 0.8)))); });
}

// ------------------------------------------------------------------ piel grasosa vs. seca
const duoSkins = [
  new THREE.Mesh(new THREE.CylinderGeometry(1.35, 1.45, 0.35, 80), new THREE.MeshPhysicalMaterial({ color: 0xe0a07c, roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.05 })),
  new THREE.Mesh(new THREE.CylinderGeometry(1.35, 1.45, 0.35, 80), new THREE.MeshStandardMaterial({ color: 0xe9c3a6, roughness: 0.98 })),
];
duoSkins.forEach((m, i) => { m.position.set(DUO.x + (i ? 1.6 : -1.6), 0.18, DUO.z); m.castShadow = m.receiveShadow = true; scene.add(m); });
const oilDrops = []; { const r = rng(17); for (let i = 0; i < 9; i++) { const d = new THREE.Mesh(new THREE.SphereGeometry(0.06 + r() * 0.06, 16, 10), new THREE.MeshPhysicalMaterial({ color: 0xfff2c8, transmission: 0.8, roughness: 0.02, thickness: 0.2 })); const a = r() * 6.28, rr = r() * 1.1; d.position.set(DUO.x - 1.6 + Math.cos(a) * rr, 0.37, DUO.z + Math.sin(a) * rr); d.scale.y = 0.5; scene.add(d); oilDrops.push(d); } }
const cracks = []; { const r = rng(19); for (let i = 0; i < 10; i++) { const c = new THREE.Mesh(new THREE.BoxGeometry(0.5 + r() * 0.5, 0.01, 0.025), new THREE.MeshStandardMaterial({ color: 0xa47a5c, roughness: 1 })); const a = r() * 6.28, rr = r() * 1.0; c.position.set(DUO.x + 1.6 + Math.cos(a) * rr, 0.36, DUO.z + Math.sin(a) * rr); c.rotation.y = r() * 3.14; scene.add(c); cracks.push(c); } }
// carita triste en la piel seca ("te deja plantado")
const dryFace = new THREE.Group();
{ [-1, 1].forEach(s => { const e = new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 10), BLACK); e.position.set(s * 0.35, 0, -0.2); e.scale.y = 0.5; dryFace.add(e); });
  const fr = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.04, 8, 24, Math.PI), BLACK); fr.rotation.x = -Math.PI / 2; fr.position.set(0, 0, 0.35); dryFace.add(fr);
  const tear = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 8), new THREE.MeshStandardMaterial({ color: 0x6fc8ff, emissive: 0x2a8aff, emissiveIntensity: 0.4 })); tear.position.set(0.38, 0.02, 0.0); tear.scale.set(1, 0.5, 1.4); dryFace.add(tear); }
dryFace.position.set(DUO.x + 1.6, 0.37, DUO.z); scene.add(dryFace);
const molB = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 2), new THREE.MeshStandardMaterial({ color: 0xff7eb6, roughness: 0.25, emissive: 0xff4f9a, emissiveIntensity: 0.25 }), 60);
molB.castShadow = true; molB.frustumCulled = false; scene.add(molB);
const molBSeed = []; { const r = rng(23); for (let i = 0; i < 60; i++) molBSeed.push([r() * 6.28, Math.sqrt(r()) * 1.15, r(), r() * 6.28]); }

// ------------------------------------------------------------------ gym y frío
const thermo = new THREE.Group();
{ const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 2.4, 24), glassMat()); tube.position.y = 1.5; thermo.add(tube);
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.28, 24, 16), new THREE.MeshStandardMaterial({ color: 0xff2a3a, emissive: 0xff2a3a, emissiveIntensity: 0.5 })); bulb.position.y = 0.3; thermo.add(bulb);
  const fill = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 1, 16), bulb.material); fill.geometry.translate(0, 0.5, 0); fill.position.y = 0.35; thermo.add(fill); thermo.userData.fill = fill; thermo.userData.bulb = bulb; }
scene.add(thermo);
const dumbbell = new THREE.Group();
{ const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.9, 12), new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.2 })); bar.rotation.z = Math.PI / 2; dumbbell.add(bar);
  [-1, 1].forEach(s => { const w = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.18, 24), new THREE.MeshStandardMaterial({ color: 0x222228, metalness: 0.5, roughness: 0.4 })); w.rotation.z = Math.PI / 2; w.position.x = s * 0.4; dumbbell.add(w); }); }
const headband = new THREE.Mesh(new THREE.TorusGeometry(0.66, 0.07, 10, 48), new THREE.MeshStandardMaterial({ color: 0xff3a3a, roughness: 0.6 })); headband.rotation.x = Math.PI / 2; headband.position.y = 1.88;
const scarf = new THREE.Group();
{ const ring = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.13, 12, 48), new THREE.MeshStandardMaterial({ color: 0xff4f6a, roughness: 0.8 })); ring.rotation.x = Math.PI / 2; ring.position.y = 1.15; scarf.add(ring);
  const tail = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.55, 0.1), ring.material); tail.position.set(0.3, 0.85, 0.62); tail.rotation.z = 0.15; scarf.add(tail);
  const hat = new THREE.Mesh(new THREE.SphereGeometry(0.62, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0x3ad0ff, roughness: 0.8 })); hat.position.y = 1.95; scarf.add(hat);
  const pom = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 12), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 })); pom.position.y = 2.6; scarf.add(pom); }
const sweat = Array.from({ length: 6 }, () => { const m = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 8), new THREE.MeshStandardMaterial({ color: 0x7fd4ff, emissive: 0x2a8aff, emissiveIntensity: 0.4 })); m.scale.y = 1.4; scene.add(m); return m; });
// ondas de aroma (anillos que se expanden)
const waves = Array.from({ length: 6 }, () => { const m = new THREE.Mesh(new THREE.TorusGeometry(1, 0.045, 8, 96), new THREE.MeshBasicMaterial({ color: 0xff6fd8, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })); scene.add(m); return m; });
function setWaves(t, center, speed, maxR, color, strength) {
  waves.forEach((m, i) => {
    const ph = ((t * speed + i / waves.length) % 1);
    m.visible = strength > 0.01; m.position.copy(center); m.rotation.set(Math.PI / 2 + 0.25 * Math.sin(i), 0, 0);
    m.scale.setScalar(0.6 + ph * maxR); m.material.color.set(color); m.material.opacity = strength * (1 - ph);
  });
}
const SNOWN = 260, snowGeo = new THREE.BufferGeometry();
snowGeo.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(SNOWN * 3), 3));
const snowPts = new THREE.Points(snowGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.1, map: DOT, transparent: true, depthWrite: false }));
snowPts.frustumCulled = false; scene.add(snowPts);
const snowSeed = []; { const r = rng(41); for (let i = 0; i < SNOWN; i++) snowSeed.push([r() * 10 - 5, r() * 7, r() * 8 - 5, r() * 6.28]); }

// ------------------------------------------------------------------ bacterias simpáticas
const bacSurf = new THREE.Mesh((() => { const g = new THREE.PlaneGeometry(14, 14, 90, 90); const p = g.attributes.position; for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i); p.setZ(i, 0.12 * Math.sin(x * 2.1) * Math.cos(y * 1.7) + 0.06 * Math.sin(x * 5 + y * 3)); } g.computeVertexNormals(); return g; })(),
  new THREE.MeshStandardMaterial({ color: 0xe8a58a, roughness: 0.7 }));
bacSurf.rotation.x = -Math.PI / 2; bacSurf.position.set(BAC.x, 0.2, BAC.z); bacSurf.receiveShadow = true; scene.add(bacSurf);
const bugs = [];
{ const cols = [0x3ad0a0, 0x9ad04a, 0xb06bff, 0x3aa0ff, 0xffb03a, 0x3ad0a0, 0xb06bff];
  cols.forEach((c, i) => {
    const g = new THREE.Group();
    const bod = new THREE.Mesh(new THREE.CapsuleGeometry(0.28, 0.5, 8, 20), new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.3, clearcoat: 1, transmission: 0.15 }));
    bod.rotation.z = Math.PI / 2; g.add(bod);
    [-1, 1].forEach(s => { const e = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 8), WHITE); e.position.set(0.25 + s * 0.0, 0.12, s * 0.14); g.add(e); const p = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 8), BLACK); p.position.set(0.32, 0.12, s * 0.14); g.add(p); });
    for (let k = 0; k < 6; k++) { const cil = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.18, 6), bod.material); cil.position.set(-0.3 + k * 0.12, -0.3, 0); g.add(cil); }
    g.traverse(o => (o.castShadow = true));
    scene.add(g); bugs.push(g);
  }); }

// ------------------------------------------------------------------ la gran nariz
const noseSet = new THREE.Group(); noseSet.position.copy(NOSE); scene.add(noseSet);
{ const skinM = new THREE.MeshPhysicalMaterial({ color: 0xf0b08c, roughness: 0.45, clearcoat: 0.6 });
  const bridge = new THREE.Mesh(new THREE.CapsuleGeometry(0.55, 1.6, 12, 32), skinM); bridge.position.set(0, 3.1, 0); bridge.rotation.x = 0.35; noseSet.add(bridge);
  const tip = new THREE.Mesh(new THREE.SphereGeometry(0.85, 40, 28), skinM); tip.position.set(0, 2.1, 0.55); noseSet.add(tip);
  [-1, 1].forEach(s => { const w = new THREE.Mesh(new THREE.SphereGeometry(0.55, 32, 20), skinM); w.position.set(s * 0.75, 1.85, 0.25); noseSet.add(w);
    const n = new THREE.Mesh(new THREE.SphereGeometry(0.22, 24, 16), new THREE.MeshStandardMaterial({ color: 0x3a1410, roughness: 0.9 })); n.position.set(s * 0.42, 1.55, 0.75); n.scale.set(1.2, 0.6, 0.8); noseSet.add(n); });
  noseSet.traverse(o => (o.castShadow = true)); }
const scentShapes = [
  new THREE.Mesh(new THREE.SphereGeometry(0.22, 24, 16), new THREE.MeshStandardMaterial({ color: 0xfff04a, emissive: 0xffd000, emissiveIntensity: 0.4, roughness: 0.3 })),
  new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.34, 0.34), new THREE.MeshStandardMaterial({ color: 0xff6fb0, emissive: 0xff3d8b, emissiveIntensity: 0.4, roughness: 0.3 })),
  new THREE.Mesh(new THREE.OctahedronGeometry(0.3, 0), new THREE.MeshStandardMaterial({ color: 0xb06bff, emissive: 0x7a3aff, emissiveIntensity: 0.5, roughness: 0.3 })),
];
scentShapes.forEach(m => { m.castShadow = true; scene.add(m); });
const qMark = text3d('?', 0.9, new THREE.MeshStandardMaterial({ color: 0xffd27a, metalness: 0.8, roughness: 0.25, emissive: 0xffa53a, emissiveIntensity: 0.4 }));
scene.add(qMark);

// ------------------------------------------------------------------ medidor "cuánto te hueles"
const meter = new THREE.Group();
{ const frameM = new THREE.Mesh(new RoundedBoxGeometry(0.5, 2.6, 0.5, 4, 0.08), glassMat()); frameM.position.y = 1.3; meter.add(frameM);
  const fill = new THREE.Mesh(new THREE.BoxGeometry(0.36, 1, 0.36), new THREE.MeshStandardMaterial({ color: 0x5aff8a, emissive: 0x2acf5a, emissiveIntensity: 0.5 })); fill.geometry.translate(0, 0.5, 0); fill.position.y = 0.08; meter.add(fill); meter.userData.fill = fill;
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.22, 20, 14), new THREE.MeshStandardMaterial({ color: 0xf0b08c, roughness: 0.5 })); nose.position.y = 2.85; meter.add(nose); }
scene.add(meter);
const zzz = text3d('z z z', 0.32, new THREE.MeshStandardMaterial({ color: 0xbfd8ff, emissive: 0x6fa0ff, emissiveIntensity: 0.5 }), 0.06); scene.add(zzz);

// ------------------------------------------------------------------ palomita final del consejo
const checkShape = new THREE.Shape(); checkShape.moveTo(-0.6, 0.05); checkShape.lineTo(-0.2, -0.35); checkShape.lineTo(0.65, 0.5); checkShape.lineTo(0.5, 0.65); checkShape.lineTo(-0.2, -0.05); checkShape.lineTo(-0.45, 0.2); checkShape.lineTo(-0.6, 0.05);
const check = new THREE.Mesh(new THREE.ExtrudeGeometry(checkShape, { depth: 0.18, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 3 }), new THREE.MeshStandardMaterial({ color: 0x3aff7a, emissive: 0x1acf4a, emissiveIntensity: 0.5, roughness: 0.3 }));
check.geometry.center(); check.castShadow = true; scene.add(check);

// ================================================================== MAR, CACHALOTE Y ÁMBAR GRIS
const OCEAN = V(0, 0, 300), STOM = V(-130, 0, 300), BEACH = V(130, 0, 300), DUO2 = V(0, 0, 210), ZOOM = V(-130, 0, 0);
let EXPO = 1.1;
const WL = 0.5;   // nivel del agua
const waveH = (x, z, T) => 0.2 * Math.sin(0.55 * x + 1.3 * T) + 0.13 * Math.sin(0.8 * z - 1.1 * T + 0.3 * x) + 0.06 * Math.sin(1.7 * x + 1.9 * z + 2 * T);

// ------------------------------------------------------------------ agua (se mueve con la cámara; olas en coordenadas del mundo)
const waterGeo = new THREE.PlaneGeometry(90, 90, 110, 110); waterGeo.rotateX(-Math.PI / 2);
const water = new THREE.Mesh(waterGeo, new THREE.MeshPhysicalMaterial({ color: 0x1b7fb8, roughness: 0.1, metalness: 0.05, clearcoat: 1, clearcoatRoughness: 0.08 }));
water.receiveShadow = true; scene.add(water);
const waterBase = Float32Array.from(waterGeo.attributes.position.array);
function setWater(cx, cz, T, y0 = WL) {
  water.visible = true; water.position.set(Math.round(cx), 0, Math.round(cz));
  const P = waterGeo.attributes.position;
  for (let i = 0; i < P.count; i++) { const x = waterBase[i * 3] + water.position.x, z = waterBase[i * 3 + 2] + water.position.z; P.setY(i, y0 + waveH(x, z, T)); }
  P.needsUpdate = true; waterGeo.computeVertexNormals();
}
const sunBall = new THREE.Mesh(new THREE.SphereGeometry(30, 32, 16), new THREE.MeshBasicMaterial({ color: 0xfff1b0, fog: false }));
scene.add(sunBall);

// ------------------------------------------------------------------ cachalote (personaje propio, mira hacia +x)
const whale = new THREE.Group();
{ const skinW = new THREE.MeshPhysicalMaterial({ color: 0x51648c, roughness: 0.45, clearcoat: 0.6, clearcoatRoughness: 0.3 });
  const light = new THREE.MeshStandardMaterial({ color: 0xdfe3ee, roughness: 0.5 });
  const head = new THREE.Mesh(new RoundedBoxGeometry(3.2, 2.3, 2.1, 6, 0.75), skinW); head.position.set(1.5, 0.1, 0); whale.add(head);
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(1.0, 2.6, 10, 28), skinW); body.rotation.z = Math.PI / 2; body.position.set(-1.1, -0.1, 0); body.scale.set(1.05, 1, 0.95); whale.add(body);
  const jaw = new THREE.Group(); jaw.position.set(0.5, -0.95, 0); whale.add(jaw);
  const jawM = new THREE.Mesh(new RoundedBoxGeometry(2.5, 0.32, 0.9, 4, 0.14), light); jawM.position.set(1.15, 0, 0); jaw.add(jawM);
  for (let i = 0; i < 6; i++) { const tooth = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.18, 8), WHITE); tooth.position.set(0.5 + i * 0.32, 0.22, 0); jaw.add(tooth); }
  const tail = new THREE.Group(); tail.position.set(-2.6, -0.1, 0); whale.add(tail);
  const tc = new THREE.Mesh(new THREE.ConeGeometry(0.85, 2.4, 24), skinW); tc.rotation.z = Math.PI / 2; tc.position.x = -1.1; tail.add(tc);
  [-1, 1].forEach(s => { const f = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 12), skinW); f.scale.set(0.55, 0.1, 0.95); f.position.set(-2.35, 0, s * 0.75); f.rotation.y = s * 0.45; tail.add(f); });
  [-1, 1].forEach(s => { const f = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 10), skinW); f.scale.set(0.6, 0.1, 0.32); f.position.set(0.0, -0.75, s * 0.95); f.rotation.x = s * 0.5; whale.add(f); });
  const eyes = [], pupils = [], cheeks = [];
  [-1, 1].forEach(s => { const e = new THREE.Mesh(new THREE.SphereGeometry(0.24, 20, 14), WHITE); e.position.set(1.7, 0.15, s * 1.0); e.scale.z = 0.5; whale.add(e); eyes.push(e);
    const p = new THREE.Mesh(new THREE.SphereGeometry(0.12, 14, 10), BLACK); p.position.set(1.78, 0.15, s * 1.1); whale.add(p); pupils.push(p);
    const c = new THREE.Mesh(new THREE.SphereGeometry(0.16, 14, 10), new THREE.MeshStandardMaterial({ color: 0xff7aa8, transparent: true, opacity: 0, roughness: 0.6 })); c.position.set(2.1, -0.25, s * 1.02); c.scale.set(1, 0.6, 0.3); whale.add(c); cheeks.push(c); });
  const smileW = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.05, 8, 24, Math.PI * 0.8), BLACK); smileW.rotation.set(0, Math.PI / 2, Math.PI * 1.1); smileW.position.set(2.6, -0.55, 0.9); whale.add(smileW);
  whale.traverse(o => { if (o.isMesh) o.castShadow = true; });
  whale.userData = { jaw, tail, eyes, pupils, cheeks }; }
scene.add(whale);
// o: { swim (fase), jaw 0..1, blush 0..1, look [x,y], eye }
function setWhale(pos, T, o = {}) {
  const u = whale.userData; whale.visible = true; whale.position.copy(pos);
  whale.rotation.set(o.rotX ?? 0, o.rotY ?? 0, (o.pitch ?? 0) + 0.04 * Math.sin(T * 1.4));
  u.tail.rotation.z = 0.28 * Math.sin(T * (o.swim ?? 2.4));
  u.jaw.rotation.z = -(o.jaw ?? 0) * 0.5;
  u.cheeks.forEach(c => (c.material.opacity = 0.85 * (o.blush ?? 0)));
  const lk = o.look ?? [0, 0], eye = o.eye ?? 1;
  u.eyes.forEach(e => e.scale.set(eye, eye, 0.5 * eye));
  u.pupils.forEach((p, i) => { p.position.x = 1.78 + lk[0] * 0.08; p.position.y = 0.15 + lk[1] * 0.08; p.scale.setScalar(o.dead ? 0.3 : 1); });
}

// ------------------------------------------------------------------ calamares
function makeSquid() {
  const g = new THREE.Group(); const m = new THREE.MeshPhysicalMaterial({ color: 0xff8f80, roughness: 0.35, clearcoat: 0.8 });
  const mantle = new THREE.Mesh(new THREE.ConeGeometry(0.32, 1.1, 20), m); mantle.position.y = 0.75; g.add(mantle);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.3, 20, 14), m); head.position.y = 0.12; g.add(head);
  [-1, 1].forEach(s => { const e = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 8), WHITE); e.position.set(s * 0.15, 0.18, 0.24); g.add(e); const p = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 8), BLACK); p.position.set(s * 0.15, 0.18, 0.32); g.add(p); });
  const tents = []; for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; const t = new THREE.Mesh(new THREE.CapsuleGeometry(0.04, 0.5, 4, 8), m); t.position.set(Math.cos(a) * 0.15, -0.3, Math.sin(a) * 0.15); g.add(t); tents.push([t, a]); }
  g.traverse(o => { if (o.isMesh) o.castShadow = true; }); g.userData.tents = tents; return g;
}
const squids = Array.from({ length: 5 }, () => { const s = makeSquid(); scene.add(s); return s; });
function wiggle(s, T, k) { s.userData.tents.forEach(([t, a]) => { t.rotation.set(Math.cos(a) * 0.4 * Math.sin(T * 8 + k), 0, Math.sin(a) * 0.4 * Math.sin(T * 8 + k)); }); }

// ------------------------------------------------------------------ bola de ámbar gris (cerosa y llena de bultos)
const lumpGeo = new THREE.SphereGeometry(1, 72, 54);
{ const p = lumpGeo.attributes.position; for (let i = 0; i < p.count; i++) { const v = V(p.getX(i), p.getY(i), p.getZ(i)).normalize();
    const n = 1 + 0.12 * Math.sin(v.x * 5 + v.y * 3) + 0.09 * Math.sin(v.y * 7 - v.z * 4) + 0.06 * Math.sin(v.z * 11 + v.x * 6) + 0.04 * Math.sin(v.x * 17 + v.z * 13);
    v.multiplyScalar(n); v.y *= 0.82; p.setXYZ(i, v.x, v.y, v.z); } lumpGeo.computeVertexNormals(); }
const LUMP_DARK = new THREE.Color(0x3b2b20), LUMP_LIGHT = new THREE.Color(0xd2cab4);
const lumpMat = new THREE.MeshStandardMaterial({ color: 0x3b2b20, roughness: 0.85, metalness: 0 });
const lumps = Array.from({ length: 2 }, () => { const m = new THREE.Mesh(lumpGeo, lumpMat); m.castShadow = m.receiveShadow = true; scene.add(m); return m; });
function cure(k) { lumpMat.color.copy(LUMP_DARK).lerp(LUMP_LIGHT, clamp(k)); }

// ------------------------------------------------------------------ intestino por dentro, con picos de calamar
const gut = new THREE.Group();
{ const wall = new THREE.Mesh(new THREE.SphereGeometry(9, 48, 32), new THREE.MeshStandardMaterial({ color: 0xc8506e, roughness: 0.6, side: THREE.BackSide, emissive: 0x5a1020, emissiveIntensity: 0.3 })); gut.add(wall);
  for (let i = 0; i < 7; i++) { const r = new THREE.Mesh(new THREE.TorusGeometry(7.6 - Math.abs(i - 3) * 0.6, 0.45, 16, 64), new THREE.MeshStandardMaterial({ color: 0xd8607e, roughness: 0.5 })); r.rotation.y = Math.PI / 2; r.position.x = (i - 3) * 2.2; gut.add(r); } }
gut.position.copy(STOM).add(V(0, 3, 0)); scene.add(gut);
const gutLight = new THREE.PointLight(0xff9ab0, 0, 18, 1.2); scene.add(gutLight);
const beaks = []; { const r = rng(301); for (let i = 0; i < 9; i++) { const b = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.5, 10), new THREE.MeshPhysicalMaterial({ color: 0x1a1210, roughness: 0.2, clearcoat: 1 }));
    b.userData.p = V(r() * 2.2 - 1.1, r() * 1.6 - 0.8, r() * 2.2 - 1.1); b.userData.r = [r() * 6, r() * 6]; b.castShadow = true; scene.add(b); beaks.push(b); } }

// ------------------------------------------------------------------ bote, sombrero y playa
const boat = new THREE.Group();
{ const hull = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 3.0, 24, 1, false, 0, Math.PI), new THREE.MeshStandardMaterial({ color: 0xc8643a, roughness: 0.6, side: THREE.DoubleSide }));
  hull.rotation.set(0, 0, Math.PI / 2); hull.rotation.x = Math.PI; hull.rotation.z = Math.PI / 2; hull.scale.set(1, 1, 0.75); hull.position.y = 0.45; boat.add(hull);
  const rimB = new THREE.Mesh(new THREE.BoxGeometry(3.05, 0.1, 1.4), new THREE.MeshStandardMaterial({ color: 0xf6f0e0, roughness: 0.6 })); rimB.position.y = 0.48; boat.add(rimB);
  boat.traverse(o => { if (o.isMesh) o.castShadow = true; }); }
scene.add(boat);
function makeHat() { const g = new THREE.Group(); const m = new THREE.MeshStandardMaterial({ color: 0xf0d27a, roughness: 0.8 });
  const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.95, 0.05, 32), m); g.add(brim); const top = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.5, 0.42, 24), m); top.position.y = 0.22; g.add(top);
  const band = new THREE.Mesh(new THREE.CylinderGeometry(0.51, 0.51, 0.1, 24), new THREE.MeshStandardMaterial({ color: 0xe8402a })); band.position.y = 0.06; g.add(band); g.position.y = 1.95; return g; }
const hatYou = makeHat(), hatPal = makeHat();
const beach = new THREE.Group();
{ const sand = new THREE.Mesh(new THREE.BoxGeometry(40, 0.4, 30), new THREE.MeshStandardMaterial({ color: 0xf0d8a0, roughness: 0.95 })); sand.position.set(0, 0.2, 4); sand.receiveShadow = true; beach.add(sand);
  const sea = new THREE.Mesh(new THREE.BoxGeometry(80, 0.3, 40), new THREE.MeshPhysicalMaterial({ color: 0x2a9ad0, roughness: 0.1, clearcoat: 1 })); sea.position.set(0, 0.18, -30); beach.add(sea);
  const foam = new THREE.Mesh(new THREE.BoxGeometry(40, 0.42, 0.5), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 })); foam.position.set(0, 0.2, -10.8); beach.add(foam);
  [[-4.5, -6, 0.2], [5, -7, -0.25]].forEach(([x, z, lean]) => { const palm = new THREE.Group();
    for (let i = 0; i < 8; i++) { const seg = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.25, 0.65, 12), new THREE.MeshStandardMaterial({ color: 0x9a6a3a, roughness: 0.9 })); seg.position.set(i * lean * 0.3, 0.4 + i * 0.6, 0); palm.add(seg); }
    for (let i = 0; i < 7; i++) { const a = i / 7 * Math.PI * 2; const lf = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 8), new THREE.MeshStandardMaterial({ color: 0x3aa04a, roughness: 0.6 })); lf.scale.set(1.6, 0.08, 0.4); lf.position.set(8 * lean * 0.3 + Math.cos(a) * 1.3, 5.0 - 0.3, Math.sin(a) * 1.3); lf.rotation.y = -a; lf.rotation.z = -0.35; palm.add(lf); }
    palm.position.set(x, 0.4, z); palm.traverse(o => { if (o.isMesh) o.castShadow = true; }); beach.add(palm); }); }
beach.position.copy(BEACH); scene.add(beach);

// ------------------------------------------------------------------ báscula con pantalla
const scaleCv = document.createElement('canvas'); scaleCv.width = 512; scaleCv.height = 200;
const scaleTex = new THREE.CanvasTexture(scaleCv);
function scaleText(txt) { const x = scaleCv.getContext('2d'); x.fillStyle = '#0c1a12'; x.fillRect(0, 0, 512, 200); x.fillStyle = '#5aff8a'; x.font = '800 120px Inter, Arial, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(txt, 256, 104); scaleTex.needsUpdate = true; }
const scaleG = new THREE.Group();
{ const metal = new THREE.MeshStandardMaterial({ color: 0xb8c0c8, metalness: 0.8, roughness: 0.25 });
  const plat = new THREE.Mesh(new RoundedBoxGeometry(3.4, 0.3, 3.0, 4, 0.08), metal); plat.position.y = 0.15; scaleG.add(plat);
  const post = new THREE.Mesh(new THREE.BoxGeometry(0.25, 2.2, 0.25), metal); post.position.set(0, 1.3, -1.35); scaleG.add(post);
  const disp = new THREE.Mesh(new RoundedBoxGeometry(2.2, 0.95, 0.3, 4, 0.08), new THREE.MeshStandardMaterial({ color: 0x2a3038, roughness: 0.4 })); disp.position.set(0, 2.7, -1.35); scaleG.add(disp);
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(1.95, 0.76), new THREE.MeshBasicMaterial({ map: scaleTex })); scr.position.set(0, 2.7, -1.19); scaleG.add(scr);
  scaleG.traverse(o => { if (o.isMesh) o.castShadow = true; }); }
scene.add(scaleG);

// ------------------------------------------------------------------ monedas y fajos
const coinGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.07, 28);
const coinMat = new THREE.MeshStandardMaterial({ color: 0xffc83a, metalness: 1, roughness: 0.22, emissive: 0x6a4a00, emissiveIntensity: 0.3 });
const coins = new THREE.InstancedMesh(coinGeo, coinMat, 60); coins.frustumCulled = false; coins.castShadow = true; scene.add(coins);
const coinSeed = []; { const r = rng(404); for (let i = 0; i < 60; i++) coinSeed.push([r() * 7 - 3.5, r() * 4 - 2, r() * 0.9, r() * 6.28, r() * 6.28]); }
function setCoins(c, t, t0) { let n = 0;
  for (const [x, z, dl, a, b] of coinSeed) { const tt = t - t0 - dl; if (tt < 0) continue;
    const y = Math.max(0.45, 9 - 14 * tt * tt);
    _m.compose(V(c.x + x, c.y + y, c.z + z), _q.setFromEuler(new THREE.Euler(a + tt * 9 * (y > 0.45 ? 1 : 0), b, 0)), V(1, 1, 1)); coins.setMatrixAt(n++, _m); }
  coins.count = n; coins.visible = n > 0; coins.instanceMatrix.needsUpdate = true; }
const bills = new THREE.Group();
{ const bm = new THREE.MeshStandardMaterial({ color: 0x4fb06a, roughness: 0.7 }), band = new THREE.MeshStandardMaterial({ color: 0xf6f0d0 });
  for (let i = 0; i < 6; i++) { const st = new THREE.Group(); const b = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.45, 0.6), bm); st.add(b); const bd = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.47, 0.62), band); st.add(bd);
    st.position.set((i % 3 - 1) * 1.35, 0.25 + Math.floor(i / 3) * 0.47, 0); st.rotation.y = (i % 2 ? 0.08 : -0.06); bills.add(st); }
  bills.traverse(o => { if (o.isMesh) o.castShadow = true; }); }
scene.add(bills);

// ------------------------------------------------------------------ ambroxan (molécula de anillos) y señal de prohibido
const ambrox = new THREE.Group();
{ const gold = new THREE.MeshStandardMaterial({ color: 0xffc85a, metalness: 0.6, roughness: 0.25, emissive: 0xa86a10, emissiveIntensity: 0.4 });
  const pts = [], r = 0.8, dx = Math.sqrt(3) * r;
  [[-dx, 0], [0, 0], [dx * 0.5, r * 1.5]].forEach(([cx, cy]) => { for (let k = 0; k < 6; k++) { const a = Math.PI / 6 + k * Math.PI / 3; const p = V(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 0); if (!pts.some(q => q.distanceTo(p) < 0.1)) pts.push(p); } });
  const oxy = V(dx * 0.5 + r * 1.6, r * 2.4, 0); pts.push(oxy);
  pts.forEach((p, i) => { const a = new THREE.Mesh(new THREE.SphereGeometry(i === pts.length - 1 ? 0.26 : 0.2, 20, 14), i === pts.length - 1 ? new THREE.MeshStandardMaterial({ color: 0xff4a4a, emissive: 0xaa1010, emissiveIntensity: 0.4, roughness: 0.3 }) : gold); a.position.copy(p); ambrox.add(a); });
  for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) { const d = pts[i].distanceTo(pts[j]); if (d < r * 1.05 || (j === pts.length - 1 && d < r * 1.3)) {
    const st = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, d, 10), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 })); st.position.copy(pts[i]).lerp(pts[j], 0.5);
    st.quaternion.setFromUnitVectors(V(0, 1, 0), pts[j].clone().sub(pts[i]).normalize()); ambrox.add(st); } }
  const box = new THREE.Box3().setFromObject(ambrox), ctr = box.getCenter(V(0, 0, 0)); ambrox.children.forEach(c => c.position.sub(ctr));
  ambrox.traverse(o => { if (o.isMesh) o.castShadow = true; }); }
scene.add(ambrox);
const noSign = new THREE.Group();
{ const m = new THREE.MeshStandardMaterial({ color: 0xff2a3a, emissive: 0xe8102a, emissiveIntensity: 0.6, roughness: 0.3 });
  noSign.add(new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.2, 16, 64), m));
  const bar = new THREE.Mesh(new RoundedBoxGeometry(2.9, 0.38, 0.3, 4, 0.1), m); bar.rotation.z = -Math.PI / 4; noSign.add(bar); }
scene.add(noSign);

// ================================================================== estado por escena
const PALA = {
  ocean: [0x3aa6e8, 0x9fd8f0, 0xffffff], sunset: [0xff8a5a, 0xffd2a0, 0xffe0b0], gut: [0x7a1d3a, 0x2a0812, 0xff8fb0],
  gold: [0x6a4a12, 0x1c1206, 0xffd27a], beach: [0x5ab8f0, 0xbfe6f6, 0xffffff], perfume: [0x7a3d12, 0x241108, 0xffb060],
  lab: [0x1f5a6b, 0x071a20, 0xfff0a0], no: [0x7a1020, 0x24060a, 0xff4a5a], final: [0x7a1d63, 0x1c0a26, 0xff6fb0],
};
const SETS = [hero, pedestal, pyr, skin, skinRing, clock, fabric, blotter, blotBottle, ...rowBottles, ...rowBottles.map(b => b.userData.label),
  you, pal, ...hearts, stink, syrup, flask, ...bubbles, ...pans, ...drops, ...puffs, ...duoSkins, ...oilDrops, ...cracks, dryFace, molB,
  thermo, dumbbell, headband, scarf, ...sweat, ...waves, snowPts, bacSurf, ...bugs, noseSet, ...scentShapes, qMark, meter, zzz, check,
  water, sunBall, whale, ...squids, ...lumps, gut, ...beaks, boat, beach, scaleG, coins, bills, ambrox, noSign];
function resetWorld() {
  SETS.forEach(o => (o.visible = false));
  Object.values(ingMeshes).flat().forEach(m => (m.visible = false));
  mol.count = 0; molB.count = 0; coins.count = 0;
  hideMist();
  glow.intensity = 0; spot.intensity = 0; gutLight.intensity = 0;
  sparks.visible = floorRing.visible = floorRing2.visible = false;
  youBottle.visible = palBottle.visible = false; you.userData.nose.visible = false;
  you.userData.body.remove(hatYou); pal.userData.body.remove(hatPal);
  you.scale.setScalar(1); pal.scale.setScalar(1); whale.scale.setScalar(1);
  lumps.forEach(l => { l.scale.setScalar(1); l.rotation.set(0, 0, 0); }); cure(1);
  hero.scale.setScalar(1); hero.rotation.set(0, 0, 0);
  EXPO = 1.1; ground.visible = grid.visible = true;
  scene.fog.near = 22; scene.fog.far = 70; dust.visible = true; stars.visible = true;
}
function lightAt(c) { key.position.copy(c).add(V(-5, 10, 7)); key.target.position.copy(c); rim.position.copy(c).add(V(6, 4, -8)); rim.target.position.copy(c); }
const blinkAt = (T, seed) => { const ph = (T * 0.35 + seed) % 1; return ph < 0.04 ? 0.1 : 1; };
const hopF = (T, f = 3, a = 0.08) => Math.abs(Math.sin(T * f)) * a;
const shot = (pos, tgt, fov = 40, pal) => ({ pos, tgt, fov, pal });
// mar abierto alrededor de "c"
function sea(c, T, sun = 1) { lightAt(c); setWater(c.x, c.z, T); ground.visible = grid.visible = false; stars.visible = false; dust.visible = false;
  scene.fog.near = 25; scene.fog.far = 80; EXPO = 1.0; sunBall.visible = sun > 0; }
const waterAt = (x, z, T) => WL + waveH(x, z, T);
function splash(t, p, t0) { setMist(t, p.clone().add(V(0, 0.1, 0)), V(0, 1, 0), t0, [0.85, 0.95, 1]); }

const WY = -0.9, WDIR = V(Math.cos(WY), 0, -Math.sin(WY));   // la ballena en diagonal, de frente a la cámara
const wcenter = p => p.clone().addScaledVector(WDIR, 0.8);     // centro visual (la cabeza queda más cerca de la cámara)
function mouthOf() { whale.updateMatrixWorld(); return whale.localToWorld(V(3.0, -0.7, 0)); }
const SCENES = {
  gancho(t, d, cue, T) {
    const tb = cue.ballena ?? d * 0.5, tn = cue.bonita ?? d * 0.85;
    sea(OCEAN, T);
    sunBall.position.copy(OCEAN).add(V(-200, 160, -500));
    if (t < tn - 0.15) {             // el cachalote salta fuera del agua
      // dos saltos: uno al arrancar y el grande en "ballena"
      const j1 = prog(t, 0.0, 1.6), j2 = prog(t, tb - 0.9, tb + 1.0);
      const j = j2 > 0 ? j2 : j1, arc = Math.sin(j * Math.PI) * (j2 > 0 ? 1 : 0.7);
      const under = j <= 0 || j >= 1;
      const pos = OCEAN.clone().addScaledVector(WDIR, lerp(-3.0, 3.0, j)).add(V(0, -1.6 + 5.4 * arc, 0));
      const wpos = under ? OCEAN.clone().add(V(0, 0.1, 0)) : pos;
      setWhale(wpos, T, { rotY: WY, pitch: under ? 0 : lerp(0.8, -0.8, j), jaw: 0.3 * arc, eye: 1.25 });
      splash(t, OCEAN.clone().addScaledVector(WDIR, -2.4).add(V(0, WL, 0)), j2 > 0 ? tb - 0.85 : 0.05);
      glow.position.copy(OCEAN).add(V(0, 4, 4)); glow.color.set(0xffffff); glow.intensity = 3;
      const p = easeIO(prog(t, 0, tn));
      const tg = wcenter(wpos); tg.y = 1.6 + 0.8 * Math.max(0, wpos.y);
      return shot(tg.clone().add(V(0.6, 0.9, 17.5 - 1.5 * p)), tg, 40, 'ocean');
    }
    // "no de la parte bonita": la cámara va a la cola y la ballena voltea apenada
    // la ballena, apenada, mira hacia su cola; la cámara se desliza un poco hacia allá
    const wp = OCEAN.clone().add(V(0, 0.5, 0));
    setWhale(wp, T, { rotY: WY, look: [-1, 0.3], blush: easeOut(prog(t, tn - 0.2, tn + 0.3)), eye: 1.35, swim: 1.0 });
    whale.updateMatrixWorld(); const tailP = whale.localToWorld(V(-4.6, 0.4, 0));
    qMark.visible = true; qMark.scale.setScalar(Math.max(0.001, spring(prog(t, tn, tn + 0.5)) * 0.8)); qMark.position.copy(tailP).add(V(0, 1.8, 0)); qMark.rotation.y = 0.3 * Math.sin(T * 2);
    const k = easeIO(prog(t, tn - 0.6, tn + 0.4));
    const tg = lerpV(wcenter(wp), wp.clone().addScaledVector(WDIR, -0.4), k); tg.y = 1.7;
    return shot(tg.clone().add(V(0.6, 2.6, 15.0)), tg, 40, 'ocean');
  },
  nombre(t, d, cue, T) {
    const tc = cue.cacha ?? d * 0.7;
    if (t < tc - 0.15) {             // la bola de ámbar gris en un pedestal, como joya
      lightAt(DUO2); pedestal.visible = true; pedestal.position.copy(DUO2);
      const l = lumps[0]; l.visible = true; l.position.copy(DUO2).add(V(0, 1.15 + 0.08 * Math.sin(T * 2), 0)); l.rotation.y = T * 0.5; l.scale.setScalar(Math.max(0.001, spring(prog(t, 0, 0.5)) * 0.95)); cure(0.85);
      sparks.visible = true; setSparks(T, l.position, 1.6, 1.8, 0xffd27a, 1);
      setFloorRings(T, DUO2, 0xffd27a);
      glow.position.copy(DUO2).add(V(0, 2.5, 2.5)); glow.color.set(0xffd27a); glow.intensity = 8;
      const a = lerp(-0.3, 0.2, easeIO(prog(t, 0, tc)));
      return shot(V(DUO2.x + Math.sin(a) * 7.4, 2.4, DUO2.z + Math.cos(a) * 7.4), DUO2.clone().add(V(0, 1.1, 0)), 40, 'gold');
    }
    sea(OCEAN, T); sunBall.position.copy(OCEAN).add(V(-200, 160, -500));
    const k = prog(t, tc - 0.15, d);
    const wp = OCEAN.clone().addScaledVector(WDIR, lerp(-1.5, 1.5, k)).add(V(0, 0.5, 0));
    setWhale(wp, T, { rotY: WY, swim: 2.6, look: [0.6, 0.2], eye: 1.2 });
    whale.updateMatrixWorld(); setMist(t, whale.localToWorld(V(2.2, 1.3, 0)), V(0.1, 1, 0), tc + 0.1, [0.9, 0.97, 1]);
    return shot(wcenter(wp).add(V(0.6, 2.6, 15.0)), wcenter(wp).add(V(0, 1.7, 0)), 40, 'ocean');
  },
  como(t, d, cue, T) {
    const tc = cue.calamar ?? d * 0.15, tp = cue.picos ?? d * 0.4, tw = cue.cera ?? d * 0.7, tm = cue.mar ?? d * 0.95;
    if (t < tp - 0.15) {             // come calamares: entran volando a la boca
      sea(OCEAN, T); sunBall.position.copy(OCEAN).add(V(-200, 160, -500));
      const wp = OCEAN.clone().add(V(-1.0, 0.5, -1.0));
      const open = Math.max(0, Math.sin(clamp((t - tc + 0.3) / 1.6) * Math.PI));
      setWhale(wp, T, { rotY: WY, jaw: open, eye: 1.2, look: [1, -0.2], swim: 2 });
      const mouth = mouthOf();
      squids.forEach((s, i) => { const a = prog(t, tc - 0.2 + i * 0.22, tc + 0.5 + i * 0.22); s.visible = a > 0 && a < 1;
        const from = OCEAN.clone().add(V(2.6 + i * 0.3, WL, 4.0 - i * 0.4)), to = mouth;
        s.position.copy(lerpV(from, to, a)); s.position.y += 2.4 * Math.sin(a * Math.PI); s.rotation.set(0, 0, Math.PI / 2 + a * 2); s.scale.setScalar(0.75); wiggle(s, T, i); });
      return shot(OCEAN.clone().add(V(1.6, 3.0, 13.0)), OCEAN.clone().add(V(0.6, 2.2, 0.5)), 40, 'ocean');
    }
    if (t < tm - 0.15) {             // por dentro: picos que raspan y la masa cerosa que los envuelve
      lightAt(STOM); gut.visible = true; ground.visible = grid.visible = false; dust.visible = false;
      gutLight.position.copy(STOM).add(V(0, 4, 4)); gutLight.intensity = 30 + (t > tp && t < tw ? 25 * Math.max(0, Math.sin(T * 10)) : 0);
      const c = STOM.clone().add(V(0, 3, 0));
      const grow = easeOut(prog(t, tw - 0.2, tw + 1.2));
      beaks.forEach((b, i) => { b.visible = true; const p = b.userData.p.clone().multiplyScalar(1 - 0.45 * grow);
        b.position.copy(c).add(p).add(V(0.1 * Math.sin(T * 3 + i), 0.1 * Math.cos(T * 2.5 + i), 0)); b.rotation.set(b.userData.r[0] + T * 0.6, b.userData.r[1] + T * 0.4, 0); });
      const l = lumps[0]; l.visible = grow > 0.01; l.position.copy(c); l.scale.setScalar(Math.max(0.001, 1.6 * grow)); l.rotation.y = T * 0.3; cure(0.05);
      sparks.visible = true; setSparks(T, c, 2.2, 2.2, t > tp && t < tw ? 0xff4a5a : 0xffd0e0, 0.7);
      glow.position.copy(c).add(V(0, 1, 4)); glow.color.set(t > tp && t < tw ? 0xff3a4a : 0xffb0c0); glow.intensity = 6;
      const k = easeIO(prog(t, tp, tm));
      return shot(c.clone().add(V(Math.sin(k * 0.8 - 0.4) * 6.6, 0.8, Math.cos(k * 0.8 - 0.4) * 6.6)), c, 40, 'gut');
    }
    // ...y termina en el mar: cae al agua
    sea(OCEAN, T); sunBall.position.copy(OCEAN).add(V(-200, 160, -500));
    const fallT = prog(t, tm - 0.15, tm + 0.35);
    const l = lumps[0]; l.visible = true; cure(0.05); l.scale.setScalar(0.75);
    l.position.copy(OCEAN).add(V(0, lerp(6, 0, fallT * fallT), 0)); l.position.y = Math.max(l.position.y, waterAt(OCEAN.x, OCEAN.z, T) + 0.1);
    l.rotation.set(T * 0.5, T * 0.3, 0);
    if (t > tm + 0.2) splash(t, OCEAN.clone().add(V(0, WL, 0)), tm + 0.2);
    return shot(OCEAN.clone().add(V(0, 2.8, 8.8)), OCEAN.clone().add(V(0, 2.2, 0)), 40, 'ocean');
  },
  mar(t, d, cue, T) {
    const tc = cue.curar ?? d * 0.3, th = cue.horrible ?? d * 0.5, td = cue.dulce ?? d * 0.75, tma = cue.marino ?? d * 0.9;
    sea(OCEAN, T);
    // el sol cruza el cielo varias veces: pasan los años
    const sa = T * 1.6, sunset = t > (cue.anos ?? 0.5) && t < th - 0.1;
    sunBall.position.copy(OCEAN).add(V(Math.cos(sa) * 420, 120 + Math.abs(Math.sin(sa)) * 220, -500));
    const lx = 0, lz = 0, l = lumps[0];
    l.visible = true; l.scale.setScalar(0.75); l.position.copy(OCEAN).add(V(lx, 0, lz)); l.position.y = waterAt(OCEAN.x, OCEAN.z, T) + 0.15; l.rotation.set(0.2 * Math.sin(T), T * 0.25, 0.15 * Math.cos(T * 1.2));
    cure(easeIO(prog(t, th + 0.6, td + 0.2)) * 0.95 + 0.05 * easeIO(prog(t, tc, th)));
    // tú en un bote, oliéndola
    boat.visible = true; boat.position.copy(OCEAN).add(V(1.9, waterAt(OCEAN.x + 1.9, OCEAN.z - 0.8, T) - 0.55, -0.8)); boat.rotation.set(0.05 * Math.sin(T * 1.3), -0.3, 0.06 * Math.sin(T * 1.1));
    you.visible = true; you.scale.setScalar(0.55); you.position.copy(boat.position).add(V(0, 0.35, 0)); you.userData.body.add(hatYou); you.userData.nose.visible = t > th - 0.3;
    const bad = t > th && t < td, good = t > td;
    setBuddy(you, { hop: bad ? 0.2 * Math.sin(clamp((t - th) / 0.4) * Math.PI) : hopF(T, 3, 0.05), mood: bad ? 'frown' : good ? 'smile' : 'o', mouthOpen: 0.8, eye: bad ? 0.6 : good ? 1.3 : 1.1, look: [-0.8, -0.3], blink: bad ? 0.3 : blinkAt(T, 0.2), brow: bad ? -0.9 : 0, rotY: -0.9, squash: bad ? 0.1 * Math.exp(-(t - th) * 4) : 0 });
    if (bad) setStink(t, l.position.clone().add(V(0.4, 0.4, 0.3)), th, 0.55);
    if (good) { setHearts(t, l.position.clone().add(V(0.5, 0.6, 0.3)), td, 6, 1.0); sparks.visible = true; setSparks(T, l.position, 1.3, 1.4, 0xffe0a0, 0.9); }
    if (t > tma) setWaves(T, l.position.clone().add(V(0, 0.4, 0)), 0.9, 2.2, 0x9ae8ff, 0.7);
    glow.position.copy(OCEAN).add(V(0, 3, 3)); glow.color.set(bad ? 0x9ad04a : 0xffe0a0); glow.intensity = 4;
    const p = easeIO(t / d);
    return shot(lerpV(OCEAN.clone().add(V(0.2, 3.0, 9.6)), OCEAN.clone().add(V(0.6, 2.7, 8.6)), p), OCEAN.clone().add(V(0.9, 1.7, -0.3)), 40, 'ocean');
  },
  precio(t, d, cue, T) {
    const tf = cue.fortuna ?? 0.3, ty = cue.yemen ?? d * 0.4, tk = cue.kilos ?? d * 0.6, tm = cue.millon ?? d * 0.85;
    if (t < ty - 1.6) {              // vale una fortuna: lluvia de monedas sobre la bola
      lightAt(DUO2); pedestal.visible = true; pedestal.position.copy(DUO2);
      const l = lumps[0]; l.visible = true; l.position.copy(DUO2).add(V(0, 1.15, 0)); l.rotation.y = T * 0.5; l.scale.setScalar(0.9);
      setCoins(DUO2.clone().add(V(0, 0, 0.5)), t, tf);
      sparks.visible = true; setSparks(T, l.position, 1.8, 2, 0xffd27a, 1);
      glow.position.copy(DUO2).add(V(0, 2.5, 2.5)); glow.color.set(0xffd27a); glow.intensity = 8;
      return shot(DUO2.clone().add(V(0, 3.0, 9.2)), DUO2.clone().add(V(0, 1.4, 0)), 40, 'gold');
    }
    if (t < tk - 0.15) {             // pescadores que encuentran un cachalote muerto
      sea(OCEAN, T); sunBall.position.copy(OCEAN).add(V(-200, 160, -500));
      setWhale(OCEAN.clone().add(V(-1.2, 0.7, -1.5)), T * 0.2, { rotX: Math.PI * 0.92, rotY: -0.6, dead: true, swim: 0 });
      boat.visible = true; boat.position.copy(OCEAN).add(V(3.2, waterAt(OCEAN.x + 3.2, OCEAN.z + 1.6, T) - 0.55, 1.6)); boat.rotation.set(0.05 * Math.sin(T * 1.3), -0.5, 0.06 * Math.sin(T));
      [you, pal].forEach((b, i) => { b.visible = true; b.scale.setScalar(0.5); b.position.copy(boat.position).add(V(i ? 0.7 : -0.6, 0.35, i ? -0.3 : 0.3)); b.userData.body.add(i ? hatPal : hatYou);
        setBuddy(b, { hop: hopF(T, 4 + i, 0.06), mood: 'o', mouthOpen: 1.2, eye: 1.4, look: [-0.8, 0], blink: blinkAt(T, i * 0.4), brow: 0.8, rotY: -1.2, armR: 1.8 + 0.3 * Math.sin(T * 6 + i) }); });
      return shot(OCEAN.clone().add(V(1.2, 3.2, 13.0)), OCEAN.clone().add(V(-0.2, 2.0, 0)), 40, 'ocean');
    }
    // en la playa: 127 kilos en la báscula... y un millón y medio
    lightAt(BEACH); beach.visible = true; ground.visible = grid.visible = false; stars.visible = false; dust.visible = false; scene.fog.near = 30; scene.fog.far = 90;
    scaleG.visible = true; scaleG.position.copy(BEACH).add(V(0, 0.4, 0));
    const kg = Math.round(127 * easeOut(prog(t, tk - 0.1, tk + 0.9)));
    scaleText(`${kg} kg`);
    const l = lumps[0]; l.visible = true; l.scale.setScalar(1.25); cure(0.75); l.position.copy(BEACH).add(V(0, 0.4 + 0.3 + 1.0 + 1.5 * (1 - easeOut(prog(t, tk - 0.15, tk + 0.15))), 0.2)); l.rotation.y = 0.4;
    const rich = t > tm;
    [you, pal].forEach((b, i) => { b.visible = true; b.scale.setScalar(0.6); b.position.copy(BEACH).add(V(i ? 2.4 : -2.4, 0.4, 0.9)); b.userData.body.add(i ? hatPal : hatYou);
      setBuddy(b, { hop: rich ? Math.abs(Math.sin(T * 7 + i)) * 0.5 : hopF(T, 3, 0.06), mood: 'o', mouthOpen: rich ? 1.4 : 1.0, eye: rich ? 1.45 : 1.2, look: [i ? -0.7 : 0.7, 0.3], blink: blinkAt(T, i * 0.3), brow: rich ? 0.9 : 0.4, rotY: i ? -0.6 : 0.6, armR: rich ? 2.6 : 0.4, armL: rich ? 2.6 : 0.2 }); });
    if (rich) { setCoins(BEACH.clone().add(V(0, 0.4, 1.0)), t, tm); bills.visible = true; bills.position.copy(BEACH).add(V(0, 0.4, 2.2)); bills.scale.setScalar(Math.max(0.001, spring(prog(t, tm, tm + 0.5)) * 0.8)); }
    glow.position.copy(BEACH).add(V(0, 3, 3)); glow.color.set(rich ? 0xffd27a : 0xffffff); glow.intensity = rich ? 8 : 3;
    const p = easeIO(prog(t, tk, d));
    return shot(lerpV(BEACH.clone().add(V(0, 3.4, 10.5)), BEACH.clone().add(V(0, 3.0, 9.4)), p), BEACH.clone().add(V(0, 1.6, 0.4)), 40, rich ? 'gold' : 'beach');
  },
  perfume(t, d, cue, T) {
    lightAt(DUO2);
    const tf = cue.fijador ?? d * 0.25, tdu = cue.dura ?? d * 0.55, tc = cue.calido ?? d * 0.85;
    pedestal.visible = true; pedestal.position.copy(DUO2);
    hero.visible = true; hero.position.copy(DUO2).add(V(0, 0.18, 0)); hero.scale.setScalar(0.85); hero.rotation.y = 0.3 * Math.sin(T * 0.6);
    // un trocito cae dentro del frasco
    const fall = prog(t, tf - 0.5, tf + 0.1);
    const l = lumps[1]; l.visible = fall < 1; l.scale.setScalar(0.18); l.position.copy(DUO2).add(V(0, lerp(5.5, 2.3, fall * fall), 0)); l.rotation.set(T * 2, T, 0);
    const warm = easeOut(prog(t, tf, tf + 0.6));
    const liq = hero.userData.liquid.material; liq.color.set(0xffa94d).lerp(new THREE.Color(0xff7a2a), warm * (t > tc ? 1 : 0.5)); liq.emissiveIntensity = 0.25 + 0.4 * warm;
    if (t > tdu) { setWaves(T, DUO2.clone().add(V(0, 2.2, 0)), 0.6, 3.0, 0xffb060, 0.8);
      clock.visible = t < tc; clock.position.copy(DUO2).add(V(-1.7, 2.6, 0.5)); clock.scale.setScalar(Math.max(0.001, spring(prog(t, tdu, tdu + 0.4)) * 0.55)); clock.userData.hand.rotation.z = -T * 8; }
    if (t > tc) { setHearts(t, DUO2.clone().add(V(0, 2.4, 0.3)), tc, 6, 1.4); }
    sparks.visible = true; setSparks(T, DUO2.clone().add(V(0, 1.4, 0)), 1.8, 2.4, 0xffb060, 0.5 + 0.5 * warm);
    setFloorRings(T, DUO2, 0xffb060);
    glow.position.copy(DUO2).add(V(0, 2.5, 2.5)); glow.color.set(0xff9a4a); glow.intensity = 5 + 5 * warm;
    const a = lerp(-0.25, 0.25, easeIO(t / d));
    return shot(V(DUO2.x + Math.sin(a) * 8.4, 2.6, DUO2.z + Math.cos(a) * 8.4), DUO2.clone().add(V(0, 1.6, 0)), 40, 'perfume');
  },
  sintetico(t, d, cue, T) {
    const ts = cue.sint ?? d * 0.35, ta = cue.ambroxan ?? d * 0.5, tp = cue.prohib ?? d * 0.9;
    if (t < ts - 0.15) {             // tranquilo: la ballena nada feliz
      sea(OCEAN, T); sunBall.position.copy(OCEAN).add(V(-200, 160, -500));
      const wp = OCEAN.clone().add(V(0.4, 0.5, 0));
      setWhale(wp, T, { rotY: WY, swim: 2.2, look: [0.6, 0.3], eye: 1.25 });
      setHearts(t, mouthOf().add(V(0, 2.0, 0)), 0.4, 6, 1.4);
      return shot(wcenter(wp).add(V(0.6, 2.6, 15.0)), wcenter(wp).add(V(0, 1.7, 0)), 40, 'ocean');
    }
    if (t < tp - 0.15) {             // el laboratorio: ambroxan
      lightAt(ZOOM);
      flask.visible = true; flask.position.copy(ZOOM).add(V(-1.2, 0, 0.6)); flask.scale.setScalar(1.0);
      bubbles.forEach((b, i) => { const a = (T * 0.7 + i / 14) % 1; b.visible = true; b.position.copy(flask.position).add(V(Math.sin(i * 2.3) * 0.25, 0.4 + a * 2.2, Math.cos(i * 1.7) * 0.2)); });
      const pa = spring(prog(t, ta - 0.2, ta + 0.4));
      ambrox.visible = pa > 0.01; ambrox.scale.setScalar(Math.max(0.001, pa) * 0.85); ambrox.position.copy(ZOOM).add(V(0.5, 2.7 + 0.1 * Math.sin(T * 2), 0)); ambrox.rotation.set(0.3 * Math.sin(T), T * 0.8, 0);
      sparks.visible = true; setSparks(T, ambrox.position, 1.8, 2, 0xfff0a0, 0.8);
      glow.position.copy(ZOOM).add(V(0, 3, 3)); glow.color.set(0xfff0a0); glow.intensity = 7;
      return shot(ZOOM.clone().add(V(0.1, 3.0, 12.0 - 0.8 * easeIO(prog(t, ts, tp)))), ZOOM.clone().add(V(-0.1, 2.0, 0)), 40, 'lab');
    }
    // ...y el real, prohibido
    lightAt(DUO2); pedestal.visible = true; pedestal.position.copy(DUO2);
    const l = lumps[0]; l.visible = true; l.position.copy(DUO2).add(V(0, 1.15, 0)); l.rotation.y = T * 0.4; l.scale.setScalar(0.9);
    const pn = spring(prog(t, tp, tp + 0.4));
    noSign.visible = pn > 0.01; noSign.scale.setScalar(Math.max(0.001, pn) * 0.9); noSign.position.copy(DUO2).add(V(0, 1.3, 1.4)); noSign.rotation.y = 0.15 * Math.sin(T * 3);
    glow.position.copy(DUO2).add(V(0, 2.5, 2.5)); glow.color.set(0xff3a4a); glow.intensity = 8;
    return shot(DUO2.clone().add(V(0, 2.6, 8.6)), DUO2.clone().add(V(0, 1.2, 0)), 40, 'no');
  },
  final(t, d, cue, T) {
    const tpl = cue.playa ?? d * 0.3, th = cue.huele ?? d * 0.5, tr = cue.recoger ?? d * 0.75;
    lightAt(BEACH); beach.visible = true; ground.visible = grid.visible = false; stars.visible = false; dust.visible = false; scene.fog.near = 30; scene.fog.far = 90;
    const l = lumps[0]; l.visible = true; l.scale.setScalar(0.45); cure(0.9); l.position.copy(BEACH).add(V(0.3, 0.75, 0.8)); l.rotation.y = 0.6;
    sparks.visible = true; setSparks(T, l.position, 0.8, 0.8, 0xffe0a0, 0.8);
    const walk = easeOut(prog(t, 0, Math.max(0.5, th - 0.4)));
    you.visible = true; you.scale.setScalar(0.65); you.position.copy(BEACH).add(V(lerp(-3.4, -0.8, walk), 0.4, 1.0));
    const sniff = t > th;
    you.userData.nose.visible = sniff;
    setBuddy(you, { hop: walk < 1 ? Math.abs(Math.sin(T * 8)) * 0.15 : hopF(T, 3, 0.06), squash: sniff ? 0.08 * Math.max(0, Math.sin((t - th) * 10)) : 0, mood: sniff ? 'smile' : 'o', mouthOpen: 0.9, eye: sniff ? 1.3 : 1.15, look: [0.8, -0.6], blink: sniff ? 0.25 : blinkAt(T, 0.3), rotY: 0.7, armR: sniff ? 1.4 : 0.3 });
    if (sniff) setHearts(t, l.position.clone().add(V(-0.3, 0.6, 0)), th + 0.2, 4, 0.7);
    qMark.visible = t > tr; qMark.scale.setScalar(Math.max(0.001, spring(prog(t, tr, tr + 0.5)) * 0.8)); qMark.position.copy(BEACH).add(V(1.6, 2.4, 0.8)); qMark.rotation.y = 0.3 * Math.sin(T * 2);
    glow.position.copy(BEACH).add(V(0, 3, 3)); glow.color.set(0xffe0a0); glow.intensity = 4;
    const p = easeIO(t / d);
    return shot(lerpV(BEACH.clone().add(V(-1.0, 2.8, 8.4)), BEACH.clone().add(V(0.2, 2.2, 6.6)), p), BEACH.clone().add(V(-0.2, 1.0, 0.8)), 40, 'beach');
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
  const sh = SCENES[seg.scene](lt, d, cue, t);
  const p = PALA[sh.pal] || PALA.final;
  skyMat.uniforms.top.value.set(p[0]); skyMat.uniforms.bot.value.set(p[1]); scene.fog.color.set(p[1]);
  bokeh.material.color.set(p[2]); bokeh.visible = !water.visible && !beach.visible;
  { const P = bokGeo.attributes.position;
    for (let i = 0; i < BOKN; i++) { const [x, y, z, ph] = bokSeed[i];
      P.setXYZ(i, sh.tgt.x + x + 0.5 * Math.sin(t * 0.4 + ph), y + 0.4 * Math.sin(t * 0.5 + ph * 2), sh.tgt.z + z); }
    P.needsUpdate = true; }
  camera.position.copy(sh.pos).add(V(Math.sin(t * 1.3) * 0.04, Math.sin(t * 1.7 + 1) * 0.03, Math.cos(t * 1.1) * 0.04));
  camera.fov = sh.fov * (1 - 0.07 * (1 - easeOut(lt / 0.45)));
  camera.updateProjectionMatrix();
  camera.lookAt(sh.tgt);
  sky.position.copy(camera.position);
  stars.position.copy(camera.position);
  const a = dust.geometry.attributes.position;
  for (let i = 0; i < DUSTN; i++) {
    const [x, y, z, ph] = dustBase[i];
    a.setXYZ(i, sh.tgt.x + x + Math.sin(t * 0.3 + ph) * 0.6, ((y + t * 0.15) % 7), sh.tgt.z + z + Math.cos(t * 0.25 + ph) * 0.6);
  }
  a.needsUpdate = true;
  renderer.toneMappingExposure = EXPO;
  renderer.render(scene, camera);
  return renderer.domElement.toDataURL('image/jpeg', 0.95);
};
window.ready = true;

// Escenas 3D del video "El mito de las feromonas en los perfumes" (con personajes y humor).
// Reutiliza la base de perfume.js (frasco, rocío, moléculas, piel, reloj...) y agrega personajes y utilería.
// Igual que escena.js: window.renderAt(t) -> JPEG del cuadro t, todo función pura del tiempo.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

const W = 1080, H = 1920;
const Q = new URLSearchParams(location.search);
const timeline = await (await fetch(Q.get('tl') || '/build/feromonas/timeline.json')).json();
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

// ================================================================== UTILERÍA DEL VIDEO DE FEROMONAS
const MOTH = V(80, 0, 0), FARM = V(-80, 0, 0), LAB = V(0, 0, -80), STUDY = V(80, 0, 80), CONFI = V(-80, 0, 80);

// público: más personajes para el gancho
const crowd = [makeBuddy(0x5ad08a), makeBuddy(0xffc23a), makeBuddy(0xb07bff), makeBuddy(0xff8a4a)];
crowd.forEach(b => scene.add(b));

// "poción de amor": frasco rosa con corazón al frente y destellos
const potion = makeBottle(0xff4f9a, 'AMOUR');
const potionHeart = new THREE.Mesh(heartGeo, heartMat); potionHeart.scale.setScalar(0.55); potionHeart.position.set(0, 1.0, 0.56); potion.add(potionHeart);
scene.add(potion);

// ------------------------------------------------------------------ polillas
function makeMoth(bodyColor, wingColor, size = 1) {
  const g = new THREE.Group();
  const bodyM = new THREE.MeshStandardMaterial({ color: bodyColor, roughness: 0.8 });
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.12, 0.45, 8, 16), bodyM); body.rotation.x = Math.PI / 2; g.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 12), bodyM); head.position.z = 0.36; g.add(head);
  [-1, 1].forEach(s => { const e = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 8), BLACK); e.position.set(s * 0.08, 0.05, 0.45); g.add(e); });
  const wing = new THREE.Shape(); wing.moveTo(0, 0); wing.bezierCurveTo(0.25, 0.55, 0.95, 0.65, 1.05, 0.25); wing.bezierCurveTo(1.0, -0.25, 0.45, -0.45, 0, -0.1);
  const wingGeo = new THREE.ShapeGeometry(wing, 24); wingGeo.rotateX(-Math.PI / 2);
  const wingM = new THREE.MeshStandardMaterial({ color: wingColor, roughness: 0.6, side: THREE.DoubleSide, emissive: wingColor, emissiveIntensity: 0.15 });
  const wings = [-1, 1].map(s => { const piv = new THREE.Group(); const w = new THREE.Mesh(wingGeo, wingM); w.scale.set(s, 1, 1); piv.add(w); g.add(piv); return piv; });
  [-1, 1].forEach(s => { const an = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.5, 6), bodyM); an.position.set(s * 0.1, 0.18, 0.55); an.rotation.set(0.9, 0, -s * 0.4); g.add(an);
    for (let k = 0; k < 5; k++) { const f = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.006, 0.01), bodyM); f.position.set(s * (0.13 + k * 0.025), 0.2 + k * 0.04, 0.62 + k * 0.03); f.rotation.y = s * 0.3; g.add(f); } });
  g.scale.setScalar(size); g.traverse(o => (o.castShadow = true)); g.userData.wings = wings;
  return g;
}
function flap(m, T, speed = 14) { const a = 0.75 * Math.sin(T * speed); m.userData.wings[0].rotation.z = a; m.userData.wings[1].rotation.z = -a; }
const female = makeMoth(0xf3e6d8, 0xff9ad0, 1.7);
const males = [0, 1, 2].map(() => makeMoth(0x7a5a3a, 0xd8a868, 1.3));
scene.add(female, ...males);
const branch = new THREE.Group();
{ const st = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.14, 3.2, 12), new THREE.MeshStandardMaterial({ color: 0x5a3a22, roughness: 0.9 })); st.rotation.z = Math.PI / 2; branch.add(st);
  const lf = new THREE.Shape(); lf.moveTo(0, 0); lf.bezierCurveTo(0.4, 0.3, 0.9, 0.3, 1.3, 0); lf.bezierCurveTo(0.9, -0.3, 0.4, -0.3, 0, 0);
  const lg = new THREE.ShapeGeometry(lf, 16); lg.rotateX(-Math.PI / 2);
  [[0.2, 0.3, 0.4], [-0.6, -0.1, -0.9], [0.8, 0.55, 2.2]].forEach(([x, y, r]) => { const l = new THREE.Mesh(lg, new THREE.MeshStandardMaterial({ color: 0x3aa04a, roughness: 0.6, side: THREE.DoubleSide })); l.position.set(x, y, 0.1); l.rotation.y = r; branch.add(l); }); }
scene.add(branch);
const TRAILN = 420, trailGeo = new THREE.BufferGeometry();
trailGeo.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(TRAILN * 3), 3));
const trail = new THREE.Points(trailGeo, new THREE.PointsMaterial({ color: 0xff8fd0, size: 0.13, map: DOT, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
trail.frustumCulled = false; scene.add(trail);
const trailSeed = []; { const r = rng(61); for (let i = 0; i < TRAILN; i++) trailSeed.push([r(), r() * 2 - 1, r() * 2 - 1, r()]); }

// ------------------------------------------------------------------ cerdita y spray
function makePig() {
  const g = new THREE.Group(), pink = new THREE.MeshPhysicalMaterial({ color: 0xffa6bd, roughness: 0.45, clearcoat: 0.6 });
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.9, 40, 28), pink); body.scale.set(1.45, 1, 1); body.position.y = 1.05; g.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.62, 36, 24), pink); head.position.set(1.25, 1.35, 0); g.add(head);
  const snout = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.26, 0.2, 28), new THREE.MeshPhysicalMaterial({ color: 0xff8fae, roughness: 0.4 })); snout.rotation.z = Math.PI / 2; snout.position.set(1.85, 1.25, 0); g.add(snout);
  [-1, 1].forEach(s => { const n = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 8), BLACK); n.position.set(1.96, 1.25, s * 0.09); n.scale.set(0.4, 1.2, 1); g.add(n);
    const ew = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 12), WHITE); ew.position.set(1.62, 1.6, s * 0.25); g.add(ew);
    const ep = new THREE.Mesh(new THREE.SphereGeometry(0.065, 12, 8), BLACK); ep.position.set(1.73, 1.6, s * 0.26); g.add(ep);
    const ear = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.38, 16), pink); ear.position.set(1.1, 1.95, s * 0.36); ear.rotation.set(s * 0.4, 0, -0.3); g.add(ear);
    [-0.6, 0.6].forEach(x => { const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.12, 0.55, 16), pink); leg.position.set(x, 0.28, s * 0.45); g.add(leg); }); });
  const tail = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.035, 8, 24, Math.PI * 1.7), pink); tail.position.set(-1.35, 1.3, 0); tail.rotation.y = Math.PI / 2; g.add(tail);
  g.traverse(o => (o.castShadow = true)); g.userData = { tail, head };
  return g;
}
const pig = makePig(); scene.add(pig);
const can = new THREE.Group();
{ const b = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 1.0, 32), new THREE.MeshStandardMaterial({ map: labelTex('OINK!', '#ffd23a', '#c2185b'), metalness: 0.4, roughness: 0.3 })); b.position.y = 0.5; can.add(b);
  const top = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.28, 0.16, 32), new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 0.9, roughness: 0.2 })); top.position.y = 1.08; can.add(top);
  const noz = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.1, 0.1), new THREE.MeshStandardMaterial({ color: 0xc2185b })); noz.position.set(0.08, 1.2, 0); can.add(noz);
  can.traverse(o => (o.castShadow = true)); }
scene.add(can);
const barn = new THREE.Group();
{ const red = new THREE.MeshStandardMaterial({ color: 0x9a2a22, roughness: 0.8 });
  const wall = new THREE.Mesh(new THREE.BoxGeometry(5, 3.2, 3), red); wall.position.y = 1.6; barn.add(wall);
  const roof = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 2.0, 5.2, 4, 1), new THREE.MeshStandardMaterial({ color: 0x3a2a2a, roughness: 0.8 })); roof.rotation.z = Math.PI / 2; roof.rotation.y = Math.PI / 4; roof.position.y = 3.9; roof.scale.set(1, 1, 0.75); barn.add(roof);
  const door = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 2.0), new THREE.MeshStandardMaterial({ color: 0xf5ecd2 })); door.position.set(0, 1.0, 1.51); barn.add(door); }
barn.position.copy(FARM).add(V(-2.5, 0, -6)); scene.add(barn);
const hay = new THREE.Mesh(new THREE.CylinderGeometry(6, 6, 0.06, 48), new THREE.MeshStandardMaterial({ color: 0xc9a24a, roughness: 1 })); hay.position.copy(FARM).add(V(0, 0.03, 0)); hay.receiveShadow = true; scene.add(hay);

// ------------------------------------------------------------------ laboratorio: lupa, gafas, rodadora
const magnifier = new THREE.Group();
{ const ring = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.07, 12, 64), GOLD); magnifier.add(ring);
  const lens = new THREE.Mesh(new THREE.CircleGeometry(0.58, 48), new THREE.MeshPhysicalMaterial({ color: 0xdff4ff, transmission: 0.9, roughness: 0.02, thickness: 0.3, ior: 1.5, side: THREE.DoubleSide })); magnifier.add(lens);
  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, 0.9, 16), new THREE.MeshStandardMaterial({ color: 0x3a2a1a, roughness: 0.5 })); handle.position.set(0.55, -0.8, 0); handle.rotation.z = 0.6; magnifier.add(handle); }
scene.add(magnifier);
const goggles = new THREE.Group();
{ [-1, 1].forEach(s => { const r = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.04, 10, 32), new THREE.MeshStandardMaterial({ color: 0x2a2a3a, roughness: 0.3 })); r.position.set(s * 0.27, 1.62, 0.7); goggles.add(r); });
  const band = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.04, 8, 48), new THREE.MeshStandardMaterial({ color: 0x2a2a3a })); band.rotation.x = Math.PI / 2; band.position.y = 1.62; goggles.add(band); }
const tumble = new THREE.Group();
{ const r = rng(71), m = new THREE.MeshStandardMaterial({ color: 0x9a7a4a, roughness: 0.9 });
  for (let i = 0; i < 16; i++) { const t2 = new THREE.Mesh(new THREE.TorusGeometry(0.35 + r() * 0.15, 0.015, 6, 24, Math.PI * (1 + r())), m); t2.rotation.set(r() * 6, r() * 6, r() * 6); tumble.add(t2); }
  tumble.traverse(o => (o.castShadow = true)); }
scene.add(tumble);

// ------------------------------------------------------------------ el estudio: 94 personitas, dos frascos y línea plana
const tiny = new THREE.InstancedMesh(new THREE.CapsuleGeometry(0.14, 0.18, 6, 12), new THREE.MeshPhysicalMaterial({ roughness: 0.35, clearcoat: 1 }), 94);
tiny.castShadow = true; tiny.frustumCulled = false; scene.add(tiny);
const tinyEyes = new THREE.InstancedMesh(new THREE.SphereGeometry(0.045, 8, 6), WHITE, 188); tinyEyes.frustumCulled = false; scene.add(tinyEyes);
{ const cols = [0x4f8dff, 0xff6fb0, 0x5ad08a, 0xffc23a, 0xb07bff, 0xff8a4a]; for (let i = 0; i < 94; i++) tiny.setColorAt(i, new THREE.Color(cols[i % cols.length])); }
const vials = [0xb07bff, 0xffd23a].map(c => { const g = new THREE.Group();
  const gl = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 1.1, 32, 1, true), glassMat()); gl.position.y = 0.55; g.add(gl);
  const lq = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.19, 0.6, 32), new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 0.5 })); lq.position.y = 0.32; g.add(lq);
  const ck = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.17, 0.2, 24), new THREE.MeshStandardMaterial({ color: 0xc89a6a, roughness: 0.9 })); ck.position.y = 1.15; g.add(ck);
  scene.add(g); return g; });
const monitor = new THREE.Group();
{ const scr = new THREE.Mesh(new RoundedBoxGeometry(3.4, 1.4, 0.2, 4, 0.08), new THREE.MeshStandardMaterial({ color: 0x0a120e, roughness: 0.3, metalness: 0.4 })); monitor.add(scr);
  const ln = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.04, 0.02), new THREE.MeshBasicMaterial({ color: 0x3aff7a })); ln.position.z = 0.12; monitor.add(ln);
  const dot = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 8), new THREE.MeshBasicMaterial({ color: 0xbfffd0 })); dot.position.z = 0.14; monitor.add(dot); monitor.userData = { ln, dot }; }
scene.add(monitor);

// ------------------------------------------------------------------ lentes de sol (confianza)
const shades = new THREE.Group();
{ const m = new THREE.MeshPhysicalMaterial({ color: 0x0a0a12, roughness: 0.05, metalness: 0.3, clearcoat: 1 });
  [-1, 1].forEach(s => { const l = new THREE.Mesh(new RoundedBoxGeometry(0.42, 0.26, 0.06, 3, 0.06), m); l.position.set(s * 0.27, 1.64, 0.76); shades.add(l); });
  const br = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.04, 0.04), m); br.position.set(0, 1.7, 0.77); shades.add(br); }

// ================================================================== estado por escena
const PALF = {
  gancho: [0x7a1d63, 0x1c0a26, 0xff8fd0], animales: [0x1f4a3a, 0x081a12, 0xff8fd0], cerdo: [0x6aa0d8, 0x2a3a4a, 0xffe6a0],
  humanos: [0x3a2a6b, 0x100a26, 0xbfd8ff], estudio: [0x1a3a2a, 0x061410, 0x3aff7a], confianza: [0x8a5a1a, 0x261808, 0xffd27a],
  final: [0x7a1d63, 0x1c0a26, 0xff8fd0],
};
const SETS = [hero, pedestal, pyr, skin, skinRing, clock, fabric, blotter, blotBottle, ...rowBottles, ...rowBottles.map(b => b.userData.label),
  you, pal, ...crowd, ...hearts, stink, syrup, flask, ...bubbles, ...pans, ...drops, ...puffs, ...duoSkins, ...oilDrops, ...cracks, dryFace, molB,
  thermo, dumbbell, headband, scarf, ...sweat, ...waves, snowPts, bacSurf, ...bugs, noseSet, ...scentShapes, qMark, meter, zzz, check,
  potion, female, ...males, branch, trail, pig, can, barn, hay, magnifier, tumble, tiny, tinyEyes, ...vials, monitor];
function resetWorld() {
  SETS.forEach(o => (o.visible = false));
  Object.values(ingMeshes).flat().forEach(m => (m.visible = false));
  mol.count = 0; molB.count = 0;
  hideMist();
  glow.intensity = 0; spot.intensity = 0;
  sparks.visible = floorRing.visible = floorRing2.visible = false;
  [you, pal, ...crowd].forEach(b => { b.userData.body.remove(headband, scarf, goggles, shades); b.userData.hand.remove(dumbbell, potion, magnifier); b.scale.setScalar(1); });
  youBottle.visible = palBottle.visible = false;
  you.userData.nose.visible = false;
  potion.scale.setScalar(1); potion.rotation.set(0, 0, 0); potion.position.set(0, 0, 0);
  magnifier.scale.setScalar(1); magnifier.rotation.set(0, 0, 0); magnifier.position.set(0, 0, 0);
  scene.fog.near = 22; scene.fog.far = 70;
}
function lightAt(c) { key.position.copy(c).add(V(-5, 10, 7)); key.target.position.copy(c); rim.position.copy(c).add(V(6, 4, -8)); rim.target.position.copy(c); }
const blinkAt = (T, seed) => { const ph = (T * 0.35 + seed) % 1; return ph < 0.04 ? 0.1 : 1; };
const hopF = (T, f = 3, a = 0.08) => Math.abs(Math.sin(T * f)) * a;
const CROWD_POS = [V(-2.0, 0, -1.4), V(2.0, 0, -1.4), V(-1.0, 0, -2.8), V(1.0, 0, -2.8)];

const SCENES = {
  gancho(t, d, cue, T) {
    lightAt(BU);
    const tf = cue.fero ?? 0.5, ta = cue.amor ?? 1.6, tp = cue.prob ?? d * 0.85;
    you.position.copy(BU);
    you.userData.hand.add(potion); potion.visible = true; potion.scale.setScalar(0.3); potion.rotation.z = -0.3; potion.position.set(0, -0.05, 0.05);
    const busted = t > tp;
    setBuddy(you, { hop: hopF(T, 3, 0.06) + (busted ? 0.35 * Math.sin(clamp((t - tp) / 0.35) * Math.PI) : 0), mood: busted ? 'o' : 'smile', mouthOpen: 1.3,
      eye: busted ? 1.45 : 1.1, look: [0, busted ? 0 : 0.2], blink: blinkAt(T, 0.4), brow: busted ? 0.8 : -0.3, armR: t > tf - 0.3 && t < tp ? 1.3 : 0.2 });
    if (t > tf - 0.1 && t < tp) setMist(t, you.userData.hand.localToWorld(V(0, 0.6, 0)), V(0.1, 0.8, 0.5).normalize(), tf - 0.1, [1, 0.5, 0.85]);
    // el público se enamora... hasta que llega el "problema"
    crowd.forEach((b, i) => {
      b.position.copy(BU).add(CROWD_POS[i]);
      const inLove = t > ta + i * 0.12 && !busted;
      const toYou = Math.atan2(BU.x - b.position.x, BU.z - b.position.z);
      setBuddy(b, { hop: inLove ? hopF(T, 5, 0.18) : 0, mood: inLove ? 'o' : busted ? 'frown' : 'smile', mouthOpen: 1.1, eye: inLove ? 1.4 : 1,
        look: [0, 0], blink: blinkAt(T, 0.2 * i), rotY: busted ? toYou + Math.PI * easeOut(prog(t, tp + i * 0.08, tp + 0.4 + i * 0.08)) : toYou, brow: busted ? -0.6 : 0 });
    });
    setHearts(t, BU.clone().add(V(0, 1.7, -1.5)), ta, busted ? 0 : 6, 2.0);
    sparks.visible = true; setSparks(T, BU.clone().add(V(0, 2, -0.5)), 3, 3, 0xff8fd0, busted ? 0.2 : 0.9);
    glow.position.copy(BU).add(V(0, 2.5, 2.5)); glow.color.set(0xff8fd0); glow.intensity = busted ? 2 : 7;
    const p = easeIO(t / d);
    return { pos: lerpV(BU.clone().add(V(0, 3.0, 11.8)), BU.clone().add(V(0.3, 2.8, 10.2)), p), tgt: BU.clone().add(V(0, 1.4, -1.0)), fov: 40 };
  },
  animales(t, d, cue, T) {
    lightAt(MOTH);
    const tm = cue.mol ?? d * 0.4, tl = cue.lejos ?? d * 0.8;
    branch.visible = true; branch.position.copy(MOTH).add(V(0.4, 1.6, 0));
    female.visible = true; female.position.copy(MOTH).add(V(0.2, 1.85, 0.1)); female.rotation.set(0.25, -0.5, 0); flap(female, T, 5);
    // estela de la molécula que viaja lejísimos
    trail.visible = t > tm - 0.2;
    { const P = trailGeo.attributes.position, len = 26 * easeOut(prog(t, tm, d));
      for (let i = 0; i < TRAILN; i++) { const [u, a, b, ph] = trailSeed[i]; const x = -u * len, spread = 0.15 + u * 1.4;
        P.setXYZ(i, MOTH.x + x, 2.0 + a * spread * 0.6 + 0.3 * Math.sin(u * 8 + T), MOTH.z + b * spread + 0.6 * Math.sin(u * 5)); }
      P.needsUpdate = true; }
    males.forEach((m, i) => {
      m.visible = true; flap(m, T + i, 16);
      const far = -16 + i * 2.5;
      const p = easeIO(prog(t, tm + 0.2 + i * 0.25, d + 0.4));
      m.position.set(MOTH.x + lerp(far, -1.6 - i * 0.7, p), 2.3 + 0.5 * Math.sin(T * 3 + i) + i * 0.35, MOTH.z + Math.sin(T * 2 + i) * 0.5 + (i - 1) * 0.6);
      m.rotation.set(0, Math.PI / 2, 0.2 * Math.sin(T * 4 + i));
    });
    setHearts(t, female.position.clone().add(V(0, 0.4, 0)), tl, 3, 0.4);
    glow.position.copy(MOTH).add(V(0, 3, 2)); glow.color.set(0xff8fd0); glow.intensity = 6;
    const pull = easeIO(prog(t, tl - 0.4, tl + 0.8));
    return { pos: lerpV(MOTH.clone().add(V(0.6, 2.4, 6.2)), MOTH.clone().add(V(-4.5, 4.0, 14)), pull), tgt: lerpV(MOTH.clone().add(V(-0.3, 1.9, 0)), MOTH.clone().add(V(-5, 2.2, 0)), pull), fov: 40 };
  },
  cerdo(t, d, cue, T) {
    lightAt(FARM);
    barn.visible = hay.visible = true;
    const tc = cue.cerdo ?? 0.5, tq = cue.quieta ?? d * 0.7;
    pig.visible = true; pig.position.copy(FARM).add(V(-0.4, 0, 0)); pig.rotation.y = 0.35;
    const frozen = t > tq;
    // antes: la cerdita pasea inquieta; después del spray: se queda tiesa
    pig.position.x += frozen ? 0 : 0.25 * Math.sin(T * 2.5);
    pig.rotation.z = frozen ? 0 : 0.05 * Math.sin(T * 8);
    pig.userData.tail.rotation.x = frozen ? 0 : T * 6;
    pig.scale.set(1, frozen ? 1 + 0.06 * Math.exp(-(t - tq) * 5) * Math.sin((t - tq) * 30) : 1, 1);
    can.visible = true; can.position.copy(FARM).add(V(2.6, 0.2 + spring(prog(t, tc - 0.2, tc + 0.4)) * 0.3, 0.6)); can.rotation.set(0, 0, 0.5);
    setMist(t, FARM.clone().add(V(2.25, 1.6, 0.6)), V(-1, 0.1, -0.1).normalize(), tc + 0.2, [1, 0.9, 0.6]);
    setHearts(t, pig.position.clone().add(V(1.0, 2.2, 0)), tq, 4, 0.6);
    glow.position.copy(FARM).add(V(0, 3, 3)); glow.color.set(0xffe6a0); glow.intensity = 5;
    const p = easeIO(t / d);
    return { pos: lerpV(FARM.clone().add(V(1.4, 3.0, 12.0)), FARM.clone().add(V(1.0, 2.7, 10.6)), p), tgt: FARM.clone().add(V(1.0, 1.1, 0)), fov: 40 };
  },
  humanos(t, d, cue, T) {
    lightAt(LAB);
    const ti = cue.inc ?? d * 0.25, tb = cue.busca ?? d * 0.5, tn = cue.nada ?? d * 0.8;
    // tú, incómodo; tu amiga con gafas y lupa buscando feromonas... y no hay nada
    you.position.copy(LAB).add(V(0.9, 0, 0));
    setBuddy(you, { hop: hopF(T, 2, 0.04), mood: t > ti ? 'frown' : 'smile', eye: 0.95, look: [-0.6, t > tb ? 0.2 : 0], blink: blinkAt(T, 0.5), brow: t > ti ? 0.7 : 0, rotY: -0.3, squash: t > ti && t < ti + 0.5 ? 0.08 : 0 });
    pal.position.copy(LAB).add(V(-1.0, 0, 0.3));
    pal.userData.body.add(goggles); goggles.visible = true;
    magnifier.visible = true; magnifier.scale.setScalar(0.75); magnifier.position.copy(pal.position).add(V(0.35, 1.62 + 0.05 * Math.sin(T * 3), 1.0)); magnifier.rotation.set(0, 0.2, 0.2);
    const search = t > tb ? Math.sin(T * 3) : 0;
    setBuddy(pal, { hop: hopF(T, 3, 0.05), mood: t > tn ? 'o' : 'smile', mouthOpen: 1, eye: t > tn ? 1.3 : 1, look: [search, -0.2], blink: blinkAt(T, 0.1), armR: 1.6, rotY: 0.15 + 0.2 * search });
    tumble.visible = t > tn - 0.2;
    { const a = t - (tn - 0.2); tumble.position.copy(LAB).add(V(-4 + a * 3.2, 0.45 + Math.abs(Math.sin(a * 6)) * 0.25, 1.2)); tumble.rotation.set(0, 0, -a * 7); }
    qMark.visible = t > tn; qMark.scale.setScalar(Math.max(0.001, spring(prog(t, tn, tn + 0.5)) * 0.7)); qMark.position.copy(LAB).add(V(0.9, 2.55, 0.2)); qMark.rotation.y = 0.3 * Math.sin(T * 2);
    glow.position.copy(LAB).add(V(0, 2.5, 2.5)); glow.color.set(0xbfd8ff); glow.intensity = 5;
    const p = easeIO(t / d);
    return { pos: lerpV(LAB.clone().add(V(0, 2.5, 9.6)), LAB.clone().add(V(0.3, 2.3, 8.4)), p), tgt: LAB.clone().add(V(0, 1.4, 0)), fov: 40 };
  },
  estudio(t, d, cue, T) {
    lightAt(STUDY);
    const tf = cue.fav ?? d * 0.35, tg = cue.gente ?? d * 0.6, tn = cue.nada ?? d * 0.85;
    vials.forEach((v, i) => { v.visible = true; v.position.copy(STUDY).add(V(i ? 0.8 : -0.8, 0, 2.6)); v.scale.setScalar(Math.max(0.001, spring(prog(t, tf - 0.2 + i * 0.2, tf + 0.4 + i * 0.2)))); v.rotation.y = T; });
    // 94 personitas que aparecen en oleada
    tiny.visible = tinyEyes.visible = true;
    let n = 0;
    for (let i = 0; i < 94; i++) {
      const r = Math.floor(i / 12), c = i % 12;
      const x = (c - 5.5) * 0.55, z = -r * 0.55 + 1.2;
      const p = spring(prog(t, tg - 0.6 + (r + c) * 0.025, tg - 0.1 + (r + c) * 0.025));
      const y = 0.32 + (t > tn ? 0 : Math.abs(Math.sin(T * 5 + i)) * 0.08);
      _m.compose(V(STUDY.x + x, y, STUDY.z + z), _q.identity(), V(1, 1, 1).multiplyScalar(Math.max(0.001, p)));
      tiny.setMatrixAt(i, _m);
      [-1, 1].forEach((s, k) => { _m.compose(V(STUDY.x + x + s * 0.06, y + 0.14 * p, STUDY.z + z + 0.12 * p), _q.identity(), V(1, 1, 1).multiplyScalar(Math.max(0.001, p))); tinyEyes.setMatrixAt(n++, _m); });
    }
    tiny.instanceMatrix.needsUpdate = true; tinyEyes.instanceMatrix.needsUpdate = true;
    // monitor: línea plana con el punto avanzando
    monitor.visible = true; monitor.position.copy(STUDY).add(V(0, 2.3, -3.6)); monitor.scale.setScalar(Math.max(0.001, spring(prog(t, tn - 0.6, tn - 0.1))));
    monitor.userData.dot.position.x = -1.5 + ((T * 0.9) % 1) * 3.0;
    monitor.userData.ln.material.color.set(t > tn ? 0x3aff7a : 0x2a8a4a);
    glow.position.copy(STUDY).add(V(0, 3, 3)); glow.color.set(0x9affb0); glow.intensity = 5;
    const p = easeIO(t / d);
    return { pos: lerpV(STUDY.clone().add(V(0, 4.2, 10.0)), STUDY.clone().add(V(0.2, 4.6, 9.0)), p), tgt: STUDY.clone().add(V(0, 1.4, 0)), fov: 40 };
  },
  confianza(t, d, cue, T) {
    lightAt(CONFI);
    const tc = cue.conf ?? d * 0.45, ti = cue.irr ?? d * 0.65, tn = cue.nota ?? d * 0.85;
    you.position.copy(CONFI);
    if (t > tc) { you.userData.body.add(shades); shades.visible = true; shades.position.y = lerp(1.2, 0, easeOut(prog(t, tc, tc + 0.4))); }
    const strut = t > ti;
    setBuddy(you, { hop: strut ? hopF(T, 4, 0.12) : hopF(T, 2, 0.04), mood: 'smile', eye: 1, blink: 1, brow: t > tc ? -0.4 : 0, armR: strut ? 2.3 : 0.2, armL: strut ? 0.6 : 0, rotY: strut ? 0.25 * Math.sin(T * 2) : 0 });
    spot.position.copy(CONFI).add(V(0, 7, 2)); spot.target.position.copy(CONFI).add(V(0, 1, 0)); spot.intensity = t > tc ? 90 : 20;
    crowd.slice(0, 2).forEach((b, i) => {
      b.position.copy(CONFI).add(V(i ? 2.2 : -2.2, 0, -0.4));
      setBuddy(b, { hop: t > tn ? hopF(T, 5, 0.12) : 0, mood: t > tn ? 'o' : 'smile', mouthOpen: 1.1, eye: t > tn ? 1.35 : 1, look: [i ? -0.7 : 0.7, 0], blink: blinkAt(T, i * 0.4), rotY: i ? -0.5 : 0.5 });
    });
    setHearts(t, CONFI.clone().add(V(0, 2.4, -0.4)), tn, 4, 2.2);
    sparks.visible = true; setSparks(T, CONFI.clone().add(V(0, 1.6, 0)), 1.6, 2.4, 0xffd27a, t > tc ? 1 : 0.3);
    glow.position.copy(CONFI).add(V(0, 2.5, 2.5)); glow.color.set(0xffd27a); glow.intensity = 6;
    const p = easeIO(t / d);
    return { pos: lerpV(CONFI.clone().add(V(0, 2.4, 10.0)), CONFI.clone().add(V(0.3, 2.2, 8.8)), p), tgt: CONFI.clone().add(V(0, 1.4, 0)), fov: 40 };
  },
  final(t, d, cue, T) {
    lightAt(BU);
    const te = cue.encanta ?? d * 0.5, tm = cue.mito ?? d * 0.85;
    // la "poción" sale volando y llega un perfume normal que te encanta
    potion.visible = t < te; potion.position.copy(BU).add(V(1.4 + 3 * easeIO(prog(t, 0.2, te)), 2.2 + 2 * easeIO(prog(t, 0.2, te)), 0)); potion.rotation.z = T * 4; potion.scale.setScalar(0.45);
    hero.visible = t > te - 0.2; hero.position.copy(BU).add(V(1.6, 0, 0.2)); hero.scale.setScalar(0.6 * Math.max(0.001, spring(prog(t, te - 0.2, te + 0.4)))); hero.rotation.y = T * 0.6;
    you.position.copy(BU).add(V(-0.4, 0, 0));
    setBuddy(you, { hop: hopF(T, 3, 0.06) + (t > tm ? 0.4 * Math.sin(prog(t, tm, tm + 0.5) * Math.PI) : 0), mood: t > tm ? 'o' : 'smile', mouthOpen: 1.2, eye: t > te ? 1.3 : 1, look: [0.6, 0], blink: blinkAt(T, 0.3), armR: t > tm ? 2.2 : 0, armL: t > tm ? 2.2 : 0, rotY: 0.35 });
    setHearts(t, BU.clone().add(V(0.6, 2.0, 0.3)), te, 5, 1.2);
    qMark.visible = t > tm; qMark.scale.setScalar(Math.max(0.001, spring(prog(t, tm, tm + 0.5)) * 0.6)); qMark.position.copy(BU).add(V(-0.4, 2.75, 0.3)); qMark.rotation.y = 0.3 * Math.sin(T * 2);
    sparks.visible = true; setSparks(T, BU.clone().add(V(0.6, 1.6, 0)), 2.2, 2.8, 0xff8fd0, 0.8);
    glow.position.copy(BU).add(V(0, 2.5, 2.5)); glow.color.set(0xff8fd0); glow.intensity = 6;
    const a = lerp(-0.2, 0.2, easeIO(t / d));
    return { pos: V(BU.x + Math.sin(a) * 9.4, 2.4, BU.z + Math.cos(a) * 9.4), tgt: BU.clone().add(V(0.4, 1.4, 0)), fov: 40 };
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
  const p = PALF[sh.pal || seg.scene] || PALF.gancho;
  skyMat.uniforms.top.value.set(p[0]); skyMat.uniforms.bot.value.set(p[1]); scene.fog.color.set(p[1]);
  bokeh.material.color.set(p[2]);
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
  renderer.render(scene, camera);
  return renderer.domElement.toDataURL('image/jpeg', 0.95);
};
window.ready = true;

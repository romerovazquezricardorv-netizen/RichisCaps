// Escenas 3D del video "El perfume más antiguo del mundo que todavía se vende" (cuenta regresiva).
// window.renderAt(t) -> JPEG del cuadro t; todo es función pura del tiempo.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

const W = 1080, H = 1920;
const Q = new URLSearchParams(location.search);
const timeline = await (await fetch(Q.get('tl') || '/build/perfume_antiguo/timeline.json')).json();
const font = await new FontLoader().loadAsync('/node_modules/three/examples/fonts/helvetiker_bold.typeface.json');

const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1);
renderer.setSize(W, H);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
renderer.transmissionResolutionScale = 0.5;
renderer.localClippingEnabled = true;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.6;
const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 30000);
scene.fog = new THREE.Fog(0x140c2c, 24, 75);

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

// sets en el mundo
const HERO = V(0, 0, 0), JK = V(28, 0, 0), FA = V(-28, 0, 0), RE = V(0, 0, -28), TL = V(0, 0, 28), POD = V(28, 0, 28);

// ------------------------------------------------------------------ cielo, estrellas, bokeh, polvo
const skyMat = new THREE.ShaderMaterial({
  side: THREE.BackSide, depthWrite: false,
  uniforms: { top: { value: new THREE.Color(0x3b1d6e) }, bot: { value: new THREE.Color(0x140c2c) } },
  vertexShader: `varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }`,
  fragmentShader: `uniform vec3 top, bot; varying vec3 vP;
    void main(){ float h = clamp(vP.y*0.5+0.5,0.,1.); gl_FragColor = vec4(mix(bot, top, smoothstep(0.5,0.95,h)),1.); }`,
});
const sky = new THREE.Mesh(new THREE.SphereGeometry(20000, 32, 16), skyMat);
scene.add(sky);
function softDot() {
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const g = c.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.4, 'rgba(255,255,255,0.5)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}
const DOT = softDot();
const stars = (() => {
  const r = rng(3), p = [];
  for (let i = 0; i < 1500; i++) { const a = r() * 6.283, y = r() * 0.9 + 0.08, s = Math.sqrt(1 - y * y); p.push(Math.cos(a) * s * 15000, y * 15000, Math.sin(a) * s * 15000); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3));
  return new THREE.Points(g, new THREE.PointsMaterial({ color: 0xf2e6ff, size: 2, sizeAttenuation: false, transparent: true, opacity: 0.45, fog: false }));
})();
scene.add(stars);
function pointsCloud(n, size, opacity) {
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(n * 3), 3));
  const p = new THREE.Points(g, new THREE.PointsMaterial({ size, map: DOT, transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending }));
  p.frustumCulled = false; scene.add(p); return p;
}
const bokeh = pointsCloud(70, 1.1, 0.35);
const bokSeed = []; { const r = rng(57); for (let i = 0; i < 70; i++) bokSeed.push([r() * 26 - 13, r() * 9 + 0.5, -(r() * 12 + 7), r() * 6.28]); }
const dust = pointsCloud(220, 0.07, 0.7); dust.material.color.set(0xffe6c8);
const dustSeed = []; { const r = rng(11); for (let i = 0; i < 220; i++) dustSeed.push([r() * 24 - 12, r() * 7, r() * 24 - 12, r() * 6.28]); }
const sparks = pointsCloud(160, 0.16, 1);
const sparkSeed = []; { const r = rng(31); for (let i = 0; i < 160; i++) sparkSeed.push([r() * 6.28, r(), r(), r()]); }
function setSparks(T, center, radius, height, color, amount = 1) {
  sparks.visible = true; sparks.material.color.set(color); sparks.material.opacity = amount;
  const P = sparks.geometry.attributes.position;
  for (let i = 0; i < 160; i++) {
    const [a0, rr, h, sp] = sparkSeed[i], a = a0 + T * (0.6 + sp * 0.8), r = radius * (0.8 + rr * 0.6);
    P.setXYZ(i, center.x + Math.cos(a) * r, center.y + (h - 0.5) * height + 0.15 * Math.sin(T * 2 + a0 * 3), center.z + Math.sin(a) * r);
  }
  P.needsUpdate = true;
}

// paletas por escena: [cielo arriba, cielo abajo/niebla, bokeh]
const PALETA = {
  gancho: [0x3d1a6e, 0x120a26, 0xb98cff], intro: [0x4a1f8a, 0x160b30, 0xffd27a],
  jicky: [0x5a2a8a, 0x1a0d30, 0xe6b8ff], jicky2: [0x3a2a8a, 0x100c30, 0x8fd0ff],
  farina: [0x8a3f5b, 0x26101e, 0xffc070], farina2: [0xc0603a, 0x3a1810, 0xffe08a], farina3: [0x6b3a6b, 0x1e0f22, 0xffc070],
  reina: [0x7a1420, 0x200608, 0xffb070], reina2: [0x6b1430, 0x1c060c, 0xffd27a], reina3: [0x1f3a7a, 0x0a1026, 0xffd27a],
  final: [0x7a1d63, 0x1c0a26, 0xff8fd0],
};

// ------------------------------------------------------------------ luces, suelo
scene.add(new THREE.HemisphereLight(0xc8b0ff, 0x120b24, 0.7));
const key = new THREE.DirectionalLight(0xfff0e0, 2.4);
key.castShadow = true; key.shadow.mapSize.set(1024, 1024);
Object.assign(key.shadow.camera, { left: -8, right: 8, top: 8, bottom: -8, near: 1, far: 40 });
key.shadow.bias = -0.0005;
scene.add(key, key.target);
const rim = new THREE.DirectionalLight(0xff9fd0, 1.6); scene.add(rim, rim.target);
const glow = new THREE.PointLight(0xffc070, 0, 10, 1.5); scene.add(glow);
const spots = [0, 1, 2].map(() => { const s = new THREE.SpotLight(0xffe6c0, 0, 16, 0.32, 0.5, 1); scene.add(s, s.target); return s; });
function lightAt(c) { key.position.copy(c).add(V(-5, 10, 7)); key.target.position.copy(c); rim.position.copy(c).add(V(6, 4, -8)); rim.target.position.copy(c); }

const ground = new THREE.Mesh(new THREE.PlaneGeometry(4000, 4000), new THREE.MeshStandardMaterial({ color: 0x0f0a22, roughness: 0.3, metalness: 0.35 }));
ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
const grid = new THREE.GridHelper(300, 150, 0x3a2a7a, 0x231a52); grid.position.y = 0.005;
grid.material.transparent = true; grid.material.opacity = 0.22; scene.add(grid);

// ------------------------------------------------------------------ materiales y textos 3D
const GOLD = new THREE.MeshStandardMaterial({ color: 0xe0b45c, metalness: 1, roughness: 0.2 });
const GOLDGLOW = new THREE.MeshStandardMaterial({ color: 0xffd27a, metalness: 0.8, roughness: 0.25, emissive: 0xffa53a, emissiveIntensity: 0.35 });
const glass = () => new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 1, thickness: 0.5, roughness: 0.04, ior: 1.45, clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 1.4 });
const std = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.45, ...o });
function text3d(str, size, mat = GOLDGLOW, depth = 0.25) {
  const g = new TextGeometry(str, { font, size, depth, curveSegments: 6, bevelEnabled: true, bevelThickness: depth * 0.25, bevelSize: size * 0.03, bevelSegments: 3 });
  g.computeBoundingBox(); const b = g.boundingBox;
  g.translate(-(b.max.x + b.min.x) / 2, 0, -(b.max.z + b.min.z) / 2);
  const m = new THREE.Mesh(g, mat); m.castShadow = true; return m;
}

// ------------------------------------------------------------------ frascos (genéricos, inspirados en cada época)
// el líquido se recorta con un plano a la altura de llenado
function liquidMat(color) {
  const plane = new THREE.Plane(V(0, -1, 0), 0);
  const m = new THREE.MeshStandardMaterial({ color, roughness: 0.15, emissive: color, emissiveIntensity: 0.25, clippingPlanes: [plane] });
  m.userData.plane = plane; return m;
}
function lathe(prof, seg = 64) { return new THREE.LatheGeometry(prof.map(([r, y]) => new THREE.Vector2(r, y)), seg); }
// Belle Époque (1889): frasco cuadrado con tapón facetado
function bottleSquare(color) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new RoundedBoxGeometry(1.25, 1.55, 1.25, 6, 0.12), glass()); body.position.y = 0.78;
  const lq = new THREE.Mesh(new RoundedBoxGeometry(1.02, 1.35, 1.02, 4, 0.08), liquidMat(color)); lq.position.y = 0.72;
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 0.22, 32), GOLD); neck.position.y = 1.66;
  const stop = new THREE.Mesh(new THREE.OctahedronGeometry(0.42, 0), new THREE.MeshPhysicalMaterial({ color: 0xf2d6ff, transmission: 0.8, roughness: 0.05, thickness: 0.4, ior: 1.5 }));
  stop.scale.set(1, 1.15, 0.55); stop.position.y = 2.12;
  const ribbon = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.035, 8, 32), GOLD); ribbon.rotation.x = Math.PI / 2; ribbon.position.y = 1.78;
  g.add(body, lq, neck, stop, ribbon); g.userData = { liquid: lq, level: 1.18 }; return g;
}
// Colonia (1709): botella alta y delgada tipo "rosolio"
function bottleTall(color) {
  const g = new THREE.Group();
  const prof = [[0, 0], [0.42, 0], [0.45, 0.06], [0.45, 1.7], [0.38, 1.95], [0.16, 2.15], [0.13, 2.7], [0.16, 2.75], [0, 2.75]];
  const body = new THREE.Mesh(lathe(prof), glass());
  const lq = new THREE.Mesh(lathe(prof.map(([r, y]) => [r * 0.84, y * 0.98 + 0.03])), liquidMat(color));
  const cork = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.15, 0.28, 24), GOLD); cork.position.y = 2.86;
  const band = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.46, 0.5, 48, 1, true), new THREE.MeshStandardMaterial({ color: 0xf5ecd2, roughness: 0.8, side: THREE.DoubleSide }));
  band.position.y = 0.95;
  g.add(body, lq, cork, band); g.userData = { liquid: lq, level: 1.85 }; return g;
}
// Renacimiento (1533): frasco redondo de botica con tapón ornamentado
function bottleFlask(color) {
  const g = new THREE.Group();
  const prof = [[0, 0], [0.45, 0.02], [0.8, 0.25], [0.95, 0.65], [0.9, 1.05], [0.6, 1.38], [0.24, 1.55], [0.2, 1.85], [0.27, 1.92], [0, 1.92]];
  const body = new THREE.Mesh(lathe(prof), glass());
  const lq = new THREE.Mesh(lathe(prof.map(([r, y]) => [r * 0.86, y * 0.97 + 0.04])), liquidMat(color));
  const stop = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 24), GOLD); stop.position.y = 2.15; stop.scale.set(1, 0.85, 1);
  const tip = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.3, 16), GOLD); tip.position.y = 2.52;
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.04, 10, 64), GOLD); ring.rotation.x = Math.PI / 2; ring.position.y = 1.32;
  g.add(body, lq, stop, tip, ring); g.userData = { liquid: lq, level: 1.15 }; return g;
}
function updateLiquid(b) {
  if (!b.visible) return;
  b.updateMatrixWorld(true);
  const p = b.localToWorld(V(0, b.userData.level, 0));
  b.userData.liquid.material.userData.plane.constant = p.y;
}
const COLORS = { jicky: 0xc9a0ff, farina: 0xffe58a, reina: 0xffb36b };

function pedestal(color = 0x1c1433) {
  const g = new THREE.Group();
  const base = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.1, 0.9, 64), new THREE.MeshStandardMaterial({ color, metalness: 0.5, roughness: 0.22 }));
  base.position.y = 0.45; base.castShadow = base.receiveShadow = true;
  const rimG = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.04, 10, 96), GOLD); rimG.rotation.x = Math.PI / 2; rimG.position.y = 0.9;
  g.add(base, rimG); return g;
}

// ------------------------------------------------------------------ SET: gancho / intro (3 pedestales misteriosos)
const heroSet = new THREE.Group(); heroSet.position.copy(HERO); scene.add(heroSet);
const heroBottles = [bottleSquare(COLORS.jicky), bottleTall(COLORS.farina), bottleFlask(COLORS.reina)];
const heroQ = [];
heroBottles.forEach((b, i) => {
  const x = (i - 1) * 1.85;
  const p = pedestal(); p.position.set(x, 0, 0); p.scale.set(0.82, 1, 0.82); heroSet.add(p);
  b.position.set(x, 0.9, 0); b.scale.setScalar(0.8); heroSet.add(b);
  const q = text3d('?', 0.9); q.position.set(x, 3.6, 0); heroSet.add(q); heroQ.push(q);
});

// ------------------------------------------------------------------ SET: Jicky 1889
const jkSet = new THREE.Group(); jkSet.position.copy(JK); scene.add(jkSet);
const jkPed = pedestal(0x2a1a4a); jkSet.add(jkPed);
const jkBottle = bottleSquare(COLORS.jicky); jkBottle.position.y = 0.9; jkBottle.scale.setScalar(1.15); jkSet.add(jkBottle);
const num3 = text3d('3', 2.2); num3.position.set(0, 2.2, -3.2); jkSet.add(num3);
const y1889 = text3d('1889', 0.75); y1889.position.set(0, 0.05, 1.9); y1889.rotation.x = -1.0; jkSet.add(y1889);
// moléculas sintéticas (anillos tipo benceno con oxígenos)
function moleculeRing() {
  const g = new THREE.Group();
  const C = std(0xeeeeff, { roughness: 0.3, metalness: 0.1 }), O = std(0xff4060, { roughness: 0.3 }), B = std(0xbfc4ff, { roughness: 0.4 });
  const pts = [];
  for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; const p = V(Math.cos(a) * 0.55, Math.sin(a) * 0.55, 0); pts.push(p); const s = new THREE.Mesh(new THREE.SphereGeometry(0.16, 20, 14), C); s.position.copy(p); g.add(s); }
  const bond = (a, b) => { const d = b.clone().sub(a), m = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, d.length(), 10), B); m.position.copy(a).addScaledVector(d, 0.5); m.quaternion.setFromUnitVectors(V(0, 1, 0), d.normalize()); g.add(m); };
  for (let i = 0; i < 6; i++) bond(pts[i], pts[(i + 1) % 6]);
  [0, 2].forEach(i => { const o = pts[i].clone().multiplyScalar(1.8); const s = new THREE.Mesh(new THREE.SphereGeometry(0.19, 20, 14), O); s.position.copy(o); g.add(s); bond(pts[i], o); });
  return g;
}
const mols = [moleculeRing(), moleculeRing(), moleculeRing()];
mols.forEach(m => { m.traverse(o => (o.castShadow = true)); jkSet.add(m); });

// ------------------------------------------------------------------ SET: Farina 1709 (Colonia)
const faSet = new THREE.Group(); faSet.position.copy(FA); scene.add(faSet);
const faPed = pedestal(0x3a1a22); faSet.add(faPed);
const faBottle = bottleTall(COLORS.farina); faBottle.position.y = 0.9; faBottle.scale.setScalar(1.05); faSet.add(faBottle);
const num2 = text3d('2', 2.2); num2.position.set(0, 2.2, -3.2); faSet.add(num2);
const y1709 = text3d('1709', 0.75); y1709.position.set(0, 0.05, 1.9); y1709.rotation.x = -1.0; faSet.add(y1709);
const sun = new THREE.Mesh(new THREE.CircleGeometry(3.2, 64), new THREE.MeshBasicMaterial({ color: 0xffc46b, fog: false }));
sun.position.set(0, 3.0, -14); faSet.add(sun);
const sunHalo = new THREE.Mesh(new THREE.CircleGeometry(5.5, 64), new THREE.MeshBasicMaterial({ color: 0xff8a4a, transparent: true, opacity: 0.35, fog: false }));
sunHalo.position.set(0, 3.0, -14.1); faSet.add(sunHalo);
// silueta de catedral gótica de dos torres
const silMat = new THREE.MeshBasicMaterial({ color: 0x1a0c18 });
const cathedral = new THREE.Group();
[-1.5, 1.5].forEach(x => {
  const tw = new THREE.Mesh(new THREE.BoxGeometry(1.4, 7, 1.4), silMat); tw.position.set(x, 3.5, 0); cathedral.add(tw);
  const sp = new THREE.Mesh(new THREE.ConeGeometry(1.0, 3.6, 4), silMat); sp.position.set(x, 8.8, 0); sp.rotation.y = Math.PI / 4; cathedral.add(sp);
  for (let k = 0; k < 4; k++) { const pin = new THREE.Mesh(new THREE.ConeGeometry(0.18, 1.1, 4), silMat); pin.position.set(x + (k % 2 ? 0.6 : -0.6), 7.4, k < 2 ? 0.6 : -0.6); cathedral.add(pin); }
});
const nave = new THREE.Mesh(new THREE.BoxGeometry(2.0, 4.2, 6), silMat); nave.position.set(0, 2.1, -2.5); cathedral.add(nave);
const roof = new THREE.Mesh(new THREE.ConeGeometry(1.5, 1.6, 4), silMat); roof.scale.set(1, 1, 3); roof.rotation.y = Math.PI / 4; roof.position.set(0, 5.0, -2.5); cathedral.add(roof);
cathedral.position.set(0, 0, -10); cathedral.scale.setScalar(0.95); faSet.add(cathedral);
const houses = new THREE.Group();
{ const r = rng(5); for (let i = 0; i < 14; i++) { const w = 1 + r() * 1.2, h = 1.5 + r() * 2.2, x = -12 + i * 1.8; if (Math.abs(x) < 2.6) continue; const hb = new THREE.Mesh(new THREE.BoxGeometry(w, h, 1.2), silMat); hb.position.set(x, h / 2, -9 - r()); houses.add(hb); const rf = new THREE.Mesh(new THREE.ConeGeometry(w * 0.75, 1.1, 4), silMat); rf.rotation.y = Math.PI / 4; rf.position.set(x, h + 0.5, hb.position.z); houses.add(rf); } }
faSet.add(houses);
const colonia = text3d('COLONIA', 0.85); colonia.position.set(0, 2.6, -2.4); faSet.add(colonia);
// cítricos y azahar
function fruit(color, r, sx = 1) { const m = new THREE.Mesh(new THREE.SphereGeometry(r, 32, 24), std(color, { roughness: 0.6 })); m.scale.set(sx, 1, 1); m.castShadow = true; return m; }
function blossom() {
  const g = new THREE.Group();
  for (let i = 0; i < 5; i++) { const p = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 10), std(0xfffaf0, { roughness: 0.5 })); p.scale.set(0.24, 0.04, 0.12); const a = i / 5 * 6.283; p.position.set(Math.cos(a) * 0.2, 0, Math.sin(a) * 0.2); p.rotation.y = -a; g.add(p); }
  const c = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 8), std(0xffd24a)); g.add(c); g.rotation.x = 1.0; return g;
}
const citrus = [fruit(0xf6d32b, 0.4, 1.25), fruit(0xff9a2a, 0.45), fruit(0xb5cf45, 0.38), blossom(), blossom(), fruit(0xf6d32b, 0.32, 1.25), blossom()];
citrus.forEach(c => faSet.add(c));

// ------------------------------------------------------------------ SET: Agua de la Reina 1533 (Florencia)
const reSet = new THREE.Group(); reSet.position.copy(RE); scene.add(reSet);
const rePed = pedestal(0x3a0f14); reSet.add(rePed);
const reBottle = bottleFlask(COLORS.reina); reBottle.position.y = 0.9; reBottle.scale.setScalar(1.15); reSet.add(reBottle);
const num1 = text3d('1', 2.4); num1.position.set(0, 2.2, -3.2); reSet.add(num1);
const y1533 = text3d('1533', 0.75); y1533.position.set(0, 0.05, 1.9); y1533.rotation.x = -1.0; reSet.add(y1533);
const silR = new THREE.MeshBasicMaterial({ color: 0x220a0c });
const florence = new THREE.Group();
{
  const drum = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.4, 1.6, 8), silR); drum.position.y = 4.0; florence.add(drum);
  const dome = new THREE.Mesh(lathe([[0, 3.2], [0.8, 3.0], [1.6, 2.4], [2.2, 1.2], [2.4, 0]], 8), silR); dome.position.y = 4.8; florence.add(dome);
  const lantern = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.45, 1.0, 8), silR); lantern.position.y = 8.4; florence.add(lantern);
  const ltip = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.9, 8), silR); ltip.position.y = 9.3; florence.add(ltip);
  const nv = new THREE.Mesh(new THREE.BoxGeometry(9, 3.2, 3), silR); nv.position.y = 1.6; florence.add(nv);
  const tower = new THREE.Mesh(new THREE.BoxGeometry(1.3, 8.5, 1.3), silR); tower.position.set(5.5, 4.25, 0.5); florence.add(tower);
  const ttop = new THREE.Mesh(new THREE.ConeGeometry(0.8, 1.0, 4), silR); ttop.rotation.y = Math.PI / 4; ttop.position.set(5.5, 9.0, 0.5); florence.add(ttop);
}
florence.position.set(-0.8, 0, -11); reSet.add(florence);
const moon = new THREE.Mesh(new THREE.CircleGeometry(2.0, 64), new THREE.MeshBasicMaterial({ color: 0xffd9a0, fog: false }));
moon.position.set(3.5, 6.5, -16); reSet.add(moon);
// corona de Catalina
const crown = new THREE.Group();
{
  const band = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.62, 0.32, 48, 1, true), new THREE.MeshStandardMaterial({ color: 0xe0b45c, metalness: 1, roughness: 0.2, side: THREE.DoubleSide }));
  crown.add(band);
  const gemC = [0xff2a4a, 0x2a8aff, 0x2aff8a];
  for (let i = 0; i < 8; i++) {
    const a = i / 8 * 6.283;
    const sp = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.45, 12), GOLD); sp.position.set(Math.cos(a) * 0.6, 0.38, Math.sin(a) * 0.6); crown.add(sp);
    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 8), GOLD); ball.position.set(Math.cos(a) * 0.6, 0.64, Math.sin(a) * 0.6); crown.add(ball);
    const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.08, 0), std(gemC[i % 3], { emissive: gemC[i % 3], emissiveIntensity: 0.5, roughness: 0.1 })); gem.position.set(Math.cos(a) * 0.63, 0, Math.sin(a) * 0.63); crown.add(gem);
  }
}
crown.traverse(o => (o.castShadow = true));
reSet.add(crown);
function rose() {
  const g = new THREE.Group();
  [[7, 0.3, 0.26, 0.17, 0.5], [6, 0.18, 0.2, 0.14, 0.9], [5, 0.08, 0.15, 0.11, 1.3]].forEach(([n, r, l, w, tl], k) => {
    for (let i = 0; i < n; i++) { const p = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 10), std(0xd8203f, { roughness: 0.55 })); p.scale.set(l, 0.045, w); const a = i / n * 6.283 + k * 0.4; p.position.set(Math.cos(a) * r, k * 0.07, Math.sin(a) * r); p.rotation.set(0, -a, tl); g.add(p); }
  });
  g.rotation.x = 0.9; return g;
}
const roses = [rose(), rose(), rose(), rose()];
roses.forEach(r => reSet.add(r));

// ------------------------------------------------------------------ SET: línea del tiempo
const tlSet = new THREE.Group(); tlSet.position.copy(TL); scene.add(tlSet);
const YEARS = [1533, 1709, 1889, 2026];
const yx = y => (y - 1533) / (2026 - 1533) * 16 - 8;
const line = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 16, 16), GOLDGLOW); line.rotation.z = Math.PI / 2; line.position.y = 0.6; tlSet.add(line);
const tlBottles = [bottleFlask(COLORS.reina), bottleTall(COLORS.farina), bottleSquare(COLORS.jicky)];
YEARS.forEach((y, i) => {
  const m = new THREE.Mesh(new THREE.SphereGeometry(0.16, 24, 16), GOLDGLOW); m.position.set(yx(y), 0.6, 0); tlSet.add(m);
  const lab = text3d(String(y), 0.42); lab.position.set(yx(y), 0.95, 0.4); lab.rotation.x = -0.15; tlSet.add(lab);
  if (i < 3) { const b = tlBottles[i]; b.scale.setScalar(0.55); b.position.set(yx(y), 1.6, 0); tlSet.add(b); }
});
const runner = new THREE.Mesh(new THREE.SphereGeometry(0.22, 24, 16), new THREE.MeshBasicMaterial({ color: 0xffffff })); tlSet.add(runner);

// ------------------------------------------------------------------ SET: podio final con confeti
const podSet = new THREE.Group(); podSet.position.copy(POD); scene.add(podSet);
const podDef = [[-2.2, 1.0, 0xc0c4d8, '2', bottleTall(COLORS.farina)], [0, 1.6, 0xe0b45c, '1', bottleFlask(COLORS.reina)], [2.2, 0.7, 0xcd7f4a, '3', bottleSquare(COLORS.jicky)]];
const podBottles = [];
podDef.forEach(([x, h, col, n, b]) => {
  const st = new THREE.Mesh(new RoundedBoxGeometry(2.0, h, 2.0, 4, 0.08), new THREE.MeshStandardMaterial({ color: col, metalness: 0.85, roughness: 0.25 }));
  st.position.set(x, h / 2, 0); st.castShadow = st.receiveShadow = true; podSet.add(st);
  const num = text3d(n, 0.6, new THREE.MeshStandardMaterial({ color: 0x1a1030, metalness: 0.3, roughness: 0.4 }), 0.08); num.position.set(x, h / 2 - 0.3, 1.0); podSet.add(num);
  b.position.set(x, h, 0); b.scale.setScalar(0.75); podSet.add(b); podBottles.push(b);
});
const CONF = 320;
const confetti = new THREE.InstancedMesh(new THREE.PlaneGeometry(0.12, 0.2), new THREE.MeshStandardMaterial({ side: THREE.DoubleSide, roughness: 0.5, metalness: 0.3 }), CONF);
confetti.frustumCulled = false; scene.add(confetti);
const confSeed = [];
{ const r = rng(99), pal = [0xff4f9a, 0xffd23a, 0x4adfff, 0x9b6bff, 0x5aff8a, 0xff8a3a]; for (let i = 0; i < CONF; i++) { confSeed.push([r() * 9 - 4.5, r() * 6 - 3, r(), r() * 6.28, r()]); confetti.setColorAt(i, new THREE.Color(pal[i % pal.length])); } }

// ------------------------------------------------------------------ estado por escena
const SETS = [heroSet, jkSet, faSet, reSet, tlSet, podSet];
const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler();
function resetWorld() {
  SETS.forEach(s => (s.visible = false));
  sparks.visible = false; confetti.count = 0;
  glow.intensity = 0; spots.forEach(s => (s.intensity = 0));
}
function popIn(obj, t, t0, dur = 0.6, base = 1) { const p = prog(t, t0, t0 + dur); obj.visible = p > 0; obj.scale.setScalar(Math.max(0.001, spring(p)) * base); return p; }

const SCENES = {
  gancho(t, d, cue, T) {
    heroSet.visible = true; lightAt(HERO);
    // reflectores que barren los tres frascos
    spots.forEach((s, i) => {
      const x = (i - 1) * 1.85 + 1.2 * Math.sin(T * 1.3 + i * 2);
      s.position.set(HERO.x + x, 7, HERO.z + 3); s.target.position.set(HERO.x + (i - 1) * 1.85, 0.9, HERO.z); s.intensity = 70;
    });
    heroBottles.forEach((b, i) => { b.rotation.y = T * 0.5 + i; });
    heroQ.forEach((q, i) => { popIn(q, t, 0.3 + i * 0.25, 0.6); q.position.y = 3.6 + 0.12 * Math.sin(T * 2 + i); q.rotation.y = 0.3 * Math.sin(T + i); });
    setSparks(T, HERO.clone().add(V(0, 2, 0)), 4, 4, 0xd8c0ff, 0.7);
    const p = easeIO(t / d);
    return { pos: lerpV(V(0, 2.4, 16), V(0, 2.6, 14), p), tgt: V(0, 2.0, 0), fov: 40 };
  },
  intro(t, d, cue, T) {
    heroSet.visible = true; lightAt(HERO);
    const tt = cue.tres ?? d * 0.6;
    spots.forEach((s, i) => { s.position.set(HERO.x + (i - 1) * 1.85, 7, HERO.z + 3); s.target.position.set(HERO.x + (i - 1) * 1.85, 0.9, HERO.z); s.intensity = 90 * easeOut(prog(t, tt + i * 0.2, tt + 0.4 + i * 0.2)) + 20; });
    heroBottles.forEach((b, i) => { b.rotation.y = T * 0.5 + i; b.position.y = 0.9 + 0.25 * spring(prog(t, tt + i * 0.2, tt + 0.6 + i * 0.2)) ; });
    heroQ.forEach((q, i) => { q.visible = true; q.scale.setScalar(1 - easeOut(prog(t, tt + i * 0.2, tt + 0.4 + i * 0.2)) + 0.001); q.position.y = 3.6 + 0.12 * Math.sin(T * 2 + i); });
    setSparks(T, HERO.clone().add(V(0, 2, 0)), 4, 4, 0xffd27a, 0.8);
    const a = lerp(-0.35, 0.35, easeIO(t / d));
    return { pos: V(Math.sin(a) * 14.5, 3.0, Math.cos(a) * 14.5), tgt: V(0, 1.9, 0), fov: 40 };
  },
  jicky(t, d, cue, T) {
    jkSet.visible = true; lightAt(JK);
    popIn(num3, t, (cue.n3 ?? 0.2) - 0.1, 0.7);
    num3.rotation.y = 0.25 * Math.sin(T * 0.8);
    popIn(y1889, t, (cue.y ?? d * 0.7) - 0.05, 0.6);
    jkBottle.rotation.y = T * 0.6;
    mols.forEach(m => (m.visible = false));
    setSparks(T, JK.clone().add(V(0, 2.2, 0)), 2.2, 3, 0xe6b8ff, 0.9);
    glow.position.copy(JK).add(V(0, 2.5, 3)); glow.color.set(0xd8a0ff); glow.intensity = 6;
    const p = easeIO(t / d);
    return { pos: lerpV(JK.clone().add(V(-1, 2.6, 10.5)), JK.clone().add(V(0.6, 2.8, 8.8)), p), tgt: JK.clone().add(V(0, 2.3, 0)), fov: 40 };
  },
  jicky2(t, d, cue, T) {
    jkSet.visible = true; lightAt(JK);
    num3.visible = true; num3.scale.setScalar(1); num3.rotation.y = 0.25 * Math.sin(T * 0.8);
    y1889.visible = false;
    jkBottle.rotation.y = T * 0.6;
    const ts = cue.sint ?? d * 0.75;
    mols.forEach((m, i) => {
      const p = popIn(m, t, ts - 0.9 + i * 0.25, 0.6, 0.85);
      const a = T * 0.7 + i * 2.09;
      m.position.set(Math.cos(a) * 2.0, 2.0 + i * 0.5 + 0.2 * Math.sin(T * 2 + i), Math.sin(a) * 2.0 + 0.6);
      m.rotation.set(T * 0.8 + i, T * 0.6, 0);
    });
    setSparks(T, JK.clone().add(V(0, 2.2, 0)), 2.4, 3, 0x8fd0ff, 0.9);
    glow.position.copy(JK).add(V(0, 2.5, 3)); glow.color.set(0x9fd0ff); glow.intensity = 6;
    const a = lerp(-0.5, 0.4, easeIO(t / d));
    return { pos: V(JK.x + Math.sin(a) * 9, 3.0, JK.z + Math.cos(a) * 9), tgt: JK.clone().add(V(0, 2.3, 0)), fov: 40 };
  },
  farina(t, d, cue, T) {
    faSet.visible = true; lightAt(FA);
    popIn(num2, t, (cue.n2 ?? 0.2) - 0.1, 0.7); num2.rotation.y = 0.25 * Math.sin(T * 0.8);
    popIn(y1709, t, (cue.y ?? d * 0.7) - 0.05, 0.6);
    colonia.visible = false; citrus.forEach(c => (c.visible = false));
    faBottle.rotation.y = T * 0.6;
    setSparks(T, FA.clone().add(V(0, 2.4, 0)), 2.0, 3.4, 0xffd08a, 0.9);
    glow.position.copy(FA).add(V(0, 2.5, 3)); glow.color.set(0xffc070); glow.intensity = 6;
    const p = easeIO(t / d);
    return { pos: lerpV(FA.clone().add(V(1, 2.8, 11)), FA.clone().add(V(-0.6, 3.0, 9.2)), p), tgt: FA.clone().add(V(0, 2.6, 0)), fov: 40 };
  },
  farina2(t, d, cue, T) {
    faSet.visible = true; lightAt(FA);
    num2.visible = false; y1709.visible = false; colonia.visible = false;
    faBottle.rotation.y = T * 0.6;
    // amanecer: el sol sube y aparecen cítricos y azahar alrededor
    const sp = easeOut(prog(t, 0, d * 0.8));
    sun.position.y = lerp(0.5, 4.0, sp); sunHalo.position.y = sun.position.y;
    const tp = cue.prim ?? d * 0.7;
    citrus.forEach((c, i) => {
      popIn(c, t, tp - 1.6 + i * 0.22, 0.6, 1);
      const a = T * 0.5 + i * (6.283 / citrus.length);
      c.position.set(Math.cos(a) * 1.9, 1.6 + (i % 3) * 0.7 + 0.15 * Math.sin(T * 2 + i), Math.sin(a) * 1.9 + 0.5);
      c.rotation.y = T + i;
    });
    setSparks(T, FA.clone().add(V(0, 2.4, 0)), 2.6, 3.6, 0xfff0a0, 0.9);
    glow.position.copy(FA).add(V(0, 3, 3)); glow.color.set(0xffd08a); glow.intensity = 7;
    const p = easeIO(t / d);
    return { pos: lerpV(FA.clone().add(V(-0.6, 2.4, 10.8)), FA.clone().add(V(0.6, 2.8, 9.6)), p), tgt: FA.clone().add(V(0, 2.8, 0)), fov: 40 };
  },
  farina3(t, d, cue, T) {
    faSet.visible = true; lightAt(FA);
    num2.visible = false; citrus.forEach(c => (c.visible = false));
    sun.position.y = 4.0; sunHalo.position.y = 4.0;
    faBottle.rotation.y = T * 0.6;
    const pc = popIn(colonia, t, (cue.col ?? d * 0.4) - 0.1, 0.7);
    colonia.position.y = 2.6 + 0.1 * Math.sin(T * 2);
    const pf = popIn(y1709, t, (cue.fab ?? d * 0.75) - 0.05, 0.6, 0.9);
    setSparks(T, FA.clone().add(V(0, 3, 0)), 3, 4, 0xffc070, 0.8);
    glow.position.copy(FA).add(V(0, 3, 3)); glow.color.set(0xffc070); glow.intensity = 6;
    const p = easeIO(t / d);
    return { pos: lerpV(FA.clone().add(V(0, 2.6, 14)), FA.clone().add(V(0, 3.0, 12.5)), p), tgt: FA.clone().add(V(0, 2.4, 0)), fov: 40 };
  },
  reina(t, d, cue, T) {
    reSet.visible = true; lightAt(RE);
    popIn(num1, t, (cue.n1 ?? 0.2) - 0.1, 0.7); num1.rotation.y = 0.25 * Math.sin(T * 0.8);
    y1533.visible = false; crown.visible = false;
    reBottle.rotation.y = T * 0.5;
    roses.forEach((r, i) => { popIn(r, t, d * 0.45 + i * 0.2, 0.6, 1); const a = T * 0.4 + i * 1.57; r.position.set(Math.cos(a) * 2.0, 1.2 + (i % 2) * 0.8, Math.sin(a) * 2.0 + 0.4); });
    setSparks(T, RE.clone().add(V(0, 2.2, 0)), 2.2, 3, 0xffb070, 0.9);
    glow.position.copy(RE).add(V(0, 2.5, 3)); glow.color.set(0xffb070); glow.intensity = 6;
    const p = easeIO(t / d);
    return { pos: lerpV(RE.clone().add(V(1, 2.6, 11)), RE.clone().add(V(-0.6, 2.9, 9.2)), p), tgt: RE.clone().add(V(0, 2.5, 0)), fov: 40 };
  },
  reina2(t, d, cue, T) {
    reSet.visible = true; lightAt(RE);
    num1.visible = false;
    reBottle.rotation.y = T * 0.5;
    popIn(y1533, t, (cue.y ?? 0.4) - 0.05, 0.6);
    const pc = popIn(crown, t, (cue.cat ?? d * 0.5) - 0.1, 0.8, 1);
    crown.position.set(0, lerp(6.5, 3.75, easeOut(prog(t, (cue.cat ?? d * 0.5) - 0.1, (cue.cat ?? d * 0.5) + 0.8))), 0); crown.rotation.y = T * 0.8;
    roses.forEach((r, i) => { r.visible = true; r.scale.setScalar(1); const a = T * 0.4 + i * 1.57; r.position.set(Math.cos(a) * 2.0, 1.2 + (i % 2) * 0.8, Math.sin(a) * 2.0 + 0.4); });
    setSparks(T, RE.clone().add(V(0, 3, 0)), 2.4, 3.6, 0xffd27a, 0.9);
    glow.position.copy(RE).add(V(0, 3.2, 3)); glow.color.set(0xffd27a); glow.intensity = 7;
    const p = easeIO(t / d);
    return { pos: lerpV(RE.clone().add(V(-0.8, 3.0, 13.5)), RE.clone().add(V(0.6, 3.2, 12.0)), p), tgt: RE.clone().add(V(0, 2.3, 0)), fov: 40 };
  },
  reina3(t, d, cue, T) {
    tlSet.visible = true; lightAt(TL);
    const p = easeIO(prog(t, 0.2, d * 0.85));
    const x = lerp(yx(1533), yx(2026), p);
    runner.position.set(x, 0.6, 0);
    tlBottles.forEach((b, i) => { b.rotation.y = T * 0.6 + i; });
    setSparks(T, TL.clone().add(V(x, 0.8, 0)), 0.6, 0.8, 0xffd27a, 1);
    glow.position.copy(TL).add(V(x, 1.5, 1.5)); glow.color.set(0xffd27a); glow.intensity = 8;
    return { pos: TL.clone().add(V(x + 1.0, 2.6, 7.5)), tgt: TL.clone().add(V(x + 0.4, 1.1, 0)), fov: 40 };
  },
  final(t, d, cue, T) {
    podSet.visible = true; lightAt(POD);
    podBottles.forEach((b, i) => { b.rotation.y = T * 0.6 + i; });
    spots.forEach((s, i) => { const x = [-2.2, 0, 2.2][i]; s.position.set(POD.x + x, 8, POD.z + 3); s.target.position.set(POD.x + x, 1, POD.z); s.intensity = 60; });
    // confeti que cae girando
    const tc = cue.cual ?? 0.4;
    let n = 0;
    for (let i = 0; i < CONF; i++) {
      const [x, z, sp, ph, dl] = confSeed[i], a = t - (tc - 0.3 + dl * 1.2);
      if (a < 0) continue;
      const y = 8 - a * (1.4 + sp * 1.2);
      if (y < 0.05) continue;
      _e.set(a * 4 + ph, a * 3 + ph, a * 2);
      _q.setFromEuler(_e);
      _m.compose(V(POD.x + x + 0.4 * Math.sin(a * 2 + ph), y, POD.z + z), _q, V(1, 1, 1));
      confetti.setMatrixAt(n, _m); confetti.setColorAt(n, new THREE.Color([0xff4f9a, 0xffd23a, 0x4adfff, 0x9b6bff, 0x5aff8a, 0xff8a3a][i % 6])); n++;
    }
    confetti.count = n; confetti.instanceMatrix.needsUpdate = true; confetti.instanceColor.needsUpdate = true;
    setSparks(T, POD.clone().add(V(0, 2.5, 0)), 3.5, 4, 0xffd0f0, 0.8);
    const a = lerp(-0.3, 0.3, easeIO(t / d));
    return { pos: V(POD.x + Math.sin(a) * 15.5, 3.8, POD.z + Math.cos(a) * 15.5), tgt: POD.clone().add(V(0, 2.0, 0)), fov: 40 };
  },
};

function segAt(t) { const S = timeline.segments; for (let i = 0; i < S.length; i++) if (t < S[i].end || i === S.length - 1) return S[i]; }
const ALL_BOTTLES = [...heroBottles, jkBottle, faBottle, reBottle, ...tlBottles, ...podBottles];

window.renderAt = t => {
  resetWorld();
  const seg = segAt(t);
  const lt = t - seg.start, d = seg.end - seg.start;
  const cue = {};
  for (const [k, v] of Object.entries(seg.cues || {})) cue[k] = v - seg.start;
  const pal = PALETA[seg.scene] || PALETA.gancho;
  skyMat.uniforms.top.value.set(pal[0]); skyMat.uniforms.bot.value.set(pal[1]); scene.fog.color.set(pal[1]);
  const sh = SCENES[seg.scene](lt, d, cue, t);
  ALL_BOTTLES.forEach(updateLiquid);
  bokeh.material.color.set(pal[2]);
  { const P = bokeh.geometry.attributes.position; for (let i = 0; i < 70; i++) { const [x, y, z, ph] = bokSeed[i]; P.setXYZ(i, sh.tgt.x + x + 0.5 * Math.sin(t * 0.4 + ph), y + 0.4 * Math.sin(t * 0.5 + ph * 2), sh.tgt.z + z); } P.needsUpdate = true; }
  { const P = dust.geometry.attributes.position; for (let i = 0; i < 220; i++) { const [x, y, z, ph] = dustSeed[i]; P.setXYZ(i, sh.tgt.x + x + Math.sin(t * 0.3 + ph) * 0.6, (y + t * 0.15) % 7, sh.tgt.z + z + Math.cos(t * 0.25 + ph) * 0.6); } P.needsUpdate = true; }
  camera.position.copy(sh.pos).add(V(Math.sin(t * 1.3) * 0.04, Math.sin(t * 1.7 + 1) * 0.03, Math.cos(t * 1.1) * 0.04));
  camera.fov = sh.fov * (1 - 0.07 * (1 - easeOut(lt / 0.45)));
  camera.updateProjectionMatrix();
  camera.lookAt(sh.tgt);
  sky.position.copy(camera.position); stars.position.copy(camera.position);
  renderer.render(scene, camera);
  return renderer.domElement.toDataURL('image/jpeg', 0.95);
};
window.ready = true;

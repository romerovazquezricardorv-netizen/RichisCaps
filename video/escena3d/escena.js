// Escenas 3D del video "El tablero que arruinó a un rey".
// La página expone window.renderAt(t) -> dataURL JPEG del cuadro en el segundo t.
// Todo es función pura del tiempo, para poder renderizar cuadros en paralelo.
import * as THREE from 'three';

const W = 1080, H = 1920;
const timeline = await (await fetch(new URLSearchParams(location.search).get('tl') || '/build/ajedrez/timeline.json')).json();

const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1);
renderer.setSize(W, H);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 30000);
const FOG = new THREE.Color(0x0b1233);
scene.fog = new THREE.Fog(FOG, 25, 75);

// ------------------------------------------------------------------ utilidades
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const prog = (t, a, b) => clamp((t - a) / Math.max(1e-6, b - a));
const easeIO = x => { x = clamp(x); return x * x * (3 - 2 * x); };
const easeOut = x => { x = clamp(x); return 1 - Math.pow(1 - x, 3); };
const easeIn = x => { x = clamp(x); return x * x * x; };
const lerp = (a, b, p) => a + (b - a) * p;
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const lerpV = (a, b, p) => a.clone().lerp(b, p);
function rng(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
const sqPos = i => V((i % 8) - 3.5, 0, 3.5 - Math.floor(i / 8));

// ------------------------------------------------------------------ cielo y estrellas
const skyMat = new THREE.ShaderMaterial({
  side: THREE.BackSide, depthWrite: false,
  uniforms: { top: { value: new THREE.Color(0x232a78) }, bot: { value: FOG.clone() }, space: { value: 0 } },
  vertexShader: `varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }`,
  fragmentShader: `uniform vec3 top, bot; uniform float space; varying vec3 vP;
    void main(){ float h = clamp(vP.y*0.5+0.5,0.,1.); vec3 c = mix(bot, top, smoothstep(0.5,0.95,h));
      c = mix(c, vec3(0.004,0.005,0.018), space); gl_FragColor = vec4(c,1.); }`,
});
const sky = new THREE.Mesh(new THREE.SphereGeometry(20000, 32, 16), skyMat);
sky.renderOrder = -1;
scene.add(sky);

const starGeo = new THREE.BufferGeometry();
{
  const r = rng(3), p = [];
  for (let i = 0; i < 1800; i++) {
    const u = r() * 2 - 1, a = r() * Math.PI * 2, y = Math.abs(u) * 0.9 + 0.08, s = Math.sqrt(1 - y * y);
    p.push(Math.cos(a) * s * 15000, y * 15000, Math.sin(a) * s * 15000);
  }
  starGeo.setAttribute('position', new THREE.Float32BufferAttribute(p, 3));
}
const starMat = new THREE.PointsMaterial({ color: 0xdfe6ff, size: 2.2, sizeAttenuation: false, transparent: true, opacity: 0.4, fog: false });
const stars = new THREE.Points(starGeo, starMat);
scene.add(stars);

// polvo flotante cerca del tablero
const dustGeo = new THREE.BufferGeometry();
const DUSTN = 260, dustBase = [];
{ const r = rng(11); for (let i = 0; i < DUSTN; i++) dustBase.push([r() * 30 - 15, r() * 8, r() * 30 - 15, r() * 6.28]); }
dustGeo.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(DUSTN * 3), 3));
const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: 0x9fb4ff, size: 0.05, transparent: true, opacity: 0.6 }));
scene.add(dust);

// ------------------------------------------------------------------ luces
scene.add(new THREE.HemisphereLight(0x7f95ff, 0x0b0f25, 0.9));
const key = new THREE.DirectionalLight(0xfff1dd, 2.6);
key.position.set(-6, 12, 8);
key.castShadow = true;
key.shadow.mapSize.set(1024, 1024);
Object.assign(key.shadow.camera, { left: -11, right: 11, top: 11, bottom: -11, near: 1, far: 40 });
key.shadow.bias = -0.0006;
scene.add(key);
const rim = new THREE.DirectionalLight(0x6f8cff, 1.8);
rim.position.set(6, 5, -10);
scene.add(rim);
const goldLight = new THREE.PointLight(0xffb347, 0, 14, 1.6);
scene.add(goldLight);

// ------------------------------------------------------------------ suelo
const ground = new THREE.Mesh(new THREE.PlaneGeometry(4000, 4000),
  new THREE.MeshStandardMaterial({ color: 0x0a1030, roughness: 0.92 }));
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.6;
ground.receiveShadow = true;
scene.add(ground);
const grid = new THREE.GridHelper(400, 200, 0x2a3a90, 0x1a2462);
grid.position.y = -0.595;
grid.material.transparent = true;
grid.material.opacity = 0.35;
scene.add(grid);

// ------------------------------------------------------------------ tablero
const frame = new THREE.Mesh(new THREE.BoxGeometry(8.9, 0.5, 8.9),
  new THREE.MeshStandardMaterial({ color: 0x0f1638, roughness: 0.35, metalness: 0.4 }));
frame.position.y = -0.35;
frame.castShadow = frame.receiveShadow = true;
scene.add(frame);
const tiles = [];
const TILE_GOLD = new THREE.Color(0xf2b544);
const tileGeo = new THREE.BoxGeometry(0.98, 0.22, 0.98);
for (let i = 0; i < 64; i++) {
  const p = sqPos(i), light = ((i % 8) + Math.floor(i / 8)) % 2 === 1;
  const m = new THREE.Mesh(tileGeo, new THREE.MeshStandardMaterial({
    color: light ? 0xd3dbff : 0x1c2758, roughness: light ? 0.28 : 0.35, metalness: 0.05, emissive: 0xffb02e, emissiveIntensity: 0,
  }));
  m.position.set(p.x, -0.11, p.z);
  m.userData.base = new THREE.Color(light ? 0xd3dbff : 0x1c2758);
  m.castShadow = m.receiveShadow = true;
  scene.add(m);
  tiles.push(m);
}

// ------------------------------------------------------------------ reyes (torno)
function kingGeometry() {
  const prof = [[0, 0], [0.42, 0], [0.42, 0.05], [0.38, 0.08], [0.36, 0.12], [0.3, 0.14], [0.26, 0.18], [0.22, 0.25],
    [0.17, 0.45], [0.15, 0.6], [0.22, 0.62], [0.23, 0.655], [0.15, 0.68], [0.16, 0.72], [0.21, 0.8], [0.225, 0.84],
    [0.19, 0.87], [0.08, 0.885], [0, 0.89]].map(([r, y]) => new THREE.Vector2(r, y));
  return new THREE.LatheGeometry(prof, 64);
}
function makeKing(color, rough) {
  const mat = new THREE.MeshPhysicalMaterial({ color, roughness: rough, clearcoat: 1, clearcoatRoughness: 0.12, metalness: 0.05 });
  const g = new THREE.Group();
  const body = new THREE.Mesh(kingGeometry(), mat);
  const c1 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.17, 0.06), mat); c1.position.y = 0.965;
  const c2 = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.055, 0.06), mat); c2.position.y = 0.975;
  [body, c1, c2].forEach(m => { m.castShadow = m.receiveShadow = true; g.add(m); });
  return g;
}
const KS = 2.6, KPOS = V(5.5, -0.6, 2.3);
const kingPivot = new THREE.Group();          // gira sobre el borde de la base para caer
const king = makeKing(0xeef1ff, 0.2);
king.scale.setScalar(KS);
king.position.set(-0.42 * KS, 0, 0);
kingPivot.add(king);
kingPivot.position.set(KPOS.x + 0.42 * KS, KPOS.y, KPOS.z);
scene.add(kingPivot);
const blackKing = makeKing(0x171b33, 0.25);
blackKing.scale.setScalar(KS);
blackKing.position.set(-5.5, -0.6, -2.3);
scene.add(blackKing);

// ------------------------------------------------------------------ granos (casillas 1 a 10)
const GOLD = 0xe8b04a;
const grainMat = new THREE.MeshStandardMaterial({ color: GOLD, roughness: 0.45, metalness: 0.15 });
const NGRAINS = 1023;
const grains = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.032, 1), grainMat, NGRAINS);
grains.castShadow = true;
grains.receiveShadow = true;
grains.frustumCulled = false;
scene.add(grains);
const grainInfo = []; // {sq, j, pos, rotY}
{
  const r = rng(5);
  for (let k = 0; k < 10; k++) {
    const n = 2 ** k, c = sqPos(k), maxH = 0.035 * Math.cbrt(n);
    for (let j = 0; j < n; j++) {
      const rr = 0.36 * Math.sqrt(r()), a = r() * 6.283;
      const y = 0.03 + (n === 1 ? 0 : maxH * (1 - rr / 0.4) * Math.sqrt(r()));
      grainInfo.push({ sq: k, j, n, pos: V(c.x + Math.cos(a) * rr, y, c.z + Math.sin(a) * rr), rotY: r() * 6.28, tilt: r() * 0.6 });
    }
  }
}
const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _s = V(1.55, 0.9, 0.9), _p = V(0, 0, 0);
// dropTime(sq) -> segundo local en que empieza a caer esa casilla (o -1 si no se muestra)
function setGrains(t, dropTime, upto) {
  let count = 0;
  for (const g of grainInfo) {
    if (g.sq >= upto) break;
    const t0 = dropTime(g.sq);
    if (t0 === null) continue;
    const st = t0 + (g.n > 1 ? 0.5 * g.j / g.n : 0);
    const p = prog(t, st, st + 0.45);
    if (p <= 0) continue;
    _p.copy(g.pos);
    _p.y += 2.5 * Math.pow(1 - p, 2);
    _e.set(g.tilt, g.rotY + (1 - p) * 4, 0);
    _q.setFromEuler(_e);
    _m.compose(_p, _q, _s);
    grains.setMatrixAt(count++, _m);
  }
  grains.count = count;
  grains.instanceMatrix.needsUpdate = true;
}

// ------------------------------------------------------------------ montones (cono con textura rugosa)
function heapGeometry(seed, seg = 48) {
  const g = new THREE.ConeGeometry(1, 1, seg, 10, true);
  g.translate(0, 0.5, 0);
  const pos = g.attributes.position;
  // ruido según ángulo y altura (no por vértice) para que la costura del cono no se abra
  const hash = (a, b) => { const x = Math.sin(a * 127.1 + b * 311.7 + seed * 74.7) * 43758.5453; return x - Math.floor(x); };
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    if (y < 0.995) {
      let ang = Math.atan2(pos.getZ(i), pos.getX(i));
      if (ang < -Math.PI + 1e-3) ang += 2 * Math.PI;
      const ka = Math.round(ang * 1000) % Math.round(2 * Math.PI * 1000), ky = Math.round(y * 100);
      const r = () => hash(ka, ky);
      const f = 1 + (r() - 0.5) * 0.12 * (1 - y);
      pos.setX(i, pos.getX(i) * f);
      pos.setZ(i, pos.getZ(i) * f);
      pos.setY(i, y + (hash(ky, ka) - 0.5) * 0.02);
    }
  }
  g.computeVertexNormals();
  return g;
}
const heapMat = new THREE.MeshStandardMaterial({ color: GOLD, roughness: 0.7, metalness: 0.1, flatShading: true });
const heaps = [];
for (let k = 10; k < 20; k++) {
  const m = new THREE.Mesh(heapGeometry(k), heapMat);
  const c = sqPos(k), Hh = 0.035 * Math.cbrt(2 ** k);
  m.userData = { H: Hh, R: Hh * 1.25 };
  m.position.set(c.x, 0, c.z);
  m.castShadow = m.receiveShadow = true;
  scene.add(m);
  heaps.push(m);
}
const MH = 0.035 * Math.cbrt(2 ** 31);
const mountain = new THREE.Mesh(heapGeometry(99, 96), heapMat);
mountain.position.set(3.5, -0.6, -4.6 - MH * 1.25);
mountain.castShadow = true;
scene.add(mountain);

// ------------------------------------------------------------------ columna de la casilla 64
const columnMat = new THREE.MeshStandardMaterial({ color: GOLD, roughness: 0.5, metalness: 0.2, emissive: 0x6b3b00, emissiveIntensity: 0.5 });
const colGeo = new THREE.BoxGeometry(0.96, 1, 0.96); colGeo.translate(0, 0.5, 0);
const column = new THREE.Mesh(colGeo, columnMat);
column.position.copy(sqPos(63));
column.castShadow = true;
scene.add(column);

// ------------------------------------------------------------------ 1000 cubos (años de cosecha)
const cubes = new THREE.InstancedMesh(new THREE.BoxGeometry(0.42, 0.42, 0.42),
  new THREE.MeshStandardMaterial({ color: GOLD, roughness: 0.4, metalness: 0.25, emissive: 0x3a2000, emissiveIntensity: 0.6 }), 1000);
cubes.castShadow = true;
cubes.frustumCulled = false;
scene.add(cubes);
const cubeInfo = [];
{
  const r = rng(21);
  for (let i = 0; i < 1000; i++) {
    const x = i % 10, y = Math.floor(i / 100), z = Math.floor(i / 10) % 10;
    const a = r() * 6.28, b = r() * 1.2 + 0.2;
    cubeInfo.push({ to: V((x - 4.5) * 0.5, y * 0.5 + 0.25, (z - 4.5) * 0.5),
      from: V(Math.cos(a) * 30 * Math.cos(b), 18 * Math.sin(b) + 4, Math.sin(a) * 30 * Math.cos(b)), d: y * 0.06 + r() * 0.5, spin: r() * 6 });
  }
}

// ------------------------------------------------------------------ barras exponenciales
const bars = new THREE.InstancedMesh((() => { const g = new THREE.BoxGeometry(0.8, 1, 0.8); g.translate(0, 0.5, 0); return g; })(),
  new THREE.MeshStandardMaterial({ roughness: 0.35, metalness: 0.2, emissive: 0x301800, emissiveIntensity: 0.6 }), 64);
bars.castShadow = true;
bars.frustumCulled = false;
for (let i = 0; i < 64; i++) {
  const c = new THREE.Color(GOLD).lerp(new THREE.Color(0xff5a2a), Math.pow(i / 63, 3));
  bars.setColorAt(i, c);
}
scene.add(bars);

// ------------------------------------------------------------------ estado por escena
function resetWorld() {
  grains.count = 0;
  heaps.forEach(h => (h.visible = false));
  mountain.visible = column.visible = cubes.visible = bars.visible = false;
  tiles.forEach(t => (t.material.emissiveIntensity = 0));
  kingPivot.rotation.set(0, 0, 0);
  kingPivot.visible = blackKing.visible = true;
  skyMat.uniforms.space.value = 0;
  starMat.opacity = 0.4;
  scene.fog.near = 25; scene.fog.far = 75;
  goldLight.intensity = 0;
}

function setHeap(h, s) {
  const { H: Hh, R } = h.userData;
  h.visible = s > 0.001;
  h.scale.set(R * s, Hh * s, R * s);
}

function shake(t, amp) {
  return V(Math.sin(t * 1.3) * amp, Math.sin(t * 1.7 + 1) * amp * 0.7, Math.cos(t * 1.1) * amp);
}

const SCENES = {
  gancho(t, d) {
    const p = easeIO(t / d);
    const pos = lerpV(V(-2, 15, 11), V(8.2, 0.9, 7.4), p);
    const tgt = lerpV(V(0, 0, 0), V(5.4, 1.4, 2.3), easeIO(prog(t, 0, d * 0.9)));
    return { pos, tgt, fov: 40 };
  },
  pago(t, d) {
    const a = lerp(-0.9, -0.2, easeIO(t / d));
    const c = V(2.6, 0.9, 1.2);
    return { pos: V(c.x + Math.sin(a) * 13, 5.2, c.z + Math.cos(a) * 13), tgt: c, fov: 40 };
  },
  granos(t, d, cue) {
    const cs = ['g1', 'g2', 'g3', 'g4'].map(k => cue[k]);
    setGrains(t, k => (k < 4 ? cs[k] : null), 4);
    cs.forEach((c, k) => { tiles[k].material.emissiveIntensity = t >= c ? 1 + 1.5 * Math.exp(-(t - c) * 3) : 0; });
    const p = easeIO(t / d);
    return { pos: V(lerp(-3.6, -0.6, p), 1.7, 5.9), tgt: V(lerp(-3.4, -1.1, p), 0, 3.3), fov: 36 };
  },
  duplicar(t, d) {
    setGrains(t, k => (k < 4 ? -10 : null), 4);
    const w = 64 * easeIO(prog(t, 0.2, d * 0.95));
    tiles.forEach((m, i) => { m.material.emissiveIntensity = i < w ? (w - i < 3 ? 2 : 0.95) : 0; });
    const p = easeIO(t / d);
    return { pos: lerpV(V(-3.5, 1.6, 6.2), V(0.5, 14, 10), p), tgt: lerpV(V(-2, 0, 3), V(0, 0, -0.5), p), fov: 40 };
  },
  risa(t, d) {
    setGrains(t, k => (k < 4 ? -10 : null), 4);
    const p = easeIO(t / d);
    kingPivot.rotation.z = 0.025 * Math.sin(t * 14) * Math.exp(-((t % 1.4) * 2));
    return { pos: lerpV(V(12.5, 2.4, 9.6), V(11.2, 2.2, 8.4), p), tgt: V(5.0, 1.3, 2.0), fov: 38 };
  },
  c10(t, d) {
    setGrains(t, k => (k < 4 ? -10 : 0.1 + (k - 4) * 0.22), 10);
    tiles[9].material.emissiveIntensity = 1.2 + 0.6 * Math.sin(t * 6);
    goldLight.position.set(-2.5, 1.5, 3.5); goldLight.intensity = 6;
    const p = easeIO(t / d);
    return { pos: lerpV(V(-0.4, 3.6, 7.6), V(-0.9, 3.0, 6.6), p), tgt: V(-2.0, 0, 2.6), fov: 38 };
  },
  c20(t, d) {
    setGrains(t, () => -10, 10);
    heaps.forEach((h, i) => setHeap(h, easeOut(prog(t, 0.1 + i * 0.13, 0.5 + i * 0.13))));
    tiles[19].material.emissiveIntensity = 1.2;
    goldLight.position.set(-0.5, 4, 5); goldLight.intensity = 10;
    const p = easeIO(t / d);
    return { pos: lerpV(V(7, 5.5, 17), V(9, 6.5, 19), p), tgt: V(0.5, 1.4, 0.5), fov: 40 };
  },
  c32(t, d, cue) {
    setGrains(t, () => -10, 10);
    heaps.forEach(h => setHeap(h, 1));
    const g = easeOut(prog(t, 0.3, 2.0));
    mountain.visible = true;
    mountain.scale.set(MH * 1.25 * g, MH * g, MH * 1.25 * g);
    tiles[31].material.emissiveIntensity = 1.2;
    scene.fog.near = 60; scene.fog.far = 900;
    const p = easeIO(prog(t, 0.2, d));
    return { pos: lerpV(V(9, 3, 16), V(16, 2.5, 38), p), tgt: lerpV(V(1, 1.5, 0), V(3, 24, -40), p), fov: 44 };
  },
  c64(t, d) {
    setGrains(t, () => -10, 10);
    heaps.forEach(h => setHeap(h, 1));
    column.visible = true;
    const grow = easeIO(prog(t, 0.0, d * 0.85));
    column.scale.set(1, lerp(0.01, 9000, Math.pow(grow, 2.2)), 1);
    tiles[63].material.emissiveIntensity = 2;
    const rise = Math.pow(easeIO(prog(t, 0.6, d)), 2.6);
    const y = lerp(1.5, 7000, rise);
    skyMat.uniforms.space.value = clamp((y - 150) / 1500);
    starMat.opacity = 0.4 + 0.6 * skyMat.uniforms.space.value;
    scene.fog.near = 30 + y; scene.fog.far = 120 + y * 3;
    const c = sqPos(63);
    const dist = lerp(6, 40, rise);
    return { pos: V(c.x + dist * 0.55, y, c.z + dist), tgt: V(c.x, y + lerp(2, 260, rise), c.z), fov: 42 };
  },
  total(t, d, cue) {
    kingPivot.visible = blackKing.visible = true;
    cubes.visible = true;
    const k0 = 0.1, k1 = d * 0.75;
    for (let i = 0; i < 1000; i++) {
      const c = cubeInfo[i];
      const p = easeOut(prog(t, k0 + c.d * (k1 - k0) / 1.1, k0 + c.d * (k1 - k0) / 1.1 + 0.9));
      _p.copy(c.from).lerp(c.to, p);
      _e.set(c.spin * (1 - p), c.spin * (1 - p) * 0.7, 0);
      _q.setFromEuler(_e);
      _m.compose(_p, _q, V(1, 1, 1).multiplyScalar(0.3 + 0.7 * p));
      cubes.setMatrixAt(i, _m);
    }
    cubes.instanceMatrix.needsUpdate = true;
    goldLight.position.set(0, 7, 6); goldLight.intensity = 14;
    const a = lerp(0.5, 1.1, easeIO(t / d));
    return { pos: V(Math.sin(a) * 17, 8.5, Math.cos(a) * 17), tgt: V(0, 2.2, 0), fov: 40 };
  },
  expo(t, d, cue) {
    bars.visible = true;
    const k = 64 * easeIO(prog(t, 0.2, d * 0.78));
    for (let i = 0; i < 64; i++) {
      const g = clamp(k - i);
      const h = Math.max(0.04, 16 * Math.pow(2, i - 63)) * easeOut(g);
      const c = sqPos(i);
      _m.compose(V(c.x, 0, c.z), _q.identity(), V(1, Math.max(0.0001, h), 1));
      bars.setMatrixAt(i, _m);
    }
    bars.instanceMatrix.needsUpdate = true;
    const p = easeIO(t / d);
    return { pos: lerpV(V(-12, 2.2, 8.5), V(-11, 6, 13), p), tgt: lerpV(V(0.5, 1.2, -1), V(1.5, 5, -2), p), fov: 42 };
  },
  final(t, d, cue) {
    const tc = cue.cae ?? d * 0.6;
    const p = prog(t, tc - 0.1, tc + 1.1);
    let ang = (Math.PI / 2 - 0.05) * easeIn(p);
    if (p >= 1) ang += 0.04 * Math.exp(-(t - tc - 1.1) * 6) * Math.sin((t - tc - 1.1) * 30);
    kingPivot.rotation.z = -ang;
        const q = easeIO(t / d);
    return { pos: lerpV(V(11.5, 0.8, 9.5), V(10.5, 0.9, 7.8), q), tgt: V(6.3, 0.9, 2.3), fov: 40 };
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
  tiles.forEach(m => { const v = m.material.emissiveIntensity; m.material.color.copy(m.userData.base).lerp(TILE_GOLD, clamp(v * 1.1)); m.material.emissiveIntensity = v * 0.25; });
  const pos = sh.pos.clone().add(shake(t, 0.05 * (1 + sh.pos.y / 40)));
  camera.position.copy(pos);
  camera.fov = sh.fov * (1 - 0.07 * (1 - easeOut(lt / 0.45)));   // "punch" de zoom al cortar
  camera.updateProjectionMatrix();
  camera.lookAt(sh.tgt);
  sky.position.copy(camera.position);
  stars.position.copy(camera.position);
  // polvo
  const a = dust.geometry.attributes.position;
  for (let i = 0; i < DUSTN; i++) {
    const [x, y, z, ph] = dustBase[i];
    a.setXYZ(i, x + Math.sin(t * 0.3 + ph) * 0.6, ((y + t * 0.15) % 8) - 0.5, z + Math.cos(t * 0.25 + ph) * 0.6);
  }
  a.needsUpdate = true;
  renderer.render(scene, camera);
  return renderer.domElement.toDataURL('image/jpeg', 0.95);
};
window.ready = true;

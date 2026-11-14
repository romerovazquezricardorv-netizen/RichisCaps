// ================================================================== ¿CUÁNTAS FLORES PARA UN PERFUME?
Object.assign(PALG, { fl1: [0xff9ad0, 0xe0508a], amanecer: [0xffd27a, 0xff7a4a], dia: [0x7ad0ff, 0x3a8ae0], jaz: [0x9ae08a, 0x3aa05a], fl5: [0xc89aff, 0x7a4ad8] });
const FIELD = V(60, 0, 410);
// montaña de pétalos (instanciada; color por pétalo)
const PETN = 2600;
const petalGrad = (() => { const tx = new THREE.DataTexture(new Uint8Array([90, 175, 255]), 3, 1, THREE.RedFormat); tx.minFilter = tx.magFilter = THREE.NearestFilter; tx.needsUpdate = true; return tx; })();
const petalMat = new THREE.MeshToonMaterial({ color: 0xffffff, gradientMap: petalGrad }); petalMat.userData.outlineParameters = { visible: false };
const petals = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 8, 6), petalMat, PETN); petals.frustumCulled = false; scene.add(petals);
const petSeed = []; { const r = rng(515); const cols = [0xff4f7a, 0xff7aa0, 0xe8325f, 0xff9ab8, 0xd82a5a];
  for (let i = 0; i < PETN; i++) { const h = Math.pow(r(), 1.6), ang = r() * 6.283, rad = (1 - h) * Math.sqrt(r()); petSeed.push([ang, rad, h, r() * 6.28, r()]); petals.setColorAt(i, new THREE.Color(cols[i % 5])); } }
// grow 0..1; c centro; R radio; Hh alto; tint: color opcional (jazmín)
function setPetals(c, grow, R = 3.0, Hh = 3.4, white = false) { let n = 0; const N = Math.floor(PETN * clamp(grow));
  for (let i = 0; i < N; i++) { const [a, rr, h, rot, k] = petSeed[i]; _m.compose(V(c.x + Math.cos(a) * rr * R, c.y + h * Hh + 0.05, c.z + Math.sin(a) * rr * R), _q.setFromEuler(new THREE.Euler(rot, a, rot * 0.5)), V(0.2, 0.05, 0.14));
    petals.setMatrixAt(n, _m); if (white) petals.setColorAt(n, new THREE.Color(k < 0.5 ? 0xffffff : 0xfff6d8)); n++; }
  petals.count = n; petals.visible = n > 0; petals.instanceMatrix.needsUpdate = true; if (petals.instanceColor) petals.instanceColor.needsUpdate = true; }
function petalColorsRose() { const cols = [0xff4f7a, 0xff7aa0, 0xe8325f, 0xff9ab8, 0xd82a5a]; for (let i = 0; i < PETN; i++) petals.setColorAt(i, new THREE.Color(cols[i % 5])); }
const vial = makeBottle(0xffb0c8, '1 kg'); scene.add(vial);
const oilDrop = new THREE.Mesh(new THREE.SphereGeometry(0.2, 24, 16), new THREE.MeshStandardMaterial({ color: 0xffc0d0 })); oilDrop.scale.y = 1.3; scene.add(oilDrop);
// campo de rosales
const field = new THREE.Group();
{ const soil = new THREE.Mesh(new THREE.BoxGeometry(14, 0.2, 10), new THREE.MeshStandardMaterial({ color: 0x8a5a34 })); soil.position.y = 0.1; field.add(soil);
  for (let row = 0; row < 4; row++) for (let k = 0; k < 7; k++) { const bush = new THREE.Group(); const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.55, 14, 10), new THREE.MeshStandardMaterial({ color: 0x3aa05a })); leaf.scale.y = 0.75; leaf.position.y = 0.55; bush.add(leaf);
    for (let j = 0; j < 4; j++) { const fl = new THREE.Mesh(new THREE.SphereGeometry(0.13, 10, 8), new THREE.MeshStandardMaterial({ color: j % 2 ? 0xff4f7a : 0xff7aa0 })); fl.position.set(Math.cos(j * 1.6) * 0.42, 0.8 + (j % 2) * 0.15, Math.sin(j * 1.6) * 0.42); bush.add(fl); }
    bush.position.set((k - 3) * 1.6 + (row % 2) * 0.8, 0.2, -row * 1.5); field.add(bush); } }
field.position.copy(FIELD); scene.add(field);
const sunDisc = new THREE.Mesh(new THREE.CircleGeometry(1.2, 40), new THREE.MeshBasicMaterial({ color: 0xffe36a })); scene.add(sunDisc);
const basket = new THREE.Group(); { const b = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.35, 0.45, 20, 1, true), new THREE.MeshStandardMaterial({ color: 0xb8864a, side: THREE.DoubleSide })); basket.add(b);
  const h = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.04, 8, 24, Math.PI), new THREE.MeshStandardMaterial({ color: 0xb8864a })); h.position.y = 0.2; basket.add(h);
  for (let i = 0; i < 8; i++) { const p = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 6), new THREE.MeshStandardMaterial({ color: 0xff5f8a })); p.position.set(Math.cos(i) * 0.25, 0.2, Math.sin(i) * 0.25); basket.add(p); } }
const coinStack = new THREE.Group(); { for (let i = 0; i < 12; i++) { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.1, 32), new THREE.MeshStandardMaterial({ color: 0xffc83a })); c.position.set((i % 3 - 1) * 0.95, 0.06 + Math.floor(i / 3) * 0.11, 0); coinStack.add(c); } }
scene.add(coinStack);
SETS.push(petals, vial, oilDrop, field, sunDisc, coinStack);
const _resetX = resetWorld;
resetWorld = function () { _resetX(); you.userData.hand.remove(basket); vial.scale.setScalar(1); petalColorsRose(); };
// guion: el sombrerito (docHat) sirve de sombrero de campesino? no: se usa un pañuelo
const SCENES = {
  gancho(t, d, cue, T) {
    const tk = cue.kilo ?? d * 0.2, tt = cue.toneladas ?? d * 0.7;
    ped(DUO2); ground.visible = true;
    const pv = spring(prog(t, tk - 0.3, tk + 0.2));
    vial.visible = true; vial.scale.setScalar(0.35 * Math.max(0.001, pv)); vial.position.copy(DUO2).add(V(t > tt - 0.4 ? 2.4 : 0, 0.18, t > tt - 0.4 ? 1.6 : 0)); vial.rotation.y = 0.3 * Math.sin(T);
    const grow = easeOut(prog(t, tt - 0.6, tt + 0.6));
    setPetals(DUO2.clone().add(V(-0.4, 0, -0.6)), grow, 3.2, 3.8);
    you.scale.setScalar(0.6); you.position.copy(DUO2).add(V(2.0, 0, 2.0)); you.visible = t > tt - 0.2;
    if (you.visible) pose(you, { hop: hopF(T, 3, 0.05), mood: 'o', mouthOpen: 1.3, eye: 1.45, look: [-0.8, 0.8], blink: 1, brow: 1, rotY: -0.6, armL: 2.3, armR: 2.3 });
    const k = easeOut(prog(t, tt - 0.6, tt + 0.6));
    return { pos: lerpV(DUO2.clone().add(V(0, 1.2, 3.6)), DUO2.clone().add(V(0.6, 5.4, 13.0)), k), tgt: lerpV(DUO2.clone().add(V(0, 0.6, 0)), DUO2.clone().add(V(0.2, 2.2, 0)), k), fov: 40, pal: 'fl1' };
  },
  rosas(t, d, cue, T) {
    const tm = cue.millon ?? d * 0.15, ta = cue.amanecer ?? d * 0.5, tc = cue.calor ?? d * 0.85;
    lightAt(FIELD); field.visible = true; ground.visible = true;
    // el sol sale al amanecer y sube con el calor
    const up = easeIO(prog(t, 0, d));
    sunDisc.visible = true; sunDisc.position.copy(FIELD).add(V(3.5, lerp(1.0, 7.0, up), -9)); sunDisc.scale.setScalar(lerp(1.2, 0.9, up));
    you.scale.setScalar(0.75); you.position.copy(FIELD).add(V(lerp(-2.6, 0.6, easeIO(prog(t, 0.3, tc))), 0.2, 1.2)); you.userData.hand.add(basket); basket.visible = true; basket.position.set(0.15, -0.35, 0.15); basket.scale.setScalar(0.9);
    const hot = t > tc - 0.2;
    pose(you, { hop: Math.abs(Math.sin(T * 6)) * 0.08, mood: hot ? 'frown' : 'smile', eye: hot ? 0.8 : 1.1, look: [0.6, -0.4], blink: blinkAt(T, 0.3), rotY: 0.5, armR: 0.9 });
    if (hot) { sweat.forEach((s2, i) => { const a = (T * 1.1 + i / 6) % 1; s2.visible = true; s2.position.copy(you.position).add(V((i % 2 ? 0.45 : -0.45), 1.8 - a * 0.6, 0.3)); s2.scale.setScalar(0.5); }); }
    return { pos: FIELD.clone().add(V(0.4, 3.4, 8.6)), tgt: FIELD.clone().add(V(0.2, 1.6, -1.0)), fov: 40, pal: t < ta + 1.0 ? 'amanecer' : 'dia' };
  },
  jazmin(t, d, cue, T) {
    const tj = cue.jazmin ?? d * 0.1, tk = cue.kilo2 ?? d * 0.5, ts = cue.siete ?? d * 0.8;
    ped(DUO2); ground.visible = true;
    const g = easeOut(prog(t, tj, ts + 0.6));
    setPetals(DUO2.clone().add(V(-0.3, 0.18, -0.5)), 0.25 + 0.75 * g, 2.6, 2.8 * (0.4 + 0.6 * g), true);
    const pv = spring(prog(t, tk - 0.2, tk + 0.3));
    oilDrop.visible = pv > 0.01; oilDrop.material.color.set(0xfff6c8); oilDrop.scale.set(Math.max(0.001, pv), 1.3 * Math.max(0.001, pv), Math.max(0.001, pv)); oilDrop.position.copy(DUO2).add(V(1.8, 1.0 + 0.1 * Math.sin(T * 3), 1.4));
    pal.scale.setScalar(0.6); pal.position.copy(DUO2).add(V(2.0, 0, 1.6));
    pose(pal, { hop: hopF(T, 3, 0.05), mood: t > ts ? 'o' : 'smile', mouthOpen: 1.2, eye: t > ts ? 1.4 : 1.1, look: [-0.8, 0.6], blink: 1, brow: t > ts ? 0.9 : 0, rotY: -0.6, armL: t > ts ? 2.2 : 0.3, armR: t > ts ? 2.2 : 0.3 });
    return { ...sh(DUO2, V(0.4, 4.0, 10.6), V(0.3, 1.6, 0)), pal: 'jaz' };
  },
  caro(t, d, cue, T) {
    const tm = cue.miles ?? d * 0.35, ts = cue.sint ?? d * 0.85;
    ped(DUO2); ground.visible = true;
    if (t < ts - 0.15) {
      oilDrop.visible = true; oilDrop.material.color.set(0xffb0c8); oilDrop.scale.set(1.4, 1.8, 1.4); oilDrop.position.copy(DUO2).add(V(-0.9, 0.6, 0.2));
      coinStack.visible = t > tm - 0.2; coinStack.position.copy(DUO2).add(V(0.9, 0.18, 0.2)); coinStack.scale.set(1, Math.max(0.001, easeOut(prog(t, tm - 0.2, tm + 0.6))) * 1.4, 1);
      sparks.visible = true; setSparks(T, DUO2.clone().add(V(0, 1.2, 0)), 1.6, 2, 0xffd23a, 0.6);
      return { ...sh(DUO2, V(0, 2.4, 7.6), V(0, 1.1, 0)), pal: 'fl1' };
    }
    flask.visible = true; flask.position.copy(DUO2).add(V(0, 0.18, 0)); flask.scale.setScalar(1.3);
    bubbles.forEach((b, i) => { const a = (T * 0.7 + i / 14) % 1; b.visible = true; b.position.copy(flask.position).add(V(Math.sin(i * 2.3) * 0.25, 0.5 + a * 2.4, Math.cos(i * 1.7) * 0.2)); });
    const rose = ingMeshes.corazon[1]; rose.visible = true; rose.position.copy(DUO2).add(V(0, 2.9, 0.4)); rose.scale.setScalar(Math.max(0.001, spring(prog(t, ts, ts + 0.4))) * 0.9); rose.rotation.y = T;
    return { ...sh(DUO2, V(0, 2.6, 7.8), V(0, 1.6, 0)), pal: 'jaz' };
  },
  final(t, d, cue, T) {
    const tr = cue.rosa ?? d * 0.3, tm = cue.montana ?? d * 0.5, ts = cue.sabias ?? d * 0.75;
    ped(DUO2); ground.visible = true;
    you.scale.setScalar(0.75); you.position.copy(DUO2).add(V(0.2, 0.18, 0.6)); youBottle.visible = true; you.userData.nose.visible = t > tr;
    pose(you, { hop: hopF(T, 3, 0.05), mood: t > tm ? 'o' : 'smile', mouthOpen: 1.2, eye: t > tm ? 1.4 : 1.1, look: t > tm ? [-0.3, 0.9] : [0.6, 0.2], blink: t > tr && t < tm ? 0.35 : 1, brow: t > tm ? 0.9 : 0, rotY: 0.2, armR: 1.3 });
    const g = easeOut(prog(t, tm - 0.4, tm + 0.6));
    setPetals(DUO2.clone().add(V(0, 0, -5.0)), g, 5.0, 6.5);
    qMark.visible = t > ts; qMark.scale.setScalar(Math.max(0.001, spring(prog(t, ts, ts + 0.4)) * 0.6)); qMark.position.copy(you.position).add(V(0.5, 2.3, 0.2)); qMark.rotation.y = 0.3 * Math.sin(T * 3);
    const k = easeOut(prog(t, tm - 0.4, tm + 0.8));
    return { pos: lerpV(DUO2.clone().add(V(0, 2.0, 5.6)), DUO2.clone().add(V(0, 4.2, 12.6)), k), tgt: lerpV(DUO2.clone().add(V(0, 1.4, 0)), DUO2.clone().add(V(0, 3.0, -2)), k), fov: 40, pal: 'fl5' };
  },
};


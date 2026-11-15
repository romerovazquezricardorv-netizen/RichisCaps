// ================================================================== ¿DÓNDE PONERTE EL PERFUME?
Object.assign(PALG, { d1: [0x7ad0ff, 0x3a8ae0], calor: [0xffb03a, 0xe0402a], piel: [0xffd27a, 0xff8a3a], pelo: [0xc89aff, 0x7a4ad8], no: [0xff6a6a, 0xc0303a], d6: [0x9ae08a, 0x3aa05a] });
// marcadores de "punto caliente"
const MK = Array.from({ length: 8 }, () => { const g = new THREE.Group();
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.05, 10, 32), new THREE.MeshBasicMaterial({ color: 0xff3a2a })); g.add(ring);
  const dot = new THREE.Mesh(new THREE.SphereGeometry(0.09, 14, 10), new THREE.MeshBasicMaterial({ color: 0xffe14a })); g.add(dot);
  ring.material.userData.outlineParameters = { visible: false }; scene.add(g); return g; });
// tubo de crema
const cream = new THREE.Group(); { const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.4, 1.4, 24), new THREE.MeshStandardMaterial({ color: 0xffffff })); tube.position.y = 0.7; cream.add(tube);
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.25, 20), new THREE.MeshStandardMaterial({ color: 0x3aa0ff })); cap.position.y = 1.52; cream.add(cap);
  const lab = new THREE.Mesh(new THREE.CylinderGeometry(0.335, 0.37, 0.6, 24, 1, true, -1, 2), new THREE.MeshStandardMaterial({ map: labelTex('CREMA', '#e8f4ff', '#2a6ad8') })); lab.position.y = 0.7; cream.add(lab); }
scene.add(cream);
const hairdo = new THREE.Group(); { const m = new THREE.MeshStandardMaterial({ color: 0x7a3a1a }); [[0, 2.0, 0, 0.5], [-0.45, 1.85, 0, 0.32], [0.45, 1.85, 0, 0.32], [0, 1.9, -0.35, 0.45], [-0.55, 1.4, -0.15, 0.25], [0.55, 1.4, -0.15, 0.25]].forEach(([x, y, z, r]) => { const s = new THREE.Mesh(new THREE.SphereGeometry(r, 16, 12), m); s.position.set(x, y, z); hairdo.add(s); }); }
const shelfB = makeBottle(0xff9ad0, 'PARFUM'); scene.add(shelfB);
const skinTags = [['HIDRATADA', '#ffffff'], ['SECA', '#ffffff']].map(([l]) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 0.62), new THREE.MeshBasicMaterial({ map: (() => { const c = document.createElement('canvas'); c.width = 400; c.height = 140; const x = c.getContext('2d');
  x.fillStyle = '#000'; x.fillRect(10, 12, 390, 128); x.fillStyle = '#fff'; x.fillRect(0, 0, 390, 128); x.strokeStyle = '#000'; x.lineWidth = 8; x.strokeRect(4, 4, 382, 120); x.fillStyle = '#111'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = '900 60px Inter, Arial, sans-serif'; x.fillText(l, 195, 66); return new THREE.CanvasTexture(c); })(), transparent: true })); scene.add(m); return m; });
SETS.push(...MK, cream, shelfB, ...skinTags);
const _resetX = resetWorld;
resetWorld = function () { _resetX(); pal.userData.body.remove(hairdo); hairdo.scale.setScalar(1); duoSkins.forEach((m, i) => { m.scale.setScalar(1); m.position.set(DUO.x + (i ? 1.6 : -1.6), 0.18, DUO.z); }); };
function wp(obj, x, y, z) { obj.updateMatrixWorld(true); return obj.localToWorld(V(x, y, z)); }
function marker(i, p, t0, t, T) { const m = MK[i]; const k = spring(prog(t, t0 - 0.1, t0 + 0.3)); m.visible = k > 0.01; m.position.copy(p); m.scale.setScalar(Math.max(0.001, k) * (1 + 0.15 * Math.sin(T * 8 + i))); m.rotation.set(0, 0, 0); }

Object.assign(PALG, { cuantos: [0xffd23a, 0xff8a3a], momento: [0x7ad0ff, 0x3a8ae0], ropa: [0x9ae08a, 0x3aa05a], sol: [0xffe08a, 0xffa03a], nariz: [0xc89aff, 0x7a4ad8] });
const sprayCount = text3d('4', 1.0, new THREE.MeshStandardMaterial({ color: 0xffc83a }), 0.25); scene.add(sprayCount); SETS.push(sprayCount);
const sprayNums = ['1', '2', '3', '4'].map(n => { const t = text3d(n, 0.7, new THREE.MeshStandardMaterial({ color: 0xffc83a }), 0.2); scene.add(t); SETS.push(t); return t; });
const dizzy = Array.from({ length: 3 }, () => { const m = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.04, 8, 20), new THREE.MeshStandardMaterial({ color: 0x9ad04a })); scene.add(m); SETS.push(m); return m; });
const shirtR = makeShirt(); scene.add(shirtR); SETS.push(shirtR);
const stain = new THREE.Mesh(new THREE.CircleGeometry(0.22, 24), new THREE.MeshBasicMaterial({ color: 0xd8a83a, transparent: true, opacity: 0.85 })); scene.add(stain); SETS.push(stain);
const sunD = new THREE.Group(); { const c = new THREE.Mesh(new THREE.SphereGeometry(0.6, 20, 14), new THREE.MeshStandardMaterial({ color: 0xffd23a, emissive: 0xffa000, emissiveIntensity: 0.3 })); sunD.add(c);
  for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2; const r = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.4, 8), c.material); r.position.set(Math.cos(a) * 0.85, Math.sin(a) * 0.85, 0); r.rotation.z = a - Math.PI / 2; sunD.add(r); } }
scene.add(sunD); SETS.push(sunD);
const skinSpot = new THREE.Mesh(new THREE.CircleGeometry(0.25, 24), new THREE.MeshBasicMaterial({ color: 0x8a5a34, transparent: true, opacity: 0.7 })); scene.add(skinSpot); SETS.push(skinSpot);
const SCENES = {
  gancho(t, d, cue, T) {
    const tn = cue.nada ?? d * 0.45, te = cue.equivocado ?? d * 0.85;
    ped(DUO2);
    you.scale.setScalar(0.85); you.position.copy(DUO2).add(V(0, 0.18, 0.4)); youBottle.visible = t < 1.4;
    const faded = t > tn - 0.3;
    pose(you, { hop: hopF(T, 3, 0.05), mood: faded ? 'frown' : 'smile', eye: faded ? 0.85 : 1.15, look: [0, 0.3], blink: faded ? 1 : 0.4, brow: faded ? 0.8 : 0, rotY: 0, armR: t < 1.4 ? 1.6 : 0.3 });
    if (t < 1.4) setMist(t, you.position.clone().add(V(0.9, 1.6, 0.6)), V(-0.6, 0.2, 0).normalize(), 0.2, [1, 0.8, 0.95]);
    sparks.visible = true; setSparks(T, you.position.clone().add(V(0, 1.3, 0)), 1.2, 2.2, 0xff9ad0, Math.max(0, 1 - prog(t, 1.2, tn)));
    clock.visible = t > 1.2 && t < te; clock.position.copy(DUO2).add(V(-1.5, 2.7, 0.5)); clock.scale.setScalar(0.5); clock.userData.hand.rotation.z = -T * 12;
    if (t > te - 0.1) { xMark.visible = true; xMark.position.copy(you.position).add(V(0, 1.3, 0.9)); xMark.scale.setScalar(Math.max(0.001, spring(prog(t, te - 0.1, te + 0.3)) * 0.8)); }
    return { ...sh(DUO2, V(0, 2.3, 7.6), V(0, 1.5, 0)), pal: 'd1' };
  },
  puntos(t, d, cue, T) {
    const tc = cue.calor ?? d * 0.3, tm = cue.munecas ?? d * 0.45, tn = cue.cuello ?? d * 0.55, to = cue.orejas ?? d * 0.7, tk = cue.codos ?? d * 0.88;
    ped(DUO2);
    you.scale.setScalar(1.25); you.position.copy(DUO2).add(V(0, 0.18, 0));
    pose(you, { hop: 0, mood: 'smile', eye: 1.1, look: [0, 0.2], blink: blinkAt(T, 0.3), rotY: 0, armL: 0.9, armR: 0.9 });
    const u = you.userData;
    const hR = wp(u.arms[1], 0.18, -0.6, 0.15), hL = wp(u.arms[0], -0.18, -0.6, 0.15), eR = wp(u.arms[1], 0.12, -0.25, 0.2), eL = wp(u.arms[0], -0.12, -0.25, 0.2);
    marker(0, hR, tm, t, T); marker(1, hL, tm + 0.1, t, T);
    marker(2, wp(u.body, 0, 0.98, 0.74), tn, t, T);
    marker(3, wp(u.body, 0.78, 1.6, 0.1), to, t, T); marker(4, wp(u.body, -0.78, 1.6, 0.1), to + 0.1, t, T);
    marker(5, eR, tk, t, T); marker(6, eL, tk + 0.1, t, T);
    return { ...sh(DUO2, V(0, 2.3, 9.4), V(0, 1.6, 0)), pal: t > tc - 0.2 ? 'calor' : 'd1' };
  },
  crema(t, d, cue, T) {
    const tc = cue.crema ?? d * 0.2, ts = cue.seca ?? d * 0.6, ta = cue.atrapa ?? d * 0.88;
    if (t < ts - 0.15) {
      ped(DUO2);
      cream.visible = true; cream.position.copy(DUO2).add(V(-0.9, 0.18, 0.3)); cream.scale.setScalar(Math.max(0.001, spring(prog(t, tc - 0.3, tc + 0.2)))); cream.rotation.z = 0.15 * Math.sin(T * 3);
      you.scale.setScalar(0.8); you.position.copy(DUO2).add(V(0.8, 0.18, 0.4));
      pose(you, { hop: hopF(T, 3, 0.05), mood: 'smile', eye: 1.15, look: [-0.8, 0.2], blink: blinkAt(T, 0.4), rotY: -0.5, armL: 1.2 });
      return { ...sh(DUO2, V(0, 2.2, 7.0), V(0, 1.4, 0)), pal: 'piel' };
    }
    // piel seca (derecha) vs hidratada (izquierda)
    lightAt(DUO); ground.visible = true;
    duoSkins.forEach((m, i) => { m.visible = true; m.scale.setScalar(0.62); m.position.set(DUO.x + (i ? 0.95 : -0.95), 0.12, DUO.z); });
    skinTags.forEach((g, i) => { g.visible = true; g.position.set(DUO.x + (i ? 0.95 : -0.95), 1.9, DUO.z + 0.2); g.scale.setScalar(Math.max(0.001, spring(prog(t, ts - 0.1 + i * 0.15, ts + 0.3 + i * 0.15))) * 0.55); });
    setMist(t, V(DUO.x + 0.95, 0.4, DUO.z), V(0, 1, 0), ts, [1, 0.8, 0.95]);
    if (t > ta - 0.2) { sparks.visible = true; setSparks(T, V(DUO.x - 0.95, 0.7, DUO.z), 0.6, 0.6, 0xff9ad0, 1); check.visible = true; check.position.set(DUO.x - 0.95, 2.7, DUO.z + 0.3); check.scale.setScalar(Math.max(0.001, spring(prog(t, ta - 0.2, ta + 0.2)) * 0.5)); }
    return { pos: DUO.clone().add(V(0, 3.4, 10.4)), tgt: DUO.clone().add(V(0, 1.1, 0)), fov: 40, pal: "piel" };
  },
  cabello(t, d, cue, T) {
    const tl = cue.lejos ?? d * 0.55, tr = cue.reseca ?? d * 0.85;
    ped(DUO2);
    pal.scale.setScalar(0.95); pal.position.copy(DUO2).add(V(-0.4, 0.18, 0.3)); pal.userData.body.add(hairdo); hairdo.visible = true;
    if (t > tr) hairdo.scale.set(1 + 0.08 * Math.sin(T * 30), 1 + 0.1 * Math.abs(Math.sin(T * 25)), 1);
    pose(pal, { hop: hopF(T, 3, 0.04), mood: t > tr ? 'o' : 'smile', eye: t > tr ? 1.3 : 1.1, look: [0.6, 0.6], blink: 1, rotY: 0.3 });
    const far = t > tl - 0.2;
    you.scale.setScalar(0.7); you.position.copy(DUO2).add(V(far ? 2.3 : 1.3, 0.18, 0.9)); youBottle.visible = true;
    pose(you, { hop: hopF(T, 3, 0.05), mood: 'smile', eye: 1.1, look: [-0.8, 0.5], blink: 1, rotY: -0.7, armR: 1.9 });
    setMist(t, you.position.clone().add(V(-0.4, 2.0, 0)), V(-1, 0.25, -0.1).normalize(), 0.3, [1, 0.8, 0.95]);
    return { ...sh(DUO2, V(0.5, 2.6, 8.4), V(0.5, 1.7, 0)), pal: 'pelo' };
  },
  no(t, d, cue, T) {
    const tf = cue.frotar ?? d * 0.4, tb = cue.bano ?? d * 0.85;
    if (t < tb - 0.2) {
      ped(DUO2);
      you.scale.setScalar(0.95); you.position.copy(DUO2).add(V(0, 0.18, 0.3));
      const rub = t > tf - 0.3 ? Math.sin(T * 22) * 0.25 : 0;
      pose(you, { hop: 0, mood: 'o', mouthOpen: 0.8, eye: 1.2, look: [0, -0.5], blink: 1, rotY: 0, armL: 1.15 + rub, armR: 1.15 - rub });
      if (t > tf - 0.3) { heatPtsShow(T, you.position.clone().add(V(0, 0.9, 0.9))); xMark.visible = t > tf; xMark.position.copy(you.position).add(V(0, 1.5, 1.2)); xMark.scale.setScalar(Math.max(0.001, spring(prog(t, tf, tf + 0.3)) * 0.8)); }
      return { ...sh(DUO2, V(0, 2.2, 7.0), V(0, 1.4, 0)), pal: 'no' };
    }
    lightAt(BATH); bath.visible = true; ground.visible = true; setSteam(T, 0.8);
    shelfB.visible = true; shelfB.scale.setScalar(0.5); shelfB.position.copy(BATH).add(V(0, 1.26, -1.5));
    xMark.visible = true; xMark.position.copy(shelfB.position).add(V(0, 0.8, 0.6)); xMark.scale.setScalar(Math.max(0.001, spring(prog(t, tb, tb + 0.3)) * 0.7));
    return { pos: BATH.clone().add(V(0.4, 2.1, 5.6)), tgt: BATH.clone().add(V(0.1, 1.6, -1)), fov: 40, pal: 'no' };
  },
  final(t, d, cue, T) {
    const td = cue.dia ?? d * 0.4, tq = cue.donde ?? d * 0.7;
    ped(DUO2);
    you.scale.setScalar(0.85); you.position.copy(DUO2).add(V(0, 0.18, 0.4)); youBottle.visible = t < td;
    pose(you, { hop: hopF(T, 3.5, 0.08), mood: 'smile', eye: 1.2, look: [0, 0.3], blink: 0.4, rotY: 0, armR: t < td ? 1.6 : 2.3, armL: t < td ? 0.3 : 2.3 });
    if (t < td) setMist(t, you.position.clone().add(V(0.9, 1.6, 0.6)), V(-0.6, 0.0, 0).normalize(), 0.1, [1, 0.8, 0.95]);
    sparks.visible = true; setSparks(T, you.position.clone().add(V(0, 1.3, 0)), 1.2, 2.2, 0xff9ad0, 0.9);
    if (t > td) setHearts(t, you.position.clone().add(V(0, 2.4, 0.3)), td, 5, 0.9);
    qMark.visible = t > tq; qMark.scale.setScalar(Math.max(0.001, spring(prog(t, tq, tq + 0.4)) * 0.6)); qMark.position.copy(you.position).add(V(1.0, 2.4, 0.2)); qMark.rotation.y = 0.3 * Math.sin(T * 3);
    return { ...sh(DUO2, V(0, 2.3, 7.6), V(0, 1.5, 0)), pal: 'd6' };
  },
  cuantos(t, d, cue, T) {
    const tc = cue.cuantas ?? 0.2, td = cue.dos ?? d * 0.35, tm = cue.mareas ?? d * 0.8;
    ped(DUO2);
    you.scale.setScalar(0.8); you.position.copy(DUO2).add(V(-0.7, 0.18, 0.3)); youBottle.visible = true;
    const n = Math.min(4, Math.floor(prog(t, tc, td + 0.8) * 4 + (t > tc ? 1 : 0)));
    pose(you, { hop: hopF(T, 3, 0.04), mood: 'smile', eye: 1.1, look: [0.6, 0.2], blink: 1, rotY: 0.4, armR: 1.6 });
    sprayNums.forEach((m, i) => { m.visible = i < n && t < tm - 0.3; m.position.copy(DUO2).add(V(-0.9 + i * 0.6, 2.35, 0.9)); m.scale.setScalar(0.7 * Math.max(0.001, spring(prog(t, tc + i * 0.3, tc + 0.3 + i * 0.3)))); });
    if (t < tm - 0.3) setMist(t, you.position.clone().add(V(0.8, 1.5, 0.5)), V(0.6, 0.1, 0).normalize(), tc, [1, 0.8, 0.95]);
    if (t > tm - 0.4) { pal.scale.setScalar(0.75); pal.position.copy(DUO2).add(V(1.2, 0.18, 0.5)); pose(pal, { hop: 0, mood: 'o', mouthOpen: 0.8, eye: 0.8, look: [Math.sin(T * 8), Math.cos(T * 8)], blink: 1, brow: 0.8, rotY: -0.5 }); pal.rotation.z = 0.12 * Math.sin(T * 5);
      dizzy.forEach((m, i) => { m.visible = true; const a = T * 4 + i * 2.1; m.position.copy(pal.position).add(V(Math.cos(a) * 0.5, 2.0, Math.sin(a) * 0.5)); m.rotation.x = Math.PI / 2; });
      setStink(t, pal.position.clone().add(V(-0.6, 1.2, 0)), tm - 0.4, 0.4); }
    return { ...sh(DUO2, V(0, 2.4, 8.2), V(0, 1.5, 0)), pal: 'cuantos' };
  },
  momento(t, d, cue, T) {
    const tb = cue.banarte ?? d * 0.45;
    lightAt(BATH); bath.visible = true; ground.visible = true; setSteam(T, t < tb + 0.8 ? 0.9 : 0.4);
    you.scale.setScalar(0.85); you.position.copy(BATH).add(V(0.4, 0.12, 0.6)); you.userData.body.add(towel); towel.visible = true; youBottle.visible = t > tb;
    pose(you, { hop: hopF(T, 3, 0.05), mood: 'smile', eye: 1.2, look: [-0.5, 0.3], blink: 0.4, rotY: -0.3, armR: t > tb ? 1.6 : 0.3 });
    if (t > tb) setMist(t, you.position.clone().add(V(0.7, 1.6, 0.4)), V(-0.5, 0.3, 0.2).normalize(), tb, [1, 0.8, 0.95]);
    return { pos: BATH.clone().add(V(0.6, 2.4, 7.4)), tgt: BATH.clone().add(V(0.2, 1.6, -0.5)), fov: 40, pal: 'momento' };
  },
  ropa(t, d, cue, T) {
    const tm = cue.manchar ?? d * 0.7;
    ped(DUO2);
    shirtR.visible = true; shirtR.position.copy(DUO2).add(V(0, 1.6, 0)); shirtR.scale.setScalar(1.4); shirtR.rotation.set(0, 0.2 * Math.sin(T), 0);
    setMist(t, DUO2.clone().add(V(1.6, 2.3, 0.6)), V(-1, -0.1, -0.1).normalize(), 0.3, [1, 0.8, 0.95]);
    if (t > tm - 0.2) { stain.visible = true; stain.position.copy(shirtR.position).add(V(0.1, 0.1, 0.26)); stain.scale.setScalar(Math.max(0.001, spring(prog(t, tm - 0.2, tm + 0.3))) * 1.4); xMark.visible = true; xMark.position.copy(DUO2).add(V(0, 3.2, 0.5)); xMark.scale.setScalar(Math.max(0.001, spring(prog(t, tm, tm + 0.3))) * 0.45); }
    return { ...sh(DUO2, V(0, 2.4, 7.0), V(0, 1.7, 0)), pal: 'ropa' };
  },
  sol(t, d, cue, T) {
    const tp = cue.piel ?? d * 0.6;
    ped(DUO2);
    sunD.visible = true; sunD.position.copy(DUO2).add(V(1.2, 3.2, 0)); sunD.rotation.z = T * 0.5; sunD.scale.setScalar(Math.max(0.001, spring(prog(t, 0, 0.5))));
    const ck = ingMeshes.salida[0]; ck.visible = true; ck.position.copy(DUO2).add(V(-1.3, 2.4, 0.3)); ck.scale.setScalar(0.7); ck.rotation.y = T;
    lightAt(DUO); duoSkins[1].visible = true; duoSkins[1].position.copy(DUO2).add(V(0, 0.4, 0.6)); duoSkins[1].scale.setScalar(0.65);
    if (t > tp - 0.2) { skinSpot.visible = true; skinSpot.rotation.x = -Math.PI / 2; skinSpot.position.copy(duoSkins[1].position).add(V(0, 0.12, 0)); skinSpot.scale.setScalar(Math.max(0.001, spring(prog(t, tp - 0.2, tp + 0.3))) * 1.3); }
    lightAt(DUO2);
    return { ...sh(DUO2, V(0, 3.0, 7.6), V(0, 1.4, 0)), pal: 'sol' };
  },
  nariz(t, d, cue, T) {
    const ta = cue.acost ?? d * 0.5, td = cue.demas ?? d * 0.8;
    ped(DUO2);
    you.scale.setScalar(0.85); you.position.copy(DUO2).add(V(-0.5, 0.18, 0.3)); you.userData.nose.visible = true;
    pose(you, { hop: 0, mood: t > ta ? 'smile' : 'o', mouthOpen: 0.7, eye: 1, look: [0, -0.4], blink: t > ta ? 0.15 : 1, rotY: 0.3 });
    if (t > ta) { zzz.visible = true; zzz.position.copy(you.position).add(V(0.6, 2.2, 0.3)); zzz.scale.setScalar(1 + 0.1 * Math.sin(T * 3)); }
    if (t > td - 0.3) { pal.scale.setScalar(0.7); pal.position.copy(DUO2).add(V(1.2, 0.18, 0.5)); pal.userData.nose.visible = true;
      pose(pal, { hop: hopF(T, 3, 0.05), mood: 'smile', eye: 1.2, look: [-0.8, 0.2], blink: 0.35, rotY: -0.6 }); setHearts(t, pal.position.clone().add(V(0, 2.0, 0.3)), td, 4, 0.5); }
    return { ...sh(DUO2, V(0, 2.4, 7.6), V(0, 1.5, 0)), pal: 'nariz' };
  },
};
function heatPtsShow(T, c) { sparks.visible = true; setSparks(T, c, 0.6, 0.8, 0xff7a2a, 1); }


// ================================================================== ¿POR QUÉ SE LLAMA "COLONIA"? (frascos genéricos)
Object.assign(PALG, { k1: [0x7ad0ff, 0x3a8ae0], k2: [0xffd23a, 0xff8a3a], k3: [0x9ae08a, 0x3aa05a], k4: [0xc89aff, 0x7a4ad8], k5: [0xff8a5a, 0xc04a2a], k6: [0xffb03a, 0xe0603a], k7: [0xff9ad0, 0xe0508a] });
const flagDE = flagG([0x15151c, 0xdd2a2a, 0xffc83a], false), flagIT = flagG([0x2a9a4a, 0xffffff, 0xdd2a2a], true);
const cathedral = add((() => { const g = new THREE.Group(); const m = new THREE.MeshStandardMaterial({ color: 0x5a5a66 });
  const nave = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.6, 1.4), m); nave.position.y = 0.8; g.add(nave);
  [-0.55, 0.55].forEach(x => { const tw = new THREE.Mesh(new THREE.BoxGeometry(0.55, 2.6, 0.55), m); tw.position.set(x, 1.3, 0.5); g.add(tw);
    const sp = new THREE.Mesh(new THREE.ConeGeometry(0.4, 1.4, 4), m); sp.position.set(x, 3.3, 0.5); sp.rotation.y = Math.PI / 4; g.add(sp); });
  const door = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.7), new THREE.MeshStandardMaterial({ color: 0x2a2a30 })); door.position.set(0, 0.35, 0.78); g.add(door); return g; })());
const houses = add((() => { const g = new THREE.Group(); [[-1.6, 0xffd0a0], [-0.6, 0xa0d0ff], [0.6, 0xffb0c0], [1.6, 0xc0f0b0]].forEach(([x, c]) => { const h = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.3, 0.9), new THREE.MeshStandardMaterial({ color: c })); h.position.set(x, 0.65, 0); g.add(h);
  const r = new THREE.Mesh(new THREE.ConeGeometry(0.72, 0.6, 4), new THREE.MeshStandardMaterial({ color: 0xc0503a })); r.position.set(x, 1.6, 0); r.rotation.y = Math.PI / 4; g.add(r); }); return g; })());
const colB = bottleG(0xfff2a0, 'COLOGNE');
const farina = buddyG(0x4f8dff); { const m = new THREE.Mesh(new THREE.CapsuleGeometry(0.06, 0.45, 4, 8), new THREE.MeshStandardMaterial({ color: 0x2a1a10 })); m.rotation.z = Math.PI / 2; m.position.set(0, 1.15, 0.85); farina.userData.body.add(m); }
const wigF = wig.clone(); farina.userData.body.add(wigF);
const leaves = add((() => { const g = new THREE.Group(); const m = new THREE.MeshStandardMaterial({ color: 0x3ab05a }); [[0, 0.2, 0], [-0.22, 0, 0.6], [0.22, 0, -0.6]].forEach(([x, y, r]) => { const l = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 10), m); l.scale.set(0.6, 1, 0.18); l.position.set(x, y, 0); l.rotation.z = r; g.add(l); }); return g; })());
const notesK = [ING.limon(), ING.bergamota(), (() => { const o = ING.toronja(); o.children[0].material = new THREE.MeshStandardMaterial({ color: 0xff9a2a }); return o; })(), leaves].map(n => (n.parent ? n : add(n)));
const kings = [0x7a6aff, 0xff6fb0, 0x3ad0a0].map(c => { const b = buddyG(c); const cr = crown2.clone(); cr.position.y = 2.0; cr.scale.setScalar(0.6); b.userData.body.add(cr); return b; });
const napo = buddyG(0x4f8dff); const bicShape = new THREE.Shape(); bicShape.absarc(0, 0, 0.95, 0, Math.PI, false); const bicorne = new THREE.Mesh(new THREE.ExtrudeGeometry(bicShape, { depth: 0.3, bevelEnabled: false }), new THREE.MeshStandardMaterial({ color: 0x15151c })); bicorne.scale.set(1, 0.6, 1); bicorne.position.set(0, 1.75, -0.15); napo.userData.body.add(bicorne);
const tagMarca = cartel(['SEGÚN', 'LA MARCA']);
const copies = [0xfff2a0, 0xffe0b0, 0xf0f0c0, 0xfff0d0, 0xffe8a0].map(c => bottleG(c, 'FARINA?'));
const house4711 = add((() => { const g = new THREE.Group(); const h = new THREE.Mesh(new THREE.BoxGeometry(2.0, 2.6, 1.0), new THREE.MeshStandardMaterial({ color: 0xf2e6c8 })); h.position.y = 1.3; g.add(h);
  const door = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 1.1), new THREE.MeshStandardMaterial({ color: 0x5a3a1a })); door.position.set(0, 0.55, 0.51); g.add(door);
  [-0.6, 0.6].forEach(x => { const w = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.5), new THREE.MeshBasicMaterial({ color: 0x7ad0ff })); w.position.set(x, 1.7, 0.51); g.add(w); }); return g; })());
const plate4711 = cartel(['4711'], 1.4, 0.7);
const smallB = bottleG(0xfff2a0, 'COLOGNE'), bigB = bottleG(0xffa94d, 'PARFUM');
const tagPct1 = cartel(['2–5 %'], 1.1, 0.55), tagPct2 = cartel(['15–20 %'], 1.1, 0.55);
const shop = add((() => { const g = new THREE.Group(); const h = new THREE.Mesh(new THREE.BoxGeometry(2.6, 2.2, 1.0), new THREE.MeshStandardMaterial({ color: 0xe8dcc8 })); h.position.y = 1.1; g.add(h);
  const aw = new THREE.Mesh(new THREE.BoxGeometry(2.7, 0.12, 0.6), new THREE.MeshStandardMaterial({ color: 0x2a6a4a })); aw.position.set(0, 1.9, 0.6); g.add(aw);
  const win = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.9), new THREE.MeshBasicMaterial({ color: 0xbfe6ff })); win.position.set(0, 0.95, 0.51); g.add(win); return g; })());
const y1709 = bigT('1709', 0xffc83a, 0.7), y300 = bigT('300', 0xffc83a, 0.8);
const SCENES = {
  gancho(t, d, cue, T) {
    const tc = cue.colonia ?? d * 0.2, ti = cue.ciudad ?? d * 0.75;
    ped(DUO2);
    P(colB, t, tc - 0.3, 0.6); A(colB, t > ti - 0.3 ? -0.7 : 0, 0.18, 0); spin(colB, T);
    if (t > ti - 0.3) { P(cathedral, t, ti - 0.3, 0.55); A(cathedral, 0.6, 0.18, -0.3); qMark.visible = true; qMark.scale.setScalar(Math.max(0.001, spring(prog(t, ti, ti + 0.4))) * 0.4); A(qMark, -0.7, 2.0, 0.4); qMark.rotation.y = 0.3 * Math.sin(T * 3); }
    return shot('k1', 7.2, 1.3);
  },
  ciudad(t, d, cue, T) {
    const ta = cue.alemania ?? d * 0.1, ty = cue.anio ?? d * 0.35, tf = cue.farina ?? d * 0.55, tc = cue.citricos ?? d * 0.85;
    lightAt(DUO2); ground.visible = true;
    if (t < tf - 0.3) {
      cathedral.visible = true; cathedral.scale.setScalar(0.62); A(cathedral, 0, 0, -1.0); houses.visible = true; houses.scale.setScalar(0.75); A(houses, 0, 0, 0.4);
      P(flagDE, t, ta - 0.2, 0.7); A(flagDE, 0.95, 2.2, 0.6); flagDE.rotation.y = 0.2 * Math.sin(T * 2);
      return shot('k1', 8.4, 1.6);
    }
    ped(DUO2);
    bud(farina, -0.7, 0.3, 0.55, T, { look: [0.8, 0.1], rotY: 0.5, armR: 1.6 });
    P(flagIT, t, tf - 0.3, 0.6); A(flagIT, -0.6, 2.25, 0); flagIT.rotation.y = 0.2 * Math.sin(T * 2);
    if (t > tc - 0.3) { P(colB, t, tc - 0.3, 0.45); A(colB, 0.7, 0.18, 0.2); spin(colB, T); notesK[0].visible = true; notesK[0].scale.setScalar(0.7); A(notesK[0], 0.75, 1.75, 0.3); notesK[0].rotation.y = T; }
    return shot('k2', 7.4, 1.3);
  },
  olor(t, d, cue, T) {
    const ts = [cue.limon ?? d * 0.1, cue.bergamota ?? d * 0.2, (cue.hierbas ?? d * 0.3) - 0.3, cue.hierbas ?? d * 0.3], ti = cue.italia ?? d * 0.6, tn = cue.nombre ?? d * 0.8;
    ped(DUO2);
    colB.visible = true; colB.scale.setScalar(0.5); A(colB, 0, 0.18, 0); spin(colB, T);
    notesK.forEach((n, i) => { P(n, t, ts[i] - 0.2, 0.65); const a = T * 0.7 + i / 4 * Math.PI * 2; A(n, Math.cos(a) * 1.15, 1.3 + 0.25 * Math.sin(a * 2), Math.sin(a) * 0.8); });
    if (t > ti - 0.2) { P(sunG, t, ti - 0.2, 0.45); A(sunG, 1.0, 2.5, -0.6); sunG.rotation.z = T * 0.3; }
    if (t > tn) { sparks.visible = true; setSparks(T, DUO2.clone().add(V(0, 1.2, 0)), 1.0, 1.4, 0xffd23a, 1); }
    return shot('k3', 7.4, 1.3);
  },
  furor(t, d, cue, T) {
    const tr = cue.reyes ?? d * 0.25, tn = cue.napoleon ?? d * 0.55, tm = cue.marca ?? d * 0.85;
    ped(DUO2);
    if (t < tn - 0.3) { kings.forEach((k, i) => { if (t > Math.min(tr - 0.4, 0.2) + i * 0.12) bud(k, -1.0 + i * 1.0, 0.3, 0.45, T, { look: [0, 0.2], armR: 1.6, hop: hopF(T, 3 + i, 0.06) }); });
      colB.visible = true; colB.scale.setScalar(0.3); A(colB, 0, 0.18, 1.2); return shot('k4', 7.6, 1.2); }
    bud(napo, -0.5, 0.3, 0.6, T, { look: [0.6, 0.1], rotY: 0.4, armR: 1.8 + 0.3 * Math.sin(T * 8) });
    colB.visible = true; colB.scale.setScalar(0.4); A(colB, 0.7, 0.18, 0.2); spin(colB, T);
    setMist(t, DUO2.clone().add(V(0.4, 1.6, 0.3)), V(-1, 0.1, 0.2).normalize(), tn, [1, 0.97, 0.7]);
    if (t > tm - 0.2) { P(tagMarca, t, tm - 0.2, 0.7); A(tagMarca, 0.7, 2.1, 0.5); qMark.visible = true; qMark.scale.setScalar(0.35); A(qMark, -0.2, 2.2, 0.4); qMark.rotation.y = 0.3 * Math.sin(T * 3); }
    return shot('k4', 7.4, 1.3);
  },
  copias(t, d, cue, T) {
    const tc = cue.copias ?? d * 0.25, ta = cue.apellido ?? d * 0.55, tp = cue.pleito ?? d * 0.85;
    ped(DUO2);
    if (t < tp - 0.4) {
      colB.visible = true; colB.scale.setScalar(0.45); A(colB, 0, 0.18, -0.3);
      copies.forEach((c, i) => { P(c, t, tc - 0.2 + i * 0.15, 0.3); const a = -1.2 + i * 0.6; A(c, a, 0.18, 0.7 - Math.abs(a) * 0.2); spin(c, T + i, 0.2); });
      if (t > ta) { qMark.visible = true; qMark.scale.setScalar(Math.max(0.001, spring(prog(t, ta, ta + 0.4))) * 0.4); A(qMark, 0, 2.0, 0.3); qMark.rotation.y = 0.3 * Math.sin(T * 3); }
      return shot('k5', 7.4, 1.2);
    }
    block.visible = true; block.scale.setScalar(1); A(block, 0, 0.26, 0.3);
    gavel.visible = true; gavel.scale.setScalar(1); A(gavel, 0.6, 0.3, 0.3); gavel.rotation.z = 0.9 * Math.abs(Math.sin(T * 5)) + 0.3;
    bud(farina, -0.9, 0.2, 0.5, T, { mood: 'o', mouthOpen: 0.9, look: [0.8, 0.1], rotY: 0.5, brow: 0.8 });
    return shot('k5', 7.2, 1.0);
  },
  n4711(t, d, cue, T) {
    const tn = cue.n4711 ?? d * 0.2, tm = cue.numero ?? d * 0.7;
    lightAt(DUO2); ground.visible = true;
    house4711.visible = true; house4711.scale.setScalar(0.9); A(house4711, 0, 0, -0.6);
    P(plate4711, t, tn - 0.2, 0.85); A(plate4711, 0, 1.6, -0.05);
    if (t > tm - 0.2) { sparks.visible = true; setSparks(T, DUO2.clone().add(V(0, 1.6, 0)), 0.8, 0.8, 0xffd23a, 1); bud(you, 0.95, 0.9, 0.42, T, { look: [-0.6, 0.4], rotY: -0.5, mood: 'o', mouthOpen: 0.8, eye: 1.3, blink: 1 }); }
    return shot('k6', 7.8, 1.4);
  },
  hoy(t, d, cue, T) {
    const tt = cue.tipo ?? d * 0.15, tc = cue.cinco ?? d * 0.55, tr = cue.refresca ?? d * 0.88;
    if (t < tt) { ped(DUO2); colB.visible = true; colB.scale.setScalar(0.55); A(colB, 0, 0.18, 0); spin(colB, T); return shot('k3', 7.0, 1.2); }
    if (t < tr) {
      ped(DUO2); ped(DUO3, true);
      smallB.visible = true; smallB.scale.setScalar(0.42); A(smallB, -0.4, 0.18, 0); smallB.userData.liquid.scale.y = 0.25; spin(smallB, T, 0.2);
      bigB.visible = true; bigB.scale.setScalar(0.42); A(bigB, -0.4, 0.18, 0, DUO3); bigB.userData.liquid.scale.y = 0.9; spin(bigB, T, 0.2);
      if (t > tc - 0.3) { P(tagPct1, t, tc - 0.3, 0.6); A(tagPct1, 0.75, 1.0, 0.3); P(tagPct2, t, tc - 0.1, 0.6); A(tagPct2, 0.75, 1.0, 0.3, DUO3); }
      return splitShot('k3', 'k6');
    }
    ped(DUO2);
    bud(you, 0, 0.3, 0.65, T, { hop: hopF(T, 4, 0.1), look: [0, 0.4], eye: 0.6, blink: 0.4, armL: 2.4, armR: 2.4 });
    sparks.visible = true; setSparks(T, DUO2.clone().add(V(0, 1.4, 0)), 1.3, 1.8, 0x7ad0ff, 1);
    return shot('k1', 7.2, 1.3);
  },
  hoyfarina(t, d, cue, T) {
    const te = cue.existe ?? d * 0.3, tt = cue.trescientos ?? d * 0.8;
    lightAt(DUO2); ground.visible = true;
    P(shop, t, Math.min(te - 0.4, 0.2), 0.85); A(shop, 0, 0, -0.6);
    colB.visible = te - 0.2 < t; colB.scale.setScalar(0.35); A(colB, 0, 0.0, 0.6); spin(colB, T);
    if (t > tt - 0.3) { P(y300, t, tt - 0.3, 0.6); A(y300, 0, 2.35, 0.2); y300.rotation.y = 0.2 * Math.sin(T); }
    return shot('k2', 8.0, 1.4);
  },
  final(t, d, cue, T) {
    const ta = cue.alemana ?? d * 0.5, tu = cue.usas ?? d * 0.8;
    ped(DUO2);
    bud(you, -0.6, 0.3, 0.55, T, { look: [0.6, 0.1], rotY: 0.4, armR: 1.6 }); youBottle.visible = true;
    if (t > ta - 0.3) { P(flagDE, t, ta - 0.3, 0.7); A(flagDE, 0.75, 2.15, 0.2); flagDE.rotation.y = 0.2 * Math.sin(T * 2); }
    if (t > tu) { qMark.visible = true; qMark.scale.setScalar(Math.max(0.001, spring(prog(t, tu, tu + 0.4))) * 0.45); A(qMark, -0.6, 2.0, 0.4); qMark.rotation.y = 0.3 * Math.sin(T * 3); }
    return shot('k7', 7.2, 1.2);
  },
};
const _resetK = resetWorld;
resetWorld = function () { _resetK(); smallB.userData.liquid.scale.y = 1; bigB.userData.liquid.scale.y = 1; };

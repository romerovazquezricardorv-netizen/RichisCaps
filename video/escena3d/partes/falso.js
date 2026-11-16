// ================================================================== ¿ORIGINAL O PIRATA? 6 SEÑALES (frascos genéricos)
Object.assign(PALG, { p1: [0xffd23a, 0xff8a3a], p2: [0x9ae08a, 0x3aa05a], p3: [0x7ad0ff, 0x3a8ae0], p4: [0xc89aff, 0x7a4ad8], p5: [0xff9ad0, 0xe0508a], p6: [0xff8a5a, 0xc04a2a], p7: [0x8a8a9a, 0x4a4a5a], p8: [0x5a4a7a, 0x2a1a4a] });
const og = bottleG(0xffb84d, 'PARFUM'), pir = bottleG(0xffd88d, 'PERFUN');
function boxG(label, tilt = 0) { const g = new THREE.Group(); const b = new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.9, 0.8), new THREE.MeshStandardMaterial({ color: 0x15151c })); b.position.y = 0.95; g.add(b);
  const f = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 0.55), new THREE.MeshBasicMaterial({ map: labelTex(label, '#15151c', '#d8ab55') })); f.position.set(0, 1.1, 0.41); f.rotation.z = tilt; g.add(f); return add(g); }
const boxOk = boxG('PARFUM'), boxBad = boxG('PERFUN', 0.12);
const wrap = add((() => { const g = new THREE.Group(); const m = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.25, roughness: 0.05, side: THREE.DoubleSide });
  for (let i = 0; i < 9; i++) { const p = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.7), m); p.position.set(-0.4 + (i % 3) * 0.4, 0.4 + Math.floor(i / 3) * 0.6, 0.43); p.rotation.set((i % 2 ? 0.3 : -0.25), (i % 3 - 1) * 0.3, 0.1 * i); g.add(p); } return g; })());
const glue = Array.from({ length: 4 }, (_, i) => add(new THREE.Mesh(new THREE.SphereGeometry(0.08, 10, 8), new THREE.MeshStandardMaterial({ color: 0xfff6c0 }))));
const tag100 = cartel(['$100'], 1.1, 0.6), tag15 = cartel(['$15'], 1.1, 0.6);
const codeBox = cartel(['LOTE', '3A21'], 1.1, 0.7), codeBot = cartel(['LOTE', '3A21'], 1.1, 0.7), codeBad = cartel(['LOTE', '9Z99'], 1.1, 0.7);
const phoneP = add((() => { const g = new THREE.Group(); g.add(new THREE.Mesh(new RoundedBoxGeometry(0.8, 1.45, 0.1, 4, 0.1), new THREE.MeshStandardMaterial({ color: 0x15151c })));
  const c = document.createElement('canvas'); c.width = 160; c.height = 290; const x = c.getContext('2d'); x.fillStyle = '#eaf6ff'; x.fillRect(0, 0, 160, 290); x.fillStyle = '#15151c'; x.font = '800 26px Inter'; x.textAlign = 'center';
  x.fillText('LOTE 3A21', 80, 90); x.fillStyle = '#3aa05a'; x.font = '900 30px Inter'; x.fillText('MAR 2025', 80, 160); x.font = '900 80px Inter'; x.fillText('✓', 80, 250);
  const s = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 1.28), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c) })); s.position.z = 0.06; g.add(s); return g; })());
const jetDrops = Array.from({ length: 10 }, () => add(new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 6), new THREE.MeshStandardMaterial({ color: 0xbfe6ff }))));
const alcCloud = cartel(['ALCOHOL'], 1.4, 0.6);
const tube = add((() => { const g = new THREE.Group(); const t = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 1.1, 16, 1, true), new THREE.MeshStandardMaterial({ color: 0xeaf6ff, transparent: true, opacity: 0.4, side: THREE.DoubleSide })); t.position.y = 0.55; g.add(t);
  const l = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.5, 16), new THREE.MeshStandardMaterial({ color: 0xd8e04a })); l.position.y = 0.25; g.add(l); return g; })());
const skull = cartel(['TÓXICO'], 1.3, 0.6);
const cop = buddyG(0x3a5ad0); { const cap = new THREE.Group(); const m = new THREE.MeshStandardMaterial({ color: 0x15153a }); const c = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.55, 0.35, 24), m); cap.add(c);
  const v = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 0.05, 24, 1, false, -Math.PI / 2, Math.PI), m); v.position.set(0, -0.15, 0.15); cap.add(v); const b = new THREE.Mesh(new THREE.CircleGeometry(0.1, 12), new THREE.MeshStandardMaterial({ color: 0xffc83a })); b.position.set(0, 0.02, 0.6); cap.add(b);
  cap.position.y = 1.95; cop.userData.body.add(cap); }
const store = add((() => { const g = new THREE.Group(); const h = new THREE.Mesh(new THREE.BoxGeometry(2.6, 2.0, 1.0), new THREE.MeshStandardMaterial({ color: 0xf2f2f6 })); h.position.y = 1.0; g.add(h);
  const aw = new THREE.Mesh(new THREE.BoxGeometry(2.7, 0.15, 0.6), new THREE.MeshStandardMaterial({ color: 0x3a6ae0 })); aw.position.set(0, 1.7, 0.6); g.add(aw);
  const win = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 0.9), new THREE.MeshBasicMaterial({ color: 0xbfe6ff })); win.position.set(0, 0.85, 0.51); g.add(win); return g; })());
const tagOficial = cartel(['TIENDA', 'OFICIAL']);
const SCENES = {
  gancho(t, d, cue, T) {
    const tp = cue.pirata ?? d * 0.35, ts = cue.seis ?? d * 0.8;
    ped(DUO2);
    og.visible = true; og.scale.setScalar(0.48); A(og, -0.6, 0.18, 0); spin(og, T);
    P(pir, t, tp - 0.3, 0.48); A(pir, 0.6, 0.18, 0); spin(pir, T + 1);
    if (t > tp) { qMark.visible = true; qMark.scale.setScalar(Math.max(0.001, spring(prog(t, tp, tp + 0.4))) * 0.45); A(qMark, 0, 2.0, 0.3); qMark.rotation.y = 0.3 * Math.sin(T * 3); }
    return shot('p1', 7.0, 1.2);
  },
  precio(t, d, cue, T) {
    const tq = cue.quince ?? d * 0.55, ts = cue.sospecha ?? d * 0.85;
    ped(DUO2);
    og.visible = true; og.scale.setScalar(0.45); A(og, -0.6, 0.18, 0); P(tag100, t, 0.2, 0.65); A(tag100, -0.6, 1.75, 0.4);
    if (t > tq - 0.3) { P(pir, t, tq - 0.3, 0.45); A(pir, 0.6, 0.18, 0); P(tag15, t, tq - 0.1, 0.65); A(tag15, 0.6, 1.75, 0.4); tag15.rotation.z = 0.1 * Math.sin(T * 6); }
    if (t > ts - 0.3) bud(you, 0, 1.0, 0.38, T, { mood: 'o', mouthOpen: 0.8, eye: 0.7, brow: 0.9, look: [0.6, 0.2], blink: 1 });
    return shot('p2', 7.2, 1.2);
  },
  celofan(t, d, cue, T) {
    const tc = cue.celofan ?? d * 0.3, ta = cue.arrugas ?? d * 0.7;
    ped(DUO2);
    boxOk.visible = true; boxOk.scale.setScalar(0.6); A(boxOk, -0.6, 0.18, 0); boxOk.rotation.y = 0.3;
    if (t > tc - 0.2) { check.visible = true; check.scale.setScalar(Math.max(0.001, spring(prog(t, tc - 0.2, tc + 0.2))) * 0.3); A(check, -0.6, 1.7, 0.4); }
    if (t > ta - 0.4) { P(boxBad, t, ta - 0.4, 0.6); A(boxBad, 0.6, 0.18, 0); boxBad.rotation.y = -0.3; wrap.visible = true; wrap.scale.setScalar(0.6); A(wrap, 0.6, 0.18, 0); wrap.rotation.y = -0.3;
      glue.forEach((g, i) => { g.visible = true; A(g, 0.35 + (i % 2) * 0.5, 0.3 + Math.floor(i / 2) * 0.9, 0.3); });
      xMark.visible = true; xMark.scale.setScalar(Math.max(0.001, spring(prog(t, ta, ta + 0.3))) * 0.3); A(xMark, 0.6, 1.7, 0.4); }
    return shot('p3', 7.0, 1.0);
  },
  caja(t, d, cue, T) {
    const tc = cue.chuecas ?? d * 0.35, to = cue.ortografia ?? d * 0.5, tca = cue.carton ?? d * 0.7, tm = cue.mala ?? d * 0.88;
    ped(DUO2);
    boxBad.visible = true; boxBad.scale.setScalar(0.8); A(boxBad, 0, 0.18, 0); boxBad.rotation.set(0, 0.25 * Math.sin(T), t > tca ? 0.06 * Math.sin(T * 8) : 0);
    if (t > to - 0.2) { P(lupaP, t, to - 0.2, 0.8); A(lupaP, 0.25 + 0.1 * Math.sin(T * 2), 1.0, 0.8); }
    if (t > tm - 0.2) { xMark.visible = true; xMark.scale.setScalar(Math.max(0.001, spring(prog(t, tm - 0.2, tm + 0.2))) * 0.4); A(xMark, 0.85, 2.0, 0.4); }
    return shot('p4', 7.0, 1.2);
  },
  lote(t, d, cue, T) {
    const tl = cue.lote ?? d * 0.12, tg = cue.grabado ?? d * 0.3, tc = cue.coincidir ?? d * 0.45, tdp = cue.despega ?? d * 0.6, tf = cue.fabrico ?? d * 0.82;
    ped(DUO2);
    if (t < tdp - 0.3) {
      og.visible = true; og.scale.setScalar(0.48); A(og, -0.6, 0.6, 0); og.rotation.set(Math.PI * 0.7 * easeIO(prog(t, tl, tl + 0.6)), 0.3, 0);
      boxOk.visible = true; boxOk.scale.setScalar(0.55); A(boxOk, 0.6, 0.18, -0.2); boxOk.rotation.y = -0.2;
      if (t > tg - 0.2) { P(codeBot, t, tg - 0.2, 0.6); A(codeBot, -0.6, 2.05, 0.4); P(codeBox, t, tg, 0.6); A(codeBox, 0.6, 2.05, 0.4); }
      if (t > tc) { check.visible = true; check.scale.setScalar(Math.max(0.001, spring(prog(t, tc, tc + 0.3))) * 0.3); A(check, 0, 2.1, 0.5); }
      return shot('p5', 7.2, 1.3);
    }
    if (t < tf - 0.3) {
      boxBad.visible = true; boxBad.scale.setScalar(0.55); A(boxBad, 0, 0.18, -0.2);
      codeBad.visible = true; codeBad.scale.setScalar(0.7); A(codeBad, 0.1 + 0.6 * prog(t, tdp, tdp + 1.0), 1.0 + 0.6 * prog(t, tdp, tdp + 1.0), 0.4); codeBad.rotation.z = 0.6 * prog(t, tdp, tdp + 1.0);
      bud(you, 0.95, 0.8, 0.4, T, { mood: 'o', mouthOpen: 1.0, eye: 1.3, blink: 1, brow: 0.9, rotY: -0.8, hop: hopF(T, 8, 0.15), look: [1, 0] });
      return shot('p6', 7.2, 1.2);
    }
    P(phoneP, t, tf - 0.3, 0.9); A(phoneP, 0, 1.2, 0.3); phoneP.rotation.y = 0.2 * Math.sin(T);
    return shot('p5', 6.8, 1.2);
  },
  spray(t, d, cue, T) {
    const ta = cue.atomizador ?? d * 0.2, tn = cue.neblina ?? d * 0.5, tc = cue.chorro ?? d * 0.8;
    if (t < ta) { ped(DUO2); og.visible = true; og.scale.setScalar(0.5); A(og, 0, 0.18, 0); spin(og, T); return shot('p3', 7.0, 1.2); }
    ped(DUO2); ped(DUO3, true);
    og.visible = true; og.scale.setScalar(0.34); A(og, -0.7, 0.18, 0); og.rotation.y = 0.4;
    if (t > tn - 0.3) setMist(t, DUO2.clone().add(V(-0.4, 1.2, 0.2)), V(1, 0.1, 0).normalize(), tn - 0.3, [0.9, 0.95, 1]);
    pir.visible = true; pir.scale.setScalar(0.34); A(pir, -0.7, 0.18, 0, DUO3); pir.rotation.y = 0.4;
    if (t > tc - 0.3) jetDrops.forEach((j, i) => { const a = ((T * 2 + i / 10) % 1); j.visible = true; A(j, -0.4 + a * 1.8, 1.15 - a * a * 0.8, 0.2, DUO3); });
    return splitShot('p2', 'p6', 7.4, 0.9);
  },
  olor(t, d, cue, T) {
    const ta = cue.alcohol ?? d * 0.5, tdp = cue.desaparece ?? d * 0.85;
    ped(DUO2);
    pir.visible = true; pir.scale.setScalar(0.45); A(pir, -0.6, 0.18, 0); spin(pir, T);
    bud(you, 0.7, 0.4, 0.5, T, { mood: t > ta ? 'frown' : 'smile', eye: t > ta ? 0.4 : 0.6, blink: 0.4, look: [-0.8, 0], rotY: -0.5, brow: t > ta ? 0.9 : 0 }); you.userData.nose.visible = true;
    if (t > ta - 0.3 && t < tdp) { P(alcCloud, t, ta - 0.3, 0.7); A(alcCloud, -0.1, 2.0, 0.4); setStink(t, DUO2.clone().add(V(0, 1.4, 0.3)), ta - 0.3, 0.5); }
    if (t > tdp - 0.2) { clock.visible = true; clock.scale.setScalar(0.4); A(clock, -0.6, 2.0, 0.3); clock.userData.hand.rotation.z = -T * 4; qMark.visible = true; qMark.scale.setScalar(0.35); A(qMark, 0.7, 1.8, 0.4); qMark.rotation.y = 0.3 * Math.sin(T * 3); }
    return shot('p4', 7.2, 1.2);
  },
  peligro(t, d, cue, T) {
    const tdn = cue.dinero ?? d * 0.1, tp = cue.policia ?? d * 0.35, tc = cue.cianuro ?? d * 0.7, to = cue.orina ?? d * 0.9;
    ped(DUO2);
    if (t < tp - 0.3) { coinPile.visible = true; coinPile.scale.setScalar(0.4); A(coinPile, 0, 0.18 + 1.0 * prog(t, 0.2, 2.0), 0.3); pir.visible = true; pir.scale.setScalar(0.45); A(pir, 0, 0.18, -0.3); return shot('p7', 7.0, 1.2); }
    bud(cop, -0.75, 0.3, 0.55, T, { look: [0.8, 0], rotY: 0.5, armR: 1.4, mood: t > tc ? 'o' : 'smile', mouthOpen: 0.8, eye: t > tc ? 1.3 : 1.1, blink: t > tc ? 1 : blinkAt(T, 0.3) });
    P(tube, t, tp, 0.9); A(tube, 0.6, 0.18, 0.3); tube.rotation.z = 0.1 * Math.sin(T * 3);
    if (t > tc - 0.2) { P(skull, t, tc - 0.2, 0.55); A(skull, 0.6, 1.8, 0.5); }
    return shot('p8', 7.2, 1.2);
  },
  final(t, d, cue, T) {
    const to = cue.oficiales ?? d * 0.3, tp = cue.pirata2 ?? d * 0.8;
    lightAt(DUO2); ground.visible = true;
    P(store, t, Math.min(to - 0.4, 0.2), 0.75); A(store, 0, 0, -0.8);
    if (t > to - 0.2) { P(tagOficial, t, to - 0.2, 0.75); A(tagOficial, 0, 2.15, 0); check.visible = true; check.scale.setScalar(0.3); A(check, 0.95, 2.15, 0.2); }
    bud(you, 0.7, 0.9, 0.45, T, { look: [-0.6, 0.3], rotY: -0.4, armR: 1.6 }); youBottle.visible = true;
    if (t > tp) { qMark.visible = true; qMark.scale.setScalar(Math.max(0.001, spring(prog(t, tp, tp + 0.4))) * 0.45); A(qMark, -0.9, 1.6, 1.0); qMark.rotation.y = 0.3 * Math.sin(T * 3); }
    return shot('p1', 8.0, 1.3);
  },
};
const lupaP = add((() => { const g = new THREE.Group(); const r = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.06, 10, 32), new THREE.MeshStandardMaterial({ color: 0x2a2a30 })); g.add(r);
  const gl = new THREE.Mesh(new THREE.CircleGeometry(0.37, 28), new THREE.MeshStandardMaterial({ color: 0xbfe6ff, transparent: true, opacity: 0.3 })); g.add(gl);
  const h = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.6, 10), new THREE.MeshStandardMaterial({ color: 0x5a3a1a })); h.position.set(0.4, -0.5, 0); h.rotation.z = 0.6; g.add(h); return g; })());

// ================================================================== SHALIMAR: UN ACCIDENTE Y UNA HISTORIA DE AMOR (frascos genéricos)
Object.assign(PALG, { s1: [0xff9ad0, 0xb03a8a], s2: [0x7ad0ff, 0x3a6ae0], s3: [0xffd23a, 0xc8803a], s4: [0xc89aff, 0x7a4ad8], s5: [0xffb03a, 0xe0603a], s6: [0x9ae08a, 0x3aa05a], s7: [0xffd23a, 0xff8a3a], s8: [0xff9ad0, 0xe0508a] });
const taj = add((() => { const g = new THREE.Group(); const w = new THREE.MeshStandardMaterial({ color: 0xf6f2ea });
  const base = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.3, 2.0), w); base.position.y = 0.15; g.add(base);
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.4, 1.4), w); body.position.y = 1.0; g.add(body);
  const door = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.9), new THREE.MeshStandardMaterial({ color: 0xc8b8a0 })); door.position.set(0, 0.8, 0.71); g.add(door);
  const dome = new THREE.Mesh(new THREE.SphereGeometry(0.75, 28, 18), w); dome.scale.y = 1.15; dome.position.y = 2.15; g.add(dome);
  const tip = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.5, 10), new THREE.MeshStandardMaterial({ color: 0xffc83a })); tip.position.y = 3.2; g.add(tip);
  [[-1.35, 0.85], [1.35, 0.85], [-1.35, -0.85], [1.35, -0.85]].forEach(([x, z]) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 2.4, 10), w); m.position.set(x, 1.5, z); g.add(m);
    const c = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 8), w); c.position.set(x, 2.8, z); g.add(c); }); return g; })());
const garden = add((() => { const g = new THREE.Group(); const pool = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.12, 4.5), new THREE.MeshStandardMaterial({ color: 0x5ab0ff })); pool.position.set(0, 0.06, 1.2); g.add(pool);
  for (let i = 0; i < 6; i++) [-1, 1].forEach(s => { const c = new THREE.Mesh(new THREE.ConeGeometry(0.22, 1.1, 10), new THREE.MeshStandardMaterial({ color: 0x2f8a4a })); c.position.set(s * 0.9, 0.55, -0.6 + i * 0.8); g.add(c); }); return g; })());
const jets = Array.from({ length: 5 }, () => add(new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 6), new THREE.MeshStandardMaterial({ color: 0xbfe6ff }))));
function setJets(T, base, n = 5) { jets.forEach((j, i) => { j.visible = i < n; const a = (T * 1.2 + i / n) % 1; j.position.copy(base).add(V(0.15 * Math.sin(i * 2), Math.sin(a * Math.PI) * 0.9, (i - 2) * 0.6)); }); }
const emperor = buddyG(0x7a6aff), empress = buddyG(0xff6fb0);
const crownE = crown2.clone(); emperor.userData.body.add(crownE); crownE.position.y = 2.0; crownE.scale.setScalar(0.7);
const veil = new THREE.Mesh(new THREE.SphereGeometry(0.95, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2.2), new THREE.MeshStandardMaterial({ color: 0xffd0e8, side: THREE.DoubleSide })); veil.position.y = 1.35; empress.userData.body.add(veil);
const jbottle = bottleG(0xc8b0ff, 'PARFUM');
const vial = bottleG(0xfff2d0, 'VANILLINE');
const jguer = buddyG(0x4f8dff); { const m = new THREE.Mesh(new THREE.CapsuleGeometry(0.06, 0.45, 4, 8), new THREE.MeshStandardMaterial({ color: 0x2a1a10 })); m.rotation.z = Math.PI / 2; m.position.set(0, 1.15, 0.85); jguer.userData.body.add(m); }
const shal = bottleG(0xffc46b, 'PARFUM');
const y1925 = bigT('1925', 0xffc83a, 0.8), y100 = bigT('100', 0xffc83a, 0.9);
const eiffel = add((() => { const g = new THREE.Group(); const m = new THREE.MeshStandardMaterial({ color: 0x8a6a4a });
  [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(([x, z]) => { const l = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.09, 2.2, 6), m); l.position.set(x * 0.35, 1.0, z * 0.35); l.rotation.set(-z * 0.3, 0, x * 0.3); g.add(l); });
  const d1 = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.08, 0.9), m); d1.position.y = 0.7; g.add(d1); const d2 = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.07, 0.45), m); d2.position.y = 1.6; g.add(d2);
  const top = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.12, 1.6, 6), m); top.position.y = 2.7; g.add(top); return g; })());
const notesS = [ING.bergamota(), ING.vainilla(), (() => { const g = new THREE.Group(); const s = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.0, 6), new THREE.MeshStandardMaterial({ color: 0x8a4a22 })); g.add(s);
  const tip = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 6), new THREE.MeshStandardMaterial({ color: 0xff6a2a })); tip.position.y = 0.52; g.add(tip); return g; })(), new THREE.Mesh(new RoundedBoxGeometry(0.7, 0.45, 0.12, 3, 0.1), new THREE.MeshStandardMaterial({ color: 0x6a3a1a }))].map(add);
const smokeS = Array.from({ length: 4 }, () => add(new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 8), new THREE.MeshStandardMaterial({ color: 0xdddddd, transparent: true, opacity: 0.6 }))));
const flan = add((() => { const g = new THREE.Group(); const pl = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.06, 28), new THREE.MeshStandardMaterial({ color: 0xffffff })); g.add(pl);
  const f = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.62, 0.55, 28), new THREE.MeshStandardMaterial({ color: 0xffe08a })); f.position.y = 0.32; g.add(f);
  const c = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.08, 28), new THREE.MeshStandardMaterial({ color: 0xa0521a })); c.position.y = 0.62; g.add(c); return g; })());
const beaux = buddyG(0x3a3a4a); { const m = new THREE.Mesh(new THREE.CapsuleGeometry(0.07, 0.5, 4, 8), new THREE.MeshStandardMaterial({ color: 0xdddddd })); m.rotation.z = Math.PI / 2; m.position.set(0, 1.15, 0.85); beaux.userData.body.add(m); }
const tagN5 = cartel(['N.º 5'], 1.1, 0.6);
const fan = add((() => { const g = new THREE.Group(); const m = new THREE.MeshStandardMaterial({ color: 0x3a6ae0, side: THREE.DoubleSide }); const f = new THREE.Mesh(new THREE.CircleGeometry(0.9, 24, Math.PI * 0.15, Math.PI * 0.7), m); g.add(f);
  for (let i = 0; i < 7; i++) { const r = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.85, 0.03), new THREE.MeshStandardMaterial({ color: 0xbfd0ff })); const a = Math.PI * 0.15 + (i / 6) * Math.PI * 0.7; r.position.set(Math.cos(a) * 0.42, Math.sin(a) * 0.42, 0.02); r.rotation.z = a - Math.PI / 2; g.add(r); } return g; })());
const cake = add((() => { const g = new THREE.Group(); const c = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.6, 28), new THREE.MeshStandardMaterial({ color: 0xff9ad0 })); c.position.y = 0.3; g.add(c);
  const ic = new THREE.Mesh(new THREE.CylinderGeometry(0.82, 0.82, 0.12, 28), new THREE.MeshStandardMaterial({ color: 0xffffff })); ic.position.y = 0.62; g.add(ic);
  for (let i = 0; i < 5; i++) { const a = i / 5 * Math.PI * 2; const cd = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.3, 8), new THREE.MeshStandardMaterial({ color: 0x7ad0ff })); cd.position.set(Math.cos(a) * 0.5, 0.83, Math.sin(a) * 0.5); g.add(cd);
    const fl = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 6), new THREE.MeshStandardMaterial({ color: 0xffb03a })); fl.position.set(Math.cos(a) * 0.5, 1.02, Math.sin(a) * 0.5); g.add(fl); } return g; })());
const SCENES = {
  gancho(t, d, cue, T) {
    const ta = cue.accidente ?? d * 0.35, tm = cue.amor ?? d * 0.8;
    ped(DUO2);
    shal.visible = true; shal.scale.setScalar(0.55); A(shal, 0, 0.18, 0); spin(shal, T);
    if (t > ta - 0.2) { const k = prog(t, ta - 0.2, ta + 0.3); vial.visible = true; vial.scale.setScalar(0.25); A(vial, -1.0 + 0.3 * k, 1.8 + 0.4 * k, 0.4); vial.rotation.z = -1.6 * k; setMist(t, DUO2.clone().add(V(-0.6, 2.0, 0.4)), V(0.7, -1, 0).normalize(), ta, [1, 0.9, 0.6]); }
    if (t > tm) setHearts(t, DUO2.clone().add(V(0, 2.0, 0.3)), tm, 4, 0.6);
    return shot('s1', 7.0, 1.3);
  },
  amor(t, d, cue, T) {
    const tj = cue.jardines ?? d * 0.2, tm = cue.mumtaz ?? d * 0.5, tt = cue.taj ?? d * 0.82;
    lightAt(DUO2); ground.visible = true;
    if (t < tt - 0.4) {
      P(garden, t, tj - 0.4, 0.9); A(garden, 0, 0, -1.4); setJets(T, DUO2.clone().add(V(0, 0.1, -0.3)));
      bud(emperor, -0.5, 1.2, 0.55, T, { look: [0.8, 0.1], rotY: 0.5 });
      if (t > tm - 0.4) { bud(empress, 0.5, 1.2, 0.55, T, { look: [-0.8, 0.1], rotY: -0.5 }); setHearts(t, DUO2.clone().add(V(0, 1.6, 1.3)), tm, 4, 0.4); }
      return shot('s2', 7.6, 1.2, 2.6);
    }
    P(taj, t, tt - 0.4, 0.75); A(taj, 0, 0, -0.8); garden.visible = true; garden.scale.setScalar(0.9); A(garden, 0, 0, 0.6);
    sparks.visible = true; setSparks(T, DUO2.clone().add(V(0, 2.0, -0.6)), 1.4, 1.8, 0xffd0e8, 1);
    return shot('s2', 8.4, 1.6, 2.6);
  },
  accidente(t, d, cue, T) {
    const tj = cue.jacques ?? d * 0.15, tv = cue.vainillina ?? d * 0.4, tk = cue.jicky ?? d * 0.7, tp = cue.pasaba ?? d * 0.88;
    ped(DUO2);
    bud(jguer, -0.85, 0.3, 0.55, T, { look: [0.8, 0.1], rotY: 0.6, armR: 1.8, mood: t > tp ? 'o' : 'smile', mouthOpen: 0.8, eye: t > tp ? 1.3 : 1.1, blink: t > tp ? 1 : blinkAt(T, 0.3) });
    if (t > tv - 0.3) { P(vial, t, tv - 0.3, 0.32); const k = prog(t, tk - 0.2, tk + 0.4); A(vial, 0.05 + 0.25 * k, 0.6 + 1.5 * k, 0.4); vial.rotation.z = -2.0 * k;
    }
    if (t > tk - 0.3) { P(jbottle, t, tk - 0.3, 0.5); A(jbottle, 0.75, 0.18, 0.2); spin(jbottle, T, 0.15); }
    if (t > tk + 0.2) setMist(t, DUO2.clone().add(V(0.5, 2.0, 0.4)), V(0.3, -1, 0).normalize(), tk + 0.2, [1, 0.92, 0.6]);
    if (t > tp) { qMark.visible = true; qMark.scale.setScalar(Math.max(0.001, spring(prog(t, tp, tp + 0.4))) * 0.4); A(qMark, -0.9, 2.0, 0.4); qMark.rotation.y = 0.3 * Math.sin(T * 3); }
    return shot('s3', 7.2, 1.3);
  },
  nacio(t, d, cue, T) {
    const tn = cue.nacio ?? d * 0.3, ta = cue.anio ?? d * 0.8;
    ped(DUO2);
    if (t < ta - 0.6) { const t0 = Math.min(tn - 0.4, 0.2); P(shal, t, t0, 0.65); A(shal, 0, 0.18 + 2.5 * (1 - easeOut(prog(t, t0, t0 + 0.4))), 0); spin(shal, T); if (t > tn) { sparks.visible = true; setSparks(T, DUO2.clone().add(V(0, 1.2, 0)), 1.2, 1.6, 0xffd23a, 1); } return shot('s7', 7.0, 1.2); }
    P(eiffel, t, ta - 0.6, 0.85); A(eiffel, -0.8, 0.18, -0.4);
    shal.visible = true; shal.scale.setScalar(0.4); A(shal, 0.6, 0.18, 0.4);
    P(y1925, t, ta - 0.2, 0.42); A(y1925, 0.55, 1.7, -0.3);
    return shot('s4', 7.6, 1.4);
  },
  olor(t, d, cue, T) {
    const ts = [cue.bergamota ?? d * 0.3, cue.vainilla ?? d * 0.4, cue.incienso ?? d * 0.5, cue.cuero ?? d * 0.6], tf = cue.familia ?? d * 0.85;
    ped(DUO2);
    shal.visible = true; shal.scale.setScalar(0.42); A(shal, 0, 0.18, -0.2); spin(shal, T);
    notesS.forEach((n, i) => { P(n, t, ts[i] - 0.2, 0.7); const a = T * 0.7 + i / 4 * Math.PI * 2; A(n, Math.cos(a) * 1.4, 1.3 + 0.3 * Math.sin(a * 2), Math.sin(a) * 1.0); });
    if (notesS[2].visible) smokeS.forEach((m, i) => { const a = (T * 0.6 + i / 4) % 1; m.visible = true; m.position.copy(notesS[2].position).add(V(0.05 * Math.sin(T * 3 + i), 0.5 + a * 0.8, 0)); m.scale.setScalar(0.5 + a); m.material.opacity = 0.6 * (1 - a); });
    if (t > tf - 0.3) { rowS.forEach((b, i) => { P(b, t, tf - 0.3 + i * 0.12, 0.28); A(b, -1.0 + i * 0.5, 0.18, 1.0); }); }
    return shot('s5', 7.4, 1.3);
  },
  postre(t, d, cue, T) {
    const tb = cue.beaux ?? d * 0.3, tp = cue.postre ?? d * 0.6, ts = cue.shalimar2 ?? d * 0.88;
    ped(DUO2);
    bud(beaux, -0.75, 0.3, 0.55, T, { look: [0.8, 0.1], rotY: 0.5, armR: 1.6, mood: 'smile' });
    if (t > tb - 0.2 && t < tp - 0.2) { P(tagN5, t, tb - 0.2, 0.7); A(tagN5, -0.75, 2.1, 0.4); }
    if (t > tp - 0.3 && t < ts - 0.3) { P(flan, t, tp - 0.3, 0.75); A(flan, 0.7, 0.18, 0.3); flan.rotation.y = T * 0.5; }
    if (t > ts - 0.3) { P(shal, t, ts - 0.3, 0.5); A(shal, 0.7, 0.18, 0.3); spin(shal, T); sparks.visible = true; setSparks(T, DUO2.clone().add(V(0.7, 1.2, 0.3)), 0.8, 1.2, 0xffd23a, 1); }
    return shot('s3', 7.2, 1.3);
  },
  frasco(t, d, cue, T) {
    const ta = cue.abanico ?? d * 0.4, tf = cue.fuentes ?? d * 0.75;
    lightAt(DUO2); ground.visible = true;
    if (t < tf - 0.3) {
      ped(DUO2); shal.visible = true; shal.scale.setScalar(0.5); A(shal, -0.7, 0.18, 0); spin(shal, T);
      if (t > ta - 0.3) { P(fan, t, ta - 0.3, 0.9); A(fan, 0.65, 1.2, 0.3); fan.rotation.y = 0.3 * Math.sin(T); }
      return shot('s2', 7.2, 1.2);
    }
    garden.visible = true; garden.scale.setScalar(1); A(garden, 0, 0, -1.4); setJets(T, DUO2.clone().add(V(0, 0.1, -0.3)));
    fan.visible = true; fan.scale.setScalar(1.1); A(fan, 0, 1.6, 0.8); fan.rotation.y = 0.2 * Math.sin(T);
    return shot('s2', 7.6, 1.2, 2.6);
  },
  cien(t, d, cue, T) {
    const tc = cue.cien ?? d * 0.3, tv = cue.vende ?? d * 0.8;
    ped(DUO2);
    P(cake, t, Math.min(tc - 0.3, 0.2), 0.85); A(cake, 0, 0.18, 0); cake.rotation.y = T * 0.4;
    P(y100, t, tc, 0.5); A(y100, 0, 1.7, 0.4); y100.rotation.y = 0.2 * Math.sin(T);
    if (t > tc) setConfetti(DUO2, t, tc);
    if (t > tv - 0.3) { shal.visible = true; shal.scale.setScalar(0.35); A(shal, 1.0, 0.18, 0.6); spin(shal, T); }
    return shot('s8', 7.2, 1.3);
  },
  final(t, d, cue, T) {
    const tv = cue.verdad ?? d * 0.15, tb = cue.bueno ?? d * 0.6, to = cue.olido ?? d * 0.85;
    ped(DUO2);
    shal.visible = true; shal.scale.setScalar(0.5); A(shal, -0.6, 0.18, 0); spin(shal, T);
    bud(you, 0.75, 0.4, 0.55, T, { look: [-0.8, 0.1], rotY: -0.5, mood: t > tb ? 'smile' : 'o', mouthOpen: 0.7 });
    if (t > tv && t < tb) { qMark.visible = true; qMark.scale.setScalar(Math.max(0.001, spring(prog(t, tv, tv + 0.4))) * 0.45); A(qMark, 0, 2.0, 0.3); qMark.rotation.y = 0.3 * Math.sin(T * 3); }
    if (t > tb) setHearts(t, DUO2.clone().add(V(0.7, 1.9, 0.4)), tb, 3, 0.4);
    if (t > to) { qMark.visible = true; qMark.scale.setScalar(Math.max(0.001, spring(prog(t, to, to + 0.4))) * 0.45); A(qMark, 0.9, 2.0, 0.4); qMark.rotation.y = 0.3 * Math.sin(T * 3); }
    return shot('s1', 7.2, 1.2);
  },
};
const rowS = [0xff9ad0, 0x7ad0ff, 0xffc46b, 0x9ae08a, 0xc89aff].map(c => bottleG(c));

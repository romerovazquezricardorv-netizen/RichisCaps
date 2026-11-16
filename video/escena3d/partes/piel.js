// ================================================================== ¿POR QUÉ EL MISMO PERFUME HUELE DISTINTO EN CADA PERSONA?
Object.assign(PALG, { e1: [0xff9ad0, 0xe0508a], e2: [0x7ad0ff, 0x3a8ae0], e3: [0xffd23a, 0xff8a3a], e4: [0xff8a5a, 0xc04a2a], e5: [0x9ae08a, 0x3aa05a], e6: [0xffb03a, 0xe0603a], e7: [0xc89aff, 0x7a4ad8], e8: [0xd0d8e0, 0x8a96a6] });
const sameB = bottleG(0xff9ad0, 'PARFUM'), sameB2 = bottleG(0xff9ad0, 'PARFUM');
function skinG(col) { const g = new THREE.Group(); const s = new THREE.Mesh(new RoundedBoxGeometry(2.0, 0.35, 1.2, 4, 0.15), new THREE.MeshStandardMaterial({ color: col })); s.position.y = 0.18; g.add(s); return add(g); }
const oily = skinG(0xf2b89a), dry = skinG(0xe8c0a8);
const oilD = Array.from({ length: 7 }, (_, i) => { const m = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 8), new THREE.MeshStandardMaterial({ color: 0xffe08a, roughness: 0.05 })); m.scale.y = 0.5; m.position.set(-0.7 + i * 0.23, 0.38, (i % 2 ? 0.25 : -0.2)); oily.add(m); return m; });
const crk = Array.from({ length: 6 }, (_, i) => { const m = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.02, 0.03), new THREE.MeshStandardMaterial({ color: 0x9a6a5a })); m.position.set(-0.6 + (i % 3) * 0.6, 0.36, -0.3 + Math.floor(i / 3) * 0.5); m.rotation.y = i * 0.9; dry.add(m); return m; });
const vapor = Array.from({ length: 10 }, () => add(new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 6), new THREE.MeshStandardMaterial({ color: 0xff9ad0, transparent: true, opacity: 0.8 }))));
function setVapor(T, c, speed, h, n = 10) { vapor.forEach((v, i) => { v.visible = i < n; const a = (T * speed + i / n) % 1; v.position.copy(c).add(V(-0.8 + (i * 0.37) % 1.6, 0.4 + a * h, (i % 3 - 1) * 0.3)); v.material.opacity = 0.8 * (1 - a); }); }
const vapor2 = vapor.map(v => add(v.clone()));
function setVapor2(T, c, speed, h, n = 10) { vapor2.forEach((v, i) => { v.visible = i < n; const a = (T * speed + i / n) % 1; v.position.copy(c).add(V(-0.8 + (i * 0.37) % 1.6, 0.4 + a * h, (i % 3 - 1) * 0.3)); }); }
const garlic = add((() => { const g = new THREE.Group(); const m = new THREE.MeshStandardMaterial({ color: 0xf6f0e0 }); for (let i = 0; i < 6; i++) { const c = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 10), m); const a = i / 6 * Math.PI * 2; c.position.set(Math.cos(a) * 0.15, 0.25, Math.sin(a) * 0.15); c.scale.y = 1.3; g.add(c); }
  const tip = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.3, 8), m); tip.position.y = 0.6; g.add(tip); return g; })());
const chili = add((() => { const g = new THREE.Group(); const c = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.8, 12), new THREE.MeshStandardMaterial({ color: 0xdd2a2a })); c.rotation.z = Math.PI / 2 + 0.3; c.position.y = 0.2; g.add(c);
  const st = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.15, 8), new THREE.MeshStandardMaterial({ color: 0x3a9a4a })); st.position.set(-0.42, 0.33, 0); st.rotation.z = 1.2; g.add(st); return g; })());
const creamJar = add((() => { const g = new THREE.Group(); const j = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.45, 24), new THREE.MeshStandardMaterial({ color: 0xffffff })); j.position.y = 0.22; g.add(j);
  const l = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.15, 24), new THREE.MeshStandardMaterial({ color: 0x7ad0ff })); l.position.y = 0.52; g.add(l); return g; })());
const soapB = add(new THREE.Mesh(new RoundedBoxGeometry(0.7, 0.3, 0.45, 3, 0.12), new THREE.MeshStandardMaterial({ color: 0x9ae0ff })));
const dna = add((() => { const g = new THREE.Group(); for (let i = 0; i < 14; i++) { const a = i * 0.6, y = i * 0.15; [0, Math.PI].forEach((o, k) => { const s = new THREE.Mesh(new THREE.SphereGeometry(0.08, 10, 8), new THREE.MeshStandardMaterial({ color: k ? 0xff6fb0 : 0x7ad0ff })); s.position.set(Math.cos(a + o) * 0.35, y, Math.sin(a + o) * 0.35); g.add(s); });
  const r = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.7, 6), new THREE.MeshStandardMaterial({ color: 0xdddddd })); r.position.y = y; r.rotation.z = Math.PI / 2; r.rotation.y = -a; g.add(r); } return g; })());
const muskMol = moleculeG([0xffffff, 0xffe0f0, 0xe0f0ff]);
const tagGym = cartel(['GYM'], 1.0, 0.5), tagHoras = cartel(['ESPERA', 'UNAS HORAS']);
const SCENES = {
  gancho(t, d, cue, T) {
    const ta = cue.amigo ?? d * 0.2, tt = cue.ti ?? d * 0.75;
    if (t < ta) { ped(DUO2); sameB.visible = true; sameB.scale.setScalar(0.5); A(sameB, 0, 0.18, 0); spin(sameB, T); return shot('e1', 7.0, 1.2); }
    ped(DUO2); ped(DUO3, true);
    bud(pal, -0.4, 0.3, 0.55, T, { look: [0.6, 0.3], rotY: 0.3, armR: 2.0 }); sameB.visible = true; sameB.scale.setScalar(0.32); A(sameB, 0.6, 0.18, 0); setHearts(t, DUO2.clone().add(V(-0.4, 1.4, 0.3)), ta, 3, 0.4);
    bud(you, -0.4, 0.3, 0.55, T, { look: [0.6, 0.0], rotY: 0.3, mood: t > tt ? 'frown' : 'smile', eye: t > tt ? 0.6 : 1.0, brow: t > tt ? 0.8 : 0 }, DUO3); sameB2.visible = true; sameB2.scale.setScalar(0.32); A(sameB2, 0.6, 0.18, 0, DUO3);
    if (t > tt) { qMark.visible = true; qMark.scale.setScalar(Math.max(0.001, spring(prog(t, tt, tt + 0.4))) * 0.35); A(qMark, -0.4, 1.4, 0.3, DUO3); qMark.rotation.y = 0.3 * Math.sin(T * 3); }
    return splitShot('e5', 'e4', 7.6, 0.8);
  },
  piel(t, d, cue, T) {
    const tg = cue.grasa ?? d * 0.3, ts = cue.seca ?? d * 0.75;
    if (t < tg) { ped(DUO2); bud(you, 0, 0.3, 0.6, T, { look: [0, 0.2], armL: 1.2 }); return shot('e1', 7.0, 1.2); }
    ped(DUO2); ped(DUO3, true);
    oily.visible = true; oily.scale.setScalar(0.8); A(oily, 0, 0.18, 0); setVapor(T, DUO2.clone().add(V(0, 0.18, 0)), 0.3, 0.7, 8);
    dry.visible = true; dry.scale.setScalar(0.8); A(dry, 0, 0.18, 0, DUO3); if (t > ts - 0.3) setVapor2(T, DUO3.clone().add(V(0, 0.18, 0)), 1.0, 1.6, 8);
    return splitShot('e3', 'e8', 6.6, 0.6);
  },
  temp(t, d, cue, T) {
    const tt = cue.temperatura ?? d * 0.15, te = cue.evapora ?? d * 0.35, tf = cue.fuerte ?? d * 0.5, tg = cue.gym ?? d * 0.82;
    ped(DUO2);
    bud(you, -0.5, 0.3, 0.6, T, { look: [0.4, 0.2], rotY: 0.3, mood: 'smile', armR: t > tg - 0.3 ? 2.4 + 0.4 * Math.sin(T * 8) : 0.6 });
    thermo.visible = true; thermo.scale.setScalar(0.55); A(thermo, 0.85, 0.18, 0.2); thermo.userData.fill.scale.y = 0.6 + 1.6 * easeOut(prog(t, tt, tt + 1.2));
    if (t > te - 0.2) setVapor(T, DUO2.clone().add(V(-0.5, 0.9, 0.4)), 0.9, 1.4, 10);
    if (t > tg - 0.3) { you.userData.hand.add(dumbbell); dumbbell.visible = true; P(tagGym, t, tg - 0.3, 0.6); A(tagGym, 0.8, 2.1, 0.4);
      sweat.forEach((s, i) => { s.visible = true; const a = (T * 1.5 + i / 6) % 1; A(s, -0.9 + i * 0.15, 1.5 - a * 0.8, 0.6); }); }
    return shot('e4', 7.2, 1.3);
  },
  bacterias(t, d, cue, T) {
    const tv = cue.vive ?? d * 0.2, tb = cue.bacterias ?? d * 0.5, tm = cue.mezclan ?? d * 0.8;
    ped(DUO2);
    oily.visible = true; oily.scale.setScalar(1.0); A(oily, 0, 0.18, 0);
    bugs.forEach((b, i) => { if (t > tv - 0.3 + i * 0.12) { b.visible = true; b.scale.setScalar(0.35); const a = T * 0.8 + i * 0.9; A(b, Math.cos(a) * 0.8, 0.62 + 0.05 * Math.abs(Math.sin(T * 6 + i)), Math.sin(a) * 0.45); b.rotation.y = -a; } });
    if (t > tm - 0.3) { sameB.visible = true; sameB.scale.setScalar(0.3); A(sameB, 0.9, 1.4, 0.2); sameB.rotation.z = 0.9; setMist(t, DUO2.clone().add(V(0.6, 1.4, 0.2)), V(-0.6, -1, 0).normalize(), tm - 0.3, [1, 0.6, 0.85]); }
    return shot('e5', 6.6, 0.9, 2.2);
  },
  comida(t, d, cue, T) {
    const tj = cue.jabon ?? d * 0.25, tc = cue.comes ?? d * 0.5, ta = cue.ajo ?? d * 0.7;
    ped(DUO2);
    if (t < tc - 0.3) { P(creamJar, t, 0.15, 0.85); A(creamJar, -0.55, 0.18, 0.2); P(soapB, t, tj - 0.2, 1.0); A(soapB, 0.6, 0.35, 0.2); soapB.rotation.y = 0.3 * Math.sin(T); return shot('e2', 6.8, 1.0); }
    P(garlic, t, tc - 0.3, 1.0); A(garlic, -0.6, 0.18, 0.2); garlic.rotation.y = T * 0.5;
    P(chili, t, tc - 0.1, 1.0); A(chili, 0.1, 0.18, 0.6); chili.rotation.y = T * 0.4;
    if (t > ta - 0.3) { bud(you, 0.75, 0.2, 0.5, T, { mood: 'o', mouthOpen: 0.7, look: [-0.8, 0], rotY: -0.5, eye: 1.2 }); sweat.forEach((s, i) => { s.visible = i < 3; const a = (T * 1.5 + i / 3) % 1; A(s, 0.5 + i * 0.2, 1.4 - a * 0.7, 0.6); });
      setStink(t, DUO2.clone().add(V(0.75, 1.3, 0.3)), ta - 0.3, 0.35); }
    return shot('e6', 7.0, 1.1);
  },
  nariz(t, d, cue, T) {
    const tn = cue.nariz ?? d * 0.3, tg = cue.genetica ?? d * 0.6, ta = cue.almizcles ?? d * 0.85;
    ped(DUO2);
    if (t < tg - 0.3) {
      bud(you, -0.6, 0.3, 0.55, T, { look: [0.6, 0.1], rotY: 0.4 }); sameB.visible = true; sameB.scale.setScalar(0.25); you.userData.hand.add(youBottle); youBottle.visible = true;
      if (t > tn - 0.3) { bud(pal, 0.6, 0.3, 0.55, T, { look: [-0.6, 0.1], rotY: -0.4, eye: 0.5, blink: 0.4 }); pal.userData.nose.visible = true; pal.userData.nose.scale.setScalar(1 + 0.5 * spring(prog(t, tn, tn + 0.4))); }
      return shot('e7', 7.2, 1.3);
    }
    P(dna, t, tg - 0.3, 0.9); A(dna, -0.6, 0.3, 0); dna.rotation.y = T;
    if (t > ta - 0.4) { P(muskMol, t, ta - 0.4, 0.55); A(muskMol, 0.7, 1.5, 0.3); muskMol.rotation.y = T;
      bud(pal, 0.7, 0.4, 0.45, T, { look: [0, 0.6], eye: 1.2, mood: 'o', mouthOpen: 0.6, blink: 1 }); pal.userData.nose.visible = true;
      qMark.visible = true; qMark.scale.setScalar(Math.max(0.001, spring(prog(t, ta, ta + 0.4))) * 0.35); A(qMark, 1.1, 1.9, 0.4); qMark.rotation.y = 0.3 * Math.sin(T * 3); }
    return shot('e7', 7.2, 1.2);
  },
  crema(t, d, cue, T) {
    const ts = cue.seca2 ?? d * 0.25, tc = cue.crema ?? d * 0.45, tg = cue.agarra ?? d * 0.7, tdu = cue.dura ?? d * 0.88;
    ped(DUO2);
    dry.visible = true; dry.scale.setScalar(0.85); A(dry, 0, 0.18, 0.3); crk.forEach(c => c.visible = t < tc + 0.3);
    if (t > tc - 0.3) { P(creamJar, t, tc - 0.3, 0.6); A(creamJar, -0.75, 0.55, -0.1); }
    if (t > tg - 0.3) { setVapor(T, DUO2.clone().add(V(0, 0.4, 0.3)), 0.25, 0.9, 8); }
    if (t > tdu - 0.2) { clock.visible = true; clock.scale.setScalar(0.4); A(clock, 0.7, 1.9, 0.2); clock.userData.hand.rotation.z = -T * 3; check.visible = true; check.scale.setScalar(0.3); A(check, -0.2, 1.9, 0.4); }
    return shot('e2', 6.8, 0.9, 2.1);
  },
  consejo(t, d, cue, T) {
    const to = cue.otro ?? d * 0.4, th = cue.horas ?? d * 0.85;
    ped(DUO2);
    if (t < to + 0.2) { bud(pal, -0.6, 0.3, 0.55, T, { look: [0.6, 0.1], rotY: 0.4 }); setHearts(t, DUO2.clone().add(V(-0.6, 1.5, 0.3)), 0.2, 3, 0.4);
      bud(you, 0.6, 0.3, 0.55, T, { look: [-0.6, 0.1], rotY: -0.4, mood: 'o', mouthOpen: 0.6 }); if (t > to - 0.3) { xMark.visible = true; xMark.scale.setScalar(0.35); A(xMark, 0, 1.6, 0.6); } return shot('e8', 7.2, 1.2); }
    bud(you, -0.3, 0.3, 0.6, T, { look: [0.4, -0.3], rotY: 0.3, eye: 0.6, blink: 0.4, armR: 1.4 }); you.userData.nose.visible = true;
    sameB.visible = true; sameB.scale.setScalar(0.3); A(sameB, 0.85, 0.18, 0.3);
    if (t > th - 0.4) { P(tagHoras, t, th - 0.4, 0.7); A(tagHoras, 0.5, 2.1, 0.4); clock.visible = true; clock.scale.setScalar(0.35); A(clock, -0.8, 2.0, 0.3); clock.userData.hand.rotation.z = -T * 4; }
    return shot('e5', 7.2, 1.2);
  },
  final(t, d, cue, T) {
    const tp = cue.pasado ?? d * 0.5;
    ped(DUO2);
    bud(you, -0.4, 0.3, 0.6, T, { look: [0.6, 0.1], rotY: 0.3, mood: 'o', mouthOpen: 0.6 }); youBottle.visible = true;
    sameB.visible = true; sameB.scale.setScalar(0.38); A(sameB, 0.75, 0.18, 0.2); spin(sameB, T);
    if (t > tp) { qMark.visible = true; qMark.scale.setScalar(Math.max(0.001, spring(prog(t, tp, tp + 0.4))) * 0.45); A(qMark, -0.4, 2.0, 0.4); qMark.rotation.y = 0.3 * Math.sin(T * 3); }
    return shot('e1', 7.0, 1.2);
  },
};
const _resetE = resetWorld;
resetWorld = function () { _resetE(); pal.userData.nose.scale.setScalar(1); pal.userData.nose.visible = false; crk.forEach(c => c.visible = true); };

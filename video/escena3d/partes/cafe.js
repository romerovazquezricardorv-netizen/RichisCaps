// ================================================================== ¿OLER CAFÉ "LIMPIA" LA NARIZ?
Object.assign(PALG, { c1: [0xc8905a, 0x7a4a2a], c2: [0x9a7ad8, 0x5a3aa0], c3: [0x7ad0ff, 0x3a8ae0], c4: [0xffd23a, 0xff8a3a], c5: [0xd0d8e0, 0x8a96a6], c6: [0x9ae08a, 0x3aa05a], c7: [0xff9ad0, 0xe0508a] });
const jar = new THREE.Group(); { const g = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 1.1, 28, 1, true), new THREE.MeshStandardMaterial({ color: 0xeaf6ff, transparent: true, opacity: 0.35, side: THREE.DoubleSide })); g.position.y = 0.55; jar.add(g);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.05, 28), new THREE.MeshStandardMaterial({ color: 0xeaf6ff, transparent: true, opacity: 0.5 })); jar.add(base);
  for (let i = 0; i < 34; i++) { const b = beanG(); const a = i * 2.4, r = 0.12 + (i % 4) * 0.1; b.position.set(Math.cos(a) * r, 0.1 + Math.floor(i / 7) * 0.13, Math.sin(a) * r); b.rotation.set(i, i * 0.7, 0); jar.add(b); } }
add(jar);
const loose = Array.from({ length: 9 }, (_, i) => add(beanG()));
const cup = new THREE.Group(); { const w = new THREE.MeshStandardMaterial({ color: 0xffffff }); const c = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.38, 0.75, 28), w); c.position.y = 0.38; cup.add(c);
  const h = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.06, 8, 20), w); h.position.set(0.55, 0.42, 0); cup.add(h); const cf = new THREE.Mesh(new THREE.CircleGeometry(0.46, 28), new THREE.MeshStandardMaterial({ color: 0x5a3218 })); cf.rotation.x = -Math.PI / 2; cf.position.y = 0.72; cup.add(cf);
  const pl = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.06, 32), w); cup.add(pl); }
add(cup);
const steamC = Array.from({ length: 3 }, () => add(new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.04, 8, 20, Math.PI), new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.7 }))));
function setSteamC(T, base) { steamC.forEach((m, i) => { const a = (T * 0.5 + i / 3) % 1; m.visible = true; m.position.copy(base).add(V(0.1 * Math.sin(T * 3 + i), a * 1.0, 0)); m.rotation.z = i % 2 ? 0 : Math.PI; m.scale.setScalar(0.6 + a * 0.5); m.material.opacity = 0.7 * (1 - a); }); }
const shelfB = [0xff9ad0, 0x7ad0ff, 0xffc46b, 0x9ae08a, 0xc89aff].map(c => bottleG(c));
const strips = Array.from({ length: 8 }, () => stripG());
const lemon1 = add(ING.limon());
const tagEst = cartel(['ESTUDIO', '2011']);
const tagReset = cartel(['⟳ RESET']);
const tagCanal1 = cartel(['CANAL 1'], 1.3, 0.6), tagCanal2 = cartel(['CANAL 2'], 1.3, 0.6);
const tagIgual = cartel(['CAFÉ = AIRE'], 2.0, 0.8);
const tagCodo = cartel(['TU OLOR', 'NEUTRO']);
const sci = buddyG(0x3ad0a0), sci2 = buddyG(0xffb03a);
const coat = new THREE.Group(); { const m = new THREE.MeshStandardMaterial({ color: 0xffffff }); const c = new THREE.Mesh(new THREE.CylinderGeometry(0.78, 0.86, 0.9, 24, 1, true), m); c.material.side = THREE.DoubleSide; c.position.y = 0.6; coat.add(c); }
const coat2 = coat.clone(); sci.userData.body.add(coat); sci2.userData.body.add(coat2);
const glasses = new THREE.Group(); { const m = new THREE.MeshStandardMaterial({ color: 0x15151c }); [-0.27, 0.27].forEach(x => { const r = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.035, 8, 20), m); r.position.set(x, 1.45, 0.75); glasses.add(r); }); }
sci.userData.body.add(glasses);
const sniff = (b, T, o = {}) => ({ hop: hopF(T, 2, 0.03), mood: 'smile', eye: 0.5, look: [0, 0.3], blink: 0.4, ...o });
const SCENES = {
  gancho(t, d, cue, T) {
    const tc = cue.cafe ?? d * 0.2, tl = cue.limpia ?? d * 0.75;
    ped(DUO2);
    shelfB.forEach((b, i) => { b.visible = true; b.scale.setScalar(0.32); A(b, -1.2 + i * 0.6, 0.18, -0.9); spin(b, T + i); });
    P(jar, t, tc - 0.3, 0.9); A(jar, -0.4, 0.18, 0.4);
    if (t > tl - 0.6) { bud(you, 0.75, 0.6, 0.5, T, sniff(you, T, { look: [-0.8, -0.2], rotY: -0.6 })); you.userData.nose.visible = true; }
    if (t > tl) { sparks.visible = true; setSparks(T, DUO2.clone().add(V(-0.2, 1.4, 0.5)), 0.7, 0.8, 0x7ad0ff, 1); }
    return shot('c1', 7.0, 1.2);
  },
  fatiga(t, d, cue, T) {
    const tf = cue.fatiga ?? d * 0.2, tm = cue.muchos ?? d * 0.4, tc = cue.cansa ?? d * 0.55, ti = cue.igual ?? d * 0.7, tp = cue.propio ?? d * 0.85;
    ped(DUO2);
    const tired = t > tc;
    bud(you, 0, 0.2, 0.62, T, { mood: tired ? 'frown' : 'smile', eye: tired ? 0.35 : 1.0, blink: tired ? 0.3 : blinkAt(T, 0.3), look: [0, -0.1], armR: 1.6 + 0.2 * Math.sin(T * 5), hop: tired ? 0 : hopF(T, 3, 0.05) });
    you.userData.nose.visible = true;
    strips.slice(0, 6).forEach((s, i) => { P(s, t, tm - 0.3 + i * 0.15, 0.6); const a = -1.1 + i * 0.44; A(s, a, 0.18 + 0.4 * Math.abs(Math.sin(i)), 0.7 - Math.abs(a) * 0.3); s.rotation.z = -a * 0.3; });
    if (t > tc) { zzz.visible = true; A(zzz, 0.5, 2.1, 0.4); zzz.rotation.z = 0.1 * Math.sin(T * 2); }
    if (t > ti) { qMark.visible = true; qMark.scale.setScalar(Math.max(0.001, spring(prog(t, ti, ti + 0.4))) * 0.5); A(qMark, -0.7, 2.1, 0.3); qMark.rotation.y = 0.3 * Math.sin(T * 3); }
    if (t > tp - 0.2) { youBottle.visible = true; xMark.visible = true; xMark.scale.setScalar(Math.max(0.001, spring(prog(t, tp - 0.2, tp + 0.2))) * 0.35); A(xMark, 1.0, 1.4, 0.6); }
    return shot('c2', 7.2, 1.3);
  },
  idea(t, d, cue, T) {
    const tr = cue.reinicia ?? d * 0.4, tc = cue.canal ?? d * 0.8;
    ped(DUO2);
    bud(you, -0.75, 0.3, 0.55, T, sniff(you, T, { look: [0.8, -0.1], rotY: 0.6, eye: t > tr ? 1.3 : 0.5, blink: t > tr ? 1 : 0.4 })); you.userData.nose.visible = true;
    cup.visible = true; cup.scale.setScalar(0.7); A(cup, 0.7, 0.18, 0.3); setSteamC(T, DUO2.clone().add(V(0.7, 0.8, 0.3)));
    if (t > tr - 0.2 && t < tc - 0.3) { P(tagReset, t, tr - 0.2, 0.8); A(tagReset, 0, 2.15, 0.6); }
    if (t > tc - 0.3) { const sw = Math.floor((t - tc) * 3) % 2; tagCanal1.visible = sw === 0; tagCanal2.visible = sw === 1; [tagCanal1, tagCanal2].forEach(g => { g.scale.setScalar(0.8); A(g, 0, 2.15, 0.6); }); }
    return shot('c3', 7.2, 1.3);
  },
  estudio(t, d, cue, T) {
    const tp = cue.prueba ?? d * 0.25, t1 = cue.grupo1 ?? d * 0.4, t2 = cue.grupo2 ?? d * 0.5, t3 = cue.grupo3 ?? d * 0.6, tr = cue.resultado ?? d * 0.8;
    if (t < t1 - 0.05) {
      ped(DUO2);
      bud(sci, 0.6, 0.3, 0.6, T, { look: [-0.6, 0.2], rotY: -0.5, armR: 2.0 });
      P(tagEst, t, 0.1, 0.9); A(tagEst, -0.7, 2.1, 0.4);
      return shot('c5', 7.4, 1.3);
    }
    if (t < tr) {
      ped(DUO2); ped(DUO3, true);
      bud(you, 0.6, 0.3, 0.6, T, sniff(you, T, { look: [-0.8, -0.2], rotY: -0.6 })); you.userData.nose.visible = true;
      P(jar, t, t1, 0.75); A(jar, -0.6, 0.18, 0.2);
      if (t > t2 - 0.2) { P(lemon1, t, t2 - 0.2, 0.8); A(lemon1, -1.1, 0.5, 0.6); lemon1.rotation.y = T; }
      bud(pal, 0, 0.3, 0.6, T, { look: [0, 0.6], eye: t > t3 ? 1.3 : 0.6, blink: 1, mood: 'o', mouthOpen: 0.7 }, DUO3); pal.userData.nose && (pal.userData.nose.visible = true);
      if (t > t3) { qMark.visible = true; qMark.scale.setScalar(Math.max(0.001, spring(prog(t, t3, t3 + 0.4))) * 0.4); A(qMark, 0.8, 1.6, 0.3, DUO3); qMark.rotation.y = 0.3 * Math.sin(T * 3); }
      return splitShot('c1', 'c3');
    }
    ped(DUO2);
    jar.visible = true; jar.scale.setScalar(0.7); A(jar, -0.8, 0.18, 0);
    P(tagIgual, t, tr, 0.9); A(tagIgual, 0, 2.3, 0.5);
    bud(sci, 0.8, 0.3, 0.55, T, { mood: 'o', mouthOpen: 0.8, look: [-0.6, 0.2], rotY: -0.5, armR: 1.4, brow: 0.8 });
    return shot('c5', 7.4, 1.3);
  },
  otro(t, d, cue, T) {
    const tv2 = cue.ventaja ?? d * 0.3, ta = cue.acuerdo ?? d * 0.7;
    ped(DUO2);
    bud(sci, -0.8, 0.3, 0.55, T, { look: [0.8, 0.1], rotY: 0.6, mood: t > ta ? 'o' : 'frown', mouthOpen: 0.7, armR: 1.8 + 0.3 * Math.sin(T * 9) });
    bud(sci2, 0.8, 0.3, 0.55, T, { look: [-0.8, 0.1], rotY: -0.6, mood: t > tv2 ? 'smile' : 'smile', armR: 1.8 + 0.3 * Math.sin(T * 9 + 1) });
    if (t > tv2 - 0.2) { check.visible = true; check.scale.setScalar(Math.max(0.001, spring(prog(t, tv2 - 0.2, tv2 + 0.2))) * 0.35); A(check, 0.8, 1.9, 0.4); }
    if (t > ta - 0.2) { xMark.visible = true; xMark.scale.setScalar(Math.max(0.001, spring(prog(t, ta - 0.2, ta + 0.2))) * 0.3); A(xMark, -0.8, 1.9, 0.4);
      qMark.visible = true; qMark.scale.setScalar(Math.max(0.001, spring(prog(t, ta, ta + 0.4))) * 0.45); A(qMark, 0, 2.2, 0.3); qMark.rotation.y = 0.3 * Math.sin(T * 3); }
    return shot('c5', 7.4, 1.3);
  },
  truco(t, d, cue, T) {
    const tpi = cue.piel ?? d * 0.25, tco = cue.codo ?? d * 0.45, tn = cue.neutro ?? d * 0.6, ta = cue.aire ?? d * 0.85;
    if (t < ta - 0.4) {
      ped(DUO2);
      bud(you, 0, 0.3, 0.7, T, { look: [-0.8, -0.3], rotY: 0.3, eye: 0.5, blink: 0.4, armL: t > tco - 0.3 ? 2.6 : 0.4 }); you.userData.nose.visible = true;
      if (t > tn - 0.2) { P(tagCodo, t, tn - 0.2, 0.75); A(tagCodo, 0.55, 2.15, 0.6); setHearts(t, DUO2.clone().add(V(-0.5, 1.8, 0.4)), tn, 3, 0.4); }
      return shot('c6', 6.8, 1.3);
    }
    lightAt(DUO2); ground.visible = true;
    bud(you, 0, 0.3, 0.7, T, { hop: hopF(T, 3, 0.1), mood: 'smile', eye: 0.6, blink: 0.4, look: [0, 0.6], armL: 2.4, armR: 2.4 });
    sunG.visible = true; sunG.scale.setScalar(0.6); A(sunG, 1.1, 3.0, -1.0); sunG.rotation.z = T * 0.3;
    sparks.visible = true; setSparks(T, DUO2.clone().add(V(0, 1.4, 0)), 1.6, 2.0, 0x7ad0ff, 1);
    return shot('c3', 7.4, 1.5);
  },
  limite(t, d, cue, T) {
    const tt = cue.tres ?? d * 0.4, tti = cue.tira ?? d * 0.8;
    ped(DUO2);
    strips.forEach((s, i) => { const t0 = i < 4 ? 0.2 + i * 0.35 : tt + (i - 4) * 0.12; P(s, t, t0, 0.65); A(s, -1.15 + i * 0.33, 0.18, 0.3); s.rotation.z = 0.05 * Math.sin(T + i); });
    if (t > tt + 0.5) { xMark.visible = true; xMark.scale.setScalar(Math.max(0.001, spring(prog(t, tt + 0.5, tt + 0.9))) * 0.4); A(xMark, 0.85, 1.3, 0.6); }
    if (t > tti - 0.3) { bud(you, 0, 0.9, 0.42, T, sniff(you, T, { look: [0, 0.4] })); you.userData.nose.visible = true; }
    return shot('c4', 7.4, 1.2);
  },
  final(t, d, cue, T) {
    const tm = cue.magia ?? d * 0.3, tu = cue.usas ?? d * 0.75;
    ped(DUO2);
    cup.visible = true; cup.scale.setScalar(0.85); A(cup, -0.5, 0.18, 0.2); setSteamC(T, DUO2.clone().add(V(-0.5, 0.9, 0.2)));
    loose.forEach((b, i) => { b.visible = true; b.scale.setScalar(0.8); A(b, -1.0 + (i % 5) * 0.22, 0.22, 1.0 + Math.floor(i / 5) * 0.22); b.rotation.y = i; });
    bud(you, 0.85, 0.4, 0.55, T, { look: [-0.7, 0.1], rotY: -0.5, mood: 'smile' });
    if (t > tu) { qMark.visible = true; qMark.scale.setScalar(Math.max(0.001, spring(prog(t, tu, tu + 0.4))) * 0.5); A(qMark, 0.9, 2.0, 0.4); qMark.rotation.y = 0.3 * Math.sin(T * 3); }
    return shot('c7', 7.2, 1.2);
  },
};

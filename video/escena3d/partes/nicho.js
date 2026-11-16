// ================================================================== NICHO VS DISEÑADOR (frascos genéricos)
Object.assign(PALG, { n1: [0xffd23a, 0xff8a3a], n2: [0xff9ad0, 0xe0508a], n3: [0x5a4a7a, 0x2a1a4a], n4: [0x9ae08a, 0x3aa05a], n5: [0x7ad0ff, 0x3a8ae0], n6: [0x8a8a9a, 0x4a4a5a], n7: [0xc89aff, 0x7a4ad8] });
const dB = bottleG(0xff9ad0, 'DESIGNER'), nB = bottleG(0x5a3a2a, 'NICHE');
const tagVS = cartel(['VS'], 0.8, 0.6);
const dress = add((() => { const g = new THREE.Group(); const m = new THREE.MeshStandardMaterial({ color: 0xff6fb0 }); const body = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.7, 1.4, 20), m); body.position.y = 1.0; g.add(body);
  const st = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.5, 8), new THREE.MeshStandardMaterial({ color: 0x8a8a96 })); st.position.y = 0.15; g.add(st);
  const hd = new THREE.Mesh(new THREE.SphereGeometry(0.18, 14, 10), new THREE.MeshStandardMaterial({ color: 0xeeeeee })); hd.position.y = 1.9; g.add(hd); return g; })());
const crowdN = Array.from({ length: 10 }, (_, i) => buddyG([0x3ad07a, 0xffb03a, 0xb06bff, 0x3ad0d0, 0x4f8dff][i % 5]));
const fl1 = add((() => { const g = new THREE.Group(); const gl = new THREE.MeshStandardMaterial({ color: 0xeaf6ff, transparent: true, opacity: 0.4, side: THREE.DoubleSide }); const b = new THREE.Mesh(new THREE.SphereGeometry(0.4, 18, 14), gl); b.position.y = 0.4; g.add(b);
  const n = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.5, 10, 1, true), gl); n.position.y = 0.95; g.add(n); const l = new THREE.Mesh(new THREE.SphereGeometry(0.33, 16, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0x8a3ab0 })); l.position.y = 0.4; g.add(l); return g; })());
const weird = [(() => { const g = new THREE.Group(); const c = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0xdd3a3a })); c.position.y = 0.5; g.add(c);
    const s = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.5, 10), new THREE.MeshStandardMaterial({ color: 0xf6f0e0 })); s.position.y = 0.25; g.add(s); return g; })(), ING.sandalo(), ING.ambar()].map(add);
const numbered = [1, 2, 3].map(i => bottleG(0x5a3a2a, 'Nº ' + i));
const nameTags = ['CREED', 'XERJOFF', 'AMOUAGE', 'LE LABO'].map(n => cartel([n], 1.1, 0.5));
const nicheRow = [0x5a3a2a, 0x2a4a3a, 0x3a2a5a, 0x6a5a3a].map(c => bottleG(c, 'NICHE'));
const mall = add((() => { const g = new THREE.Group(); const h = new THREE.Mesh(new THREE.BoxGeometry(3.0, 1.8, 1.0), new THREE.MeshStandardMaterial({ color: 0xdfe4ea })); h.position.y = 0.9; g.add(h);
  for (let i = 0; i < 4; i++) { const w = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.9), new THREE.MeshBasicMaterial({ color: 0xbfe6ff })); w.position.set(-1.05 + i * 0.7, 0.75, 0.51); g.add(w); } return g; })());
const boutique = add((() => { const g = new THREE.Group(); const h = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.6, 0.9), new THREE.MeshStandardMaterial({ color: 0x3a2a3a })); h.position.y = 0.8; g.add(h);
  const aw = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.12, 0.5), new THREE.MeshStandardMaterial({ color: 0xc8a05a })); aw.position.set(0, 1.4, 0.5); g.add(aw);
  const w = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.7), new THREE.MeshBasicMaterial({ color: 0xffe0a0 })); w.position.set(0, 0.7, 0.46); g.add(w); return g; })());
const tagDep = cartel(['TIENDA', 'DEPARTAMENTAL']), tagBou = cartel(['BOUTIQUE'], 1.4, 0.6);
const tagD = cartel(['$'], 0.7, 0.6), tagN = cartel(['$$$'], 1.0, 0.6);
const tower = add((() => { const g = new THREE.Group(); const h = new THREE.Mesh(new THREE.BoxGeometry(1.6, 3.2, 1.2), new THREE.MeshStandardMaterial({ color: 0x4a4a5a })); h.position.y = 1.6; g.add(h);
  for (let r = 0; r < 5; r++) for (let k = 0; k < 3; k++) { const w = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.3), new THREE.MeshBasicMaterial({ color: 0xffe08a })); w.position.set(-0.5 + k * 0.5, 0.6 + r * 0.55, 0.61); g.add(w); } return g; })());
const tagCorp = cartel(['GIGANTE', 'S.A.']);
const SCENES = {
  gancho(t, d, cue, T) {
    const tv = cue.vs ?? d * 0.3, td = cue.diferencia ?? d * 0.8;
    ped(DUO2);
    P(dB, t, 0.1, 0.5); A(dB, -0.65, 0.18, 0); spin(dB, T);
    P(nB, t, 0.4, 0.5); A(nB, 0.65, 0.18, 0); spin(nB, T + 1);
    if (t > td) { qMark.visible = true; qMark.scale.setScalar(Math.max(0.001, spring(prog(t, td, td + 0.4))) * 0.45); A(qMark, 0, 2.0, 0.3); qMark.rotation.y = 0.3 * Math.sin(T * 3); }
    return shot('n1', 7.0, 1.2);
  },
  disenador(t, d, cue, T) {
    const tm = cue.moda ?? d * 0.15, tr = cue.ropa ?? d * 0.55, tmi = cue.millones ?? d * 0.82;
    ped(DUO2);
    if (t < tmi - 0.4) { dB.visible = true; dB.scale.setScalar(0.45); A(dB, 0.65, 0.18, 0.2); spin(dB, T); P(dress, t, Math.min(tm - 0.2, 0.3), 0.75); A(dress, -0.55, 0.18, 0); dress.rotation.y = 0.3 * Math.sin(T);
      if (t > tr - 0.2) { sparks.visible = true; setSparks(T, DUO2.clone().add(V(-0.55, 1.0, 0)), 0.8, 1.4, 0xff9ad0, 1); } return shot('n2', 7.2, 1.3); }
    dB.visible = true; dB.scale.setScalar(0.4); A(dB, 0, 0.18, -0.5); spin(dB, T);
    crowdN.forEach((b, i) => { if (t > tmi - 0.4 + i * 0.05) bud(b, -1.2 + (i % 5) * 0.6, 0.6 + Math.floor(i / 5) * 0.6, 0.3, T, { hop: hopF(T, 3 + i * 0.2, 0.06), look: [0, 0.3] }); });
    setHearts(t, DUO2.clone().add(V(0, 1.7, 0)), tmi, 5, 0.8);
    return shot('n2', 7.6, 1.1);
  },
  nicho(t, d, cue, T) {
    const ts = cue.solo ?? d * 0.2, tr = cue.raros ?? d * 0.55, tp = cue.pequenas ?? d * 0.85;
    ped(DUO2);
    if (t < tp - 0.4) {
      nB.visible = true; nB.scale.setScalar(0.45); A(nB, 0, 0.18, -0.2); spin(nB, T);
      P(fl1, t, Math.min(ts - 0.2, 0.3), 0.75); A(fl1, -0.85, 0.18, 0.4);
      if (t > tr - 0.3) weird.forEach((w, i) => { P(w, t, tr - 0.3 + i * 0.15, 0.7); const a = T * 0.7 + i * 2.1; A(w, Math.cos(a) * 1.1, 1.3 + 0.2 * Math.sin(a), Math.sin(a) * 0.6 + 0.3); });
      return shot('n3', 7.2, 1.3);
    }
    numbered.forEach((b, i) => { P(b, t, tp - 0.4 + i * 0.15, 0.4); A(b, -0.8 + i * 0.8, 0.18, 0); spin(b, T + i); });
    return shot('n3', 7.0, 1.2);
  },
  ejemplos(t, d, cue, T) {
    const ts = [cue.creed ?? d * 0.12, cue.xerjoff ?? d * 0.2, cue.amouage ?? d * 0.28, cue.lelabo0 ?? d * 0.36], tdp = cue.departamental ?? d * 0.6, tb = cue.boutiques ?? d * 0.88;
    if (t < tdp - 0.6) {
      ped(DUO2);
      nicheRow.forEach((b, i) => { P(b, t, ts[i] - 0.25, 0.32); A(b, -1.05 + i * 0.7, 0.18, 0); spin(b, T + i, 0.2);
        const g = nameTags[i]; P(g, t, ts[i] - 0.15, 0.55); A(g, -1.05 + i * 0.7, 1.35 + (i % 2) * 0.35, 0.6); });
      return shot('n3', 7.4, 1.2);
    }
    lightAt(DUO2); ground.visible = true;
    P(mall, t, tdp - 0.6, 0.6); A(mall, -0.6, 0, -1.2); P(tagDep, t, tdp - 0.3, 0.6); A(tagDep, -0.6, 1.9, -0.6);
    if (t > tb - 0.4) { P(boutique, t, tb - 0.4, 0.7); A(boutique, 0.9, 0, 0.2); P(tagBou, t, tb - 0.2, 0.55); A(tagBou, 0.9, 1.65, 0.7); }
    return shot('n4', 8.2, 1.3);
  },
  pruebas(t, d, cue, T) {
    const tp = cue.publico ?? d * 0.25, tc = cue.cambia ?? d * 0.55, to = cue.odio ?? d * 0.85;
    ped(DUO2); ped(DUO3, true);
    dB.visible = true; dB.scale.setScalar(0.32); A(dB, 0, 0.18, -0.3); spin(dB, T);
    crowdN.slice(0, 3).forEach((b, i) => { if (t > tp - 0.3 + i * 0.1) bud(b, -0.8 + i * 0.8, 0.8, 0.28, T, { look: [0, 0.3], armR: 2.0 }); });
    if (t > tc - 0.2) { check.visible = true; check.scale.setScalar(Math.max(0.001, spring(prog(t, tc - 0.2, tc + 0.2))) * 0.28); A(check, 0.8, 1.0, 0.3); }
    nB.visible = true; nB.scale.setScalar(0.32); A(nB, 0, 0.18, -0.3, DUO3); spin(nB, T);
    if (t > to - 0.4) { bud(you, -0.75, 0.4, 0.38, T, { look: [0.6, 0.2], rotY: 0.4, eye: 0.6, blink: 0.4 }, DUO3); setHearts(t, DUO3.clone().add(V(-0.75, 1.1, 0.4)), to - 0.4, 3, 0.3);
      bud(pal, 0.75, 0.4, 0.38, T, { mood: 'frown', look: [-0.6, 0.2], rotY: -0.4, eye: 0.6, brow: 0.9 }, DUO3); setStink(t, DUO3.clone().add(V(0.75, 0.9, 0.4)), to - 0.4, 0.3); }
    return splitShot('n2', 'n3', 7.8, 0.7);
  },
  precio(t, d, cue, T) {
    const tm = cue.mas ?? d * 0.1, tme = cue.menos ?? d * 0.25, tmat = cue.materiales ?? d * 0.4, ta = cue.anuncios ?? d * 0.6, tb = cue.mejor ?? d * 0.88;
    ped(DUO2);
    dB.visible = true; dB.scale.setScalar(0.42); A(dB, -0.65, 0.18, 0); nB.visible = true; nB.scale.setScalar(0.42); A(nB, 0.65, 0.18, 0);
    P(tagD, t, 0.2, 0.6); A(tagD, -0.65, 1.95, 0.3); P(tagN, t, tm - 0.1, 0.6); A(tagN, 0.65, 1.95, 0.3);
    if (t > ta - 0.3 && t < tb - 0.4) { P(tv, t, ta - 0.3, 0.28); A(tv, 0, 1.15, -0.8); xMark.visible = true; xMark.scale.setScalar(0.3); A(xMark, 0.35, 1.2, -0.5); }
    if (t > tb - 0.4) { qMark.visible = true; qMark.scale.setScalar(Math.max(0.001, spring(prog(t, tb - 0.4, tb))) * 0.4); A(qMark, 0, 1.3, 0.6); qMark.rotation.y = 0.3 * Math.sin(T * 3); }
    return shot('n5', 7.0, 1.2);
  },
  borroso(t, d, cue, T) {
    const tc = cue.compraron ?? d * 0.25, tl = cue.lelabo ?? d * 0.45, tm = cue.mfk ?? d * 0.65, tg = cue.gigante ?? d * 0.88;
    lightAt(DUO2); ground.visible = true;
    P(tower, t, Math.min(tc - 0.4, 0.3), 0.75); A(tower, 0, 0, -1.0); P(tagCorp, t, tc - 0.2, 0.6); A(tagCorp, 0, 2.75, -0.2);
    nicheRow.forEach((b, i) => { const t0 = [tl, tl + 0.3, tm, tm + 0.3][i] - 0.2; const k = easeIO(prog(t, t0, t0 + 0.7)); b.visible = k < 0.97; b.scale.setScalar(0.3 * (1 - 0.6 * k));
      A(b, lerp(-1.1 + i * 0.73, 0, k), 0.0 + 1.0 * Math.sin(k * Math.PI), lerp(1.0, -0.6, k)); });
    if (t > tg - 0.2) { sparks.visible = true; setSparks(T, DUO2.clone().add(V(0, 1.6, -0.4)), 1.2, 1.6, 0xffd23a, 1); }
    return shot('n6', 8.2, 1.4);
  },
  final(t, d, cue, T) {
    const tt = cue.ti ?? d * 0.3, te = cue.eres ?? d * 0.75;
    ped(DUO2);
    dB.visible = true; dB.scale.setScalar(0.4); A(dB, -0.85, 0.18, 0); nB.visible = true; nB.scale.setScalar(0.4); A(nB, 0.85, 0.18, 0); spin(dB, T); spin(nB, T + 1);
    bud(you, 0, 0.4, 0.5, T, { look: [Math.sin(T * 1.5), 0.2], eye: 1.1 });
    if (t > tt) setHearts(t, DUO2.clone().add(V(0, 1.8, 0.4)), tt, 3, 0.4);
    if (t > te) { qMark.visible = true; qMark.scale.setScalar(Math.max(0.001, spring(prog(t, te, te + 0.4))) * 0.45); A(qMark, 0, 2.1, 0.3); qMark.rotation.y = 0.3 * Math.sin(T * 3); }
    return shot('n7', 7.2, 1.2);
  },
};

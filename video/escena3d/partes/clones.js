// ================================================================== ¿ES LEGAL COPIAR UN PERFUME? (frascos genéricos)
Object.assign(PALG, { l1: [0xffd23a, 0xff8a3a], l2: [0x9ae08a, 0x3aa05a], l3: [0x7ad0ff, 0x3a8ae0], l4: [0xff6a6a, 0xc0303a], l5: [0xff9ad0, 0xe0508a], l6: [0xc89aff, 0x7a4ad8], l7: [0x8a8a9a, 0x4a4a5a] });
const orig = bottleG(0xffb84d, 'ORIGINAL'), clon = bottleG(0x9ad0ff, 'INSPIRADO'), fake = bottleG(0xffb84d, 'ORIGINAL');
const note = add((() => { const g = new THREE.Group(); const m = new THREE.MeshStandardMaterial({ color: 0x15151c }); const h = new THREE.Mesh(new THREE.SphereGeometry(0.22, 14, 10), m); h.scale.set(1.3, 1, 0.6); g.add(h);
  const st = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.9, 0.06), m); st.position.set(0.24, 0.45, 0); g.add(st); const fl = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.08, 0.06), m); fl.position.set(0.38, 0.85, 0); fl.rotation.z = -0.5; g.add(fl); return g; })());
const copyR = cartel(['©'], 0.9, 0.9);
const lock = add((() => { const g = new THREE.Group(); const b = new THREE.Mesh(new RoundedBoxGeometry(0.8, 0.65, 0.3, 3, 0.08), new THREE.MeshStandardMaterial({ color: 0xffc83a })); g.add(b);
  const sh = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.06, 8, 20, Math.PI), new THREE.MeshStandardMaterial({ color: 0xc0c6d0 })); sh.position.y = 0.33; g.add(sh);
  const k = new THREE.Mesh(new THREE.CircleGeometry(0.07, 12), new THREE.MeshBasicMaterial({ color: 0x15151c })); k.position.z = 0.16; g.add(k); return g; })());
const recipe = cartel(['FÓRMULA', 'SECRETA']);
const chromCv = document.createElement('canvas'); chromCv.width = 360; chromCv.height = 200; const chromTex = new THREE.CanvasTexture(chromCv);
function drawChrom(k) { const x = chromCv.getContext('2d'); x.fillStyle = '#0c1a12'; x.fillRect(0, 0, 360, 200); x.strokeStyle = '#5aff8a'; x.lineWidth = 4; x.beginPath(); x.moveTo(10, 180);
  for (let i = 0; i <= 340 * k; i += 2) { const px = 10 + i; let y = 180; [[40, 90], [95, 140], [150, 60], [210, 120], [270, 100], [315, 150]].forEach(([c, h]) => { y -= h * Math.exp(-((px - c) ** 2) / 40); }); x.lineTo(px, y); } x.stroke(); chromTex.needsUpdate = true; }
const machine = add((() => { const g = new THREE.Group(); const b = new THREE.Mesh(new RoundedBoxGeometry(2.2, 1.3, 1.0, 4, 0.1), new THREE.MeshStandardMaterial({ color: 0xdfe4ea })); b.position.y = 0.65; g.add(b);
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 0.72), new THREE.MeshBasicMaterial({ map: chromTex })); scr.position.set(-0.25, 0.75, 0.51); g.add(scr);
  const slot = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.3, 12), new THREE.MeshStandardMaterial({ color: 0x5a5a66 })); slot.position.set(0.75, 1.4, 0); g.add(slot);
  [0xff3a4a, 0x3aff7a].forEach((c, i) => { const l = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 6), new THREE.MeshBasicMaterial({ color: c })); l.position.set(0.7 + i * 0.18, 0.9, 0.51); g.add(l); }); return g; })());
const balls = [0xff6fb0, 0xffd23a, 0x7ad0ff, 0x9ae08a, 0xc89aff, 0xff8a3a].map(c => add(new THREE.Mesh(new THREE.SphereGeometry(0.17, 16, 12), new THREE.MeshStandardMaterial({ color: c }))));
const tagNombre = cartel(['NOMBRE'], 1.2, 0.55), tagLogo = cartel(['★ LOGO'], 1.2, 0.55);
const flagNLc = flagG([0xdd2a2a, 0xffffff, 0x2a4aa0], false), flagFRc = flagG([0x2a4aa0, 0xffffff, 0xdd2a2a], true);
const y2006 = bigT('2006', 0xffc83a, 0.7);
const mask = add((() => { const g = new THREE.Group(); const m = new THREE.Mesh(new RoundedBoxGeometry(0.9, 0.3, 0.1, 3, 0.1), new THREE.MeshStandardMaterial({ color: 0x15151c })); g.add(m);
  [-0.22, 0.22].forEach(x => { const e = new THREE.Mesh(new THREE.CircleGeometry(0.08, 12), new THREE.MeshBasicMaterial({ color: 0xffffff })); e.position.set(x, 0, 0.06); g.add(e); }); return g; })());
const SCENES = {
  gancho(t, d, cue, T) {
    const tl = cue.legal ?? d * 0.3, ts = cue.sorprender ?? d * 0.8;
    ped(DUO2);
    P(orig, t, 0.1, 0.5); A(orig, -0.6, 0.18, 0); spin(orig, T);
    P(clon, t, tl - 0.2, 0.5); A(clon, 0.6, 0.18, 0); spin(clon, T + 1);
    if (t > tl) { qMark.visible = true; qMark.scale.setScalar(Math.max(0.001, spring(prog(t, tl, tl + 0.4))) * 0.5); A(qMark, 0, 2.0, 0.3); qMark.rotation.y = 0.3 * Math.sin(T * 3); }
    return shot('l1', 7.0, 1.2);
  },
  olor(t, d, cue, T) {
    const tr = cue.registrar ?? d * 0.25, ts = cue.secreta ?? d * 0.45, tp = cue.parecido ?? d * 0.65, ti = cue.ilegal ?? d * 0.85;
    ped(DUO2);
    if (t < ts - 0.3) { orig.visible = true; orig.scale.setScalar(0.5); A(orig, -0.6, 0.18, 0); spin(orig, T);
      P(note, t, Math.min(tr - 0.5, 0.2), 0.9); A(note, 0.6, 1.0, 0.2); note.rotation.z = 0.15 * Math.sin(T * 4); P(copyR, t, Math.min(tr - 0.2, 0.5), 0.55); A(copyR, 0.9, 2.0, 0.4); return shot('l7', 7.2, 1.2); }
    orig.visible = true; orig.scale.setScalar(0.45); A(orig, -0.7, 0.18, 0); spin(orig, T);
    if (t < tp - 0.2) { P(lock, t, ts - 0.3, 0.8); A(lock, 0.6, 1.0, 0.3); lock.rotation.y = 0.3 * Math.sin(T); P(recipe, t, ts, 0.6); A(recipe, 0.6, 2.0, 0.3); }
    else { P(clon, t, tp - 0.2, 0.45); A(clon, 0.7, 0.18, 0); spin(clon, T + 1); if (t > ti - 0.2) { check.visible = true; check.scale.setScalar(Math.max(0.001, spring(prog(t, ti - 0.2, ti + 0.2))) * 0.35); A(check, 0.7, 1.9, 0.4); } }
    return shot('l2', 7.2, 1.2);
  },
  maquina(t, d, cue, T) {
    const tc = cue.clones ?? d * 0.1, tm = cue.cromatografo ?? d * 0.3, ts = cue.separa ?? d * 0.6, tb = cue.baratos ?? d * 0.88;
    lightAt(DUO2); ground.visible = true;
    P(machine, t, Math.min(tm - 0.4, 0.2), 0.8); A(machine, -0.2, 0, -0.4); drawChrom(prog(t, tm, ts + 1.0));
    if (t < tm + 0.5) { orig.visible = true; orig.scale.setScalar(0.3); const k = easeIO(prog(t, tm - 0.2, tm + 0.4)); A(orig, lerp(1.0, 0.4, k), lerp(0.0, 1.3, k), lerp(0.6, -0.4, k)); orig.rotation.z = Math.PI * k; }
    if (t > ts - 0.2) balls.forEach((b, i) => { P(b, t, ts - 0.2 + i * 0.12, 0.9); A(b, -1.0 + i * 0.4, 2.2 + 0.08 * Math.sin(T * 3 + i), 0.4); });
    if (t > tb - 0.2) { P(clon, t, tb - 0.2, 0.4); A(clon, 1.05, 0.0, 0.7); spin(clon, T); }
    return shot('l3', 8.0, 1.5);
  },
  marca(t, d, cue, T) {
    const tn = cue.nombre ?? d * 0.35, tl = cue.logo ?? d * 0.5, tf = cue.frasco ?? d * 0.65, tx = cue.falsificacion ?? d * 0.85;
    ped(DUO2);
    orig.visible = true; orig.scale.setScalar(0.45); A(orig, -0.6, 0.18, 0); spin(orig, T);
    if (t > tn - 0.2) { P(tagNombre, t, tn - 0.2, 0.6); A(tagNombre, -0.6, 2.25, 0.3); }
    if (t > tl - 0.2) { P(tagLogo, t, tl - 0.2, 0.6); A(tagLogo, 0.6, 2.25, 0.3); }
    if (t > tf - 0.3) { P(fake, t, tf - 0.3, 0.45); A(fake, 0.6, 0.18, 0); spin(fake, T); }
    if (t > tx - 0.2) { xMark.visible = true; xMark.scale.setScalar(Math.max(0.001, spring(prog(t, tx - 0.2, tx + 0.2))) * 0.45); A(xMark, 0.6, 1.1, 0.7); }
    return shot('l4', 7.2, 1.3);
  },
  holanda(t, d, cue, T) {
    const te = cue.excepciones ?? d * 0.1, tl = cue.lancome ?? d * 0.3, td = cue.derechos ?? d * 0.6, tc = cue.contrario ?? d * 0.88;
    ped(DUO2);
    if (t < tc - 0.6) {
      P(flagNLc, t, 0.15, 0.7); A(flagNLc, -0.6, 2.1, 0); flagNLc.rotation.y = 0.2 * Math.sin(T * 2);
      P(y2006, t, 0.3, 0.42); A(y2006, 0.65, 2.0, 0);
      block.visible = true; block.scale.setScalar(1); A(block, 0.3, 0.26, 0.4); gavel.visible = true; gavel.scale.setScalar(0.9); A(gavel, 0.8, 0.3, 0.4); gavel.rotation.z = t > td - 0.3 ? 0.9 * Math.abs(Math.sin(T * 5)) + 0.3 : 0.3;
      if (t > tl - 0.2) { P(orig, t, tl - 0.2, 0.38); A(orig, -0.7, 0.18, 0.4); spin(orig, T); }
      if (t > td - 0.2) { P(copyR, t, td - 0.2, 0.5); A(copyR, -0.7, 1.4, 0.6); }
      return shot('l3', 7.4, 1.3);
    }
    P(flagFRc, t, tc - 0.6, 0.6); A(flagFRc, 0, 2.1, 0); flagFRc.rotation.y = 0.2 * Math.sin(T * 2);
    copyR.visible = true; copyR.scale.setScalar(0.6); A(copyR, 0, 1.0, 0.4);
    xMark.visible = true; xMark.scale.setScalar(Math.max(0.001, spring(prog(t, tc - 0.2, tc + 0.2))) * 0.5); A(xMark, 0, 1.0, 0.6);
    return shot('l6', 7.2, 1.3);
  },
  diferencia(t, d, cue, T) {
    const tcl = cue.clon ?? d * 0.15, tp = cue.propia ?? d * 0.3, tf = cue.falso ?? d * 0.5, tca = cue.casi ?? d * 0.7, tn = cue.nunca ?? d * 0.9;
    if (t < tcl) { ped(DUO2); orig.visible = true; orig.scale.setScalar(0.5); A(orig, 0, 0.18, 0); spin(orig, T); return shot('l1', 7.0, 1.2); }
    if (t < tn) {
      ped(DUO2); ped(DUO3, true);
      clon.visible = true; clon.scale.setScalar(0.36); A(clon, -0.4, 0.18, 0); spin(clon, T);
      if (t > tca - 0.2) { check.visible = true; check.scale.setScalar(Math.max(0.001, spring(prog(t, tca - 0.2, tca + 0.2))) * 0.3); A(check, 0.7, 0.9, 0.3); }
      if (t > tf - 0.3) { P(fake, t, tf - 0.3, 0.36); A(fake, -0.4, 0.18, 0, DUO3); spin(fake, T); mask.visible = true; mask.scale.setScalar(0.45); A(mask, -0.4, 0.82, 0.4, DUO3); }
      return splitShot('l2', 'l4', 7.4, 0.9);
    }
    ped(DUO2);
    fake.visible = true; fake.scale.setScalar(0.5); A(fake, 0, 0.18, 0); xMark.visible = true; xMark.scale.setScalar(Math.max(0.001, spring(prog(t, tn, tn + 0.3))) * 0.6); A(xMark, 0, 1.0, 0.6);
    return shot('l4', 7.0, 1.2);
  },
  calidad(t, d, cue, T) {
    const ti = cue.igual ?? d * 0.15, tp = cue.parecen ?? d * 0.4, tdu = cue.durar ?? d * 0.65, tc = cue.cambian ?? d * 0.85;
    ped(DUO2);
    orig.visible = true; orig.scale.setScalar(0.45); A(orig, -0.7, 0.18, 0); spin(orig, T);
    clon.visible = true; clon.scale.setScalar(0.45); A(clon, 0.7, 0.18, 0); spin(clon, T + 1);
    bud(you, 0, 1.4, 0.32, T, { look: [Math.sin(T * 2), 0.2], eye: 0.6, blink: 0.4 }); you.userData.nose.visible = true;
    if (t > tp - 0.2 && t < tdu - 0.2) setHearts(t, DUO2.clone().add(V(0, 1.6, 0.6)), tp - 0.2, 3, 0.5);
    if (t > tdu - 0.3) { clock.visible = true; clock.scale.setScalar(0.4); A(clock, 0, 2.15, 0.2); clock.userData.hand.rotation.z = -T * 4;
      clon.userData.liquid.scale.y = Math.max(0.05, 1 - prog(t, tdu, tdu + 2.0) * 0.85); }
    if (t > tc) { qMark.visible = true; qMark.scale.setScalar(Math.max(0.001, spring(prog(t, tc, tc + 0.4))) * 0.35); A(qMark, 0.7, 1.7, 0.4); qMark.rotation.y = 0.3 * Math.sin(T * 3); }
    return shot('l5', 7.2, 1.3);
  },
  final(t, d, cue, T) {
    const to = cue.originales ?? d * 0.6;
    ped(DUO2);
    orig.visible = true; orig.scale.setScalar(0.45); A(orig, -0.6, 0.18, 0); spin(orig, T);
    clon.visible = true; clon.scale.setScalar(0.45); A(clon, 0.6, 0.18, 0); spin(clon, T + 1);
    qMark.visible = true; qMark.scale.setScalar(Math.max(0.001, spring(prog(t, 0.3, 0.7))) * 0.5); A(qMark, 0, 2.0, 0.3); qMark.rotation.y = 0.3 * Math.sin(T * 3);
    if (t > to) setConfetti(DUO2, t, to);
    return shot('l6', 7.0, 1.2);
  },
};
const _resetL = resetWorld;
resetWorld = function () { _resetL(); clon.userData.liquid.scale.y = 1; };

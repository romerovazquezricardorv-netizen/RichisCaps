// ================================================================== PERFUMES PARA EL CALOR VS PARA EL FRÍO
Object.assign(PALG, { h1: [0xffb03a, 0xe0603a], h2: [0xff8a5a, 0xc04a2a], h3: [0xff9ad0, 0xe0508a], h4: [0xffd23a, 0xff8a3a], h5: [0x7ad0ff, 0x3a6ae0], h6: [0x9ad0ff, 0x5a8ac0], h7: [0x3a3a6a, 0x15153a], h8: [0x9ae08a, 0x3aa05a] });
const sweetB = bottleG(0xc8803a, 'AMBRE'), freshB = bottleG(0x9ad0ff, 'FRESH');
const heavy = [ING.vainilla(), ING.ambar(), ING.sandalo()].map(add);
const fresh = [ING.limon(), ING.bergamota(), (() => { const g = new THREE.Group(); const m = new THREE.MeshStandardMaterial({ color: 0x5ab0ff }); const d = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 12), m); d.scale.y = 1.2; g.add(d);
  const tp = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.35, 16), m); tp.position.y = 0.42; g.add(tp); return g; })(), (() => { const g = new THREE.Group(); const m = new THREE.MeshStandardMaterial({ color: 0x3ab05a }); [[0, 0.2, 0], [-0.22, 0, 0.6], [0.22, 0, -0.6]].forEach(([x, y, r]) => { const l = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 10), m); l.scale.set(0.6, 1, 0.18); l.position.set(x, y, 0); l.rotation.z = r; g.add(l); }); return g; })(), ING.jazmin()].map(add);
const hug = buddyG(0xff6fb0);
const vapC = Array.from({ length: 10 }, () => add(new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 6), new THREE.MeshStandardMaterial({ color: 0xffb06a, transparent: true, opacity: 0.8 }))));
function setVapC(T, c, speed, h, col = 0xffb06a) { vapC.forEach((v, i) => { v.visible = true; v.material.color.setHex(col); const a = (T * speed + i / 10) % 1; v.position.copy(c).add(V(Math.sin(i * 2.3) * 0.5, a * h, Math.cos(i * 1.7) * 0.3)); v.material.opacity = 0.8 * (1 - a); }); }
const flakes = Array.from({ length: 14 }, () => { const s = snowG.clone(); s.scale.setScalar(0.15); return add(s); });
function setFlakes(T, c) { flakes.forEach((f, i) => { f.visible = true; const a = (T * 0.25 + i / 14) % 1; f.position.copy(c).add(V(-1.4 + (i * 0.41) % 2.8, 3.2 - a * 3.2, -0.5 + (i % 3) * 0.5)); f.rotation.z = T + i; }); }
const beanie = new THREE.Group(); { const m = new THREE.MeshStandardMaterial({ color: 0xdd3a5a }); const h = new THREE.Mesh(new THREE.SphereGeometry(0.85, 24, 14, 0, Math.PI * 2, 0, Math.PI / 2), m); beanie.add(h);
  const p = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 10), new THREE.MeshStandardMaterial({ color: 0xffffff })); p.position.y = 0.85; beanie.add(p); beanie.position.y = 1.55; }
const hDrops = Array.from({ length: 12 }, () => add(new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 6), new THREE.MeshStandardMaterial({ color: 0x7ad0ff, transparent: true, opacity: 0.7 }))));
const office = add((() => { const g = new THREE.Group(); const h = new THREE.Mesh(new THREE.BoxGeometry(1.5, 2.8, 1.0), new THREE.MeshStandardMaterial({ color: 0x8a96a6 })); h.position.y = 1.4; g.add(h);
  for (let r = 0; r < 4; r++) for (let k = 0; k < 2; k++) { const w = new THREE.Mesh(new THREE.PlaneGeometry(0.35, 0.35), new THREE.MeshBasicMaterial({ color: 0xbfe6ff })); w.position.set(-0.35 + k * 0.7, 0.6 + r * 0.55, 0.51); g.add(w); } return g; })());
const moon = add((() => { const g = new THREE.Group(); const m = new THREE.Mesh(new THREE.SphereGeometry(0.45, 20, 14), new THREE.MeshStandardMaterial({ color: 0xfff2c0 })); g.add(m);
  const c = new THREE.Mesh(new THREE.SphereGeometry(0.42, 20, 14), new THREE.MeshStandardMaterial({ color: 0x3a3a6a })); c.position.set(0.22, 0.12, 0.15); g.add(c); return g; })());
const tie = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.6, 4), new THREE.MeshStandardMaterial({ color: 0x3a5ad0 })); tie.rotation.x = Math.PI; tie.position.set(0, 0.95, 0.82);
const SCENES = {
  gancho(t, d, cue, T) {
    const te = cue.empalagoso ?? d * 0.35, ti = cue.invierno ?? d * 0.8;
    ped(DUO2);
    sweetB.visible = true; sweetB.scale.setScalar(0.5); A(sweetB, 0, 0.18, 0); spin(sweetB, T);
    if (t < ti - 0.3) { P(sunG, t, 0.2, 0.55); A(sunG, 0.9, 2.3, -0.4); sunG.rotation.z = T * 0.3; if (t > te - 0.2) bud(you, -0.85, 0.5, 0.45, T, { mood: 'frown', eye: 0.5, brow: 0.9, look: [0.6, 0], rotY: 0.4 }); return shot('h1', 7.2, 1.3); }
    P(snowG, t, ti - 0.3, 0.55); A(snowG, 0.9, 2.3, -0.4); snowG.rotation.z = T * 0.3; setFlakes(T, DUO2);
    bud(you, -0.85, 0.5, 0.45, T, { mood: 'smile', eye: 0.6, blink: 0.4, look: [0.6, 0], rotY: 0.4 }); setHearts(t, DUO2.clone().add(V(-0.85, 1.4, 0.5)), ti, 3, 0.3);
    return shot('h6', 7.2, 1.3);
  },
  calor(t, d, cue, T) {
    const tc = cue.calor ?? d * 0.15, te = cue.evapora ?? d * 0.55, tf = cue.fuerte ?? d * 0.85;
    ped(DUO2);
    sunG.visible = true; sunG.scale.setScalar(0.6); A(sunG, 0.9, 2.4, -0.6); sunG.rotation.z = T * 0.4;
    thermo.visible = true; thermo.scale.setScalar(0.5); A(thermo, -0.95, 0.18, 0.2); thermo.userData.fill.scale.y = 0.6 + 1.6 * easeOut(prog(t, tc, tc + 1.2));
    sweetB.visible = true; sweetB.scale.setScalar(0.45); A(sweetB, 0.1, 0.18, 0); spin(sweetB, T);
    if (t > te - 0.3) setVapC(T, DUO2.clone().add(V(0.1, 1.1, 0)), 0.9, 1.6);
    if (t > tf - 0.2) setStink(t, DUO2.clone().add(V(0.1, 2.0, 0.2)), tf - 0.2, 0.4);
    return shot('h2', 7.2, 1.3);
  },
  dulces(t, d, cue, T) {
    const td = cue.dulces ?? d * 0.15, tv = cue.vainilla ?? d * 0.35, ta = cue.abrazo ?? d * 0.7;
    ped(DUO2);
    if (t < ta - 0.4) { sweetB.visible = true; sweetB.scale.setScalar(0.42); A(sweetB, 0, 0.18, -0.2); spin(sweetB, T);
      heavy.forEach((n, i) => { P(n, t, tv - 0.3 + i * 0.2, 0.75); const a = T * 0.7 + i / 3 * Math.PI * 2; A(n, Math.cos(a) * 1.15, 1.2 + 0.2 * Math.sin(a * 2), Math.sin(a) * 0.7 + 0.2); }); return shot('h3', 7.2, 1.3); }
    sunG.visible = true; sunG.scale.setScalar(0.5); A(sunG, 0.9, 2.4, -0.6); sunG.rotation.z = T * 0.4;
    const k = easeIO(prog(t, ta - 0.4, ta + 0.2));
    bud(you, lerp(-1.0, -0.3, k), 0.3, 0.55, T, { mood: t > ta ? 'o' : 'smile', mouthOpen: 1.1, eye: t > ta ? 1.4 : 1.0, blink: 1, brow: 0.9, look: [0.6, 0], rotY: 0.3 });
    bud(hug, lerp(1.0, 0.3, k), 0.3, 0.55, T, { mood: 'smile', eye: 0.5, blink: 0.4, look: [-0.6, 0], rotY: -0.3, armL: 2.0 * k, armR: 2.0 * k, hop: 0 });
    sweat.forEach((s, i) => { s.visible = t > ta; const a = (T * 1.5 + i / 6) % 1; A(s, -0.6 + i * 0.25, 1.6 - a * 0.8, 0.7); });
    return shot('h1', 7.0, 1.2);
  },
  verano(t, d, cue, T) {
    const ts = [cue.citricos ?? d * 0.25, (cue.citricos ?? d * 0.25) + 0.3, cue.acuaticas ?? d * 0.45, cue.verdes ?? d * 0.55, cue.florales ?? d * 0.65], tm = cue.menos ?? d * 0.8;
    ped(DUO2);
    sunG.visible = true; sunG.scale.setScalar(0.45); A(sunG, 1.0, 2.5, -0.8); sunG.rotation.z = T * 0.3;
    freshB.visible = true; freshB.scale.setScalar(0.45); A(freshB, 0, 0.18, -0.2); spin(freshB, T);
    if (t < tm - 0.3) fresh.forEach((n, i) => { P(n, t, ts[i] - 0.2, 0.65); const a = T * 0.7 + i / 5 * Math.PI * 2; A(n, Math.cos(a) * 1.15, 1.2 + 0.2 * Math.sin(a * 2), Math.sin(a) * 0.7 + 0.2); });
    else { bud(you, -0.75, 0.4, 0.5, T, { look: [0.6, 0.1], rotY: 0.4, armR: 1.6 }); youBottle.visible = true; setMist(t, DUO2.clone().add(V(-0.3, 1.3, 0.5)), V(-0.5, -0.2, 0.3).normalize(), tm - 0.3, [0.8, 0.95, 1]);
      check.visible = true; check.scale.setScalar(0.3); A(check, 0.7, 1.7, 0.4); }
    return shot('h4', 7.4, 1.3);
  },
  invierno(t, d, cue, T) {
    const tf = cue.frio ?? d * 0.1, tl = cue.lento ?? d * 0.4, tt = cue.timido ?? d * 0.55, tb = cue.brillan ?? d * 0.8;
    ped(DUO2);
    setFlakes(T, DUO2);
    bud(you, -0.7, 0.4, 0.55, T, { look: [0.6, 0.1], rotY: 0.4, mood: 'smile' }); you.userData.body.add(beanie); beanie.visible = true;
    if (t < tb - 0.4) { freshB.visible = true; freshB.scale.setScalar(0.42); A(freshB, 0.6, 0.18, 0); if (t > tl - 0.3) setVapC(T, DUO2.clone().add(V(0.6, 1.0, 0)), 0.2, 0.6, 0x9ad0ff); }
    else { sweetB.visible = true; sweetB.scale.setScalar(0.45); A(sweetB, 0.6, 0.18, 0); spin(sweetB, T); heavy.forEach((n, i) => { P(n, t, tb - 0.3 + i * 0.12, 0.55); A(n, 0.1 + i * 0.5, 1.9 + 0.1 * Math.sin(T * 2 + i), 0.3); });
      sparks.visible = true; setSparks(T, DUO2.clone().add(V(0.6, 1.0, 0)), 0.8, 1.2, 0xffd23a, 1); }
    return shot('h6', 7.2, 1.3);
  },
  humedad(t, d, cue, T) {
    const th = cue.humedad ?? d * 0.2, tf = cue.fuerte2 ?? d * 0.6, tm = cue.midete ?? d * 0.88;
    ped(DUO2);
    hDrops.forEach((p, i) => { p.visible = t > th - 0.3; A(p, -1.3 + (i * 0.47) % 2.6, 0.8 + ((T * 0.3 + i / 12) % 1) * 2.0, -0.5 + (i % 3) * 0.5); });
    bud(you, -0.5, 0.3, 0.55, T, { mood: t > tf ? 'o' : 'smile', mouthOpen: 0.8, eye: t > tf ? 1.3 : 1.0, blink: 1, look: [0.6, 0], rotY: 0.3 });
    freshB.visible = true; freshB.scale.setScalar(0.4); A(freshB, 0.65, 0.18, 0.1);
    if (t > tf - 0.3) setVapC(T, DUO2.clone().add(V(0.65, 1.0, 0.1)), 0.5, 1.2, 0x9ad0ff);
    if (t > tm - 0.2) { you.userData.hand.add(youBottle); youBottle.visible = true; }
    return shot('h5', 7.2, 1.3);
  },
  noche(t, d, cue, T) {
    const te = cue.estacion ?? d * 0.15, to = cue.oficina ?? d * 0.45, tn = cue.noche ?? d * 0.8;
    lightAt(DUO2); ground.visible = true;
    if (t < tn - 0.4) {
      if (t > Math.min(to - 0.4, 0.3)) { P(office, t, Math.min(to - 0.4, 0.3), 0.75); A(office, 0.75, 0, -0.8); }
      sunG.visible = true; sunG.scale.setScalar(0.4); A(sunG, -0.9, 2.6, -0.8); sunG.rotation.z = T * 0.3;
      bud(you, -0.5, 0.8, 0.5, T, { look: [0.6, 0.1], rotY: 0.4 }); you.userData.body.add(tie); tie.visible = true; freshB.visible = true; freshB.scale.setScalar(0.3); A(freshB, 0.2, 0, 1.2);
      return shot('h4', 8.0, 1.4);
    }
    moon.visible = true; moon.scale.setScalar(0.7); A(moon, 0.9, 2.5, -0.8); moon.rotation.y = 0.3;
    bud(you, -0.3, 0.8, 0.55, T, { look: [0.4, 0.2], rotY: 0.3, hop: hopF(T, 4, 0.1), armR: 2.2, armL: 2.2 });
    sweetB.visible = true; sweetB.scale.setScalar(0.35); A(sweetB, 0.6, 0, 1.0); spin(sweetB, T);
    setConfetti(DUO2, t, tn - 0.4);
    return shot('h7', 8.0, 1.4);
  },
  armario(t, d, cue, T) {
    const tf = cue.fresco ?? d * 0.25, tc = cue.calido ?? d * 0.5, tch = cue.chamarra ?? d * 0.8;
    ped(DUO2); ped(DUO3, true);
    sunG.visible = true; sunG.scale.setScalar(0.35); A(sunG, 0.85, 1.4, -0.3); sunG.rotation.z = T * 0.3;
    P(freshB, t, Math.min(tf - 0.2, 0.3), 0.38); A(freshB, -0.3, 0.18, 0); spin(freshB, T);
    snowG.visible = true; snowG.scale.setScalar(0.35); A(snowG, 0.85, 1.4, -0.3, DUO3); snowG.rotation.z = T * 0.3;
    P(sweetB, t, Math.min(tc - 0.2, 0.6), 0.38); A(sweetB, -0.3, 0.18, 0, DUO3); spin(sweetB, T);
    if (t > tch - 0.3) { bud(you, 0.55, 0.5, 0.32, T, { look: [-0.6, 0.2], rotY: -0.4 }); you.userData.body.add(beanie); beanie.visible = true; }
    return splitShot('h1', 'h6', 7.2, 0.8);
  },
  final(t, d, cue, T) {
    const tm = cue.malo ?? d * 0.15, tt = cue.temporada ?? d * 0.5, tc = cue.clima ?? d * 0.82;
    ped(DUO2);
    sweetB.visible = true; sweetB.scale.setScalar(0.42); A(sweetB, -0.6, 0.18, 0); spin(sweetB, T);
    freshB.visible = true; freshB.scale.setScalar(0.42); A(freshB, 0.6, 0.18, 0); spin(freshB, T + 1);
    sunG.visible = true; sunG.scale.setScalar(0.35); A(sunG, 0.6, 1.9, 0); sunG.rotation.z = T * 0.3; snowG.visible = true; snowG.scale.setScalar(0.35); A(snowG, -0.6, 1.9, 0); snowG.rotation.z = T * 0.3;
    if (t > tc) { qMark.visible = true; qMark.scale.setScalar(Math.max(0.001, spring(prog(t, tc, tc + 0.4))) * 0.45); A(qMark, 0, 2.1, 0.3); qMark.rotation.y = 0.3 * Math.sin(T * 3); }
    return shot('h8', 7.0, 1.2);
  },
};
const _resetH = resetWorld;
resetWorld = function () { _resetH(); you.userData.body.remove(beanie, tie); };

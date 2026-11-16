// ================================================================== EL ALMIZCLE: DEL VENADO AL LABORATORIO
Object.assign(PALG, { a1: [0xc8a06a, 0x7a5a3a], a2: [0x9ad0ff, 0x5a8ac0], a3: [0xffd23a, 0xff8a3a], a4: [0x8a8a9a, 0x4a4a5a], a5: [0xff8a5a, 0xc04a2a], a6: [0x9ae08a, 0x3aa05a], a7: [0xc89aff, 0x7a4ad8], a8: [0x7ad0ff, 0x3a8ae0] });
function makeDeer() { const g = new THREE.Group(); const fur = new THREE.MeshStandardMaterial({ color: 0x9a6a3a }), dark = new THREE.MeshStandardMaterial({ color: 0x15151c });
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.42, 0.9, 8, 16), fur); body.rotation.z = Math.PI / 2; body.position.y = 1.05; g.add(body);
  [[-0.45, 0.25], [-0.45, -0.25], [0.45, 0.25], [0.45, -0.25]].forEach(([x, z]) => { const l = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.8, 8), fur); l.position.set(x, 0.42, z); g.add(l); });
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.22, 0.55, 12), fur); neck.position.set(0.72, 1.4, 0); neck.rotation.z = -0.5; g.add(neck);
  const head = new THREE.Group(); head.position.set(0.92, 1.68, 0); g.add(head); g.userData.head = head;
  const hd = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 12), fur); hd.scale.set(1.25, 0.9, 0.9); head.add(hd);
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.08, 10, 8), dark); nose.position.set(0.37, -0.02, 0); head.add(nose);
  [-1, 1].forEach(s => { const e = new THREE.Mesh(new THREE.SphereGeometry(0.075, 10, 8), WHITE); e.position.set(0.18, 0.1, s * 0.2); head.add(e); const p = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 6), BLACK); p.position.set(0.24, 0.1, s * 0.24); head.add(p);
    const ear = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 8), fur); ear.scale.set(0.5, 1.2, 0.3); ear.position.set(-0.12, 0.32, s * 0.2); ear.rotation.x = s * 0.4; head.add(ear);
    const fang = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.18, 6), WHITE); fang.rotation.z = Math.PI; fang.position.set(0.28, -0.24, s * 0.08); head.add(fang); });
  const tail = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 6), fur); tail.position.set(-0.9, 1.2, 0); g.add(tail);
  return add(g); }
const deer = makeDeer(); const herd = Array.from({ length: 6 }, () => makeDeer());
const antlers = new THREE.Group(); { const m = new THREE.MeshStandardMaterial({ color: 0xc89a5a }); [-1, 1].forEach(s => { const b = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.6, 8), m); b.position.set(0, 0.3, s * 0.15); b.rotation.x = s * 0.4; antlers.add(b);
  const t = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, 0.3, 8), m); t.position.set(0.1, 0.45, s * 0.3); t.rotation.z = -0.8; antlers.add(t); }); antlers.position.set(0, 0.25, 0); }
deer.userData.head.add(antlers);
const pod = add((() => { const g = new THREE.Group(); const m = new THREE.Mesh(new THREE.SphereGeometry(0.35, 20, 14), new THREE.MeshStandardMaterial({ color: 0x6a3a1a, roughness: 0.8 })); m.scale.set(1, 0.85, 1); g.add(m); return g; })());
const mountains = add((() => { const g = new THREE.Group(); [[-2.2, 2.6], [0, 3.4], [2.2, 2.8], [-1.0, 2.0], [1.2, 2.2]].forEach(([x, h], i) => { const c = new THREE.Mesh(new THREE.ConeGeometry(1.4, h, 6), new THREE.MeshStandardMaterial({ color: [0x7a8a9a, 0x6a7a8a][i % 2] })); c.position.set(x, h / 2, -2.4 - (i > 2 ? -0.6 : 0)); g.add(c);
  const sn = new THREE.Mesh(new THREE.ConeGeometry(0.45, h * 0.32, 6), new THREE.MeshStandardMaterial({ color: 0xffffff })); sn.position.set(x, h - h * 0.16, -2.4 - (i > 2 ? -0.6 : 0)); g.add(sn); }); return g; })());
const balance = add((() => { const g = new THREE.Group(); const m = new THREE.MeshStandardMaterial({ color: 0xc8a05a }); const post = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.15, 1.8, 10), m); post.position.y = 0.9; g.add(post);
  const beam = new THREE.Group(); beam.position.y = 1.85; g.add(beam); g.userData.beam = beam; const bar = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.08, 0.08), m); beam.add(bar);
  [-1, 1].forEach(s => { const pl = new THREE.Group(); pl.position.set(s * 1.15, -0.55, 0); beam.add(pl); const p = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.05, 20), m); pl.add(p); const r = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.55, 4), m); r.position.y = 0.27; pl.add(r);
    g.userData[s < 0 ? 'L' : 'R'] = pl; }); return g; })());
const goldBar = add((() => { const g = new THREE.Group(); const m = new THREE.MeshStandardMaterial({ color: 0xffc83a }); for (let i = 0; i < 3; i++) { const b = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.14, 0.22), m); b.position.set((i - 1) * 0.2, 0.08 + (i === 1 ? 0.14 : 0), 0); g.add(b); } return g; })());
const flaskA = add((() => { const g = new THREE.Group(); const gl = new THREE.MeshStandardMaterial({ color: 0xeaf6ff, transparent: true, opacity: 0.4 }); const b = new THREE.Mesh(new THREE.ConeGeometry(0.6, 0.9, 24, 1, true), gl); b.material.side = THREE.DoubleSide; b.position.y = 0.45; g.add(b);
  const n = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.5, 14, 1, true), gl); n.position.y = 1.1; g.add(n); const liq = new THREE.Mesh(new THREE.ConeGeometry(0.5, 0.5, 24), new THREE.MeshStandardMaterial({ color: 0x9ae08a })); liq.position.y = 0.25; g.add(liq); g.userData.liq = liq; return g; })());
const powder = add((() => { const g = new THREE.Group(); const d = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.06, 24), new THREE.MeshStandardMaterial({ color: 0xffffff })); g.add(d);
  const c = new THREE.Mesh(new THREE.ConeGeometry(0.45, 0.4, 20), new THREE.MeshStandardMaterial({ color: 0xfff6e0 })); c.position.y = 0.23; g.add(c); return g; })());
const chem = buddyG(0x3ad0a0); { const m = new THREE.MeshStandardMaterial({ color: 0x15151c }); const gg = new THREE.Group(); [-0.27, 0.27].forEach(x => { const r = new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.06, 8, 20), m); r.position.set(x, 1.5, 0.74); gg.add(r); }); chem.userData.body.add(gg);
  const moust = new THREE.Mesh(new THREE.CapsuleGeometry(0.06, 0.4, 4, 8), new THREE.MeshStandardMaterial({ color: 0x3a2a1a })); moust.rotation.z = Math.PI / 2; moust.position.set(0, 1.15, 0.85); chem.userData.body.add(moust); }
const y1888 = bigT('1888', 0xffc83a, 0.8), y1979 = bigT('1979', 0xffc83a, 0.8);
const shield = cartel(['PROTEGIDO'], 1.8, 0.7);
const tagBaur = cartel(['ALBERT', 'BAUR']);
const mols = [[0xffffff, 0xbfe6ff, 0xffd0e0], [0xffe6a0, 0xffffff, 0xd0f0ff], [0xe0d0ff, 0xffffff, 0xffe0f0]].map(c => moleculeG(c));
const shirtA = add(makeShirt());
const rowA = [0xff9ad0, 0x7ad0ff, 0xffc46b, 0x9ae08a, 0xc89aff].map(c => bottleG(c));
const mainA = bottleG(0xfff2d8, 'MUSC');
const SCENES = {
  gancho(t, d, cue, T) {
    const tv = cue.venado ?? d * 0.75;
    ped(DUO2);
    mainA.visible = true; mainA.scale.setScalar(t > tv - 0.3 ? 0.45 : 0.6); A(mainA, t > tv - 0.3 ? -0.8 : 0, 0.18, 0); spin(mainA, T);
    if (t > tv - 0.3) { P(deer, t, tv - 0.3, 0.55); A(deer, 0.55, 0.18, 0.2); deer.rotation.y = -0.4; antlers.visible = false; deer.userData.head.rotation.z = 0.15 * Math.sin(T * 3); }
    return shot('a1', 7.2, 1.2);
  },
  venado(t, d, cue, T) {
    const tc = cue.ciervo ?? d * 0.25, ta = cue.asia ?? d * 0.55, tcu = cue.cuernos ?? d * 0.85;
    lightAt(DUO2); ground.visible = true;
    if (t > ta - 0.4) { P(mountains, t, ta - 0.4, 1.0); A(mountains, 0, 0, -1.2); }
    deer.visible = true; deer.scale.setScalar(0.8); A(deer, -0.2, 0, 0.6); deer.rotation.y = -0.3 + 0.1 * Math.sin(T); deer.userData.head.rotation.z = 0.1 * Math.sin(T * 2);
    pod.visible = t > tc; pod.scale.setScalar(0.45 + 0.05 * Math.sin(T * 6)); A(pod, -0.25, 0.65, 0.95);
    antlers.visible = t > tcu - 0.5; antlers.scale.setScalar(Math.max(0.001, spring(prog(t, tcu - 0.5, tcu - 0.2)))); antlers.position.y = 0.25 + (t > tcu + 0.3 ? -3 * prog(t, tcu + 0.3, tcu + 0.9) : 0);
    if (t > tcu) { xMark.visible = true; xMark.scale.setScalar(Math.max(0.001, spring(prog(t, tcu, tcu + 0.3))) * 0.35); A(xMark, 0.55, 2.45, 0.9); }
    return shot('a2', 8.0, 1.4);
  },
  lujo(t, d, cue, T) {
    const tm = cue.medicina ?? d * 0.3, tl = cue.lujo ?? d * 0.55, to = cue.oro ?? d * 0.8;
    ped(DUO2);
    if (t < to - 0.6) {
      pod.visible = true; pod.scale.setScalar(0.8); A(pod, 0, 0.5, 0); pod.rotation.y = T;
      if (t > tl - 0.2) { crown2.visible = true; scene.add(crown2); crown2.scale.setScalar(Math.max(0.001, spring(prog(t, tl - 0.2, tl + 0.2))) * 0.7); A(crown2, 0, 1.05, 0); crown2.rotation.y = T; sparks.visible = true; setSparks(T, DUO2.clone().add(V(0, 0.8, 0)), 0.9, 1.2, 0xffd23a, 1); }
      if (t > tm - 0.2) { rowA.slice(0, 2).forEach((b, i) => { P(b, t, tm - 0.2 + i * 0.15, 0.35); A(b, i ? 1.0 : -1.0, 0.18, 0.2); }); }
      return shot('a3', 6.8, 1.0);
    }
    balance.visible = true; balance.scale.setScalar(0.85); A(balance, 0, 0.18, 0); const tilt = 0.3 * easeOut(prog(t, to - 0.2, to + 0.4)); balance.userData.beam.rotation.z = tilt;
    [balance.userData.L, balance.userData.R].forEach(p => p.rotation.z = -tilt);
    const pL = new THREE.Vector3(), pR = new THREE.Vector3(); balance.userData.L.getWorldPosition(pL); balance.userData.R.getWorldPosition(pR);
    pod.visible = true; pod.scale.setScalar(0.5); pod.position.copy(pL).add(V(0, 0.22, 0)); goldBar.visible = true; goldBar.scale.setScalar(1.1); goldBar.position.copy(pR).add(V(0, 0.03, 0));
    return shot('a3', 7.0, 1.3);
  },
  problema(t, d, cue, T) {
    const td = cue.decenas ?? d * 0.45, ta = cue.acaban ?? d * 0.8;
    lightAt(DUO2); ground.visible = true; mountains.visible = true; mountains.scale.setScalar(1); A(mountains, 0, 0, -1.6);
    herd.forEach((h, i) => { const pop = P(h, t, td - 0.4 + i * 0.1, 0.42); const gone = t > ta - 0.2 + i * 0.12; if (gone) { const k = prog(t, ta - 0.2 + i * 0.12, ta + 0.2 + i * 0.12); h.scale.setScalar(0.42 * (1 - k) + 0.001); }
      A(h, -1.1 + (i % 3) * 1.1, 0, 0.3 + Math.floor(i / 3) * 0.9); h.rotation.y = -0.4 + i * 0.2; h.userData.head.rotation.z = 0.1 * Math.sin(T * 2 + i); });
    if (t < td - 0.3) { pod.visible = true; pod.scale.setScalar(0.6); A(pod, 0, 1.2, 0.5); P(cartel_kg, t, 0.2, 0.7); A(cartel_kg, 0, 2.1, 0.5); }
    return shot('a4', 8.4, 1.3);
  },
  baur(t, d, cue, T) {
    const ty = cue.curioso ?? d * 0.1, te = cue.explosivo ?? d * 0.4, to = cue.olia ?? d * 0.7, ts = cue.sintetico ?? d * 0.88;
    ped(DUO2);
    if (t < te - 0.4) { P(y1888, t, ty - 0.3, 0.6); A(y1888, 0, 2.0, -0.6); y1888.rotation.y = 0.2 * Math.sin(T); bud(chem, 0, 0.5, 0.5, T, { look: [0, 0.2] }); P(tagBaur, t, ty + 0.6, 0.6); A(tagBaur, 0.85, 2.2, 0.3); return shot('a5', 7.4, 1.3); }
    bud(chem, -0.75, 0.3, 0.55, T, { look: [0.8, -0.1], rotY: 0.6, mood: t > to ? 'smile' : 'o', mouthOpen: 0.9, eye: t > te && t < to ? 1.4 : 1.1, blink: 1, brow: t > te && t < to ? 0.8 : 0, armR: 1.6 });
    flaskA.visible = true; flaskA.scale.setScalar(0.75); A(flaskA, 0.6, 0.18, 0.3); flaskA.rotation.z = t > te && t < te + 0.6 ? 0.2 * Math.sin(T * 40) : 0;
    if (t > te && t < te + 1.2) { const k = prog(t, te, te + 1.2); sparks.visible = true; setSparks(T, DUO2.clone().add(V(0.6, 1.2, 0.3)), 0.4 + 1.2 * k, 1.5, 0xff8a3a, 1); }
    if (t > to - 0.2) { P(powder, t, to - 0.2, 0.7); A(powder, 0.6, 0.18, 1.1); setHearts(t, DUO2.clone().add(V(-0.6, 1.9, 0.4)), to, 3, 0.4); }
    if (t > ts - 0.2) { P(mols[0], t, ts - 0.2, 0.6); A(mols[0], 0.3, 2.2, 0.3); mols[0].rotation.y = T; }
    return shot('a5', 7.4, 1.3);
  },
  protegido(t, d, cue, T) {
    const tp = cue.protegido ?? d * 0.3, tx = cue.prohibido ?? d * 0.8;
    lightAt(DUO2); ground.visible = true; mountains.visible = true; mountains.scale.setScalar(1); A(mountains, 0, 0, -1.6);
    deer.visible = true; deer.scale.setScalar(0.7); A(deer, -0.4, 0, 0.5); deer.rotation.y = -0.3; antlers.visible = false; deer.userData.head.rotation.z = 0.1 * Math.sin(T * 2);
    P(y1979, t, 0.1, 0.42); A(y1979, 0.85, 0.35, 1.4); 
    if (t > tp - 0.2) { P(shield, t, tp - 0.2, 0.75); A(shield, 0.0, 2.15, 0.9); check.visible = true; check.scale.setScalar(Math.max(0.001, spring(prog(t, tp, tp + 0.3))) * 0.3); A(check, -1.1, 2.15, 0.9); }
    if (t > tx - 0.3) { pod.visible = true; pod.scale.setScalar(0.4); A(pod, 1.0, 0.5, 1.0); xMark.visible = true; xMark.scale.setScalar(Math.max(0.001, spring(prog(t, tx - 0.3, tx))) * 0.35); A(xMark, 1.0, 0.55, 1.3); }
    return shot('a6', 8.2, 1.4);
  },
  hoy(t, d, cue, T) {
    const ts = cue.suave ?? d * 0.35, tl = cue.laboratorio ?? d * 0.15, tr = cue.ropa ?? d * 0.45, tt = cue.todos ?? d * 0.6, tdi = cue.distintos ?? d * 0.75;
    if (t < ts) {
      ped(DUO2); ped(DUO3, true);
      deer.visible = true; deer.scale.setScalar(0.55); A(deer, -0.3, 0.18, 0); deer.rotation.y = -0.4; antlers.visible = false; pod.visible = true; pod.scale.setScalar(0.35); A(pod, 0.9, 0.45, 0.4);
      flaskA.visible = true; flaskA.scale.setScalar(0.7); A(flaskA, -0.6, 0.18, 0, DUO3); P(mols[1], t, tl - 0.2, 0.55); A(mols[1], 0.5, 1.1, 0.2, DUO3); mols[1].rotation.y = T;
      return splitShot('a1', 'a8');
    }
    ped(DUO2);
    if (t < tt - 0.3) {
      shirtA.visible = true; shirtA.scale.setScalar(0.7); A(shirtA, -0.5, 0.6, 0); spin(shirtA, T, 0.2);
      sparks.visible = true; setSparks(T, DUO2.clone().add(V(-0.5, 1.2, 0)), 0.9, 1.4, 0xbfe6ff, 1);
      bud(you, 0.85, 0.4, 0.5, T, { look: [-0.8, 0.1], rotY: -0.5, eye: 0.5, blink: 0.4 }); you.userData.nose.visible = true; if (t > tr) setHearts(t, DUO2.clone().add(V(0.8, 1.7, 0.5)), tr, 3, 0.4);
      return shot('a7', 7.2, 1.2);
    }
    rowA.forEach((b, i) => { P(b, t, tt - 0.3 + i * 0.1, 0.34); A(b, -1.2 + i * 0.6, 0.18, 0); spin(b, T + i); });
    if (t > tdi - 0.3) mols.forEach((m, i) => { P(m, t, tdi - 0.3 + i * 0.2, 0.45); A(m, -0.9 + i * 0.9, 2.0, 0.4); m.rotation.y = T + i; });
    return shot('a7', 7.6, 1.3);
  },
  final(t, d, cue, T) {
    const tg = cue.gusta ?? d * 0.6;
    ped(DUO2);
    deer.visible = true; deer.scale.setScalar(0.5); A(deer, -0.6, 0.18 + Math.abs(Math.sin(T * 4)) * 0.1, 0); deer.rotation.y = -0.3; antlers.visible = false; deer.userData.head.rotation.z = 0.2 * Math.sin(T * 4);
    bud(you, 0.85, 0.4, 0.5, T, { look: [-0.8, 0.1], rotY: -0.5, armR: 2.0 + 0.3 * Math.sin(T * 8) });
    setHearts(t, DUO2.clone().add(V(0, 1.9, 0.3)), 0.3, 3, 0.5);
    if (t > tg) { qMark.visible = true; qMark.scale.setScalar(Math.max(0.001, spring(prog(t, tg, tg + 0.4))) * 0.45); A(qMark, 0.9, 1.9, 0.4); qMark.rotation.y = 0.3 * Math.sin(T * 3); }
    return shot('a6', 7.2, 1.2);
  },
};
const cartel_kg = cartel(['1 KG'], 1.2, 0.6);

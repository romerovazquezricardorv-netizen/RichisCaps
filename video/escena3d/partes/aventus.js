// ================================================================== CREED AVENTUS (frascos genéricos)
Object.assign(PALG, { av1: [0x9ae08a, 0x3aa05a], nap: [0xe8c890, 0xa8784a], olor: [0xffd23a, 0xff8a3a], lot: [0x7a3a6a, 0x3a1a3a], clo: [0x7ad0ff, 0x3a8ae0], ven: [0x9ae08a, 0x3aa05a], av7: [0xc89aff, 0x7a4ad8] });
const darkB = () => { const b = makeBottle(0x3a3a3a, 'EDP'); scene.add(b); SETS.push(b); return b; };
const mainB = darkB();
const bicorne = new THREE.Group(); { const m = new THREE.MeshStandardMaterial({ color: 0x15151c }); const hs = new THREE.Shape(); hs.absarc(0, 0, 0.95, 0, Math.PI, false); hs.lineTo(0.95, 0);
  const hg = new THREE.ExtrudeGeometry(hs, { depth: 0.3, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 2 }); hg.translate(0, 0, -0.15); hg.scale(1, 0.55, 1); const h = new THREE.Mesh(hg, m); h.position.y = 1.95; bicorne.add(h);
  const coc = new THREE.Mesh(new THREE.CircleGeometry(0.12, 20), new THREE.MeshStandardMaterial({ color: 0xe8262e })); coc.position.set(0.45, 2.15, 0.22); bicorne.add(coc); }
const pineapple = new THREE.Group(); { const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 20, 16), new THREE.MeshStandardMaterial({ color: 0xf2b23a })); body.scale.y = 1.35; pineapple.add(body);
  for (let i = 0; i < 7; i++) { const l = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.6, 6), new THREE.MeshStandardMaterial({ color: 0x3aa05a })); const a = i / 7 * Math.PI * 2; l.position.set(Math.cos(a) * 0.1, 0.85, Math.sin(a) * 0.1); l.rotation.set(Math.sin(a) * 0.5, 0, -Math.cos(a) * 0.5); pineapple.add(l); }
  for (let i = 0; i < 18; i++) { const d = new THREE.Mesh(new THREE.SphereGeometry(0.05, 6, 4), new THREE.MeshStandardMaterial({ color: 0xa8641a })); const a = i * 2.4, y = -0.45 + (i % 6) * 0.18; d.position.set(Math.cos(a) * 0.48, y, Math.sin(a) * 0.48); pineapple.add(d); } }
scene.add(pineapple); SETS.push(pineapple);
const birch = new THREE.Group(); { for (let i = 0; i < 3; i++) { const log = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.24, 1.6, 18), new THREE.MeshStandardMaterial({ color: 0xf4f0e6 })); log.rotation.z = Math.PI / 2; log.position.set(0, 0.24 + (i === 2 ? 0.4 : 0), (i === 2 ? 0 : (i ? 0.26 : -0.26))); birch.add(log);
    for (let k = 0; k < 4; k++) { const mk = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.03, 0.05), new THREE.MeshStandardMaterial({ color: 0x222222 })); mk.position.set(-0.6 + k * 0.4, log.position.y + 0.2, log.position.z + 0.08); birch.add(mk); } } }
scene.add(birch); SETS.push(birch);
const smoke = Array.from({ length: 6 }, () => { const m = new THREE.Mesh(new THREE.SphereGeometry(0.25, 12, 10), new THREE.MeshStandardMaterial({ color: 0xb8b8c0, transparent: true, opacity: 0.8 })); scene.add(m); SETS.push(m); return m; });
const lots = [0x3a3a3a, 0x5a4a2a, 0x2a3a4a].map((c, i) => { const b = makeBottle(c, 'LOTE ' + (i + 1)); scene.add(b); SETS.push(b); return b; });
const wineGlass = new THREE.Group(); { const prof = [[0, 0], [0.3, 0], [0.04, 0.05], [0.04, 0.5], [0.28, 0.65], [0.32, 0.95], [0.3, 1.1]].map(([r, y]) => new THREE.Vector2(r, y));
  wineGlass.add(new THREE.Mesh(new THREE.LatheGeometry(prof, 28), new THREE.MeshStandardMaterial({ color: 0xeaf6ff, transparent: true, opacity: 0.5, side: THREE.DoubleSide })));
  const wine = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.2, 0.2, 24), new THREE.MeshStandardMaterial({ color: 0x5a4a2a })); wine.position.y = 0.72; wineGlass.add(wine); }
const clones = Array.from({ length: 12 }, () => { const b = makeBottle(0x3a3a3a, '?'); scene.add(b); SETS.push(b); return b; });
const dove = new THREE.Group(); { const m = new THREE.MeshStandardMaterial({ color: 0xffffff }); const b = new THREE.Mesh(new THREE.SphereGeometry(0.3, 14, 10), m); b.scale.set(1.3, 0.8, 0.8); dove.add(b);
  [-1, 1].forEach(s => { const w = new THREE.Mesh(new THREE.SphereGeometry(0.3, 12, 8), m); w.scale.set(0.8, 0.15, 0.6); w.position.set(0, 0.15, s * 0.3); w.rotation.x = s * 0.6; dove.add(w); }); }
const sword = new THREE.Group(); { const bl = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.4, 0.03), new THREE.MeshStandardMaterial({ color: 0xd8dde2 })); bl.position.y = 0.8; sword.add(bl);
  const gu = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.08, 0.08), new THREE.MeshStandardMaterial({ color: 0xffc83a })); gu.position.y = 0.1; sword.add(gu); }
scene.add(dove, sword); SETS.push(dove, sword, crown2);
const _resetA = resetWorld;
resetWorld = function () { _resetA(); you.userData.body.remove(bicorne); you.userData.hand.remove(wineGlass); };
const SCENES = {
  gancho(t, d, cue, T) {
    const te = cue.euros ?? d * 0.8;
    ped(DUO2);
    mainB.visible = true; mainB.scale.setScalar(0.8); mainB.position.copy(DUO2).add(V(0, 0.18, 0)); mainB.rotation.y = 0.3 * Math.sin(T);
    if (t > te - 0.3) { setBillRain(DUO2, t, te - 0.3); coinPile.visible = true; coinPile.position.copy(DUO2).add(V(0, 0.18, 1.3)); coinPile.scale.setScalar(Math.max(0.001, spring(prog(t, te - 0.3, te + 0.2))) * 0.8); }
    return { ...sh(DUO2, V(0, 2.4, lerp(5.6, 8.4, easeOut(prog(t, 0, d)))), V(0, 1.5, 0)), pal: 'av1' };
  },
  origen(t, d, cue, T) {
    const tn = cue.napoleon ?? d * 0.65, tr = cue.romance ?? d * 0.85;
    ped(DUO2);
    mainB.visible = true; mainB.scale.setScalar(0.6); mainB.position.copy(DUO2).add(V(-0.9, 0.18, 0)); mainB.rotation.y = 0.3;
    you.scale.setScalar(0.85); you.position.copy(DUO2).add(V(0.7, 0.18, 0.4));
    if (t > tn - 0.3) { you.userData.body.add(bicorne); bicorne.visible = true; bicorne.scale.setScalar(Math.max(0.001, spring(prog(t, tn - 0.3, tn + 0.1)))); }
    pose(you, { hop: hopF(T, 2, 0.03), mood: t > tn ? 'smile' : 'o', eye: 1.1, look: [-0.5, 0.2], blink: 1, brow: t > tn ? -0.6 : 0, rotY: -0.3, armR: t > tn ? 0.9 : 0.3 });
    const icons = [sword, dove]; icons.forEach((o, i) => { const p = spring(prog(t, tr - 0.5 + i * 0.25, tr - 0.1 + i * 0.25)); o.visible = p > 0.01; o.scale.setScalar(Math.max(0.001, p) * 0.8); o.position.copy(DUO2).add(V(-1.0 + i * 1.0, 2.8 + 0.1 * Math.sin(T * 3 + i), 0.5)); o.rotation.z = i ? 0 : 0.6; });
    if (t > tr + 0.3) setHearts(t, DUO2.clone().add(V(1.0, 2.7, 0.5)), tr + 0.3, 2, 0.3);
    return { ...sh(DUO2, V(0, 2.3, 7.8), V(0, 1.6, 0)), pal: 'nap' };
  },
  olor(t, d, cue, T) {
    const tp = cue.pina ?? d * 0.2, th = cue.humo ?? d * 0.6;
    ped(DUO2);
    pineapple.visible = true; pineapple.scale.setScalar(Math.max(0.001, spring(prog(t, tp - 0.3, tp + 0.1))) * 1.2); pineapple.position.copy(DUO2).add(V(-0.7, 0.85, 0.2)); pineapple.rotation.y = T * 0.6;
    const pb = spring(prog(t, th - 0.3, th + 0.1)); birch.visible = pb > 0.01; birch.scale.setScalar(Math.max(0.001, pb)); birch.position.copy(DUO2).add(V(0.9, 0.18, 0.3)); birch.rotation.y = -0.4;
    smoke.forEach((s, i) => { const a = (T * 0.5 + i / 6) % 1; s.visible = t > th; s.position.copy(DUO2).add(V(0.9 + Math.sin(i * 2 + T) * 0.3, 0.8 + a * 2.4, 0.3)); s.scale.setScalar(0.6 + a * 1.2); s.material.opacity = 0.8 * (1 - a); });
    return { ...sh(DUO2, V(0, 2.2, 6.8), V(0, 1.3, 0)), pal: 'olor' };
  },
  lotes(t, d, cue, T) {
    const tl = cue.lote ?? d * 0.3, tv = cue.vinos ?? d * 0.85;
    ped(DUO2);
    lots.forEach((b, i) => { const p = spring(prog(t, tl - 0.2 + i * 0.15, tl + 0.2 + i * 0.15)); b.visible = p > 0.01; b.scale.setScalar(Math.max(0.001, p) * 0.5); b.position.copy(DUO2).add(V(-1.1 + i * 1.1, 0.18, -0.2)); b.rotation.y = 0.2 * Math.sin(T + i); });
    if (t > tv - 0.4) { you.scale.setScalar(0.7); you.position.copy(DUO2).add(V(1.6, 0.18, 1.0)); you.userData.hand.add(wineGlass); wineGlass.visible = true; wineGlass.position.set(0.1, -0.25, 0.2); wineGlass.scale.setScalar(0.8); wineGlass.rotation.z = 0.3 * Math.sin(T * 6);
      you.userData.nose.visible = true; pose(you, { hop: 0, mood: 'smile', eye: 1.1, look: [-0.6, 0.3], blink: 0.35, brow: -0.3, rotY: -0.6, armR: 1.6 }); }
    return { ...sh(DUO2, V(0.2, 2.2, 8.0), V(0.2, 1.3, 0)), pal: 'lot' };
  },
  clones(t, d, cue, T) {
    const tc = cue.clones ?? d * 0.5;
    ped(DUO2);
    mainB.visible = true; mainB.scale.setScalar(0.65); mainB.position.copy(DUO2).add(V(0, 0.18, 0.4)); mainB.rotation.y = 0.2 * Math.sin(T);
    clones.forEach((b, i) => { const p = spring(prog(t, tc - 0.6 + i * 0.07, tc - 0.2 + i * 0.07)); b.visible = p > 0.01; b.scale.setScalar(Math.max(0.001, p) * 0.38);
      const a = i / 12 * Math.PI * 2; b.position.copy(DUO2).add(V(Math.cos(a) * 1.9, 0.18 + (i % 2) * 0.0, Math.sin(a) * 1.0 - 0.3)); b.rotation.y = -a; });
    return { ...sh(DUO2, V(0, 3.2, 8.4), V(0, 1.0, 0)), pal: 'clo' };
  },
  venta(t, d, cue, T) {
    const tv = cue.venta ?? d * 0.5, tj = cue.joya ?? d * 0.85;
    ped(DUO2);
    mainB.visible = true; mainB.scale.setScalar(0.7); mainB.position.copy(DUO2).add(V(0, 0.18, 0)); mainB.rotation.y = 0.3 * Math.sin(T);
    billsG.visible = t > tv - 0.3; billsG.position.copy(DUO2).add(V(0, 0.18, 1.4)); billsG.scale.setScalar(Math.max(0.001, spring(prog(t, tv - 0.3, tv + 0.2))) * 0.8);
    if (t > tj - 0.2) { crown2.visible = true; scene.add(crown2); crown2.position.copy(DUO2).add(V(0, 2.95 * 0.7 + 0.4, 0)); crown2.scale.setScalar(Math.max(0.001, spring(prog(t, tj - 0.2, tj + 0.2))) * 1.0); crown2.rotation.y = T; }
    sparks.visible = true; setSparks(T, DUO2.clone().add(V(0, 1.3, 0)), 1.4, 2, 0xffd23a, 0.8);
    return { ...sh(DUO2, V(0, 2.4, 7.8), V(0, 1.6, 0)), pal: 'ven' };
  },
  final(t, d, cue, T) {
    const to = cue.olido ?? d * 0.3;
    ped(DUO2);
    mainB.visible = true; mainB.scale.setScalar(0.75); mainB.position.copy(DUO2).add(V(-0.4, 0.18, 0)); mainB.rotation.y = 0.3 * Math.sin(T);
    you.scale.setScalar(0.7); you.position.copy(DUO2).add(V(1.1, 0.18, 0.6)); you.userData.nose.visible = true;
    pose(you, { hop: hopF(T, 3, 0.05), mood: 'smile', eye: 1.2, look: [-0.8, 0.2], blink: 0.35, rotY: -0.6 });
    qMark.visible = t > to; qMark.scale.setScalar(Math.max(0.001, spring(prog(t, to, to + 0.4)) * 0.6)); qMark.position.copy(you.position).add(V(0.3, 2.1, 0.2)); qMark.rotation.y = 0.3 * Math.sin(T * 3);
    return { ...sh(DUO2, V(0, 2.2, 7.2), V(0, 1.4, 0)), pal: 'av7' };
  },
};


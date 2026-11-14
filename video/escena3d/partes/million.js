// ================================================================== 1 MILLION: EL LINGOTE (modelo genérico)
Object.assign(PALG, { m1: [0xffd23a, 0xff8a3a], m2: [0x9ae08a, 0x3aa05a], m3: [0x7ad0ff, 0x3a8ae0], m4: [0xd0d8e0, 0x8a96a6], m5: [0xc89aff, 0x7a4ad8], m6: [0xff9ad0, 0xe0508a] });
const ingot = new THREE.Group();
{ const sh2 = new THREE.Shape(); sh2.moveTo(-0.9, 0); sh2.lineTo(0.9, 0); sh2.lineTo(0.7, 1.6); sh2.lineTo(-0.7, 1.6); sh2.lineTo(-0.9, 0);
  const g = new THREE.ExtrudeGeometry(sh2, { depth: 0.6, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.06, bevelSegments: 2 }); g.translate(0, 0, -0.3);
  const gold = new THREE.MeshStandardMaterial({ color: 0xffc83a, metalness: 0.6, roughness: 0.3 }); ingot.add(new THREE.Mesh(g, gold));
  const plate = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 0.9), new THREE.MeshStandardMaterial({ color: 0xe8b030 })); plate.position.set(0, 0.8, 0.37); ingot.add(plate);
  const cap = new THREE.Mesh(new RoundedBoxGeometry(0.45, 0.35, 0.4, 3, 0.06), new THREE.MeshStandardMaterial({ color: 0x15151c })); cap.position.y = 1.85; ingot.add(cap); }
scene.add(ingot); SETS.push(ingot);
const ingots = Array.from({ length: 5 }, () => { const g = ingot.clone(); scene.add(g); SETS.push(g); return g; });
const board = new THREE.Group(); { const b = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.7, 0.08), new THREE.MeshStandardMaterial({ color: 0xffffff })); b.position.y = 1.9; board.add(b);
  const c = document.createElement('canvas'); c.width = 320; c.height = 220; const x = c.getContext('2d'); x.fillStyle = '#f6f6ff'; x.fillRect(0, 0, 320, 220); x.strokeStyle = '#2a3aa0'; x.lineWidth = 5;
  x.beginPath(); x.moveTo(90, 180); x.lineTo(230, 180); x.lineTo(205, 70); x.lineTo(115, 70); x.closePath(); x.stroke(); x.strokeRect(140, 40, 40, 30); x.font = '700 22px Inter'; x.fillStyle = '#2a3aa0'; x.fillText('¿lingote?', 20, 30);
  const s = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 1.5), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c) })); s.position.set(0, 1.9, 0.05); board.add(s);
  [-1, 1].forEach(sx => { const l = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.2, 0.08), new THREE.MeshStandardMaterial({ color: 0x8a5a34 })); l.position.set(sx * 0.9, 0.6, 0); board.add(l); }); }
scene.add(board); SETS.push(board);
const metalDress = new THREE.Group(); { const m = new THREE.MeshStandardMaterial({ color: 0xd8dde2, metalness: 0.7, roughness: 0.3 });
  for (let r = 0; r < 5; r++) for (let k = 0; k < 9; k++) { const a = (k / 9) * Math.PI * 1.1 - Math.PI * 0.55; const p = new THREE.Mesh(new THREE.CircleGeometry(0.16, 6), m);
    p.position.set(Math.sin(a) * 0.76, 0.55 + r * 0.22, Math.cos(a) * 0.62); p.lookAt(p.position.x * 3, p.position.y, p.position.z * 3); metalDress.add(p); } }
const _resetM = resetWorld;
resetWorld = function () { _resetM(); pal.userData.body.remove(metalDress); ingot.scale.setScalar(1); ingot.rotation.set(0, 0, 0); };
const SCENES = {
  gancho(t, d, cue, T) {
    const tl = cue.lingote ?? d * 0.75;
    ped(DUO2);
    ingot.visible = true; ingot.scale.setScalar(Math.max(0.001, spring(prog(t, 0.2, 0.7)))); ingot.position.copy(DUO2).add(V(0, 0.18, 0)); ingot.rotation.y = 0.5 * Math.sin(T * 0.8);
    if (t > tl) { sparks.visible = true; setSparks(T, DUO2.clone().add(V(0, 1.0, 0)), 1.2, 1.6, 0xffd23a, 1); }
    return { ...sh(DUO2, V(0, 2.0, lerp(4.8, 6.4, easeOut(prog(t, 0, d)))), V(0, 1.1, 0)), pal: 'm1' };
  },
  nombre(t, d, cue, T) {
    const tu = cue.unmillon ?? d * 0.3, tl = cue.lujo ?? d * 0.8;
    ped(DUO2);
    ingot.visible = true; ingot.scale.setScalar(0.9); ingot.position.copy(DUO2).add(V(0, 0.18, 0)); ingot.rotation.y = 0.3 * Math.sin(T);
    if (t > tu - 0.2) setBillRain(DUO2, t, tu - 0.2);
    if (t > tl - 0.2) { coinPile.visible = true; coinPile.position.copy(DUO2).add(V(0, 0.18, 1.4)); coinPile.scale.setScalar(Math.max(0.001, spring(prog(t, tl - 0.2, tl + 0.2))) * 0.8); }
    return { ...sh(DUO2, V(0, 2.4, 8.2), V(0, 1.5, 0)), pal: 'm2' };
  },
  frasco(t, d, cue, T) {
    const tn = cue.noe ?? d * 0.25, tm = cue.metal ?? d * 0.6;
    if (t < tm - 0.2) {
      ped(DUO2); board.visible = true; board.position.copy(DUO2).add(V(0.3, 0.18, -0.4));
      you.scale.setScalar(0.75); you.position.copy(DUO2).add(V(-1.3, 0.18, 0.5));
      pose(you, { hop: hopF(T, 2, 0.03), mood: 'smile', eye: 1.1, look: [0.8, 0.4], blink: blinkAt(T, 0.3), rotY: 0.6, armR: 1.6 + 0.3 * Math.sin(T * 8) });
      return { ...sh(DUO2, V(0, 2.4, 7.6), V(0, 1.6, 0)), pal: 'm3' };
    }
    ped(DUO2);
    ingot.visible = true; ingot.scale.setScalar(1.1); ingot.position.copy(DUO2).add(V(0, 0.18, 0)); ingot.rotation.y = -0.4 + 0.8 * easeIO(prog(t, tm, d));
    sparks.visible = true; setSparks(T, DUO2.clone().add(V(0, 1.0, 0.4)), 1.2, 1.6, 0xffd23a, 1);
    return { ...sh(DUO2, V(0, 2.0, 7.0), V(0, 1.1, 0)), pal: 'm1' };
  },
  paco(t, d, cue, T) {
    const tv = cue.vestidos ?? d * 0.85;
    ped(DUO2);
    pal.scale.setScalar(0.95); pal.position.copy(DUO2).add(V(0, 0.18, 0.2));
    if (t > tv - 0.3) { pal.userData.body.add(metalDress); metalDress.visible = true; metalDress.scale.setScalar(Math.max(0.001, spring(prog(t, tv - 0.3, tv + 0.1)))); }
    pose(pal, { hop: hopF(T, 2.5, 0.05), mood: 'smile', eye: 1.15, look: [0, 0.3], blink: blinkAt(T, 0.3), rotY: 0.15 * Math.sin(T), armL: 0.4, armR: 0.4 });
    if (t > tv) { sparks.visible = true; setSparks(T, pal.position.clone().add(V(0, 1.2, 0)), 1.0, 1.8, 0xffffff, 1); }
    return { ...sh(DUO2, V(0, 2.2, 6.8), V(0, 1.5, 0)), pal: 'm4' };
  },
  exito(t, d, cue, T) {
    const tv = cue.vendidos ?? d * 0.5;
    ped(DUO2);
    ingots.forEach((g, i) => { const p = spring(prog(t, 0.2 + i * 0.15, 0.6 + i * 0.15)); g.visible = p > 0.01; g.scale.setScalar(Math.max(0.001, p) * 0.55);
      g.position.copy(DUO2).add(V(-1.3 + (i % 3) * 1.3, 0.18 + (i > 2 ? 1.0 : 0), i > 2 ? -0.3 : 0.3)); if (i > 2) g.position.x += 0.65; g.rotation.y = 0.2 * Math.sin(T + i); });
    if (t > tv) setConfetti(DUO2, t, tv);
    return { ...sh(DUO2, V(0, 2.4, 8.2), V(0, 1.4, 0)), pal: 'm5' };
  },
  final(t, d, cue, T) {
    const tf = cue.frasco2 ?? d * 0.4;
    ped(DUO2);
    ingot.visible = true; ingot.scale.setScalar(0.85); ingot.position.copy(DUO2).add(V(-0.5, 0.18, 0)); ingot.rotation.y = 0.3 * Math.sin(T);
    you.scale.setScalar(0.7); you.position.copy(DUO2).add(V(1.1, 0.18, 0.6));
    pose(you, { hop: hopF(T, 3, 0.05), mood: 'o', mouthOpen: 1.1, eye: 1.3, look: [-0.8, 0.2], blink: 1, rotY: -0.6 });
    qMark.visible = t > tf; qMark.scale.setScalar(Math.max(0.001, spring(prog(t, tf, tf + 0.4)) * 0.6)); qMark.position.copy(you.position).add(V(0.3, 2.1, 0.2)); qMark.rotation.y = 0.3 * Math.sin(T * 3);
    return { ...sh(DUO2, V(0, 2.2, 7.2), V(0, 1.3, 0)), pal: 'm6' };
  },
};


// ================================================================== 1 MILLION: EL LINGOTE (modelo genérico)
Object.assign(PALG, { m1: [0xffd23a, 0xff8a3a], m2: [0x9ae08a, 0x3aa05a], m3: [0x7ad0ff, 0x3a8ae0], m4: [0xd0d8e0, 0x8a96a6], m5: [0xc89aff, 0x7a4ad8], m6: [0xff9ad0, 0xe0508a], m7: [0x2a2a3a, 0x15151c], m8: [0x5a4a7a, 0x2a1a4a], m9: [0xffb03a, 0xe0603a], m10: [0x3ad0d0, 0x2a8aa0] });
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

const y1966 = text3d('1966', 1.1, new THREE.MeshStandardMaterial({ color: 0xffc83a, metalness: 0.5, roughness: 0.3 }), 0.3); scene.add(y1966); SETS.push(y1966);
const y2008 = text3d('2008', 1.0, new THREE.MeshStandardMaterial({ color: 0xffc83a, metalness: 0.5, roughness: 0.3 }), 0.3); scene.add(y2008); SETS.push(y2008);
const y2023 = text3d('2023', 0.8, new THREE.MeshStandardMaterial({ color: 0xffc83a }), 0.25); scene.add(y2023); SETS.push(y2023);
const n12 = text3d('12', 1.3, new THREE.MeshStandardMaterial({ color: 0xffd23a }), 0.3); scene.add(n12); SETS.push(n12);
// pasarela con fotógrafos (flashes)
const runway = new THREE.Group(); { const r = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.25, 9), new THREE.MeshStandardMaterial({ color: 0xf2f2f6 })); r.position.y = 0.12; runway.add(r);
  for (let i = 0; i < 9; i++) [-1, 1].forEach(s => { const l = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffe08a })); l.position.set(s * 0.95, 0.26, -4 + i); runway.add(l); }); }
scene.add(runway); SETS.push(runway);
const cams = Array.from({ length: 6 }, (_, i) => { const g = new THREE.Group(); const b = new THREE.Mesh(new RoundedBoxGeometry(0.5, 0.34, 0.3, 3, 0.05), new THREE.MeshStandardMaterial({ color: 0x2a2a30 })); g.add(b);
  const l = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.18, 16), new THREE.MeshStandardMaterial({ color: 0x15151c })); l.rotation.x = Math.PI / 2; l.position.z = 0.2; g.add(l);
  const f = new THREE.Mesh(new THREE.CircleGeometry(0.28, 20), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 })); f.position.set(0.12, 0.3, 0.2); g.add(f); g.userData.flash = f;
  const st = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.4, 6), new THREE.MeshStandardMaterial({ color: 0x5a5a66 })); st.position.y = -0.85; g.add(st); scene.add(g); SETS.push(g); return g; });
const rings = new THREE.Group(); { const m = new THREE.MeshStandardMaterial({ color: 0xa0a8b0 }); for (let i = 0; i < 6; i++) { const r = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.025, 8, 20), m); r.position.set(-0.4 + i * 0.16, (i % 2) * 0.12, 0); r.rotation.y = (i % 2) * Math.PI / 2; rings.add(r); } }
scene.add(rings); SETS.push(rings);
// la crítica elegante
const critic = makeBuddy(0x2a2a30); scene.add(critic); SETS.push(critic);
const pearls = new THREE.Group(); { const m = new THREE.MeshStandardMaterial({ color: 0xfff8ee, roughness: 0.3 }); for (let i = 0; i < 15; i++) { const a = -0.3 + (i / 14) * (Math.PI + 0.6); const p = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 8), m); p.position.set(Math.cos(a) * 0.62, 0.95 - Math.sin(a) * 0.12, Math.sin(a) * 0.5 + 0.12); pearls.add(p); } }
const cHat = new THREE.Group(); { const m = new THREE.MeshStandardMaterial({ color: 0xf2f2f6 }); const b = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.05, 32), m); cHat.add(b); const t = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.55, 0.35, 28), m); t.position.y = 0.18; cHat.add(t);
  const bd = new THREE.Mesh(new THREE.CylinderGeometry(0.56, 0.56, 0.1, 28), new THREE.MeshStandardMaterial({ color: 0x15151c })); bd.position.y = 0.06; cHat.add(bd); cHat.position.y = 1.95; }
critic.userData.body.add(pearls, cHat);
const lorgnette = new THREE.Group(); { const m = new THREE.MeshStandardMaterial({ color: 0xffc83a }); [-0.16, 0.16].forEach(x => { const r = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.025, 8, 20), m); r.position.x = x; lorgnette.add(r); }); const h = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.5, 6), m); h.position.set(0.3, -0.25, 0); h.rotation.z = 0.5; lorgnette.add(h); }
scene.add(lorgnette); SETS.push(lorgnette);
// bóveda del banco
const vault = new THREE.Group(); { const wall = new THREE.Mesh(new THREE.BoxGeometry(4.6, 4.2, 0.4), new THREE.MeshStandardMaterial({ color: 0x5a6070 })); wall.position.set(0, 2.1, -0.2); vault.add(wall);
  const hole = new THREE.Mesh(new THREE.CircleGeometry(1.35, 48), new THREE.MeshBasicMaterial({ color: 0x1a1210 })); hole.position.set(0, 1.9, 0.01); vault.add(hole);
  const hinge = new THREE.Group(); hinge.position.set(-1.35, 1.9, 0.05); vault.add(hinge); vault.userData.hinge = hinge;
  const steel = new THREE.MeshStandardMaterial({ color: 0xc0c6d0, metalness: 0.6, roughness: 0.3 });
  const door = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.3, 0.35, 48), steel); door.rotation.x = Math.PI / 2; door.position.set(1.35, 0, 0.2); hinge.add(door);
  const wheel = new THREE.Group(); wheel.position.set(1.35, 0, 0.42); hinge.add(wheel); vault.userData.wheel = wheel;
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.05, 8, 32), new THREE.MeshStandardMaterial({ color: 0x8a909a })); wheel.add(rim);
  for (let i = 0; i < 3; i++) { const sp = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.07, 0.07), rim.material); sp.rotation.z = i * Math.PI / 3; wheel.add(sp); }
  for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2; const bo = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.1, 10), rim.material); bo.rotation.x = Math.PI / 2; bo.position.set(1.35 + Math.cos(a) * 1.05, Math.sin(a) * 1.05, 0.4); hinge.add(bo); } }
scene.add(vault); SETS.push(vault);
const rays = new THREE.Group(); { const m = new THREE.MeshBasicMaterial({ color: 0xffe08a, transparent: true, opacity: 0.35, side: THREE.DoubleSide, depthWrite: false }); for (let i = 0; i < 10; i++) { const r = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 2.6), m); r.geometry.translate(0, 1.3, 0); r.rotation.z = i / 10 * Math.PI * 2; rays.add(r); } }
scene.add(rays); SETS.push(rays);
// notas del perfume
const mint = new THREE.Group(); { const m = new THREE.MeshStandardMaterial({ color: 0x3ab05a }); [[0, 0.2, 0], [-0.22, 0, 0.6], [0.22, 0, -0.6]].forEach(([x, y, r]) => { const l = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 10), m); l.scale.set(0.6, 1, 0.18); l.position.set(x, y, 0); l.rotation.z = r; mint.add(l); }); }
const cinnamon = new THREE.Group(); { const m = new THREE.MeshStandardMaterial({ color: 0x8a4a22 }); [-0.1, 0.1].forEach((x, k) => { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.9, 12), m); c.position.x = x; c.rotation.z = 0.2 - k * 0.4; cinnamon.add(c); }); cinnamon.rotation.z = 1.2; }
const leather = new THREE.Mesh(new RoundedBoxGeometry(0.8, 0.5, 0.12, 3, 0.1), new THREE.MeshStandardMaterial({ color: 0x6a3a1a })); 
const notes = [ING.toronja(), mint, cinnamon, leather, ING.ambar()]; notes.forEach(n => { scene.add(n); SETS.push(n); });
// diamante (genérico)
const diamond = new THREE.Group(); { const m = new THREE.MeshStandardMaterial({ color: 0xff9ad0, roughness: 0.2, flatShading: true }); const top = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.85, 0.35, 8), m); top.position.y = 1.4; diamond.add(top);
  const bot = new THREE.Mesh(new THREE.ConeGeometry(0.85, 1.2, 8), m); bot.rotation.x = Math.PI; bot.position.y = 0.62; diamond.add(bot);
  const cap = new THREE.Mesh(new RoundedBoxGeometry(0.3, 0.25, 0.3, 3, 0.05), new THREE.MeshStandardMaterial({ color: 0xffc83a })); cap.position.y = 1.7; diamond.add(cap); }
scene.add(diamond); SETS.push(diamond);
const variants = [0x15151c, 0x3ad07a, 0xc0303a].map(c => { const g = ingot.clone(true); g.children[0].material = new THREE.MeshStandardMaterial({ color: c, metalness: 0.4, roughness: 0.35 }); scene.add(g); SETS.push(g); return g; });
const varTags = [['PRIVÉ'], ['LUCKY'], ['ELIXIR']].map(l => cartel(l, 1.2, 0.55));
// gráfica de ventas y letrero de la marca
const bars = [0.8, 1.3, 1.9, 2.8].map((h, i) => { const b = new THREE.Mesh(new THREE.BoxGeometry(0.55, 1, 0.55), new THREE.MeshStandardMaterial({ color: [0x7ad0ff, 0x9ae08a, 0xff9ad0, 0xffc83a][i] })); b.geometry.translate(0, 0.5, 0); b.userData.h = h; scene.add(b); SETS.push(b); return b; });
const signPaco = cartel(['PACO'], 1.3, 0.6), signRab = cartel(['RABANNE'], 2.0, 0.6);
const _resetM = resetWorld;
resetWorld = function () { _resetM(); pal.userData.body.remove(metalDress); ingot.scale.setScalar(1); ingot.rotation.set(0, 0, 0); vault.userData.hinge.rotation.set(0, 0, 0); signPaco.rotation.set(0, 0, 0); };
function walkPose(b, T, extra = {}) { pose(b, { hop: Math.abs(Math.sin(T * 6)) * 0.08, mood: 'smile', eye: 1.15, look: [0, 0.3], blink: blinkAt(T, 0.3), rotY: 0.15 * Math.sin(T * 6), armL: 0.5 + 0.3 * Math.sin(T * 6), armR: 0.5 - 0.3 * Math.sin(T * 6), ...extra }); }
const SCENES = {
  gancho(t, d, cue, T) {
    const tl = cue.lingote ?? d * 0.4, ta = cue.anio66 ?? d * 0.6, tv = cue.vestidos0 ?? d * 0.85;
    ped(DUO2);
    if (t < ta - 0.3) {
      ingot.visible = true; const k = easeOut(prog(t, 0.1, 0.6)); ingot.scale.setScalar(0.9); ingot.position.copy(DUO2).add(V(0, 0.18 + 4 * (1 - k), 0)); ingot.rotation.y = 0.5 * Math.sin(T * 0.8);
      if (t > tl) { sparks.visible = true; setSparks(T, DUO2.clone().add(V(0, 1.0, 0)), 1.2, 1.6, 0xffd23a, 1); }
      return { ...sh(DUO2, V(0, 2.0, lerp(5.2, 6.6, easeOut(prog(t, 0, ta)))), V(0, 1.1, 0)), pal: 'm1' };
    }
    y1966.visible = true; y1966.position.copy(DUO2).add(V(0, 2.0, -0.6)); y1966.scale.setScalar(Math.max(0.001, spring(prog(t, ta - 0.3, ta + 0.1))) * 0.5); y1966.rotation.y = 0.2 * Math.sin(T);
    pal.scale.setScalar(0.8); pal.position.copy(DUO2).add(V(0, 0.18, 0.2)); pal.userData.body.add(metalDress); metalDress.visible = t > tv - 0.2; metalDress.scale.setScalar(Math.max(0.001, spring(prog(t, tv - 0.2, tv + 0.2))));
    pose(pal, { hop: hopF(T, 2.5, 0.05), mood: 'smile', eye: 1.15, look: [0, 0.3], blink: blinkAt(T, 0.3), rotY: 0.2 * Math.sin(T), armL: 0.4, armR: 0.4 });
    return { ...sh(DUO2, V(0, 2.4, 8.0), V(0, 1.6, 0)), pal: 'm8' };
  },
  desfile(t, d, cue, T) {
    const td = cue.doce ?? d * 0.35, tp = cue.placas ?? d * 0.7, ta = cue.alambre ?? d * 0.88;
    lightAt(DUO2); ground.visible = true; runway.visible = true; runway.position.copy(DUO2);
    const z = lerp(-3.5, 1.2, easeOut(prog(t, 0, td + 0.5)));
    pal.scale.setScalar(0.75); pal.position.copy(DUO2).add(V(0, 0.25, z)); pal.userData.body.add(metalDress); metalDress.visible = true; metalDress.scale.setScalar(1);
    walkPose(pal, T, t > td + 0.5 ? { hop: 0.02, rotY: 0.6 * Math.sin(T * 1.5) } : {});
    cams.forEach((c, i) => { const s = i % 2 ? 1 : -1; c.visible = true; c.position.copy(DUO2).add(V(s * 1.55, 1.5, -2.5 + Math.floor(i / 2) * 1.6)); c.rotation.y = -s * 0.9;
      c.userData.flash.visible = Math.sin(T * 9 + i * 2.3) > 0.85; });
    if (t > td - 0.2 && t < tp - 0.2) { n12.visible = true; n12.position.copy(DUO2).add(V(0, 1.95, -1.6)); n12.scale.setScalar(Math.max(0.001, spring(prog(t, td - 0.2, td + 0.2))) * 0.5); n12.rotation.y = 0.2 * Math.sin(T * 2); }
    if (t > tp - 0.2) {
      if (t > ta - 0.2) { rings.visible = true; rings.position.copy(pal.position).add(V(0.45, 0.55, 0.8)); rings.scale.setScalar(Math.max(0.001, spring(prog(t, ta - 0.2, ta + 0.2))) * 0.7); }
      return { ...sh(DUO2, V(0.3, 1.9, z + 5.2), V(0, 1.0, z)), pal: 'm4' };
    }
    return { ...sh(DUO2, V(0, 2.6, 6.8), V(0, 1.2, -0.5)), pal: 'm7' };
  },
  chanel(t, d, cue, T) {
    const tc = cue.chanel ?? d * 0.15, tm = cue.metalurgico ?? d * 0.6;
    ped(DUO2);
    pal.scale.setScalar(0.65); pal.position.copy(DUO2).add(V(-0.72, 0.18, 0.2)); pal.userData.body.add(metalDress); metalDress.visible = true; metalDress.scale.setScalar(1);
    pose(pal, { hop: hopF(T, 2.5, 0.04), mood: t > tm ? 'o' : 'smile', mouthOpen: 0.8, eye: 1.2, look: [0.8, 0.2], blink: 1, rotY: 0.5, armR: 1.4 });
    critic.visible = true; critic.scale.setScalar(Math.max(0.001, spring(prog(t, tc - 0.4, tc))) * 0.7); critic.position.copy(DUO2).add(V(0.75, 0.18, 0.3));
    setBuddy(critic, { hop: 0, mood: t > tm ? 'o' : 'frown', mouthOpen: 0.6, eye: 0.7, look: [-0.8, 0.1], blink: 0.6, brow: 0.8, rotY: -0.5, armR: 1.9, armL: 0.2 });
    lorgnette.visible = true; lorgnette.position.copy(critic.position).add(V(-0.25, 1.15, 0.6)); lorgnette.scale.setScalar(critic.scale.x * 1.2); lorgnette.rotation.y = -0.4;
    return { ...sh(DUO2, V(0, 2.3, 8.0), V(0, 1.3, 0)), pal: 'm7' };
  },
  nombre(t, d, cue, T) {
    const ta = cue.anio ?? d * 0.2, tu = cue.unmillon ?? d * 0.4, tl = cue.lujo ?? d * 0.65, tdn = cue.dinero ?? d * 0.75, te = cue.exceso ?? d * 0.88;
    ped(DUO2);
    y2008.visible = t < tu - 0.2; y2008.position.copy(DUO2).add(V(0, 1.2, 0.3)); y2008.scale.setScalar(Math.max(0.001, spring(prog(t, ta - 0.4, ta))) * 0.6);
    if (t > tu - 0.4) { ingot.visible = true; const k = easeOut(prog(t, tu - 0.4, tu)); ingot.scale.setScalar(0.85); ingot.position.copy(DUO2).add(V(0, 0.18 + 4 * (1 - k), 0)); ingot.rotation.y = 0.3 * Math.sin(T); }
    if (t > tu) setBillRain(DUO2, t, tu);
    if (t > tl - 0.2) { coinPile.visible = true; coinPile.position.copy(DUO2).add(V(-0.9, 0.18, 1.0)); coinPile.scale.setScalar(Math.max(0.001, spring(prog(t, tl - 0.2, tl + 0.2))) * 0.6); }
    if (t > tdn - 0.2) { billsG.visible = true; billsG.position.copy(DUO2).add(V(0.9, 0.18, 1.0)); billsG.scale.setScalar(Math.max(0.001, spring(prog(t, tdn - 0.2, tdn + 0.2))) * 0.6); }
    if (t > te - 0.2) { crown2.visible = true; scene.add(crown2); crown2.position.copy(DUO2).add(V(0, 2.4, 0)); crown2.scale.setScalar(Math.max(0.001, spring(prog(t, te - 0.2, te + 0.2))) * 0.8); crown2.rotation.y = T; }
    return { ...sh(DUO2, V(0, 2.4, 8.0), V(0, 1.5, 0)), pal: 'm2' };
  },
  frasco(t, d, cue, T) {
    const tn = cue.noe ?? d * 0.2, tm = cue.metal ?? d * 0.5, tb = cue.boveda ?? d * 0.8;
    if (t < tm - 0.3) {
      ped(DUO2); board.visible = true; board.position.copy(DUO2).add(V(0.4, 0.18, -0.4)); board.scale.setScalar(0.85);
      you.scale.setScalar(0.6); you.position.copy(DUO2).add(V(-0.95, 0.18, 0.5)); you.userData.body.add(docHat); docHat.visible = false;
      pose(you, { hop: hopF(T, 2, 0.03), mood: 'smile', eye: 1.1, look: [0.8, 0.4], blink: blinkAt(T, 0.3), rotY: 0.6, armR: 1.6 + 0.3 * Math.sin(T * 8) });
      return { ...sh(DUO2, V(0, 2.4, 7.8), V(0, 1.6, 0)), pal: 'm3' };
    }
    lightAt(DUO2); ground.visible = true;
    vault.visible = true; vault.position.copy(DUO2).add(V(0, 0, -1.0)); vault.scale.setScalar(0.62);
    vault.userData.wheel.rotation.z = -T * 2 * (1 - prog(t, tb - 0.6, tb - 0.3));
    vault.userData.hinge.rotation.y = -1.9 * easeIO(prog(t, tb - 0.5, tb + 0.3));
    ingot.visible = true; ingot.scale.setScalar(0.45); ingot.position.copy(DUO2).add(V(0, 0.75, -0.9)); ingot.rotation.y = 0.3 * Math.sin(T);
    if (t > tb - 0.1) { rays.visible = true; rays.position.copy(DUO2).add(V(0, 1.15, -1.05)); rays.rotation.z = T * 0.4; rays.scale.setScalar(Math.max(0.001, easeOut(prog(t, tb - 0.1, tb + 0.4))) * 0.7);
      sparks.visible = true; setSparks(T, DUO2.clone().add(V(0, 1.0, -0.6)), 0.8, 1.2, 0xffd23a, 1); }
    return { ...sh(DUO2, V(0, 1.8, lerp(6.6, 5.4, easeIO(prog(t, tb, d)))), V(0, 1.2, -0.8)), pal: 'm9' };
  },
  olor(t, d, cue, T) {
    const tt = cue.toronja ?? d * 0.15, tms = [tt, tt + 0.4, cue.canela ?? d * 0.3, cue.cuero ?? d * 0.38, cue.ambar ?? d * 0.45], tl = cue.lejos ?? d * 0.62, ta = cue.amas ?? d * 0.78, ts = cue.soportas ?? d * 0.9;
    ped(DUO2);
    ingot.visible = true; ingot.scale.setScalar(0.65); ingot.position.copy(DUO2).add(V(t > tl - 0.5 ? -0.7 : 0, 0.18, 0)); ingot.rotation.y = 0.3 * Math.sin(T);
    if (t < tl - 0.5) notes.forEach((n, i) => { const p = spring(prog(t, tms[i] - 0.2, tms[i] + 0.2)); n.visible = p > 0.01; const a = T * 0.8 + i / 5 * Math.PI * 2;
      n.position.copy(DUO2).add(V(Math.cos(a) * 1.25, 1.2 + 0.35 * Math.sin(a * 2), Math.sin(a) * 0.9)); n.scale.setScalar(Math.max(0.001, p) * 0.75); });
    else {
      setMist(t, ingot.position.clone().add(V(0.3, 1.6, 0)), V(1, 0.15, 0.3).normalize(), tl - 0.5, [1, 0.85, 0.4]);
      you.scale.setScalar(0.5); you.position.copy(DUO2).add(V(1.15, 0.18, 0.4)); you.userData.nose.visible = true;
      const hate = t > ts - 0.2;
      pose(you, { hop: hopF(T, 3, 0.05), mood: hate ? 'o' : 'smile', mouthOpen: 0.7, eye: hate ? 0.6 : 1.2, look: [-0.8, 0.2], blink: hate ? 0.5 : 0.35, brow: hate ? 0.8 : 0, rotY: -0.6 });
      if (t > ta - 0.2 && !hate) setHearts(t, you.position.clone().add(V(0, 1.4, 0.2)), ta - 0.2, 3, 0.4);
      if (hate) setStink(t, you.position.clone().add(V(-0.3, 1.2, 0)), ts - 0.2, 0.4);
    }
    return { ...sh(DUO2, V(0, 2.4, 7.8), V(0, 1.4, 0)), pal: 'm9' };
  },
  lady(t, d, cue, T) {
    const tp = cue.pareja ?? d * 0.15, tl = cue.lady ?? d * 0.35, tv = cue.versiones ?? d * 0.7, te = cue.elixir ?? d * 0.9;
    ped(DUO2);
    if (t < tv - 0.3) {
      ingot.visible = true; ingot.scale.setScalar(0.6); ingot.position.copy(DUO2).add(V(-0.7, 0.18, 0)); ingot.rotation.y = 0.4;
      diamond.visible = t > tl - 0.4; diamond.position.copy(DUO2).add(V(0.75, 0.18 + 3 * (1 - easeOut(prog(t, tl - 0.4, tl))), 0)); diamond.scale.setScalar(0.7); diamond.rotation.y = T * 0.6;
      if (t > tl) { setHearts(t, DUO2.clone().add(V(0, 1.8, 0.3)), tl, 4, 0.5); sparks.visible = true; setSparks(T, diamond.position.clone().add(V(0, 0.9, 0)), 0.6, 1.0, 0xff9ad0, 1); }
      return { ...sh(DUO2, V(0, 2.2, 7.2), V(0, 1.2, 0)), pal: 'm6' };
    }
    ingot.visible = true; ingot.scale.setScalar(0.42); ingot.position.copy(DUO2).add(V(0, 0.18, -0.6));
    variants.forEach((g, i) => { const tm = tv + i * ((te - tv) / 2); const p = spring(prog(t, tm - 0.3, tm + 0.1)); g.visible = p > 0.01; g.scale.setScalar(Math.max(0.001, p) * 0.42);
      g.position.copy(DUO2).add(V(-1.0 + i * 1.0, 0.18, 0.7)); g.rotation.y = 0.2 * Math.sin(T + i);
      varTags[i].visible = p > 0.01; varTags[i].scale.setScalar(Math.max(0.001, p) * 0.55); varTags[i].position.copy(DUO2).add(V(-1.0 + i * 1.0, 1.45, 1.1)); });
    return { ...sh(DUO2, V(0, 2.4, 7.6), V(0, 1.1, 0)), pal: 'm5' };
  },
  exito(t, d, cue, T) {
    const tf = cue.funciono ?? d * 0.1, tv = cue.vendidos ?? d * 0.35, ty = cue.anio23 ?? d * 0.55, tq = cue.quito ?? d * 0.7, tr = cue.rabanne ?? d * 0.88;
    ped(DUO2);
    if (t < ty - 0.3) {
      bars.forEach((b, i) => { const k = easeOut(prog(t, tf + i * 0.2, tf + 0.8 + i * 0.2)); b.visible = true; b.scale.set(1, Math.max(0.01, b.userData.h * k), 1); b.position.copy(DUO2).add(V(-1.05 + i * 0.7, 0.18, 0)); });
      const top = bars[3]; ingot.visible = t > tv - 0.3; ingot.scale.setScalar(0.3); ingot.position.copy(top.position).add(V(0, top.scale.y + 0.05, 0)); ingot.rotation.y = T;
      if (t > tv) setConfetti(DUO2, t, tv);
      return { ...sh(DUO2, V(0, 2.3, 7.4), V(0, 1.5, 0)), pal: 'm5' };
    }
    y2023.visible = true; y2023.position.copy(DUO2).add(V(0, 0.4, 1.4)); y2023.scale.setScalar(Math.max(0.001, spring(prog(t, ty - 0.3, ty + 0.1))) * 0.5);
    signRab.visible = true; signRab.position.copy(DUO2).add(V(0.3, 2.0, 0.2)); signRab.scale.setScalar(0.85);
    signPaco.visible = true; const k = prog(t, tq - 0.1, tq + 0.6);
    signPaco.position.copy(DUO2).add(V(-0.85 - 0.4 * k, 2.0 - 3.5 * k * k, 0.25)); signPaco.rotation.z = 1.2 * k; signPaco.scale.setScalar(0.85);
    if (t > tr - 0.2) { const x = signRab.position.x - DUO2.x; signRab.position.x = DUO2.x + lerp(0.3, 0, easeIO(prog(t, tr - 0.2, tr + 0.3))); sparks.visible = true; setSparks(T, DUO2.clone().add(V(0, 2.0, 0.2)), 1.2, 0.6, 0xffd23a, 1); }
    return { ...sh(DUO2, V(0, 2.2, 7.4), V(0, 1.5, 0)), pal: 'm1' };
  },
  final(t, d, cue, T) {
    const tm = cue.metal2 ?? d * 0.2, tf = cue.frasco2 ?? d * 0.55, to = cue.olor2 ?? d * 0.8;
    if (t < tf - 0.1) {
      ped(DUO2);
      ingot.visible = true; ingot.scale.setScalar(0.65); ingot.position.copy(DUO2).add(V(-0.7, 0.18, 0)); ingot.rotation.y = 0.3 * Math.sin(T);
      pal.scale.setScalar(0.6); pal.position.copy(DUO2).add(V(0.8, 0.18, 0.3)); pal.userData.body.add(metalDress); metalDress.visible = t > tm - 0.2; metalDress.scale.setScalar(Math.max(0.001, spring(prog(t, tm - 0.2, tm + 0.2))));
      pose(pal, { hop: hopF(T, 2.5, 0.05), mood: 'smile', eye: 1.15, look: [-0.6, 0.3], blink: blinkAt(T, 0.3), rotY: -0.4, armL: 0.4, armR: 1.6 });
      if (t > tm) { sparks.visible = true; setSparks(T, DUO2.clone().add(V(0, 1.2, 0.2)), 1.3, 1.4, 0xffd23a, 1); }
      return { ...sh(DUO2, V(0, 2.2, 7.4), V(0, 1.3, 0)), pal: 'm1' };
    }
    ped(DUO2); ped(DUO3, true);
    ingot.visible = true; ingot.scale.setScalar(0.85); ingot.position.copy(DUO2).add(V(0, 0.18, 0)); ingot.rotation.y = T * 0.6;
    sparks.visible = true; setSparks(T, DUO2.clone().add(V(0, 1.0, 0)), 1.0, 1.3, 0xffd23a, 1);
    you.scale.setScalar(0.75); you.position.copy(DUO3).add(V(0, 0.18, 0.2)); you.userData.nose.visible = true;
    pose(you, { hop: hopF(T, 3, 0.05), mood: 'smile', eye: 0.6, look: [0, 0.4], blink: 0.4, rotY: 0.2 * Math.sin(T * 2) });
    setMist(t, DUO3.clone().add(V(-1.0, 1.6, 0.4)), V(1, 0, 0), tf, [1, 0.85, 0.4]);
    if (t > to) { qMark.visible = true; qMark.scale.setScalar(Math.max(0.001, spring(prog(t, to, to + 0.4)) * 0.45)); qMark.position.copy(DUO3).add(V(1.0, 2.0, 0.3)); qMark.rotation.y = 0.3 * Math.sin(T * 3); }
    return { split: true, top: { ...half(DUO2, 6.8, 1.0), pal: 'm1' }, bot: { ...half(DUO3, 6.8, 1.0), pal: 'm10' }, pos: DUO2.clone().add(V(0, 2, 7)), tgt: DUO2.clone(), fov: 30 };
  },
};

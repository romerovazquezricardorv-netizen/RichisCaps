// ================================================================== PERFUMES QUE HUELEN A COSAS RARAS
Object.assign(PALG, { r1: [0xffd23a, 0xff8a3a], tienda: [0x7ad0ff, 0x3a8ae0], lib: [0x9ae08a, 0x3aa05a], miedo: [0x5a4a7a, 0x2a1a4a], mem: [0xff9ad0, 0xe0508a], r6: [0xc89aff, 0x7a4ad8] });
const clay = new THREE.Group(); { [[0xff3a5a, -0.35, 0.3, 0], [0xffd23a, 0.3, 0.28, 0.1], [0x3aa0ff, 0, 0.62, -0.05], [0x3ad07a, -0.05, 0.25, 0.4]].forEach(([c, x, y, z]) => { const m = new THREE.Mesh(new THREE.SphereGeometry(0.42, 20, 14), new THREE.MeshStandardMaterial({ color: c })); m.scale.set(1, 0.7, 1); m.position.set(x, y, z); clay.add(m); }); }
scene.add(clay);
const shelf = new THREE.Group(); const shelfBottles = [];
{ const wood = new THREE.MeshStandardMaterial({ color: 0xb8864a }); [0, 1.6].forEach(y => { const b = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.12, 1.0), wood); b.position.y = y; shelf.add(b); });
  const labs = ['LLUVIA', 'LIBRO', 'TIERRA', 'PASTO', 'GALLETA', 'NIEVE', 'PINTURA', 'CAFÉ'], cols = [0x7ad0ff, 0xd8c8a0, 0x8a5a34, 0x5ad06a, 0xe8b06a, 0xffffff, 0xff7aa0, 0x6a3a1a];
  labs.forEach((l, i) => { const b = makeBottle(cols[i], l); b.scale.setScalar(0.32); b.position.set(-1.95 + (i % 4) * 1.3, i < 4 ? 0.06 : 1.66, 0); shelf.add(b); shelfBottles.push(b); }); }
scene.add(shelf);
const fifty = text3d('50', 1.1, new THREE.MeshStandardMaterial({ color: 0xffc83a }), 0.3); scene.add(fifty);
const book = new THREE.Group(); { const cov = new THREE.Mesh(new RoundedBoxGeometry(1.6, 0.25, 2.1, 3, 0.04), new THREE.MeshStandardMaterial({ color: 0xc8322a })); book.add(cov);
  const pages = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.22, 2.0), new THREE.MeshStandardMaterial({ color: 0xfff6e0 })); pages.position.set(0.04, 0.02, 0); book.add(pages); }
scene.add(book);
const cloud = new THREE.Group(); { [[0, 0, 0, 0.7], [-0.7, -0.15, 0, 0.5], [0.7, -0.12, 0, 0.55], [0.3, 0.35, 0, 0.5]].forEach(([x, y, z, r]) => { const m = new THREE.Mesh(new THREE.SphereGeometry(r, 18, 12), new THREE.MeshStandardMaterial({ color: 0xe8eef6 })); m.position.set(x, y, z); cloud.add(m); }); }
scene.add(cloud);
const dirt = new THREE.Mesh(new THREE.SphereGeometry(1.1, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0x6a4024 })); dirt.scale.y = 0.45; scene.add(dirt);
const worm = new THREE.Group(); const wormSeg = [];
{ const m = new THREE.MeshStandardMaterial({ color: 0xff8aa0 }); for (let i = 0; i < 7; i++) { const s = new THREE.Mesh(new THREE.SphereGeometry(0.22 - i * 0.015, 14, 10), m); worm.add(s); wormSeg.push(s); }
  [-1, 1].forEach(s => { const e = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 8), WHITE); e.position.set(0.12, 0.12, s * 0.09); wormSeg[0].add(e); const p = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 6), BLACK); p.position.set(0.17, 0.12, s * 0.09); wormSeg[0].add(p); }); }
scene.add(worm);
const can = new THREE.Group(); { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1.1, 28), new THREE.MeshStandardMaterial({ color: 0xc8ced6 })); c.position.y = 0.55; can.add(c);
  const lab = new THREE.Mesh(new THREE.CylinderGeometry(0.505, 0.505, 0.6, 28, 1, true, -1, 2), new THREE.MeshStandardMaterial({ map: labelTex('AGUARRÁS', '#ffd23a', '#111111') })); lab.position.y = 0.55; can.add(lab);
  const h = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.03, 8, 24, Math.PI), new THREE.MeshStandardMaterial({ color: 0x888888 })); h.position.y = 1.1; can.add(h); }
scene.add(can);
const ghost = new THREE.Group(); { const m = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.92 }); const b = new THREE.Mesh(new THREE.CapsuleGeometry(0.6, 0.8, 10, 24), m); b.position.y = 1.0; ghost.add(b);
  for (let i = 0; i < 5; i++) { const t = new THREE.Mesh(new THREE.SphereGeometry(0.17, 10, 8), m); t.position.set(-0.45 + i * 0.22, 0.35, 0); ghost.add(t); }
  [-1, 1].forEach(s => { const e = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 8), BLACK); e.position.set(s * 0.2, 1.3, 0.55); e.scale.y = 1.4; ghost.add(e); });
  const mo = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 8), BLACK); mo.position.set(0, 1.0, 0.58); mo.scale.y = 1.3; ghost.add(mo); }
scene.add(ghost);
const bubble = new THREE.Group(); { const m = new THREE.MeshStandardMaterial({ color: 0xffffff }); const big = new THREE.Mesh(new THREE.SphereGeometry(1.4, 28, 20), m); big.scale.z = 0.25; bubble.add(big);
  [[-1.2, -1.5, 0.3], [-1.6, -2.1, 0.2]].forEach(([x, y, r]) => { const s = new THREE.Mesh(new THREE.SphereGeometry(r, 14, 10), m); s.position.set(x, y, 0); bubble.add(s); }); }
scene.add(bubble);
SETS.push(clay, shelf, fifty, book, cloud, dirt, worm, can, ghost, bubble);
Object.assign(PALG, { burger: [0xffb03a, 0xe0602a], pizza: [0xff6a6a, 0xc0303a], petricor: [0x7ad0ff, 0x3a6aa0], proust: [0xffe0b0, 0xd8a06a] });
const burger = new THREE.Group(); { const L = [[0xe8a050, 0.0, 0.85, 0.22], [0x5a3a1a, 0.22, 0.9, 0.18], [0xffd23a, 0.38, 0.92, 0.05], [0x5ad06a, 0.45, 0.95, 0.06], [0xe84a3a, 0.52, 0.8, 0.06], [0xe8a050, 0.62, 0.85, 0.3]];
  L.forEach(([c, y, r, h], i) => { const m = new THREE.Mesh(i === 5 ? new THREE.SphereGeometry(r, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2) : new THREE.CylinderGeometry(r, r, h, 28), new THREE.MeshStandardMaterial({ color: c })); m.position.y = y + (i === 5 ? 0 : h / 2); if (i === 5) m.scale.y = 0.55; burger.add(m); }); }
scene.add(burger); SETS.push(burger);
const flames = Array.from({ length: 4 }, (_, i) => { const m = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.6, 10), new THREE.MeshStandardMaterial({ color: i % 2 ? 0xffd23a : 0xff7a2a })); scene.add(m); SETS.push(m); return m; });
const flameB = makeBottle(0xd87a3a, 'FLAME'); scene.add(flameB); SETS.push(flameB);
const day1 = cartel(['1 DÍA']);
const pizzaS = new THREE.Group(); { const crust = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.3, 0.14, 32, 1, false, 0, Math.PI / 3), new THREE.MeshStandardMaterial({ color: 0xffd27a })); pizzaS.add(crust);
  const sauce = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.15, 0.16, 32, 1, false, 0.05, Math.PI / 3 - 0.1), new THREE.MeshStandardMaterial({ color: 0xff8a3a })); pizzaS.add(sauce);
  for (let i = 0; i < 4; i++) { const p = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.05, 16), new THREE.MeshStandardMaterial({ color: 0xc8322a })); const a = 0.25 + (i % 2) * 0.5, r = 0.45 + i * 0.17; p.position.set(Math.sin(a) * r, 0.1, Math.cos(a) * r); pizzaS.add(p); } }
scene.add(pizzaS); SETS.push(pizzaS);
const minis = Array.from({ length: 10 }, () => { const b = makeBottle(0xffd27a, 'PIZZA'); scene.add(b); SETS.push(b); return b; });
const madeleine = new THREE.Group(); { const sh2 = new THREE.Mesh(new THREE.SphereGeometry(0.6, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0xe8b060 })); sh2.scale.set(1, 0.4, 1.3); madeleine.add(sh2);
  for (let i = 0; i < 7; i++) { const r = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.05, 1.3), new THREE.MeshStandardMaterial({ color: 0xc8904a })); r.position.set(-0.45 + i * 0.15, 0.2, 0); r.rotation.y = (i - 3) * 0.12; madeleine.add(r); } }
scene.add(madeleine); SETS.push(madeleine);
const teaCup = new THREE.Group(); { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.35, 0.55, 24, 1, true), new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide })); c.position.y = 0.3; teaCup.add(c);
  const tea = new THREE.Mesh(new THREE.CylinderGeometry(0.47, 0.47, 0.03, 24), new THREE.MeshStandardMaterial({ color: 0xa8641a })); tea.position.y = 0.5; teaCup.add(tea);
  const h = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.04, 8, 16), c.material); h.position.set(0.55, 0.3, 0); teaCup.add(h); const pl = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 0.04, 28), c.material); teaCup.add(pl); }
scene.add(teaCup); SETS.push(teaCup);
const SCENES = {
  gancho(t, d, cue, T) {
    const tp = cue.plastilina ?? d * 0.45, te = cue.existe ?? d * 0.8;
    ped(DUO2);
    clay.visible = true; clay.position.copy(DUO2).add(V(-0.5, 0.18, 0.2)); clay.scale.setScalar(Math.max(0.001, spring(prog(t, tp - 0.4, tp))) * 1.1); clay.rotation.y = 0.3 * Math.sin(T);
    you.scale.setScalar(0.75); you.position.copy(DUO2).add(V(1.2, 0.18, 0.6)); you.userData.nose.visible = t > te - 0.3;
    pose(you, { hop: hopF(T, 3, 0.05), mood: t > te ? 'smile' : 'o', mouthOpen: 1.2, eye: 1.3, look: [-0.8, -0.3], blink: t > te ? 0.35 : 1, brow: t > te ? 0 : 0.8, rotY: -0.6 });
    if (t > te) setHearts(t, you.position.clone().add(V(-0.4, 2.0, 0.2)), te, 3, 0.5);
    return { ...sh(DUO2, V(0, 2.2, lerp(6.0, 7.4, easeOut(prog(t, 0, 1.0)))), V(0.2, 1.2, 0)), pal: 'r1' };
  },
  demeter(t, d, cue, T) {
    const tc = cue.cotidianas ?? d * 0.4, tp = cue.playdoh ?? d * 0.7, tf = cue.cincuenta ?? d * 0.9;
    lightAt(DUO2); ground.visible = true;
    shelf.visible = true; shelf.position.copy(DUO2).add(V(0, 0.5, -0.6));
    shelfBottles.forEach((b, i) => { b.scale.setScalar(0.32 * Math.max(0.001, spring(prog(t, 0.2 + i * 0.12, 0.6 + i * 0.12)))); b.rotation.y = 0.15 * Math.sin(T + i); });
    if (t > tp - 0.2) { clay.visible = true; clay.position.copy(DUO2).add(V(0, 0, 1.6)); clay.scale.setScalar(Math.max(0.001, spring(prog(t, tp - 0.2, tp + 0.2))) * 0.8); clay.rotation.y = T; }
    if (t > tf - 0.2) { fifty.visible = true; fifty.position.copy(DUO2).add(V(0, 3.9, 0.4)); fifty.scale.setScalar(Math.max(0.001, spring(prog(t, tf - 0.2, tf + 0.2)))); setConfetti(DUO2, t, tf - 0.2); }
    return { ...sh(DUO2, V(0, 2.6, 12.2), V(0, 1.6, 0)), pal: 'tienda' };
  },
  libro(t, d, cue, T) {
    const tb = cue.libro ?? d * 0.3, tl = cue.lluvia ?? d * 0.55, tt = cue.tierra ?? d * 0.85;
    ped(DUO2);
    const p1 = spring(prog(t, tb - 0.3, tb + 0.1)), p2 = spring(prog(t, tl - 0.3, tl + 0.1)), p3 = spring(prog(t, tt - 0.3, tt + 0.1));
    book.visible = p1 > 0.01; book.position.copy(DUO2).add(V(-1.0, 0.45, 0.5)); book.scale.setScalar(Math.max(0.001, p1) * 0.7); book.rotation.set(0.3, 0.4, 0.1);
    cloud.visible = p2 > 0.01; cloud.position.copy(DUO2).add(V(0, 3.2, 0)); cloud.scale.setScalar(Math.max(0.001, p2) * 0.9);
    if (t > tl) setDrops(DUO2.clone().add(V(0, 2.8, 0)), T, 18, 0.7, 2.4);
    dirt.visible = p3 > 0.01; dirt.position.copy(DUO2).add(V(1.0, 0.18, 0.5)); dirt.scale.set(Math.max(0.001, p3) * 0.7, Math.max(0.001, p3) * 0.32, Math.max(0.001, p3) * 0.7);
    return { ...sh(DUO2, V(0, 2.7, 9.8), V(0, 1.7, 0)), pal: 'lib' };
  },
  raros(t, d, cue, T) {
    const tl = cue.lombriz ?? d * 0.25, ta = cue.aguarras ?? d * 0.4, tf = cue.funeraria ?? d * 0.8;
    ped(DUO2);
    const pw = spring(prog(t, tl - 0.2, tl + 0.2));
    worm.visible = pw > 0.01; worm.position.copy(DUO2).add(V(-0.2, 0.4, 0.7)); worm.scale.setScalar(Math.max(0.001, pw) * 1.4);
    wormSeg.forEach((s, i) => s.position.set(-i * 0.28, 0.12 * Math.sin(T * 6 - i * 0.9) + 0.1, 0.1 * Math.sin(T * 4 - i)));
    const pc = spring(prog(t, ta - 0.2, ta + 0.2));
    can.visible = pc > 0.01; can.position.copy(DUO2).add(V(0.85, 0.18, -0.2)); can.scale.setScalar(Math.max(0.001, pc) * 0.9); can.rotation.y = -0.3;
    const pg = spring(prog(t, tf - 0.3, tf + 0.2));
    ghost.visible = pg > 0.01; ghost.position.copy(DUO2).add(V(0, 1.6 + 0.15 * Math.sin(T * 3), 0.8)); ghost.scale.setScalar(Math.max(0.001, pg) * 0.9); ghost.rotation.z = 0.1 * Math.sin(T * 2);
    const scary = t > tf - 0.2;
    return { ...sh(DUO2, V(0, 2.5, 8.6), V(0, 1.6, 0)), pal: scary ? 'miedo' : 'r1' };
  },
  porque(t, d, cue, T) {
    const tr = cue.recuerdos ?? d * 0.5, ti = cue.infancia ?? d * 0.7, tg = cue.regresas ?? d * 0.88;
    ped(DUO2);
    you.scale.setScalar(0.85); you.position.copy(DUO2).add(V(-0.9, 0.18, 0.4)); you.userData.nose.visible = true; youBottle.visible = true;
    pose(you, { hop: hopF(T, 3, 0.05), mood: 'smile', eye: 1.1, look: [0.6, 0.6], blink: t > tr ? 0.3 : blinkAt(T, 0.3), rotY: 0.3, armR: 1.3 });
    const pb = spring(prog(t, tr - 0.2, tr + 0.3));
    bubble.visible = pb > 0.01; bubble.position.copy(DUO2).add(V(0.55, 3.3, 0.2)); bubble.scale.setScalar(Math.max(0.001, pb));
    if (t > ti - 0.2) { pal.scale.setScalar(0.35); pal.position.copy(bubble.position).add(V(-0.2, -0.75, 0.45)); pose(pal, { hop: hopF(T, 5, 0.1), mood: 'smile', eye: 1.2, look: [0.6, 0], blink: 1, rotY: 0.3, armR: 2 });
      clay.visible = true; clay.position.copy(bubble.position).add(V(0.5, -0.7, 0.45)); clay.scale.setScalar(0.3); }
    if (t > tg) { setHearts(t, you.position.clone().add(V(0, 2.2, 0.3)), tg, 4, 0.6); setWaves(T, you.position.clone().add(V(0, 1.4, 0)), 1.2, 2.0, 0xff9ad0, 0.7); }
    return { ...sh(DUO2, V(0, 2.7, 10.0), V(0, 2.2, 0)), pal: 'mem' };
  },
  final(t, d, cue, T) {
    const to = cue.oler ?? d * 0.5;
    lightAt(DUO2); ground.visible = true;
    shelf.visible = true; shelf.position.copy(DUO2).add(V(0, 0.5, -0.6)); shelfBottles.forEach((b, i) => { b.scale.setScalar(0.32); b.rotation.y = 0.15 * Math.sin(T + i); });
    you.scale.setScalar(0.75); you.position.copy(DUO2).add(V(0, 0, 1.6));
    pose(you, { hop: hopF(T, 3.5, 0.07), mood: 'smile', eye: 1.2, look: [0, 0.8], blink: 1, rotY: 0, armR: 2.2, armL: 2.2 });
    qMark.visible = t > to - 0.4; qMark.scale.setScalar(Math.max(0.001, spring(prog(t, to - 0.4, to)) * 0.7)); qMark.position.copy(you.position).add(V(0.7, 2.2, 0.2)); qMark.rotation.y = 0.3 * Math.sin(T * 3);
    return { ...sh(DUO2, V(0, 2.5, 11.4), V(0, 1.7, 0)), pal: 'r6' };
  },
  burger(t, d, cue, T) {
    const tp = cue.parrilla ?? d * 0.45, tj = cue.japon ?? d * 0.7, td = cue.dia ?? d * 0.9;
    ped(DUO2);
    if (t < tj - 0.2) {
      burger.visible = true; burger.position.copy(DUO2).add(V(-0.35, 0.18, 0.2)); burger.scale.setScalar(Math.max(0.001, spring(prog(t, 0.1, 0.5))) * 0.85); burger.rotation.y = T * 0.5;
      flameB.visible = t > tp - 0.6; flameB.scale.setScalar(0.45 * Math.max(0.001, spring(prog(t, tp - 0.6, tp - 0.2)))); flameB.position.copy(DUO2).add(V(1.0, 0.18, -0.3)); flameB.rotation.y = -0.3;
      if (t > tp) flames.forEach((f, i) => { f.visible = true; f.position.copy(burger.position).add(V(-0.5 + i * 0.33, -0.05 + 0.08 * Math.sin(T * 12 + i), 0.75)); f.scale.set(1, 0.8 + 0.3 * Math.sin(T * 10 + i * 2), 1); });
      return { ...sh(DUO2, V(0, 2.3, 7.4), V(0, 1.2, 0)), pal: 'burger' };
    }
    flameB.visible = true; flameB.scale.setScalar(0.6); flameB.position.copy(DUO2).add(V(-0.4, 0.18, 0)); flameB.rotation.y = 0.3 * Math.sin(T);
    day1.visible = t > td - 0.3; day1.position.copy(DUO2).add(V(0.9, 2.3, 0.5)); day1.scale.setScalar(Math.max(0.001, spring(prog(t, td - 0.3, td + 0.1)))); day1.rotation.z = -0.1;
    return { ...sh(DUO2, V(0, 2.3, 7.4), V(0, 1.4, 0)), pal: 'burger' };
  },
  pizza(t, d, cue, T) {
    const tc = cue.cien ?? d * 0.4, tp = cue.pizza ?? d * 0.8;
    ped(DUO2);
    pizzaS.visible = true; pizzaS.position.copy(DUO2).add(V(0, 1.7 + 0.1 * Math.sin(T * 2), 0)); pizzaS.rotation.set(0.9, T * 0.4, 0); pizzaS.scale.setScalar(Math.max(0.001, spring(prog(t, 0.1, 0.5))) * 0.9);
    minis.forEach((b, i) => { const p = spring(prog(t, tc - 0.3 + i * 0.05, tc + i * 0.05)); b.visible = p > 0.01; b.scale.setScalar(0.18 * Math.max(0.001, p)); b.position.copy(DUO2).add(V(-1.0 + (i % 5) * 0.5, 0.18, 0.9 + Math.floor(i / 5) * 0.6)); });
    if (t > tp) { sparks.visible = true; setSparks(T, pizzaS.position, 1.2, 1.2, 0xffd27a, 1); }
    return { ...sh(DUO2, V(0, 2.6, 7.8), V(0, 1.4, 0)), pal: 'pizza' };
  },
  petricor(t, d, cue, T) {
    const tp = cue.petricor ?? d * 0.4, td = cue.diminutas ?? d * 0.8;
    ped(DUO2);
    cloud.visible = true; cloud.position.copy(DUO2).add(V(-0.3, 3.2, 0)); cloud.scale.setScalar(0.85); setDrops(DUO2.clone().add(V(-0.3, 2.9, 0)), T, 18, 0.7, 2.6);
    dirt.visible = true; dirt.position.copy(DUO2).add(V(-0.3, 0.18, 0.3)); dirt.scale.set(0.8, 0.35, 0.8);
    you.scale.setScalar(0.7); you.position.copy(DUO2).add(V(1.2, 0.18, 0.6)); you.userData.nose.visible = true;
    pose(you, { hop: hopF(T, 3, 0.04), mood: 'smile', eye: 1.2, look: [-0.8, -0.2], blink: t > tp ? 0.35 : 1, rotY: -0.6 });
    if (t > td - 0.2) { sparks.visible = true; setSparks(T, dirt.position.clone().add(V(0.6, 0.6, 0)), 0.6, 1.0, 0xa8784a, 1); }
    return { ...sh(DUO2, V(0, 2.6, 8.2), V(0, 1.6, 0)), pal: 'petricor' };
  },
  proust(t, d, cue, T) {
    const tm = cue.magdalena ?? d * 0.3, tg = cue.golpe ?? d * 0.55, tr = cue.recuerdos2 ?? d * 0.9;
    ped(DUO2);
    teaCup.visible = true; teaCup.position.copy(DUO2).add(V(-0.8, 0.2, 0.4)); teaCup.scale.setScalar(0.9);
    madeleine.visible = t > tm - 0.3; madeleine.position.copy(DUO2).add(V(0.2, 0.4 + (t < tg ? 0.3 * Math.max(0, Math.sin((t - tm) * 3)) : 0), 0.6)); madeleine.scale.setScalar(Math.max(0.001, spring(prog(t, tm - 0.3, tm + 0.1))) * 0.8); madeleine.rotation.y = 0.5;
    you.scale.setScalar(0.75); you.position.copy(DUO2).add(V(1.2, 0.18, 0.4)); you.userData.nose.visible = true;
    pose(you, { hop: 0, mood: 'smile', eye: 1.1, look: [-0.8, -0.3], blink: t > tg ? 0.2 : 1, rotY: -0.6 });
    if (t > tg - 0.2) { const pb = spring(prog(t, tg - 0.2, tg + 0.3)); bubble.visible = true; bubble.position.copy(DUO2).add(V(0.4, 3.2, 0.2)); bubble.scale.setScalar(Math.max(0.001, pb) * 0.9);
      pal.scale.setScalar(0.32); pal.position.copy(bubble.position).add(V(0, -0.75, 0.42)); pose(pal, { hop: hopF(T, 5, 0.1), mood: 'smile', eye: 1.2, look: [0, 0], blink: 1, rotY: 0, armR: 2, armL: 2 }); }
    if (t > tr) setHearts(t, you.position.clone().add(V(0, 2.1, 0.3)), tr, 3, 0.4);
    return { ...sh(DUO2, V(0, 2.6, 8.4), V(0, 1.9, 0)), pal: 'proust' };
  },
};


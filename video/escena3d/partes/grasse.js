// ================================================================== GRASSE: LA CAPITAL DEL PERFUME
Object.assign(PALG, { g1: [0xb8d8a0, 0x7a9a5a], pueblo: [0x7ad0ff, 0x3a8ae0], idea: [0xffd23a, 0xff8a3a], corte: [0xe8c890, 0xa8784a], cambio: [0xff9ad0, 0xe0508a], g6: [0xc89aff, 0x7a4ad8] });
const TOWN = V(-60, 0, 410);
const town = new THREE.Group();
{ const hill = new THREE.Mesh(new THREE.SphereGeometry(9, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0x8ac06a })); hill.scale.y = 0.08; hill.position.set(0, -0.1, -6); town.add(hill);
  const walls = [0xf2d8a8, 0xf6e6c8, 0xe8c08a, 0xf0d0b0], roof = new THREE.MeshStandardMaterial({ color: 0xd85a3a });
  for (let i = 0; i < 9; i++) { const h = new THREE.Group(); const w = 1.1 + (i % 3) * 0.3, hh = 1.2 + (i % 2) * 0.5;
    const b = new THREE.Mesh(new THREE.BoxGeometry(w, hh, 1.0), new THREE.MeshStandardMaterial({ color: walls[i % 4] })); b.position.y = hh / 2; h.add(b);
    const r = new THREE.Mesh(new THREE.ConeGeometry(w * 0.78, 0.6, 4), roof); r.position.y = hh + 0.3; r.rotation.y = Math.PI / 4; h.add(r);
    const win = new THREE.Mesh(new THREE.PlaneGeometry(0.25, 0.3), new THREE.MeshBasicMaterial({ color: 0x3a5a8a })); win.position.set(0, hh * 0.6, 0.51); h.add(win);
    const row = Math.floor(i / 3); h.position.set((i % 3 - 1) * 2.2 + (row % 2) * 0.6, 0.15 + row * 0.25, -2.0 - row * 1.8); town.add(h); }
  // tinas de curtido
  for (let i = 0; i < 3; i++) { const v = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.6, 0.7, 24), new THREE.MeshStandardMaterial({ color: 0x8a5a34 })); v.position.set(-2.2 + i * 2.2, 0.35, 1.2); town.add(v);
    const liq = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 0.05, 24), new THREE.MeshStandardMaterial({ color: 0x5a4a1a })); liq.position.set(-2.2 + i * 2.2, 0.68, 1.2); town.add(liq); } }
town.position.copy(TOWN); scene.add(town);
function makeGlove(col) { const g = new THREE.Group(); const m = new THREE.MeshStandardMaterial({ color: col });
  const palm = new THREE.Mesh(new RoundedBoxGeometry(0.8, 0.95, 0.28, 4, 0.12), m); palm.position.y = 0.5; g.add(palm);
  [-0.27, -0.09, 0.09, 0.27].forEach((x, i) => { const f = new THREE.Mesh(new THREE.CapsuleGeometry(0.09, 0.32 + (i === 1 || i === 2 ? 0.08 : 0), 6, 10), m); f.position.set(x, 1.15, 0); g.add(f); });
  const th = new THREE.Mesh(new THREE.CapsuleGeometry(0.1, 0.28, 6, 10), m); th.position.set(0.48, 0.65, 0); th.rotation.z = -0.8; g.add(th);
  const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.48, 0.25, 20), new THREE.MeshStandardMaterial({ color: 0x5a3a1a })); cuff.scale.z = 0.5; cuff.position.y = 0.0; g.add(cuff); return g; }
const gloves = [makeGlove(0x9a6a3a), makeGlove(0x9a6a3a)]; gloves.forEach(g => scene.add(g));
const bulb = new THREE.Group(); { const gl = new THREE.Mesh(new THREE.SphereGeometry(0.4, 20, 16), new THREE.MeshStandardMaterial({ color: 0xfff27a, emissive: 0xffd23a, emissiveIntensity: 0.3 })); gl.position.y = 0.4; bulb.add(gl);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.2, 0.3, 16), new THREE.MeshStandardMaterial({ color: 0x8a8a9a })); bulb.add(base); }
scene.add(bulb);
function signTex(t1) { const c = document.createElement('canvas'); c.width = 512; c.height = 200; const x = c.getContext('2d'); x.fillStyle = '#3a2410'; x.fillRect(0, 0, 512, 200); x.fillStyle = '#fff2c8'; x.fillRect(12, 12, 488, 176);
  x.fillStyle = '#3a2410'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = '900 96px Inter, Arial, sans-serif'; x.fillText(t1, 256, 104); return new THREE.CanvasTexture(c); }
const signTexs = [signTex('CUERO'), signTex('PERFUME')];
const sign = new THREE.Mesh(new RoundedBoxGeometry(2.6, 1.0, 0.12, 3, 0.04), new THREE.MeshStandardMaterial({ color: 0xffffff })); const signFace = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 0.9), new THREE.MeshBasicMaterial({ map: signTexs[0] })); signFace.position.z = 0.07; sign.add(signFace);
scene.add(sign);
const medal = new THREE.Group(); { const d = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 0.15, 48), new THREE.MeshStandardMaterial({ color: 0xffc83a })); d.rotation.x = Math.PI / 2; medal.add(d);
  const st = new THREE.Mesh(new THREE.OctahedronGeometry(0.45, 0), new THREE.MeshStandardMaterial({ color: 0xfff0a0 })); st.scale.z = 0.3; st.position.z = 0.12; medal.add(st);
  [-1, 1].forEach(s => { const rb = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.4, 0.04), new THREE.MeshStandardMaterial({ color: s < 0 ? 0x1a3aa0 : 0xe8262e })); rb.position.set(s * 0.3, 1.3, -0.05); rb.rotation.z = s * 0.25; medal.add(rb); }); }
scene.add(medal);
SETS.push(town, ...gloves, bulb, sign, medal);
const _resetX = resetWorld;
resetWorld = function () { _resetX(); you.userData.nose.scale.setScalar(1); pal.userData.nose.scale.setScalar(1); gloves.forEach(g => { g.scale.setScalar(1); g.rotation.set(0, 0, 0); g.traverse(o => { if (o.material && o.material.color && o.geometry.type !== 'CylinderGeometry') o.material.color.set(0x9a6a3a); }); }); you.userData.body.remove(crown2); pal.userData.body.remove(crown2); };
function inTown(T) { lightAt(TOWN); town.visible = true; ground.visible = true; }
Object.assign(PALG, { clima: [0x7ad0ff, 0x3aa05a], fiestas: [0xff9ad0, 0xe0508a], galimard: [0xe8c890, 0xa8784a], novela: [0x5a4a7a, 0x2a1a4a], museo: [0xffd27a, 0xff8a3a] });
const flowerField = new THREE.Group(); { const soil = new THREE.Mesh(new THREE.BoxGeometry(10, 0.15, 6), new THREE.MeshStandardMaterial({ color: 0x8a5a34 })); soil.position.y = 0.08; flowerField.add(soil);
  const kinds = [[0xffffff, 0.12, 0.7], [0xff5f8a, 0.16, 0.8], [0xfff6e0, 0.1, 1.3]];
  for (let r = 0; r < 3; r++) for (let k = 0; k < 8; k++) { const [c, rad, h] = kinds[r]; const st = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, h, 6), new THREE.MeshStandardMaterial({ color: 0x3a8a3a })); st.position.set((k - 3.5) * 1.1, h / 2, -r * 1.6 + 1.2); flowerField.add(st);
    const lf = new THREE.Mesh(new THREE.SphereGeometry(0.25, 10, 8), new THREE.MeshStandardMaterial({ color: 0x3aa05a })); lf.scale.y = 0.5; lf.position.set(st.position.x, 0.25, st.position.z); flowerField.add(lf);
    for (let j = 0; j < 3; j++) { const fl = new THREE.Mesh(new THREE.SphereGeometry(rad, 10, 8), new THREE.MeshStandardMaterial({ color: c })); fl.position.set(st.position.x + (j - 1) * 0.12, h + 0.05 + (j % 2) * 0.1, st.position.z); flowerField.add(fl); } } }
scene.add(flowerField); SETS.push(flowerField);
const fieldTags = [['JAZMÍN'], ['ROSA'], ['NARDO']].map(l => cartel(l, 1.3, 0.7));
const banners = Array.from({ length: 12 }, (_, i) => { const m = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.4, 3), new THREE.MeshStandardMaterial({ color: [0xff3a5a, 0xffd23a, 0x3aa0ff, 0x3ad07a][i % 4] })); m.rotation.x = Math.PI; scene.add(m); SETS.push(m); return m; });
const festTags = [cartel(['FIESTA DE', 'LA ROSA']), cartel(['FIESTA DEL', 'JAZMÍN'])];
const shop = new THREE.Group(); { const b = new THREE.Mesh(new THREE.BoxGeometry(3.6, 2.8, 0.4), new THREE.MeshStandardMaterial({ color: 0xf2d8a8 })); b.position.y = 1.4; shop.add(b);
  const door = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.6, 0.1), new THREE.MeshStandardMaterial({ color: 0x5a3a1a })); door.position.set(0, 0.8, 0.22); shop.add(door);
  [-1.2, 1.2].forEach(x => { const w = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.9), new THREE.MeshBasicMaterial({ color: 0xbfe6ff })); w.position.set(x, 1.4, 0.21); shop.add(w); });
  const awn = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.12, 0.8), new THREE.MeshStandardMaterial({ color: 0xc8322a })); awn.position.set(0, 2.2, 0.5); awn.rotation.x = 0.3; shop.add(awn); }
scene.add(shop); SETS.push(shop);
const sign1747 = cartel(['PERFUMERÍA', 'DESDE 1747'], 2.2, 1.0);
const bookP = new THREE.Group(); { const cov = new THREE.Mesh(new RoundedBoxGeometry(2.0, 2.7, 0.35, 3, 0.05), new THREE.MeshStandardMaterial({ color: 0x5a1a2a })); bookP.add(cov);
  const pg = new THREE.Mesh(new THREE.BoxGeometry(1.9, 2.6, 0.32), new THREE.MeshStandardMaterial({ color: 0xfff6e0 })); pg.position.set(0.06, 0, 0); bookP.add(pg);
  const tt = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 1.0), new THREE.MeshBasicMaterial({ map: (() => { const c = document.createElement('canvas'); c.width = 340; c.height = 200; const x = c.getContext('2d'); x.fillStyle = '#5a1a2a'; x.fillRect(0, 0, 340, 200); x.fillStyle = '#ffd27a'; x.textAlign = 'center'; x.font = '900 54px Georgia, serif'; x.fillText('EL', 170, 70); x.fillText('PERFUME', 170, 140); return new THREE.CanvasTexture(c); })() }));
  tt.position.set(0, 0.4, 0.18); bookP.add(tt); }
scene.add(bookP); SETS.push(bookP);
const museum = new THREE.Group(); { const m = new THREE.MeshStandardMaterial({ color: 0xf6f0e6 }); const base = new THREE.Mesh(new THREE.BoxGeometry(5, 0.3, 2), m); base.position.y = 0.15; museum.add(base);
  for (let i = 0; i < 5; i++) { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.2, 2.6, 16), m); c.position.set(-2 + i, 1.6, 0.6); museum.add(c); }
  const roof = new THREE.Mesh(new THREE.ConeGeometry(3.2, 1.0, 3), m); roof.rotation.y = Math.PI / 2; roof.scale.z = 0.4; roof.position.set(0, 3.4, 0.4); museum.add(roof);
  const top = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.3, 2), m); top.position.y = 2.95; museum.add(top); const wall = new THREE.Mesh(new THREE.BoxGeometry(4.6, 2.6, 0.2), new THREE.MeshStandardMaterial({ color: 0xe8dcc8 })); wall.position.set(0, 1.6, -0.6); museum.add(wall); }
scene.add(museum); SETS.push(museum);
const signMuseo = cartel(['MUSEO DEL', 'PERFUME'], 2.2, 1.0);
const SCENES = {
  gancho(t, d, cue, T) {
    const to = cue.olor ?? d * 0.8;
    inTown(T);
    if (t > to - 0.3) setStink(t, TOWN.clone().add(V(0, 3.0, -2.5)), to - 0.3, 0.9);
    const k = easeIO(prog(t, 0, d));
    return { pos: TOWN.clone().add(V(0, lerp(6.0, 4.2, k), lerp(13, 10.5, k))), tgt: TOWN.clone().add(V(0, 1.2, -2.2)), fov: 40, pal: 'g1' };
  },
  cuero(t, d, cue, T) {
    const tc = cue.cuero ?? d * 0.6, ta = cue.apestaban ?? d * 0.87;
    inTown(T);
    you.scale.setScalar(0.7); you.position.copy(TOWN).add(V(1.5, 0, 2.6));
    const stink = t > ta - 0.2;
    pose(you, { hop: hopF(T, 3, 0.05), mood: stink ? 'frown' : 'smile', eye: stink ? 0.7 : 1.1, look: [-0.8, 0], blink: stink ? 0.35 : blinkAt(T, 0.3), brow: stink ? -0.9 : 0, rotY: -0.5 });
    if (t > tc - 0.2) gloves.forEach((g, i) => { g.visible = true; g.scale.setScalar(Math.max(0.001, spring(prog(t, tc - 0.2 + i * 0.15, tc + 0.2 + i * 0.15))) * 0.7); g.position.copy(TOWN).add(V(-0.9 + i * 0.6, 0.0, 2.4)); g.rotation.set(0, 0.2, i ? -0.2 : 0.2); });
    if (stink) setStink(t, TOWN.clone().add(V(-0.6, 1.4, 2.4)), ta - 0.2, 0.55);
    const k = easeIO(prog(t, 0, tc));
    return { pos: lerpV(TOWN.clone().add(V(0, 4.2, 11.5)), TOWN.clone().add(V(0.2, 3.0, 9.4)), k), tgt: lerpV(TOWN.clone().add(V(0, 1.2, -1)), TOWN.clone().add(V(0.2, 1.0, 1.4)), k), fov: 40, pal: 'pueblo' };
  },
  idea(t, d, cue, T) {
    const ti = cue.idea ?? d * 0.3, tg = cue.guantes ?? d * 0.55, tf = cue.flores ?? d * 0.85;
    ped(DUO2);
    you.scale.setScalar(0.75); you.position.copy(DUO2).add(V(-1.0, 0.18, 0.5));
    pose(you, { hop: hopF(T, 3, 0.05), mood: t > ti ? 'o' : 'smile', mouthOpen: 1.2, eye: t > ti ? 1.35 : 1.0, look: [0.4, 0.8], blink: 1, brow: t > ti ? 0.9 : 0, rotY: 0.4, armR: t > ti ? 2.4 : 0.3 });
    const pb = spring(prog(t, ti - 0.2, ti + 0.2));
    bulb.visible = pb > 0.01; bulb.position.copy(you.position).add(V(0, 2.1, 0)); bulb.scale.setScalar(Math.max(0.001, pb) * 0.9);
    gloves.forEach((g, i) => { g.visible = true; g.scale.setScalar(0.8); g.position.copy(DUO2).add(V(0.6 + i * 0.8, 0.18, 0)); g.rotation.set(0, -0.2, i ? -0.15 : 0.15);
      const pink = easeIO(prog(t, tg, tg + 0.6)); g.children.forEach(o => { if (o.material && o.geometry.type !== 'CylinderGeometry') o.material.color.set(new THREE.Color(0x9a6a3a).lerp(new THREE.Color(0xffa0c0), pink)); }); });
    const flw = [ingMeshes.corazon[1], ingMeshes.corazon[0], ingMeshes.corazon[2]];
    flw.forEach((m, i) => { const p = spring(prog(t, tf - 0.3 + i * 0.15, tf + 0.1 + i * 0.15)); m.visible = p > 0.01; m.position.copy(DUO2).add(V(0.2 + i * 0.7, 2.3 + 0.1 * Math.sin(T * 2 + i), 0.4)); m.scale.setScalar(Math.max(0.001, p) * 0.6); m.rotation.y = T; });
    if (t > tg) { sparks.visible = true; setSparks(T, DUO2.clone().add(V(1.0, 1.0, 0)), 0.9, 1.6, 0xff9ad0, 1); }
    return { ...sh(DUO2, V(0, 2.4, 8.0), V(0, 1.5, 0)), pal: 'idea' };
  },
  corte(t, d, cue, T) {
    const tm = cue.moda ?? d * 0.3, tc = cue.catalina ?? d * 0.75;
    inPalace(T);
    pal.scale.setScalar(0.85); pal.position.copy(PAL).add(V(0.8, 0.1, 0.5)); pal.userData.body.add(wig2); wig2.visible = true;
    const queen = t > tc - 0.2; if (queen) { pal.userData.body.add(crown2); crown2.visible = true; }
    pose(pal, { hop: hopF(T, 2.3, 0.04), mood: 'smile', eye: 1.1, look: [-0.6, 0.2], blink: 0.4, rotY: -0.4, armR: 1.6 });
    you.scale.setScalar(0.8); you.position.copy(PAL).add(V(-1.2, 0.1, 0.8)); you.userData.body.add(wig); wig.visible = true;
    pose(you, { hop: hopF(T, 2, 0.04), mood: 'smile', eye: 1.15, look: [0.8, 0.2], blink: blinkAt(T, 0.4), rotY: 0.5, squash: t > tm ? 0.08 * Math.max(0, Math.sin((t - tm) * 4)) : 0 });
    const g = gloves[0]; g.visible = true; g.scale.setScalar(0.45); g.position.copy(pal.position).add(V(0.65, 1.0, 0.4)); g.rotation.set(0, -0.3, -0.4);
    g.children.forEach(o => { if (o.material && o.geometry.type !== 'CylinderGeometry') o.material.color.set(0xffa0c0); });
    if (t > tm) setHearts(t, PAL.clone().add(V(-0.2, 2.6, 0.6)), tm, 4, 0.8);
    return { ...sh(PAL, V(0, 2.4, 8.2), V(0, 1.5, 0)), pal: 'corte' };
  },
  cambio(t, d, cue, T) {
    const tg = cue.guanteros ?? d * 0.3, td = cue.dejaron ?? d * 0.65, tp = cue.perfume ?? d * 0.9;
    inTown(T);
    sign.visible = true; sign.position.copy(TOWN).add(V(0, 2.6, 1.6)); signFace.material.map = signTexs[t > td ? 1 : 0];
    sign.rotation.y = t > td - 0.15 && t < td + 0.15 ? Math.PI * 2 * prog(t, td - 0.15, td + 0.15) : 0;
    gloves.forEach((g, i) => { g.visible = t < tp; const fly = Math.max(0, t - td); g.scale.setScalar(0.6); g.position.copy(TOWN).add(V(-0.8 + i * 1.6, 0.3 + fly * fly * 4, 2.6)); g.rotation.set(0, 0, fly * 4 * (i ? -1 : 1)); });
    [blueB, pinkB, uniB].forEach((b, i) => { const p = spring(prog(t, tp - 0.3 + i * 0.12, tp + 0.1 + i * 0.12)); b.visible = p > 0.01; b.scale.setScalar(Math.max(0.001, p) * 0.45); b.position.copy(TOWN).add(V(-1.0 + i, 0.1, 2.6)); });
    if (t > tp) { sparks.visible = true; setSparks(T, TOWN.clone().add(V(0, 1.0, 2.6)), 1.4, 1.6, 0xff9ad0, 1); }
    return { pos: TOWN.clone().add(V(0, 3.0, 10.2)), tgt: TOWN.clone().add(V(0, 1.6, 1.4)), fov: 40, pal: 'cambio' };
  },
  final(t, d, cue, T) {
    const tu = cue.unesco ?? d * 0.3, tf = cue.feo ?? d * 0.8;
    ped(DUO2);
    const pm = spring(prog(t, tu - 0.3, tu + 0.2));
    medal.visible = pm > 0.01 && t < tf - 0.6; medal.position.copy(DUO2).add(V(0, 2.2, 0.3)); medal.scale.setScalar(Math.max(0.001, pm) * 0.8); medal.rotation.y = 0.3 * Math.sin(T * 2);
    if (t > tu) setConfetti(DUO2, t, tu);
    if (t > tf - 0.6) { const g = gloves[0]; g.visible = true; g.scale.setScalar(0.9); g.position.copy(DUO2).add(V(-0.4, 0.18, 0.2)); g.rotation.set(0, 0.2, 0.1);
      setStink(t, g.position.clone().add(V(0, 1.8, 0)), tf - 0.4, 0.4);
      you.scale.setScalar(0.7); you.position.copy(DUO2).add(V(1.1, 0.18, 0.6)); pose(you, { hop: 0.2 * Math.abs(Math.sin((t - tf) * 8)), mood: 'frown', eye: 0.7, look: [-0.8, 0], blink: 0.35, brow: -0.9, rotY: -0.6 }); }
    return { ...sh(DUO2, V(0, 2.4, 8.2), V(0, 1.6, 0)), pal: 'g6' };
  },
  clima(t, d, cue, T) {
    const cs = [cue.jazmin ?? d * 0.5, cue.rosa ?? d * 0.7, cue.nardo ?? d * 0.88];
    lightAt(TOWN); town.visible = true; ground.visible = true;
    flowerField.visible = true; flowerField.position.copy(TOWN).add(V(0, 0, 3.0));
    cs.forEach((tm, i) => { const g = fieldTags[i]; const p = spring(prog(t, tm - 0.2, tm + 0.2)); g.visible = p > 0.01; g.scale.setScalar(Math.max(0.001, p) * 0.6); g.position.copy(TOWN).add(V(-1.15 + i * 1.15, 2.0 + (i % 2) * 0.5, 4.4)); });
    return { pos: TOWN.clone().add(V(0, 3.8, 11.0)), tgt: TOWN.clone().add(V(0, 1.2, 2.0)), fov: 40, pal: 'clima' };
  },
  fiestas(t, d, cue, T) {
    const tr = cue.rosa2 ?? d * 0.5, tj = cue.jazmin2 ?? d * 0.85;
    inTown(T);
    banners.forEach((b, i) => { b.visible = true; b.position.copy(TOWN).add(V(-3 + i * 0.55, 3.2 - 0.25 * Math.sin((i / 11) * Math.PI), 2.4)); b.rotation.z = 0.1 * Math.sin(T * 3 + i); });
    festTags.forEach((g, i) => { const tm = i ? tj : tr; const p = spring(prog(t, tm - 0.2, tm + 0.2)); g.visible = p > 0.01 && (i === 1 || t < tj - 0.2); g.scale.setScalar(Math.max(0.001, p)); g.position.copy(TOWN).add(V(0, 1.8, 3.0)); });
    if (t > tr - 0.2) setConfetti(TOWN.clone().add(V(0, 0, 2.5)), t, tr - 0.2);
    return { pos: TOWN.clone().add(V(0, 3.0, 10.0)), tgt: TOWN.clone().add(V(0, 1.8, 1.5)), fov: 40, pal: 'fiestas' };
  },
  galimard(t, d, cue, T) {
    const ta = cue.anio ?? d * 0.45, tl = cue.luis ?? d * 0.85;
    lightAt(DUO2); ground.visible = true;
    shop.visible = true; shop.position.copy(DUO2).add(V(0, 0, -1.2));
    sign1747.visible = t > ta - 0.3; sign1747.position.copy(DUO2).add(V(-0.3, 2.4, 0.6)); sign1747.scale.setScalar(0.75 * Math.max(0.001, spring(prog(t, ta - 0.3, ta + 0.1))));
    if (t > tl - 0.4) { you.scale.setScalar(0.75); you.position.copy(DUO2).add(V(1.3, 0, 0.8)); you.userData.body.add(wig); wig.visible = true; you.userData.body.add(crown2); crown2.visible = true;
      pose(you, { hop: hopF(T, 2, 0.04), mood: 'smile', eye: 1.1, look: [-0.8, 0.3], blink: 0.4, rotY: -0.5, armR: 1.4 }); youBottle.visible = true; you.userData.nose.visible = true; }
    return { ...sh(DUO2, V(0, 2.4, 8.4), V(0, 1.7, 0)), pal: 'galimard' };
  },
  novela(t, d, cue, T) {
    const tp = cue.perfume ?? d * 0.6;
    ped(DUO2);
    const p = spring(prog(t, 0.1, 0.5)); bookP.visible = true; bookP.scale.setScalar(Math.max(0.001, p) * 0.9); bookP.position.copy(DUO2).add(V(0, 1.6 + 0.08 * Math.sin(T * 2), 0)); bookP.rotation.set(-0.1, 0.3 * Math.sin(T * 0.8), 0.05);
    if (t > tp) { sparks.visible = true; setSparks(T, bookP.position, 1.4, 1.8, 0xffd27a, 1); }
    return { ...sh(DUO2, V(0, 2.2, 7.0), V(0, 1.6, 0)), pal: 'novela' };
  },
  museo(t, d, cue, T) {
    const tm = cue.museo ?? d * 0.3, tn = cue.narices ?? d * 0.65;
    lightAt(DUO2); ground.visible = true;
    museum.visible = true; museum.position.copy(DUO2).add(V(0, 0, -1.4));
    signMuseo.visible = t > tm - 0.3; signMuseo.position.copy(DUO2).add(V(0, 2.9, 0.4)); signMuseo.scale.setScalar(Math.max(0.001, spring(prog(t, tm - 0.3, tm + 0.1))) * 0.9);
    if (t > tn - 0.4) [you, pal].forEach((b, i) => { b.visible = true; b.scale.setScalar(0.65); b.position.copy(DUO2).add(V(i ? 1.0 : -1.0, 0, 1.0)); b.userData.nose.visible = true;
      b.userData.nose.scale.setScalar(1 + 0.6 * spring(prog(t, tn, tn + 0.4)));
      pose(b, { hop: hopF(T, 3 + i, 0.05), mood: 'smile', eye: 1.1, look: [i ? -0.6 : 0.6, 0.2], blink: 0.35, rotY: i ? -0.5 : 0.5 }); });
    return { ...sh(DUO2, V(0, 2.6, 9.4), V(0, 1.9, 0)), pal: 'museo' };
  },
};


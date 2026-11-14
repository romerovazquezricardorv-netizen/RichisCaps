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
resetWorld = function () { _resetX(); gloves.forEach(g => { g.scale.setScalar(1); g.rotation.set(0, 0, 0); g.traverse(o => { if (o.material && o.material.color && o.geometry.type !== 'CylinderGeometry') o.material.color.set(0x9a6a3a); }); }); you.userData.body.remove(crown2); pal.userData.body.remove(crown2); };
function inTown(T) { lightAt(TOWN); town.visible = true; ground.visible = true; }
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
};


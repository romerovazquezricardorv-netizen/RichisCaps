// ================================================================== GAULTIER: FRASCOS CON FORMA DE TORSO (modelos genéricos)
Object.assign(PALG, { ga1: [0x7ad0ff, 0x3a8ae0], abu: [0xffd27a, 0xff8a3a], pas: [0xff9ad0, 0xe0508a], pop: [0xc89aff, 0x7a4ad8], cla: [0xff9ad0, 0xe0508a], mal: [0x7ad0ff, 0x2a5ad8], lat: [0xd0d8e0, 0x8a96a6], ga6: [0xffd23a, 0xff8a3a] });
function stripeTex() { const c = document.createElement('canvas'); c.width = 64; c.height = 256; const x = c.getContext('2d'); for (let i = 0; i < 16; i++) { x.fillStyle = i % 2 ? '#ffffff' : '#1a3aa0'; x.fillRect(0, i * 16, 64, 16); } const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; return t; }
function torso(female) { const g = new THREE.Group();
  const prof = (female ? [[0, 0], [0.62, 0], [0.7, 0.2], [0.62, 0.7], [0.42, 1.15], [0.55, 1.55], [0.68, 1.9], [0.55, 2.15], [0.22, 2.3], [0.2, 2.45], [0, 2.45]]
                       : [[0, 0], [0.55, 0], [0.62, 0.3], [0.58, 0.9], [0.66, 1.4], [0.82, 1.85], [0.78, 2.1], [0.3, 2.3], [0.22, 2.45], [0, 2.45]]).map(([r, y]) => new THREE.Vector2(r, y));
  const geo = new THREE.LatheGeometry(prof, 48); geo.scale(1, 1, 0.6);
  const mat = female ? new THREE.MeshStandardMaterial({ color: 0xffb8c8 }) : new THREE.MeshStandardMaterial({ color: 0xffffff, map: stripeTex() });
  g.add(new THREE.Mesh(geo, mat));
  if (female) { const band = new THREE.Mesh(new THREE.CylinderGeometry(0.47, 0.6, 0.75, 40, 1, true), new THREE.MeshStandardMaterial({ color: 0xff5f9a, side: THREE.DoubleSide })); band.scale.z = 0.62; band.position.y = 1.0; g.add(band);
    for (let i = 0; i < 5; i++) { const lace = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.03, 0.03), new THREE.MeshStandardMaterial({ color: 0x111111 })); lace.position.set(0, 0.72 + i * 0.13, 0.31); lace.rotation.z = (i % 2 ? 0.5 : -0.5); g.add(lace); } g.userData.band = band; }
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.35, 24), new THREE.MeshStandardMaterial({ color: female ? 0xd8ab55 : 0x1a3aa0 })); cap.position.y = 2.62; g.add(cap);
  scene.add(g); SETS.push(g); return g; }
const torsoF = torso(true), torsoM = torso(false);
const can = new THREE.Group(); const canLid = new THREE.Group();
{ const m = new THREE.MeshStandardMaterial({ color: 0xc8ced6 }); const body = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 2.8, 40, 1, true), new THREE.MeshStandardMaterial({ color: 0xc8ced6, side: THREE.DoubleSide })); body.position.y = 1.4; can.add(body);
  [0.4, 1.4, 2.4].forEach(y => { const r = new THREE.Mesh(new THREE.TorusGeometry(1.01, 0.03, 6, 40), m); r.rotation.x = Math.PI / 2; r.position.y = y; can.add(r); });
  const bot = new THREE.Mesh(new THREE.CircleGeometry(1.0, 40), m); bot.rotation.x = -Math.PI / 2; bot.position.y = 0.01; can.add(bot);
  const lid = new THREE.Mesh(new THREE.CylinderGeometry(1.02, 1.02, 0.06, 40), m); lid.position.set(0, 0, 1.0); canLid.add(lid); canLid.position.set(0, 2.8, -1.0); can.add(canLid); }
scene.add(can); SETS.push(can);
const foodCans = ['SOPA', 'FRIJOL', 'ATÚN'].map((l, i) => { const g = new THREE.Group(); const b = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.9, 28), new THREE.MeshStandardMaterial({ map: labelTex(l, ['#e8402a', '#e8a02a', '#2a8ad8'][i], '#ffffff') })); b.position.y = 0.45; g.add(b);
  [0, 0.9].forEach(y => { const r = new THREE.Mesh(new THREE.CylinderGeometry(0.43, 0.43, 0.04, 28), new THREE.MeshStandardMaterial({ color: 0xc8ced6 })); r.position.y = y; g.add(r); }); scene.add(g); SETS.push(g); return g; });
const runway = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.25, 10), new THREE.MeshStandardMaterial({ color: 0xff5fa0 })); scene.add(runway); SETS.push(runway);
const mic = new THREE.Group(); { const h = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 10), new THREE.MeshStandardMaterial({ color: 0x333333 })); h.position.y = 0.3; mic.add(h); const s = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.35, 10), new THREE.MeshStandardMaterial({ color: 0x111111 })); mic.add(s); }
const specs = new THREE.Group(); { const m = new THREE.MeshStandardMaterial({ color: 0x111111 }); [-1, 1].forEach(s => { const g = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.03, 8, 20), m); g.position.set(s * 0.27, 1.62, 0.72); specs.add(g); }); }
const corsetBand = new THREE.Group(); { const b = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.86, 0.6, 32), new THREE.MeshStandardMaterial({ color: 0xff5f9a })); b.position.y = 0.95; corsetBand.add(b);
  for (let i = 0; i < 4; i++) { const l = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.03, 0.03), new THREE.MeshStandardMaterial({ color: 0x111111 })); l.position.set(0, 0.75 + i * 0.13, 0.86); l.rotation.z = i % 2 ? 0.5 : -0.5; corsetBand.add(l); } }
const stripeShirt = makeShirt(); stripeShirt.traverse(o => { if (o.isMesh) o.material = new THREE.MeshStandardMaterial({ color: 0xffffff, map: stripeTex() }); }); scene.add(stripeShirt); SETS.push(stripeShirt);
const _resetG = resetWorld;
resetWorld = function () { _resetG(); pal.userData.body.remove(specs); pal.userData.hand.remove(mic); you.userData.body.remove(stripeShirt, corsetBand); pal.userData.body.remove(corsetBand); if (stripeShirt.parent !== scene) scene.add(stripeShirt); canLid.rotation.x = 0; [torsoF, torsoM].forEach(b => { b.scale.setScalar(1); b.rotation.set(0, 0, 0); }); };
const SCENES = {
  gancho(t, d, cue, T) {
    ped(DUO2);
    [torsoF, torsoM].forEach((b, i) => { b.visible = true; b.scale.setScalar(0.85 * Math.max(0.001, spring(prog(t, 0.1 + i * 0.25, 0.6 + i * 0.25)))); b.position.copy(DUO2).add(V(i ? 0.8 : -0.8, 0.18, 0)); b.rotation.y = T * 0.6 + i * Math.PI; });
    qMark.visible = t > (cue.cuerpo ?? d * 0.8); qMark.scale.setScalar(0.6 * Math.max(0.001, spring(prog(t, cue.cuerpo, cue.cuerpo + 0.4)))); qMark.position.copy(DUO2).add(V(0, 3.1, 0.3)); qMark.rotation.y = 0.3 * Math.sin(T * 3);
    return { ...sh(DUO2, V(0, 2.2, lerp(6.0, 7.6, easeOut(prog(t, 0, 1.2)))), V(0, 1.4, 0)), pal: 'ga1' };
  },
  abuela(t, d, cue, T) {
    const tc = cue.corses ?? d * 0.15, tp = cue.pasarela ?? d * 0.6, tpop = cue.pop ?? d * 0.9;
    if (t < tp - 0.15) {
      ped(DUO2);
      pal.scale.setScalar(0.9); pal.position.copy(DUO2).add(V(-0.7, 0.18, 0.2)); pal.userData.body.add(wig2); wig2.visible = true; pal.userData.body.add(specs);
      pose(pal, { hop: hopF(T, 2, 0.03), mood: 'smile', eye: 1.0, look: [0.6, -0.2], blink: blinkAt(T, 0.3), rotY: 0.4, armR: 1.4 });
      torsoF.visible = t > tc - 0.2; torsoF.scale.setScalar(0.4 * Math.max(0.001, spring(prog(t, tc - 0.2, tc + 0.2)))); torsoF.position.copy(DUO2).add(V(0.3, 1.0, 0.7)); torsoF.rotation.y = 0.3 * Math.sin(T);
      you.scale.setScalar(0.5); you.position.copy(DUO2).add(V(1.2, 0.18, 0.8));
      pose(you, { hop: hopF(T, 4, 0.06), mood: 'o', mouthOpen: 1.1, eye: 1.4, look: [-0.8, 0.4], blink: 1, rotY: -0.6 });
      if (t > tc) setHearts(t, you.position.clone().add(V(0, 1.4, 0.2)), tc, 3, 0.4);
      return { ...sh(DUO2, V(0, 2.2, 7.4), V(0.1, 1.3, 0)), pal: 'abu' };
    }
    if (t < tpop - 0.15) {   // pasarela
      lightAt(DUO2); runway.visible = true; runway.position.copy(DUO2).add(V(0, 0.12, -2)); ground.visible = true;
      you.scale.setScalar(0.75); you.position.copy(DUO2).add(V(0, 0.25, lerp(-5, 1.0, easeOut(prog(t, tp - 0.15, tpop))))); you.userData.body.add(corsetBand); corsetBand.visible = true;
      pose(you, { hop: Math.abs(Math.sin(T * 8)) * 0.08, mood: 'smile', eye: 1.1, look: [0, 0], blink: 1, rotY: 0 });
      return { pos: DUO2.clone().add(V(2.2, 2.4, 6.4)), tgt: DUO2.clone().add(V(0, 1.0, -1.0)), fov: 40, pal: 'pas' };
    }
    // gira de estrella del pop
    ped(DUO2);
    pal.scale.setScalar(0.9); pal.position.copy(DUO2).add(V(0, 0.18, 0.2)); pal.userData.hand.add(mic); mic.visible = true; mic.position.set(0.1, -0.2, 0.2);
    pal.userData.body.add(corsetBand); corsetBand.visible = true;
    pose(pal, { hop: Math.abs(Math.sin(T * 7)) * 0.15, mood: 'o', mouthOpen: 1.3, eye: 1.2, look: [0, 0.3], blink: 1, rotY: 0, armR: 2.0, armL: 2.4 });
    sparks.visible = true; setSparks(T, DUO2.clone().add(V(0, 2.0, 0)), 2.0, 3, 0xffd23a, 1);
    return { ...sh(DUO2, V(0, 2.4, 7.6), V(0, 1.5, 0)), pal: 'pop' };
  },
  classique(t, d, cue, T) {
    const tc = cue.classique ?? d * 0.4, tk = cue.corse ?? d * 0.85;
    ped(DUO2);
    const p = 0.55 * spring(prog(t, 0.1, 0.5)) + 0.55 * easeOut(prog(t, tc - 0.3, tc + 0.3));
    torsoF.visible = true; torsoF.scale.setScalar(Math.max(0.001, p)); torsoF.position.copy(DUO2).add(V(0, 0.18, 0)); torsoF.rotation.y = 0.4 * Math.sin(T * 0.8);
    torsoF.userData.band.scale.set(1 + 0.08 * Math.max(0, Math.sin((t - tk) * 12)) * (t > tk ? Math.exp(-(t - tk) * 3) : 0), 1, 0.62);
    if (t > tk) { sparks.visible = true; setSparks(T, DUO2.clone().add(V(0, 1.3, 0)), 1.1, 1.6, 0xff9ad0, 1); }
    return { ...sh(DUO2, V(0, 2.2, 7.4), V(0, 1.5, 0)), pal: 'cla' };
  },
  lemale(t, d, cue, T) {
    const tl = cue.lemale ?? d * 0.25, tr = cue.rayas ?? d * 0.65;
    ped(DUO2);
    const p = spring(prog(t, tl - 0.3, tl + 0.2));
    torsoM.visible = true; torsoM.scale.setScalar(Math.max(0.001, p) * 1.1); torsoM.position.copy(DUO2).add(V(-0.5, 0.18, 0)); torsoM.rotation.y = 0.4 * Math.sin(T * 0.8);
    if (t > tr - 0.2) { you.scale.setScalar(0.75); you.position.copy(DUO2).add(V(1.3, 0.18, 0.7)); you.userData.body.add(stripeShirt); stripeShirt.visible = true; stripeShirt.position.set(0, 1.0, 0.25); stripeShirt.scale.setScalar(0.9);
      pose(you, { hop: hopF(T, 3, 0.06), mood: 'smile', eye: 1.2, look: [-0.7, 0.3], blink: 1, rotY: -0.5, armR: 2.2 }); }
    return { ...sh(DUO2, V(0, 2.3, 7.8), V(0.1, 1.5, 0)), pal: 'mal' };
  },
  lata(t, d, cue, T) {
    const tl = cue.lata ?? d * 0.5, ts = cue.super ?? d * 0.8;
    ped(DUO2);
    can.visible = true; can.position.copy(DUO2).add(V(0, 0.18, 0)); can.scale.setScalar(0.8);
    const open = easeOut(prog(t, tl - 0.3, tl + 0.3)); canLid.rotation.x = -1.9 * open;
    torsoM.visible = true; torsoM.scale.setScalar(0.7); torsoM.position.copy(DUO2).add(V(0, 0.18 + 2.0 * easeOut(prog(t, tl, tl + 0.6)), 0)); torsoM.rotation.y = 0.3 * Math.sin(T);
    foodCans.forEach((c, i) => { const p = spring(prog(t, ts - 0.2 + i * 0.12, ts + 0.2 + i * 0.12)); c.visible = p > 0.01; c.scale.setScalar(Math.max(0.001, p) * 0.75); c.position.copy(DUO2).add(V(-1.3 + i * 1.3, 0.18, 1.5)); });
    return { ...sh(DUO2, V(0, 3.0, 9.0), V(0, 1.8, 0)), pal: 'lat' };
  },
  final(t, d, cue, T) {
    const te = cue.escultura ?? d * 0.2, tq = cue.tienes ?? d * 0.75;
    ped(DUO2);
    [torsoF, torsoM].forEach((b, i) => { b.visible = true; b.scale.setScalar(0.85); b.position.copy(DUO2).add(V(i ? 0.8 : -0.8, 0.18, 0)); b.rotation.y = (i ? -0.3 : 0.3) + 0.15 * Math.sin(T); });
    if (t > te) { sparks.visible = true; setSparks(T, DUO2.clone().add(V(0, 1.4, 0)), 1.8, 2.4, 0xffd23a, 1); setFloorRings(T, DUO2, 0xffd23a); }
    qMark.visible = t > tq; qMark.scale.setScalar(Math.max(0.001, spring(prog(t, tq, tq + 0.4)) * 0.6)); qMark.position.copy(DUO2).add(V(0, 3.0, 0.3)); qMark.rotation.y = 0.3 * Math.sin(T * 3);
    return { ...sh(DUO2, V(0, 2.2, 7.6), V(0, 1.5, 0)), pal: 'ga6' };
  },
};


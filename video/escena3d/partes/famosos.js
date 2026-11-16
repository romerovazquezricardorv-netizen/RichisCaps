// ================================================================== PERFUMES DE FAMOSOS (personajes y frascos genéricos)
Object.assign(PALG, { f1: [0xffd23a, 0xff8a3a], f2: [0xc89aff, 0x7a4ad8], f3: [0xff9ad0, 0xe0508a], f4: [0x7ad0ff, 0x3a8ae0], f5: [0x9ae08a, 0x3aa05a], f6: [0x8a8a9a, 0x4a4a5a], f7: [0xbfe6ff, 0x7aa0e0], f8: [0xff8a5a, 0xc04a2a] });
const starMat = new THREE.MeshStandardMaterial({ color: 0xffd23a });
function starShape(r = 0.5) { const s = new THREE.Shape(); for (let i = 0; i < 10; i++) { const a = Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; i ? s.lineTo(Math.cos(a) * rr, Math.sin(a) * rr) : s.moveTo(Math.cos(a) * rr, Math.sin(a) * rr); } return s; }
const star = add(new THREE.Mesh(new THREE.ExtrudeGeometry(starShape(0.5), { depth: 0.15, bevelEnabled: false }), starMat));
function shades(b) { const g = new THREE.Group(); const m = new THREE.MeshStandardMaterial({ color: 0x15151c }); [-0.27, 0.27].forEach(x => { const l = new THREE.Mesh(new RoundedBoxGeometry(0.4, 0.24, 0.06, 2, 0.06), m); l.position.set(x, 1.45, 0.78); g.add(l); });
  const br = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.04, 0.04), m); br.position.set(0, 1.5, 0.8); g.add(br); b.userData.body.add(g); return g; }
const celeb = buddyG(0xc89aff); const celebShades = shades(celeb);
const celeb2 = buddyG(0xffb03a); shades(celeb2);
const gem = add((() => { const g = new THREE.Group(); const m = new THREE.MeshStandardMaterial({ color: 0xeaf6ff, roughness: 0.15, flatShading: true }); const top = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.6, 0.25, 8), m); top.position.y = 0.95; g.add(top);
  const bot = new THREE.Mesh(new THREE.ConeGeometry(0.6, 0.85, 8), m); bot.rotation.x = Math.PI; bot.position.y = 0.4; g.add(bot); return g; })());
const starB = bottleG(0xc8b0ff, 'STAR'), glowB = bottleG(0xffe0a0, 'STAR'), cloudB = bottleG(0xd8c8ff, 'STAR');
const rowF = [0xff9ad0, 0x7ad0ff, 0xffc46b, 0x9ae08a, 0xc89aff, 0xff8a5a].map(c => bottleG(c, 'STAR'));
const singer = buddyG(0xff6fb0), actor = buddyG(0x3ad0a0), player = buddyG(0x4f8dff);
const micF = add((() => { const g = new THREE.Group(); const h = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 10), new THREE.MeshStandardMaterial({ color: 0x3a3a44 })); h.position.y = 0.3; g.add(h); const s = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.5, 8), new THREE.MeshStandardMaterial({ color: 0x15151c })); g.add(s); return g; })());
singer.userData.hand.add(micF);
const clap = add((() => { const g = new THREE.Group(); const b = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.35, 0.05), new THREE.MeshStandardMaterial({ color: 0x15151c })); g.add(b); const t = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.08, 0.06), new THREE.MeshStandardMaterial({ color: 0xffffff })); t.position.y = 0.22; t.rotation.z = 0.2; g.add(t); return g; })());
actor.userData.hand.add(clap);
const ball = add((() => { const g = new THREE.Group(); g.add(new THREE.Mesh(new THREE.SphereGeometry(0.3, 18, 14), new THREE.MeshStandardMaterial({ color: 0xffffff })));
  for (let i = 0; i < 6; i++) { const p = new THREE.Mesh(new THREE.CircleGeometry(0.09, 5), new THREE.MeshStandardMaterial({ color: 0x15151c })); const a = i / 6 * Math.PI * 2; p.position.set(Math.cos(a) * 0.3, Math.sin(a) * 0.3 * 0.6, 0.15); p.lookAt(p.position.clone().multiplyScalar(2)); g.add(p); } return g; })());
const perfumer = buddyG(0x3ad0a0); { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.78, 0.86, 0.9, 24, 1, true), new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide })); c.position.y = 0.6; perfumer.userData.body.add(c); }
const flaskF = add((() => { const g = new THREE.Group(); const gl = new THREE.MeshStandardMaterial({ color: 0xeaf6ff, transparent: true, opacity: 0.4, side: THREE.DoubleSide }); const b = new THREE.Mesh(new THREE.ConeGeometry(0.5, 0.8, 24, 1, true), gl); b.position.y = 0.4; g.add(b);
  const n = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.4, 14, 1, true), gl); n.position.y = 0.98; g.add(n); const liq = new THREE.Mesh(new THREE.ConeGeometry(0.42, 0.45, 24), new THREE.MeshStandardMaterial({ color: 0xff9ad0 })); liq.position.y = 0.22; g.add(liq); return g; })());
const paper = add((() => { const g = new THREE.Group(); const p = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.03, 1.3), new THREE.MeshStandardMaterial({ color: 0xffffff })); g.add(p);
  for (let i = 0; i < 4; i++) { const l = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.035, 0.04), new THREE.MeshStandardMaterial({ color: 0x9aa0b0 })); l.position.set(0, 0.01, -0.4 + i * 0.2); g.add(l); } return g; })());
const pen = add(new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.6, 8), new THREE.MeshStandardMaterial({ color: 0x3a6ae0 })));
const sig = add(new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.02, 6, 24, Math.PI * 1.6), new THREE.MeshStandardMaterial({ color: 0x3a6ae0 })));
const tagEmpresa = cartel(['EMPRESA DE', 'FRAGANCIAS']);
const poster = add((() => { const g = new THREE.Group(); const p = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 1.3), new THREE.MeshBasicMaterial({ color: 0xff9ad0 })); g.add(p); const s = new THREE.Mesh(new THREE.ExtrudeGeometry(starShape(0.3), { depth: 0.05, bevelEnabled: false }), starMat); s.position.z = 0.02; g.add(s); return g; })());
const phoneF = add((() => { const g = new THREE.Group(); g.add(new THREE.Mesh(new RoundedBoxGeometry(0.8, 1.45, 0.1, 4, 0.1), new THREE.MeshStandardMaterial({ color: 0x15151c })));
  const c = document.createElement('canvas'); c.width = 160; c.height = 290; const x = c.getContext('2d'); x.fillStyle = '#ff7ab8'; x.fillRect(0, 0, 160, 290); x.fillStyle = '#fff'; x.font = '900 110px Inter'; x.textAlign = 'center'; x.fillText('♥', 80, 150); x.font = '900 34px Inter'; x.fillText('12.4K', 80, 230);
  const s = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 1.28), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c) })); s.position.z = 0.06; g.add(s); return g; })());
const candy = add((() => { const g = new THREE.Group(); [[0xff6a8a, -0.3], [0xffd23a, 0], [0x9ae08a, 0.3]].forEach(([c, x]) => { const b = new THREE.Mesh(new THREE.SphereGeometry(0.16, 14, 10), new THREE.MeshStandardMaterial({ color: c })); b.position.x = x; g.add(b); }); return g; })());
const bin = add((() => { const g = new THREE.Group(); const b = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.45, 1.0, 20, 1, true), new THREE.MeshStandardMaterial({ color: 0x8a96a6, side: THREE.DoubleSide })); b.position.y = 0.5; g.add(b);
  const bt = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.04, 20), new THREE.MeshStandardMaterial({ color: 0x6a7686 })); g.add(bt); return g; })());
const cloud = add((() => { const g = new THREE.Group(); const m = new THREE.MeshStandardMaterial({ color: 0xffffff }); [[0, 0, 0.55], [-0.6, -0.1, 0.42], [0.6, -0.1, 0.42], [-0.3, 0.25, 0.4], [0.3, 0.25, 0.4]].forEach(([x, y, r]) => { const s = new THREE.Mesh(new THREE.SphereGeometry(r, 18, 12), m); s.position.set(x, y, 0); s.scale.z = 0.7; g.add(s); }); return g; })());
const bars = [0.6, 1.0, 1.5, 2.2].map((h, i) => { const b = add(new THREE.Mesh(new THREE.BoxGeometry(0.4, 1, 0.4), new THREE.MeshStandardMaterial({ color: [0x7ad0ff, 0x9ae08a, 0xff9ad0, 0xc89aff][i] }))); b.geometry.translate(0, 0.5, 0); b.userData.h = h; return b; });
const flashes = Array.from({ length: 4 }, () => add(new THREE.Mesh(new THREE.CircleGeometry(0.3, 16), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85 }))));
function setFlashes(T, c = DUO2) { flashes.forEach((f, i) => { f.visible = Math.sin(T * 7 + i * 2.1) > 0.8; f.position.copy(c).add(V(i % 2 ? 1.05 : -1.05, 1.0 + (i > 1 ? 0.9 : 0), 0.6)); f.scale.setScalar(0.6); }); }
const SCENES = {
  gancho(t, d, cue, T) {
    ped(DUO2);
    bud(celeb, -0.55, 0.3, 0.6, T, { look: [0.4, 0.1], rotY: 0.3, armR: 2.0 + 0.2 * Math.sin(T * 6) });
    P(starB, t, 0.3, 0.45); A(starB, 0.7, 0.18, 0.2); spin(starB, T);
    P(star, t, 0.6, 0.5); A(star, 0.7, 1.9, 0.3); star.rotation.y = T;
    setFlashes(T);
    return shot('f1', 7.2, 1.3);
  },
  taylor(t, d, cue, T) {
    const tw = cue.white ?? d * 0.45, tm = cue.mil ?? d * 0.8;
    ped(DUO2);
    bud(celeb, -0.7, 0.3, 0.55, T, { look: [0.6, 0.2], rotY: 0.4, armR: 1.6 });
    if (t > tw - 0.3) { P(gem, t, tw - 0.3, 0.75); A(gem, 0.65, 0.4, 0.2); gem.rotation.y = T * 0.8; sparks.visible = true; setSparks(T, DUO2.clone().add(V(0.65, 1.0, 0.2)), 0.7, 1.2, 0xffffff, 1); }
    if (t > tm) setBillRain(DUO2, t, tm);
    return shot('f2', 7.2, 1.3);
  },
  jlo(t, d, cue, T) {
    const tg = cue.glow ?? d * 0.1, tf = cue.fiebre ?? d * 0.35, ts = [cue.cantantes ?? d * 0.45, cue.actores ?? d * 0.55, cue.futbol ?? d * 0.65], tc = cue.cristiano ?? d * 0.88;
    ped(DUO2);
    if (t < ts[0] - 0.3) { bud(celeb2, -0.6, 0.3, 0.55, T, { look: [0.6, 0.1], rotY: 0.4, armR: 1.8 }); P(glowB, t, tg - 0.2, 0.45); A(glowB, 0.6, 0.18, 0.2); spin(glowB, T);
      sparks.visible = true; setSparks(T, DUO2.clone().add(V(0.6, 1.0, 0.2)), 0.8, 1.2, 0xffd23a, 1); if (t > tf) setConfetti(DUO2, t, tf); return shot('f3', 7.2, 1.3); }
    [singer, actor, player].forEach((b, i) => { if (t > ts[i] - 0.3) { bud(b, -1.0 + i * 1.0, 0.3, 0.45, T, { look: [0, 0.2], armR: 1.8, hop: hopF(T, 3 + i, 0.06) }); } });
    micF.visible = clap.visible = true;
    if (t > ts[2] - 0.3) { ball.visible = true; ball.scale.setScalar(0.6); A(ball, 1.0, 0.35 + Math.abs(Math.sin(T * 5)) * 0.6, 0.8); }
    if (t > tc - 0.3) { P(rowF[1], t, tc - 0.3, 0.3); A(rowF[1], 1.35, 0.18, 0.4); }
    return shot('f3', 7.6, 1.2);
  },
  como(t, d, cue, T) {
    const tc = cue.crea ?? d * 0.1, te = cue.empresa ?? d * 0.25, tp = cue.perfumista ?? d * 0.4, tca = cue.cara ?? d * 0.65, tr = cue.regalias ?? d * 0.85;
    if (t < tp) {
      ped(DUO2);
      bud(celeb, -0.6, 0.3, 0.55, T, { look: [0.6, 0.1], rotY: 0.4, mood: 'o', mouthOpen: 0.8 });
      if (t > tc) { xMark.visible = true; xMark.scale.setScalar(Math.max(0.001, spring(prog(t, tc, tc + 0.3))) * 0.3); A(xMark, -0.6, 2.0, 0.5); }
      if (t > te - 0.2) { P(tagEmpresa, t, te - 0.2, 0.75); A(tagEmpresa, 0.6, 1.4, 0.5); }
      return shot('f6', 7.2, 1.3);
    }
    if (t < tr) {
      ped(DUO2); ped(DUO3, true);
      bud(perfumer, -0.5, 0.2, 0.55, T, { look: [0.8, -0.1], rotY: 0.5, armR: 1.4 }); flaskF.visible = true; flaskF.scale.setScalar(0.8); A(flaskF, 0.5, 0.18, 0.2); flaskF.rotation.z = 0.15 * Math.sin(T * 3);
      bud(celeb, -0.5, 0.2, 0.55, T, { look: [0.8, -0.3], rotY: 0.5, armR: 1.2 }, DUO3);
      paper.visible = true; paper.scale.setScalar(0.7); A(paper, 0.55, 0.3, 0.3, DUO3); paper.rotation.y = -0.3;
      pen.visible = true; pen.scale.setScalar(1); A(pen, 0.45 + 0.15 * Math.sin(T * 6), 0.6, 0.35, DUO3); pen.rotation.z = 0.5;
      if (t > tca) { sig.visible = true; sig.scale.setScalar(Math.max(0.001, prog(t, tca, tca + 0.6))); A(sig, 0.55, 0.34, 0.35, DUO3); sig.rotation.x = -Math.PI / 2; }
      return splitShot('f4', 'f3');
    }
    ped(DUO2);
    bud(celeb, -0.5, 0.3, 0.55, T, { look: [0.6, 0.0], rotY: 0.4, armR: 2.2 });
    coinPile.visible = true; coinPile.scale.setScalar(0.45 * Math.max(0.001, spring(prog(t, tr, tr + 0.4)))); A(coinPile, 0.6, 0.18, 0.4);
    return shot('f1', 7.2, 1.2);
  },
  porque(t, d, cue, T) {
    const ti = cue.idolo ?? d * 0.45, to = cue.olor ?? d * 0.85;
    ped(DUO2);
    bud(you, -0.6, 0.3, 0.55, T, { look: [0.6, 0.3], rotY: 0.4, eye: 1.3, blink: 1, hop: hopF(T, 5, 0.1), armR: 2.2 });
    if (t > ti - 0.3) { P(poster, t, ti - 0.3, 0.85); A(poster, 0.6, 1.4, -0.4); setHearts(t, DUO2.clone().add(V(-0.6, 1.8, 0.4)), ti, 3, 0.4); }
    if (t > to - 0.3) { P(starB, t, to - 0.3, 0.35); A(starB, 0.0, 0.18, 0.8); you.userData.nose.visible = true; }
    return shot('f3', 7.2, 1.3);
  },
  truco(t, d, cue, T) {
    const tf = cue.formula ?? d * 0.1, td = cue.dulce ?? d * 0.45, tr = cue.redes ?? d * 0.8;
    ped(DUO2);
    starB.visible = true; starB.scale.setScalar(0.5); A(starB, -0.4, 0.18, 0); spin(starB, T);
    if (t > td - 0.3) { P(candy, t, td - 0.3, 1.0); A(candy, -0.4, 0.4, 0.9); candy.rotation.y = T; }
    if (t > tr - 0.3) { P(phoneF, t, tr - 0.3, 0.75); A(phoneF, 0.75, 1.3, 0.4); phoneF.rotation.z = 0.15 * Math.sin(T * 3); setHearts(t, DUO2.clone().add(V(0.75, 2.2, 0.4)), tr, 4, 0.4); }
    return shot('f8', 7.2, 1.3);
  },
  fracasos(t, d, cue, T) {
    const tt = cue.triunfan ?? d * 0.2, td = cue.desaparecen ?? d * 0.6;
    ped(DUO2);
    bin.visible = true; bin.scale.setScalar(0.9); A(bin, 0.6, 0.18, 0);
    rowF.slice(0, 4).forEach((b, i) => { const t0 = td - 0.4 + i * 0.25; const k = prog(t, t0, t0 + 0.5); b.visible = k < 0.98; b.scale.setScalar(0.3);
      A(b, lerp(-1.0 + i * 0.25, 0.6, k), 0.18 + 1.6 * Math.sin(k * Math.PI) + (k > 0.6 ? 0.5 * (1 - k) : 0), lerp(0.4, 0, k)); b.rotation.z = -k * 3; });
    bud(celeb, -1.05, 1.4, 0.32, T, { mood: t > td ? 'frown' : 'smile', look: [0.8, 0], rotY: 0.5, eye: t > td ? 0.6 : 1.1 });
    return shot('f6', 7.4, 1.2);
  },
  ariana(t, d, cue, T) {
    const ta = cue.ariana ?? d * 0.15, tc = cue.cloud ?? d * 0.45, tm = cue.milm ?? d * 0.8;
    ped(DUO2);
    if (t < tm - 0.5) {
      P(cloud, t, Math.min(ta - 0.2, 0.3), 1.0); A(cloud, 0, 0.9 + 0.08 * Math.sin(T * 2), 0);
      P(cloudB, t, tc - 0.3, 0.42); A(cloudB, 0, 1.2 + 0.08 * Math.sin(T * 2), 0.1); spin(cloudB, T);
      sparks.visible = true; setSparks(T, DUO2.clone().add(V(0, 1.6, 0)), 1.0, 1.0, 0xc8b0ff, 1);
      return shot('f7', 7.0, 1.4);
    }
    bars.forEach((b, i) => { const k = easeOut(prog(t, tm - 0.5 + i * 0.15, tm + 0.3 + i * 0.15)); b.visible = true; b.scale.set(1, Math.max(0.01, b.userData.h * k), 1); A(b, -0.9 + i * 0.6, 0.18, 0); });
    cloudB.visible = true; cloudB.scale.setScalar(0.25); cloudB.position.copy(bars[3].position).add(V(0, bars[3].scale.y + 0.02, 0)); spin(cloudB, T);
    if (t > tm) setConfetti(DUO2, t, tm);
    return shot('f7', 7.4, 1.4);
  },
  final(t, d, cue, T) {
    const tc = cue.comprarias ?? d * 0.2, tu = cue.cual ?? d * 0.75;
    ped(DUO2);
    [starB, glowB, cloudB].forEach((b, i) => { P(b, t, 0.1 + i * 0.15, 0.35); A(b, -1.0 + i * 0.7, 0.18, 0); spin(b, T + i); });
    bud(you, 0.95, 0.4, 0.5, T, { look: [-0.8, 0.1], rotY: -0.5, mood: 'o', mouthOpen: 0.6 });
    if (t > tu) { qMark.visible = true; qMark.scale.setScalar(Math.max(0.001, spring(prog(t, tu, tu + 0.4))) * 0.45); A(qMark, 0.95, 1.9, 0.4); qMark.rotation.y = 0.3 * Math.sin(T * 3); }
    setFlashes(T);
    return shot('f1', 7.4, 1.2);
  },
};

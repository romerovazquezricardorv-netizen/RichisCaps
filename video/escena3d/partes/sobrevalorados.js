// ================================================================== 5 PERFUMES "SOBREVALORADOS" (opinión; frascos genéricos numerados)
Object.assign(PALG, { s0: [0xffd23a, 0xff8a3a], s5: [0xff9ad0, 0xe0508a], s4: [0x7ad0ff, 0x3a8ae0], s3: [0x9ae08a, 0x3aa05a], s2: [0x5a4a7a, 0x2a1a4a], s1: [0xff6a6a, 0xc0303a], s6: [0xc89aff, 0x7a4ad8] });
const RANK = [[5, 0xc8803a], [4, 0x4a4a52], [3, 0x5aa0ff], [2, 0x2a2a30], [1, 0xe84a5a]];
const rankB = RANK.map(([n, c]) => { const b = makeBottle(c, '#' + n); scene.add(b); SETS.push(b); return b; });
const nums = RANK.map(([n]) => { const t = text3d(String(n), 1.5, new THREE.MeshStandardMaterial({ color: 0xffc83a }), 0.35); scene.add(t); SETS.push(t); return t; });
const crowd = [0x3ad07a, 0xffb03a, 0xb06bff, 0x3ad0d0].map(c => { const b = makeBuddy(c); scene.add(b); SETS.push(b); return b; });
const phone = new THREE.Group(); { const b = new THREE.Mesh(new RoundedBoxGeometry(0.9, 1.6, 0.12, 4, 0.12), new THREE.MeshStandardMaterial({ color: 0x15151c })); phone.add(b);
  const c = document.createElement('canvas'); c.width = 180; c.height = 320; const x = c.getContext('2d'); x.fillStyle = '#ff4f8a'; x.fillRect(0, 0, 180, 320); x.fillStyle = '#fff'; x.font = '900 120px Inter'; x.textAlign = 'center'; x.fillText('♥', 90, 150); x.font = '900 40px Inter'; x.fillText('VIRAL', 90, 250);
  const s = new THREE.Mesh(new THREE.PlaneGeometry(0.78, 1.4), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c) })); s.position.z = 0.065; phone.add(s); }
scene.add(phone); SETS.push(phone);
const balloon = new THREE.Mesh(new THREE.SphereGeometry(1, 28, 20), new THREE.MeshStandardMaterial({ color: 0xff7ab8 })); balloon.scale.y = 1.15; scene.add(balloon); SETS.push(balloon);
const tagPrice = cartel(['$$$']);
const tagAlt = cartel(['ALTERNATIVA', 'A AVENTUS']);
const tagLote = cartel(['LOTE 1 ≠ 2']);
const _resetS = resetWorld;
resetWorld = function () { _resetS(); rankB.forEach(b => { b.scale.setScalar(1); b.rotation.set(0, 0, 0); }); };
function countdown(i, t, d, cue, T, pal) {
  ped(DUO2);
  const n = nums[i]; const pn = spring(prog(t, 0, 0.35)); n.visible = t < 1.4; n.scale.setScalar(Math.max(0.001, pn) * (1 + 0.1 * Math.sin(T * 6))); n.position.copy(DUO2).add(V(0, 1.6, 0.8));
  const b = rankB[i]; const pb = spring(prog(t, 0.9, 1.3)); b.visible = pb > 0.01; b.scale.setScalar(Math.max(0.001, pb) * 0.7); b.position.copy(DUO2).add(V(0, 0.18, 0)); b.rotation.y = 0.3 * Math.sin(T);
  return b;
}
const SCENES = {
  gancho(t, d, cue, T) {
    const ts = cue.sobre ?? d * 0.5;
    ped(DUO2);
    rankB.forEach((b, i) => { const p = spring(prog(t, 0.2 + i * 0.18, 0.6 + i * 0.18)); b.visible = p > 0.01; b.scale.setScalar(Math.max(0.001, p) * 0.42); b.position.copy(DUO2).add(V(-1.6 + i * 0.8, 0.18, 0)); b.rotation.y = 0.2 * Math.sin(T + i); });
    if (t > ts) { qMark.visible = true; qMark.scale.setScalar(Math.max(0.001, spring(prog(t, ts, ts + 0.4)) * 0.6)); qMark.position.copy(DUO2).add(V(0, 2.4, 0.3)); qMark.rotation.y = 0.3 * Math.sin(T * 3); }
    return { ...sh(DUO2, V(0, 2.0, 7.4), V(0, 1.1, 0)), pal: 's0' };
  },
  c5(t, d, cue, T) {
    const tv = cue.viral ?? d * 0.5, te = cue.expect ?? d * 0.85;
    const b = countdown(0, t, d, cue, T);
    if (t > tv - 0.2 && t < te - 0.3) { phone.visible = true; phone.position.copy(DUO2).add(V(-1.3, 1.6, 0.6)); phone.scale.setScalar(Math.max(0.001, spring(prog(t, tv - 0.2, tv + 0.2)))); phone.rotation.z = 0.15 * Math.sin(T * 4); setHearts(t, phone.position.clone().add(V(0, 0.9, 0)), tv, 5, 0.6); }
    if (t > te - 0.6) { const inflate = easeOut(prog(t, te - 0.6, te)), deflate = easeIO(prog(t, te + 0.4, te + 1.2)); balloon.visible = true; balloon.scale.set(1, 1.15, 1).multiplyScalar(Math.max(0.05, 1.4 * inflate * (1 - 0.85 * deflate))); balloon.position.copy(DUO2).add(V(-1.0, 2.4, -0.3)); }
    return { ...sh(DUO2, V(0, 2.4, 8.0), V(0, 1.5, 0)), pal: 's5' };
  },
  c4(t, d, cue, T) {
    const ta = cue.alt ?? d * 0.6, tb = cue.barato ?? d * 0.88;
    const b = countdown(1, t, d, cue, T);
    if (t > ta - 0.2) { tagAlt.visible = true; tagAlt.position.copy(DUO2).add(V(0, 2.7, 0.4)); tagAlt.scale.setScalar(Math.max(0.001, spring(prog(t, ta - 0.2, ta + 0.2))) * 1.1); }
    if (t > tb - 0.2) { tagPrice.visible = true; tagPrice.position.copy(DUO2).add(V(1.2, 1.4, 0.6)); tagPrice.scale.setScalar(Math.max(0.001, spring(prog(t, tb - 0.2, tb + 0.2))) * 0.8); tagPrice.rotation.z = -0.2; }
    return { ...sh(DUO2, V(0, 2.4, 8.0), V(0, 1.5, 0)), pal: 's4' };
  },
  c3(t, d, cue, T) {
    const tt = cue.todos ?? d * 0.8;
    const b = countdown(2, t, d, cue, T);
    const people = [you, pal, ...crowd];
    if (t > tt - 0.6) people.forEach((p, i) => { const k = spring(prog(t, tt - 0.6 + i * 0.08, tt - 0.2 + i * 0.08)); p.visible = k > 0.01; p.scale.setScalar(Math.max(0.001, k) * 0.5);
      const a = -0.9 + i * 0.36; p.position.copy(DUO2).add(V(Math.sin(a) * 2.1, 0, Math.cos(a) * 1.0 + 0.4)); p.userData.nose.visible = true;
      setBuddy(p, { hop: hopF(T, 3 + i * 0.3, 0.06), mood: 'smile', eye: 1.1, look: [-Math.sin(a), 0.3], blink: 0.35, rotY: -a * 1.2 }); });
    return { ...sh(DUO2, V(0, 2.6, 8.6), V(0, 1.3, 0)), pal: 's3' };
  },
  c2(t, d, cue, T) {
    const tp = cue.precio ?? d * 0.35, tl = cue.lote ?? d * 0.6, tc = cue.clones ?? d * 0.85;
    const b = countdown(3, t, d, cue, T);
    if (t > tp - 0.2) { tagPrice.visible = true; tagPrice.position.copy(DUO2).add(V(-1.2, 2.2, 0.5)); tagPrice.scale.setScalar(Math.max(0.001, spring(prog(t, tp - 0.2, tp + 0.2))) * 0.7); tagPrice.rotation.z = 0.15; }
    if (t > tl - 0.2) { tagLote.visible = true; tagLote.position.copy(DUO2).add(V(1.2, 2.2, 0.5)); tagLote.scale.setScalar(Math.max(0.001, spring(prog(t, tl - 0.2, tl + 0.2))) * 0.7); tagLote.rotation.z = -0.15; }
    if (t > tc - 0.3) { [blueB, pinkB, uniB].forEach((c, i) => { c.visible = true; c.scale.setScalar(0.35 * Math.max(0.001, spring(prog(t, tc - 0.3 + i * 0.1, tc + i * 0.1)))); c.position.copy(DUO2).add(V(-1.2 + i * 1.2, 0.18, 1.3)); c.userData.liquid.material.color.set(0x2a2a30); }); }
    return { ...sh(DUO2, V(0, 2.4, 8.2), V(0, 1.5, 0)), pal: 's2' };
  },
  c1(t, d, cue, T) {
    const tc = cue.caro ?? d * 0.55, te = cue.esquina ?? d * 0.85;
    const b = countdown(4, t, d, cue, T);
    if (t > tc - 0.2) { tagPrice.visible = true; tagPrice.position.copy(DUO2).add(V(0, 2.6, 0.5)); tagPrice.scale.setScalar(Math.max(0.001, spring(prog(t, tc - 0.2, tc + 0.2))) * 1.0); setBillRain(DUO2, t, tc - 0.2); }
    if (t > te - 0.3) [you, pal, ...crowd].forEach((p, i) => { const k = spring(prog(t, te - 0.3 + i * 0.06, te + 0.1 + i * 0.06)); p.visible = k > 0.01; p.scale.setScalar(Math.max(0.001, k) * 0.45);
      const a = i / 6 * Math.PI * 2; p.position.copy(DUO2).add(V(Math.cos(a) * 2.2, 0, Math.sin(a) * 1.1 + 0.3)); setBuddy(p, { hop: hopF(T, 3, 0.05), mood: 'smile', eye: 1.1, look: [0, 0], blink: 0.35, rotY: -a + Math.PI / 2 }); });
    return { ...sh(DUO2, V(0, 2.8, 8.8), V(0, 1.4, 0)), pal: 's1' };
  },
  final(t, d, cue, T) {
    ped(DUO2);
    rankB.forEach((b, i) => { b.visible = true; b.scale.setScalar(0.42); b.position.copy(DUO2).add(V(-1.6 + i * 0.8, 0.18, 0)); b.rotation.y = 0.2 * Math.sin(T + i); });
    qMark.visible = true; qMark.scale.setScalar(Math.max(0.001, spring(prog(t, 0.2, 0.6)) * 0.7)); qMark.position.copy(DUO2).add(V(0, 2.4, 0.3)); qMark.rotation.y = 0.3 * Math.sin(T * 3);
    return { ...sh(DUO2, V(0, 2.0, 7.4), V(0, 1.2, 0)), pal: 's6' };
  },
};


// ================================================================== ¿POR QUÉ EL PERFUME ES TAN CARO?
Object.assign(PALG, { caro1: [0xffd23a, 0xff8a3a], caro2: [0x7ad0ff, 0x3a8ae0], caro3: [0x9ae08a, 0x3aa05a], caro4: [0xff9ad0, 0xe0508a], caro5: [0xc89aff, 0x7a4ad8] });
// gráfica de pastel: [nombre, fracción, color]
function fitTag(lines) { const c = document.createElement('canvas'); c.width = 320; c.height = 180; const x = c.getContext('2d');
  x.fillStyle = '#000'; x.fillRect(10, 12, 306, 164); x.fillStyle = '#fff'; x.fillRect(0, 0, 306, 164); x.strokeStyle = '#000'; x.lineWidth = 8; x.strokeRect(4, 4, 298, 156);
  x.fillStyle = '#111'; x.textAlign = 'center'; x.textBaseline = 'middle';
  lines.forEach((l, i) => { let f = 62; do { x.font = `900 ${f}px Inter, Arial, sans-serif`; f -= 2; } while (x.measureText(l).width > 270); x.fillText(l, 153, i ? 118 : 56); });
  return new THREE.CanvasTexture(c); }
const SLICES = [['ESENCIA', 0.05, 0xffd23a], ['FRASCO Y CAJA', 0.15, 0x5aa0ff], ['TIENDA', 0.38, 0x3ad07a], ['PUBLICIDAD', 0.30, 0xff5fa0], ['MARCA', 0.12, 0xb08aff]];
const pie = new THREE.Group();
const sliceMeshes = []; { let a0 = 0; SLICES.forEach(([name, f, col]) => { const th = f * Math.PI * 2;
    const g = new THREE.CylinderGeometry(2.0, 2.0, 0.55, 64, 1, false, a0, th); const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ color: col }));
    m.userData.mid = a0 + th / 2; pie.add(m); sliceMeshes.push(m);
    const lab = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.84), new THREE.MeshBasicMaterial({ map: fitTag([name.split(' ')[0], Math.round(f * 100) + ' %']), transparent: true }));
    m.userData.lab = lab; scene.add(lab); a0 += th; }); }
scene.add(pie);
const coin100 = new THREE.Group(); { const c = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.22, 48), new THREE.MeshStandardMaterial({ color: 0xffc83a })); c.rotation.x = Math.PI / 2; coin100.add(c);
  const t = text3d('100', 0.55, new THREE.MeshStandardMaterial({ color: 0xa8780a }), 0.06); t.position.set(0, -0.28, 0.1); coin100.add(t); }
scene.add(coin100);
const coin5 = new THREE.Group(); { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.12, 40), new THREE.MeshStandardMaterial({ color: 0xffc83a })); c.rotation.x = Math.PI / 2; coin5.add(c);
  const t = text3d('5', 0.4, new THREE.MeshStandardMaterial({ color: 0xa8780a }), 0.05); t.position.set(0, -0.2, 0.05); coin5.add(t); }
scene.add(coin5);
const alcB = makeBottle(0xeef6ff, 'ALCOHOL'); scene.add(alcB);
const essDrop = new THREE.Mesh(new THREE.SphereGeometry(0.22, 24, 16), new THREE.MeshStandardMaterial({ color: 0xffb030 })); essDrop.scale.y = 1.3; scene.add(essDrop);
const shades = new THREE.Group(); { const m = new THREE.MeshStandardMaterial({ color: 0x111111 }); [-1, 1].forEach(s => { const g = new THREE.Mesh(new RoundedBoxGeometry(0.42, 0.24, 0.08, 3, 0.06), m); g.position.set(s * 0.27, 1.62, 0.72); shades.add(g); });
  const br = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.04, 0.04), m); br.position.set(0, 1.66, 0.74); shades.add(br); }
const cheapB = makeBottle(0xffe08a, '$'), goodB = makeBottle(0xffa94d, '$$$'); scene.add(cheapB, goodB);
SETS.push(pie, ...sliceMeshes.map(m => m.userData.lab), coin100, coin5, alcB, essDrop, cheapB, goodB);
const _resetX = resetWorld;
resetWorld = function () { _resetX(); pal.userData.body.remove(shades); sliceMeshes.forEach(m => { m.position.set(0, 0, 0); m.scale.setScalar(1); }); [alcB, cheapB, goodB].forEach(b => b.scale.setScalar(1)); };

const SCENES = {
  gancho(t, d, cue, T) {
    const tc = cue.cien ?? d * 0.3, t5 = cue.cinco ?? d * 0.85;
    ped(DUO2);
    const p1 = spring(prog(t, tc - 0.3, tc + 0.2));
    coin100.visible = true; coin100.scale.setScalar(Math.max(0.001, p1)); coin100.position.copy(DUO2).add(V(t > t5 - 0.3 ? -1.0 : 0, 2.2 + 0.1 * Math.sin(T * 2), 0)); coin100.rotation.y = 0.3 * Math.sin(T * 1.5);
    const p5 = spring(prog(t, t5 - 0.3, t5 + 0.1));
    coin5.visible = p5 > 0.01; coin5.scale.setScalar(Math.max(0.001, p5)); coin5.position.copy(DUO2).add(V(0.9, 2.7, 0.6)); coin5.rotation.y = 0.3 * Math.sin(T * 2);
    you.scale.setScalar(0.7); you.position.copy(DUO2).add(V(1.6, 0, 1.0));
    pose(you, { hop: hopF(T, 3, 0.05), mood: t > t5 ? 'o' : 'smile', mouthOpen: 1.3, eye: t > t5 ? 1.45 : 1.1, look: [-0.7, 0.6], blink: 1, brow: t > t5 ? 1 : 0, rotY: -0.5, armL: t > t5 ? 2.3 : 0.3, armR: t > t5 ? 2.3 : 0.3 });
    return { ...sh(DUO2, V(0, 2.4, 8.6), V(0, 1.6, 0)), pal: 'caro1' };
  },
  liquido(t, d, cue, T) {
    const ta = cue.alcohol ?? d * 0.25, te = cue.esencia ?? d * 0.6;
    ped(DUO2);
    alcB.visible = true; alcB.scale.setScalar(0.95 * Math.max(0.001, spring(prog(t, ta - 0.3, ta + 0.2)))); alcB.position.copy(DUO2).add(V(-0.3, 0.18, 0)); alcB.rotation.y = 0.2 * Math.sin(T);
    const pe = spring(prog(t, te - 0.2, te + 0.3));
    essDrop.visible = pe > 0.01; essDrop.scale.set(Math.max(0.001, pe), 1.3 * Math.max(0.001, pe), Math.max(0.001, pe)); essDrop.position.copy(DUO2).add(V(0.85, 2.2 + 0.1 * Math.sin(T * 3), 0.6));
    you.scale.setScalar(0.65); you.position.copy(DUO2).add(V(1.6, 0, 0.9)); you.userData.nose.visible = t > te;
    pose(you, { hop: hopF(T, 3, 0.05), mood: 'o', mouthOpen: 0.8, eye: 1.2, look: [-0.8, 0.5], blink: 1, rotY: -0.6 });
    return { ...sh(DUO2, V(0.2, 2.4, 8.2), V(0.2, 1.7, 0)), pal: 'caro2' };
  },
  desglose(t, d, cue, T) {
    const cuesS = [cue.dinero ?? 0.4, cue.frasco ?? d * 0.3, cue.tienda ?? d * 0.45, cue.publi ?? d * 0.68, cue.publi ?? d * 0.68];
    ped(DUO2);
    pie.visible = true; pie.scale.setScalar(0.85); pie.position.copy(DUO2).add(V(0, 0.4, 0)); pie.rotation.y = -0.4 + 0.15 * Math.sin(T * 0.6);
    const order = [0, 1, 2, 3, 4], when = [cuesS[0], cuesS[1], cuesS[2], cuesS[3], cuesS[0]];
    sliceMeshes.forEach((m, i) => { const pop = spring(prog(t, when[i], when[i] + 0.4)); const hl = i === 3 ? spring(prog(t, cuesS[3], cuesS[3] + 0.4)) : i === 1 ? spring(prog(t, cuesS[1], cuesS[1] + 0.4)) * (1 - prog(t, cuesS[2], cuesS[2] + 0.3)) : i === 2 ? spring(prog(t, cuesS[2], cuesS[2] + 0.4)) * (1 - prog(t, cuesS[3], cuesS[3] + 0.3)) : i === 0 ? 0.6 : 0;
      m.position.set(Math.sin(m.userData.mid) * 0.45 * hl, 0.12 * hl, Math.cos(m.userData.mid) * 0.45 * hl); m.scale.set(1, 1 + 0.35 * hl, 1);
      const lab = m.userData.lab; lab.visible = t > when[i]; lab.scale.setScalar(Math.max(0.001, pop) * (i === 3 ? 0.9 : 0.68));
      const wp = V(Math.sin(m.userData.mid + pie.rotation.y) * 2.0, 1.25 + (i % 2) * 0.35, Math.cos(m.userData.mid + pie.rotation.y) * 2.0 + 0.3); wp.x = Math.max(-1.25, Math.min(1.25, wp.x)); lab.position.copy(DUO2).add(wp); });
    // famosos: la tele y tu amiga de celebridad
    if (t > (cue.famosos ?? d * 0.9) - 0.3) { tv.visible = true; tv.position.copy(DUO2).add(V(0, 4.2, -1.2)); tv.scale.setScalar(Math.max(0.001, spring(prog(t, cue.famosos - 0.3, cue.famosos + 0.2)) * 0.75)); }
    return { ...sh(DUO2, V(0, 5.0, 9.8), V(0, 1.5, 0)), pal: 'caro3' };
  },
  pero(t, d, cue, T) {
    const tm = cue.mejor ?? d * 0.25, tc = cue.cuesta ?? d * 0.55, td = cue.dura ?? d * 0.8;
    ped(DUO2);
    [cheapB, goodB].forEach((b, i) => { b.visible = true; b.scale.setScalar(0.62); b.position.copy(DUO2).add(V(i ? 0.85 : -0.85, 0.18, 0)); b.rotation.y = i ? -0.2 : 0.2; });
    if (t > tm) { xMark.visible = true; xMark.position.copy(cheapB.position).add(V(0, 2.2, 0.4)); xMark.scale.setScalar(Math.max(0.001, spring(prog(t, tm, tm + 0.3)) * 0.55)); }
    if (t > tc) { check.visible = true; check.position.copy(goodB.position).add(V(0, 2.3, 0.4)); check.scale.setScalar(Math.max(0.001, spring(prog(t, tc, tc + 0.3)) * 0.6)); }
    if (t > td) { clock.visible = true; clock.position.copy(DUO2).add(V(0.85, 3.2, 0.3)); clock.scale.setScalar(0.45); clock.userData.hand.rotation.z = -T * 6; setHearts(t, goodB.position.clone().add(V(0, 2.4, 0.3)), td, 4, 0.6); }
    return { ...sh(DUO2, V(0, 2.5, 8.0), V(0, 1.6, 0)), pal: 'caro4' };
  },
  final(t, d, cue, T) {
    const ta = cue.anuncio ?? d * 0.5, tq = cue.cuanto ?? d * 0.8;
    ped(DUO2);
    you.scale.setScalar(0.8); you.position.copy(DUO2).add(V(-0.7, 0, 0.5)); youBottle.visible = true;
    pose(you, { hop: hopF(T, 3, 0.05), mood: t > ta ? 'o' : 'smile', mouthOpen: 1.1, eye: t > ta ? 1.35 : 1.1, look: [0.8, 0.6], blink: 1, rotY: 0.4, armR: 1.4 });
    pal.scale.setScalar(0.75); pal.position.copy(DUO2).add(V(1.0, 0, 0.2)); pal.userData.body.add(shades);
    pal.visible = t > ta - 0.2; if (pal.visible) pose(pal, { hop: hopF(T, 4, 0.08), mood: 'smile', eye: 1.1, look: [-0.5, 0], blink: 1, rotY: -0.4, armR: 2.4, armL: 2.0 });
    if (t > ta - 0.2) { tv.visible = true; tv.position.copy(DUO2).add(V(0.4, 3.5, -1.0)); tv.scale.setScalar(Math.max(0.001, spring(prog(t, ta - 0.2, ta + 0.2)) * 0.8)); sparks.visible = true; setSparks(T, pal.position.clone().add(V(0, 1.4, 0)), 0.9, 1.6, 0xffd23a, 1); }
    qMark.visible = t > tq; qMark.scale.setScalar(Math.max(0.001, spring(prog(t, tq, tq + 0.4)) * 0.6)); qMark.position.copy(you.position).add(V(0, 2.5, 0.2)); qMark.rotation.y = 0.3 * Math.sin(T * 3);
    return { ...sh(DUO2, V(0, 2.5, 8.6), V(0.2, 1.8, 0)), pal: 'caro5' };
  },
};


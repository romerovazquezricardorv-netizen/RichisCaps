// ================================================================== ¿CUÁNTO CUESTA FABRICAR UN PERFUME? (línea de fábrica)
Object.assign(PALG, { f1: [0x7ad0ff, 0x3a8ae0], f2: [0xffd23a, 0xff8a3a], f3: [0x9ae08a, 0x3aa05a], f4: [0xff9ad0, 0xe0508a], f5: [0xc89aff, 0x7a4ad8], f6: [0xffd23a, 0xff8a3a] });
const belt = new THREE.Group(); const beltTop = (() => { const c = document.createElement('canvas'); c.width = 256; c.height = 32; const x = c.getContext('2d'); x.fillStyle = '#2a2a32'; x.fillRect(0, 0, 256, 32); x.fillStyle = '#3a3a46'; for (let i = 0; i < 8; i++) x.fillRect(i * 32, 0, 16, 32); const t = new THREE.CanvasTexture(c); t.wrapS = THREE.RepeatWrapping; t.repeat.set(6, 1); return t; })();
{ const top = new THREE.Mesh(new THREE.BoxGeometry(9, 0.25, 1.4), new THREE.MeshStandardMaterial({ map: beltTop })); top.position.y = 0.9; belt.add(top);
  const side = new THREE.Mesh(new THREE.BoxGeometry(9, 0.5, 1.5), new THREE.MeshStandardMaterial({ color: 0xffb03a })); side.position.y = 0.6; belt.add(side);
  [-4, 0, 4].forEach(x => [-0.6, 0.6].forEach(z => { const l = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.4, 0.15), new THREE.MeshStandardMaterial({ color: 0x5a5a66 })); l.position.set(x, 0.2, z); belt.add(l); })); }
scene.add(belt); SETS.push(belt);
const fBottle = makeBottle(0xffc46b, 'PARFUM'); scene.add(fBottle); SETS.push(fBottle);
const beaker = new THREE.Group(); { const b = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 1.2, 28, 1, true), new THREE.MeshStandardMaterial({ color: 0xeaf6ff, transparent: true, opacity: 0.45, side: THREE.DoubleSide })); b.position.y = 0.6; beaker.add(b);
  const ess = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.25, 28), new THREE.MeshStandardMaterial({ color: 0xffb030 })); ess.position.y = 0.15; beaker.add(ess);
  const alc = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.7, 28), new THREE.MeshStandardMaterial({ color: 0xdff2ff, transparent: true, opacity: 0.6 })); alc.position.y = 0.62; beaker.add(alc); }
scene.add(beaker); SETS.push(beaker);
const pkg = new THREE.Group(); { const m = new THREE.MeshStandardMaterial({ color: 0x15151c }); const back = new THREE.Mesh(new THREE.BoxGeometry(1.9, 2.9, 0.08), m); back.position.set(0, 1.45, -0.6); pkg.add(back);
  [-1, 1].forEach(s => { const sd = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.9, 1.2), m); sd.position.set(s * 0.95, 1.45, 0); pkg.add(sd); });
  const front = new THREE.Mesh(new THREE.BoxGeometry(1.9, 2.9, 0.08), new THREE.MeshStandardMaterial({ map: labelTex('PARFUM', '#15151c', '#d8ab55') })); front.position.set(0, 1.45, 0.6); pkg.add(front); pkg.userData.front = front; }
scene.add(pkg); SETS.push(pkg);
const cntCv = document.createElement('canvas'); cntCv.width = 512; cntCv.height = 200; const cntTex = new THREE.CanvasTexture(cntCv);
function setCounter(txt) { const x = cntCv.getContext('2d'); x.fillStyle = '#0c1a12'; x.fillRect(0, 0, 512, 200); x.fillStyle = '#5aff8a'; x.font = '800 112px Inter, Arial, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(txt, 256, 104); cntTex.needsUpdate = true; }
const counter = new THREE.Group(); { const box = new THREE.Mesh(new RoundedBoxGeometry(2.6, 1.1, 0.3, 4, 0.08), new THREE.MeshStandardMaterial({ color: 0x2a3038 })); counter.add(box);
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 0.9), new THREE.MeshBasicMaterial({ map: cntTex })); scr.position.z = 0.16; counter.add(scr); }
scene.add(counter); SETS.push(counter);
const tag100 = cartel(['$100']);
const tagsEnd = [['TIENDA'], ['PUBLICIDAD'], ['GANANCIA']].map(l => cartel(l, 1.4, 0.75));
const tagName = cartel(['EL NOMBRE'], 2.2, 1.2);
const _resetFab = resetWorld;
resetWorld = function () { _resetFab(); fBottle.scale.setScalar(1); fBottle.userData.liquid.scale.y = 1; fBottle.userData.cap.visible = true; beaker.rotation.set(0, 0, 0); };
const lerpMoney = (a, b, k) => '$' + Math.round(lerp(a, b, clamp(k)));
function factory(T) { lightAt(DUO2); ground.visible = true; belt.visible = true; belt.position.copy(DUO2); beltTop.offset.x = -T * 0.4; counter.visible = true; counter.position.copy(DUO2).add(V(0, 3.1, -1.2)); counter.scale.setScalar(0.7); }
const SCENES = {
  gancho(t, d, cue, T) {
    const tc = cue.cien ?? d * 0.8;
    factory(T); setCounter('$ ?');
    fBottle.visible = true; fBottle.scale.setScalar(0.6); fBottle.position.copy(DUO2).add(V(0, 1.03, 0)); fBottle.rotation.y = 0.3 * Math.sin(T);
    tag100.visible = t > tc - 0.2; tag100.position.copy(DUO2).add(V(1.0, 2.5, 0.5)); tag100.scale.setScalar(Math.max(0.001, spring(prog(t, tc - 0.2, tc + 0.2)))); tag100.rotation.z = -0.15;
    return { ...sh(DUO2, V(0, 3.0, 8.4), V(0, 2.0, 0)), pal: 'f1' };
  },
  liquido(t, d, cue, T) {
    const tl = cue.liquido ?? d * 0.1, te = cue.esencia ?? d * 0.4, tt = cue.tres ?? d * 0.9;
    factory(T); setCounter(t > tt - 0.2 ? '$3 – $10' : '$0');
    fBottle.visible = true; fBottle.scale.setScalar(0.6); fBottle.position.copy(DUO2).add(V(0.4, 1.03, 0)); fBottle.userData.cap.visible = false;
    fBottle.userData.liquid.scale.y = Math.max(0.02, easeIO(prog(t, te, tt)));
    beaker.visible = true; beaker.position.copy(DUO2).add(V(-0.9, 1.6, 0)); beaker.rotation.z = -0.9 * easeOut(prog(t, te - 0.3, te + 0.2)) * (1 - prog(t, tt, tt + 0.4));
    if (t > te && t < tt) setMist(t, DUO2.clone().add(V(-0.2, 2.3, 0)), V(0.6, -1, 0).normalize(), te, [1, 0.8, 0.4]);
    return { ...sh(DUO2, V(0, 3.0, 7.6), V(0, 2.0, 0)), pal: 'f2' };
  },
  frasco(t, d, cue, T) {
    const td = cue.dolar ?? d * 0.35, tp = cue.tapa ?? d * 0.65, to = cue.ocho ?? d * 0.9;
    factory(T); setCounter(t > to - 0.2 ? '+ $8' : t > td - 0.2 ? '+ $1' : '$10');
    fBottle.visible = true; fBottle.scale.setScalar(0.65); fBottle.position.copy(DUO2).add(V(0, 1.03, 0)); fBottle.rotation.y = 0.3 * Math.sin(T);
    const capOn = t > tp - 0.2; fBottle.userData.cap.visible = capOn;
    if (capOn) fBottle.userData.cap.position.y = 2.68 + 1.5 * (1 - easeOut(prog(t, tp - 0.2, tp + 0.2)));
    if (t > to - 0.2) { sparks.visible = true; setSparks(T, DUO2.clone().add(V(0, 2.0, 0)), 0.9, 1.4, 0xffd23a, 1); }
    return { ...sh(DUO2, V(0, 3.0, 7.2), V(0, 2.1, 0)), pal: 'f3' };
  },
  caja(t, d, cue, T) {
    const tc = cue.caja ?? 0.2;
    factory(T); setCounter(t > (cue.mas ?? d * 0.8) - 0.2 ? '+ $3' : '$18');
    fBottle.visible = true; fBottle.scale.setScalar(0.65); fBottle.position.copy(DUO2).add(V(0, 1.03, 0));
    const k = easeOut(prog(t, tc, tc + 0.8)); pkg.visible = true; pkg.position.copy(DUO2).add(V(0, 1.03 + 3 * (1 - k), 0)); pkg.scale.setScalar(0.7);
    return { ...sh(DUO2, V(0, 3.0, 7.6), V(0, 2.1, 0)), pal: 'f4' };
  },
  total(t, d, cue, T) {
    const tv = cue.veinte ?? d * 0.3, tt = cue.tienda ?? d * 0.7, tp = cue.publi ?? d * 0.78, tg = cue.ganancia ?? d * 0.88;
    factory(T); setCounter(t > tv - 0.2 ? '≈ $20' : lerpMoney(0, 20, prog(t, 0, tv)));
    pkg.visible = true; pkg.scale.setScalar(0.55); pkg.position.copy(DUO2).add(V(-0.8, 1.03, 0));
    tag100.visible = true; tag100.position.copy(DUO2).add(V(0.9, 2.75, 0.5)); tag100.scale.setScalar(0.75); tag100.rotation.z = -0.1;
    [tt, tp, tg].forEach((tm, i) => { const g = tagsEnd[i]; const p = spring(prog(t, tm - 0.2, tm + 0.2)); g.visible = p > 0.01; g.scale.setScalar(Math.max(0.001, p) * 0.8); g.position.copy(DUO2).add(V(0.9, 1.9 - i * 0.55, 0.7)); });
    return { ...sh(DUO2, V(0, 3.0, 8.2), V(0, 2.0, 0)), pal: 'f5' };
  },
  final(t, d, cue, T) {
    const tn = cue.nombre ?? d * 0.3, ts = cue.sorprende ?? d * 0.6;
    ped(DUO2);
    fBottle.visible = true; fBottle.scale.setScalar(0.7); fBottle.position.copy(DUO2).add(V(0, 0.18, 0)); fBottle.rotation.y = 0.3 * Math.sin(T);
    tagName.visible = t > tn - 0.2; tagName.position.copy(DUO2).add(V(0, 2.8, 0.5)); tagName.scale.setScalar(Math.max(0.001, spring(prog(t, tn - 0.2, tn + 0.2))));
    if (t > tn) { sparks.visible = true; setSparks(T, DUO2.clone().add(V(0, 2.6, 0.4)), 1.4, 1.0, 0xffd23a, 1); }
    qMark.visible = t > ts; qMark.scale.setScalar(Math.max(0.001, spring(prog(t, ts, ts + 0.4)) * 0.6)); qMark.position.copy(DUO2).add(V(1.4, 1.6, 0.4)); qMark.rotation.y = 0.3 * Math.sin(T * 3);
    return { ...sh(DUO2, V(0, 2.4, 7.6), V(0, 1.6, 0)), pal: 'f6' };
  },
};


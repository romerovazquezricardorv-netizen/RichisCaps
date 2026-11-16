// ------------------------------------------------------------------ utilería compartida (tanda 3)
const P = (o, t, t0, s = 1, dur = 0.4) => { const k = spring(prog(t, t0, t0 + dur)); o.visible = k > 0.01; o.scale.setScalar(Math.max(0.001, k) * s); return k; };
const A = (o, x, y, z, c = DUO2) => { o.position.copy(c).add(V(x, y, z)); return o; };
const shot = (pal, z = 7.6, ty = 1.4, y = 2.3, x = 0) => ({ ...sh(DUO2, V(x, y, z), V(x * 0.9, ty, 0)), pal });
const splitShot = (pt, pb, z = 6.8, ty = 1.0) => ({ split: true, top: { ...half(DUO2, z, ty), pal: pt }, bot: { ...half(DUO3, z, ty), pal: pb }, pos: DUO2.clone().add(V(0, 2, 7)), tgt: DUO2.clone(), fov: 30 });
function bud(b, x, z, s, T, o = {}, c = DUO2) { b.visible = true; b.scale.setScalar(s); A(b, x, 0.18, z, c); setBuddy(b, { hop: hopF(T, 3, 0.05), mood: 'smile', eye: 1.1, look: [0, 0.2], blink: blinkAt(T, 0.3), ...o }); return b; }
function add(o) { scene.add(o); SETS.push(o); return o; }
function bigT(str, color = 0xffc83a, size = 1.0) { return add(text3d(str, size, new THREE.MeshStandardMaterial({ color, roughness: 0.4 }), size * 0.28)); }
function bottleG(color, label = 'PARFUM') { const b = makeBottle(color, label); return add(b); }
function spin(o, T, a = 0.3, f = 1) { o.rotation.y = a * Math.sin(T * f); }
function buddyG(color) { return add(makeBuddy(color)); }
// granos de café
function beanG() { const g = new THREE.Group(); const m = new THREE.MeshStandardMaterial({ color: 0x5a3218, roughness: 0.6 }); const b = new THREE.Mesh(new THREE.SphereGeometry(0.16, 14, 10), m); b.scale.set(1, 0.65, 1.35); g.add(b);
  const l = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.02, 0.38), new THREE.MeshStandardMaterial({ color: 0x2a160a })); l.position.y = 0.1; g.add(l); return g; }
// tira de papel (mouillette)
function stripG(color = 0xffffff) { const g = new THREE.Group(); const s = new THREE.Mesh(new THREE.BoxGeometry(0.22, 1.4, 0.02), new THREE.MeshStandardMaterial({ color })); s.position.y = 0.7; g.add(s);
  const tip = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.3, 0.025), new THREE.MeshStandardMaterial({ color: 0xffd27a })); tip.position.y = 1.25; g.add(tip); return add(g); }
// flecha
function arrowG(color = 0xff3a4a) { const g = new THREE.Group(); const m = new THREE.MeshStandardMaterial({ color }); const s = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.0, 0.2), m); s.position.y = 0.5; g.add(s);
  const h = new THREE.Mesh(new THREE.ConeGeometry(0.42, 0.5, 4), m); h.position.y = 1.25; h.rotation.y = Math.PI / 4; g.add(h); return add(g); }
// sol y copo
const sunG = add((() => { const g = new THREE.Group(); const m = new THREE.MeshStandardMaterial({ color: 0xffd23a }); g.add(new THREE.Mesh(new THREE.SphereGeometry(0.55, 24, 16), m));
  for (let i = 0; i < 10; i++) { const r = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.4, 6), m); const a = i / 10 * Math.PI * 2; r.position.set(Math.cos(a) * 0.8, Math.sin(a) * 0.8, 0); r.rotation.z = a - Math.PI / 2; g.add(r); } return g; })());
const snowG = add((() => { const g = new THREE.Group(); const m = new THREE.MeshStandardMaterial({ color: 0xbfe6ff }); for (let i = 0; i < 3; i++) { const b = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.12, 0.12), m); b.rotation.z = i * Math.PI / 3; g.add(b);
  [-1, 1].forEach(s => { const t = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.08, 0.08), m); t.position.set(s * 0.42, 0, 0); t.rotation.z = s * 0.8; b.add(t); }); } return g; })());
// cartel con texto en 3D sobre poste
function signPost(lines, w = 1.8, h = 0.9) { const g = new THREE.Group(); const c = cartel(lines, w, h); SETS.splice(SETS.indexOf(c), 1); scene.remove(c); c.position.y = 1.6; g.add(c);
  const p = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.3, 8), new THREE.MeshStandardMaterial({ color: 0x8a5a34 })); p.position.y = 0.6; g.add(p); return add(g); }
// moléculas estilo "bolitas"
function moleculeG(cols = [0x3ad0a0, 0xff6fb0, 0xffd23a, 0x7ad0ff]) { const g = new THREE.Group(); const pts = [[0, 0, 0], [0.5, 0.3, 0], [-0.5, 0.25, 0.1], [0.1, -0.5, 0.2], [0.6, -0.3, -0.2]];
  pts.forEach((p, i) => { const s = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 12), new THREE.MeshStandardMaterial({ color: cols[i % cols.length] })); s.position.set(...p); g.add(s);
    if (i) { const a = new THREE.Vector3(...pts[0]), b = new THREE.Vector3(...p); const l = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, a.distanceTo(b), 8), new THREE.MeshStandardMaterial({ color: 0xdddddd }));
      l.position.copy(a.clone().add(b).multiplyScalar(0.5)); l.lookAt(b); l.rotateX(Math.PI / 2); g.add(l); } }); return add(g); }

function flagG(cols, vertical) { const g = new THREE.Group(); cols.forEach((c, i) => { const p = new THREE.Mesh(new THREE.PlaneGeometry(vertical ? 0.4 : 1.2, vertical ? 0.8 : 0.27), new THREE.MeshBasicMaterial({ color: c, side: THREE.DoubleSide }));
  if (vertical) p.position.x = (i - 1) * 0.4; else p.position.y = (1 - i) * 0.27; p.position.y += vertical ? 0 : 0; g.add(p); });
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 2.0, 8), new THREE.MeshStandardMaterial({ color: 0xc0c0c8 })); pole.position.set(vertical ? -0.65 : -0.65, -0.6, 0); g.add(pole); return add(g); }
const gavel = add((() => { const g = new THREE.Group(); const m = new THREE.MeshStandardMaterial({ color: 0x8a5a34 }); const h = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.6, 14), m); h.rotation.z = Math.PI / 2; h.position.y = 0.9; g.add(h);
  const st = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.9, 8), m); st.position.y = 0.45; g.add(st); return g; })());
const block = add(new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.5, 0.15, 20), new THREE.MeshStandardMaterial({ color: 0x6a3a1a })));

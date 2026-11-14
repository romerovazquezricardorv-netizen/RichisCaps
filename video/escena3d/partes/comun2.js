// ------------------------------------------------------------------ utilería compartida (videos de marcas)
function cartel(lines, w = 1.6, h = 0.9, font = 62) { const c = document.createElement('canvas'); c.width = 400; c.height = 220; const x = c.getContext('2d');
  x.fillStyle = '#000'; x.fillRect(10, 12, 390, 208); x.fillStyle = '#fff'; x.fillRect(0, 0, 390, 206); x.strokeStyle = '#000'; x.lineWidth = 8; x.strokeRect(4, 4, 382, 198);
  x.fillStyle = '#111'; x.textAlign = 'center'; x.textBaseline = 'middle';
  lines.forEach((l, i) => { let f = font; do { x.font = `900 ${f}px Inter, Arial, sans-serif`; f -= 2; } while (x.measureText(l).width > 350); x.fillText(l, 195, lines.length === 1 ? 104 : 66 + i * 76); });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true })); scene.add(m); SETS.push(m); return m; }
const coinPile = new THREE.Group(); { for (let i = 0; i < 15; i++) { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.1, 28), new THREE.MeshStandardMaterial({ color: 0xffc83a })); c.position.set((i % 5 - 2) * 0.85, 0.06 + Math.floor(i / 5) * 0.11, 0); coinPile.add(c); } }
const billsG = new THREE.Group(); { for (let i = 0; i < 6; i++) { const st = new THREE.Group(); const b = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.4, 0.55), new THREE.MeshStandardMaterial({ color: 0x4fb06a })); st.add(b);
    const band = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.42, 0.57), new THREE.MeshStandardMaterial({ color: 0xf6f0d0 })); st.add(band); st.position.set((i % 3 - 1) * 1.2, 0.22 + Math.floor(i / 3) * 0.42, 0); billsG.add(st); } }
scene.add(coinPile, billsG); SETS.push(coinPile, billsG);
const BILLN = 50, billRain = new THREE.InstancedMesh(new THREE.BoxGeometry(0.5, 0.02, 0.25), new THREE.MeshStandardMaterial({ color: 0x4fb06a }), BILLN); billRain.frustumCulled = false; scene.add(billRain);
const billSeed = []; { const r = rng(808); for (let i = 0; i < BILLN; i++) billSeed.push([r() * 6 - 3, r() * 2 - 1, r() * 1.2, r() * 6.28]); }
function setBillRain(c, t, t0) { let n = 0; for (const [x, z, dl, a] of billSeed) { const tt = t - t0 - dl; if (tt < 0) continue; const y = 7 - 1.6 * tt; if (y < 0.05) continue;
    _m.compose(V(c.x + x + 0.4 * Math.sin(tt * 3 + a), c.y + y, c.z + z), _q.setFromEuler(new THREE.Euler(0.4 * Math.sin(tt * 4 + a), a + tt, 0.4 * Math.cos(tt * 3 + a))), V(1, 1, 1)); billRain.setMatrixAt(n++, _m); }
  billRain.count = n; billRain.visible = n > 0; billRain.instanceMatrix.needsUpdate = true; }
SETS.push(billRain);
const _resetC2 = resetWorld;
resetWorld = function () { _resetC2(); billRain.count = 0; };

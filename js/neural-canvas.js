/* ============================================================
   NEURAL NETWORK CANVAS — animated connections + nodes
   ============================================================ */
export function initNeuralCanvas(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const setSize = () => {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight || 300;
  };
  setSize();
  window.addEventListener('resize', setSize, { passive: true });

  // Build layer structure
  const LAYERS = [3, 5, 6, 5, 3]; // nodes per layer
  const PAD    = 40;
  const colors = ['#00f5ff', '#2299ff', '#7b2fff', '#2299ff', '#00f5ff'];

  function buildNetwork() {
    const nodes = [];
    LAYERS.forEach((count, li) => {
      const x = PAD + (li / (LAYERS.length - 1)) * (canvas.width - PAD * 2);
      for (let ni = 0; ni < count; ni++) {
        const y = PAD + ((ni + 0.5) / count) * (canvas.height - PAD * 2);
        nodes.push({ x, y, layer: li, idx: ni, pulse: Math.random() });
      }
    });
    return nodes;
  }

  // Signals travelling along edges
  const signals = [];
  function spawnSignal(nodes) {
    const from = nodes.filter(n => n.layer < LAYERS.length - 1);
    if (!from.length) return;
    const a = from[Math.floor(Math.random() * from.length)];
    const toLayer = nodes.filter(n => n.layer === a.layer + 1);
    if (!toLayer.length) return;
    const b = toLayer[Math.floor(Math.random() * toLayer.length)];
    signals.push({ ax: a.x, ay: a.y, bx: b.x, by: b.y, t: 0, speed: 0.012 + Math.random() * 0.008 });
  }

  let nodes = buildNetwork();
  let frame = 0;

  function draw() {
    setSize(); // keep responsive
    nodes = buildNetwork();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // edges
    for (let li = 0; li < LAYERS.length - 1; li++) {
      const fromNodes = nodes.filter(n => n.layer === li);
      const toNodes   = nodes.filter(n => n.layer === li + 1);
      fromNodes.forEach(a => {
        toNodes.forEach(b => {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = 'rgba(0,245,255,0.06)';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        });
      });
    }

    // signals
    for (let i = signals.length - 1; i >= 0; i--) {
      const s = signals[i];
      s.t += s.speed;
      if (s.t > 1) { signals.splice(i, 1); continue; }
      const px = s.ax + (s.bx - s.ax) * s.t;
      const py = s.ay + (s.by - s.ay) * s.t;
      // trail
      const grd = ctx.createRadialGradient(px, py, 0, px, py, 10);
      grd.addColorStop(0, 'rgba(0,245,255,0.9)');
      grd.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();
    }

    // spawn signal periodically
    if (frame % 18 === 0) spawnSignal(nodes);
    frame++;

    // nodes
    nodes.forEach(n => {
      n.pulse = (n.pulse + 0.015) % (Math.PI * 2);
      const r = 5 + Math.sin(n.pulse) * 1.5;
      const alpha = 0.6 + Math.sin(n.pulse) * 0.3;
      const color = colors[n.layer] || '#00f5ff';
      ctx.beginPath();
      ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
      ctx.fillStyle = color + Math.round(alpha * 255).toString(16).padStart(2, '0');
      ctx.fill();
      // outer ring
      ctx.beginPath();
      ctx.arc(n.x, n.y, r + 4, 0, Math.PI * 2);
      ctx.strokeStyle = color + '33';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    requestAnimationFrame(draw);
  }
  draw();
}

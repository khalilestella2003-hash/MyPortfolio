/* ============================================================
   HERO BACKGROUND — Particle + Grid Canvas
   ============================================================ */
export function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const resize = () => {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  };
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // particles
  const PARTICLE_COUNT = 80;
  const particles = Array.from({ length: PARTICLE_COUNT }, () => createParticle(canvas));

  function createParticle(c) {
    return {
      x: Math.random() * c.width,
      y: Math.random() * c.height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      size: Math.random() * 1.8 + 0.5,
      opacity: Math.random() * 0.6 + 0.1,
      hue: Math.random() > 0.5 ? 185 : 260, // cyan or purple
    };
  }

  let mouseX = -9999, mouseY = -9999;
  canvas.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mouseX = e.clientX - r.left;
    mouseY = e.clientY - r.top;
  });
  canvas.addEventListener('mouseleave', () => { mouseX = mouseY = -9999; });

  const LINE_DIST  = 130;
  const MOUSE_DIST = 160;

  let raf;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // grid
    ctx.strokeStyle = 'rgba(0,245,255,0.03)';
    ctx.lineWidth = 1;
    const gs = 70;
    for (let x = 0; x < canvas.width;  x += gs) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke(); }
    for (let y = 0; y < canvas.height; y += gs) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke(); }

    particles.forEach((p, i) => {
      // move
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width)  p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      // mouse repel
      const dx = p.x - mouseX, dy = p.y - mouseY;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < MOUSE_DIST && d > 0) {
        p.x += (dx / d) * 0.8;
        p.y += (dy / d) * 0.8;
      }

      // draw dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue},100%,70%,${p.opacity})`;
      ctx.fill();

      // connect nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const q  = particles[j];
        const ex = p.x - q.x, ey = p.y - q.y;
        const ed = Math.sqrt(ex * ex + ey * ey);
        if (ed < LINE_DIST) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          const alpha = (1 - ed / LINE_DIST) * 0.18;
          ctx.strokeStyle = `hsla(${p.hue},100%,70%,${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    });

    raf = requestAnimationFrame(draw);
  }
  draw();

  // pause when not visible
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else draw();
  });
}

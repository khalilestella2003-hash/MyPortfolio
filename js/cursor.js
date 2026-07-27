/* ============================================================
   CUSTOM CURSOR + MAGNETIC BUTTONS
   ============================================================ */
export function initCursor() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;
  if (window.matchMedia('(pointer: coarse)').matches) {
    dot.style.display = ring.style.display = 'none';
    document.body.style.cursor = 'auto';
    return;
  }

  let mx = -100, my = -100;
  let rx = -100, ry = -100;
  let raf;

  const lerp = (a, b, t) => a + (b - a) * t;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  (function loop() {
    rx = lerp(rx, mx, 0.14);
    ry = lerp(ry, my, 0.14);
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    raf = requestAnimationFrame(loop);
  })();

  // hover state
  const hoverTargets = 'a, button, [data-magnetic], .btn, .tech-card, .interest-card, .contact-link, nav a';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverTargets)) ring.classList.add('hovering');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverTargets)) ring.classList.remove('hovering');
  });

  // magnetic pull on buttons
  document.querySelectorAll('[data-magnetic]').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width  / 2;
      const cy = r.top  + r.height / 2;
      const dx = (e.clientX - cx) * 0.35;
      const dy = (e.clientY - cy) * 0.35;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
}

/* ============================================================
   SCROLL REVEAL — IntersectionObserver-based entrance
   ============================================================ */
export function initScrollReveal() {
  const classes = ['.reveal', '.reveal-left', '.reveal-right', '.reveal-scale'];
  const elements = document.querySelectorAll(classes.join(','));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // only animate once
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}

/* ── Skill bar fill on enter ── */
export function initSkillBars() {
  // Covers both .progress-fill (skills) and .output-class-fill (CNN demo)
  const bars = document.querySelectorAll('.progress-fill[data-width], .output-class-fill[data-width]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const w = entry.target.getAttribute('data-width');
        entry.target.style.width = w;
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  bars.forEach(b => observer.observe(b));
}

/* ── Tilt cards ── */
export function initTiltCards() {
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r   = card.getBoundingClientRect();
      const cx  = r.left + r.width  / 2;
      const cy  = r.top  + r.height / 2;
      const rx  = ((e.clientY - cy) / (r.height / 2)) * -8;
      const ry  = ((e.clientX - cx) / (r.width  / 2)) *  8;
      card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(8px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ── Counter animation ── */
export function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el  = entry.target;
      const end = parseInt(el.getAttribute('data-count'), 10);
      const dur = 1600;
      const step= Math.ceil(end / (dur / 16));
      let cur   = 0;
      const tick = () => {
        cur = Math.min(cur + step, end);
        el.textContent = cur + (el.getAttribute('data-suffix') || '');
        if (cur < end) requestAnimationFrame(tick);
      };
      tick();
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => observer.observe(c));
}

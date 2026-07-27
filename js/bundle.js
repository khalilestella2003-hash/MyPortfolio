/* ============================================================
   BUNDLED PORTFOLIO JS — All modules combined for file:// compatibility
   No ES6 modules — works when opening index.html directly
   ============================================================ */

// ══════════════════════════════════════
// LOGIN GATE
// ══════════════════════════════════════
function initLogin(onSuccess) {
  const gate      = document.getElementById('login-gate');
  const form      = document.getElementById('login-form');
  const userInput = document.getElementById('login-user');
  const passInput = document.getElementById('login-pass');
  const errorEl   = document.getElementById('login-error');
  const submitBtn = document.getElementById('login-submit');
  const btnText   = document.getElementById('login-btn-text');
  const btnLoader = document.getElementById('login-btn-loader');
  const toggleBtn = document.getElementById('toggle-pass');
  const eyeOpen   = document.getElementById('eye-open');
  const eyeClosed = document.getElementById('eye-closed');
  const loginBox  = gate?.querySelector('.login-box');

  if (!gate) { onSuccess?.(); return; }

  // ── credentials (hardcoded, no backend) ──
  const VALID_USER = 'lilisme';
  const VALID_PASS = 'kaiandani143';

  // ── login background canvas ──
  const lc = document.getElementById('login-canvas');
  if (lc) {
    const ctx = lc.getContext('2d');
    const resize = () => { lc.width = lc.offsetWidth; lc.height = lc.offsetHeight; };
    resize();
    window.addEventListener('resize', resize, { passive: true });
    const pts = Array.from({ length: 60 }, () => ({
      x: Math.random() * lc.width, y: Math.random() * lc.height,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.4,
      h: Math.random() > 0.5 ? 185 : 260,
      o: Math.random() * 0.5 + 0.1,
    }));
    (function lcDraw() {
      if (!gate || gate.classList.contains('dismissed')) return;
      lc.width = lc.offsetWidth; lc.height = lc.offsetHeight;
      ctx.clearRect(0, 0, lc.width, lc.height);
      // grid
      ctx.strokeStyle = 'rgba(0,245,255,0.025)';
      ctx.lineWidth = 1;
      for (let x = 0; x < lc.width;  x += 60) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,lc.height); ctx.stroke(); }
      for (let y = 0; y < lc.height; y += 60) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(lc.width,y); ctx.stroke(); }
      // particles
      pts.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = lc.width; if (p.x > lc.width)  p.x = 0;
        if (p.y < 0) p.y = lc.height;if (p.y > lc.height) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.h},100%,70%,${p.o})`; ctx.fill();
        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j];
          const d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < 110) {
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `hsla(${p.h},100%,70%,${(1 - d/110) * 0.12})`;
            ctx.lineWidth = 0.5; ctx.stroke();
          }
        }
      });
      requestAnimationFrame(lcDraw);
    })();
  }

  // ── password visibility toggle ──
  toggleBtn?.addEventListener('click', () => {
    const isHidden = passInput.type === 'password';
    passInput.type = isHidden ? 'text' : 'password';
    eyeOpen.style.display   = isHidden ? 'none'  : 'block';
    eyeClosed.style.display = isHidden ? 'block' : 'none';
    passInput.focus();
  });

  // ── clear error on typing ──
  [userInput, passInput].forEach(el => {
    el?.addEventListener('input', () => {
      errorEl.textContent = '';
      el.classList.remove('error');
    });
  });

  // ── form submit ──
  form?.addEventListener('submit', e => {
    e.preventDefault();
    const u = userInput.value.trim();
    const p = passInput.value;

    // basic empty check
    if (!u || !p) {
      showError('Both fields are required.');
      if (!u) userInput.classList.add('error');
      if (!p) passInput.classList.add('error');
      return;
    }

    // loading state
    submitBtn.disabled = true;
    btnText.style.display   = 'none';
    btnLoader.style.display = 'inline';
    errorEl.textContent = '';

    // short delay to feel like auth
    setTimeout(() => {
      if (u === VALID_USER && p === VALID_PASS) {
        // success
        loginBox?.classList.add('success');
        btnLoader.textContent = 'ACCESS GRANTED ✓';
        setTimeout(() => {
          gate.classList.add('dismissed');
          onSuccess?.();
        }, 700);
      } else {
        // ── failure — ALWAYS highlight both inputs, clear both values ──
        submitBtn.disabled = false;
        btnText.style.display   = 'inline';
        btnLoader.style.display = 'none';

        userInput.classList.add('error');
        passInput.classList.add('error');
        userInput.value = '';
        passInput.value = '';
        showError('Username or password is incorrect.');

        loginBox?.classList.remove('shake');
        void loginBox?.offsetWidth;
        loginBox?.classList.add('shake');

        // focus back to username after clearing
        userInput.focus();
      }
    }, 900);
  });

  function showError(msg) {
    errorEl.textContent = '> ' + msg;
  }

  // ── expose logout so the navbar button can call it ──
  window.__kaiLogout = function () {
    form.reset();
    errorEl.textContent = '';
    userInput.classList.remove('error');
    passInput.classList.remove('error');
    loginBox?.classList.remove('success', 'shake');
    btnText.style.display   = 'inline';
    btnLoader.style.display = 'none';
    btnLoader.textContent   = 'AUTHENTICATING...';
    submitBtn.disabled      = false;
    passInput.type          = 'password';
    eyeOpen.style.display   = 'block';
    eyeClosed.style.display = 'none';
    gate.classList.remove('dismissed');
  };
}

// ══════════════════════════════════════
// LOADER
// ══════════════════════════════════════
function initLoader(onComplete) {
  const screen  = document.getElementById('loading-screen');
  const pct     = document.getElementById('boot-pct');
  const bar     = document.querySelector('.boot-bar-fill');
  const lines   = document.getElementById('boot-lines');

  if (!screen) { onComplete?.(); return; }

  document.body.classList.add('loading');

  const bootMessages = [
    '> Initializing KAI.OS v2.4.1...',
    '> Loading neural network modules...',
    '> Connecting to network infrastructure...',
    '> Compiling portfolio data...',
    '> Mounting visual interface...',
    '> System ready. Welcome.',
  ];

  const total    = bootMessages.length;
  const stepTime = 420;
  let i = 0;

  function setProgress(value) {
    const p = Math.round(value);
    if (pct) pct.textContent = p + '%';
    if (bar) bar.style.width = p + '%';
  }

  setProgress(0);

  function tick() {
    if (i >= total) {
      setProgress(100);
      setTimeout(() => {
        screen.classList.add('hidden');
        document.body.classList.remove('loading');
        onComplete?.();
      }, 500);
      return;
    }

    const div = document.createElement('div');
    div.className = 'boot-line';
    div.style.animationDelay = '0s';
    div.textContent = bootMessages[i];
    if (lines) lines.appendChild(div);

    i++;
    setProgress((i / total) * 100);

    setTimeout(tick, stepTime);
  }

  setTimeout(tick, 200);
}

// ══════════════════════════════════════
// CURSOR
// ══════════════════════════════════════
function initCursor() {
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
    requestAnimationFrame(loop);
  })();

  const hoverTargets = 'a, button, [data-magnetic], .btn, .tech-card, .interest-card, .contact-link, nav a';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverTargets)) ring.classList.add('hovering');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverTargets)) ring.classList.remove('hovering');
  });

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

// ══════════════════════════════════════
// NAVBAR
// ══════════════════════════════════════
function initNavbar() {
  const nav       = document.getElementById('navbar');
  const hamburger = document.getElementById('nav-hamburger');
  const mobileMenu= document.getElementById('nav-mobile');
  const navLinks  = document.querySelectorAll('.nav-link');
  const sections  = document.querySelectorAll('section[id]');
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 200) current = sec.id;
    });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  hamburger?.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(open));
    if (mobileMenu) {
      if (open) {
        mobileMenu.style.display = 'flex';
        mobileMenu.getBoundingClientRect(); // force reflow
        mobileMenu.classList.add('open');
      } else {
        mobileMenu.classList.remove('open');
        setTimeout(() => { mobileMenu.style.display = 'none'; }, 400);
      }
    }
    document.body.style.overflow = open ? 'hidden' : '';
  });

  mobileMenu?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger?.classList.remove('open');
      hamburger?.setAttribute('aria-expanded', 'false');
      if (mobileMenu) {
        mobileMenu.classList.remove('open');
        setTimeout(() => { mobileMenu.style.display = 'none'; }, 400);
      }
      document.body.style.overflow = '';
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── logout ──
  function doLogout() {
    hamburger?.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
    if (mobileMenu) {
      mobileMenu.classList.remove('open');
      setTimeout(() => { mobileMenu.style.display = 'none'; }, 400);
    }
    document.body.style.overflow = '';
    window.__kaiLogout?.();
  }
  document.getElementById('logout-btn')?.addEventListener('click', doLogout);
  document.getElementById('logout-btn-mobile')?.addEventListener('click', doLogout);
}

// ══════════════════════════════════════
// HERO CANVAS
// ══════════════════════════════════════
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const resize = () => {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  };
  resize();
  window.addEventListener('resize', resize, { passive: true });

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
      hue: Math.random() > 0.5 ? 185 : 260,
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

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgba(0,245,255,0.03)';
    ctx.lineWidth = 1;
    const gs = 70;
    for (let x = 0; x < canvas.width;  x += gs) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke(); }
    for (let y = 0; y < canvas.height; y += gs) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke(); }

    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width)  p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      const dx = p.x - mouseX, dy = p.y - mouseY;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < MOUSE_DIST && d > 0) {
        p.x += (dx / d) * 0.8;
        p.y += (dy / d) * 0.8;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue},100%,70%,${p.opacity})`;
      ctx.fill();

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

    requestAnimationFrame(draw);
  }
  draw();
}

// ══════════════════════════════════════
// TYPEWRITER
// ══════════════════════════════════════
function initTypewriter(el, phrases) {
  if (!el) return;
  const typingSpeed  = 65;
  const deletingSpeed= 35;
  const pauseAfter   = 1800;
  const pauseBefore  = 500;

  let phraseIndex = 0;
  let charIndex   = 0;
  let isDeleting  = false;

  const cursor = document.createElement('span');
  cursor.className = 'typed-cursor';
  cursor.textContent = '|';
  el.after(cursor);

  function type() {
    const phrase = phrases[phraseIndex];
    if (isDeleting) {
      el.textContent = phrase.substring(0, charIndex--);
      if (charIndex < 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(type, pauseBefore);
        return;
      }
      setTimeout(type, deletingSpeed);
    } else {
      el.textContent = phrase.substring(0, charIndex++);
      if (charIndex > phrase.length) {
        isDeleting = true;
        setTimeout(type, pauseAfter);
        return;
      }
      setTimeout(type, typingSpeed);
    }
  }
  type();
}

// ══════════════════════════════════════
// NEURAL CANVAS
// ══════════════════════════════════════
function initNeuralCanvas(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const setSize = () => {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight || 300;
  };
  setSize();
  window.addEventListener('resize', setSize, { passive: true });

  const LAYERS = [3, 5, 6, 5, 3];
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
    setSize();
    nodes = buildNetwork();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

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

    for (let i = signals.length - 1; i >= 0; i--) {
      const s = signals[i];
      s.t += s.speed;
      if (s.t > 1) { signals.splice(i, 1); continue; }
      const px = s.ax + (s.bx - s.ax) * s.t;
      const py = s.ay + (s.by - s.ay) * s.t;
      const grd = ctx.createRadialGradient(px, py, 0, px, py, 10);
      grd.addColorStop(0, 'rgba(0,245,255,0.9)');
      grd.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();
    }

    if (frame % 18 === 0) spawnSignal(nodes);
    frame++;

    nodes.forEach(n => {
      n.pulse = (n.pulse + 0.015) % (Math.PI * 2);
      const r = 5 + Math.sin(n.pulse) * 1.5;
      const alpha = 0.6 + Math.sin(n.pulse) * 0.3;
      const color = colors[n.layer] || '#00f5ff';
      ctx.beginPath();
      ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
      ctx.fillStyle = color + Math.round(alpha * 255).toString(16).padStart(2, '0');
      ctx.fill();
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

// ══════════════════════════════════════
// NETWORK CANVAS
// ══════════════════════════════════════
function initNetworkCanvas(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const setSize = () => {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight || 320;
  };
  setSize();
  window.addEventListener('resize', () => { setSize(); buildNodes(); }, { passive: true });

  const NODE_TYPES = ['router','switch','server','pc','cloud'];
  const ICONS = { router:'⬡', switch:'⬡', server:'▣', pc:'◻', cloud:'◉' };
  const COLORS = { router:'#00f5ff', switch:'#2299ff', server:'#7b2fff', pc:'#00ff88', cloud:'#ff6b2b' };

  let nodes = [], edges = [], packets = [];

  function buildNodes() {
    const cw = canvas.width, ch = canvas.height;
    nodes = [
      { id:0, type:'cloud',  x:cw*0.5,  y:ch*0.12, label:'Internet' },
      { id:1, type:'router', x:cw*0.5,  y:ch*0.38, label:'Core Router' },
      { id:2, type:'switch', x:cw*0.22, y:ch*0.62, label:'Switch A' },
      { id:3, type:'switch', x:cw*0.78, y:ch*0.62, label:'Switch B' },
      { id:4, type:'server', x:cw*0.1,  y:ch*0.88, label:'Server' },
      { id:5, type:'pc',     x:cw*0.35, y:ch*0.88, label:'PC' },
      { id:6, type:'pc',     x:cw*0.65, y:ch*0.88, label:'PC' },
      { id:7, type:'server', x:cw*0.9,  y:ch*0.88, label:'DB' },
    ];
    edges = [
      [0,1],[1,2],[1,3],[2,4],[2,5],[3,6],[3,7]
    ];
  }
  buildNodes();

  function spawnPacket() {
    if (!edges.length) return;
    const e = edges[Math.floor(Math.random() * edges.length)];
    const rev = Math.random() > 0.5;
    const [ai, bi] = rev ? [e[1], e[0]] : e;
    const a = nodes[ai], b = nodes[bi];
    if (!a || !b) return;
    packets.push({ ax:a.x, ay:a.y, bx:b.x, by:b.y, t:0, speed:0.018+Math.random()*0.01, color:'#00f5ff' });
  }

  let hoveredNode = null;
  canvas.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    const mx = e.clientX - r.left, my = e.clientY - r.top;
    hoveredNode = nodes.find(n => Math.hypot(n.x - mx, n.y - my) < 20) || null;
    canvas.style.cursor = hoveredNode ? 'pointer' : 'default';
  });

  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    edges.forEach(([ai, bi]) => {
      const a = nodes[ai], b = nodes[bi];
      if (!a || !b) return;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = 'rgba(0,245,255,0.15)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    for (let i = packets.length - 1; i >= 0; i--) {
      const p = packets[i];
      p.t += p.speed;
      if (p.t > 1) { packets.splice(i, 1); continue; }
      const px = p.ax + (p.bx - p.ax) * p.t;
      const py = p.ay + (p.by - p.ay) * p.t;
      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    nodes.forEach(n => {
      const isHovered = n === hoveredNode;
      const color = COLORS[n.type] || '#00f5ff';
      const r = isHovered ? 18 : 14;

      if (isHovered) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, r + 8, 0, Math.PI * 2);
        ctx.strokeStyle = color + '44';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
      ctx.fillStyle = '#071428';
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = isHovered ? 2 : 1.5;
      ctx.stroke();

      ctx.font = `${r * 0.9}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = color;
      ctx.fillText(ICONS[n.type] || '●', n.x, n.y);

      if (isHovered) {
        ctx.font = '11px "Share Tech Mono", monospace';
        ctx.fillStyle = color;
        ctx.fillText(n.label, n.x, n.y + r + 14);
      }
    });

    if (frame % 30 === 0) spawnPacket();
    frame++;
    requestAnimationFrame(draw);
  }
  draw();
}

// ══════════════════════════════════════
// SCROLL REVEAL
// ══════════════════════════════════════
function initScrollReveal() {
  const classes = ['.reveal', '.reveal-left', '.reveal-right', '.reveal-scale'];
  const elements = document.querySelectorAll(classes.join(','));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}

function initSkillBars() {
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

function initTiltCards() {
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

function initCounters() {
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

// ══════════════════════════════════════
// CONTACT
// ══════════════════════════════════════
function initContact() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn  = form.querySelector('[type="submit"]');
    const note = form.querySelector('.form-note');

    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
      const empty = !field.value.trim();
      field.style.borderColor = empty ? 'rgba(255,43,107,0.6)' : '';
      if (empty) valid = false;
    });
    if (!valid) return;

    btn.textContent = 'Sending...';
    btn.disabled = true;
    btn.style.opacity = '0.7';

    setTimeout(() => {
      btn.textContent = '✓ Message Sent';
      btn.style.background = 'linear-gradient(135deg,#00ff88,#00c464)';
      btn.style.opacity = '1';
      if (note) note.textContent = '> Message queued. I\'ll get back to you soon.';
      note && (note.style.color = 'var(--clr-green)');
      form.reset();

      setTimeout(() => {
        btn.textContent = 'Send Message';
        btn.disabled = false;
        btn.style.background = '';
        if (note) {
          note.textContent = '> Note: This is a static portfolio. Connect via email or social links above.';
          note.style.color = '';
        }
      }, 4000);
    }, 1400);
  });
}

// ══════════════════════════════════════
// MAIN INIT
// ══════════════════════════════════════
window.addEventListener('DOMContentLoaded', () => {
  initLogin(() => {
    initLoader(() => {
      initCursor();
      initNavbar();
      initHeroCanvas();
      initScrollReveal();
      initSkillBars();
      initTiltCards();
      initCounters();
      initContact();

      const typedEl = document.getElementById('typed-text');
      const phrases = [
        'Aspiring Network Engineer',
        'BSIT Student & Developer',
        'AI / ML Enthusiast',
        'Building Intelligent Systems',
        'Networking & Security Focus',
        'Android App Developer',
      ];
      initTypewriter(typedEl, phrases);

      initNeuralCanvas('neural-canvas');
      initNetworkCanvas('network-canvas');

      console.log('%cKAI.OS %cPortfolio Loaded', 'color:#00f5ff;font-size:18px;font-weight:bold', 'color:#7b2fff;font-size:12px');
    });
  });
});

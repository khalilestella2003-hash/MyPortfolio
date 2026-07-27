/* ============================================================
   NAVBAR — scroll, active section, mobile menu
   ============================================================ */
export function initNavbar() {
  const nav       = document.getElementById('navbar');
  const hamburger = document.getElementById('nav-hamburger');
  const mobileMenu= document.getElementById('nav-mobile');
  const navLinks  = document.querySelectorAll('.nav-link');
  const sections  = document.querySelectorAll('section[id]');
  if (!nav) return;

  // scrolled class
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);

    // active link tracking
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

  // mobile toggle
  hamburger?.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    mobileMenu?.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // close mobile on link click
  mobileMenu?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger?.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // smooth scroll for all nav anchors
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

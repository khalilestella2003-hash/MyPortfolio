/* ============================================================
   CONTACT FORM — client-side validation & feedback
   ============================================================ */
export function initContact() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn  = form.querySelector('[type="submit"]');
    const note = form.querySelector('.form-note');
    const data = Object.fromEntries(new FormData(form));

    // basic validation
    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
      const empty = !field.value.trim();
      field.style.borderColor = empty ? 'rgba(255,43,107,0.6)' : '';
      if (empty) valid = false;
    });
    if (!valid) return;

    // simulate send
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

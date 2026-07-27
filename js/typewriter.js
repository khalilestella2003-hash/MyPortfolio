/* ============================================================
   TYPEWRITER — Hero subtitle cycling text
   ============================================================ */
export function initTypewriter(el, phrases, opts = {}) {
  if (!el) return;
  const {
    typingSpeed  = 65,
    deletingSpeed= 35,
    pauseAfter   = 1800,
    pauseBefore  = 500,
  } = opts;

  let phraseIndex = 0;
  let charIndex   = 0;
  let isDeleting  = false;

  // cursor span
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

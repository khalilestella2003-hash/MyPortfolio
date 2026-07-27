/* ============================================================
   BOOT / LOADING SCREEN
   Bar width + percentage counter are both JS-driven and in sync.
   ============================================================ */
export function initLoader(onComplete) {
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
  const stepTime = 420; // ms between each boot line
  let i = 0;

  function setProgress(value) {
    const p = Math.round(value);
    if (pct) pct.textContent = p + '%';
    if (bar) bar.style.width = p + '%';
  }

  // Start at 0
  setProgress(0);

  function tick() {
    if (i >= total) {
      // Finish — snap to 100%
      setProgress(100);
      setTimeout(() => {
        screen.classList.add('hidden');
        document.body.classList.remove('loading');
        onComplete?.();
      }, 500);
      return;
    }

    // Append boot line
    const div = document.createElement('div');
    div.className = 'boot-line';
    div.style.animationDelay = '0s';
    div.textContent = bootMessages[i];
    if (lines) lines.appendChild(div);

    // Advance counter
    i++;
    setProgress((i / total) * 100);

    setTimeout(tick, stepTime);
  }

  // Small initial delay so the screen is visibly shown before first tick
  setTimeout(tick, 200);
}

/* ============================================================
   MAIN ENTRY POINT — Wire everything together
   ============================================================ */
import { initLoader } from './loader.js';
import { initCursor } from './cursor.js';
import { initNavbar } from './navbar.js';
import { initHeroCanvas } from './hero-canvas.js';
import { initTypewriter } from './typewriter.js';
import { initNeuralCanvas } from './neural-canvas.js';
import { initNetworkCanvas } from './network-canvas.js';
import { initScrollReveal, initSkillBars, initTiltCards, initCounters } from './scroll-reveal.js';
import { initContact } from './contact.js';

// Initialize after page loaded
window.addEventListener('DOMContentLoaded', () => {
  // Boot screen
  initLoader(() => {
    // After boot done, initialize everything else
    initCursor();
    initNavbar();
    initHeroCanvas();
    initScrollReveal();
    initSkillBars();
    initTiltCards();
    initCounters();
    initContact();

    // Hero typewriter
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

    // Neural canvas (AI section)
    initNeuralCanvas('neural-canvas');

    // Network canvas (Networking section)
    initNetworkCanvas('network-canvas');

    console.log('%cKAI.OS %cPortfolio Loaded', 'color:#00f5ff;font-size:18px;font-weight:bold', 'color:#7b2fff;font-size:12px');
  });
});

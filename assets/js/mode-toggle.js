/* PINAPP — mode-toggle.js — v5
   Système mode nuit/jour — The Light Always Returns
   Stockage : pinapp-mode ('nuit' | 'jour')
   Dispatch : modeChange sur document.body
   ================================================================= */

const ModeToggle = {
  init() {
    const hasMain = !!document.querySelector('script[src*="main.js"]');

    if (!hasMain) {
      const theme = localStorage.getItem('pinapp-theme');
      const saved = localStorage.getItem('pinapp-mode');
      const dark = window.matchMedia('(prefers-color-scheme:dark)').matches;

      if (theme === 'light') this.setJour(false);
      else if (theme === 'dark') this.setNuit(false);
      else if (saved === 'jour') this.setJour(false);
      else if (saved === 'nuit') this.setNuit(false);
      else this.setNuit(false);

      document
        .querySelectorAll('.mode-toggle')
        .forEach((b) => b.addEventListener('click', () => this.toggle()));
    } else {
      document.querySelectorAll('.mode-toggle').forEach((b) => {
        b.setAttribute(
          'aria-label',
          this.current === 'jour' ? 'Passer en mode nuit' : 'Passer en mode jour',
        );
      });
    }

    window.setTimeout(() => {
      document.querySelectorAll('.pp-theme-toggle').forEach((b) => {
        if (b.dataset.mtBound === '1') return;
        b.dataset.mtBound = '1';
        b.addEventListener('click', () => this.toggle());
      });
    }, 0);

    window.matchMedia('(prefers-color-scheme:dark)').addEventListener('change', () => {
      if (!localStorage.getItem('pinapp-theme') && !localStorage.getItem('pinapp-mode')) {
        this.setNuit(false);
      }
    });

    // Pulse discret 2s après le premier chargement
    setTimeout(() => {
      document.querySelectorAll('.mode-toggle').forEach((b) => {
        b.style.animation = 'toggle-pulse 2s ease-in-out 1';
      });
    }, 2000);
  },

  toggle() {
    this.current === 'nuit' ? this.setJour(true) : this.setNuit(true);
  },

  get current() {
    return document.body.classList.contains('mode-jour') ? 'jour' : 'nuit';
  },

  setNuit(anim = true) {
    if (anim) this._anim();
    document.body.classList.remove('mode-jour');
    document.body.classList.add('mode-nuit');
    // Rétrocompatiblité data-theme
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.setAttribute('data-mode', 'nuit');
    localStorage.setItem('pinapp-mode', 'nuit');
    try {
      localStorage.setItem('pinapp-theme', 'dark');
    } catch (e) {}
    document
      .querySelectorAll('.mode-toggle')
      .forEach((b) => b.setAttribute('aria-label', 'Passer en mode jour'));
    // Mettre à jour theme-color meta
    const meta = document.getElementById('pinapp-theme-color');
    if (meta) meta.setAttribute('content', '#080d18');
    document.body.dispatchEvent(new Event('modeChange'));
    if (typeof window.PinappSyncPpThemeToggleIcons === 'function') window.PinappSyncPpThemeToggleIcons();
    // Canvas aurora : visible
    const canvas = document.getElementById('pandora-canvas');
    if (canvas) {
      canvas.style.opacity = '1';
    }
  },

  setJour(anim = true) {
    if (anim) this._anim();
    document.body.classList.remove('mode-nuit');
    document.body.classList.add('mode-jour');
    // Rétrocompatiblité data-theme
    document.documentElement.setAttribute('data-theme', 'light');
    document.documentElement.setAttribute('data-mode', 'jour');
    localStorage.setItem('pinapp-mode', 'jour');
    try {
      localStorage.setItem('pinapp-theme', 'light');
    } catch (e) {}
    document
      .querySelectorAll('.mode-toggle')
      .forEach((b) => b.setAttribute('aria-label', 'Passer en mode nuit'));
    // Mettre à jour theme-color meta
    const meta = document.getElementById('pinapp-theme-color');
    if (meta) meta.setAttribute('content', '#0a2a2e');
    document.body.dispatchEvent(new Event('modeChange'));
    if (typeof window.PinappSyncPpThemeToggleIcons === 'function') window.PinappSyncPpThemeToggleIcons();
    // Canvas aurora : masqué en jour
    const canvas = document.getElementById('pandora-canvas');
    if (canvas) {
      canvas.style.transition = 'opacity 500ms ease';
      canvas.style.opacity = '0';
    }
  },

  _anim() {
    document.body.classList.add('mode-switching');
    setTimeout(() => document.body.classList.remove('mode-switching'), 500);
  },
};

window.PinappModeToggle = ModeToggle;

document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', () => ModeToggle.init())
  : ModeToggle.init();

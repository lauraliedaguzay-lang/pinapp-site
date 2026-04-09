/* PINAPP — mode-toggle.js — v5
   Système mode sombre/clair (compat: valeurs internes 'nuit' | 'jour')
   Stockage : pinapp-mode ('nuit' | 'jour')
   Dispatch : modeChange sur document.body
   ================================================================= */

const ModeToggle = {
  init() {
    const saved = localStorage.getItem('pinapp-mode');
    const dark = window.matchMedia('(prefers-color-scheme:dark)').matches;

    // Priorité : sauvegarde > préférence système
    if (saved === 'jour') this.setJour(false);
    else if (saved === 'nuit') this.setNuit(false);
    else if (dark) this.setNuit(false);
    else this.setJour(false);

    // Suivre le réglage système si pas de préférence sauvegardée
    window.matchMedia('(prefers-color-scheme:dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('pinapp-mode'))
        e.matches ? this.setNuit(false) : this.setJour(false);
    });

    // Bind uniquement si main.js n'est PAS chargé (main.js gère déjà le clic)
    // main.js appelle classList.toggle('mode-jour') + dispatch modeChange
    // Si les deux handlers tournent, ils s'annulent mutuellement
    const hasMain = !!document.querySelector('script[src*="main.js"]');
    if (!hasMain) {
      document
        .querySelectorAll('.mode-toggle')
        .forEach((b) => b.addEventListener('click', () => this.toggle()));
    }

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
    document
      .querySelectorAll('.mode-toggle')
      .forEach((b) => b.setAttribute('aria-label', 'Activer le mode clair'));
    // Mettre à jour theme-color meta
    const meta = document.getElementById('pinapp-theme-color');
    if (meta) meta.setAttribute('content', '#020810');
    document.body.dispatchEvent(new Event('modeChange'));
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
    document
      .querySelectorAll('.mode-toggle')
      .forEach((b) => b.setAttribute('aria-label', 'Activer le mode sombre'));
    // Mettre à jour theme-color meta
    const meta = document.getElementById('pinapp-theme-color');
    if (meta) meta.setAttribute('content', '#F8F0FF');
    document.body.dispatchEvent(new Event('modeChange'));
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

document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', () => ModeToggle.init())
  : ModeToggle.init();

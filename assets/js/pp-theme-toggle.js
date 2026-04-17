/**
 * Bouton thème .pp-theme-toggle — injection avant le burger + tiroir mobile,
 * sync avec pinapp-theme / pinapp-mode, grille (PinappModeToggle) et pages theme.js.
 */
(function () {
  'use strict';

  var html = document.documentElement;

  function isLight() {
    return html.getAttribute('data-theme') === 'light';
  }

  function syncIcons() {
    var dark = !isLight();
    document.querySelectorAll('.pp-theme-toggle').forEach(function (btn) {
      btn.textContent = dark ? '☀️' : '🌙';
      btn.setAttribute('aria-label', 'Changer de thème');
    });
  }

  function applyFromPp(next) {
    html.setAttribute('data-theme', next);
    try {
      localStorage.setItem('pinapp-theme', next);
      localStorage.setItem('pinapp-mode', next === 'light' ? 'jour' : 'nuit');
      localStorage.setItem('theme', next);
    } catch (e) {}
    if (document.body) {
      document.body.classList.toggle('day', next === 'light');
      document.body.classList.toggle('mode-jour', next === 'light');
      document.body.classList.toggle('mode-nuit', next !== 'light');
    }
    html.setAttribute('data-mode', next === 'light' ? 'jour' : 'nuit');
    syncIcons();
    var meta = document.getElementById('pinapp-theme-color');
    if (meta) meta.setAttribute('content', next === 'light' ? '#0a2a2e' : '#080d18');
    try {
      document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: next } }));
    } catch (e) {}
    try {
      document.body.dispatchEvent(new Event('modeChange'));
    } catch (e) {}
    try {
      window.dispatchEvent(new Event('resize'));
    } catch (e) {}
  }

  function injectNavButton() {
    var anchors = [
      document.getElementById('navToggle'),
      document.querySelector('.nav__actions .nav__burger'),
      document.querySelector('.nav__burger'),
      document.getElementById('burger'),
    ];
    anchors.forEach(function (anchor) {
      if (!anchor || !anchor.parentNode) return;
      var par = anchor.parentNode;
      if (par.querySelector('.pp-theme-toggle')) return;
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'pp-theme-toggle';
      btn.setAttribute('data-pp-injected', 'nav');
      btn.setAttribute('aria-label', 'Changer de thème');
      if (!document.getElementById('ppTheme')) btn.id = 'ppTheme';
      par.insertBefore(btn, anchor);
    });
  }

  function injectDrawerButton() {
    var targets = [];
    var p1 = document.querySelector('#navDrawer .drawer__panel');
    if (p1) targets.push(p1);
    var p2 = document.querySelector('.nav__drawer');
    if (p2) targets.push(p2);
    var mdp = document.querySelector('#mobileDrawer .mobile-drawer-panel');
    if (mdp) targets.push(mdp);
    targets.forEach(function (panel) {
      if (!panel || panel.querySelector('.pp-theme-toggle')) return;
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'pp-theme-toggle';
      btn.setAttribute('data-pp-injected', 'drawer');
      btn.setAttribute('data-pp-drawer', '1');
      btn.setAttribute('aria-label', 'Changer de thème');
      var ref =
        panel.querySelector('a') || panel.querySelector('.nav-links') || panel.firstElementChild;
      panel.insertBefore(btn, ref || null);
    });
  }

  function init() {
    injectNavButton();
    injectDrawerButton();
    syncIcons();
  }

  document.body.addEventListener('modeChange', syncIcons);
  document.addEventListener('themeChanged', syncIcons);

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  window.PinappSyncPpThemeToggleIcons = syncIcons;
})();

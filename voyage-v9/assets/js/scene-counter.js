/**
 * Pinapp V10 — compteur scène signature (bas gauche)
 */
(function () {
  'use strict';

  var SCENES = [
    { id: 'hero', num: '01', label: 'INVITATION' },
    { id: 'hook-film', num: '02', label: 'DÉMO FILM' },
    { id: 'orientation', num: '03', label: 'ORIENTATION' },
    { id: 'diagnostic', num: '04', label: 'DIAGNOSTIC' },
    { id: 'pourquoi-moins-cher', num: '05', label: 'PREUVE PRIX' },
    { id: 'duo', num: '06', label: 'LE DUO' },
    { id: 'auto', num: '07', label: 'AUTOMATISATIONS' },
    { id: 'pack', num: '08', label: 'PACK SIGNATURE' },
    { id: 'realisations', num: '09', label: 'RÉALISATIONS' },
    { id: 'realisations-vitrine', num: '09', label: 'RÉALISATIONS' },
    { id: 'realisations-demos', num: '09', label: 'RÉALISATIONS' },
    { id: 'realisations-stack', num: '09', label: 'RÉALISATIONS' },
    { id: 'realisations-films', num: '09', label: 'RÉALISATIONS' },
    { id: 'cinema-artistes', num: '10', label: 'CINÉMA ARTISTES' },
    { id: 'captation-na', num: '11', label: 'CAPTATION NA' },
    { id: 'mp', num: '12', label: 'MÉMOIRE & PRÉSENCE' },
    { id: 'methode', num: '13', label: 'MÉTHODE' },
    { id: 'methode-formations', num: '13', label: 'MÉTHODE' },
    { id: 'methode-tarifs', num: '13', label: 'MÉTHODE' },
    { id: 's09b', num: '13', label: 'MÉTHODE' },
    { id: 'contact', num: '14', label: 'CONTACT' }
  ];

  var reduced = false;
  try {
    reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) {}

  var wrap = document.getElementById('scene-signature');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.id = 'scene-signature';
    wrap.setAttribute('aria-hidden', 'true');
    wrap.innerHTML =
      '<span class="scene-signature__num">01</span><span class="scene-signature__sep">·</span><span class="scene-signature__label">INVITATION</span>';
    document.body.appendChild(wrap);
  }

  var numEl = wrap.querySelector('.scene-signature__num');
  var labelEl = wrap.querySelector('.scene-signature__label');
  var currentId = null;
  var THRESH = 140;

  function scrollY() {
    if (window.__pinappLenis && typeof window.__pinappLenis.scroll === 'number') {
      return window.__pinappLenis.scroll;
    }
    return window.scrollY || document.documentElement.scrollTop || 0;
  }

  function update() {
    var y = scrollY();
    var active = SCENES[0];
    var i;
    var el;
    var top;
    for (i = 0; i < SCENES.length; i++) {
      el = document.getElementById(SCENES[i].id);
      if (!el) continue;
      top = el.getBoundingClientRect().top + y;
      if (top <= y + THRESH) active = SCENES[i];
    }
    if (active.id === currentId) return;
    currentId = active.id;
    if (reduced) {
      numEl.textContent = active.num;
      labelEl.textContent = active.label;
      return;
    }
    wrap.classList.add('is-switching');
    window.setTimeout(function () {
      numEl.textContent = active.num;
      labelEl.textContent = active.label;
      wrap.classList.remove('is-switching');
    }, 160);
  }

  if (window.__pinappLenis && window.__pinappLenis.on) {
    window.__pinappLenis.on('scroll', update);
  } else {
    window.addEventListener('scroll', update, { passive: true });
  }
  update();

  document.addEventListener('voyage:scene-active', function (e) {
    if (!e || !e.detail || !e.detail.sectionId) return;
    var sid = e.detail.sectionId;
    var j;
    for (j = 0; j < SCENES.length; j++) {
      if (SCENES[j].id === sid) {
        currentId = null;
        numEl.textContent = SCENES[j].num;
        labelEl.textContent = SCENES[j].label;
        currentId = sid;
        return;
      }
    }
  });
})();

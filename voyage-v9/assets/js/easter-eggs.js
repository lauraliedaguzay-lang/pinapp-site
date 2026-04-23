/* PINAPP — EASTER EGGS POUR DEVS CURIEUX (voyage-v9) */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var css = {
    title:
      'background: linear-gradient(135deg, #00E5B0, #9B6DFF); color: #08090e; font-size: 16px; font-weight: bold; padding: 12px 24px; border-radius: 8px;',
    subtitle: 'color: #00E5B0; font-size: 13px; font-weight: 500;',
    text: 'color: #f0f8ff; font-size: 12px;',
    link: 'color: #FF6B9D; font-size: 12px; text-decoration: underline;',
  };

  console.log('%c Pinapp ', css.title);
  console.log('%cSalut, dev curieux.', css.subtitle);
  console.log('%cTu inspectes notre code ? On adore ça.', css.text);
  console.log('%cPinapp est un duo basé à Bordeaux.', css.text);
  console.log(
    "%cLauralie code, Michaël filme. On fait des sites, des automations n8n, de l'IA et de la vidéo.",
    css.text,
  );
  console.log('%cSi tu cherches un partenaire dev / studio à Bordeaux : contact@pinapp.fr', css.subtitle);
  console.log('%cOu réserve un appel : https://cal.com/lauralie-daguzay-hdglzw/diagnostic', css.link);
  console.log(
    '%cAstuce : code Konami ou tape pinapp.duo() dans la console.',
    css.text,
  );

  var konami = [
    'ArrowUp',
    'ArrowUp',
    'ArrowDown',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowLeft',
    'ArrowRight',
    'KeyB',
    'KeyA',
  ];
  var pos = 0;
  document.addEventListener(
    'keydown',
    function (e) {
      var expected = konami[pos];
      if (e.code === expected) {
        pos++;
        if (pos === konami.length) {
          triggerKonami();
          pos = 0;
        }
      } else {
        pos = 0;
      }
    },
    { passive: true },
  );

  function triggerKonami() {
    var overlay = document.createElement('div');
    overlay.setAttribute('role', 'presentation');
    overlay.style.cssText =
      'position:fixed;inset:0;background:radial-gradient(ellipse at center, rgba(0,229,176,0.95), rgba(155,109,255,0.95));z-index:99999;display:flex;align-items:center;justify-content:center;font-family:-apple-system,sans-serif;color:#08090e;text-align:center;animation:konamiFade 4s ease-out forwards;';
    overlay.innerHTML =
      '<div><h1 style="font-size:clamp(32px,8vw,64px);margin:0 0 16px;letter-spacing:-0.04em;">KONAMI CODE</h1><p style="font-size:clamp(14px,3vw,20px);margin:0;font-weight:500;">Tu connais les classiques. Respect.<br><span style="font-size:14px;opacity:0.7">— Lauralie &amp; Michaël (Pinapp)</span></p></div>';
    if (!document.getElementById('konami-style')) {
      var style = document.createElement('style');
      style.id = 'konami-style';
      style.textContent =
        '@keyframes konamiFade { 0% { opacity: 0 } 20% { opacity: 1 } 80% { opacity: 1 } 100% { opacity: 0 } }';
      document.head.appendChild(style);
    }
    document.body.appendChild(overlay);
    setTimeout(function () {
      overlay.remove();
    }, 4000);
  }

  window.pinapp = {
    duo: function () {
      console.log('%c LAURALIE DAGUZAY ', 'background:#00E5B0;color:#08090e;font-weight:bold;padding:6px 12px;border-radius:4px;');
      console.log('%cCofondatrice — Systèmes, IA, web', 'color:#00E5B0;');
      console.log('%cBordeaux · code-first · obsessive sur les détails', css.text);
      console.log(' ');
      console.log('%c MICHAËL BOUILHAC ', 'background:#9B6DFF;color:#08090e;font-weight:bold;padding:6px 12px;border-radius:4px;');
      console.log('%cCofondateur — Vidéo, image, IA créative', 'color:#9B6DFF;');
      console.log('%cBordeaux · visual-first · expert sur la post-prod', css.text);
      console.log(' ');
      console.log('%cContact : contact@pinapp.fr', 'color:#FF6B9D;font-weight:500;');
      console.log('%cRDV : https://cal.com/lauralie-daguzay-hdglzw/diagnostic', 'color:#FF6B9D;font-weight:500;');
      return 'Pinapp · Bordeaux';
    },
    version: '7.0',
    foundedAt: '2010',
  };
})();

(function () {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  try {
    if (typeof console !== 'undefined' && console.log) {
      console.log(' ');
      console.log(
        '%c J.A.R.V.I.S. systems online.',
        'color:#3ef5e0;font:italic 14px/1.5 Fraunces,Georgia,serif;padding:4px 0;'
      );
      console.log(
        '%c Just A Rather Very Intelligent System.',
        'color:rgba(244,228,193,0.6);font:12px ui-monospace,Menlo,monospace;'
      );
      console.log(
        '%c ✦',
        'color:rgba(244,228,193,0.42);font:11px ui-monospace,Menlo,monospace;padding:2px 0 12px;'
      );
    }
  } catch (e) {}

  function injectMorseStay() {
    if (document.querySelector('.morse-stay')) return;
    var el = document.createElement('div');
    el.className = 'morse-stay';
    el.setAttribute('aria-hidden', 'true');
    el.setAttribute('data-word', 'STAY');
    var pattern = [
      'dot', 'dot', 'dot',
      'letter-gap',
      'dash',
      'letter-gap',
      'dot', 'dash',
      'letter-gap',
      'dash', 'dot', 'dash', 'dash'
    ];
    for (var i = 0; i < pattern.length; i++) {
      var span = document.createElement('span');
      span.className = pattern[i];
      span.style.animationDelay = (i * 80) + 'ms';
      el.appendChild(span);
    }
    document.body.appendChild(el);
  }

  function setActive(id) {
    if (!id) return;
    document.documentElement.setAttribute('data-active-section', id);
  }

  document.addEventListener('voyage:scene-active', function (e) {
    if (e && e.detail && e.detail.sectionId) setActive(e.detail.sectionId);
  });

  function initSectionObserver() {
    if (!('IntersectionObserver' in window)) return;
    var sections = document.querySelectorAll('main section[id^="s"]');
    if (!sections.length) return;
    var top = null;
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting && (!top || en.intersectionRatio > top.intersectionRatio)) {
            top = en;
          }
        });
        if (top && top.target) setActive(top.target.id);
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    sections.forEach(function (s) { io.observe(s); });
  }

  function boot() {
    injectMorseStay();
    initSectionObserver();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();

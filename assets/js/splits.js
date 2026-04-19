/**
 * Découpage mots pour titres .pp-split (hors hero AURA).
 * Le titre #aura-hero-title : si intro #pp-intro active → split + animation au `pp:intro:title-reveal` ;
 * sinon laissé au boot GSAP (pp-awwwards-effects.js).
 */
(function () {
  function splitWords(el) {
    if (!el || el.querySelector('.pp-word')) return;
    var text = el.textContent;
    if (!text || !text.trim()) return;
    el.textContent = '';
    var parts = text.trim().split(/\s+/);
    for (var i = 0; i < parts.length; i++) {
      var span = document.createElement('span');
      span.className = 'pp-word';
      span.textContent = parts[i] + (i < parts.length - 1 ? '\u00a0' : '');
      el.appendChild(span);
    }
  }

  function runNonHeroSplits() {
    document.querySelectorAll('.pp-split').forEach(function (el) {
      if (el.id === 'aura-hero-title') return;
      splitWords(el);
    });
  }

  function revealHeroAfterIntro() {
    var h1 = document.getElementById('aura-hero-title');
    if (!h1 || h1.getAttribute('data-pp-split') === '1') return;
    h1.style.opacity = '1';
    h1.style.visibility = 'visible';
    splitWords(h1);
    h1.querySelectorAll('.pp-word').forEach(function (w) {
      w.classList.add('pp-intro-word');
      w.setAttribute('data-intro-word', '');
    });
    h1.setAttribute('data-pp-split', '1');
    var words = h1.querySelectorAll('.pp-word');
    words.forEach(function (w) {
      w.style.display = 'inline-block';
      w.style.opacity = '0';
      w.style.transform = 'translateY(0.35em)';
    });
    if (typeof window.gsap !== 'undefined' && window.gsap) {
      window.gsap.to(words, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.08,
      });
    } else {
      words.forEach(function (w) {
        w.style.opacity = '1';
        w.style.transform = 'none';
      });
    }
  }

  function onDomReady() {
    runNonHeroSplits();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onDomReady);
  } else {
    onDomReady();
  }

  document.addEventListener('pp:intro:title-reveal', revealHeroAfterIntro);
})();

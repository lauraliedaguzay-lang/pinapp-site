/**
 * Pinapp V3.0 Phase 2 — chapter jumps: breath + match-cut + view transition + marker + skip dots.
 */
(function () {
  var IDS = ['s1', 's2', 's3', 's4', 's5', 's5b', 's6', 's7', 's8'];
  var MARKERS = {
    s1: '— Prologue —',
    s2: '— Rencontre —',
    s3: '— Les outils —',
    s4: '— La constellation —',
    s5: '— Les preuves —',
    s5b: '— Le mécanisme —',
    s6: '— Le manifeste —',
    s7: "— L'œuvre —",
    s8: '— Atterrissage —',
  };

  var currentId = 's1';

  function reducedMotion() {
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {
      return false;
    }
  }

  function sober() {
    return document.documentElement.classList.contains('voyage-sober');
  }

  function hasViewTransitions() {
    return typeof document.startViewTransition === 'function';
  }

  function ensureBreath() {
    var el = document.getElementById('chapter-breath');
    if (el) return el;
    el = document.createElement('div');
    el.id = 'chapter-breath';
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML =
      '<svg class="breath-star" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="4" fill="var(--cyan-glow)" /></svg>';
    document.body.appendChild(el);
    return el;
  }

  function ensureMarker() {
    var el = document.getElementById('chapter-marker');
    if (el) return el;
    el = document.createElement('div');
    el.id = 'chapter-marker';
    el.setAttribute('aria-live', 'polite');
    document.body.appendChild(el);
    return el;
  }

  function ensureSkipNav() {
    var nav = document.getElementById('chapter-skip-nav');
    if (nav) return nav;
    nav = document.createElement('nav');
    nav.id = 'chapter-skip-nav';
    nav.setAttribute('aria-label', 'Chapitres du voyage');
    IDS.forEach(function (id) {
      var a = document.createElement('a');
      a.href = '#' + id;
      a.setAttribute('data-chapter', id);
      a.setAttribute('aria-label', (MARKERS[id] || id).replace(/^— | —$/g, '').trim());
      a.innerHTML = '<span></span>';
      nav.appendChild(a);
    });
    document.body.appendChild(nav);
    return nav;
  }

  function scrollElementForChapter(id) {
    if (id === 's8') {
      var f = document.getElementById('form-diagnostic');
      if (f) return f;
    }
    return document.getElementById(id);
  }

  function normalizeHash(hash) {
    if (!hash || hash === '#') return 's1';
    var h = hash.replace(/^#/, '');
    if (IDS.indexOf(h) >= 0) return h;
    if (h === 'form-diagnostic') return 's8';
    return h;
  }

  function chapterIdFromHash(hash) {
    var h = hash.replace(/^#/, '');
    if (IDS.indexOf(h) >= 0) return h;
    if (h === 'form-diagnostic') return 's8';
    var el = document.getElementById(h);
    if (!el) return 's1';
    var sec = el.closest && el.closest('section.voyage-scene[id]');
    if (sec && sec.id) return sec.id;
    return 's1';
  }

  function showMarker(label) {
    var marker = ensureMarker();
    marker.textContent = label;
    marker.classList.add('visible');
    clearTimeout(marker._t);
    marker._t = setTimeout(function () {
      marker.classList.remove('visible');
    }, 2000);
  }

  function doScrollTo(el) {
    if (!el) return;
    var run = function () {
      el.scrollIntoView({ behavior: 'instant', block: 'start' });
    };
    if (hasViewTransitions() && !reducedMotion() && !sober()) {
      try {
        document.startViewTransition(run);
        return;
      } catch (e) {}
    }
    if (!reducedMotion() && !sober()) {
      var ov = document.createElement('div');
      ov.className = 'chapter-transition-overlay';
      document.body.appendChild(ov);
      requestAnimationFrame(function () {
        ov.classList.add('active');
        setTimeout(function () {
          run();
          setTimeout(function () {
            ov.classList.remove('active');
            setTimeout(function () {
              try {
                ov.remove();
              } catch (e2) {}
            }, 800);
          }, 400);
        }, 800);
      });
      return;
    }
    run();
  }

  function scrollToChapter(targetId, fromIdOpt) {
    var fromId = fromIdOpt || currentId;
    var el = scrollElementForChapter(targetId);
    if (!el) return;

    var label = MARKERS[targetId] || '';

    if (reducedMotion() || sober()) {
      doScrollTo(el);
      currentId = targetId;
      showMarker(label);
      updateDots();
      try {
        window.dispatchEvent(new CustomEvent('pinapp:chapterjump', { detail: { id: targetId, fromId: fromId } }));
      } catch (e0) {}
      return;
    }

    var breath = ensureBreath();
    breath.classList.add('active');

    var mid = function () {
      doScrollTo(el);
      currentId = targetId;
      showMarker(label);
      updateDots();
      try {
        window.dispatchEvent(new CustomEvent('pinapp:chapterjump', { detail: { id: targetId, fromId: fromId } }));
      } catch (e1) {}
    };

    var finishBreath = function () {
      breath.classList.remove('active');
    };

    var mc = window.__PINAPP_MATCHCUT__;
    if (mc && typeof mc.run === 'function') {
      mc.run(fromId, targetId, mid, finishBreath);
    } else {
      setTimeout(function () {
        mid();
        setTimeout(finishBreath, 300);
      }, 200);
    }
  }

  function updateDots() {
    var nav = document.getElementById('chapter-skip-nav');
    if (!nav) return;
    nav.querySelectorAll('a[data-chapter]').forEach(function (a) {
      a.classList.toggle('current', a.getAttribute('data-chapter') === currentId);
    });
  }

  function initSkipClick(nav) {
    nav.addEventListener(
      'click',
      function (ev) {
        var a = ev.target.closest && ev.target.closest('a[data-chapter]');
        if (!a || !nav.contains(a)) return;
        ev.preventDefault();
        var id = a.getAttribute('data-chapter');
        scrollToChapter(id, currentId);
      },
      { passive: false }
    );
  }

  function initInPageLinks() {
    document.addEventListener(
      'click',
      function (ev) {
        var a = ev.target.closest && ev.target.closest('a[href^="#"]');
        if (!a) return;
        var href = a.getAttribute('href');
        if (!href || href.length < 2) return;
        var id = chapterIdFromHash(href);
        if (IDS.indexOf(id) < 0) return;
        if (a.closest('#chapter-skip-nav')) return;
        var inVoyage = document.getElementById('voyage-main') && document.getElementById('voyage-main').contains(a);
        if (!inVoyage && !a.closest('.voyage-site-header') && !a.closest('.voyage-nav')) return;
        ev.preventDefault();
        scrollToChapter(id, currentId);
      },
      true
    );
  }

  function initScrollSpy() {
    if (typeof IntersectionObserver === 'undefined') return;
    var sections = IDS.map(function (id) {
      return document.getElementById(id);
    }).filter(Boolean);
    if (!sections.length) return;
    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting || en.intersectionRatio < 0.2) return;
          var sid = en.target.id;
          if (IDS.indexOf(sid) >= 0) {
            currentId = sid;
            updateDots();
          }
        });
      },
      { root: null, rootMargin: '-40% 0px -45% 0px', threshold: [0, 0.15, 0.25, 0.5] }
    );
    sections.forEach(function (sec) {
      obs.observe(sec);
    });
  }

  function init() {
    if (!document.getElementById('voyage-main')) return;
    ensureBreath();
    ensureMarker();
    var nav = ensureSkipNav();
    initSkipClick(nav);
    initInPageLinks();
    initScrollSpy();
    updateDots();
  }

  window.__PINAPP_CHAPTER_NAV__ = {
    scrollToChapter: scrollToChapter,
    getCurrentId: function () {
      return currentId;
    },
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 0);
  }
})();

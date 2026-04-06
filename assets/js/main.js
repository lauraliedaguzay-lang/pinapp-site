/**
 * PINAPP — main.js v4.1 (vanilla)
 */
(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  /* Spotlight curseur → variables --spot-x / --spot-y (lumière ambiante body::after) */
  if (!prefersReducedMotion && window.matchMedia('(min-width: 1024px)').matches) {
    var rootStyle = document.documentElement.style;
    var spotRaf = null;
    document.addEventListener(
      'mousemove',
      function (e) {
        if (spotRaf) return;
        spotRaf = window.requestAnimationFrame(function () {
          spotRaf = null;
          var x = (e.clientX / window.innerWidth) * 100;
          var y = (e.clientY / window.innerHeight) * 100;
          rootStyle.setProperty('--spot-x', x + '%');
          rootStyle.setProperty('--spot-y', y + '%');
        });
      },
      { passive: true }
    );
  }

  /* Ancre dans l’URL (#contenu-principal) : le loader fixe masque la cible au 1er paint ;
     après retrait du loader, on rescroll pour file:// et HTTPS. */
  function applyHashScroll() {
    var h = location.hash;
    if (!h || h.length < 2) return;
    var raw;
    try {
      raw = decodeURIComponent(h.slice(1).split('&')[0]);
    } catch (e) {
      return;
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(raw)) return;
    var el = document.getElementById(raw);
    if (!el) return;
    el.scrollIntoView({ behavior: 'auto', block: 'start' });
  }

  /* Loader : retrait au load + secours si une ressource bloque l’événement load */
  function dismissLoader() {
    var loader = document.getElementById('loader');
    if (!loader || loader.dataset.dismissed === '1') {
      window.setTimeout(applyHashScroll, 0);
      return;
    }
    loader.dataset.dismissed = '1';
    loader.classList.add('hidden');
    window.setTimeout(function () {
      if (loader && loader.parentNode) loader.remove();
      applyHashScroll();
    }, 300);
  }

  window.addEventListener('load', dismissLoader);
  window.addEventListener('load', function () {
    [450, 900].forEach(function (ms) {
      window.setTimeout(applyHashScroll, ms);
    });
  });

  function armLoaderFailsafe() {
    window.setTimeout(dismissLoader, 4000);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', armLoaderFailsafe);
  } else {
    armLoaderFailsafe();
  }

  /* Scroll progress */
  window.addEventListener(
    'scroll',
    function () {
      var max = document.body.scrollHeight - window.innerHeight;
      var p = max > 0 ? window.scrollY / max : 0;
      var bar = document.getElementById('scrollProgress');
      if (bar) bar.style.transform = 'scaleX(' + Math.min(1, Math.max(0, p)) + ')';
    },
    { passive: true }
  );

  /* Nav scroll-aware : masquage au scroll uniquement sur petit écran (évite « nav morte » sur bureau) */
  var navHideMq = window.matchMedia('(max-width: 767px)');
  var lastScroll = 0;
  function clearNavHiddenIfDesktop() {
    var nav = document.getElementById('mainNav');
    if (nav && !navHideMq.matches) nav.classList.remove('nav-hidden');
  }
  if (navHideMq.addEventListener) {
    navHideMq.addEventListener('change', clearNavHiddenIfDesktop);
  } else if (navHideMq.addListener) {
    navHideMq.addListener(clearNavHiddenIfDesktop);
  }
  window.addEventListener(
    'scroll',
    function () {
      var nav = document.getElementById('mainNav');
      if (!nav) return;
      if (!navHideMq.matches) {
        nav.classList.remove('nav-hidden');
        lastScroll = window.scrollY;
        return;
      }
      var current = window.scrollY;
      if (current > lastScroll && current > 100) {
        nav.classList.add('nav-hidden');
      } else {
        nav.classList.remove('nav-hidden');
      }
      lastScroll = current;
    },
    { passive: true }
  );

  /* Zéro scroll : pas d’IntersectionObserver pour révéler le contenu au fil du défilement */

  /* Hero — apparition initiale (chargement uniquement, pas lié au scroll) */
  function revealHero() {
    var root = document.querySelector('[data-chapter="invitation"]');
    if (!root) return;
    var els = root.querySelectorAll('.hero-el');
    var words = root.querySelectorAll('.hero-word');
    var delay = 0;
    els.forEach(function (el) {
      window.setTimeout(function () {
        el.classList.add('visible');
      }, delay);
      delay += 100;
    });
    words.forEach(function (el) {
      window.setTimeout(function () {
        el.classList.add('visible');
      }, delay);
      delay += 120;
    });
    var cta = root.querySelector('.hero-cta');
    if (cta) {
      window.setTimeout(function () {
        cta.classList.add('visible');
      }, delay);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', revealHero);
  } else {
    revealHero();
  }

  /* Thème clair / sombre (bouton nav + localStorage ; sinon réglage système) */
  function effectiveTheme() {
    var a = document.documentElement.getAttribute('data-theme');
    if (a === 'light' || a === 'dark') return a;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function syncThemeColorMeta() {
    var m = document.getElementById('pinapp-theme-color');
    if (!m) return;
    m.setAttribute('content', effectiveTheme() === 'light' ? '#FDF0F3' : '#050A14');
  }

  function setThemePreference(mode) {
    if (mode !== 'light' && mode !== 'dark') return;
    document.documentElement.setAttribute('data-theme', mode);
    try {
      localStorage.setItem('pinapp-theme', mode);
    } catch (e) {}
    syncThemeColorMeta();
  }

  function bindThemeToggle() {
    var btn = document.getElementById('themeToggle');
    if (!btn) return;
    function syncLabel() {
      var eff = effectiveTheme();
      btn.setAttribute(
        'aria-label',
        eff === 'light' ? 'Activer le mode sombre' : 'Activer le mode clair'
      );
      btn.setAttribute('title', btn.getAttribute('aria-label'));
    }
    syncLabel();
    syncThemeColorMeta();
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function () {
      try {
        if (!localStorage.getItem('pinapp-theme')) {
          syncLabel();
          syncThemeColorMeta();
        }
      } catch (e) {
        syncLabel();
        syncThemeColorMeta();
      }
    });
    btn.addEventListener('click', function () {
      setThemePreference(effectiveTheme() === 'light' ? 'dark' : 'light');
      syncLabel();
    });
  }

  bindThemeToggle();

  /* Cookies RGPD */
  var cookieBanner = document.getElementById('cookie-banner');
  if (!localStorage.getItem('cookie-consent') && cookieBanner) {
    cookieBanner.style.display = 'block';
  }
  var accept = document.getElementById('cookieAccept');
  var refuse = document.getElementById('cookieRefuse');
  if (accept) {
    accept.addEventListener('click', function () {
      localStorage.setItem('cookie-consent', 'accepted');
      if (cookieBanner) cookieBanner.style.display = 'none';
    });
  }
  if (refuse) {
    refuse.addEventListener('click', function () {
      localStorage.setItem('cookie-consent', 'refused');
      if (cookieBanner) cookieBanner.style.display = 'none';
    });
  }

  /* Parallaxe aurora : désactivée (règle Pinapp « zéro scroll » — pas de décor lié au scroll) */

  /* Menu mobile (drawer) */
  var burger = document.getElementById('burger');
  var drawer = document.getElementById('mobileDrawer');
  var drawerClose = document.getElementById('drawerClose');

  function setDrawer(open) {
    if (!drawer) return;
    drawer.classList.toggle('open', open);
    drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
    if (burger) {
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    }
    document.body.style.overflow = open ? 'hidden' : '';
  }

  if (burger && drawer) {
    burger.addEventListener('click', function () {
      setDrawer(!drawer.classList.contains('open'));
    });
  }
  if (drawerClose) {
    drawerClose.addEventListener('click', function () {
      setDrawer(false);
    });
  }
  if (drawer) {
    drawer.addEventListener('click', function (e) {
      if (e.target === drawer) setDrawer(false);
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawer && drawer.classList.contains('open')) {
      setDrawer(false);
    }
  });

  /* Filtre réalisations */
  var filterBtns = document.querySelectorAll('.filter-btn');
  var realisationCards = document.querySelectorAll('#realisationsGrid .realisation-card');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var f = btn.getAttribute('data-filter');
      filterBtns.forEach(function (b) {
        b.classList.remove('active');
      });
      btn.classList.add('active');
      realisationCards.forEach(function (card) {
        var cat = card.getAttribute('data-category') || '';
        var show = f === 'all' || cat === f;
        card.style.display = show ? '' : 'none';
      });
    });
  });

  /* Modal démo */
  var demoModal = document.getElementById('demoModal');
  var demoIframe = document.getElementById('demoIframe');
  var demoSkeleton = document.getElementById('demoSkeleton');
  var demoClose = document.getElementById('demoClose');

  function openDemo(url) {
    if (!demoModal || !demoIframe) return;
    demoModal.classList.add('open');
    demoModal.setAttribute('aria-hidden', 'false');
    demoIframe.style.display = 'none';
    if (demoSkeleton) demoSkeleton.style.display = 'flex';
    demoIframe.src = url;
    document.body.style.overflow = 'hidden';
  }

  function closeDemo() {
    if (!demoModal || !demoIframe) return;
    demoModal.classList.remove('open');
    demoModal.setAttribute('aria-hidden', 'true');
    demoIframe.src = '';
    demoIframe.style.display = 'none';
    if (demoSkeleton) demoSkeleton.style.display = 'flex';
    document.body.style.overflow = '';
  }

  if (demoIframe) {
    demoIframe.addEventListener('load', function () {
      if (demoSkeleton) demoSkeleton.style.display = 'none';
      demoIframe.style.display = 'block';
    });
  }

  document.querySelectorAll('.realisation-card[data-demo]').forEach(function (card) {
    card.addEventListener('click', function () {
      var url = card.getAttribute('data-demo');
      if (url) openDemo(url);
    });
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        var url = card.getAttribute('data-demo');
        if (url) openDemo(url);
      }
    });
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
  });

  if (demoClose) {
    demoClose.addEventListener('click', closeDemo);
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && demoModal && demoModal.classList.contains('open')) {
      closeDemo();
    }
  });

  /* Onboarding */
  var answers = {};
  var progressMap = { 1: 25, 2: 50, 3: 75, 4: 100 };
  var onboardingStage = document.getElementById('onboardingStage');
  var progressEl = document.getElementById('onboardingProgress');

  document.querySelectorAll('.pill-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var q = parseInt(btn.getAttribute('data-q'), 10);
      var val = btn.getAttribute('data-val');
      answers[q] = val;

      if (progressEl && progressMap[q]) {
        progressEl.style.width = progressMap[q] + '%';
      }

      var messages = { 1: 'Bien noté.', 2: 'Parfait.', 3: 'On y est presque.' };

      if (q < 4) {
        var msg = document.createElement('div');
        msg.className = 'transition-msg';
        msg.textContent = messages[q];
        msg.style.cssText =
          'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:18px;color:var(--accent-teal);pointer-events:none;';
        if (onboardingStage) onboardingStage.appendChild(msg);

        var qEl = document.getElementById('q' + q);
        if (qEl) qEl.classList.remove('active');
        window.setTimeout(function () {
          msg.remove();
          var next = document.getElementById('q' + (q + 1));
          if (next) next.classList.add('active');
        }, 700);
      } else {
        var q4 = document.getElementById('q4');
        if (q4) q4.classList.remove('active');
        if (progressEl) progressEl.style.width = '100%';

        var finMsg = document.getElementById('finMessage');
        if (finMsg && answers[4] === 'moins-1000') {
          finMsg.textContent =
            'Parfait pour notre Starter à 297€. Je reviens vers vous sous 24h.';
        }

        var qfin = document.getElementById('qfin');
        if (qfin) qfin.classList.add('active');

        /* CONFIGURATION MAKE/TALLY : POST JSON vers webhook */
        console.log('Réponses onboarding:', answers);
      }
    });
  });

  /* FAQ */
  document.querySelectorAll('.faq-trigger').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var item = trigger.closest('.faq-item');
      if (!item) return;
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(function (i) {
        i.classList.remove('open');
      });
      if (!isOpen) item.classList.add('open');
    });
  });

  /* Lead magnet — formation (page formation-gratuite / guide offert) */
  var leadBtn = document.getElementById('leadSubmit');
  var leadEmail = document.getElementById('leadEmail');
  if (leadBtn) {
    leadBtn.addEventListener('click', function () {
      var email = leadEmail && leadEmail.value ? leadEmail.value.trim() : '';
      if (!email) {
        if (leadEmail) leadEmail.focus();
        return;
      }
      /* CONFIGURATION : Make / Tally */
      console.log('Lead guide offert:', email);
    });
  }

  /* Particules hero (canvas) */
  function initParticles() {
    var canvas = document.getElementById('particles');
    if (!canvas || prefersReducedMotion) return;

    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var particles = [];
    var n = window.innerWidth < 768 ? 28 : 48;

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var w = canvas.offsetWidth;
      var h = canvas.offsetHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function spawn() {
      particles = [];
      for (var i = 0; i < n; i++) {
        particles.push({
          x: Math.random() * canvas.offsetWidth,
          y: Math.random() * canvas.offsetHeight,
          r: Math.random() * 1.2 + 0.3,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          a: Math.random() * 0.35 + 0.1,
        });
      }
    }

    function tick() {
      var w = canvas.offsetWidth;
      var h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      var teal = getComputedStyle(document.documentElement)
        .getPropertyValue('--accent-teal')
        .trim() || '#3EEBD6';

      particles.forEach(function (p) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath();
        ctx.fillStyle = teal;
        ctx.globalAlpha = p.a;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      requestAnimationFrame(tick);
    }

    resize();
    spawn();
    window.addEventListener('resize', function () {
      resize();
      spawn();
    });
    requestAnimationFrame(tick);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initParticles);
  } else {
    initParticles();
  }
})();

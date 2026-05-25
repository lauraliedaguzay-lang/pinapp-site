/* ============================================================
   PINAPP INC. — JS MASTER CORRECTIF V3
   Burger · Emojis SVG · Intro IA futuriste · Scroll-snap
   ============================================================ */
(function () {
  'use strict';

  function neuroCalmActive() {
    return (
      document.documentElement.getAttribute('data-pinapp-calm') === '1' ||
      (typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches)
    );
  }

  /** Si main.js est sur la page, il gère déjà burger · snap · dots · etc. — évite double toggle. */
  function pageUsesMainJs() {
    if (document.documentElement.getAttribute('data-pinapp-v3-full') === '1') return false;
    return !!document.querySelector('script[src*="main.js"]');
  }

  /* ── COOKIES + PLAUSIBLE (RGPD) ──
     Bannière injectée si absente · refus = pas de script · accept = chargement différé ── */
  var PLAUSIBLE_DOMAIN = 'pinapp.fr';
  var PLAUSIBLE_SRC = 'https://plausible.io/js/script.js';
  var COOKIE_STORAGE_KEY = 'cookie-consent';

  function pinappPlausibleStub() {
    return function () {
      (window.plausible.q = window.plausible.q || []).push(arguments);
    };
  }

  function pinappInjectPlausibleScript(onload) {
    if (document.querySelector('script[data-pinapp-plausible]')) {
      if (typeof onload === 'function') onload();
      return;
    }
    var s = document.createElement('script');
    s.defer = true;
    s.setAttribute('data-domain', PLAUSIBLE_DOMAIN);
    s.src = PLAUSIBLE_SRC;
    s.setAttribute('data-pinapp-plausible', '1');
    if (typeof onload === 'function') s.addEventListener('load', onload);
    document.head.appendChild(s);
  }

  function pinappEnsureCookieBanner() {
    var ban = document.getElementById('cookie-banner');
    if (ban) return ban;
    ban = document.createElement('div');
    ban.id = 'cookie-banner';
    ban.setAttribute('role', 'dialog');
    ban.setAttribute('aria-label', 'Cookies');
    ban.setAttribute('aria-describedby', 'cookie-banner-desc');
    ban.style.cssText =
      'position:fixed;bottom:0;left:0;right:0;padding:18px 16px;background:var(--bg-card,rgba(15,23,42,.96));border-top:1px solid var(--card-border,rgba(148,163,184,.25));backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);z-index:9500;display:none;';
    ban.innerHTML =
      '<div class="container" style="max-width:1100px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;">' +
      '<p id="cookie-banner-desc" style="font-size:13px;opacity:.88;max-width:640px;margin:0;line-height:1.55">Ce site utilise des cookies de mesure d\u2019audience anonymes (Plausible Analytics — sans tracking personnel).</p>' +
      '<div style="display:flex;gap:10px;flex-wrap:wrap;">' +
      '<button type="button" id="cookieAccept" class="btn btn-primary" style="font-size:13px;padding:10px 18px">Accepter</button>' +
      '<button type="button" id="cookieRefuse" class="btn btn-secondary" style="font-size:13px;padding:10px 18px">Refuser</button>' +
      '</div></div>';
    document.body.appendChild(ban);
    return ban;
  }

  function pinappWirePlausibleCta() {
    document.querySelectorAll('.btn-primary').forEach(function (b) {
      if (b.id === 'cookieAccept' || b.id === 'cookieRefuse') return;
      if (b.getAttribute('data-pinapp-cta-wired') === '1') return;
      b.setAttribute('data-pinapp-cta-wired', '1');
      b.addEventListener('click', function () {
        if (typeof window.plausible !== 'function') return;
        window.plausible('CTA Click', {
          props: { page: location.pathname, text: (b.textContent || '').trim() },
        });
      });
    });
  }

  function initCookieConsent() {
    if (window.__pinappCookieConsentInit) return;
    if (document.documentElement.getAttribute('data-pinapp-no-cookie') === '1') return;
    window.__pinappCookieConsentInit = true;

    var ban = pinappEnsureCookieBanner();
    if (!ban) return;

    var c = null;
    try {
      c = localStorage.getItem(COOKIE_STORAGE_KEY);
    } catch (e) {}

    if (c === 'refused') {
      window.plausible = function () {};
      ban.style.display = 'none';
      return;
    }

    window.plausible = window.plausible || pinappPlausibleStub();

    if (c === 'accepted') {
      ban.style.display = 'none';
      pinappInjectPlausibleScript(function () {
        pinappWirePlausibleCta();
      });
      return;
    }

    ban.style.display = 'flex';

    var acc = document.getElementById('cookieAccept');
    var ref = document.getElementById('cookieRefuse');

    function hideBanner() {
      ban.style.display = 'none';
    }

    if (acc)
      acc.addEventListener('click', function () {
        try {
          localStorage.setItem(COOKIE_STORAGE_KEY, 'accepted');
        } catch (e) {}
        pinappInjectPlausibleScript(function () {
          pinappWirePlausibleCta();
        });
        hideBanner();
      });

    if (ref)
      ref.addEventListener('click', function () {
        try {
          localStorage.setItem(COOKIE_STORAGE_KEY, 'refused');
        } catch (e) {}
        window.plausible = function () {};
        hideBanner();
      });
  }

  /* ── BURGER MOBILE ──
     Résout : "pas de menu burger sur iPhone" ── */
  function initBurger() {
    var burger = document.querySelector('.nav__burger');
    var drawer = document.querySelector('.nav__drawer');
    if (!burger || !drawer) return;

    // S'assurer que le burger est visible sur mobile
    burger.style.display = 'flex';
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Ouvrir le menu');

    burger.addEventListener('click', function () {
      var isOpen = drawer.classList.toggle('open');
      burger.classList.toggle('open', isOpen);
      burger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
      // Animer les barres burger
      var spans = burger.querySelectorAll('span');
      if (spans.length >= 3) {
        if (isOpen) {
          spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
          spans[1].style.opacity = '0';
          spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
          spans[0].style.transform = '';
          spans[1].style.opacity = '1';
          spans[2].style.transform = '';
        }
      }
    });

    // Fermer sur clic lien
    drawer.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        drawer.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        var spans = burger.querySelectorAll('span');
        spans.forEach(function (s) {
          s.style.transform = '';
          s.style.opacity = '1';
        });
      });
    });

    // Fermer sur clic extérieur
    document.addEventListener('click', function (e) {
      if (
        drawer.classList.contains('open') &&
        !drawer.contains(e.target) &&
        !burger.contains(e.target)
      ) {
        drawer.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        var spans = burger.querySelectorAll('span');
        spans.forEach(function (s) {
          s.style.transform = '';
          s.style.opacity = '1';
        });
      }
    });
  }

  /* ── EMOJIS → SVG ──
     Résout : "emojis iOS différents · zéro emoji site premium"
     PDF Audit : Arnaud bloque les emojis ── */
  var SVG_ICONS = {
    '⏱': '<svg viewBox="0 0 40 40" fill="none" class="icon-svg" aria-hidden="true"><circle cx="20" cy="21" r="11" stroke="currentColor" stroke-width="1.5"/><path d="M20 16v5l3.5 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M16 8h8M20 8v3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    '🔗': '<svg viewBox="0 0 40 40" fill="none" class="icon-svg" aria-hidden="true"><path d="M17 23l6-6M14 22l-2 2a5 5 0 007 7l2-2M26 18l2-2a5 5 0 00-7-7l-2 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    '🌙': '<svg viewBox="0 0 40 40" fill="none" class="icon-svg" aria-hidden="true"><path d="M29 22a11 11 0 01-13-13 11 11 0 1013 13z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    '🖥': '<svg viewBox="0 0 40 40" fill="none" class="icon-svg" aria-hidden="true"><rect x="7" y="9" width="26" height="17" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M14 31h12M20 26v5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    '📅': '<svg viewBox="0 0 40 40" fill="none" class="icon-svg" aria-hidden="true"><rect x="7" y="11" width="26" height="22" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M7 18h26M15 7v6M25 7v6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    '🏠': '<svg viewBox="0 0 40 40" fill="none" class="icon-svg" aria-hidden="true"><path d="M8 20l12-11 12 11v13H8V20z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><rect x="15" y="24" width="10" height="9" stroke="currentColor" stroke-width="1.5"/></svg>',
    '📸': '<svg viewBox="0 0 40 40" fill="none" class="icon-svg" aria-hidden="true"><path d="M6 14a2 2 0 012-2h4l2-3h12l2 3h4a2 2 0 012 2v16a2 2 0 01-2 2H8a2 2 0 01-2-2V14z" stroke="currentColor" stroke-width="1.5"/><circle cx="20" cy="22" r="5" stroke="currentColor" stroke-width="1.5"/></svg>',
    '🎬': '<svg viewBox="0 0 40 40" fill="none" class="icon-svg" aria-hidden="true"><rect x="5" y="9" width="30" height="22" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M5 16h30M5 24h30M14 9v22M26 9v22" stroke="currentColor" stroke-width="1.5"/></svg>',
    '🎨': '<svg viewBox="0 0 40 40" fill="none" class="icon-svg" aria-hidden="true"><circle cx="20" cy="20" r="13" stroke="currentColor" stroke-width="1.5"/><circle cx="14" cy="16" r="2" fill="currentColor"/><circle cx="26" cy="16" r="2" fill="currentColor"/><circle cx="20" cy="26" r="2" fill="currentColor"/></svg>',
    '✨': '<svg viewBox="0 0 40 40" fill="none" class="icon-svg" aria-hidden="true"><path d="M20 8v24M8 20h24M12 12l16 16M28 12L12 28" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/><circle cx="20" cy="20" r="3" fill="currentColor"/></svg>',
    '💍': '<svg viewBox="0 0 40 40" fill="none" class="icon-svg" aria-hidden="true"><circle cx="20" cy="22" r="10" stroke="currentColor" stroke-width="1.5"/><path d="M15 12l2-4h6l2 4" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><circle cx="20" cy="9" r="2" stroke="currentColor" stroke-width="1.5"/></svg>',
    '🏢': '<svg viewBox="0 0 40 40" fill="none" class="icon-svg" aria-hidden="true"><rect x="8" y="6" width="24" height="28" stroke="currentColor" stroke-width="1.5"/><path d="M15 13h3M22 13h3M15 19h3M22 19h3M15 25h3M22 25h3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><rect x="16" y="30" width="8" height="4" stroke="currentColor" stroke-width="1.5"/></svg>',
  };

  function replaceEmojis() {
    var emojis = Object.keys(SVG_ICONS);
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    var nodes = [];
    var node;
    while ((node = walker.nextNode())) {
      emojis.forEach(function (emoji) {
        if (node.nodeValue && node.nodeValue.includes(emoji)) {
          nodes.push({ node: node, emoji: emoji });
        }
      });
    }
    nodes.forEach(function (item) {
      var parent = item.node.parentNode;
      if (!parent || parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE') return;
      var wrap = document.createElement('span');
      wrap.innerHTML = item.node.nodeValue.replace(item.emoji, SVG_ICONS[item.emoji]);
      parent.replaceChild(wrap, item.node);
    });
  }

  /* ── INTRO VECTORIELLE PREMIUM (pinapp.fr) ──
     Glyph Pinapp vectoriel : tracé + glow violet→periwinkle, ~2,3 s,
     skippable. Désactivée si prefers-reduced-motion. Une fois / session. ── */
  function initIntroIA() {
    if (sessionStorage.getItem('pinapp-intro-done')) return;
    var reduce =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      sessionStorage.setItem('pinapp-intro-done', '1');
      return;
    }

    var intro = document.getElementById('pinapp-intro');
    if (!intro) {
      var bodyPath =
        'M30 19 C42 19 47 29 47 38 C47 48 39 54 30 54 C21 54 13 48 13 38 C13 29 18 19 30 19 Z';
      intro = document.createElement('div');
      intro.id = 'pinapp-intro';
      intro.setAttribute('role', 'status');
      intro.setAttribute('aria-label', 'Pinapp');
      intro.innerHTML = [
        '<div class="pi-aura" aria-hidden="true"></div>',
        '<div class="pi-stage">',
        '  <svg class="pi-mark" viewBox="0 0 60 60" aria-hidden="true">',
        '    <defs>',
        '      <linearGradient id="piGrad" x1="14%" y1="6%" x2="78%" y2="100%">',
        '        <stop offset="0%" stop-color="#9A6BF2"/>',
        '        <stop offset="52%" stop-color="#7B5BEE"/>',
        '        <stop offset="100%" stop-color="#4A6CF0"/>',
        '      </linearGradient>',
        '      <clipPath id="piBody"><path d="' + bodyPath + '"/></clipPath>',
        '    </defs>',
        '    <g class="pi-crown" fill="url(#piGrad)">',
        '      <path d="M30 3 C33 9 33 16 30 22 C27 16 27 9 30 3 Z"/>',
        '      <path d="M30 22 C25 16 21 12 16 9 C21 8 27 12 30 20 Z"/>',
        '      <path d="M30 22 C35 16 39 12 44 9 C39 8 33 12 30 20 Z"/>',
        '      <path d="M30 23 C23 21 17 18 12 14 C18 13 26 16 30 22 Z"/>',
        '      <path d="M30 23 C37 21 43 18 48 14 C42 13 34 16 30 22 Z"/>',
        '    </g>',
        '    <path class="pi-body" fill="url(#piGrad)" d="' + bodyPath + '"/>',
        '    <path class="pi-bodyline" fill="none" stroke="url(#piGrad)" stroke-width="1.4" stroke-linecap="round" d="' +
          bodyPath +
          '"/>',
        '    <g class="pi-mesh" clip-path="url(#piBody)" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.45" stroke-linecap="round">',
        '      <path d="M9 24 L51 45"/><path d="M9 33 L51 54"/><path d="M9 42 L51 63"/><path d="M9 51 L51 72"/>',
        '      <path d="M51 24 L9 45"/><path d="M51 33 L9 54"/><path d="M51 42 L9 63"/><path d="M51 51 L9 72"/>',
        '    </g>',
        '  </svg>',
        '  <div class="pi-word">pinapp</div>',
        '</div>',
        '<button class="pi-skip" id="pi-skip" type="button">Passer</button>',
      ].join('');

      var style = document.createElement('style');
      style.textContent = [
        '#pinapp-intro{position:fixed;inset:0;z-index:99999;display:flex;flex-direction:column;align-items:center;justify-content:center;background:radial-gradient(120% 90% at 50% 42%,#161329 0%,#0b0c12 58%,#08080d 100%);opacity:1;transition:opacity .7s ease}',
        '#pinapp-intro.pi-out{opacity:0;pointer-events:none}',
        '#pinapp-intro.pi-gone{display:none}',
        '.pi-aura{position:absolute;width:min(62vw,520px);aspect-ratio:1;border-radius:50%;background:radial-gradient(circle,rgba(142,106,216,.34),rgba(109,143,234,.12) 45%,transparent 70%);filter:blur(8px);transform:scale(.6);opacity:0;animation:pi-aura 2.2s ease forwards}',
        '@keyframes pi-aura{16%{opacity:1;transform:scale(1)}78%{opacity:.9}100%{opacity:0;transform:scale(1.16)}}',
        '.pi-stage{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;gap:22px;will-change:transform;animation:pi-stage 2.3s ease forwards}',
        '@keyframes pi-stage{0%,82%{transform:scale(1)}100%{transform:scale(1.05)}}',
        '.pi-mark{width:clamp(86px,12vw,124px);height:auto;filter:drop-shadow(0 0 26px rgba(142,106,216,.55));opacity:0;transform:scale(.86);animation:pi-mark .7s cubic-bezier(.2,.7,.2,1) .05s forwards}',
        '@keyframes pi-mark{0%{opacity:0;transform:scale(.86)}100%{opacity:1;transform:scale(1)}}',
        '.pi-crown path{opacity:0;transform-box:fill-box;transform-origin:center bottom;animation:pi-crown .5s ease forwards}',
        '.pi-crown path:nth-child(1){animation-delay:.30s}.pi-crown path:nth-child(2){animation-delay:.38s}.pi-crown path:nth-child(3){animation-delay:.38s}.pi-crown path:nth-child(4){animation-delay:.46s}.pi-crown path:nth-child(5){animation-delay:.46s}',
        '@keyframes pi-crown{0%{opacity:0;transform:translateY(5px) scale(.8)}100%{opacity:1;transform:translateY(0) scale(1)}}',
        '.pi-body{opacity:0;animation:pi-fade .6s ease .35s forwards}',
        '.pi-bodyline{stroke-dasharray:160;stroke-dashoffset:160;animation:pi-draw .9s cubic-bezier(.6,0,.2,1) .05s forwards}',
        '@keyframes pi-draw{100%{stroke-dashoffset:0}}',
        '.pi-mesh{opacity:0;animation:pi-fade .6s ease .55s forwards}',
        '@keyframes pi-fade{to{opacity:1}}',
        '.pi-word{font-family:"Geist",Poppins,-apple-system,BlinkMacSystemFont,sans-serif;font-weight:600;font-size:clamp(22px,4.5vw,34px);text-transform:lowercase;padding-left:.22em;background:linear-gradient(92deg,#A88BE0,#8E6AD8 45%,#6D8FEA);-webkit-background-clip:text;background-clip:text;color:transparent;opacity:0;animation:pi-word .75s cubic-bezier(.2,.7,.2,1) .55s forwards}',
        '@keyframes pi-word{0%{opacity:0;transform:translateY(12px);filter:blur(7px);letter-spacing:.4em}100%{opacity:1;transform:translateY(0);filter:blur(0);letter-spacing:.22em}}',
        '.pi-skip{position:fixed;bottom:max(env(safe-area-inset-bottom,0px),22px);right:22px;background:rgba(255,255,255,.04);border:1px solid rgba(168,139,224,.28);border-radius:100px;color:rgba(244,241,234,.66);font:500 12px/1 "Geist",system-ui,sans-serif;letter-spacing:.1em;text-transform:uppercase;padding:11px 18px;min-height:40px;cursor:pointer;opacity:0;animation:pi-fade .5s ease 1s forwards;transition:color .2s,border-color .2s,background .2s}',
        '.pi-skip:hover,.pi-skip:focus-visible{color:#F4F1EA;border-color:rgba(168,139,224,.6);background:rgba(168,139,224,.12)}',
      ].join('');
      document.head.appendChild(style);
      document.body.insertBefore(intro, document.body.firstChild);
    }

    var skipBtn = document.getElementById('pi-skip');
    var closed = false;
    var autoT;

    function closeIntro() {
      if (closed) return;
      closed = true;
      clearTimeout(autoT);
      intro.classList.add('pi-out');
      setTimeout(function () {
        intro.classList.add('pi-gone');
      }, 750);
      sessionStorage.setItem('pinapp-intro-done', '1');
    }

    autoT = setTimeout(closeIntro, 2350);
    if (skipBtn) skipBtn.addEventListener('click', closeIntro);
    intro.addEventListener('click', function (e) {
      if (e.target === intro) closeIntro();
    });
  }

  /* ── SCROLL-SNAP FIX SAFARI ──
     Résout : sections ne snappent pas sur iPhone ── */
  function initScrollSnap() {
    var container = document.querySelector('.snap-container');
    if (!container) return;
    // Forcer le recalcul après chargement
    setTimeout(function () {
      container.style.scrollSnapType = 'none';
      requestAnimationFrame(function () {
        container.style.scrollSnapType = 'y mandatory';
      });
    }, 300);
  }

  /* ── NAVIGATION DOTS ── */
  function initNavDots() {
    var dots = document.querySelectorAll('.nav-dot');
    var sections = document.querySelectorAll('.snap-section');
    var container = document.querySelector('.snap-container');
    if (!dots.length || !container) return;

    container.addEventListener(
      'scroll',
      function () {
        var mid = container.scrollTop + container.clientHeight / 2;
        var active = 0;
        sections.forEach(function (s, i) {
          if (s.offsetTop <= mid) active = i;
        });
        dots.forEach(function (d, i) {
          d.classList.toggle('active', i === active);
        });
      },
      { passive: true },
    );

    dots.forEach(function (d, i) {
      d.addEventListener('click', function () {
        if (sections[i]) sections[i].scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  /* ── PROGRESS BAR ── */
  function initProgress() {
    var prog = document.getElementById('progress');
    var container = document.querySelector('.snap-container');
    if (!prog || !container) return;
    container.addEventListener(
      'scroll',
      function () {
        var total = container.scrollHeight - container.clientHeight;
        prog.style.width = total > 0 ? (container.scrollTop / total) * 100 + '%' : '0%';
      },
      { passive: true },
    );
  }

  /* ── ANIMATIONS INTERSECTION OBSERVER ── */
  function initAnimations() {
    var elems = document.querySelectorAll('.anim-fade,.anim-up,.anim-scale,.anim-left,.anim-right');
    if (!elems.length) return;
    if (neuroCalmActive()) {
      elems.forEach(function (el) {
        el.classList.add('visible');
      });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            var delay = parseInt(e.target.dataset.delay || 0);
            setTimeout(function () {
              e.target.classList.add('visible');
            }, delay);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );
    elems.forEach(function (el) {
      io.observe(el);
    });
  }

  /* ── COUNT-UP ── */
  function initCountUp() {
    document.querySelectorAll('.count-up').forEach(function (el) {
      var target = parseInt(el.dataset.target, 10);
      if (!target) return;
      if (neuroCalmActive()) {
        el.textContent = target.toLocaleString('fr-FR');
        return;
      }
      var io = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        var t0 = performance.now();
        var dur = 1800;
        function step(now) {
          var p = Math.min((now - t0) / dur, 1);
          var e = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(e * target).toLocaleString('fr-FR');
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
      io.observe(el);
    });
  }

  /* ── CAROUSEL MICHA ── */
  function initCarousel() {
    document.querySelectorAll('.carousel-wrap').forEach(function (wrap) {
      var track = wrap.querySelector('.carousel-track');
      var prev = wrap.querySelector('.carousel-prev');
      var next = wrap.querySelector('.carousel-next');
      if (!track) return;
      var current = 0;
      var itemW = 256;

      function scrollTo(i) {
        var max = track.children.length - 1;
        current = Math.max(0, Math.min(i, max));
        track.style.transform = 'translateX(-' + current * itemW + 'px)';
      }

      if (prev)
        prev.addEventListener('click', function () {
          scrollTo(current - 1);
        });
      if (next)
        next.addEventListener('click', function () {
          scrollTo(current + 1);
        });

      // Swipe touch
      var startX = 0;
      track.addEventListener(
        'touchstart',
        function (e) {
          startX = e.touches[0].clientX;
        },
        { passive: true },
      );
      track.addEventListener(
        'touchend',
        function (e) {
          var diff = startX - e.changedTouches[0].clientX;
          if (Math.abs(diff) > 50) scrollTo(diff > 0 ? current + 1 : current - 1);
        },
        { passive: true },
      );

      // Filtres catégories
      wrap.querySelectorAll('.carousel-cat').forEach(function (cat) {
        cat.addEventListener('click', function () {
          wrap.querySelectorAll('.carousel-cat').forEach(function (c) {
            c.classList.remove('active');
          });
          cat.classList.add('active');
          var sel = cat.dataset.cat;
          Array.from(track.children).forEach(function (item) {
            item.style.display = sel === 'tous' || item.dataset.cat === sel ? '' : 'none';
          });
          current = 0;
          track.style.transform = 'translateX(0)';
        });
      });
    });
  }

  /* ── LIGHTBOX ── */
  function initLightbox() {
    var lb = document.getElementById('lightbox');
    if (!lb) return;
    document.querySelectorAll('.carousel-item[data-src]').forEach(function (item) {
      item.addEventListener('click', function () {
        var img = lb.querySelector('img');
        if (img) {
          img.src = item.dataset.src;
          img.alt = item.dataset.alt || '';
        }
        lb.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });
    lb.addEventListener('click', function (e) {
      if (e.target === lb || e.target.classList.contains('lightbox-close')) {
        lb.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lb.classList.contains('open')) {
        lb.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  /* ── Loader cinéma (vidéo d’accueil dans l’encart) : fermeture unifiée si pas de script inline ── */
  /* ── Signature UX : calque lumière pilotée par le pointeur (desktop calme) ── */
  function initSignatureUx() {
    if (typeof document === 'undefined' || !document.body) return;
    var calm = neuroCalmActive();
    var finePointer =
      typeof matchMedia !== 'undefined' && matchMedia('(hover: hover) and (pointer: fine)').matches;
    document.documentElement.setAttribute('data-pinapp-ux', calm || !finePointer ? 'calm' : '1');
    if (calm || !finePointer) return;

    var layer = document.getElementById('pinapp-signature-atmosphere');
    if (!layer) {
      layer = document.createElement('div');
      layer.id = 'pinapp-signature-atmosphere';
      layer.setAttribute('aria-hidden', 'true');
      var loader = document.getElementById('pandora-loader') || document.getElementById('loader');
      if (loader && loader.parentNode === document.body) {
        loader.insertAdjacentElement('afterend', layer);
      } else {
        document.body.insertAdjacentElement('afterbegin', layer);
      }
    }

    var root = document.documentElement;
    var ticking = false;
    var mx = 0;
    var my = 0;
    document.addEventListener(
      'mousemove',
      function (e) {
        mx = e.clientX;
        my = e.clientY;
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () {
          ticking = false;
          root.style.setProperty('--pinapp-glow-x', mx + 'px');
          root.style.setProperty('--pinapp-glow-y', my + 'px');
        });
      },
      { passive: true },
    );

    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      if (a.getAttribute('data-pinapp-hash-smooth') === '1') return;
      a.setAttribute('data-pinapp-hash-smooth', '1');
      a.addEventListener('click', function (e) {
        var href = a.getAttribute('href');
        if (!href || href === '#' || href.length < 2) return;
        var id = href.slice(1);
        var target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        try {
          history.pushState(null, '', href);
        } catch (_err) {}
      });
    });
  }

  function initCinemaLoader() {
    var l = document.getElementById('pandora-loader') || document.getElementById('loader');
    if (!l || !l.classList.contains('pinapp-cinema-loader')) return;
    if (l.getAttribute('data-pinapp-loader-dismiss') === '1') return;
    l.setAttribute('data-pinapp-loader-dismiss', '1');
    var done = false;
    function dismiss() {
      if (done) return;
      if (!l || !l.parentNode) {
        done = true;
        return;
      }
      done = true;
      var v = l.querySelector('video');
      if (v) {
        try {
          v.pause();
        } catch (_e) {}
      }
      l.style.opacity = '0';
      l.style.pointerEvents = 'none';
      setTimeout(function () {
        if (l.parentNode) l.remove();
      }, 440);
    }
    if (neuroCalmActive()) {
      setTimeout(dismiss, 380);
      return;
    }
    window.addEventListener('load', function () {
      setTimeout(dismiss, 320);
    });
    setTimeout(dismiss, 9000);
  }

  /* ── INIT ── */
  document.addEventListener('DOMContentLoaded', function () {
    if (typeof window.pinappA11yBootstrapRun === 'function') window.pinappA11yBootstrapRun();
    initCookieConsent();
    initCinemaLoader();
    initSignatureUx();
    var mainPresent = pageUsesMainJs();
    if (!mainPresent) {
      initBurger();
      initScrollSnap();
      initNavDots();
      initProgress();
      initAnimations();
      initCountUp();
      initCarousel();
      initLightbox();
    }
    replaceEmojis();
    initIntroIA();
  });
})();

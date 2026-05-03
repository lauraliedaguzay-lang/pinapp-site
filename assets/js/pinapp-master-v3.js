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

  /* Splash #pinapp-intro (« SYSTÈME ACTIF ») retiré — PR-AA mai 2026 */
  function initIntroIA() {}

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

/* PINAPP INC. — JS MASTER FINAL V4 */
(function () {
  'use strict';

  /* ── BURGER : délégué à /assets/js/main.js (évite double toggle avec ce fichier) ── */
  function initBurger() {}

  /* ── EMOJIS → SVG ── */
  var SVGS = {
    '⏱': '<svg viewBox="0 0 40 40" fill="none" class="icon-svg" aria-hidden="true"><circle cx="20" cy="22" r="11" stroke="currentColor" stroke-width="1.5"/><path d="M20 17v5l3.5 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M16 9h8M20 9v3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    '🔗': '<svg viewBox="0 0 40 40" fill="none" class="icon-svg" aria-hidden="true"><path d="M17 23l6-6M14 22l-2 2a5 5 0 007 7l2-2M26 18l2-2a5 5 0 00-7-7l-2 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    '🌙': '<svg viewBox="0 0 40 40" fill="none" class="icon-svg" aria-hidden="true"><path d="M29 22a11 11 0 01-13-13 11 11 0 1013 13z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    '🖥': '<svg viewBox="0 0 40 40" fill="none" class="icon-svg" aria-hidden="true"><rect x="7" y="9" width="26" height="17" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M14 31h12M20 26v5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    '📅': '<svg viewBox="0 0 40 40" fill="none" class="icon-svg" aria-hidden="true"><rect x="7" y="11" width="26" height="22" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M7 18h26M15 7v6M25 7v6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    '🏠': '<svg viewBox="0 0 40 40" fill="none" class="icon-svg" aria-hidden="true"><path d="M8 20l12-11 12 11v13H8V20z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><rect x="15" y="24" width="10" height="9" stroke="currentColor" stroke-width="1.5"/></svg>',
  };
  function replaceEmojis() {
    Object.keys(SVGS).forEach(function (e) {
      var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      var nodes = [];
      var n;
      while ((n = w.nextNode())) if (n.nodeValue && n.nodeValue.includes(e)) nodes.push(n);
      nodes.forEach(function (n) {
        var p = n.parentNode;
        if (!p || p.tagName === 'SCRIPT' || p.tagName === 'STYLE') return;
        var s = document.createElement('span');
        s.innerHTML = n.nodeValue.replace(e, SVGS[e]);
        p.replaceChild(s, n);
      });
    });
  }

  /* ── INTRO IA ── */
  function initIntroIA() {
    if (sessionStorage.getItem('p-intro')) return;
    var st = document.createElement('style');
    st.textContent =
      '#pi{position:fixed;inset:0;z-index:9999;background:#020408;display:flex;align-items:center;justify-content:center;flex-direction:column;transition:opacity .8s}#pi.out{opacity:0;pointer-events:none}#pi.gone{display:none}.pi-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(0,229,176,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,229,176,.03) 1px,transparent 1px);background-size:40px 40px}.pi-scan{position:absolute;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(0,229,176,.8),transparent);box-shadow:0 0 20px rgba(0,229,176,.4);animation:scan 3s linear infinite}@keyframes scan{0%{top:0}100%{top:100%}}.pi-cnt{position:relative;z-index:1;text-align:center;max-width:540px;padding:0 24px}.pi-badge{display:inline-flex;align-items:center;gap:8px;padding:5px 14px;border:1px solid rgba(0,229,176,.2);border-radius:100px;margin-bottom:40px;background:rgba(0,229,176,.05);font-size:10px;letter-spacing:.20em;text-transform:uppercase;color:#00e5b0;font-family:-apple-system,sans-serif}.pi-dot{width:6px;height:6px;border-radius:50%;background:#00e5b0;box-shadow:0 0 8px #00e5b0;animation:pd 1s ease-in-out infinite}@keyframes pd{0%,100%{opacity:1}50%{opacity:.2}}#pi-txt{font-family:-apple-system,BlinkMacSystemFont,sans-serif;font-size:clamp(20px,5vw,36px);font-weight:300;color:#f0f8ff;line-height:1.4;letter-spacing:-.02em;min-height:110px;display:flex;align-items:center;justify-content:center}.pi-cur{font-size:28px;color:#00e5b0;animation:pc .8s step-end infinite;margin-top:8px}@keyframes pc{0%,100%{opacity:1}50%{opacity:0}}.pi-skip{position:fixed;bottom:max(env(safe-area-inset-bottom,0px),24px);right:24px;background:transparent;border:1px solid rgba(0,229,176,.2);border-radius:100px;color:rgba(240,248,255,.4);font-family:-apple-system,sans-serif;font-size:12px;letter-spacing:.08em;padding:8px 16px;cursor:pointer;min-height:44px;transition:color .2s,border-color .2s}.pi-skip:hover{color:#f0f8ff;border-color:rgba(0,229,176,.5)}';
    document.head.appendChild(st);
    var el = document.createElement('div');
    el.id = 'pi';
    el.innerHTML =
      '<div class="pi-grid" aria-hidden="true"></div><div class="pi-scan" aria-hidden="true"></div><div class="pi-cnt"><div class="pi-badge"><span class="pi-dot"></span>PINAPP · SYSTÈME ACTIF</div><div id="pi-txt"></div><div class="pi-cur" aria-hidden="true">_</div></div><button class="pi-skip" id="pi-skip">Passer →</button>';
    document.body.insertBefore(el, document.body.firstChild);
    var txt = document.getElementById('pi-txt');
    var lines = [
      { t: 'Bienvenue.', d: 600 },
      { t: "Chaque outil a sa place.<br/>Nous la structurons.", d: 2200 },
      { t: "Le problème n'est plus<br/>le manque d'outils.", d: 4400 },
      { t: "C'est le manque de structure.", d: 6400 },
      { t: 'Nous construisons la structure.<br/>Vous récoltez.', d: 8200 },
      { t: 'Pinapp', d: 10000 },
    ];
    var timers = [];
    function show(l) {
      txt.style.opacity = '0';
      txt.style.transition = 'opacity .4s';
      setTimeout(function () {
        txt.innerHTML = l.t;
        txt.style.opacity = '1';
      }, 400);
    }
    lines.forEach(function (l) {
      timers.push(
        setTimeout(function () {
          show(l);
        }, l.d),
      );
    });
    function close() {
      timers.forEach(clearTimeout);
      el.classList.add('out');
      setTimeout(function () {
        el.classList.add('gone');
      }, 900);
      sessionStorage.setItem('p-intro', '1');
    }
    timers.push(setTimeout(close, 12000));
    document.getElementById('pi-skip').addEventListener('click', close);
  }

  /* ── SCROLL-SNAP FIX ── */
  function fixSnap() {
    var c = document.querySelector('.snap-container');
    if (!c) return;
    setTimeout(function () {
      c.style.scrollSnapType = 'none';
      requestAnimationFrame(function () {
        c.style.scrollSnapType = 'y mandatory';
      });
    }, 300);
  }

  /* ── ANIMATIONS ── */
  function initAnim() {
    var els = document.querySelectorAll('.anim-fade,.anim-up,.anim-scale,.anim-left,.anim-right');
    if (!els.length) return;
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            setTimeout(
              function () {
                e.target.classList.add('visible');
              },
              parseInt(e.target.dataset.delay || 0),
            );
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );
    els.forEach(function (el) {
      io.observe(el);
    });
  }

  /* ── COUNT-UP ── */
  function initCountUp() {
    document.querySelectorAll('.count-up').forEach(function (el) {
      var t = parseInt(el.dataset.target, 10);
      if (!t) return;
      var io = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        var t0 = performance.now(),
          dur = 1800;
        (function step(now) {
          var p = Math.min((now - t0) / dur, 1),
            e = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(e * t).toLocaleString('fr-FR');
          if (p < 1) requestAnimationFrame(step);
        })(t0);
      });
      io.observe(el);
    });
  }

  /* ── PROGRESS + NAV HIDE ── */
  function initNav() {
    var prog = document.getElementById('progress');
    var nav = document.querySelector('.nav');
    var c = document.querySelector('.snap-container');
    if (!c) return;
    var last = 0;
    c.addEventListener(
      'scroll',
      function () {
        var y = c.scrollTop,
          h = c.scrollHeight - c.clientHeight;
        if (prog) prog.style.width = h > 0 ? (y / h) * 100 + '%' : '0%';
        if (nav) {
          nav.classList.toggle('hidden', y > last && y > 80);
          last = y;
        }
      },
      { passive: true },
    );
  }

  /* ── NAV DOTS ── */
  function initDots() {
    var dots = document.querySelectorAll('.nav-dot');
    var sects = document.querySelectorAll('.snap-section');
    var c = document.querySelector('.snap-container');
    if (!dots.length || !c) return;
    c.addEventListener(
      'scroll',
      function () {
        var mid = c.scrollTop + c.clientHeight / 2,
          act = 0;
        sects.forEach(function (s, i) {
          if (s.offsetTop <= mid) act = i;
        });
        dots.forEach(function (d, i) {
          d.classList.toggle('active', i === act);
        });
      },
      { passive: true },
    );
    dots.forEach(function (d, i) {
      d.addEventListener('click', function () {
        sects[i] && sects[i].scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  /* ── INIT ── */
  document.addEventListener('DOMContentLoaded', function () {
    initBurger();
    replaceEmojis();
    initIntroIA();
    fixSnap();
    initAnim();
    initCountUp();
    initNav();
    initDots();
  });
})();

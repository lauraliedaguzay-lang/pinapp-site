/**
 * Pinapp.fr — GSAP + ScrollTrigger + Lenis + effets Awwwards
 * Charge les CDN dans l'ordre, puis initialise (CURSOR_PINAPP_10_SUR_10)
 */
(function () {
  if (window.__PINAPP_AWWARDS__) return;
  window.__PINAPP_AWWARDS__ = true;

  var V = '20260217';
  var prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isMobile = window.matchMedia('(max-width: 767px)').matches;
  var customCursorOn =
    !prefersReduce && !isMobile && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  function loadScript(src, onload) {
    var s = document.createElement('script');
    s.src = src;
    s.crossOrigin = 'anonymous';
    s.onload = onload;
    s.onerror = function () {
      console.warn('[pinapp-awwards] Échec chargement', src);
      if (onload) onload();
    };
    document.head.appendChild(s);
  }

  function ensureCursorDom() {
    if (document.getElementById('pp-cursor-dot')) return;
    var dot = document.createElement('div');
    dot.id = 'pp-cursor-dot';
    dot.className = 'pp-cursor-dot';
    dot.setAttribute('aria-hidden', 'true');
    var ring = document.createElement('div');
    ring.id = 'pp-cursor-circle';
    ring.className = 'pp-cursor-circle';
    ring.setAttribute('aria-hidden', 'true');
    var lab = document.createElement('span');
    lab.className = 'pp-cursor-circle__label';
    lab.textContent = 'Voir';
    ring.appendChild(lab);
    document.body.appendChild(dot);
    document.body.appendChild(ring);
  }

  function splitText(el) {
    if (!el || el.dataset.ppSplitDone) return;
    if (el.querySelector('.word, .char')) return;
    if (el.children.length > 0) return;
    var text = el.textContent;
    if (!text || !text.trim()) return;
    el.textContent = '';
    for (var i = 0; i < text.length; i++) {
      var c = text.charAt(i);
      var span = document.createElement('span');
      span.className = 'char';
      span.style.display = 'inline-block';
      if (prefersReduce) {
        span.style.opacity = '1';
        span.style.transform = 'none';
      } else {
        span.style.opacity = '0';
        span.style.transform = 'translateY(100%)';
      }
      if (c === ' ') span.innerHTML = '&nbsp;';
      else span.textContent = c;
      el.appendChild(span);
    }
    el.dataset.ppSplitDone = '1';
  }

  function wrapPortfolioCards() {
    document.querySelectorAll('.realisation-card > img').forEach(function (img) {
      if (img.dataset.ppWrapped) return;
      var card = img.closest('.realisation-card');
      if (!card) return;
      img.dataset.ppWrapped = '1';
      var reveal = document.createElement('div');
      reveal.className = 'pp-reveal';
      reveal.style.overflow = 'hidden';
      reveal.style.height = img.style.height || '220px';
      var par = document.createElement('div');
      par.className = 'pp-parallax';
      img.parentNode.insertBefore(reveal, img);
      reveal.appendChild(par);
      par.appendChild(img);
    });
  }

  function wrapHomeFilmsStrip() {
    var strip = document.querySelector('.pinapp-films-ia-strip');
    if (!strip) return;
    strip.querySelectorAll('[role="listitem"]').forEach(function (item) {
      var inner = item.querySelector('div[style*="aspect-ratio"]');
      if (!inner || inner.closest('.pp-reveal')) return;
      var reveal = document.createElement('div');
      reveal.className = 'pp-reveal';
      reveal.style.borderRadius = '14px';
      inner.parentNode.insertBefore(reveal, inner);
      inner.classList.add('pp-reveal__target');
      reveal.appendChild(inner);
    });
  }

  function wrapHomePresVideo() {
    var box = document.getElementById('pinapp-home-pres-video');
    if (!box || box.dataset.ppRevealWrapped) return;
    box.dataset.ppRevealWrapped = '1';
    box.classList.add('pp-reveal', 'pp-reveal__target');
  }

  function initAfterLibs() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('[pinapp-awwards] GSAP / ScrollTrigger indisponible');
      return;
    }
    gsap.registerPlugin(ScrollTrigger);

    var lenis = null;
    if (!prefersReduce && typeof Lenis !== 'undefined') {
      lenis = new Lenis({
        duration: 1.2,
        easing: function (t) {
          return Math.min(1, 1.001 - Math.pow(2, -10 * t));
        },
        smoothWheel: true,
      });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (time) {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }

    wrapPortfolioCards();
    wrapHomeFilmsStrip();
    wrapHomePresVideo();

    document.querySelectorAll('.pp-testi-card, .pp-pnk-card').forEach(function (c) {
      c.classList.add('pp-fade');
    });

    document.querySelectorAll('.pp-split').forEach(splitText);

    if (!prefersReduce) {
      document.querySelectorAll('.pp-split').forEach(function (el) {
        var chars = el.querySelectorAll('.char');
        if (!chars.length) return;
        gsap.to(chars, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.02,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%' },
        });
      });

      document.querySelectorAll('.pp-line').forEach(function (line) {
        gsap.from(line, {
          scaleX: 0,
          transformOrigin: 'left center',
          duration: 1.5,
          ease: 'power3.inOut',
          scrollTrigger: { trigger: line, start: 'top 85%' },
        });
      });

      document.querySelectorAll('.pp-reveal').forEach(function (wrap) {
        var target = wrap.classList.contains('pp-reveal__target')
          ? wrap
          : wrap.querySelector('.pp-reveal__target') ||
            wrap.querySelector('img') ||
            wrap.querySelector('video');
        if (!target) return;
        var sc = target === wrap && wrap.classList.contains('pp-reveal__target') ? 1.05 : 1.12;
        gsap.fromTo(
          target,
          { clipPath: 'inset(100% 0 0 0)', scale: sc },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            scale: 1,
            duration: 1.15,
            ease: 'power4.inOut',
            scrollTrigger: { trigger: wrap, start: 'top 82%', once: true },
          },
        );
      });

      document.querySelectorAll('.pp-parallax').forEach(function (el) {
        var tr = el.closest('section') || el.closest('.realisation-card') || el.parentElement;
        gsap.to(el, {
          y: -80,
          ease: 'none',
          scrollTrigger: {
            trigger: tr || el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      });

      document.querySelectorAll('.pp-fade').forEach(function (el) {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.75,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%' },
        });
      });
    }

    if (!isMobile && !prefersReduce) {
      document.querySelectorAll('.pp-magnetic').forEach(function (btn) {
        btn.addEventListener('mousemove', function (e) {
          var rect = btn.getBoundingClientRect();
          var x = e.clientX - rect.left - rect.width / 2;
          var y = e.clientY - rect.top - rect.height / 2;
          gsap.to(btn, { x: x * 0.2, y: y * 0.2, duration: 0.3, ease: 'power2.out' });
        });
        btn.addEventListener('mouseleave', function () {
          gsap.to(btn, { x: 0, y: 0, duration: 0.65, ease: 'elastic.out(1, 0.5)' });
        });
      });
    }

    if (customCursorOn) {
      ensureCursorDom();
      document.documentElement.setAttribute('data-pinapp-awwards', 'on');
      var dot = document.getElementById('pp-cursor-dot');
      var ring = document.getElementById('pp-cursor-circle');
      var mx = 0,
        my = 0,
        rx = 0,
        ry = 0,
        mode = 'default';

      document.addEventListener(
        'mousemove',
        function (e) {
          mx = e.clientX;
          my = e.clientY;
        },
        { passive: true },
      );

      function setMode(m) {
        mode = m;
        if (!ring || !dot) return;
        ring.classList.remove('is-link', 'is-media');
        dot.classList.remove('is-off');
        if (m === 'link') {
          ring.classList.add('is-link');
          dot.classList.add('is-off');
        } else if (m === 'media') {
          ring.classList.add('is-media');
          dot.classList.add('is-off');
        }
      }

      function loop() {
        rx += (mx - rx) * 0.12;
        ry += (my - ry) * 0.12;
        if (dot) dot.style.transform = 'translate(' + mx + 'px,' + my + 'px)';
        if (ring) ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px)';
        requestAnimationFrame(loop);
      }
      loop();

      document.querySelectorAll('a, button, .pp-magnetic').forEach(function (el) {
        el.addEventListener('mouseenter', function () {
          setMode('link');
        });
        el.addEventListener('mouseleave', function () {
          setMode('default');
        });
      });
      document
        .querySelectorAll('.pp-reveal, .realisation-card, .pinapp-films-ia-strip [role="listitem"]')
        .forEach(function (zone) {
          zone.addEventListener('mouseenter', function (e) {
            if (e.target && e.target.closest && e.target.closest('a, button')) return;
            setMode('media');
          });
          zone.addEventListener('mouseleave', function (e) {
            if (!zone.contains(e.relatedTarget)) setMode('default');
          });
        });
    }

    window.addEventListener(
      'resize',
      function () {
        ScrollTrigger.refresh();
      },
      { passive: true },
    );
    ScrollTrigger.refresh();
  }

  function boot() {
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js', function () {
      loadScript(
        'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js',
        function () {
          loadScript('https://cdn.jsdelivr.net/npm/lenis@1.1.18/dist/lenis.min.js', function () {
            if (document.readyState === 'loading') {
              document.addEventListener('DOMContentLoaded', initAfterLibs);
            } else {
              initAfterLibs();
            }
          });
        },
      );
    });
  }

  document.querySelectorAll('#demos a[href^="/demo/"]').forEach(function (a) {
    a.classList.add('pp-fade');
  });

  boot();
})();

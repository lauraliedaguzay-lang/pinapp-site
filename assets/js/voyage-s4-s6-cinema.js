/**
 * V2.6 — #s4 constellation SVG trace + #s6 manifeste mot-à-mot + lecture vidéo locale.
 */
(function () {
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

  function initConstellation() {
    var root = document.querySelector('[data-constel-root]');
    if (!root) return;
    var paths = root.querySelectorAll('[data-constel-path]');
    if (!paths.length) return;

    function tracePaths() {
      paths.forEach(function (p) {
        try {
          var len = p.getTotalLength ? p.getTotalLength() : 320;
          p.style.strokeDasharray = String(len);
          p.style.strokeDashoffset = String(len);
          if (typeof gsap !== 'undefined') {
            gsap.to(p, {
              strokeDashoffset: 0,
              duration: 1.35,
              ease: 'power2.inOut',
              delay: 0.08,
            });
          } else {
            p.style.transition = 'stroke-dashoffset 1.35s cubic-bezier(0.65, 0, 0.35, 1)';
            p.style.strokeDashoffset = '0';
          }
        } catch (e) {}
      });
    }

    if (reducedMotion() || sober()) {
      paths.forEach(function (p) {
        p.style.strokeDashoffset = '0';
      });
      return;
    }

    if (!('IntersectionObserver' in window)) {
      tracePaths();
      return;
    }
    var io = new IntersectionObserver(
      function (ents) {
        ents.forEach(function (en) {
          if (en.isIntersecting) {
            tracePaths();
            io.disconnect();
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
    );
    io.observe(root);
  }

  function wrapWords(el) {
    if (!el) return [];
    var frag = document.createDocumentFragment();
    var spans = [];
    function addWord(w) {
      if (!w) return;
      var s = document.createElement('span');
      s.className = 'manifest-word';
      s.textContent = w + ' ';
      frag.appendChild(s);
      spans.push(s);
    }
    el.childNodes.forEach(function (node) {
      if (node.nodeType === Node.TEXT_NODE) {
        var parts = (node.textContent || '').split(/\s+/);
        parts.forEach(function (w) {
          addWord(w);
        });
      } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'BR') {
        frag.appendChild(document.createElement('br'));
      }
    });
    el.textContent = '';
    el.appendChild(frag);
    return spans;
  }

  function initManifest() {
    var h2 = document.querySelector('[data-manifest-words]');
    if (!h2) return;
    var vid = document.querySelector('.voyage-manifeste__video');
    if (vid && !reducedMotion() && !sober()) {
      try {
        vid.muted = true;
        var vp = vid.play();
        if (vp && typeof vp.catch === 'function') {
          vp.catch(function (err) {
            try {
              console.error('[manifeste] local video play failed', vid.currentSrc || vid.src, err);
            } catch (e2) {}
          });
        }
      } catch (e) {
        try {
          console.error('[manifeste] local video play threw', e);
        } catch (e2) {}
      }
    }

    if (reducedMotion() || sober() || typeof gsap === 'undefined') return;
    if (typeof ScrollTrigger !== 'undefined') {
      try {
        gsap.registerPlugin(ScrollTrigger);
      } catch (eR) {}
    }

    var words = wrapWords(h2);
    if (!words.length) return;
    gsap.set(words, { opacity: 0, y: 14 });
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.to(words, {
        opacity: 1,
        y: 0,
        duration: 0.55,
        ease: 'power2.out',
        stagger: 0.08,
        scrollTrigger: { trigger: h2, start: 'top 78%', once: true },
      });
    } else if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(
        function (ents) {
          ents.forEach(function (en) {
            if (!en.isIntersecting) return;
            io.disconnect();
            gsap.to(words, { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out', stagger: 0.08 });
          });
        },
        { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
      );
      io.observe(h2);
    } else {
      gsap.set(words, { opacity: 1, y: 0 });
    }
  }

  function boot() {
    initConstellation();
    initManifest();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();

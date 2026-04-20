/**
 * Pinapp V2.4 — orchestration 6 couches sur `pinapp:voyagechaptervideoswaprequest`.
 * Réclame `detail.claimed` puis appelle `detail.commit()` après la timeline GSAP.
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

  function cinemaMode() {
    return document.documentElement.classList.contains('voyage-v24-cinema');
  }

  function chapterIdForIndex(idx) {
    try {
      var list = window.__PINAPP_V24_CHAPTERS__;
      if (list && list[idx] && typeof list[idx].id === 'number') return list[idx].id;
    } catch (e0) {}
    return idx + 1;
  }

  function bridgeVarName(prevIdx, nextIdx) {
    var a = Math.min(prevIdx, nextIdx) + 1;
    var b = Math.max(prevIdx, nextIdx) + 1;
    return '--v24-bridge-cut-' + a + '-' + b;
  }

  function readCssVar(name, fallback) {
    try {
      var v = window.getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      return v || fallback;
    } catch (e) {
      return fallback;
    }
  }

  function pickSandTarget(sectionEl) {
    if (!sectionEl) return null;
    return sectionEl.querySelector('.h-hero, .h-1, h1, h2');
  }

  function particleBoost() {
    try {
      if (typeof window.pinappParticleBoost === 'function') {
        window.pinappParticleBoost();
      }
    } catch (e) {}
  }

  document.addEventListener('pinapp:voyagechaptervideoswaprequest', function (ev) {
    if (reducedMotion() || sober() || !cinemaMode()) return;
    var d = ev.detail;
    if (!d || d.claimed || typeof d.commit !== 'function') return;
    var incoming = d.incomingEl;
    var outgoing = d.outgoingEl;
    if (!incoming || !outgoing) return;
    var gsap = window.gsap;
    if (!gsap) return;

    var prevI = d.previousIndex;
    var nextI = d.index;
    if (typeof prevI !== 'number' || prevI < 0 || prevI === nextI) return;

    d.claimed = true;

    /* s7 → s8 : dust settle + crossfade (~1000 ms) */
    if (prevI === 7 && nextI === 8) {
      var dust = document.querySelector('.voyage-cinema-fx-dust');
      var secDust = document.getElementById('s8') || null;
      var sandElDust = pickSandTarget(secDust);
      var bridgeGradD = readCssVar('--v24-bridge-cut-8-9-sand', readCssVar(bridgeVarName(prevI, nextI), readCssVar('--v24-bridge-gradient', 'none')));
      var bridgeD = document.querySelector('.voyage-cinema-fx-bridge');
      if (bridgeD) bridgeD.style.setProperty('--v24-bridge-active', bridgeGradD);

      gsap.set(incoming, { opacity: 0, filter: 'none' });
      gsap.set(outgoing, { opacity: 1, filter: 'none' });
      if (dust) gsap.set(dust, { opacity: 0, y: '-10%' });

      var tlD = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        onComplete: function () {
          try {
            gsap.set([incoming, outgoing], { clearProps: 'opacity,filter' });
          } catch (e2) {}
          if (dust) {
            try {
              gsap.set(dust, { opacity: 0, clearProps: 'y' });
            } catch (eD) {}
          }
          if (bridgeD) {
            try {
              bridgeD.style.removeProperty('--v24-bridge-active');
            } catch (eBr) {}
          }
          if (sandElDust) sandElDust.classList.remove('voyage-sand-burst');
          try {
            d.commit();
          } catch (e3) {}
        },
      });

      var dur = 1;
      if (dust) {
        tlD.fromTo(dust, { opacity: 0 }, { opacity: 0.5, duration: dur * 0.35 }, 0);
        tlD.to(dust, { y: '8%', duration: dur, ease: 'power1.in' }, 0);
        tlD.to(dust, { opacity: 0, duration: dur * 0.4 }, '>-0.35');
      }
      if (bridgeD) {
        tlD.fromTo(bridgeD, { opacity: 0 }, { opacity: 0.45, duration: 0.35 }, 0.05);
        tlD.to(bridgeD, { opacity: 0, duration: 0.4 }, '>-0.2');
      }
      tlD.to(outgoing, { opacity: 0, duration: dur, ease: 'power1.inOut' }, 0);
      tlD.to(incoming, { opacity: 1, duration: dur, ease: 'power1.inOut' }, 0.08);
      tlD.add(function () {
        particleBoost();
      }, 0.15);
      tlD.add(function () {
        if (sandElDust) {
          sandElDust.classList.add('voyage-sand-burst');
          window.setTimeout(function () {
            sandElDust.classList.remove('voyage-sand-burst');
          }, 1100);
        }
      }, 0.2);
      return;
    }

    var chNum = chapterIdForIndex(d.index);
    var sec =
      d.index >= 0
        ? document.querySelector('#voyage-main section.voyage-scene[data-chapter="' + chNum + '"]')
        : null;
    var sandEl = pickSandTarget(sec);
    var bridgeName = bridgeVarName(prevI, nextI);
    var bridgeGrad = readCssVar(bridgeName, readCssVar('--v24-bridge-gradient', 'none'));

    var leak = document.querySelector('.voyage-cinema-fx-leak');
    var bridge = document.querySelector('.voyage-cinema-fx-bridge');
    if (bridge) {
      bridge.style.setProperty('--v24-bridge-active', bridgeGrad);
    }

    var leakDur = 0.14;
    var bridgeDur = 0.28;
    var blurDur = 0.22;
    var fadeDur = 0.42;

    gsap.set(incoming, { opacity: 0, filter: 'none' });
    gsap.set(outgoing, { opacity: 1, filter: 'none' });

    var tl = gsap.timeline({
      defaults: { ease: 'power2.out' },
      onComplete: function () {
        try {
          gsap.set([incoming, outgoing], { clearProps: 'opacity,filter' });
        } catch (e2) {}
        if (leak) gsap.set(leak, { opacity: 0 });
        if (bridge) {
          gsap.set(bridge, { opacity: 0 });
          try {
            bridge.style.removeProperty('--v24-bridge-active');
          } catch (eBr) {}
        }
        if (sandEl) sandEl.classList.remove('voyage-sand-burst');
        try {
          d.commit();
        } catch (e3) {}
      },
    });

    if (leak) {
      tl.fromTo(leak, { opacity: 0 }, { opacity: 0.85, duration: leakDur, yoyo: true, repeat: 1 }, 0);
    }
    if (bridge) {
      tl.fromTo(bridge, { opacity: 0 }, { opacity: 0.72, duration: bridgeDur }, 0.02);
      tl.to(bridge, { opacity: 0, duration: bridgeDur * 0.85 }, '>-0.08');
    }

    tl.to(
      [incoming, outgoing],
      {
        filter: 'blur(5px) saturate(0.92)',
        duration: blurDur,
        yoyo: true,
        repeat: 1,
      },
      0.06
    );

    tl.add(function () {
      particleBoost();
    }, 0.12);

    tl.to(outgoing, { opacity: 0, duration: fadeDur, ease: 'power1.inOut' }, 0.1);
    tl.to(incoming, { opacity: 1, duration: fadeDur, ease: 'power1.inOut' }, 0.12);

    tl.add(function () {
      if (sandEl) {
        sandEl.classList.add('voyage-sand-burst');
        window.setTimeout(function () {
          sandEl.classList.remove('voyage-sand-burst');
        }, 1100);
      }
    }, '>-0.05');
  });
})();

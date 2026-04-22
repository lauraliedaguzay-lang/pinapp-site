/**
 * Pinapp V2.5 — raccords cinéma par paire (pinapp:voyagechaptervideoswaprequest).
 * P2 : techniques par transition · P6 : pinapp:voyagechapterbreath pour respirations.
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
      /* __PINAPP_V24_CHAPTERS__ : défini par voyage-scrubber.js,
         non chargé sur la home (V8.3 — scrubber V24 remplacé par V2).
         Fallback actif : return idx + 1. Ne pas charger le scrubber
         avant la V2 Passengers/Avatar. */
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

  function emitBreath(kind) {
    try {
      document.dispatchEvent(
        new CustomEvent('pinapp:voyagechapterbreath', {
          detail: { kind: kind },
        })
      );
    } catch (e) {}
  }

  function resizeBridgeCanvas(canvas) {
    if (!canvas) return 1;
    var dpr = window.devicePixelRatio || 1;
    var parent = canvas.parentElement;
    if (!parent) return dpr;
    var r = parent.getBoundingClientRect();
    var w = Math.max(1, Math.floor(r.width * dpr));
    var h = Math.max(1, Math.floor(r.height * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    return dpr;
  }

  function burstCyanParticles(gsap, durationSec) {
    var canvas = document.getElementById('voyage-bridge-canvas');
    if (!canvas || !canvas.getContext) return null;
    var ctx = canvas.getContext('2d');
    if (!ctx) return null;
    var dpr = resizeBridgeCanvas(canvas);
    var w = canvas.width;
    var h = canvas.height;
    var cx = w * 0.5;
    var cy = h * 0.55;
    var parts = [];
    var i;
    for (i = 0; i < 50; i++) {
      var ang = (Math.PI * 2 * i) / 50 + Math.random() * 0.4;
      var sp = 1.2 + Math.random() * 2.2;
      parts.push({
        x: cx + (Math.random() - 0.5) * 40 * dpr,
        y: cy + (Math.random() - 0.5) * 30 * dpr,
        vx: Math.cos(ang) * sp * 60 * dpr,
        vy: Math.sin(ang) * sp * 60 * dpr - 40 * dpr,
        life: 0,
        r: 1.2 + Math.random() * 1.8,
      });
    }
    var start = performance.now();
    var dur = durationSec * 1000;
    function frame(now) {
      var t = (now - start) / dur;
      if (t > 1) t = 1;
      ctx.clearRect(0, 0, w, h);
      var j;
      for (j = 0; j < parts.length; j++) {
        var p = parts[j];
        p.life = t;
        p.x += (p.vx * (1 - t) * 0.016) / Math.max(dpr, 1);
        p.y += (p.vy * (1 - t * 0.5) * 0.016) / Math.max(dpr, 1);
        p.vy += 0.35 * dpr;
        var al = (1 - t) * 0.55;
        ctx.fillStyle = 'rgba(62,245,224,' + al + ')';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * dpr, 0, Math.PI * 2);
        ctx.fill();
      }
      if (t < 1) {
        requestAnimationFrame(frame);
      } else {
        ctx.clearRect(0, 0, w, h);
      }
    }
    gsap.set(canvas, { opacity: 0.85 });
    requestAnimationFrame(frame);
    return canvas;
  }

  function finishCommit(gsap, incoming, outgoing, leak, bridge, sandEl, dust, bridgeD, sandElDust, extra, commit) {
    try {
      gsap.set([incoming, outgoing], { clearProps: 'opacity,filter,transform,x,scale,rotation,clipPath' });
    } catch (e1) {}
    if (leak) gsap.set(leak, { opacity: 0 });
    if (bridge) {
      gsap.set(bridge, { opacity: 0 });
      try {
        bridge.style.removeProperty('--v24-bridge-active');
      } catch (eBr) {}
    }
    if (bridgeD) {
      try {
        bridgeD.style.removeProperty('--v24-bridge-active');
      } catch (eB2) {}
    }
    if (dust) {
      try {
        gsap.set(dust, { opacity: 0, clearProps: 'y' });
      } catch (eD) {}
    }
    if (extra && extra.canvas) gsap.set(extra.canvas, { opacity: 0 });
    if (sandEl) sandEl.classList.remove('voyage-sand-burst');
    if (sandElDust) sandElDust.classList.remove('voyage-sand-burst');
    try {
      commit();
    } catch (e2) {}
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

    var leak = document.querySelector('.voyage-cinema-fx-leak');
    var bridge = document.querySelector('.voyage-cinema-fx-bridge');
    var flash = document.querySelector('.voyage-cinema-fx-flash');
    var dust = document.querySelector('.voyage-cinema-fx-dust');
    var bridgeCanvas = document.getElementById('voyage-bridge-canvas');

    var chNum = chapterIdForIndex(d.index);
    var sec =
      d.index >= 0
        ? document.querySelector('#voyage-main section.voyage-scene[data-chapter="' + chNum + '"]')
        : null;
    var sandEl = pickSandTarget(sec);

    if (nextI === 2) emitBreath('s2-s3');
    if (nextI === 6) emitBreath('s5b-s6');
    if (nextI === 8) emitBreath('s7-s8');

    if (prevI === 7 && nextI === 8) {
      var secDust = document.getElementById('s8') || null;
      var sandElDust = pickSandTarget(secDust);
      var bridgeD = document.querySelector('.voyage-cinema-fx-bridge');
      var bridgeGradD = readCssVar(
        '--v24-bridge-cut-8-9-sand',
        readCssVar(bridgeVarName(prevI, nextI), readCssVar('--v24-bridge-gradient', 'none'))
      );
      if (bridgeD) bridgeD.style.setProperty('--v24-bridge-active', bridgeGradD);

      gsap.set(incoming, { opacity: 0, filter: 'none' });
      gsap.set(outgoing, { opacity: 1, filter: 'none' });
      if (dust) gsap.set(dust, { opacity: 0, y: '-10%' });

      var dur = 1;
      var tlD = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        onComplete: function () {
          finishCommit(gsap, incoming, outgoing, leak, bridge, sandEl, dust, bridgeD, sandElDust, null, d.commit);
        },
      });
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

    if (prevI === 4 && nextI === 5) {
      gsap.set(incoming, { opacity: 0 });
      gsap.set(outgoing, { opacity: 1 });
      gsap.timeline({
        onComplete: function () {
          finishCommit(gsap, incoming, outgoing, leak, bridge, sandEl, dust, null, null, null, d.commit);
        },
      })
        .to(outgoing, { opacity: 0, duration: 0.18, ease: 'none' }, 0)
        .to(incoming, { opacity: 1, duration: 0.2, ease: 'none' }, 0.05);
      return;
    }

    if (prevI === 5 && nextI === 6) {
      gsap.set(incoming, { opacity: 0, filter: 'none' });
      gsap.set(outgoing, { opacity: 1, filter: 'none' });
      if (bridgeCanvas) burstCyanParticles(gsap, 1.4);
      var tlP = gsap.timeline({
        onComplete: function () {
          if (bridgeCanvas) gsap.set(bridgeCanvas, { opacity: 0 });
          finishCommit(gsap, incoming, outgoing, leak, bridge, sandEl, dust, null, null, { canvas: bridgeCanvas }, d.commit);
        },
      });
      tlP.to(outgoing, { opacity: 0, duration: 0.55, ease: 'power1.inOut' }, 0.2);
      tlP.to(incoming, { opacity: 1, duration: 0.55, ease: 'power1.inOut' }, 0.28);
      tlP.add(function () {
        particleBoost();
      }, 0.25);
      if (sandEl) {
        tlP.add(function () {
          sandEl.classList.add('voyage-sand-burst');
          window.setTimeout(function () {
            sandEl.classList.remove('voyage-sand-burst');
          }, 1100);
        }, 0.35);
      }
      return;
    }

    if (prevI === 6 && nextI === 7) {
      var bridgeNameV = bridgeVarName(prevI, nextI);
      var bridgeGradV = readCssVar(bridgeNameV, readCssVar('--v24-bridge-gradient', 'none'));
      if (bridge) bridge.style.setProperty('--v24-bridge-active', bridgeGradV);
      gsap.set(incoming, { opacity: 0, filter: 'none', transformOrigin: '50% 50%' });
      gsap.set(outgoing, { opacity: 1, filter: 'none', transformOrigin: '50% 50%' });
      var tlV = gsap.timeline({
        defaults: { ease: 'cubic-bezier(0.7, 0, 0.3, 1)' },
        onComplete: function () {
          finishCommit(gsap, incoming, outgoing, leak, bridge, sandEl, dust, null, null, null, d.commit);
        },
      });
      if (bridge) {
        tlV.fromTo(bridge, { opacity: 0 }, { opacity: 0.5, duration: 0.22 }, 0);
        tlV.to(bridge, { opacity: 0, duration: 0.35 }, '>-0.1');
      }
      tlV.to(outgoing, { rotation: 360, scale: 0.92, duration: 0.6 }, 0);
      tlV.to(outgoing, { opacity: 0, duration: 0.35, ease: 'power1.in' }, 0.25);
      tlV.to(incoming, { opacity: 1, duration: 0.45, ease: 'power1.out' }, 0.2);
      tlV.add(function () {
        particleBoost();
      }, 0.15);
      if (sandEl) {
        tlV.add(function () {
          sandEl.classList.add('voyage-sand-burst');
          window.setTimeout(function () {
            sandEl.classList.remove('voyage-sand-burst');
          }, 1100);
        }, 0.3);
      }
      return;
    }

    if (prevI === 2 && nextI === 3) {
      var bridgeNameW = bridgeVarName(prevI, nextI);
      var bridgeGradW = readCssVar(bridgeNameW, readCssVar('--v24-bridge-gradient', 'none'));
      if (bridge) bridge.style.setProperty('--v24-bridge-active', bridgeGradW);
      gsap.set(incoming, { opacity: 0 });
      gsap.set(outgoing, { opacity: 1 });
      var tlW = gsap.timeline({
        onComplete: function () {
          finishCommit(gsap, incoming, outgoing, leak, bridge, sandEl, dust, null, null, null, d.commit);
        },
      });
      if (flash) {
        tlW.fromTo(flash, { opacity: 0 }, { opacity: 1, duration: 0.1, ease: 'expo.out' }, 0.02);
        tlW.to(flash, { opacity: 0, duration: 0.1, ease: 'expo.in' }, 0.12);
      }
      tlW.to(outgoing, { opacity: 0, duration: 0.35, ease: 'power1.in' }, 0.05);
      tlW.to(incoming, { opacity: 1, duration: 0.4, ease: 'power1.out' }, 0.1);
      tlW.add(function () {
        particleBoost();
      }, 0.08);
      if (sandEl) {
        tlW.add(function () {
          sandEl.classList.add('voyage-sand-burst');
          window.setTimeout(function () {
            sandEl.classList.remove('voyage-sand-burst');
          }, 1100);
        }, 0.12);
      }
      return;
    }

    if (prevI === 3 && nextI === 4) {
      var bridgeNameI = bridgeVarName(prevI, nextI);
      var bridgeGradI = readCssVar(bridgeNameI, readCssVar('--v24-bridge-gradient', 'none'));
      if (bridge) bridge.style.setProperty('--v24-bridge-active', bridgeGradI);
      gsap.set(outgoing, { opacity: 1, clipPath: 'circle(100% at 50% 45%)' });
      gsap.set(incoming, { opacity: 1, clipPath: 'circle(0% at 50% 45%)' });
      var tlI = gsap.timeline({
        defaults: { ease: 'power3.inOut' },
        onComplete: function () {
          gsap.set([incoming, outgoing], { clearProps: 'clipPath' });
          finishCommit(gsap, incoming, outgoing, leak, bridge, sandEl, dust, null, null, null, d.commit);
        },
      });
      tlI.to(outgoing, { clipPath: 'circle(0% at 50% 45%)', duration: 0.5 }, 0);
      tlI.to(incoming, { clipPath: 'circle(125% at 50% 45%)', duration: 0.5 }, 0.45);
      tlI.add(function () {
        particleBoost();
      }, 0.2);
      if (sandEl) {
        tlI.add(function () {
          sandEl.classList.add('voyage-sand-burst');
          window.setTimeout(function () {
            sandEl.classList.remove('voyage-sand-burst');
          }, 1100);
        }, 0.35);
      }
      return;
    }

    if (prevI === 1 && nextI === 2) {
      var bridgeNameM = bridgeVarName(prevI, nextI);
      var bridgeGradM = readCssVar(bridgeNameM, readCssVar('--v24-bridge-gradient', 'none'));
      if (bridge) bridge.style.setProperty('--v24-bridge-active', bridgeGradM);
      gsap.set(incoming, { opacity: 0, x: 40, filter: 'none' });
      gsap.set(outgoing, { opacity: 1, x: 0, filter: 'none' });
      var tlM = gsap.timeline({
        onComplete: function () {
          finishCommit(gsap, incoming, outgoing, leak, bridge, sandEl, dust, null, null, null, d.commit);
        },
      });
      tlM.to(outgoing, { x: -40, opacity: 0, duration: 0.55, ease: 'power2.inOut' }, 0);
      tlM.to(incoming, { x: 0, opacity: 1, duration: 0.55, ease: 'power2.inOut' }, 0.08);
      tlM.add(function () {
        particleBoost();
      }, 0.1);
      if (sandEl) {
        tlM.add(function () {
          sandEl.classList.add('voyage-sand-burst');
          window.setTimeout(function () {
            sandEl.classList.remove('voyage-sand-burst');
          }, 1100);
        }, 0.15);
      }
      return;
    }

    if (prevI === 0 && nextI === 1) {
      var bridgeNameG = bridgeVarName(prevI, nextI);
      var bridgeGradG = readCssVar(bridgeNameG, readCssVar('--v24-bridge-gradient', 'none'));
      if (bridge) bridge.style.setProperty('--v24-bridge-active', bridgeGradG);
      gsap.set(incoming, { opacity: 0, filter: 'blur(0px)' });
      gsap.set(outgoing, { opacity: 1, filter: 'blur(0px)' });
      var tlG = gsap.timeline({
        onComplete: function () {
          finishCommit(gsap, incoming, outgoing, leak, bridge, sandEl, dust, null, null, null, d.commit);
        },
      });
      tlG.to([incoming, outgoing], { filter: 'blur(8px)', duration: 0.35, ease: 'power1.in' }, 0.05);
      tlG.to([incoming, outgoing], { filter: 'blur(0px)', duration: 0.45, ease: 'power1.out' }, 0.35);
      tlG.to(outgoing, { opacity: 0, duration: 0.85, ease: 'power1.inOut' }, 0.15);
      tlG.to(incoming, { opacity: 1, duration: 0.85, ease: 'power1.inOut' }, 0.2);
      tlG.add(function () {
        particleBoost();
      }, 0.25);
      if (sandEl) {
        tlG.add(function () {
          sandEl.classList.add('voyage-sand-burst');
          window.setTimeout(function () {
            sandEl.classList.remove('voyage-sand-burst');
          }, 1100);
        }, 0.3);
      }
      return;
    }

    var bridgeName = bridgeVarName(prevI, nextI);
    var bridgeGrad = readCssVar(bridgeName, readCssVar('--v24-bridge-gradient', 'none'));
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
        finishCommit(gsap, incoming, outgoing, leak, bridge, sandEl, dust, null, null, null, d.commit);
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

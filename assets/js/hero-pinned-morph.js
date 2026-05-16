/**
 * WOW PR #183 — pin hero 2× viewport + morph 3 titres (ScrollTrigger)
 */
(function () {
  "use strict";

  var MAX_TRIES = 120;
  var tries = 0;

  function prefersReduce() {
    try {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch (e) {
      return true;
    }
  }

  function initPinned() {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      tries += 1;
      if (tries < MAX_TRIES) {
        window.setTimeout(initPinned, 50);
      }
      return;
    }

    if (document.documentElement.classList.contains("sober")) return;
    if (prefersReduce()) return;
    try {
      if (window.matchMedia("(max-width: 899px)").matches) return;
    } catch (e2) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    var heroSection = document.querySelector(".hero-section");
    if (!heroSection) return;

    var h1A = document.querySelector('.hero-h1[data-scene="A"]');
    var h1B = document.querySelector('.hero-h1[data-scene="B"]');
    var h1C = document.querySelector('.hero-h1[data-scene="C"]');
    if (!h1A || !h1B || !h1C) return;

    gsap.set(h1A, { opacity: 1, y: 0, scale: 1 });
    gsap.set([h1B, h1C], { opacity: 0, y: 28, scale: 0.95 });

    ScrollTrigger.create({
      trigger: heroSection,
      pin: true,
      start: "top top",
      end: "+=200%",
      pinSpacing: true,
      anticipatePin: 1,
    });

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroSection,
        start: "top top",
        end: "+=200%",
        scrub: 1.35,
      },
    });

    tl.to(h1A, { opacity: 0, y: -36, scale: 0.92, duration: 0.45, ease: "power2.in" }, 0.08);
    tl.to(h1B, { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: "power2.out" }, 0.12);

    tl.to(h1B, { opacity: 0, y: -36, scale: 0.92, duration: 0.45, ease: "power2.in" }, 0.52);
    tl.to(h1C, { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: "power2.out" }, 0.56);

    ScrollTrigger.refresh();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPinned);
  } else {
    initPinned();
  }
})();

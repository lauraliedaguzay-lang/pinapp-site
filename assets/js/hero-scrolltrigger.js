/**
 * Hero — GSAP ScrollTrigger (rotation hublot, parallax 3 couches, plongée contenu).
 * Repli gracieux si CDN GSAP indisponible. Pas de double RAF Lenis (scroll-smooth.js gère déjà raf).
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

  function initScrollTrigger() {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      tries += 1;
      if (tries < MAX_TRIES) {
        window.setTimeout(initScrollTrigger, 50);
      }
      return;
    }

    if (document.documentElement.classList.contains("sober")) return;
    if (prefersReduce()) return;

    gsap.registerPlugin(ScrollTrigger);

    var lenis = window.__pinappLenis;
    if (lenis && typeof lenis.on === "function") {
      lenis.on("scroll", ScrollTrigger.update);
    }

    var hero = document.querySelector(".hero-section");
    if (!hero) return;

    var hublotWrap = document.querySelector(".hero-hublot-deco-wrap");
    if (hublotWrap) {
      gsap.to(hublotWrap, {
        rotation: "+=360",
        scale: 1.5,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
          invalidateOnRefresh: true,
        },
      });
    }

    var bgFar = document.querySelector(".hero-bg-mesh");
    if (bgFar) {
      gsap.to(bgFar, {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    }

    var bgMid = document.querySelector(".hero-particles");
    if (bgMid) {
      gsap.to(bgMid, {
        yPercent: 50,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    }

    var bgNear = document.querySelector(".hero-logo-xl-wrap");
    if (bgNear) {
      gsap.to(bgNear, {
        yPercent: 90,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    }

    var heroContent = document.querySelector("#hero .hero-content");
    if (heroContent) {
      gsap.to(heroContent, {
        scale: 0.85,
        opacity: 0.4,
        filter: "blur(4px)",
        y: -50,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-section",
          start: "center top",
          end: "bottom top",
          scrub: 1.2,
        },
      });
    }

    ScrollTrigger.refresh();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initScrollTrigger);
  } else {
    initScrollTrigger();
  }
})();

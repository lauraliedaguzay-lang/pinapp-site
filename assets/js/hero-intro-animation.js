/**
 * WOW PR #183 — intro hero au load (GSAP + SplitText si dispo)
 */
(function () {
  "use strict";

  var MAX_TRIES = 120;
  var tries = 0;
  var splitInst = null;

  function prefersReduce() {
    try {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch (e) {
      return true;
    }
  }

  function sober() {
    try {
      return (
        document.documentElement.classList.contains("sober") ||
        localStorage.getItem("pinapp-voyage-sober") === "1"
      );
    } catch (e) {
      return document.documentElement.classList.contains("sober");
    }
  }

  function circleLenFromR(rAttr) {
    var r = parseFloat(String(rAttr));
    if (isNaN(r) || r <= 0) r = 80;
    return 2 * Math.PI * r;
  }

  function initIntro() {
    if (typeof gsap === "undefined") {
      tries += 1;
      if (tries < MAX_TRIES) {
        window.setTimeout(initIntro, 50);
      } else {
        document.documentElement.classList.remove("intro-loading");
      }
      return;
    }

    if (sober() || prefersReduce()) {
      document.documentElement.classList.remove("intro-loading");
      return;
    }

    document.documentElement.classList.add("intro-ready");

    var ST = window.SplitText;
    if (ST && typeof gsap.registerPlugin === "function") {
      try {
        gsap.registerPlugin(ST);
      } catch (eReg) {
        ST = null;
      }
    } else {
      ST = null;
    }

    var tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    var circles = document.querySelectorAll(".hero-hublot-deco circle");
    if (circles.length) {
      circles.forEach(function (c) {
        var len = Math.ceil(circleLenFromR(c.getAttribute("r")) * 1.05);
        c.style.strokeDasharray = String(len);
        c.style.strokeDashoffset = String(len);
      });
      tl.to(
        circles,
        {
          strokeDashoffset: 0,
          duration: 1.2,
          stagger: 0.18,
          ease: "power2.inOut",
        },
        0
      );
    }

    var logoText = document.querySelector(".hero-logo-text");
    if (logoText) {
      gsap.set(logoText, { clipPath: "inset(0 100% 0 0)", opacity: 1 });
      tl.to(
        logoText,
        {
          clipPath: "inset(0 0% 0 0)",
          duration: 0.75,
          ease: "power3.inOut",
        },
        0.55
      );
    }

    var logoDot = document.querySelector(".hero-logo-dot");
    if (logoDot) {
      gsap.set(logoDot, { scale: 0, opacity: 0 });
      tl.to(
        logoDot,
        {
          scale: 1,
          opacity: 1,
          duration: 0.55,
          ease: "back.out(2.2)",
        },
        1.05
      );
    }

    var h1 = document.querySelector("#hero-h1.hero-h1, h1#hero-h1");
    if (h1) {
      gsap.set(h1, { opacity: 1 });
      var didChars = false;
      if (ST) {
        try {
          splitInst = new ST(h1, { type: "chars,words" });
          tl.from(
            splitInst.chars,
            {
              opacity: 0,
              rotateY: 88,
              y: 18,
              duration: 0.65,
              stagger: 0.022,
              ease: "back.out(1.25)",
              transformOrigin: "50% 50% -24px",
            },
            1.25
          );
          didChars = true;
        } catch (eSplit) {
          splitInst = null;
          didChars = false;
        }
      }
      if (!didChars) {
        var words = h1.querySelectorAll(".hero-word");
        if (words.length) {
          tl.from(
            words,
            {
              opacity: 0,
              rotateY: 72,
              y: 22,
              duration: 0.55,
              stagger: 0.06,
              ease: "back.out(1.2)",
              transformOrigin: "50% 50% -20px",
            },
            1.25
          );
        }
      }
    }

    var supporting = [];
    ["#hero .hero-eyebrow", "#hero .lead", "#hero .badge-row", "#hero .stats-row .stat", "#hero .cta-row"].forEach(
      function (sel) {
        document.querySelectorAll(sel).forEach(function (n) {
          supporting.push(n);
        });
      }
    );
    if (supporting.length) {
      tl.from(
        supporting,
        {
          opacity: 0,
          y: 26,
          duration: 0.55,
          stagger: 0.09,
          ease: "power2.out",
        },
        1.85
      );
    }

    tl.call(
      function () {
        document.documentElement.classList.remove("intro-loading");
        document.documentElement.classList.remove("intro-ready");
        if (splitInst && typeof splitInst.revert === "function") {
          try {
            splitInst.revert();
          } catch (eR) {}
        }
        splitInst = null;
        if (typeof ScrollTrigger !== "undefined") {
          try {
            ScrollTrigger.refresh();
          } catch (eS) {}
        }
      },
      null,
      2.95
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initIntro);
  } else {
    initIntro();
  }
})();

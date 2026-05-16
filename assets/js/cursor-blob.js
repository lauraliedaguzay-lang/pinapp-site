/**
 * WOW PR #183 — blob curseur (lag doux + état hover)
 */
(function () {
  "use strict";
  try {
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (document.documentElement.classList.contains("sober")) return;
  } catch (e) {
    return;
  }

  var blob = document.querySelector(".cursor-blob");
  if (!blob) return;

  var mouseX = window.innerWidth / 2;
  var mouseY = window.innerHeight / 2;
  var blobX = mouseX;
  var blobY = mouseY;

  document.addEventListener(
    "mousemove",
    function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    },
    { passive: true }
  );

  function tick() {
    blobX += (mouseX - blobX) * 0.18;
    blobY += (mouseY - blobY) * 0.18;
    blob.style.transform =
      "translate3d(" + blobX + "px," + blobY + "px,0) translate(-50%,-50%)";
    window.requestAnimationFrame(tick);
  }
  window.requestAnimationFrame(tick);

  var interactiveSelectors =
    "a,button,[role='button'],.cta-magnetic,.hero-cta-primary,.hero-cta-secondary,.stat,.hero-logo-placeholder,.pinapp-cookie-banner__btn,input[type='submit'],label";
  function bindHover(el) {
    el.addEventListener("mouseenter", function () {
      blob.classList.add("cursor-blob--hover");
    });
    el.addEventListener("mouseleave", function () {
      blob.classList.remove("cursor-blob--hover");
    });
  }

  document.querySelectorAll(interactiveSelectors).forEach(bindHover);

  var mo = new MutationObserver(function (muts) {
    muts.forEach(function (m) {
      m.addedNodes.forEach(function (n) {
        if (n.nodeType !== 1) return;
        if (n.matches && n.matches(interactiveSelectors)) bindHover(n);
        if (n.querySelectorAll)
          n.querySelectorAll(interactiveSelectors).forEach(bindHover);
      });
    });
  });
  mo.observe(document.body, { childList: true, subtree: true });
})();

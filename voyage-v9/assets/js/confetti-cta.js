/**
 * Micro-célébrations CTA — particules dorées discrètes (desktop, motion OK).
 * Vanilla · < 2 Ko
 */
(function () {
  'use strict';
  function celebrate(x, y) {
    try {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    } catch (e) {
      return;
    }
    var colors = ['#C9A66B', '#D4A574', '#E8C9A0'];
    for (var i = 0; i < 12; i++) {
      var p = document.createElement('div');
      p.setAttribute('aria-hidden', 'true');
      var sz = 4 + Math.random() * 3;
      p.style.cssText =
        'position:fixed;left:' +
        x +
        'px;top:' +
        y +
        'px;width:' +
        sz +
        'px;height:' +
        sz +
        'px;background:' +
        colors[Math.floor(Math.random() * colors.length)] +
        ';border-radius:50%;pointer-events:none;z-index:100001';
      document.body.appendChild(p);
      var angle = (Math.PI * 2 * i) / 12;
      var velocity = 60 + Math.random() * 40;
      var vx = Math.cos(angle) * velocity;
      var vy = Math.sin(angle) * velocity - 80;
      var anim = p.animate(
        [
          { transform: 'translate(0,0) scale(1)', opacity: 1 },
          { transform: 'translate(' + vx + 'px,' + (vy + 100) + 'px) scale(0)', opacity: 0 },
        ],
        { duration: 600, easing: 'cubic-bezier(0.25,0.46,0.45,0.94)' },
      );
      anim.onfinish = function (node) {
        return function () {
          if (node && node.parentNode) node.parentNode.removeChild(node);
        };
      }(p);
    }
  }
  document.addEventListener(
    'click',
    function (ev) {
      var t = ev.target;
      if (!t || !t.closest) return;
      if (t.closest('.btn--primary, .breath-cta, .nav__cta, [data-cta-primary]')) {
        celebrate(ev.clientX, ev.clientY);
      }
    },
    true,
  );
})();

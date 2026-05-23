/* Pinapp Formations — DA AVALON · nav + reveals (reduced-motion safe) */
(function () {
  'use strict';
  var nav = document.querySelector('.fnav');
  if (nav) {
    var onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 40); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }
  var reduce = false;
  try { reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  var els = [].slice.call(document.querySelectorAll('[data-rev]'));
  if (reduce || !('IntersectionObserver' in window)) {
    els.forEach(function (el) { el.classList.add('in'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        var d = parseInt(e.target.getAttribute('data-rev') || '0', 10) || 0;
        setTimeout(function () { e.target.classList.add('in'); }, d);
        io.unobserve(e.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  els.forEach(function (el) { io.observe(el); });
})();

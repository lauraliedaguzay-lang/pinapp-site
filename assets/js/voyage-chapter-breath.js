/**
 * P6 — respirations ciné (écoute pinapp:voyagechapterbreath depuis voyage-transitions).
 */
(function () {
  var el;
  var reduced = false;
  try {
    reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) {}

  function hide() {
    if (!el) return;
    el.classList.remove('is-on', 'voyage-chapter-breath--dark', 'voyage-chapter-breath--flash');
    el.innerHTML = '';
    el.hidden = true;
    el.setAttribute('aria-hidden', 'true');
  }

  function showDark(ms) {
    if (!el) return;
    el.hidden = false;
    el.removeAttribute('hidden');
    el.className = 'voyage-chapter-breath voyage-chapter-breath--dark';
    el.innerHTML = '<span class="voyage-chapter-breath__star" aria-hidden="true"></span>';
    el.classList.add('is-on');
    window.setTimeout(function () {
      el.classList.remove('is-on');
      window.setTimeout(hide, 120);
    }, ms);
  }

  function showFlash(ms) {
    if (!el) return;
    el.hidden = false;
    el.removeAttribute('hidden');
    el.className = 'voyage-chapter-breath voyage-chapter-breath--flash';
    el.innerHTML = '';
    el.classList.add('is-on');
    window.setTimeout(function () {
      el.classList.remove('is-on');
      window.setTimeout(hide, 80);
    }, ms);
  }

  document.addEventListener('pinapp:voyagechapterbreath', function (ev) {
    if (reduced) return;
    if (document.documentElement.classList.contains('voyage-sober')) return;
    if (document.documentElement.classList.contains('low-perf')) return;
    var kind = ev.detail && ev.detail.kind;
    el = document.getElementById('voyage-chapter-breath');
    if (!el) return;
    if (kind === 's2-s3') {
      showDark(400);
    } else if (kind === 's5b-s6') {
      showDark(600);
    } else if (kind === 's7-s8') {
      showFlash(300);
    }
  });
})();

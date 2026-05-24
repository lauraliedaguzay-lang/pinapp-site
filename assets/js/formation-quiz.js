/* Quiz d'auto-évaluation Pinapp — autonomie élève, zéro backend, rejouable.
   Usage : <div class="fquiz" data-quiz><script type="application/json">{...}</script></div>
   JSON : { "title": "...", "intro": "...", "questions": [ { "q":"...", "options":["a","b"], "answer":0, "explain":"..." } ] } */
(function () {
  'use strict';
  function el(tag, cls, txt) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt != null) e.textContent = txt;
    return e;
  }
  function setup(root) {
    var dataEl = root.querySelector('script[type="application/json"]');
    if (!dataEl) return;
    var data;
    try { data = JSON.parse(dataEl.textContent); } catch (e) { return; }
    var qs = (data.questions || []).filter(function (q) { return q && q.options && q.options.length; });
    if (!qs.length) return;

    function render() {
      root.innerHTML = '';
      var correct = 0, answered = 0;

      var head = el('div', 'fquiz__head');
      head.appendChild(el('p', 'fquiz__title', data.title || 'Quiz — vérifiez vos acquis'));
      var score = el('p', 'fquiz__score', '0 / ' + qs.length);
      score.setAttribute('aria-live', 'polite');
      head.appendChild(score);
      root.appendChild(head);
      if (data.intro) root.appendChild(el('p', 'fquiz__intro', data.intro));

      qs.forEach(function (q, qi) {
        var wrap = el('div', 'fquiz__q');
        var qt = el('p', 'fquiz__qtext');
        qt.appendChild(el('b', null, (qi + 1) + '.'));
        qt.appendChild(document.createTextNode(' ' + q.q));
        wrap.appendChild(qt);

        var opts = el('div', 'fquiz__opts');
        var fb = el('div', 'fquiz__fb');
        fb.hidden = true;
        var btns = [];

        q.options.forEach(function (text, oi) {
          var b = el('button', 'fquiz__opt');
          b.type = 'button';
          var mk = el('span', 'mk', '');
          b.appendChild(mk);
          b.appendChild(el('span', null, text));
          b.addEventListener('click', function () {
            if (b.disabled) return;
            var ok = oi === q.answer;
            btns.forEach(function (bb, bi) {
              bb.disabled = true;
              if (bi === q.answer) {
                bb.classList.add('is-correct');
                bb.querySelector('.mk').textContent = '✓';
              }
            });
            if (!ok) {
              b.classList.add('is-wrong');
              b.querySelector('.mk').textContent = '✕';
            }
            answered++;
            if (ok) correct++;
            score.textContent = correct + ' / ' + qs.length;
            fb.hidden = false;
            fb.innerHTML = '';
            fb.appendChild(el('b', null, ok ? 'Bonne réponse. ' : 'Pas tout à fait. '));
            fb.appendChild(document.createTextNode(q.explain || ''));
            if (answered === qs.length) finish();
          });
          btns.push(b);
          opts.appendChild(b);
        });

        wrap.appendChild(opts);
        wrap.appendChild(fb);
        root.appendChild(wrap);
      });

      var foot = el('div', 'fquiz__foot');
      var result = el('p', 'fquiz__result');
      result.setAttribute('aria-live', 'polite');
      var reset = el('button', 'fquiz__reset', 'Recommencer le quiz');
      reset.type = 'button';
      reset.hidden = true;
      reset.addEventListener('click', render);
      foot.appendChild(result);
      foot.appendChild(reset);
      root.appendChild(foot);

      function finish() {
        var pct = Math.round((correct / qs.length) * 100), msg;
        if (pct === 100) msg = 'Sans faute — vous pouvez avancer en autonomie. 🎯';
        else if (pct >= 70) msg = 'Solide (' + pct + ' %). Relisez les points manqués, c’est tout bon.';
        else if (pct >= 40) msg = 'En bonne voie (' + pct + ' %). Revoyez la fiche au-dessus, puis recommencez.';
        else msg = 'À retravailler (' + pct + ' %). Tout est dans la fiche — pas besoin d’appeler, reprenez tranquillement.';
        result.textContent = msg;
        reset.hidden = false;
      }
    }

    render();
  }
  function init() {
    Array.prototype.forEach.call(document.querySelectorAll('.fquiz[data-quiz]'), setup);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

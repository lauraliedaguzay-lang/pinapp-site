/* Pinapp Academy — modules interactifs (vanilla, offline, sans backend).
 * Règle: on n'écrit rien côté serveur ; tout reste local.
 */

import { getLocal, setLocal } from './storage.js';

const QS = (sel, root = document) => root.querySelector(sel);
const QSA = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function safeJsonParse(s, fallback) {
  try {
    return JSON.parse(s);
  } catch {
    return fallback;
  }
}

function getProgress() {
  return safeJsonParse(getLocal('pinapp-academy-progress') || '', {
    done: {},
    score: {},
    lastSeen: null,
  });
}

function setProgress(p) {
  p.lastSeen = new Date().toISOString();
  setLocal('pinapp-academy-progress', JSON.stringify(p));
}

function setStatus(el, text, tone = 'ok') {
  el.textContent = text;
  el.dataset.tone = tone;
}

function wireQuiz(card) {
  const quiz = card.dataset.quiz ? safeJsonParse(card.dataset.quiz, null) : null;
  if (!quiz || !quiz.id || !Array.isArray(quiz.items)) return;

  const root = QS('[data-quiz-root]', card);
  if (!root) return;

  const status = QS('[data-quiz-status]', card);
  const btn = QS('[data-quiz-submit]', card);
  const reset = QS('[data-quiz-reset]', card);
  const result = QS('[data-quiz-result]', card);

  const p = getProgress();
  const prev = p.score[quiz.id];
  if (prev) {
    result.textContent = `Dernier score : ${prev.correct}/${prev.total}`;
    result.style.display = 'block';
  }

  btn?.addEventListener('click', () => {
    let correct = 0;
    const total = quiz.items.length;

    for (const it of quiz.items) {
      const chosen = QS(`input[name="${it.name}"]:checked`, root)?.value ?? '';
      if (chosen === it.correct) correct++;
    }

    p.score[quiz.id] = { correct, total, at: new Date().toISOString() };
    const pass = correct >= Math.max(1, Math.ceil(total * 0.8));
    if (pass) p.done[quiz.id] = true;
    setProgress(p);

    result.textContent = `${correct}/${total} — ${pass ? 'validé' : 'à revoir'}`;
    result.style.display = 'block';
    setStatus(status, pass ? 'Module validé' : 'Revoir le module', pass ? 'ok' : 'warn');

    // UI chips
    const badge = QS('[data-module-badge]', card);
    if (badge) badge.textContent = pass ? 'Validé' : 'En cours';

    // Barre globale
    updateGlobalProgress();
  });

  reset?.addEventListener('click', () => {
    // Reset radios
    QSA('input[type="radio"]', root).forEach((i) => (i.checked = false));
    const p2 = getProgress();
    delete p2.score[quiz.id];
    delete p2.done[quiz.id];
    setProgress(p2);
    result.style.display = 'none';
    setStatus(status, 'Non validé', 'muted');
    const badge = QS('[data-module-badge]', card);
    if (badge) badge.textContent = 'Non validé';
    updateGlobalProgress();
  });
}

function updateGlobalProgress() {
  const p = getProgress();
  const modules = QSA('[data-module]', document);
  if (!modules.length) return;

  let done = 0;
  for (const m of modules) {
    const id = m.dataset.moduleId;
    if (!id) continue;
    if (p.done[id]) done++;
  }

  const pct = Math.round((done / modules.length) * 100);
  const bar = QS('#academyProgressBar');
  const txt = QS('#academyProgressText');
  if (bar) bar.style.width = `${pct}%`;
  if (txt) txt.textContent = `${done}/${modules.length} modules validés`;
}

function wireCopyButtons() {
  QSA('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const sel = btn.getAttribute('data-copy');
      const target = sel ? QS(sel) : null;
      const text = target ? (target.value ?? target.textContent ?? '') : '';
      const status = QS(
        btn.getAttribute('data-copy-status') || '',
        btn.closest('.card') || document,
      );
      try {
        await navigator.clipboard.writeText(String(text).trim());
        if (status) setStatus(status, 'Copié', 'ok');
      } catch {
        if (status) setStatus(status, 'Copie impossible', 'warn');
      }
    });
  });
}

function wireExpandableSteps() {
  QSA('[data-step-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('aria-controls');
      const panel = id ? document.getElementById(id) : null;
      if (!panel) return;
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!isOpen));
      panel.hidden = isOpen;
    });
  });
}

function wireAll() {
  QSA('[data-module]').forEach((card) => wireQuiz(card));
  wireCopyButtons();
  wireExpandableSteps();
  updateGlobalProgress();
}

document.addEventListener('DOMContentLoaded', wireAll);

(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const fmtEUR = (n) => {
    try {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0,
      }).format(n);
    } catch {
      return `${Math.round(n)} €`;
    }
  };

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  function safeText(v) {
    return String(v || '')
      .replace(/\r\n/g, '\n')
      .trim();
  }

  function getMulti(name) {
    return $$(`input[name="${name}"]:checked`).map((el) => el.value);
  }

  function getOne(name) {
    return $(`input[name="${name}"]:checked`)?.value || '';
  }

  function line(label, value) {
    const v = safeText(value);
    if (!v) return '';
    return `- ${label} : ${v}`;
  }

  function buildEstimate({ mission, types, urgence, taille, delai }) {
    // Estimation indicative (pas un devis) — volontairement simple et cohérente.
    // Règle: on donne une fourchette + un point d’attention (accès / périmètre).
    let base = 0;

    const has = (v) => types.includes(v);

    // Packs (valeurs indicatives, alignées à l’intention “audit + validation”)
    if (mission === 'audit-site') base = 390;
    if (mission === 'audit-automatisation') base = 450;
    if (mission === 'qa-livraison') base = 520;
    if (mission === 'debug-incident') base = 590;

    // Add-ons
    if (has('seo')) base += 120;
    if (has('a11y')) base += 150;
    if (has('performance')) base += 180;
    if (has('tracking')) base += 90;
    if (has('copy')) base += 90;
    if (has('security')) base += 180;
    if (has('ops')) base += 120;

    // Taille
    if (taille === 'moyen') base = Math.round(base * 1.25);
    if (taille === 'grand') base = Math.round(base * 1.6);

    // Délai
    if (delai === '48h') base = Math.round(base * 1.25);
    if (delai === '7j') base = Math.round(base * 1.1);

    // Urgence (incident)
    if (urgence === 'bloquant') base = Math.round(base * 1.25);

    const low = clamp(Math.round(base * 0.85), 190, 9999);
    const high = clamp(Math.round(base * 1.15), 240, 14999);
    return { low, high };
  }

  function buildClaudePrompt(payload) {
    const intro = `Tu es mon copilote d’exécution (Pinapp). Je veux une réponse qui m’aide à DECIDER et à LIVRER.
Réponds en français, de façon courte, structurée et actionnable.

Contraintes:
- Tout est validé par moi avant envoi au client.
- Ne demande pas “plus d’infos” en boucle: si une info manque, propose l’option A/B et l’impact.
- Termine par une checklist de validation sur téléphone.
`;

    const ask = `Ce que j’attends de toi:
1) Décortique le message / le besoin (résumé en 6 lignes max)
2) Liste les actions à faire (ordre exact, 8–15 items max)
3) Check QA (site livré / automatisations) adaptée au cas
4) Risques + points à vérifier (accès, scope, prod, RGPD, perf)
5) Questions à poser (si nécessaire) — 6 questions max, ultra simples
6) Estimation indicative (effort et complexité) + ce qui fait varier le coût
`;

    const ctxLines = [
      line('Nom du projet', payload.projet_nom),
      line('URL (prod/staging)', payload.projet_url),
      line('Type de mission', payload.mission_label),
      line('Ce que je dois vérifier', payload.types_labels.join(', ')),
      line('Taille', payload.taille_label),
      line('Délai', payload.delai_label),
      line('Urgence', payload.urgence_label),
      line('Stack / CMS / outil', payload.stack),
      line('Accès disponibles', payload.acces),
      line('Contrainte / notes', payload.notes),
    ]
      .filter(Boolean)
      .join('\n');

    const message = safeText(payload.message);
    const files = payload.files && payload.files.length ? payload.files.join(', ') : '';

    return `${intro}
### Contexte
${ctxLines || '- (non renseigné)'}

### Message à analyser
${message ? `"""${message}"""` : '(vide)'}

### Pièces / fichiers sélectionnés (local)
${files || '(aucun)'}

${ask}
`;
  }

  function render() {
    const form = $('#accompagnementForm');
    if (!form) return;

    const mission = getOne('mission');
    const types = getMulti('types');
    const taille = getOne('taille');
    const delai = getOne('delai');
    const urgence = getOne('urgence');

    const projet_nom = safeText($('#projetNom')?.value);
    const projet_url = safeText($('#projetUrl')?.value);
    const stack = safeText($('#projetStack')?.value);
    const acces = safeText($('#projetAcces')?.value);
    const message = safeText($('#messageClient')?.value);
    const notes = safeText($('#notes')?.value);

    const files = Array.from($('#pieces')?.files || []).map(
      (f) => `${f.name} (${Math.round(f.size / 1024)} Ko)`,
    );

    const maps = {
      mission: {
        'audit-site': 'Audit site livré (UI + bugs + cohérence)',
        'audit-automatisation': 'Audit automatisations (scénarios + fiabilité)',
        'qa-livraison': 'Validation avant livraison (check complet)',
        'debug-incident': 'Incident / bug bloquant (diagnostic rapide)',
      },
      types: {
        qa: 'Qualité générale',
        performance: 'Performance',
        a11y: 'Accessibilité',
        seo: 'SEO',
        tracking: 'Tracking / analytics',
        security: 'Sécurité / surface d’attaque',
        ops: 'Déploiement / cache / domaine',
        copy: 'Textes / cohérence commerciale',
      },
      urgence: {
        normal: 'Normal',
        prioritaire: 'Prioritaire',
        bloquant: 'Bloquant',
      },
      taille: {
        petit: 'Petit (1 page / 1 flow)',
        moyen: 'Moyen (quelques pages / plusieurs flows)',
        grand: 'Grand (site complet + plusieurs automatisations)',
      },
      delai: {
        '48h': '48 h',
        '7j': '7 jours',
        '14j': '14 jours',
      },
    };

    const payload = {
      mission,
      mission_label: maps.mission[mission] || '',
      types,
      types_labels: types.map((t) => maps.types[t]).filter(Boolean),
      urgence,
      urgence_label: maps.urgence[urgence] || '',
      taille,
      taille_label: maps.taille[taille] || '',
      delai,
      delai_label: maps.delai[delai] || '',
      projet_nom,
      projet_url,
      stack,
      acces,
      message,
      notes,
      files,
    };

    const est = buildEstimate({ mission, types, urgence, taille, delai });
    const estimateText = mission
      ? `${fmtEUR(est.low)} – ${fmtEUR(est.high)}`
      : 'Choisis une mission pour afficher une estimation.';

    const brief = [
      payload.projet_nom ? `PROJET: ${payload.projet_nom}` : 'PROJET: (à nommer)',
      payload.projet_url ? `URL: ${payload.projet_url}` : 'URL: (à ajouter)',
      payload.mission_label ? `MISSION: ${payload.mission_label}` : 'MISSION: (à choisir)',
      payload.types_labels.length
        ? `VÉRIFICATIONS: ${payload.types_labels.join(' · ')}`
        : 'VÉRIFICATIONS: (à choisir)',
      payload.delai_label ? `DÉLAI: ${payload.delai_label}` : '',
      payload.urgence_label ? `URGENCE: ${payload.urgence_label}` : '',
      '',
      payload.stack ? `STACK: ${payload.stack}` : '',
      payload.acces ? `ACCÈS: ${payload.acces}` : '',
      payload.notes ? `NOTES: ${payload.notes}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    const prompt = buildClaudePrompt(payload);

    $('#estimateValue').textContent = estimateText;
    $('#briefOutput').value = brief;
    $('#promptOutput').value = prompt;

    const subject = `Pinapp — accompagnement — ${payload.projet_nom || 'projet'}`;
    const body = `${brief}\n\nESTIMATION (indicative): ${estimateText}\n\nMESSAGE:\n${payload.message || '(vide)'}\n\n---\nPROMPT CLAUDE:\n${prompt}\n`;
    const mailto = `mailto:lauralie.daguzay@pinapp.fr?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const mailBtn = $('#sendEmail');
    if (mailBtn) mailBtn.setAttribute('href', mailto);
  }

  async function copyFrom(id) {
    const el = $(id);
    if (!el) return;
    const txt = el.value || el.textContent || '';
    try {
      await navigator.clipboard.writeText(txt);
      return true;
    } catch {
      try {
        el.focus();
        el.select?.();
        document.execCommand('copy');
        return true;
      } catch {
        return false;
      }
    }
  }

  function wire() {
    const form = $('#accompagnementForm');
    if (!form) return;

    const inputs = $$('input, textarea, select', form);
    inputs.forEach((el) => {
      el.addEventListener('input', render);
      el.addEventListener('change', render);
    });

    $('#copyBrief')?.addEventListener('click', async () => {
      const ok = await copyFrom('#briefOutput');
      const hint = $('#copyHint');
      if (hint) hint.textContent = ok ? 'Copié.' : 'Copie impossible sur ce navigateur.';
      setTimeout(() => {
        if (hint) hint.textContent = '';
      }, 1400);
    });

    $('#copyPrompt')?.addEventListener('click', async () => {
      const ok = await copyFrom('#promptOutput');
      const hint = $('#copyHint');
      if (hint) hint.textContent = ok ? 'Copié.' : 'Copie impossible sur ce navigateur.';
      setTimeout(() => {
        if (hint) hint.textContent = '';
      }, 1400);
    });

    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wire);
  } else {
    wire();
  }
})();

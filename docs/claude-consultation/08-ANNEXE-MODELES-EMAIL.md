# 08 — Annexe : modèles d’e-mails (veille, sécurité, RH / admin)

> **GitHub :** [ce fichier](https://github.com/lauraliedaguzay-lang/pinapp-site/blob/main/docs/claude-consultation/08-ANNEXE-MODELES-EMAIL.md) · [dossier `claude-consultation`](https://github.com/lauraliedaguzay-lang/pinapp-site/tree/main/docs/claude-consultation)

_Copie intégrée pour dossier autonome — mirror de `docs/automation/DIGESTS-EMAIL-PINAPP.md`._

---

# E-mails automatiques Pinapp — veille tech + rappels RH / admin

Objectif : recevoir des **messages structurés** qui te font gagner du temps et donnent des **prompts Cursor** prêts à l’emploi.  
Implémentation typique : **Make** (scénario hebdo) ou **Google Apps Script** + `MailApp.sendEmail`, ou **GitHub Actions** + notification.

---

## 0. Sujet des e-mails (exemples)

| Type              | Objet suggéré (préfixe commun `Pinapp —` pour filtres Gmail) |
| ----------------- | ----------------------------------------------------------- |
| Veille tech hebdo | `Pinapp — Veille tech · semaine du JJ/MM/AAAA`              |
| Alertes sécurité  | `Pinapp — Alertes dépendances / sécurité (action)`          |
| RH & admin        | `Pinapp — RH & admin · semaine du JJ/MM/AAAA`               |
| Client / prospect | `Pinapp — Diagnostic — Prénom` ou `Pinapp — Votre projet — …` |

---

## 1. Mail « Veille tech hebdo » (corps modèle)

**Objet :** `Pinapp — Veille tech · semaine du {{date}}`

**Corps (texte) :**

```
Bonjour Lauralie,

Voici la synthèse Pinapp (stack site + outils) pour cette semaine.

━━ NOUVEAUTÉS DÉTECTÉES ━━
• {{item_1}} — source : {{url_1}}
• {{item_2}} — source : {{url_2}}
• {{item_3}} — source : {{url_3}}

━━ PERTINENCE POUR PINAPP-SITE ━━
{{paragraphe_court : pourquoi ça compte ou pas}}

━━ SUGGESTIONS D’IMPLÉMENTATION (à valider) ━━
1) {{action_1}}
2) {{action_2}}
3) {{action_3}}

━━ PROMPTS À COLLER DANS CURSOR ━━

[PROMPT A — dépendance / build]
« Sur le dépôt pinapp-site : {{lib}} est passé en {{version}}. Lis README/changelog,
vérifie compatibilité avec notre usage ({{fichiers}}), propose un plan de mise à jour
minimal et les fichiers à modifier. Ne casse pas le déploiement GitHub Pages. »

[PROMPT B — sécurité / CI]
« Vérifie package.json / workflows GitHub Actions pour pinapp-site : {{alerte}}.
Corrige si pertinent ou documente pourquoi on ignore. »

[PROMPT C — front]
« {{nouveauté_CSS_ou_API_navigateur}} : est-ce utile pour pinapp.fr ?
Si oui, propose une petite amélioration concrète avec fichiers ciblés. »

━━ RAPPEL ━━
Rien n’est mergé sans ton feu vert sur GitHub / Cursor.

— Pinapp Studio (automatisation interne — brouillon à valider)
```

Remplace les `{{…}}` par ton scénario (Make mappe RSS → OpenAI/Claude → email, ou rédaction manuelle assistée).

---

## 2. Mail « Alertes sécurité » (déclenché si alerte)

**Objet :** `Pinapp — Sécurité · action requise ou veille`

**Corps :**

```
Résumé : {{titre_alerte}}
Gravité / CVE : {{cvss_ou_npm_severity}}
Fichiers concernés : {{chemins}}

Action recommandée :
1) {{étape_1}}
2) {{étape_2}}

Prompt Cursor :
« pinapp-site : traiter {{titre_alerte}} — appliquer correctif minimal, lancer les
checks dispo (lint/build si présents), résumer le diff. »
```

---

## 3. Mail « RH & administratif » (hebdo, assisté)

**Objet :** `Pinapp — RH & admin · semaine du {{date}}`

**Corps :**

```
Bonjour Lauralie,

Rappels et tâches (à cocher). Ceci ne remplace pas ton expert-comptable ni les
portails officiels (URSSAF, impots.gouv, etc.).

━━ CETTE SEMAINE ━━
□ {{tâche_admin_1}}  (échéance : {{date_1}})
□ {{tâche_rh_1}}
□ Relance fournisseur / client : {{sujet}}

━━ BROUILLONS À VALIDER (dans Gmail) ━━
• {{sujet_brouillon_1}}
• {{sujet_brouillon_2}}

━━ DOCUMENTS ━━
• Dossier Drive : {{lien_dossier_contrats_factures}}

━━ PROMPT CURSOR (si mise à jour site légal) ━━
« Vérifier pages legal/*.html Pinapp : cohérence avec {{changement légal mentionné}} ;
ne rien inventer ; signaler les champs à compléter manuellement. »

— Automatisation Pinapp
```

---

## 4. Sources RSS / webhooks utiles (exemples non exhaustifs)

- `https://github.com/vitejs/vite/releases.atom`
- `https://github.blog/changelog/rss/`
- Blog / feed Anthropic (si disponible en RSS) ou veille manuelle mensuelle capturée dans le scénario.

---

## 5. Lien avec la compta (Sheet)

À chaque **devis accepté** ou **facture émise** (événement manuel ou semi-auto), une ligne **onglet Pinapp** — voir règle comptabilité dans le dépôt.  
Le mail hebdo RH/admin peut inclure : « Lignes Sheet en attente de montant : {{count}} » si tu branches l’API Sheets.

---

## 6. Limites

- Pas de « Claude h24 omniscient » : **fenêtres planifiées** + **tolérance aux retards** si API en panne.
- **RGPD** : si le scénario lit des mails ou noms clients, documenter le traitement (registre, base légale).

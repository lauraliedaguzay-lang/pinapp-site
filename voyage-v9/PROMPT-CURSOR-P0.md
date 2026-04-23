# PROMPT CURSOR P0 — voyage-v9

**Référence canonique** : ce fichier documente les 6 P0. Les **liens externes** utilisent systématiquement `rel="noopener noreferrer"` (alignement dépôt Pinapp).

**Usage** : copier le bloc entre `---PROMPT-DEBUT---` et `---PROMPT-FIN---` dans le chat, ou demander : *« Applique voyage-v9/PROMPT-CURSOR-P0.md sur voyage-v9/index.html »*.

**Note stage** : ce site utilise `data-stage="01"` … `data-stage="06"` sur les `.scene` (pas `data-scene-id`). Pour hériter du fond **tarifs**, utiliser `data-stage="05"` sur **s13b** ; pour **s12b** (après M&P), utiliser `data-stage="06"` comme **s12** et **s14**.

---

## ---PROMPT-DEBUT---

```
(Tu es architecte front senior Pinapp v9 — applique les 6 P0 dans voyage-v9/index.html : HTML + <style> inline. Voir PROMPT-CURSOR-P0.md sections P0.1–P0.6 pour le détail des blocs et du CSS.)

Règles : vanilla JS only ; ne pas toucher au stage `.stage__layer` ni à la logique `data-stage` des scènes existantes sauf ajout des attributs sur les nouvelles sections ; tous les `target="_blank"` avec `rel="noopener noreferrer"`.
```

## ---PROMPT-FIN---

## P0.1 — FAQ (s13b)

- Insérer entre **scène 13** (tarifs) et **scène 14** (contact) une section `id="s13b"` avec `data-stage="05"` (même calque que la grille tarifs / scène 13).
- 5 `<details class="faq__item">` avec textes enrichis (10 % plafonné 50 %, TVA 293 B, révisions avec validation, satisfait 30 j, stack EU + n8n self-hosted + propriété code).
- CSS : `.faq`, `.faq__item`, `summary` Fraunces italic, `::after` avec `+` rotation 45° à l’ouverture, `prefers-reduced-motion`.

## P0.2 — Cal.com (scène 14)

- Dans le `#diag`, après le bouton submit et `diag__note` : `<p class="diag__or" role="separator">— ou —</p>` + lien `<a class="btn btn--secondary diag__cal" href="https://cal.com/lauralie-daguzay-hdglzw/diagnostic" target="_blank" rel="noopener noreferrer">…</a>` (sans emoji).
- CSS : `.btn--secondary`, `.diag__or`, `.diag__cal`.

## P0.3 — 13 liens `/demo/<slug>/`

- Remplacer chaque `<article class="real">` … `</article>` par `<a class="real" href="/demo/SLUG/" …>` … `</a>` avec `aria-label` descriptif ; `real__scrim` avec `aria-hidden="true"`.
- Slugs : artisan, restaurant, coach, avocat, estheticienne, cils, ongles, coiffeur, barbier, boulangerie, trainer, tatoueuse, sur-mesure.

## P0.4 — Tease portfolio

- Entre la grille `.portfolio` (fin scène 05) et le séparateur « 05b · Aperçus » : `<p class="portfolio__tease">…</p>` (sans `href`).
- CSS `.portfolio__tease` + `em`.

## P0.5 — Formations (tableau tarifs)

- Envelopper « Formation niveau 1/2/3 » dans `<a href="/formations/kit-prompts/" class="prices__link">`.
- CSS `.prices__link`.

## P0.6 — Branches sœurs (s12b)

- Entre **s12** et **s13** : section `id="s12b"` `class="scene scene--sisters"` `data-stage="06"` (même fond que M&P / contact).
- Deux cartes : Auralis `/auralis/` ; M&P `https://memoireetpresence.fr/` `target="_blank"` `rel="noopener noreferrer"`. Tag M&P **sans emoji** (règle livrable).
- CSS `.scene--sisters`, `.sisters__grid`, `.sisters__card`, etc.

---

*Mis à jour après merge `main` (fichier complet voyage-v9/index.html). Ne pas merger la PR stub #59.*

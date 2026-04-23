# GAPS — Ce que Claude a décidé avant et qui manque dans voyage-v9

> Basé sur : sessions Claude précédentes + `V24-DREAM-SPEC.md` + `TEXT-MASTER-V7.md` + `STORYBOARD-V2.3.md` + `HANDOVER-2026-04-21-NIGHT.md` + `COPY-PINAPP.md` + `realisations.json`.

**Statut (main)** : les **6 P0** sont intégrés dans `voyage-v9/index.html` (FAQ s13b, Cal.com, 13 liens `/demo/`, tease portfolio, liens formations, s12b branches sœurs). Le détail d’implémentation utilise `data-stage` (voir `PROMPT-CURSOR-P0.md`). **Ne pas merger la PR #59** (stub) si elle existe encore.

---

## 🎯 RÉSUMÉ EXÉCUTIF

voyage-v9 couvre **70%** du scope décidé dans les travaux Claude antérieurs. Les 30% manquants sont structurés en 4 blocs de priorité.

| Priorité | Blocs | Impact | Effort |
|---|---|---|---|
| 🔴 P0 | FAQ, Cal.com, liens `/demo/<slug>/`, "3 projets en prod", /formations, /auralis | Haut | 2–3h |
| 🟠 P1 | Lightbox, filtres, KPI before/after, blog | Moyen | 3–4h |
| 🟡 P2 | 4 easter eggs V7 (counter, morse, italique, chromatic) | Bas | 2h |
| 🟢 P3 | Assets des sessions précédentes (wearebrand-kit) | Vérif | 30 min |

---

## 🔴 P0 — MANQUES CRITIQUES (à ajouter AVANT prod)

### P0.1 — Section FAQ manquante
**Référence** : `TEXT-MASTER-V7.md` §305 « FAQ items à garder tels que V6 » · `STORYBOARD-V2.3.md` Lieu 8 : « 5 items `<details>` » · `V24-DREAM-SPEC.md` ch.8.

voyage-v9 n'a **aucune FAQ**. Décidée depuis V2.3, validée par Lauralie.

**Fix** : ajouter une scène (13b ou dans la 14 avant contact) avec 5 `<details>` :
```html
<section class="scene" id="s13b" data-scene-id="13b">
  <div class="container">
    <p class="eyebrow">13b · FAQ</p>
    <h2 class="h1">Les questions <em>qu'on nous pose</em> le plus.</h2>
    <div class="faq">
      <details><summary>Combien de temps pour livrer un site ?</summary>
        <p>7 jours pour un Site Vitrine, 14 jours pour un Pack Duo complet. Date de livraison ferme — 10 % de remboursement par jour de retard.</p></details>
      <details><summary>Comment se passe le paiement ?</summary>
        <p>Paiement uniquement sur livrable. Acompte 30 % à la commande, solde à la livraison validée.</p></details>
      <details><summary>Est-ce que je peux demander des révisions ?</summary>
        <p>Oui. Trois allers-retours inclus dans chaque livrable. Au-delà, nous chiffrons la révision au prorata.</p></details>
      <details><summary>Qu'est-ce qui se passe si je ne suis pas satisfait ?</summary>
        <p>Satisfait ou remboursé 30 jours. Sans justification, sans friction.</p></details>
      <details><summary>Mes données restent-elles chez vous ?</summary>
        <p>Oui. Stack 100 % européen (Hostinger, n8n, Bunny Fonts, Plausible). Aucun tracking US.</p></details>
    </div>
  </div>
</section>
```

### P0.2 — CTA Cal.com non branché
**Référence** : `V24-DREAM-SPEC.md` §6 « Cal.com : https://cal.com/lauralie-daguzay-hdglzw/diagnostic ».

voyage-v9 mise tout sur le formulaire. Lauralie a un lien Cal.com de diagnostic validé, absent du v9.

**Fix** : ajouter dans la scène 14 (à côté du form) :
```html
<a class="btn btn--secondary" href="https://cal.com/lauralie-daguzay-hdglzw/diagnostic" target="_blank" rel="noopener">
  📅 Ou prendre rendez-vous en ligne →
</a>
```

### P0.3 — Liens `/demo/<slug>/` jamais branchés sur le carrousel aperçus
**Référence** : `V24-DREAM-SPEC.md` §5 liste les 14 démos existantes : artisan, avocat, barbier, boulangerie, cils, coach, coiffeur, estheticienne, ongles, restaurant, sur-mesure, tatoueuse, trainer, atelier-rivage.

Les 13 cartes aperçus sectoriels sont actuellement **non cliquables**. Les 13 slugs existent pourtant en `/demo/`. Mapping validé :

| # | Nom carte | slug `/demo/<slug>/` |
|---|---|---|
| 01 | Renov&Co (BTP) | **artisan** |
| 02 | Ōkami (RESTO) | **restaurant** |
| 03 | Clara Fontaine (COACH) | **coach** |
| 04 | Cabinet Renaud (DROIT) | **avocat** |
| 05 | Studio Élise (SPA) | **estheticienne** |
| 06 | Lash Studio Camille (LASH) | **cils** |
| 07 | Nail Studio Nina (NAILS) | **ongles** |
| 08 | Salon Obsidian (HAIR) | **coiffeur** |
| 09 | Barber&Co (BARBER) | **barbier** |
| 10 | Maison Brioche (BOULANG) | **boulangerie** |
| 11 | Forge Athletics (FITNESS) | **trainer** |
| 12 | Nocturna Ink (INK) | **tatoueuse** |
| 13 | Luminance&Lieu (COMPLET) | **sur-mesure** |

**Fix** : transformer chaque `<article class="real">` en `<a class="real" href="/demo/<slug>/" target="_blank" rel="noopener">`. Déjà prévu dans `PATCH-CARROUSEL.md` — mais non appliqué.

### P0.4 — "3 autres projets en cours de production" non mentionnés
**Référence** : `V24-DREAM-SPEC.md` §5 : « mention honnête du type **"3 autres projets en cours de production"** (pas de `href` inventé, pas de stub dossier) ».

Les projets : **Maison Aurélie**, **Maison Céleste**, **Domaine Éclipse**, **Star Wars IA** (extensions, pas les Vimeo déjà publiés).

**Fix** : sous le portfolio 5 réalisations de la scène 05, ajouter un petit bandeau :
```html
<p class="portfolio__tease">
  + <em>Trois autres projets</em> en cours de production · Maison Aurélie · Maison Céleste · Domaine Éclipse
</p>
```
Aucun `href`, conforme à la règle du dépôt.

### P0.5 — Page `/formations/` promise, link absent
**Référence** : `TEXT-MASTER-V7.md` nav · `COPY-PINAPP.md` tarifs · `V24-DREAM-SPEC.md` ch.3.

Les 3 formations (67€ / 147€ / 397€) sont dans le tableau des tarifs, mais **aucun lien vers `/formations/`** pour détail modules / inscription.

**Fix** : dans la cellule "Formation niveau X" des 3 lignes, envelopper le nom dans `<a href="/formations/kit-prompts/">…</a>` (ou équivalent selon ce qui existe en `/formations/`).

### P0.6 — Page `/auralis/` promise, link absent
**Référence** : `TEXT-MASTER-V7.md` nav · `V24-DREAM-SPEC.md` ch.4 · `.cursorrules`.

Auralis RH est mentionné dans les skills de Lauralie (scène 07) et dans la carte W8 (scène 03b), mais **aucun lien vers la page produit**.

**Fix** : ajouter dans la scène 08 (valeurs) ou entre 12 (M&P) et 13 (tarifs), un petit bloc "Branches sœurs" :
```html
<aside class="sisters">
  <p class="eyebrow">Branches sœurs de Pinapp</p>
  <div class="sisters__grid">
    <a href="/auralis/" class="sisters__card">
      <h3>Auralis RH <em>→</em></h3>
      <p>Notre SaaS IA bien-être au travail — la preuve par l'exemple.</p>
    </a>
    <a href="https://memoireetpresence.fr/" target="_blank" rel="noopener" class="sisters__card">
      <h3>Mémoire & Présence <em>→</em></h3>
      <p>Hommages numériques · QR codes · transmission.</p>
    </a>
  </div>
</aside>
```

---

## 🟠 P1 — POLISH UX (planifié, reportable)

### P1.1 — Lightbox/modal au hover sur réalisations
**Référence** : `STORYBOARD-V2.3.md` Lieu 3 « tooltip magenta, bénéfice, CTA modal ».
Actuellement : clic Vimeo direct uniquement. La modal légère avec prix/bénéfice/CTA "En savoir plus" n'est pas implémentée.

### P1.2 — Filtres catégories sur carrousel aperçus
**Référence** : prod `backup/realisations/index.html` : filtres Tous / Beauté / Métiers / Créations / Univers poussés.
Aujourd'hui : défilement linéaire 13 cartes. Pas de groupement par univers.

### P1.3 — KPI Before/After détaillés
**Référence** : `COPY-PINAPP.md` « Stats transformationnelles » : 12h → 2h (admin), 30% → 85% (conversions), 3j → <24h (devis), ×3 (temps libre).
Ces stats sont des preuves puissantes. voyage-v9 affiche 3 stats simples (24h / 0€ / 30j) mais pas les transformations client.

### P1.4 — Lien Blog/Journal
**Référence** : `TEXT-MASTER-V7.md` nav principale.
Nav voyage-v9 n'a pas de lien blog. Même si la page n'existe pas encore, au minimum masquer proprement (pas de trou dans la nav).

### P1.5 — Manifeste V7 complet
**Référence** : `HANDOVER-2026-04-21-NIGHT.md` commit `d81aa3c`.
Citation canonique : « Vous repoussez ce qui s'accumule. Pinapp prépare. Vous décidez. C'est réglé. »
voyage-v9 a une citation différente (« Nous avons construit ces outils pour nous d'abord… »). Vérifier avec Lauralie laquelle est la bonne.

---

## 🟡 P2 — EASTER EGGS V7 (délice, reportable)

Du commit log V7 (HANDOVER-2026-04-21-NIGHT) :

### P2.1 — Scene counter slot-machine top-right
`01 / 15` fixe en haut-droite, change au scroll avec animation slot-machine.

### P2.2 — Morse STAY
Scène 04 (constellation) : animation ponctuelle `• ‒ / • ‒ / ‒ • ‒ / ‒ • ‒ ‒` = S.T.A.Y. Discret, au survol d'un spot.

### P2.3 — Phrase italique "Spider-Man"
Scène 03 : une phrase en Fraunces italic géante en overlay qui apparaît/disparaît au scroll (`tapestry-whisper`).

### P2.4 — Chromatic aberration hue-shift par scène
Léger décalage RGB (0.5–2px) qui varie par scène pour donner un grain film subtil.

---

## 🟢 P3 — ASSETS DE SESSIONS CLAUDE ANTÉRIEURES

### Session "Benchmark immersive" — fichiers livrés mais non retrouvés dans v9
La session précédente a livré dans `outputs/pinapp-fixes/` :
- `wearebrand-kit.css` (pill magnétique, badge Connected, Ken Burns, slider fade)
- `wearebrand-kit.js` (logique scroll/magnétique)
- `cupola-scroll-zoom.html` (démo scroll zoom hublot — reproduction wearebrand)
- `voyage-scenes-demo.html` (7 effets différents)
- `COPY-REWRITES.md` (10 réécritures prêtes)
- `head-optimized.html` (head refondu)
- `tokens-upgrade.css` (cascade layers)
- `critical-css-plan.md`

**À vérifier** : Lauralie — peux-tu chercher `outputs/pinapp-fixes/` sur ton disque ou dans tes anciens téléchargements ? Ces fichiers **existent** mais peut-être pas intégrés au repo actuel.

---

## ✅ CE QUI EST BIEN LÀ (ne pas toucher)

- 15 scènes structurées (01 → 14 + 03b)
- Stage fixe global avec cross-fade (wearebrand-grade)
- Portfolio 5 vraies réalisations (Star Wars hero, Walker, Resident Evil, Atelier Rivage, M&P)
- Photos Lauralie + Micha
- 13 aperçus sectoriels (bons noms, bonnes couleurs, bonnes images Unsplash)
- 6 douleurs / 6 valeurs / 5 engagements / 11 lignes tarifs / 4 piliers M&P
- Formulaire avec consent RGPD + confirmation écran
- JSON-LD, canonical, preloads, eyebrow small-caps
- Manifeste promu en `<h2>`

---

## 🎯 PROMPT CURSOR — APPLIQUER LES P0

À coller dans Cursor après `cd voyage-v9` :

```
Lis GAPS-TRAVAUX-ANTERIEURS.md, V24-DREAM-SPEC.md, TEXT-MASTER-V7.md, STORYBOARD-V2.3.md.

Applique les 6 P0 dans cet ordre :

P0.1 — Ajoute une scène 13b FAQ avec 5 <details> (délais, paiement, révisions, satisfaction, données) entre la scène 13 tarifs et la scène 14 contact. CSS minimal : <summary> en Fraunces italic, border-bottom subtil, marker chevron rotate au :open.

P0.2 — Dans la scène 14, ajoute un deuxième CTA à côté du form : <a href="https://cal.com/lauralie-daguzay-hdglzw/diagnostic" target="_blank">📅 Ou prendre rendez-vous en ligne →</a>. Style .btn--secondary cyan.

P0.3 — Transforme chaque <article class="real"> du carrousel en <a class="real" href="/demo/<slug>/" target="_blank" rel="noopener"> en utilisant le mapping slug du doc (artisan, restaurant, coach, avocat, estheticienne, cils, ongles, coiffeur, barbier, boulangerie, trainer, tatoueuse, sur-mesure).

P0.4 — Sous la grille portfolio scène 05 (avant le séparateur "05b · Aperçus sectoriels"), ajoute : <p class="portfolio__tease">+ <em>Trois autres projets</em> en cours de production · Maison Aurélie · Maison Céleste · Domaine Éclipse</p>. Italic serif, opacité 0.6, pas de href.

P0.5 — Dans le tableau tarifs scène 13, les 3 lignes "Formation niveau 1/2/3" : envelopper le label dans <a href="/formations/kit-prompts/"> (ou /formations/ si pas dispo).

P0.6 — Entre scène 12 (M&P) et scène 13 (tarifs), insère un <aside class="sisters"> avec 2 cartes : Auralis RH (href="/auralis/") et Mémoire & Présence (href="https://memoireetpresence.fr/" target="_blank"). CSS grid 2 cols, .sisters__card avec hover lift.

Après chaque P0 : vérifie visuellement dans le preview. Commit final "P0 gaps sessions antérieures appliqués".
```

---

*Gaps consolidés le 2026-04-23. Basé sur lecture complète de V24-DREAM-SPEC (138 lignes), TEXT-MASTER-V7, HANDOVER-2026-04-21-NIGHT, STORYBOARD-V2.3, COPY-PINAPP, realisations.json, et 2 sessions Claude précédentes.*

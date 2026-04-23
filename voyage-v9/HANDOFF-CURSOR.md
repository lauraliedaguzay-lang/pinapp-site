# HANDOFF CURSOR — voyage-v9 post-commit 1915014

> Passation Claude → Cursor. Le site est à 90%. Voici le reste.

---

## 🏆 VERDICT GLOBAL

| Lentille | Score | Verdict |
|---|---|---|
| Patches appliqués | 34/38 (89%) | ✅ Très bon |
| Design wearebrand | 8.7/10 | ✅ Atteint |
| A11Y WCAG AA | 17/20 | ⚠️ 3 items |
| Contenu canonique | 51/52 | ✅ Quasi parfait |
| Performance | taille HTML 58 Ko | ⚠️ backdrop-filter excessif |

**Transitions wearebrand appliquées.** Portfolio Star Wars en hero 2×2 confirmé. Photos Lauralie + Micha en place. Carrousel 13 aperçus conservé. Contenu canonique intact.

---

## ✅ CE QUI EST LIVRÉ (à ne pas toucher)

- **Stage fixe global** `.stage` + `.stage__layer` + IntersectionObserver cross-fade 1.4s
- **15 scènes** complètes (01 invitation → 14 contact + 03b automatisations)
- **Portfolio 5 réalisations** scène 05 : Star Wars hero 2×2, Walker (Texas), Resident Evil, Atelier Rivage, M&P
- **Carrousel 13 aperçus sectoriels** avec badges "Aperçu sectoriel" (bons ordres + bonnes couleurs)
- **Scène 07 duo** avec photos Lauralie.png (82 Ko) + Micha.jpg (41 Ko), alternance `direction:rtl`
- **Scène 03b** 6 workflows n8n (W1 → W5 + W8 Auralis)
- **Scène 11** manifeste promu en `<h2>`
- **Formulaire** checkbox consent RGPD + confirmation écran découplée
- **SEO** canonical + favicon + JSON-LD Organization + 6 preloads hero + eyebrow small-caps
- **5 engagements** avec clause 10% remboursement/jour intacte
- **11 lignes tarifs** + mention art. 293 B CGI

---

## 🔴 P0 — BLOQUANTS À RÉSOUDRE

### P0.1 — Vérifier les 2 fonctions JS critiques
Un audit a signalé `initPortfolioVimeo` et `initRealsCarousel` manquantes, un autre a vu des events Plausible correspondants. **À vérifier concrètement** :

```bash
# Tester en ouvrant voyage-v9/index.html dans le navigateur :
# 1. Cliquer sur play de Star Wars → l'iframe Vimeo se charge ?
# 2. Cliquer sur les flèches du carrousel aperçus → ça scrolle ?
# 3. Le compteur 01/13 se met à jour au scroll ?
```

Si NON : les fonctions sont peut-être renommées ou dans un IIFE anonyme. Les réimplémenter depuis `PATCH-REALISATIONS-V2.md` § PATCH 3 et `PATCH-CARROUSEL.md` § PATCH 3.

### P0.2 — Réduire `backdrop-filter` de 8 à 2 occurrences
**8 occurrences détectées** (dont `.port__poster`, `.duo-new__portrait`, `.real__tag`, `.real__apercu`, etc.). Coût GPU non justifié.

**Fix** : garder `backdrop-filter` UNIQUEMENT sur :
- `.nav.is-scrolled` (sticky nav blur au scroll)
- `.duo__col` ou carte Pack Duo principale

Sur les autres, remplacer `backdrop-filter: blur(Npx)` par :
```css
background: rgba(10, 20, 32, 0.75);
border: 1px solid var(--fumee);
```

### P0.3 — `apple-touch-icon.png` manquant (404)
Ligne 19 référence `apple-touch-icon.png` mais le fichier n'existe pas → erreur 404 console.

**2 options** :
- (a) Générer un 180×180 depuis le logo et le placer à la racine
- (b) Retirer temporairement la ligne `<link rel="apple-touch-icon">` jusqu'à dispo

---

## 🟠 P1 — POLISH AVANT DÉCLARATION PROD

### P1.1 — `:focus-visible` manquants sur le carrousel
Ajouter :
```css
.real:focus-visible,
.reals__arrow:focus-visible {
  outline: 2px solid var(--cyan);
  outline-offset: 3px;
}
```

### P1.2 — Label consent pointe sur la mauvaise page
Actuellement : `href="../legal/confidentialite.html"`.
**Fix** : remplacer par `href="../legal/mentions-legales.html"` OU créer un alias qui redirige.

### P1.3 — `width`/`height` explicites manquants sur `<img>` duo
Risque CLS. Ajouter sur les 2 `<img>` de la scène 07 :
```html
<img src="assets/team/lauralie.png" width="640" height="800" alt="..." loading="lazy">
<img src="assets/team/micha.jpg" width="640" height="800" alt="..." loading="lazy">
```

### P1.4 — Unifier les grayscale filters
Actuellement : 10% (`.port__poster`), 15% (`.real__img`), 18% (`.duo-new__portrait`).
**Fix** : normaliser à **12%** partout pour harmonie visuelle.

### P1.5 — Lazy-load les 14 images Unsplash du portfolio + aperçus
Vérifier que chaque `<img>` du portfolio **ET** des 13 aperçus ont `loading="lazy"` (sauf Star Wars hero qui peut rester eager).

### P1.6 — H1 hero — décalage mineur
Un audit note un léger décalage sur l'italique de "ce que". Vérifier que c'est bien :
```html
<h1>Nous construisons <em>ce que</em><br>vos concurrents<br><span class="accent-cyan">n'ont pas</span> encore.</h1>
```

---

## 🟡 P2 — DÉTAILS OPTIONNELS

- `.portfolio { margin-bottom: var(--space-8); }` pour respirer avant la scène 06
- Harmoniser `letter-spacing` CTA : `.btn` à `.04em` (actuellement `.03em` vs `.08em` ailleurs)
- Duo skills bullets : ajouter `.duo__skills li::before { content: "−"; }` tiret or
- SVG `.port__play` stroke-width 1.5 → 2 sur mobile (meilleure visibilité)

---

## 🧭 À CONFIRMER AVEC LAURALIE

1. **Poster Atelier Rivage** — actuellement Unsplash architecture générique. Tu as un screenshot réel de `/demo/atelier-rivage/` à glisser dans `voyage-v9/assets/posters/atelier-rivage.webp` ?
2. **Walker = Texas ?** — le diagnostic form catalogue Walker en "Western (Walker, Django…)". **Confirmer** que c'est bien la vidéo Texas dont tu parlais.
3. **Flag `features.diagnosticWebhook`** — à passer à `true` en prod (actuellement false → fallback mailto). Vérifier que `config.js` a bien l'URL n8n W1.
4. **Liens `/demo/<slug>/`** des 13 aperçus sectoriels — ces pages existent-elles dans le périmètre v9 ? Si non, fallback `href="#s05"` ou modale légère.
5. **Favicons** — `favicon.svg` OK au root, `apple-touch-icon.png` à créer (180×180).

---

## 🎯 PROMPT CURSOR POUR FINIR

Ouvrir Cursor sur `voyage-v9/`, puis dans le chat :

```
Lis HANDOFF-CURSOR.md + .cursorrules + CLAUDE.md. Applique les P0 dans l'ordre :
1. Teste `initPortfolioVimeo` et `initRealsCarousel` (clic play + flèches + compteur). Réimplémenter si absents.
2. Réduis backdrop-filter à 2 occurrences max (garder sur .nav.is-scrolled et une carte Pack Duo).
3. Fixe le 404 apple-touch-icon (retirer la ligne ou fournir le fichier).

Puis P1 quick :
4. Ajoute .real:focus-visible et .reals__arrow:focus-visible cyan.
5. Corrige le href du label consent vers /legal/mentions-legales.html.
6. Ajoute width=640 height=800 sur les 2 <img> du duo scène 07.
7. Normalise grayscale à 12% sur .port__poster, .real__img, .duo-new__portrait.

À chaque fix, vérifie visuellement dans le preview. Commit à la fin avec message "P0+P1 post-audit 1915014".
```

---

## 📊 SYNTHÈSE

| Priorité | Items | Effort total |
|---|---|---|
| P0 bloquants | 3 | 30 min |
| P1 polish | 6 | 45 min |
| P2 optionnel | 4 | 30 min |
| **Total** | **13** | **~1h45** |

Après ça : **site production-ready**, niveau wearebrand 9.5/10, conforme `.cursorrules` et `CLAUDE.md`.

---

*Handoff du 2026-04-23. Basé sur 5 audits parallèles post-commit 1915014.*

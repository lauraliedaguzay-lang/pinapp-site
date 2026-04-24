# PATCH — Aperçus sectoriels Unsplash + 14e carte architecture

## Contexte

La passe « 10/10 » avait remplacé les vignettes `.real` par `hero-1..6.webp` en boucle, avec `alt=""`. Décision produit : **Unsplash sectoriel** sur la home V9 pour la cohérence immédiate secteur ↔ image, en attendant des captures WebP par slug.

## Changements `voyage-v9/index.html`

1. **Preconnect** : `https://images.unsplash.com` (+ `dns-prefetch`).
2. **13 cartes** : `src` Unsplash selon tableau produit + **alts sémantiques** + conservation `width="960" height="720" loading="lazy" decoding="async"`.
3. **14e carte** : **Atelier Rivage** (`/demo/atelier-rivage/`) — architecture / villas — image `photo-1600585154340-be6161a56a0c`, tag `ARCHI`.
4. **Compteurs / textes** : `13` → `14` (nav drawer, titres s05, compteur carrousel `01 / 14`). Le JS du carrousel déduit `total` du DOM.
5. **Placeholder draft** : libellé aligné sur « remplacer Unsplash par captures ».

## R1

Les **6** `assets/hero-1.webp` … `hero-6.webp` restent référencés ailleurs (stage, OG, etc.) — non modifiés en binaire.

## Démos sectorielles (`demo/*/index.html`)

**Bug corrigé** : `demo-photo-packs.js` était chargé avec `defer` **avant** le script inline `Object.assign(..., PINAPP_DEMO_PHOTO_PACKS.*)`, donc `PINAPP_DEMO_PHOTO_PACKS` était `undefined` au moment de l’assignation → héros sans images sur coach, esthéticienne, coiffeur, boulangerie, trainer, sur-mesure.

**Fix** : retirer `defer` sur `<script src=".../demo-photo-packs.js">` pour ces 6 pages (chargement synchrone avant l’inline).

## Atelier Rivage (`demo/atelier-rivage/index.html`)

- **4 diapositives** + entrées `data` + miniatures (10 projets au total).
- **Preconnect** Unsplash.
- Bandeau **« Démo Pinapp · visuels d'illustration (Unsplash) · données fictives »**.

## Validation bash (adaptée)

```bash
FILE=voyage-v9/index.html
grep -c 'images\.unsplash\.com' "$FILE"   # attendu : >= 13
grep -c 'class="real"' "$FILE"            # attendu : 14
grep -c 'hero-[1-6]\.webp' "$FILE"        # R1 : autres usages hero
grep -c 'preconnect.*images\.unsplash' "$FILE"  # 1
```

---

*2026-04-24 — branche `cursor/voyage-v9-audit-fixes-0309`.*

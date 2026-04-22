# Audit V8.3 — Baseline Lighthouse
Date : mercredi 22 avril 2026 — 17:28:35 UTC (run mobile, `fetchTime` JSON) ; desktop : 17:29:15 UTC
URL : https://pinapp.fr/
Branche : feat/v8-3-enterrement-et-perf

## Scores

| Métrique         | Mobile | Desktop | Cible V8.3 |
|------------------|--------|---------|------------|
| Performance      | N/A (`categories.performance.score` absent — TBT/TTI en erreur `NO_TTI_CPU_IDLE_PERIOD`) | N/A (idem) | ≥ 72       |
| Accessibilité    | 100 | 100 | ≥ 90       |
| Best Practices   | 96 | 96 | ≥ 90       |
| SEO              | 100 | 100 | ≥ 95       |

## Web Vitals

| Métrique | Mobile | Desktop | Seuil Google |
|----------|--------|---------|--------------|
| LCP      | 2.5 s | 2.4 s | ≤ 2.5 s      |
| CLS      | 0 | 0 | ≤ 0.1        |
| TBT      | erreur audit (`scoreDisplayMode: error`, `NO_TTI_CPU_IDLE_PERIOD`) | idem | ≤ 200 ms     |
| INP      | — (audit absent / non renseigné dans ce run) | idem | ≤ 200 ms     |
| FCP      | 2.5 s | 2.4 s | ≤ 1.8 s      |
| Speed Index | 5.0 s | 4.9 s | ≤ 3.4 s      |

## Opportunités prioritaires identifiées par Lighthouse

Critère appliqué : audits dans `audits` avec `score < 1` et `details.type === "opportunity"`, tri par `details.overallSavingsMs` décroissant.

1. **Minify CSS** (`unminified-css`) — économie estimée : **0 ms** (`overallSavingsMs: 0`, `overallSavingsBytes: 4401` — fichiers `tokens-voyage.css`, `voyage.css`)

Aucune autre opportunité ne satisfait simultanément `score < 1` et `details.type = opportunity` dans le JSON mobile ; les autres audits « opportunity » ont `score: 1` et `overallSavingsMs: 0`.

## Taille du repo

121M	.

## Notes

Baseline prise avant tout refactor V8.3.
Aucun fichier existant modifié lors de cette étape (hors ajout de ce rapport et des deux JSON Lighthouse).

**Environnement d’exécution** : Node v22.22.2 ; Lighthouse 13.1.0 via `npx`.

**Premier run mobile** (commande exacte demandée avec `--chrome-flags="--headless --no-sandbox"`) : onglet Chrome **TARGET_CRASHED** après navigation — JSON invalide pour baseline (scores nuls / erreur).

**Run mobile et desktop retenus** : `--max-wait-for-load=60000` et `--chrome-flags="--headless=new --no-sandbox --disable-dev-shm-usage --disable-gpu --disable-software-rasterizer"` — navigation complète ; desktop : log « Timed out waiting for page load » puis poursuite.

**Performance** : `categories.performance.score` est `null` car les audits **Total Blocking Time** et **Time to Interactive** sont en erreur (`NO_TTI_CPU_IDLE_PERIOD` — pas de période CPU idle suffisante pour TTI sur la trace).

**Métrique associée** : **Max Potential First Input Delay** (mobile) : **420 ms** (`numericValue` 419,888 ms).

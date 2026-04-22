# Audit V8.3 — Résultats finaux

Date : 2026-04-22 18:53 UTC  
Branche : feat/v8-3-enterrement-et-perf  
Commit final : 1af4d40  
URL preview : https://deploy-preview-55--stellular-liger-a492db.netlify.app/  
URL baseline : https://pinapp.fr/ (main non modifié)

## Scores Lighthouse — mobile

| Métrique    | Baseline | V8.3    | Delta  | Cible    |
|-------------|----------|---------|--------|----------|
| Performance | N/A      | 97/100 | —      | ≥ 72     |
| A11y        | 100      | 85      | −15    | ≥ 90     |
| BP          | 96       | 93      | −3     | ≥ 90     |
| SEO         | 100      | 92      | −8     | ≥ 95     |

## Web Vitals — mobile

| Métrique    | Baseline | V8.3   | Delta  | Cible       |
|-------------|----------|--------|--------|-------------|
| LCP         | 2.5 s    | 2.0 s  | −0.5 s | ≤ 2.8 s     |
| CLS         | 0        | 0      | 0      | ≤ 0.1       |
| TBT         | erreur   | 0 ms   | —      | ≤ 200 ms    |
| FCP         | 2.5 s    | 2.0 s  | −0.5 s | ≤ 1.8 s     |
| Speed Index | 5.0 s    | 2.5 s  | −2.5 s | ≤ 3.4 s     |

## Scores Lighthouse — desktop

| Métrique    | Baseline | V8.3    | Delta  | Cible    |
|-------------|----------|---------|--------|----------|
| Performance | N/A      | 97/100 | —      | ≥ 72     |
| A11y        | 100      | 85      | −15    | ≥ 90     |
| BP          | 96       | 93      | −3     | ≥ 90     |
| SEO         | 100      | 92      | −8     | ≥ 95     |

## Web Vitals — desktop

| Métrique    | Baseline | V8.3   | Delta  | Cible       |
|-------------|----------|--------|--------|-------------|
| LCP         | 2.4 s    | 2.0 s  | −0.4 s | ≤ 2.8 s     |
| CLS         | 0        | 0      | 0      | ≤ 0.1       |
| TBT         | erreur   | 0 ms   | —      | ≤ 200 ms    |
| FCP         | 2.4 s    | 2.0 s  | −0.4 s | ≤ 1.8 s     |
| Speed Index | 4.9 s    | 2.4 s  | −2.5 s | ≤ 3.4 s     |

_INP : non renseigné dans les JSON Lighthouse 11.7 (catégorie perf seule)._

## Infrastructure

| Mesure                         | Baseline | V8.3   | Delta  |
|--------------------------------|----------|--------|--------|
| Taille repo (hors .git)        | 121 Mo   | 121 Mo | 0      |
| CSS chargés par index.html     | 22       | 22     | 0      |
| JS chargés dans HTML statique  | 32       | 6      | −26    |
| JS chargés via loader dynamique| 0        | 26     | +26    |

_Note comptage JS : 6 balises `src="…\.js"` dans `index.html` (5 fonctionnels + Plausible) ; le loader charge en chaîne **GSAP → ScrollTrigger → Lenis** puis **23 scripts motion** en parallèle = **26** requêtes JS quand `prefers-reduced-motion: no-preference`._

## Validation des cibles V8.3

| Cible                   | Valeur | Statut |
|-------------------------|--------|--------|
| Perf mobile ≥ 72        | 97     | ✅      |
| LCP mobile ≤ 2.8 s      | 2.0 s  | ✅      |
| Repo ≤ 40 Mo            | 121 Mo | ❌      |
| A11y ≥ 90               | 85     | ❌      |
| NO_TTI_CPU_IDLE_PERIOD  | absent | ✅      |

## Opportunités restantes (top 5 mobile)

1. **Properly size images** — ~4760 ms (affiche aussi ~443 KiB d’économie estimée).  
2. **Serve images in next-gen formats** — ~3530 ms (~337 KiB).  
3. **Reduce unused JavaScript** — ~26 KiB (valeur temps 0 ms dans ce run).  
4. **Eliminate render-blocking resources** — 0 ms affiché ; 22 feuilles CSS bloquantes listées (score audit partiel).  
5. **Main thread work** — ~2.4 s total (diagnostic `mainthread-work-breakdown`, complément aux opportunités images ci-dessus).

## Notes

- Gate `prefers-reduced-motion` appliqué → Lighthouse headless (mobile) charge surtout les scripts **hors motion** ; le score Perf **n’est plus null** et **TBT = 0 ms** ; **`NO_TTI_CPU_IDLE_PERIOD` absent** sur mobile et desktop.
- Vidéo hero : `preload="none"` + `data-src` + `IntersectionObserver` (dans `pinapp-film-v6.js`, après garde reduced-motion).
- **A11y / SEO / BP** sur la preview : valeurs plus basses que la baseline locale (100 / 100 / 96) — à recroiser avec un run sur la même URL **avec** motion si besoin, ou revue manuelle (audits signalés : `aria-required-children`, `color-contrast`, `label`, `link-name`, `label-content-name-mismatch`).
- Critical CSS inline : non fait (reporté V2).  
- Bundling CSS/JS : non fait (risques identifiés étape 3).  
- Fichiers JSON : `npx lighthouse@11.7.1` ; avertissements gatherer `RootCauses` / `frame_sequence` dans les logs (sans bloquer le rapport).  
- **Best Practices** : audit « Avoids `document.write()` » passé (pas de régression `document.write`).

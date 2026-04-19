# Rapport — Refonte Voyage V2 (exécution agent)

**Branche** : `refonte-aura-traces-df83`  
**Stratégie** : page dédiée **`/voyage/`** — l’accueil racine `index.html` n’est **pas** remplacé dans cette passe.

## Phases réalisées

| Phase | Statut | Notes |
|-------|--------|--------|
| 0 | OK | `docs/V2-AUDIT-PHASE-0.md` |
| 0.5 | OK | `MOODBOARD-PHASE-0.5.md` |
| 1 | OK | 22 PNG Pollinations via `pinapp-generate-voyage-images.ps1` |
| 2 | OK | `assets/css/tokens-voyage.css`, Geist woff2 ×4 (jsDelivr fontsource), `assets/images/ananas-filigrane.svg` |
| 3–4 | OK | `voyage/index.html` + `assets/css/voyage.css` |
| 5 | Partiel | `voyage.js` (Lenis+ScrollTrigger basique, reveals, stats, planet panel), `voyage-particles.js` (2D MVP — `particles.js` Pandora inchangé pour le reste du site) |
| 6 | Partiel | `config-voyage.js`, `forms-voyage.js`, `.env.example` (restauré + clés n8n), `README-CONFIG-V2.md` |
| 7 | Non exécuté ici | **Lighthouse** : à lancer en local / CI (`npx lighthouse https://…/voyage/`). |
| 8 | Non fait | Pages légales inchangées (liens depuis footer voyage). |
| 9 | Push | À vérifier après `git push` de ce commit. |

## Fichiers ajoutés / modifiés (principaux)

- `voyage/index.html`
- `assets/css/tokens-voyage.css`, `assets/css/voyage.css`
- `assets/js/voyage.js`, `voyage-particles.js`, `config-voyage.js`, `forms-voyage.js`
- `assets/fonts/geist-sans-400|500|600|700.woff2`
- `assets/images/voyage/*.png` (×22)
- `assets/images/ananas-filigrane.svg`
- `MOODBOARD-PHASE-0.5.md`, `docs/V2-AUDIT-PHASE-0.md`, `README-CONFIG-V2.md`, `RAPPORT-REFONTE-V2.md`
- `.env.example` (réintégration contenu Auralis + lignes n8n)

## À remplir (Lauralie)

1. `assets/js/config-voyage.js` → `webhooks.diagnostic`, `newsletter`, `parrainage`.  
2. Remplacer les **placeholders duo** (dégradés) par vraies photos si autorisées.  
3. Lien LinkedIn Lauralie (actuellement générique).  
4. Cal.com « audit express » si URL distincte du diagnostic.

## Garde-fous présents

- `prefers-reduced-motion` (CSS tokens + JS).  
- Bouton **Mode sobre** (`#voyage-sober-btn` → classe `html.voyage-sober`).  
- `html.low-perf` si `hardwareConcurrency < 4`.  
- Honeypot + rate limit formulaires.

## Limites connues

- Particules = **MVP** (pas morphing 2–3 s entre scènes).  
- ScrollTrigger : **scrub zoom image** par scène, pas pin `+=150%` complet (itération suivante).  
- Pas de page `/parrainage/` ni `/auralis-rh/` séparées dans cette passe.

---

*Généré automatiquement — compléter après Lighthouse et validation preview.*

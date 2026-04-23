# PROMPT CURSOR ULTIME V2 — voyage-v9 (phases 2 à 7)

**État** : la **Phase 1** (encarts **draft mode** + `Ctrl+D` + liste des assets) est intégrée dans `voyage-v9/index.html` sur `main` (commit dédié). Les **6 photos hero** restent **intouchables**.

## Règles immuables (R1–R6)

- **R1** — `hero-1` … `hero-6` : ne pas remplacer ni retoucher les fichiers du stage.
- **R2** — Stage fixe + logique `IntersectionObserver` / `data-stage` : ne pas casser sans brief explicite.
- **R3** — Vanilla JS, Bunny Fonts (déjà sur la page).
- **R4** — Voix Pinapp + vocabulaire M&P (voir `.cursorrules`).
- **R5** — `rel="noopener noreferrer"` sur liens externes `target="_blank"`.
- **R6** — `prefers-reduced-motion` pour toute nouvelle animation non essentielle.

## Phases restantes (à lancer dans une session Cursor dédiée)

| Phase | Contenu indicatif |
|-------|-------------------|
| 2 | Scène **05d Films IA** + 4 paliers tarifaires + lignes tableau 13 si besoin |
| 3 | Formulaire : option « Film à offrir » + champ conditionnel |
| 4 | Easter eggs V7 (compteur, morse, chromatic) — respect R6 |
| 5 | Footer : 7 logos SVG partenaires (fichiers dans `voyage-v9/assets/partners/`) |
| 6 | Enrichir les docs `docs/COMPTABILITE-2026.md`, `RUNBOOK`, `PACTE` avec données réelles (hors dépôt pour secrets) |
| 7 | Vérif Lighthouse / liens / commit final |

## Comment lancer

1. `git pull origin main`
2. Ouvrir ce fichier + `voyage-v9/index.html`
3. Coller dans le chat une consigne du type : *« Exécute PROMPT-CURSOR-ULTIME-V2.md phases 2 à 4 uniquement »* (découper pour limiter la taille du diff).

---

*Référence audit : `ORGANISATION-INTERNE-PINAPP.md` (même dossier).*

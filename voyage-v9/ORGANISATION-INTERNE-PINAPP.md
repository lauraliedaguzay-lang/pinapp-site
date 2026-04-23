# Organisation interne Pinapp — audit et priorités

Synthèse des points soulevés dans la session (score indicatif, chantiers prioritaires, **règle hero intouchable**).

## Règle absolue — voyage-v9

Les fichiers **`voyage-v9/assets/hero-1.webp`** à **`hero-6.webp`** (et PNG équivalents si présents) sont **réservés au stage**. Ne pas les remplacer par des captures ou des mocks. Tout nouvel asset passe par **contenu overlay** ou **remplacement de vignettes** (posters portfolio, carrousel, etc.).

## Mode draft sur la page

Dans `voyage-v9/index.html` :

- **`Ctrl+D`** (sans focus dans un champ) active / désactive **`body.draft-mode`**.
- Les blocs **`.placeholder-asset`** listent les livrables visuels / vidéos attendus (invisibles sans draft).
- Badge fixe bas-droite : `DRAFT MODE · N encarts`.

## Chantiers organisation (rappel)

1. Renouvellement / alarmes **Hostinger** (calendrier).
2. **Notion Finance 2026** (factures, dépenses, URSSAF) — voir `docs/COMPTABILITE-2026.md`.
3. Consultation **expert-comptable / juriste** (forme société, pacte).
4. **Drive partagé** structuré + **2FA** sur comptes sensibles.
5. Canal **Telegram** duo (réutiliser le bot existant si pertinent).
6. **Clockify** ou équivalent pour le temps réel par projet.

## Fichiers gabarits créés dans le dépôt

| Fichier | Rôle |
|---------|------|
| `docs/COMPTABILITE-2026.md` | Structure Notion / règles sans chiffres sensibles |
| `docs/studio/RUNBOOK-CONTINUITE.md` | Reprise minimale si indisponibilité |
| `docs/studio/PACTE-ASSOCIES-TEMPLATE.md` | Canevas pour juriste |

## Suite technique (hors ce commit)

Un prompt **multi-phases** (05d Films IA, easter eggs V7, partenaires SVG détaillés, etc.) peut vivre dans `PROMPT-CURSOR-ULTIME-V2.md` — à décliner quand le périmètre est figé.

---

*Consolidé 2026-04-23. Process détaillé : `docs/studio/PROCESSUS-UNIQUE-PINAPP.md`.*

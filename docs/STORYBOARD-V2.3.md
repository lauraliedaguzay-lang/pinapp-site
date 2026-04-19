# Pinapp V2.3 — Storyboard « Nuit d'Arabie » (8 lieux)

Plan-séquence scrollable : une timeline GSAP unique pilote caméra (translate/scale), overlays, sous-titres et transitions type whip-pan (clip-path). Mode rapide : HTML statique `/services/` pour SEO et garde-fous (réduction de mouvement, 2G, batterie faible).

## Lieu 1 — Vaisseau en dérive

- Visuel : `01-seuil` + overlay sombre fort.
- Caméra : translation lente X, léger parallax Y, scale quasi macro.
- Sous-titre : narration blanche, 3–7 mots.
- CTA flottant diagnostic (cyan contour) dès ~5 s après entrée voyage.

## Lieu 2 — Hublot duo Bordeaux

- Visuel : `02-corridor` + silhouettes SVG décoratives.
- Caméra : respiration scale 1 → 1.05, translation minimale.
- Sous-titre : duo / Bordeaux.

## Lieu 3 — Marché des services (cœur business)

- Visuel : `03-cockpit-planete` (desktop v1) + overlay.
- Objets diégétiques : cristal (Sites), engrenages (Automatisation), sphère (IA), holo cinéma (Vidéo) — SVG + rotations CSS lentes.
- Drone : `MotionPathPlugin` sur path SVG entre les quatre objets (desktop).
- Interaction : hover/focus/tap → tooltip (prix magenta, bénéfice, CTA « En savoir plus » → modal légère) ; pause timeline douce.

## Lieu 4 — Salle des cristaux / formations

- Visuel : `04-pod-voie-lactee` v2 teintée (CSS filter) pour effet bibliothèque.
- Quatre « livres » (cartes sobres) : Kit prompts 49 € TTC, Claude (liste d’attente), n8n (à venir), Vidéo IA (à venir).
- Caméra : montée verticale (translateY négatif progressif).

## Lieu 5 — Cockpit réalisations

- Visuel : `03-cockpit-planete-desktop-v2`.
- Planète SVG : régions cliquables (univers + réalisations) + panneau `aria-live`.
- Caméra : dolly-in (scale), scrub plus lent (contemplatif).

## Lieu 6 — Pod preuves

- Visuel : `04-pod-voie-lactee-desktop` (v1 ou v2 selon fichier existant).
- Stats holo + compteurs au scroll.
- Teaser Mémoire & Présence (lien config `mpExternal`).
- Newsletter + badges crédibilité (SIRET, stack UE, Lighthouse, n8n France, 30 j, offre lancement -30 %).

## Lieu 7 — Warp manifeste

- Visuel : `05-warp`.
- Caméra : avancée rapide, motion blur via `filter` animé (modéré).
- Signature Lauralie & Michaël (italique discret).

## Lieu 8 — Bridge conversion

- Visuel : `06-bridge-lune-desktop-v1`.
- FAQ `<details>` × 5, formulaire holo (webhook diagnostic), CTAs : Envoyer (magenta unique primaire), Cal.com diagnostic, Cal.com audit express 490 €.

## Calibrage premium (anti V2.1 flashy)

- Overlay `--voyage-overlay-dark` ~45 % sur fonds.
- Magenta réservé au submit lieu 8 + CTA modal « En savoir plus ».
- Particules : 20–80 selon breakpoint / perf.
- Glows ~50 % vs V2.1.

## Audio (V2.3)

**Aucun son** : pas de fichier audio, pas de Web Audio, pas de toggle dans l’UI. Immersion uniquement visuelle (scroll, particules, sous-titres, profondeur), sur le modèle pages type Apple / Stripe / wearebrand.

## Fichiers clés

- `index.html` — shell voyage + toggle + 8 `.lieu`.
- `services/index.html` — mode rapide canonique.
- `assets/js/voyage.js` — timeline + Lenis + ScrollTrigger.
- `assets/js/voyage-tooltips.js`.
- `assets/css/tokens-voyage.css`, `assets/css/voyage.css`.
- `assets/svg/*` — objets lieu 3.

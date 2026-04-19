# Pinapp V2.4 DREAM — Spécification (étape 1)

**Branche** : `cursor/v24-dream-prep-df83`  
**Objectif** : home scroll long (~920vh) avec **8 chapitres** pilotés par **vidéos locales scrubées** (sans audio page), **6 couches de transition**, textes « sable », **encart Réalisations** (chapitre 7), contenu aligné sur le site actuel + garde-fous dépôt.

---

## 1. Garde-fous (non négociables)

| Règle | Détail |
|--------|--------|
| **Pas de CDN** hors Bunny Fonts | GSAP / ScrollTrigger : `/assets/vendor/gsap.min.js`, `ScrollTrigger.min.js` (déjà en place). |
| **Extension, pas remplacement** | `tokens-voyage.css`, `voyage.css`, `voyage.js` : **patches** ; ne pas écraser les fichiers avec un bloc unique. |
| **Pas d’hex en dur** dans le nouveau CSS | Utiliser `var(--…)` existants ou **nouveaux tokens** documentés ici. |
| **Commits granulaires** | Pas de `git add -A` aveugle ; un thème = un commit ; push **après validation** humaine si souhaité. |
| **Zéro lien 404** | Vérifier chaque URL avant merge ; sinon retirer ou libellé « Bientôt » sans `href` trompeur. |
| **Config** | Formulaires / webhooks : `PINAPP_CONFIG`, `forms-voyage.js` ; vidéos : logique existante **`voyage-bg-video.js`** + extension scrubber global si besoin. |
| **`voyage-particles.js`** | Moteur voyage **dédié** — ne pas fusionner avec `particles.js` (Pandora). |
| **Perf** | Cible Lighthouse mobile **≥ 85** avant merge ; LCP / poids vidéos à surveiller. |
| **`prefers-reduced-motion`** | Désactiver transitions lourdes, scrub agressif, boost particules ; fallback image ou chapitres statiques. |
| **M&P** | Vocabulaire digne ; pas les termes interdits secteur sensible. |

---

## 2. Vidéos attendues (`assets/video/voyage/`)

Fichiers nominatifs du brief (à déposer par l’équipe ; **actuellement** le dossier ne contient que `assets/video/README.txt` — pas de MP4 encore versionnés) :

| # | Fichier | Rôle narratif |
|---|---------|----------------|
| 1 | `01-main-hologramme.mp4` | Intro |
| 2 | `02-couloir-passengers.mp4` | Duo / couloir |
| 3 | `03-hublot-cosmos.mp4` | Métiers |
| 4 | `04-constellation-mp.mp4` | M&P + Auralis + newsletter |
| 5 | `05-sortie-vaisseau.mp4` | Stats / preuves |
| 6 | `06-balade-cosmos.mp4` | Univers + manifeste |
| 7 | `07-tourbillon-etoiles.mp4` | **Encart Réalisations** |
| 8 | `08-lune-finale.mp4` | FAQ + formulaire + footer |

**Scrub** : une timeline ScrollTrigger (ou équivalent) pilote `video.currentTime` en fonction du scroll sur la plage du chapitre ; double-buffer + transitions décrites au §3.

---

## 3. Transitions (6 couches — spec technique)

1. **Crossfade** (~400 ms) entre deux `<video>` (ou vidéo ↔ poster).  
2. **Motion blur** temporaire `filter: blur(6px) saturate(0.85)` (~250 ms).  
3. **Light leak** doré radial (~150 ms).  
4. **Boost particules** `window.pinappParticleBoost` 1.0 → 1.5 (~400 ms) — à brancher sur `voyage-particles.js` **sans** casser le mode sobre / reduced-motion.  
5. **Bridge chromatique** overlay radial (~250 ms) — tokenisé.  
6. **Texte « sable »** formation lettres (~800–1200 ms) — fichiers prévus : `sand-text.css`, `voyage-sand-text.js`.

---

## 4. Structure narrative (8 chapitres · ~920vh)

| Chapitre | vh indicatif | Contenu principal (aligné `index.html` actuel) |
|----------|--------------|--------------------------------------------------|
| 1 | 0–100 | Hero, H1, sous-titre, 4 badges, 2 CTA, baseline « Bienvenue… », hint scroll |
| 2 | 100–220 | « Les pilotes du vaisseau », cartes Lauralie / Michaël, CTA `/a-propos/` |
| 3 | 220–340 | 4 métiers + prix + formations + liens modales / détails |
| 4 | 340–440 | M&P (lien GitHub Pages), **Auralis** `/auralis/`, newsletter |
| 5 | 440–520 | Preuves / stats comparatives + badges crédibilité |
| 6 | 520–660 | « Voyez votre métier », carte planète / univers, manifeste, `/univers/` |
| 7 | 660–800 | **Encart Réalisations** (2 liens vérifiés + teaser — voir §5) |
| 8 | 800–920 | Contact, FAQ 5, formulaire diagnostic, Cal.com, footer légal |

Les ancres `#s1`… du menu actuel devront être **réalignées** sur les ids des chapitres V2.4 (ex. `#chapitre-7-realisations`) — à définir à l’implémentation.

---

## 5. Encart Réalisations (chapitre 7) — vérité dépôt (audit 2026-04-19)

**Décision produit (V2.4)** : sur la home, afficher **uniquement** les preuves dont l’URL existe dans le dépôt :

- **Atelier Rivage** → `/demo/atelier-rivage/`
- **Films IA** → `/realisations/films-ia/`

Sous les cartes : mention honnête du type **« 3 autres projets en cours de production »** (pas de `href` inventé, pas de stub dossier).

**Existant sous `/demo/…/`** (dossiers avec `index.html`) :  
atelier-rivage, artisan, avocat, barbier, boulangerie, cils, coach, coiffeur, estheticienne, ongles, restaurant, sur-mesure, tatoueuse, trainer.

**Absents** (pas de `/demo/maison-aurelie/`, `/demo/maison-celeste/`, `/demo/domaine-eclipse/`, `/demo/star-wars-ia/` dans ce repo) : les trois autres projets du brief initial restent en **teaser** jusqu’à livraison des pages.

**Règle** : aucune carte avec `href` vers une URL non listée dans le dépôt ou validée manuellement.

---

## 6. Navigation & pages à ne pas casser

**Ancres home** (à mapper sur chapitres) : Accueil, Métiers, **Réalisations** → ch.7, Preuves → ch.5, Manifeste → ch.6, Contact → ch.8.

**Liens externes** : `/auralis/`, `/univers/`, `/a-propos/`, `/blog/`, `/formations/`, `/mentions-legales/`, `/confidentialite/`, `/cgv/`, `/home-classic/`, GitHub Pages M&P.

**Cal.com** (référence actuelle) : `https://cal.com/lauralie-daguzay-hdglzw/diagnostic`

---

## 7. Fichiers prévus (étapes suivantes)

| Fichier | Action |
|---------|--------|
| `docs/V24-DREAM-SPEC.md` | Ce document (étape 1) |
| `assets/css/` — bridges / `sand-text.css` / `transitions.css` / `realisations-card.css` | Nouveaux ou extensions |
| `assets/js/` — `voyage-scrubber.js`, `voyage-transitions.js`, `voyage-sand-text.js`, `voyage-realisations.js` | Nouveaux ; orchestration dans `voyage.js` |
| `index.html` | Structure 8 chapitres + spacer hauteur totale |
| `assets/video/voyage/*.mp4` | **Contenu binaire** — ajout par Lauralie / CI, pas généré par Cursor |

---

## 8. Ordre de travail (§10 du brief)

1. ~~Branche + cette spec~~ **(fait)**  
2. Étendre `tokens-voyage.css` (tokens pont / sable si besoin)  
3. `voyage-scrubber.js` + squelette HTML 8 chapitres  
4. Valider scrub sur les 8 MP4 une fois présents  
5. `voyage-transitions.js`  
6. `sand-text.css` + `voyage-sand-text.js`  
7. Contenu chapitres 1–6  
8. Encart Réalisations chapitre 7  
9. Chapitre 8 (FAQ, form, Cal, footer)  
10. Nav sticky + ancres  
11. Mobile + Lighthouse  
12. PR + revue + merge  

---

## 9. Notes agent / Cursor

- Ne pas exécuter le long script PowerShell « tout-en-un » du dépôt : il violait CDN, écrasements et `git add -A`.  
- Après chaque phase visible : bump `?v=` sur les assets modifiés (règle cache).  
- Si les 8 MP4 ne sont pas encore dans le repo : garder **poster / image** par chapitre + `voyage-bg-video` prêt (`src` vide = image seule, comportement actuel).

---

*Document généré pour l’étape 1 du brief V2.4 DREAM — exhaustif par rapport au contenu GitHub audité et aux contraintes pinapp-site.*

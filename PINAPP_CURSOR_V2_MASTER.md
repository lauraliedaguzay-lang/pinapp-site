# PINAPP.FR V2 — MASTER PROMPT CURSOR (AUTONOME)

## Tu travailles en autonomie

Tu es Cursor sur le dépôt `lauraliedaguzay-lang/pinapp-site`. Tu as accès au terminal, au navigateur, à la génération d’images (selon ton environnement), et à Git.

- **Branche dédiée** : `refonte-passengers-v2` (ne pas pousser sur `main` sans validation humaine).
- **Commit** après chaque phase avec un message explicite.
- **Ne pas inventer** prix, offres ni textes légaux : les extraire du site / du repo existant.
- **Stack** : HTML / CSS / JS vanilla + GSAP + ScrollTrigger + Lenis + Canvas 2D. Zéro framework React/Vue/etc.
- **Images fallback** : si la génération native d’images n’est pas disponible, exécuter `pwsh ./pinapp-generate-voyage-images.ps1` (Pollinations) depuis la racine du repo.

---

## Contexte verrouillé

| Élément | Valeur |
|--------|--------|
| **Entreprise** | Pinapp — Lauralie Daguzay + Michaël Bouilhac · 49 Av. Edmond Rostand, 33700 Mérignac |
| **SIRET** | 523 884 898 00017 |
| **Contact** | contact@pinapp.fr · 06 59 88 20 15 |
| **Cible** | TPE / PME francophones (Bordeaux et au-delà) |
| **Objectif** | Dépasser la barre de perception **wearebrand.io** sur cette cible, avec un voyage cinéma type *Passengers* (intérieur vaisseau) + plan-séquence continu (*1917*). |
| **Perf** | Budget global cible ≤ ~2 Mo assets critiques page d’accueil ; LCP ≤ 1,5 s desktop / ≤ 2,5 s mobile 4G ; Lighthouse ≥ 90 (perf / a11y / SEO) objectifs. |
| **Police** | **Geist** (Vercel, open source) — self-host `woff2` dans `/assets/fonts/` (400, 500, 600, 700). Vérifier la licence Vercel avant livraison. |
| **Images** | 22 fichiers attendus sous `/assets/images/voyage/` (nomenclature ci-dessous). |
| **Mémoire & Présence** | Site **externe** uniquement : pas de contenu M&P détaillé sur pinapp.fr ; teaser + lien `memoireetpresence.fr` (ou URL GitHub Pages officielle). |
| **Hébergement** | Hostinger + dépôt GitHub (workflow existant du repo). |

---

## Narratif — 6 scènes + micro-bloc Duo (plan-séquence)

**Aucune coupure nette** : transitions ScrollTrigger (pin, scrub, cross-fade, clip-path, particules continues).

| # | Scène | Mouvement | Contenu clé (à caler sur les textes **réels** du repo) |
|---|--------|-----------|--------------------------------------------------------|
| 1 | Pod éveil | Émerger | H1 *« Le digital qui travaille pendant que vous vivez. »* + sous-titre + CTA diagnostic + univers + badges (prix HT existants, 30 j, Plausible, Bordeaux) + note *« Bienvenue. On vous attendait. »* |
| 1.5 | Duo fondateur | Reveal | *« Les pilotes du vaisseau. »* — deux cartes Lauralie / Michaël + bios courtes + CTA vers `/a-propos/` |
| 2 | Corridor 4 métiers | POV marche | *« Quatre métiers. Un seul système. »* — 4 piliers (Sites, Auto, IA, Vidéo) avec **prix HT du repo** + mensualisation si affichée aujourd’hui + bloc formations |
| 3 | Cockpit + planète | Approche vitre | *« Voyez votre métier, conçu par Pinapp. »* — planète / overlay : réalisations (Star Wars, Atelier Rivage, cinématiques, univers démos) |
| 4 | Pod Oxygène + Voie lactée | Double lecture | Stats avant/après + chiffres factuels (repo) + teaser M&P **externe** + newsletter soft |
| 5 | Warp | Accélération | Manifeste court : *« Parce qu’on veut rendre le digital humain. »* (une phrase massive) |
| 6 | Bridge Lune + contact | Arrivée + formulaire | *« Décrivez votre projet. »* + FAQ + formulaire + maintenance optionnelle + Cal.com |

---

## Design tokens (`/assets/css/tokens-voyage.css` ou remplacement documenté de `tokens.css`)

Coller / adapter le bloc CSS Geist + `:root` fourni dans ta spec (couleurs void / deep / cyan / violet / magenta / amber, espacements, rayons, easings, boutons, inputs, `.reveal`, `prefers-reduced-motion`, mobile blur → scale).

**Important** : si le repo a déjà un `tokens.css` AURA / autre, soit **fichier voyage séparé** importé uniquement par la nouvelle home, soit migration planifiée dans le rapport — ne pas casser les pages légales existantes sans stratégie.

---

## Arborescence cible (à créer / fusionner avec le repo)

```
/
├── index.html                    ← nouvelle home voyage (ou remplacement documenté)
├── a-propos/index.html
├── parrainage/index.html
├── auralis-rh/index.html         ← placeholder si pas de contenu produit
├── assets/
│   ├── css/
│   │   ├── tokens-voyage.css     ← ou intégration documentée
│   │   ├── voyage.css
│   │   └── nav-voyage.css
│   ├── js/
│   │   ├── vendor/               ← gsap, ScrollTrigger, Lenis (copies locales)
│   │   ├── voyage.js
│   │   ├── particles.js
│   │   ├── forms-voyage.js
│   │   └── config-voyage.js
│   ├── fonts/                    ← geist-*.woff2
│   ├── images/voyage/            ← 22 images (voir Phase 1)
│   └── images/duo/               ← photo-lauralie.jpg, photo-michael.jpg (placeholders si absent)
├── .env.example                  ← webhooks, pas de secrets commités
└── pinapp-generate-voyage-images.ps1   ← déjà à la racine (fallback)
```

---

## HTML / CSS / JS — exigences clés

- **Sections** : `<section class="scene" data-scene="N" id="sN">` + `picture.scene-bg` + `.scene-content` + `canvas.particles-canvas`.
- **Globaux** : hamburger (3 blocs navigation), `#floating-contact` visible après scène 2, `#audio-toggle` optionnel, bannière cookies / analytics **conforme** au setup actuel (Plausible).
- **Lenis** : desktop / perf OK ; désactivé ou allégé sur mobile `< 768` si nécessaire pour INP.
- **ScrollTrigger** : pin + scrub ; cross-fade entre scènes ; clip-path entre 2 et 3 si spec ; warp canvas scène 5.
- **Particules** : densités par scène (voir spec) ; mode `hardwareConcurrency < 4` → réduction count + pas de blur reveal.
- **Formulaires** : `fetch` POST, honeypot, `aria-live`, rate limit localStorage, fallback localStorage si erreur réseau.
- **Config** : `window.PINAPP_CONFIG` — URLs webhooks et Cal.com **sans** secrets dans le dépôt ; variables dans `.env.example` + doc pour Lauralie.

---

## SEO & accessibilité

- `<title>`, meta description, OG, Twitter Card.
- Schema.org `LocalBusiness` (JSON-LD) avec données réelles du repo.
- `alt` sur toutes les images ; `aria-expanded` / `aria-controls` sur menu ; focus visible ; `lang="fr"`.
- Liens externes : `rel="noopener noreferrer"`.

---

## Les 15 « fixes » intégrés (checklist)

1. Textes dans le HTML (pas dans le Canvas).  
2. `prefers-reduced-motion` respecté.  
3. Images optimisées (WebP / AVIF si pipeline dispo) + lazy sauf hero.  
4. Chiffres / badges alignés sur le **vrai** contenu repo.  
5. Deep-links menu ↔ ancres `#s1` … `#s6`.  
6. Filigrane ananas SVG discret.  
7. Contact flottant après scène 2.  
8. Audio optionnel (fichier léger ou bouton masqué si absent).  
9. Événements analytics cohérents avec la stack actuelle.  
10. Prix / badges conformes au site actuel.  
11. Newsletter scène 4.  
12. Bandeau info cookies / Plausible selon politique actuelle.  
13. Mode perf auto.  
14. Note manuscrite bienvenue scène 1.  
15. Cal.com scène 6 (URLs dans config).

---

## Phases d’exécution (ordre strict)

### Phase 0 — Audit repo *(obligatoire)*

- `git fetch` puis `git checkout -b refonte-passengers-v2`.
- Lire `index.html`, CSS/JS globaux, workflows déploiement, pages légales.
- Lister textes et **prix HT** à réutiliser tels quels.
- Commit : `chore(v2): phase 0 — audit branche refonte-passengers-v2`.

### Phase 0.5 — Imprégnation visuelle & technique *(10 min — OBLIGATOIRE)*

**Avant d’écrire une seule ligne de code, tu dois t’imprégner du « délire » visé.** Ouvre l’outil navigateur et visite dans l’ordre :

#### Site de référence #1 — wearebrand.io *(barre à dépasser)*

1. **Home** : https://wearebrand.io  
   - Preloader, blur-reveal textes, rythme des slides.  
   - Terre cadrée type hublot.  
   - Transitions (fondu + zoom + parallax).

2. **Page immersive** : https://wearebrand.io/brand  
   - Scroller lentement jusqu’au bout.  
   - `blur(36px → 0)` + `opacity` = signature.  
   - `transform: matrix3d(...)` / parallax multi-couches.  
   - Sections pinned.

3. **Inspecter le DOM** (console si utile) : compter usages de `blur`, `matrix3d`, etc.

**Objectif** : reproduire le niveau d’immersion **en mieux** pour Pinapp (TPE françaises).

#### Films de référence (recherche web + synthèse)

| Film | Emprunt | Scène Pinapp |
|------|---------|--------------|
| Passengers (2016) | Avalon, luxe, baies, bridge | Base globale |
| Avatar (2009–2022) | Bioluminescence, réseau type Eywa | Scène 3 |
| Oxygène (2021) | Cryopod, MILO, stats holo | Scène 4 intérieur |
| Interstellar (2014) | Voie lactée, solennité | Scène 4–5 |
| Moon / Ad Astra / 2001 | Lune, approche | Scène 6 |
| 1917 | Plan-séquence sans coupure | Transitions globales |

Utiliser la recherche web avec des requêtes du type : *Passengers 2016 Avalon interior*, *Avatar bioluminescent*, *Oxygène 2021 cryopod MILO*, etc.

#### Autres références web immersives

- https://www.awwwards.com/websites/immersive/  
- https://godly.website/  
- https://www.siteinspire.com/websites?categories=17  
- https://www.activetheory.net/  
- https://dogstudio.com/  

**Noter 3–5 sites** qui impressionnent + **une technique** par site.

#### Recherches techniques

- *GSAP ScrollTrigger sticky pin plan-séquence tutorial*  
- *Canvas 2D bioluminescent particles performance*  
- *Lenis smooth scroll vanilla integration*  
- *CSS clip-path expand transition cinematic*  
- *Geist font self-host license Vercel*

#### Livrable Phase 0.5

Créer **`/MOODBOARD-PHASE-0.5.md`** à la racine du repo, contenant :

- Ce que **wearebrand** fait techniquement (stack perçue, animations clés).  
- **Palette** observée (hex approximatifs).  
- **3 sites** Awwwards + URL + une phrase « pourquoi ».  
- **Synthèse en 5 phrases** : ressenti visiteur recherché.  
- **3 risques techniques** pour tenir perf + a11y + SEO.

Commit : `docs(v2): phase 0.5 — imprégnation wearebrand + références + moodboard`.

**Règle absolue** : si à la fin de cette phase le délire n’est pas clair, **s’arrêter** et documenter les questions dans `MOODBOARD-PHASE-0.5.md` au lieu de coder au hasard.

---

### Phase 1 — Génération des 22 visuels

**Option A — Agent image intégré** : générer les variantes listées dans `pinapp-generate-voyage-images.ps1` (mêmes IDs : `01-seuil` … `06-bridge-lune`, desktop 1920×1080, mobile 1080×1920, variantes v1–v3 selon scène). Ajouter le **DNA** commun à chaque prompt (IMAX / Deakins / biolumi cyan-violet / grain).

**Option B — Fallback** : `pwsh ./pinapp-generate-voyage-images.ps1` puis conversion WebP si `cwebp` disponible (`-q 85`), sinon noter dans le rapport.

Commit : `assets(v2): phase 1 — images voyage (png/webp)`.

---

### Phase 2 — Tokens + Geist

- Télécharger Geist woff2 → `/assets/fonts/`.
- Créer les feuilles de tokens / reset documentés ci-dessus.
- SVG filigrane ananas si absent.
- Commit : `feat(v2): phase 2 — tokens Geist + reset + filigrane`.

### Phase 3 — Structure HTML

- Nouvelle structure sections + nav + footer ; réutiliser les **textes** extraits du repo.
- Commit : `feat(v2): phase 3 — HTML 6 scènes + duo + navigation`.

### Phase 4 — CSS voyage

- `voyage.css` + responsive 3 breakpoints + `.low-perf` + reduced motion.
- Commit : `feat(v2): phase 4 — CSS voyage responsive`.

### Phase 5 — JS (Lenis, GSAP, particules, split texte)

- `voyage.js` + `particles.js` ; pas de parallax décoratif interdit par les règles internes du repo si en conflit — **documenter** dans le rapport ou adapter (ex. uniquement `transform`/`opacity` sur layers dédiés, pas sur fond critique).
- Commit : `feat(v2): phase 5 — JS scroll particules`.

### Phase 6 — Formulaires + config + parrainage

- `config-voyage.js` + `forms-voyage.js` + `.env.example` + `README-CONFIG.md`.
- Commit : `feat(v2): phase 6 — forms webhooks cal ref`.

### Phase 7 — Audit qualité

- Lighthouse (mobile + desktop), contrastes, clavier, liens cassés.
- Commit : `fix(v2): phase 7 — a11y perf corrections`.

### Phase 8 — Pages annexes & légal

- Harmoniser ou dupliquer style **sans** supprimer d’obligations légales ; mettre à jour SIRET / contact si le repo est source de vérité.
- Commit : `feat(v2): phase 8 — pages annexes légal`.

### Phase 9 — Push + PR + rapport

- `git push -u origin refonte-passengers-v2`.
- Ouvrir une **PR** vers `main` (draft) avec résumé et risques.
- Créer **`RAPPORT-REFONTE-V2.md`** : durée, fichiers touchés, scores Lighthouse, URL PR, variables env à remplir, `/demo/atelier-rivage/` non régression mentionnée.

---

## Rapport final attendu (`RAPPORT-REFONTE-V2.md`)

- Durée totale (estimation agent).  
- Liste des fichiers créés / modifiés.  
- Résultats Lighthouse (cibles vs réel).  
- Lien PR + preview si disponible.  
- Variables d’environnement / webhooks à remplir.  
- Risques et suites proposées.

---

## Règles strictes (rappel)

1. Ne pas inventer de **prix** ni d’**engagements** légaux.  
2. Récupérer les **textes** depuis le dépôt / prod actuelle.  
3. Ne pas supprimer `/demo/atelier-rivage/` ni casser les chemins existants sans migration listée.  
4. Self-host maximal ; pas de CDN externe sauf exceptions déjà acceptées dans le projet (ex. Plausible).  
5. **Pas de merge sur `main`** sans validation humaine.

---

**Fin du prompt master.** Exécuter les phases dans l’ordre ; après chaque phase : test minimal + commit ; après Phase 0.5 : lecture humaine recommandée de `MOODBOARD-PHASE-0.5.md` avant Phase 1.

# Phase 0.5 — Imprégnation visuelle & technique (Pinapp V2 voyage)

**Objectif** : cadrer le « délire » wearebrand / cinéma spatial **sans** confondre avec les sites clients (sobriété).

---

## 1. wearebrand.io — ce qu’on en retient (perception + technique)

**Sources** : fetch markdown homepage `https://www.wearebrand.io/` + connaissance publique de `/brand` (scroll immersif, transitions).

| Perçu | Détail technique visé pour Pinapp |
|--------|-----------------------------------|
| Ton **premium** + storytelling | Sections plein écran, typo forte, peu de bruit |
| **Immersion** | Images / vidéos plein cadre, rythme lent, hiérarchie claire |
| **Scroll comme narration** | Pin + scrub (ScrollTrigger), révélations synchronisées au défilement |
| **Profondeur** | Parallax / `transform` sur **calques dédiés** (fond, particules), pas sur le texte SEO |
| **Révélation** | Blur + opacity sur blocs `.reveal` (desktop) ; sur mobile → scale + opacity (perf) |

**Palette observée (approx.)** depuis l’identité « spatial / nuit » de référence : fond **#050510–#0a1425**, accents **cyan #3ef5e0**, **violet #a67fff**, touches **magenta #ff5fa8**, chaleur **ambre #e8a661**.

---

## 2. Films — emprunts par scène (déjà dans le master)

| Film | Emprunt | Scène |
|------|---------|--------|
| Passengers | Avalon, matériaux luxe, hublots | 1–2–6 |
| Avatar | Biolumi, réseau organique | 3 |
| Oxygène | Pod, UI holo froide | 4 intérieur |
| Interstellar / Tree of Life | Cosmos, solennité | 4 extérieur / 5 |
| 1917 | Continuité, pas de « coupure » cheap | Transitions globales |

---

## 3. Trois sites / studios qui inspirent (hors wearebrand)

| URL | Pourquoi |
|-----|----------|
| https://www.activetheory.net/ | Narration + WebGL / motion maîtrisée — barre « studio » |
| https://dogstudio.com/ | Direction artistique forte, transitions soignées |
| https://www.awwwards.com/websites/immersive/ | Veille permanente du format « showcase » |

---

## 4. Synthèse du ressenti recherché (5 phrases)

1. Le visiteur doit se sentir **embarqué** dans un vaisseau premium, pas sur une landing SaaS générique.  
2. Le scroll **raconte** une progression (éveil → métier → preuve → manifeste → contact), pas une liste de blocs.  
3. La **lumière** (cyan / violet / ambre) guide l’attention comme un film, sans cracher du néon cheap.  
4. Les **preuves** (chiffres, SIRET, offres HT) restent **lisibles et crédibles** — le spectacle sert la confiance, pas l’inverse.  
5. Dès que ça **rame** ou **agresse** l’œil**, on coupe** : reduced motion, mode sobre, `.low-perf`.

---

## 5. Trois risques techniques

| Risque | Mitigation |
|--------|------------|
| **LCP / poids** (22 images + GSAP) | WebP, eager seulement scène 1, lazy le reste, budgets cibles du master |
| **A11y** (scroll captif, motion) | `prefers-reduced-motion`, **Mode sobre** (navigation ancres), focus visible |
| **Maintenance** (monolithe scroll) | Page `voyage/` dédiée d’abord ; code découpé (`voyage.css`, `voyage.js`, `particles.js`) |

---

## 6. Verdict agent

**Alignement** : le délire est clair — *wearebrand-level immersion pour la vitrine pinapp.fr uniquement*, avec garde-fous. **Go Phase 1+** sans reprise du master.

---

*Généré dans le cadre de `PINAPP_CURSOR_V2_MASTER.md` — Phase 0.5.*

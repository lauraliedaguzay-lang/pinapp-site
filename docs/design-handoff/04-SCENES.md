# 04 · SCENES — Mapping Film ↔ Sections ↔ Inspiration Aladdin

> Le cœur narratif de Pinapp V7. Chaque section HTML a une scène film V6
> qui la porte visuellement, et une référence cinématographique Aladdin 2019.

---

## 🎬 Film V6 — spec technique

| Métrique | Valeur |
|---|---|
| Fichier principal | `assets/video/voyage/pinapp-film-v6.mp4` |
| Fallback moderne | `assets/video/voyage/pinapp-film-v6.webm` (VP9 yuv420p) |
| Durée | **62.833s** |
| Résolution | 1280 × 720 |
| Framerate | 24 fps |
| Pixel format | **yuv420p** (iOS Safari compatible) |
| Profile H.264 | High @ Level 4.0 |
| Keyframes | **137** (1 toutes les 0.47s — scrub fluide iOS) |
| Taille mp4 | 14.86 MB (-37% vs V6 avant) |
| Taille webm | 6.21 MB |
| Audio | Aucun (silent) |

**Construction** : concat 8 segments via ffmpeg (`tools/build-pinapp-film-v6.ps1` à adapter post-V7).

---

## 📑 Table de synchro sections ↔ film

| HTML section | id | Film segment | Bornes (s) | Scène film |
|---|---|---|---|---|
| Ouverture | `s0` | 01-main-hologramme | 0.00 – 5.04 | Main qui touche cercle cyan holographique (cockpit chaud) |
| Prologue | `s1` | 01-main (suite) | 0.00 – 5.04 | (même scène, hero overlay) |
| Rencontre Pilotes | `s2` | 02-couloir-passengers | 5.04 – 11.58 | Intérieur vaisseau Passengers · hublots galaxie orange · rayons solaires |
| Outils Métiers | `s3` | 03-hublot-cosmos | 11.58 – 21.12 | **Tourbillon doré particules** (malgré le nom "hublot") |
| Outils Métiers (suite) | `s3` | 04-constellation-mp | 21.12 – 26.66 | **Vrai hublot Passengers** · étoile double · planète lens flare |
| Constellation M&P | `s4` | 05-sortie-vaisseau | 26.66 – 36.20 | **3 cristaux colorés flottants** (cyan / violet / or) = M&P / Auralis / Newsletter |
| Preuves (spirale) | `s5` | 06-balade-cosmos | 36.20 – 45.74 | Spirale dorée (doublon de 03, énergie continue) |
| Mécanisme N8N | `s5b` | 07-tourbillon-etoiles | 45.74 – 53.28 | **LUNE** contemplative (pas un tourbillon malgré le nom !) |
| Manifeste | `s6` | 07-tourbillon-etoiles | 45.74 – 53.28 | (même lune, moment contemplatif) |
| Œuvre / Réalisations | `s7` | 08-atterrissage-sable | 53.28 – 62.83 | (transition vers sable) |
| Atterrissage / Contact | `s8` | 08-atterrissage-sable | 53.28 – 62.83 | **Dunes sable + ciel étoilé + reflets turquoise** |

**⚠️ Note critique** : le NAMING des fichiers segments ne reflète pas le CONTENU réel (hublot = spirale, tourbillon = lune, etc.). Refacto naming proposé dans Bloc 5.

---

## 🧞 Mapping Aladdin 2019 → Pinapp V6

| Scène Aladdin 2019 | Segment V6 Pinapp | Technique cinéma appliquée |
|---|---|---|
| Ouverture marchés Agrabah (crépuscule doré) | 01 main hologramme (cockpit chaud) | Warm tones · wide establishing · palette orange/or |
| Lampe du Génie (reveal Will Smith) | 01 main qui touche cercle cyan | Macro lens 65mm · cinematic reveal |
| Cave of Wonders (trésors s'assemblent) | 05 cristaux flottants | Slow particles reveal · treasure sparkle |
| "Friend Like Me" (magie Génie) | 03/06 spirale dorée | Particle explosion · kinétique or |
| **🏮 "A Whole New World" (lanternes ascendantes)** | **Tourbillon vertical V7** | **Bottom-up particle rise (60 particules dorées)** |
| Romance Jasmine/Aladdin | 07 lune contemplative | Soft focus glow · quietude |
| Désert final Arabia | 08 atterrissage sable | Wide serene landscape |

### Signature Aladdin web = 3 effets

1. **Tourbillon vertical ascendant** → remplace les lanternes "A Whole New World"
2. **Sand reveal** → titre s8 se forme de grains dorés (référence Cave of Wonders gemmes)
3. **Cursor cinema timecode** → rappel constant qu'on est DANS un film

---

## 🎨 Chromatic choreography

Le film applique un `hue-rotate` subtil selon la scène active (via `film-chromatic.js`) :

| Scène | Hue shift | Effet perçu |
|---|---|---|
| s0 main hologramme | 0° | Neutre (référence) |
| s1 prologue | -2° | Léger réchauffement |
| s2 couloir galaxie | +4° | Tonalité cosmique subtile |
| s3 métiers | +8° | Violets boostés |
| s4 cristaux | +10° | Accentuation palette diverse |
| s5 preuves | -4° | Retour vers or |
| s5b spirale N8N | -6° | Or renforcé |
| s6 lune manifeste | -12° | Chaleur amberisée |
| s7 œuvre tourbillon | +6° | Cyan subtil |
| s8 atterrissage sable | -6° | Chaleur désertique |

Amplitude max : **±14°**. Imperceptible individuellement, crée un "vivant" continu entre les scènes.

**Transition** : `filter` CSS avec `900ms cubic-bezier(0.4, 0, 0.2, 1)`.

---

## 📜 Narratif marketing aligné aux scènes

Pour chaque section, le COPY du TEXT-MASTER-V7.md dialogue avec la scène film :

### s0 Ouverture + s1 Prologue
**Film** : main qui touche cercle hologramme
**Copy eyebrow** : "— OUVERTURE —"
**Copy title s0** : "Un film Pinapp"
**Copy H1 s1** : *"Le digital qui travaille pendant que vous vivez."*
**Résonance** : la main qui active le système = l'utilisateur qui reprend le contrôle

### s2 Pilotes
**Film** : couloir Passengers chaleureux
**Copy H2** : "Les pilotes du vaisseau."
**Copy bios** : Lauralie (code/IA) · Michaël (image/vidéo)
**Résonance** : les 2 fondateurs = les 2 pilotes du vaisseau qui accompagnent le passager/client

### s3 Métiers (hublot + spirale)
**Film** : transition spirale dorée → hublot étoile double
**Copy H2** : "Quatre métiers. Un seul système."
**Tapestry** : *"Un grand pouvoir n'implique pas forcément de grosses responsabilités."*
**Résonance** : les 4 métiers = 4 pouvoirs · aperçu cosmos à travers hublot

### s4 Constellation M&P
**Film** : 3 cristaux colorés flottants (cyan + violet + or)
**Copy H2** : "Trois points d'ancrage. Trois terrains."
**Les 3 cristaux** = Mémoire & Présence + Auralis RH + Newsletter (exactement 3 · parfait mapping)
**Morse STAY** bottom-left : appel à rester dans cet univers

### s5 Preuves (spirale)
**Film** : spirale dorée (énergie continue)
**Copy H2** : "Mesurable. Mémorable."
**Résonance** : les chiffres = points lumineux dans le tourbillon de données

### s5b Mécanisme N8N (spirale tardive)
**Film** : spirale dorée (énergie qui circule dans workflow)
**Copy H2** : "Vos outils travaillent pendant que vous vivez."
**Résonance** : le workflow n8n = spirale d'énergie automatisée

### s6 Manifeste (lune)
**Film** : lune contemplative
**Copy manifesto (PROTÉGÉ)** :
> *Vous repoussez ce qui s'accumule.*
> *Pinapp prépare.*
> *Vous décidez.*
> *C'est réglé.*

**Signature** : Tourbillon vertical ascendant (particules qui montent)
**Résonance** : moment de pause contemplative + promesse manifeste

### s7 Œuvre (transition dunes)
**Film** : transition vers sable
**Copy H2** : "Réalisations."
**Résonance** : sortie du cosmos · atterrissage progressif

### s8 Atterrissage (dunes)
**Film** : dunes de sable + ciel étoilé
**Copy H2** : "Décrivez votre projet."
**Sand reveal** sur le titre (grain dorés qui convergent)
**Résonance** : arrivée paisible · serein · contact

---

## 🎼 Transitions inter-sections

### Règle AVATAR stricte
Aucune transition ne doit "crier". Éviter :
- Fade out + fade in séquentiels (= coupure perçue)
- Parallax trop fort (ne correspond pas au film fixed)
- Pin ScrollTrigger (casse la sync film V6)

### Mécanismes utilisés (V7)

1. **Le film lui-même transitionne** : scroll → `currentTime` progresse continûment → pas de coupure visuelle
2. **Chromatic aberration** : hue-rotate change subtilement entre scènes (imperceptible mais "vivant")
3. **Reveals section-by-section** : `.reveal` elements apparaissent avec `opacity + blur + translateY` via GSAP ScrollTrigger trigger 78% viewport
4. **Veil overlay** : `.voyage-scene__veil` gradient vertical qui varie par section (fournit la lisibilité texte sans masquer le film)

### Absent V7 (reporté)
- Whip pan cinéma entre sections (inspiration Guy Ritchie) — proposé en roadmap motion
- Match-cut logo sur chaque scene-active — `match-cuts.js` existe mais actuellement seulement sur nav click

---

## 🗺️ Navigation entre scènes

Le user peut naviguer via :

1. **Scroll naturel** (Lenis smooth scroll)
2. **Skip-link** "Aller au contenu principal" (#voyage-main)
3. **Burger menu drawer** : 6 liens vers sections (Accueil / Métiers / Réalisations / Preuves / Manifeste / Nous écrire)
4. **Navigation header desktop** : 4 liens (Univers / Auralis / M&P / Nous écrire)
5. **Scene counter** (visuel only, pas cliquable — signe du chemin parcouru)
6. **Chapter nav fixed** (si activé dans `chapter-nav.js`)

Toutes les nav internes utilisent `scroll-behavior: smooth` + Lenis pour la fluidité.

---

## 📐 Storyboard visuel (références)

Pour reproduire l'univers Pinapp en tant que designer :

- **Passengers** (2016) : chapelets cosmiques, intérieur vaisseau · couleurs cuivrées chaudes
- **Aladdin** (2019, Guy Ritchie) : marchés Agrabah, Cave of Wonders, A Whole New World · palette or + cosmos violet
- **Dune** (2021/2024, Villeneuve) : désert · sable doré · atmosphère contemplative
- **Blade Runner 2049** : lens flares · néons cyans et violets sur fond sombre · ivory texts
- **2001: A Space Odyssey** (Kubrick) : monolithe, silence cinématographique · minimalism pur
- **Apple iPhone 16 Pro page** : scroll-scrub vidéo, palette neutre, UI invisible sur vidéo

### Palette chromatique narratif

- **Chaud orangé** (cockpit, Agrabah, dunes, lune, sable) = intimité · confiance
- **Violet cosmique** (hublot, cristaux) = mystère · exploration
- **Or métal** (spirale, cristaux or) = énergie · puissance
- **Cyan holographique** (hologramme, lens flares) = technologie · futur
- **Ivoire** (texte) = humanité · poésie

---

## 🔄 Extension future (V8+)

### Sections manquantes potentielles
- `/values/` ou extension `/engagements/` → 7 piliers éthiques en page dédiée
- `/work/` → curator des 14 démos + 5 films IA + flagship cases
- `/studio/` → about long form (peut remplacer `/a-propos/`)
- `/journal/` → blog éditorial premium
- `/labs/` → expériences ouvertes (ex : Vortex Lab si on fait le move)

### Signatures additionnelles (post-V7)
- Stardust typography sur brand statement EN (SVG ou Canvas · points qui se cristallisent en lettres)
- Audio ambient scene-aware (WebAudio low-pass filter par scène, user-initiated)
- Sticky pin horizontal sub-scroll pour chapter preview strip
- Command palette `cmd+K` site-wide
- Film-tint overlay chromatic sur `.pinapp-film-overlay` (complément au chromatic aberration)

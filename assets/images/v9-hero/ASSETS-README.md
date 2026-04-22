# Pinapp V9 — Assets Hero Immersif Avalon

Documentation des 6 images du hero immersif. Si un jour il faut regénérer une scène (changement de direction, qualité insuffisante, version 9:16 mobile dédiée), tout est ici.

---

## Alignement fichiers / grille de revue

Si une planche de revue affiche des **étiquettes de scène** qui ne correspondent pas au **visuel** (ex. vignette « Corridor » mais image désert), **toujours nommer les fichiers d'après le contenu visuel et la table narrative ci-dessous** (scène 1 = atrium, scène 2 = corridor, etc.), pas d'après la typo erronée sur la maquette.

---

## Direction artistique commune

**Référence cinéma** : *Passengers* (Tyldum 2016) — vaisseau Avalon. Direction **moderne sleek 2016**, pas vintage. Pas Orient Express. Pas paquebot 1930s.

**Règles communes aux 6 scènes** :
- Architecture intérieure courbée organique (cream + warm white dominants)
- Marbre clair au sol (jamais tapis bordeaux)
- Accents cuivre brossé en touches discrètes (jamais dominants)
- LEDs intégrées dans plafonds/murs (jamais appliques tungsten vintage)
- Nuit + vue cosmique aux fenêtres/dômes
- Atmosphère solennelle contemplative
- Anamorphique 2.39:1 cinematic, 35mm film grain
- Pas de personnages visibles (silhouettes mobilier OK)

**Modèle générateur** : Higgsfield Nano Banana Pro, format 16:9 (1376×768).

**Mots-clés bannis dans tous les prompts** : `vintage`, `1930s`, `Orient Express`, `burgundy carpet`, `dark walnut wood`, `tungsten sconces`, `cosy boudoir`.

---

## Mapping des 6 scènes

### Scène 1 — Atrium éveil (`scene-1-atrium-eveil-16x9`)

**Rôle narratif** : Bienvenue à bord. Premier plan, l'utilisateur arrive dans le vaisseau Pinapp. Atmosphère atrium contemplatif, dôme cosmique au plafond, arbres tropicaux centraux, marbre crème, accents cuivre.

**Texte H2 associé** : *« Le digital qui travaille pendant que vous vivez. »*

**Alt text** : « Atrium intérieur du vaisseau Avalon Pinapp avec dôme transparent révélant une nébuleuse cosmique cyan, arbres tropicaux centraux, architecture moderne courbée crème et cuivre, ambiance contemplative nocturne. »

**Focal point mobile** : `object-position: 50% 50%` (dôme centré, arbres conservés)

---

### Scène 2 — Corridor (`scene-2-corridor-16x9`)

**Rôle narratif** : Couloir tubulaire menant aux quatre métiers. Long couloir blanc Avalon courbé, hublots panoramiques sur la droite révélant l'espace cyan. Vanishing point qui draine le regard.

**Texte H2 associé** : *« Quatre métiers. Un seul système. »*

**Alt text** : « Long couloir tubulaire blanc moderne du vaisseau Avalon Pinapp, hublots courbés à droite ouvrant sur une nébuleuse spatiale, sol marbre poli, LEDs intégrées dans les courbes du plafond. »

**Focal point mobile** : `object-position: 65% 50%` (priorise hublots droite)

---

### Scène 3 — Cockpit + Pandora (`scene-3-cockpit-pandora-16x9`)

**Rôle narratif** : Pont d'observation, baie panoramique sur planète bioluminescente Pandora (cyan/violet). Dashboard ambré silhouette en foreground. Représente les réalisations Pinapp visibles depuis le poste de commande.

**Texte H2 associé** : *« Voyez votre métier, conçu par Pinapp. »*

**Alt text** : « Pont d'observation moderne du vaisseau Avalon Pinapp, immense baie panoramique courbée révélant une planète bioluminescente cyan et violet inspirée de Pandora, dashboard de commande en silhouette ambrée, sol marbre poli. »

**Focal point mobile** : `object-position: 50% 60%` (équilibre planète/dashboard)

---

### Scène 4 — Lounge Voie Lactée (`scene-4-lounge-voie-lactee-16x9`)

**Rôle narratif** : Salon contemplatif intime, dôme transparent au plafond avec Voie Lactée précieuse. Sofas modernes silhouettes. Atmosphère de recueillement — symbolise la mémoire (Mémoire & Présence) et les souvenirs (étoiles précieuses).

**Texte H2 associé** : *« Des preuves. Des souvenirs aussi. »*

**Alt text** : « Salon d'observation moderne du vaisseau Avalon Pinapp, dôme transparent au plafond révélant la Voie Lactée dense étoilée, sofas modernes en silhouette, ambiance intime contemplative. »

**Focal point mobile** : `object-position: 50% 30%` (priorise dôme étoiles haut)

---

### Scène 5 — Cosmos pur (`scene-5-cosmos-pur-16x9`)

**Rôle narratif** : Sortie symbolique du vaisseau. Pure photographie astronomique de la Voie Lactée. Pas d'intérieur, pas de vaisseau. Moment méditatif ouvert. Représente le manifeste « Pourquoi Pinapp » — l'infini, la perspective.

**Texte H2 associé** : *« Pourquoi Pinapp. »*

**Alt text** : « Vue photographique réaliste du cosmos profond avec la Voie Lactée dense étoilée, nébuleuses subtiles cyan et violet, atmosphère contemplative paisible. »

**Focal point mobile** : `object-position: 50% 50%` (Voie Lactée centrée)

---

### Scène 6 — Désert SF (`scene-6-desert-sf-16x9`) — image Michaël

**Rôle narratif** : Atterrissage sur planète alien. Désert SF désaturé monochrome gris-bleu, sable s'envolant en brume atmosphérique, Voie Lactée plein ciel. Représente l'arrivée — « ton projet qui commence ». Dernière scène, formulaire contact ici.

**Texte H2 associé** : *« Décrivez votre projet. On revient sous 24h. »*

**Alt text** : « Paysage de planète alien désertique nocturne, dunes monochromes gris-bleu avec sable porté par le vent, ciel rempli de la Voie Lactée dense étoilée, atmosphère mystique science-fiction. »

**Focal point mobile** : `object-position: 50% 70%` (priorise dunes basse)

**Auteur** : générée par Michaël Bouilhac (co-fondateur). URL Higgsfield d'origine : `https://higgsfield.ai/s/gdUzSerAKl0`

---

## Prompts d'origine (pour regénération éventuelle)

Tous les prompts utilisés étaient en anglais, modèle Nano Banana Pro, 16:9, 4 générations par prompt avec sélection de la meilleure. Mots-clés négatifs `NOT vintage NOT 1930s NOT Orient Express NOT burgundy carpet NOT dark walnut wood NOT tungsten sconces NOT cosy boudoir` ajoutés systématiquement.

### Scène 1 — Atrium éveil

> Modern luxury observation atrium aboard the Avalon spaceship from Passengers 2016 movie, contemporary 2016 sleek aesthetic, smooth curved cream and warm white walls, polished pale marble floor reflecting subtle warm light, brushed copper accent details as discrete touches, large curved transparent dome ceiling above revealing a beautiful cyan and violet cosmic nebula, central tropical trees and plants growing in atrium planters, sweeping balconies with curved glass railings, NIGHT TIME ambiance, soft warm interior lighting tamisée from integrated LED ceiling fixtures, contemplative nocturnal atmosphere, no people visible, anamorphic 2.39:1 cinematic framing, ultra detailed Hollywood production design, cinematic 35mm film grain, contemporary luxury cruise liner aesthetic, Apple Store meets luxury spa meets futuristic ocean liner

### Scène 2 — Corridor

> Long curved tubular corridor inside the Avalon spaceship from Passengers 2016 movie, contemporary 2016 sleek aesthetic, smooth organic curved walls in cream and warm white tones, polished pale marble floor reflecting subtle warm light, brushed copper accent details as discrete touches only, soft ambient LED lighting integrated seamlessly into curved ceiling and walls creating gentle even glow, perspective vanishing point straight ahead drawing the eye forward through the curved tube, large curved panoramic windows on the right side revealing deep space stars and distant cosmic nebula at night, contemporary luxury cruise liner aesthetic transposed to deep space

### Scène 3 — Cockpit + Pandora

> Modern observation deck of the Avalon spaceship from Passengers 2016 movie, contemporary 2016 sleek aesthetic, smooth curved cream and warm white walls with integrated LED lighting, polished pale marble floor, brushed copper accent panels as discrete touches, MASSIVE floor-to-ceiling curved panoramic window dominating most of the frame revealing a stunning Pandora-like bioluminescent planet from Avatar movie in deep space, cyan and violet glowing continents and atmospheric bioluminescent veins visible from orbit, planet fills two thirds of the window in awe-inspiring scale, foreground silhouette of modern command dashboard with brushed copper accents, awe-inspiring cosmic scale

### Scène 4 — Lounge Voie Lactée

> Modern luxury observation lounge atrium of the Avalon spaceship from Passengers 2016 movie, contemporary 2016 sleek aesthetic, smooth curved cream and warm white walls, polished pale marble floor, brushed copper accent details as discrete touches, large curved transparent dome ceiling above revealing the dense precious Milky Way galaxy with thousands of bright stars and cosmic dust clouds, elegant modern curved sofas and reading chairs as silhouettes in foreground, soft warm subtle interior LED lighting integrated into curved walls and ceiling edges, intimate contemplative atmosphere of recollection

### Scène 5 — Cosmos pur

> Realistic photographic view of the deep cosmos night sky, dense Milky Way galaxy stretching across the frame with thousands of bright real stars, beautiful realistic nebula clouds with subtle cyan and violet hues, cosmic dust trails, real astrophotography aesthetic, deep navy and black background, peaceful contemplative pure cosmic view, no spaceship, no interior, no people, no walls, no dashboard, anamorphic 2.39:1 cinematic framing, ultra detailed photographic realistic quality, cinematic 35mm film grain, peaceful nocturnal cosmic atmosphere

### Scène 6 — Désert SF (Michaël)

> Cinematic wide shot of a vast alien desert planet landscape at night, science fiction aesthetic, monochrome desaturated muted color palette of dusty pale grey-blue and cool ash sand, fine grains of sand being lifted and carried by gentle wind creating atmospheric haze swirling dramatically in the air, sand particles dancing in volumetric light, the entire sky above filled with the deep cosmos showing the dense Milky Way galaxy stretching across with thousands of bright stars and faint nebula in subtle cyan and violet hues, cool moonlight illuminating the dunes from above creating long shadows, sense of solitude immensity and otherworldly mystery

---

## Si tu dois regénérer

1. Recopie le prompt correspondant avec les négatifs `NOT vintage NOT 1930s NOT Orient Express NOT burgundy carpet NOT dark walnut wood NOT tungsten sconces NOT cosy boudoir` à la fin
2. Modèle Nano Banana Pro sur Higgsfield, format 16:9
3. Génère 4 variantes, garde la meilleure
4. Convertis en WebP qualité 85 (`pillow img.save(out, 'WEBP', quality=85, method=6)`)
5. Remplace dans ce dossier en gardant le nom de fichier (le HTML pointe dessus)

---

## Versions mobile 9:16

**Pas générées pour l'instant.** Stratégie actuelle = recadrage CSS via `object-fit: cover` + `object-position` calibré (cf `assets/css/mobile-focal-points.css`). Si jamais la qualité du recadrage CSS est insuffisante en review mobile, regénérer en 9:16 dédié (aspect ratio 9:16 sur Higgsfield, ~12 crédits pour les 6).

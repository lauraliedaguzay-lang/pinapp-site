# Storyboard V3.0 — mapping cinéma (référence figée)

Document de vérité : **chapitre HTML ↔ fichier vidéo ↔ fenêtre temps scrubber ↔ intention storyboard**.  
Implémentation : `assets/js/voyage-scrubber.js` → `timelineSegments()` + `transitions()`.

## Règle d’affichage (important)

Quand `html.voyage-v24-cinema` est actif **sans** `voyage-sober`, les fonds **par section** (`.voyage-scene__media-stack` : image + `.lieu-bg-video`) sont **masqués** au profit d’une **seule couche** plein écran `#voyage-cinema` (deux pistes A/B en crossfade). Le fond visible au scroll est donc **toujours** celui piloté par le scrubber, pas la vidéo inline du HTML.

## Tableau chapitre → rush

| Chapitre | `#` | `data-chapter` | Fichier MP4 | Scroll global (approx.) | Fenêtre temps dans le fichier (s) | Intention storyboard Lauralie | Statut contenu |
|----------|-----|----------------|-------------|-------------------------|-------------------------------------|--------------------------------|-----------------|
| 0 | `s1` | 1 | `01-main-hologramme.mp4` | 0 % → 12 % | **t0 0 → t1 3** (les 3 premières secondes au hero) | Main + hologramme (doigt qui touche), graphique avant/après | À valider dans le fichier local |
| 1 | `s2` | 2 | `02-couloir-passengers.mp4` | 14 % → 26 % | 0 → 4 | Couloir Passengers en fond | À valider |
| 2 | `s3` | 3 | `03-hublot-cosmos.mp4` | 28 % → 40 % | 0 → 6 | Hublot cockpit cosmos, 4 métiers type widget Apple | À valider |
| 3 | `s4` | 4 | `04-constellation-mp.mp4` | 42 % → 54 % | 0 → 3,5 | Constellation, widget M&P / Auralis / newsletter | À valider |
| 4 | `s5` | 5 | `05-sortie-vaisseau.mp4` | 56 % → 66 % | 0 → 4 | Vaisseau / sortie, « courant » | À valider |
| 5 | `s5b` | 6 | `05-sortie-vaisseau.mp4` (même fichier) | 66 % → 76 % | **4 → 8** | Suite même décor : bloc N8N / automatisations (storyboard : même bande que le vaisseau) | À valider |
| 6 | `s6` | 7 | `06-balade-cosmos.mp4` | 78 % → 88 % | 0 → 5 | Balade cosmos, manifeste « digital human » | À valider |
| 7 | `s7` | 8 | `07-tourbillon-etoiles.mp4` | 90 % → 96 % | 0 → 4 | Tourbillon étoiles + réalisations | À valider |
| 8 | `s8` | 9 | `08-atterrissage-sable.mp4` | 98 % → 100 % | 0 → 3 | Atterrissage sable doré | À valider |

Les pourcentages **12–14 %, 26–28 %**, etc. sont des **zones de transition** (crossfade) entre deux chapitres — voir `transitions()` dans le même fichier.

## s5 / s5b : un rush, deux temps

**Un seul fichier** `05-sortie-vaisseau.mp4` sert **deux chapitres** avec des intervalles `currentTime` différents : c’est voulu (storyboard : N8N dans la continuité du vaisseau).

## Ajuster sans regénérer (chemin B)

Si le rush est bon mais la **portion** visible ne l’est pas : modifier uniquement `t0` / `t1` (et éventuellement `s0` / `s1` si la durée de lecture par chapitre doit changer) dans `timelineSegments()`.  
Exemple documenté : `01-main-hologramme.mp4` dure **6,06 s** au total (`ffprobe`) ; le hero n’en montre que **0–3 s** tant que `t1` reste à `3`.

## Regénérer les rushes (chemin C)

Remplacer les MP4 sous `assets/video/voyage/`, puis commit + push. Penser au **cache** (`?v=` dans `index.html` si politique du dépôt l’exige) et aux **posters** JPEG / AVIF associés si les images de une frame changent.

## Vérification rapide dans le navigateur

1. Remonter tout en haut de la page (pas d’ancre de scroll).
2. Inspecter la piste cinéma **active** : `#cinema-track-a` ou `#cinema-track-b` selon la classe `is-active`.
3. Lire `video.currentSrc` : en tête de page, attendu `…/01-main-hologramme.mp4` (ou équivalent hébergé).

---

*Dernière synchro avec le code : `timelineSegments()` tel que dans le dépôt au moment de la rédaction de ce fichier.*

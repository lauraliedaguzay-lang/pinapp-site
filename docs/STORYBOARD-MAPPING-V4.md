# Storyboard V4.0 — fond vidéo par scène (référence)

Document de vérité après **V4.0** : chaque section affiche **sa** vidéo dans `.voyage-scene__media-stack` (lecture en boucle, muette). Le scrubber central `voyage-scrubber.js` **n’est plus chargé** sur `index.html` ; la couche `#voyage-cinema` reste dans le DOM mais est **masquée** en CSS lorsque `html` porte la classe `voyage-v40-per-scene`.

## Règle d’affichage

- `html.voyage-v40-per-scene` : `#voyage-cinema` masqué ; `.voyage-scene__media-stack` visible ; dégradé de lisibilité via `::after` sur la pile média (voir `voyage.css`).
- `voyage-sober` : inchangé (effets réduits, pas de cinéma).
- **Optionnel V4.1** : réactiver le scrubber en chargeant `voyage-scrubber.js` + retirer `voyage-v40-per-scene` sur `<html>`.

## Tableau chapitre → rush → composant visuel

| Chapitre | `#` | `data-chapter` | Fichier MP4 (fond section) | Composant visuel / note V4 | Statut contenu |
|----------|-----|----------------|----------------------------|----------------------------|-----------------|
| 0 | `s1` | 1 | `01-main-hologramme.mp4` | Hero : graphique avant/après + teaser circulaire (`hero-teaser`, `hero-beforeafter`) | ✅ aligné (chemin A) |
| 1 | `s2` | 2 | `02-couloir-passengers.mp4` | Portraits `<picture class="pilote-img">` + lazy vidéo | ✅ aligné |
| 2 | `s3` | 3 | `03-hublot-cosmos.mp4` | Grille 2×2 métiers (sans phrase « Chaque point… ») | ✅ aligné |
| 3 | `s4` | 4 | `04-constellation-mp.mp4` | Constellation + labels SVG + sable (`sand-reveal-constellation.js`) | ✅ aligné |
| 4 | `s5` | 5 | `05-sortie-vaisseau.mp4` | Preuves (stats) | ✅ aligné |
| 5 | `s5b` | 6 | `05-sortie-vaisseau.mp4` | Flux n8n courbe + spark (`n8n-flow-spark.js`) + cartes chiffrées | ✅ aligné |
| 6 | `s6` | 7 | `06-balade-cosmos.mp4` | Manifeste + grille 3 engagements | ✅ aligné |
| 7 | `s7` | 8 | `07-tourbillon-etoiles.mp4` | Tourbillon WebGL (`tourbillon-webgl.js`) — pin scroll conservé | ✅ aligné |
| 8 | `s8` | 9 | `08-atterrissage-sable.mp4` | Contact + formulaire | ✅ aligné |

**Teaser hero** : `pinapp-presentation-46s.mp4` en priorité ; repli `01-main-hologramme.mp4` si le fichier teaser est absent.

**Perf** : `data-lazy-video` sur les fonds s2–s8 + `voyage-lazy-videos.js` ; preload LCP : `01-main-hologramme.mp4`. Génération AV1/AVIF : `.\tools\pinapp-perf-gen.ps1` (Windows).

**OG social** : `assets/images/og-pinapp-v40.jpg` (1200×630, extrait vidéo en CI / local via `ffmpeg`).

## Historique V3 (scrubber)

Le tableau fenêtres temps / scroll % de `docs/STORYBOARD-MAPPING-V3.md` reste valable comme **archive** du mode `voyage-v24-cinema` + `voyage-scrubber.js`. En V4, ces pourcentages ne pilotent plus l’affichage : chaque section joue sa propre `<video>`.

---

*V4.0 livré — Magic MCP : non utilisé dans l’agent cloud ; équivalents vanilla alignés sur le brief Magic (teaser, before/after, n8n spark, engagements, constellation labels).*

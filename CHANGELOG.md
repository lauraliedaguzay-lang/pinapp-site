# Changelog — pinapp-site

## v15.6.0 — script-final-2026-05-11 (PR #158)

### Ajouts

- **#engagements** : 8 promesses (sobriété numérique + accessibilité WCAG 2.1 AA).
- **#cinema-artistes** : section `hero-4` avec Vimeo Icebreaker (1187533794, lazy IO inchangé) + bloc forfait cadeau cinéma IA **990 € HT** + liens `/studio-artistes/` et `#contact`.
- **Filigranes « pierres »** : 6 pastilles SVG-free en calque sur chaque fond `hero-1`…`hero-6` ; progression au changement de fond actif ; classe `infinity-gauntlet-complete` + log console ASCII (sans marque ni licence tierce dans le copy public).
- **Réalisations** : cartes démo **photographe · coach · restaurant · artisan** avec placeholder SVG inline (pas Unsplash) ; carte **Cabinet juridique haut de gamme** (placeholder 3 890 € HT, lien `#contact`).
- **scene-counter.js** : liste `SCENES` alignée sur la structure actuelle de `voyage-v9/index.html`.

### Retraits / déplacements

- Section **#icebreaker-spot** supprimée (Icebreaker déplacé vers `#cinema-artistes`).
- Carte Icebreaker retirée de la grille `#realisations` pour éviter le triple affichage.

### Corrections mapping / copy

- **`#diagnostic`** : `data-stage="hero-2"` (aligné narration « couloir »).
- **`#pourquoi-moins-cher`** : `data-stage="hero-2"`.
- Teaser imagerie : libellés **sans titre de licence** (générique « jeu vidéo »).
- Emojis retirés sur sources études, badge STAR offres, glyphe labo, liste workflow.

### Post-merge — à fournir (Lauralie)

- Fichiers WebP : `photographe.webp` · `coach.webp` · `restaurant.webp` · `artisan.webp` dans `voyage-v9/assets/demo-screens/` (remplacer les SVG des cartes).
- Teaser Vimeo forfait cadeau 3 min.
- Nom et preuve visuelle définitifs **cabinet juridique haut de gamme**.

### Non réalisé dans ce commit (vs brief « reset 66ad728f »)

- Pas de `curl`/écrasement total depuis le commit `66ad728f` (risque de régression sur Vimeo, cookies, viewport, Option B). La base reste **main** actuelle + greffes ci-dessus.

### Notes ops

- Fermeture / commentaire **PR #157** : l’API GitHub « integration » de cet environnement ne permet pas `gh pr close` / commentaire ; à faire manuellement dans l’UI GitHub avec le texte pivot fourni dans la PR #158.

---

## v15.5.0 — restore-narrative (référence branche #157)

Voir historique Git branche `cursor/pr-157-restore-narrative-2026-05-11` si mergée ultérieurement.

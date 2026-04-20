# Storyboard V5.0 — Magic brief → vanilla (référence)

Suite directe de **V4.0** (`docs/STORYBOARD-MAPPING-V4.md`). La vérité runtime reste **`index.html`** + `voyage.css` + scripts voyage.

## Source Magic (projet public)

- Lien partagé (chat / UI React générée) : `https://21st.dev/magic-chat/5ee97564-ac57-4181-a606-6b3cd4937bf0`
- **Constat agent / fetch HTTP** : l’URL ne sert pas le code TSX en clair (application SPA). La traduction **ne peut pas** être automatisée par `web_fetch` seul.
- **Workflow recommandé** : export local depuis l’UI Magic (copier-coller ou zip si disponible) → branche Cursor → traduction vanilla fichier par fichier.

## Ce que V5.0 change par rapport à V4.0

| Sujet | V4.0 | V5.0 |
|-------|------|------|
| Fonds section | Vidéo locale + **images PNG** par-dessus | **Vidéo `https://pinapp.fr/assets/video/voyage/*.mp4` en premier `<source>`** ; calques `<picture>` retirés |
| Poster / LCP | Chemins relatifs `/assets/...` | Posters + preload LCP en **`https://pinapp.fr/...`** (CORS OK, `access-control-allow-origin: *` côté prod vérifié) |
| Lisibilité | Dégradé `::after` (V4) | Avec `html.voyage-v41-magic-media` : **`rgba(10,20,37,0.55)`** plein écran sur la pile média |
| Transitions chapitre | Overlay 400 ms | **800 ms** `cubic-bezier(0.22, 1, 0.36, 1)` (`chapter-nav.js` + `voyage.css`) |
| Microcopy « cadre » | — | **Eyebrows** type brief Magic sur s3–s8 (H1 / H2 inchangés ; pas de « Vous récoltez ») |

## Règle HTML

- Conserver **`voyage-v40-per-scene`** (fond par scène, cinéma masqué).
- Ajouter **`voyage-v41-magic-media`** sur `<html>` pour activer l’overlay 0.55.

## Crédit

Patterns et hiérarchie inspirés du flux **21st.dev Magic** ; implémentation **vanilla** dans ce dépôt (pas de React / Tailwind).

---

*V5.0 — intégration brief Magic sans dépendance au bundle React public.*

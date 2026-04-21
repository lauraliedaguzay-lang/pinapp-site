# Déploiement V6.0 — cache film

## Fichiers lourds

- `assets/video/voyage/pinapp-film-v6.mp4`
- `assets/video/voyage/pinapp-film-v6.webm` (optionnel selon encodage)

## En-têtes HTTP recommandés (CDN / Pages / hPanel)

Pour les fichiers vidéo versionnés avec `?v=…` dans l’URL :

```
Cache-Control: public, max-age=31536000, immutable
```

Adapter si votre CDN ne supporte pas `immutable`.

## Versionnage

Toujours bumper `?v=` dans `index.html` après changement de binaire vidéo.

## OG

- `assets/images/og-pinapp-v6.jpg` — régénérer depuis une frame du film final (`ffmpeg -ss 2 …`).

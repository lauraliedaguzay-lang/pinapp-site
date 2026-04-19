# Configuration — page `/voyage/` (V2)

## Webhooks

1. Créez les endpoints n8n (ou équivalent) pour diagnostic, newsletter, parrainage.
2. Renseignez les URLs dans **`/assets/js/config-voyage.js`** → `PINAPP_CONFIG.webhooks`  
   *(ou injectez-les au build sans committer de secrets dans le dépôt public).*

## Cal.com

Les URLs par défaut pointent vers le flux **diagnostic** déjà utilisé sur le site (`config-voyage.js`). Remplacez `calcom.audit` si vous ajoutez un flux « audit express » dédié.

## Plausible

La page embarque le même script que le reste du site (`data-domain="pinapp.fr"`). Ajustez si le domaine de prévisualisation diffère.

## Geist

Fichiers `geist-sans-*.woff2` dans `/assets/fonts/` — provenance **Fontsource / jsDelivr** pour l’agent ; en production, vérifiez la conformité avec la distribution officielle Vercel Geist si vous préférez une source unique.

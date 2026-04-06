# 03 — Automatisation contenus réseaux (Pinapp)

> **GitHub :** [ce fichier](https://github.com/lauraliedaguzay-lang/pinapp-site/blob/main/docs/claude-consultation/03-RESEAUX-SOCIAUX-AUTO.md) · [dossier `claude-consultation`](https://github.com/lauraliedaguzay-lang/pinapp-site/tree/main/docs/claude-consultation)

## Périmètre

- **Génération assistée** : légendes, hooks, idées carrousels, scripts courts.
- **Canaux** : **LinkedIn** en priorité B2B ; Instagram / TikTok si utilisés pour la marque Pinapp.

## Même principe que le mail

**Claude propose** → **Lauralie valide** → publication **manuelle** ou via Buffer / Later / outils meta — **pas de publication auto** sans action humaine.

## Flux cible (Apps Script)

- Trigger hebdo (ex. lundi 8h) → appel API Claude → contenu semaine → **Google Doc** « Pinapp — Social semaine … » dans Drive → notification courte à Lauralie.
- Fichier prévu : `apps-script/pinapp-social-media.js` (clés en propriétés du script).

## « Réunion critique » (un prompt, plusieurs critères)

| Voix | Rôle |
|------|------|
| Direction de marque | Cohérence `pinapp.fr`, premium, calme |
| Copy B2B | Clarté, pas de promesses IA magiques |
| Crédibilité / éthique | Transparence, RGPD-friendly |
| Performance réseaux | Accroche, CTA, format |
| Verdict | Synthèse + corrections avant validation humaine |

## Charte visuelle des posts

- S’aligner sur **`assets/variables.css`** (accent teal, modes clair/sombre) — identité **Pinapp** uniquement.

## Interdits (posts publics)

- Prix / devis détaillés  
- Données clients sans accord  
- Ton « hustle » cheap  
- Promesses légales ou résultats non vérifiables  

## Planning

- Indicatif B2B : mardi / jeudi matin — à affiner avec statistiques réelles.

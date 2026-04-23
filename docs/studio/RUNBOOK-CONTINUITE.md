# Runbook — continuité si indisponibilité (Pinapp)

Objectif : permettre à l’autre associé·e ou à une personne de confiance de **tenir le minimum vital** un jour ou quelques jours.

## 1. Accès critiques (liste à maintenir hors dépôt)

- GitHub org / dépôt `pinapp-site` — qui a les droits admin
- Hostinger (domaine, renouvellement, DNS)
- Netlify / GitHub Pages selon déploiement actif
- Stripe, YouSign, n8n (URLs + comptes)
- Notion CRM
- Gmail / domaine email

**Ne jamais** coller de mots de passe dans ce fichier : utiliser Bitwarden / 1Password partagé.

## 2. Déploiement site

- Branche de production : `main` (ou procédure documentée dans le dépôt).
- Après correctif urgent : `git pull`, patch minimal, `git push`, vérifier build / Pages.
- Vérifications post-déploiement : HTTP 200 accueil, assets CSS/JS, formulaire diagnostic si touché.

## 3. Clients en cours

- Liste des dossiers actifs : Notion ou Drive `01-Projets-en-cours/` (nom client + prochaine échéance + contact).
- Relances : modèle mail court dans `docs/studio/` si existant.

## 4. Automatisations

- n8n : URL instance + workflows critiques (W1 prospect, W2 devis…).
- En cas de panne : désactiver temporairement le webhook public si risque spam ; notifier les clients en attente par mail neutre.

## 5. Escalade

- Expert-comptable : coordonnées dans votre coffre-fort.
- Hébergeur : ticket support Hostinger si site down.

---

*Gabarit — compléter les noms, URLs et numéros d’urgence réels dans votre coffre d’équipe.*

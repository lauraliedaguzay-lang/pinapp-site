# Politique de sécurité — Pinapp Studio (site vitrine)

## Signaler une vulnérabilité

- **Email :** [lauralie.daguzay@pinapp.fr](mailto:lauralie.daguzay@pinapp.fr?subject=Pinapp%20%E2%80%94%20Signalement%20s%C3%A9curit%C3%A9%20%E2%80%94%20pinapp.fr)
- Indiquez une description, les étapes de reproduction, et l’impact estimé. Délai de réponse visé : sous **7 jours ouvrés**.

Fichier machine : `https://pinapp.fr/.well-known/security.txt` (déployé depuis `.well-known/security.txt` dans ce dépôt).

## Périmètre

- Site statique **pinapp.fr** (HTML, CSS, JS).
- **Déploiement** : souvent **Netlify** (voir `netlify.toml` — en-têtes CSP, HSTS, cache) ; certains environnements peuvent encore servir les fichiers via **Apache** / `.htaccess` (Hostinger ou autre).
- Hors périmètre : comptes tiers (LinkedIn, messagerie), postes clients, instances n8n / Make configurées par le client.

## Données personnelles et RGPD

- **Politique détaillée :** [legal/confidentialite.html](legal/confidentialite.html) (responsable du traitement, finalités, sous-traitants, droits, CNIL).
- **Mesure d’audience :** script **Plausible** chargé **uniquement après consentement** (`assets/js/plausible-consent.js` + bannière). Aucun e-mail ni donnée sensible n’est envoyé à Plausible dans les événements personnalisés.
- **Cookies / stockage local :** mémorisation du choix de consentement dans le navigateur (`localStorage`).

## Bonnes pratiques dépôt GitHub

- Ne jamais committer : `.env`, `.htpasswd`, mots de passe FTP/SFTP, clés API, jeton **Hostinger API** (`HOSTINGER_API_TOKEN`), PAT GitHub, fichier **`%USERPROFILE%\.pinapp-fr-env.ps1`** (reste hors dépôt).
- Fichier `.sftp.json` est listé dans `.gitignore` ; utilisez des secrets GitHub Actions si vous automatisez le déploiement.
- Activez sur le dépôt : **Secret scanning** (paramètres GitHub), **branch protection** sur `main` (ex. PR obligatoire, pas de push direct).

## Audit interne (état au dernier passage)

| Zone | Mesure |
| ---- | ------ |
| Transport | HTTPS, **HSTS** (preload sur Netlify), redirection HTTP → HTTPS sur Apache |
| En-têtes | `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, **COOP** / **CORP** (Netlify), `X-Frame-Options` ou équivalent CSP `frame-ancestors` |
| **CSP** | Politique dans `netlify.toml` et `.htaccess` : `base-uri`, `object-src 'none'`, `upgrade-insecure-requests`, `form-action 'self'`, domaines autorisés (polices Bunny/Google, Plausible, Calendly, Make, n8n cloud) |
| Listing | `Options -Indexes` (Apache) |
| Dashboard | Auth Basic sur `/dashboard/` si `.htpasswd` configuré côté serveur |
| Fuite de secrets | `.gitignore` renforcé + CI vérifie l’absence de `.env` / `.htpasswd` |
| Dépendances | Dependabot sur les workflows Actions |

À faire côté exploitation : vérifier le **chemin `AuthUserFile`** réel sur Apache, confirmer la **CSP** en préproduction (widgets tiers), et si vous utilisez un **domaine Plausible personnalisé**, l’ajouter dans `script-src` et `connect-src`.

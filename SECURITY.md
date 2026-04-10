# Politique de sécurité — Pinapp Studio (site vitrine)

## Signaler une vulnérabilité

- **Email :** [lauralie.daguzay@pinapp.fr](mailto:lauralie.daguzay@pinapp.fr?subject=Signalement%20sécurité%20—%20pinapp.fr)
- Indiquez une description, les étapes de reproduction, et l’impact estimé. Délai de réponse visé : sous **7 jours ouvrés**.

Fichier machine : `https://pinapp.fr/.well-known/security.txt` (déployé depuis `.well-known/security.txt` dans ce dépôt).

## Périmètre

- Site statique **pinapp.fr** (HTML, CSS, JS, hébergement Apache / `.htaccess`).
- Hors périmètre : comptes tiers (LinkedIn, messagerie), postes clients.

## Bonnes pratiques dépôt GitHub

- Ne jamais committer : `.env`, `.htpasswd`, mots de passe FTP/SFTP, clés API, jeton **Hostinger API** (`HOSTINGER_API_TOKEN`), PAT GitHub, fichier **`%USERPROFILE%\.pinapp-fr-env.ps1`** (reste hors dépôt).
- Fichier `.sftp.json` est listé dans `.gitignore` ; utilisez des secrets GitHub Actions si vous automatisez le déploiement.
- Activez sur le dépôt : **Secret scanning** (paramètres GitHub), **branch protection** sur `main` (ex. PR obligatoire, pas de push direct).

## Audit interne (état au dernier passage)

| Zone             | Mesure                                                                                        |
| ---------------- | --------------------------------------------------------------------------------------------- |
| Transport        | Redirection HTTPS + en-têtes (`X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`) |
| CSP              | Politique dans `.htaccess` (inline script/style assumés pour démos + JSON-LD)                 |
| Listing          | `Options -Indexes`                                                                            |
| Dashboard        | Auth Basic sur `/dashboard/` si `.htpasswd` configuré côté serveur                            |
| Fuite de secrets | `.gitignore` renforcé + CI vérifie l’absence de `.env` / `.htpasswd`                          |
| Dépendances      | Dependabot sur les workflows Actions                                                          |

À faire côté hébergement : chemin **`AuthUserFile`** réel, **HSTS** (décommenter dans `.htaccess` après validation), activer **Plausible** + ajuster `connect-src` / `script-src` si domaine perso.

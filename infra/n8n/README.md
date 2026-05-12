# n8n.pinapp.fr — déploiement GitHub Actions (Caddy + TLS + CORS)

Ce dossier alimente le workflow **Deploy n8n** (`.github/workflows/deploy-n8n.yml`) : SSH vers le VPS Hostinger, découverte en lecture seule, puis application d’un **Caddyfile** (Let’s Encrypt + reverse proxy vers `localhost:5678`) et fusion contrôlée des variables **n8n** pour **CORS** `https://pinapp.fr`.

Aucun secret n’est versionné : tout passe par **GitHub Actions → Secrets**.

---

## 1. Générer une clé SSH dédiée (sur ton poste)

```bash
ssh-keygen -t ed25519 -f ~/.ssh/pinapp_gh_deploy -C "github-actions-deploy" -N ""
```

---

## 2. Installer la clé publique sur le VPS

Remplace l’IP par la tienne si besoin (secret `VPS_HOST` plus bas).

```bash
ssh-copy-id -i ~/.ssh/pinapp_gh_deploy.pub root@72.62.17.219
```

Vérifie une connexion non interactive :

```bash
ssh -i ~/.ssh/pinapp_gh_deploy -o BatchMode=yes root@72.62.17.219 'echo ok'
```

---

## 3. Secrets GitHub (Settings → Secrets and variables → Actions)

| Nom | Contenu |
|-----|-----------|
| `VPS_SSH_PRIVATE_KEY` | Contenu **complet** de `~/.ssh/pinapp_gh_deploy` (clé **privée**, multiligne) |
| `VPS_HOST` | `72.62.17.219` (ou le hostname SSH si tu l’utilises à la place de l’IP) |

Ne commite jamais ces valeurs.

---

## 4. Premier run — mode **discover**

1. GitHub → **Actions** → **Deploy n8n** → **Run workflow**
2. **mode** : `discover`
3. Si le host SSH n’est pas encore dans `known_hosts` côté runner, coche **skip_host_key_check** une fois (`true`), puis repasse à `false` une fois la clé hôte stabilisée. Alternative : variable dépôt `VPS_SKIP_HOST_CHECK` = `true` (Settings → Secrets and variables → Actions → **Variables**).
4. Copie-colle **tout le log** de l’étape *Discover* et envoie-le pour validation (chemins compose, ports, `.env` redacted).

---

## 5. Application — mode **apply**

Quand la discovery est validée :

1. **Actions** → **Deploy n8n** → **Run workflow**
2. **mode** : `apply`
3. Le workflow copie `Caddyfile`, `n8n.env.patch`, `deploy.sh` sur le VPS puis exécute `deploy.sh` (merge `.env`, install Caddy si absent, `caddy validate`, reload systemd, `docker compose restart n8n`, tests `curl`).

---

## Fichiers

| Fichier | Rôle |
|---------|------|
| `discover.sh` | Audit read-only (docker, compose, Caddy, `.env` clés redacted, `dig`, `curl` health) |
| `Caddyfile` | Site `n8n.pinapp.fr` → proxy `localhost:5678` + en-têtes CORS + log JSON |
| `n8n.env.patch` | Clés à fusionner dans `.env` (n’écrase que ces clés) |
| `deploy.sh` | Merge, Caddy, restart stack, smoke tests |

---

## Troubleshooting

- **Let’s Encrypt rate limit** : trop de certificats demandés sur le même hostname. Attends la fenêtre LE ou teste avec un staging (non couvert par ce dépôt par défaut).
- **Ports 80 / 443** : ACME HTTP-01 / TLS-ALPN nécessitent que le VPS soit joignable depuis Internet sur **80** et **443**. Ouvre-les dans le firewall Hostinger / UFW.
- **DNS** : `dig +short n8n.pinapp.fr` doit pointer vers le VPS **avant** `apply` pour que Let’s Encrypt réussisse.
- **n8n pas sur `5678`** : adapte le `reverse_proxy` dans `Caddyfile` (PR) ou expose le bon port dans Docker.
- **Compose hors chemin `*n8n*`** : exporte `N8N_DIR` sur le serveur ou déplace le projet sous un chemin contenant `n8n`, sinon `deploy.sh` ne trouvera pas `docker-compose.yml`.
- **Nom du service Docker** : ce script fait `docker compose restart n8n`. Si ton service s’appelle autrement, ajuste `deploy.sh` dans une PR.
- **Première connexion SSH depuis Actions** : utilise l’input **skip_host_key_check** une fois si `ssh-keyscan` échoue, puis repasse à `false`.

---

## Après stabilisation

Tu pourras ajouter un trigger `push` sur chemins `infra/n8n/**` dans le workflow pour déployer automatiquement à chaque PR mergée — volontairement **désactivé** au départ pour limiter les surprises.

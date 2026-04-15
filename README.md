# Pinapp Studio — site vitrine

Site statique (HTML / CSS / JS) pour **pinapp.fr**.

### Ajouter vidéos, photos, démos (Lauralie & Micha)

Tout est expliqué dans **[`GUIDE-CONTENU.md`](./GUIDE-CONTENU.md)** : emplacements des fichiers, noms imposés (loader, portfolio Micha), remplacement des photos Unsplash des démos, création d’un nouveau site sous `demo/`, checklist avant mise en ligne. Les fichiers `assets/js/config.js` et `assets/js/demo-photo-packs.js` pointent aussi vers ce guide en en-tête.

## Dépôt GitHub

**URL du projet :** [https://github.com/lauraliedaguzay-lang/pinapp-site](https://github.com/lauraliedaguzay-lang/pinapp-site)

Branche par défaut : `main` ou `master` (les deux sont prises en charge par la CI).

### Premier envoi ou mise à jour (HTTPS + token)

Sous **Windows**, ouvrez **PowerShell** dans le dossier parent du dépôt.

```powershell
Set-Location pinapp-site
git init
git add .
git commit -m "Initial import Pinapp site"
git branch -M main
git remote add origin https://github.com/lauraliedaguzay-lang/pinapp-site.git
git push -u origin main
```

Si `origin` existe déjà avec une autre URL :

```powershell
git remote set-url origin https://github.com/lauraliedaguzay-lang/pinapp-site.git
git push -u origin main
```

## Outils de développement (frameworks / chaîne locale)

Le site reste **HTML + CSS + JS vanilla** en production (pas de React/Vue). La chaîne npm sert au **confort local** :

| Outil                                | Rôle                                                                                            |
| ------------------------------------ | ----------------------------------------------------------------------------------------------- |
| **[Vite](https://vitejs.dev/)**      | Serveur de dev multi-pages (`appType: 'mpa'`), rechargement rapide, chemins comme en HTTP réel. |
| **[Prettier](https://prettier.io/)** | Formatage optionnel HTML/CSS/JS/JSON/YAML.                                                      |

**Prérequis :** [Node.js 20+](https://nodejs.org/)

```powershell
Set-Location pinapp-site
npm install
npm run dev
```

- La fenêtre du terminal doit **rester ouverte** : sinon le navigateur affiche **ERR_CONNECTION_REFUSED**.
- URL : **`http://127.0.0.1:5173/`** ou `http://localhost:5173/` (le serveur écoute sur toutes les interfaces).

#### Windows — PowerShell par défaut

À la racine du dépôt, le script **`pinapp.ps1`** regroupe les tâches courantes (même commandes qu’avec `npm run pinapp -- …`) :

```powershell
Set-Location $env:USERPROFILE\Projects\pinapp-site
.\pinapp.ps1 help
.\pinapp.ps1 check
.\pinapp.ps1 ship
.\pinapp.ps1 info
.\pinapp.ps1 suite
.\pinapp.ps1 dev
.\pinapp.ps1 format
```

- **Avant un push** : `.\pinapp.ps1 ship` (même contrôle que la CI + build `_site`). **Domaine pinapp.fr tout en PowerShell sans menu** : une fois `.\pinapp.ps1 fr-prepare-profile` (crée `~\.pinapp-fr-env.ps1` avec le jeton Hostinger), puis `gh auth login` ou PAT dans ce fichier ; ensuite à chaque fois : `. $env:USERPROFILE\.pinapp-fr-env.ps1` puis `.\pinapp.ps1 fr-auto` (API Hostinger DNS + API GitHub Pages, aucune question). Variante guidée : `.\pinapp.ps1 sync-fr`. Voir aussi `dns`, `dns-hostinger`, `diagnose-fr`, `probe`.
- **HTTP local (sans Vite)** : `.\pinapp.ps1 serve` (racine du dépôt) ou `.\pinapp.ps1 preview` (`_site` après `build`). Port par défaut **8899** ; pour en changer : `$env:PINAPP_HTTP_PORT = 9000` puis `serve` / `preview`.
- **Nettoyage** : `.\pinapp.ps1 clean` supprime le dossier `_site`.
- **GitHub** : `.\pinapp.ps1 repo`, `.\pinapp.ps1 actions`, `.\pinapp.ps1 open` (réglages Pages).
- **Vite** : `powershell -NoProfile -ExecutionPolicy Bypass -File .\tools\dev-vite.ps1` (vérifie Node, `npm install` si besoin, puis le serveur de dev).

Les pages profondes fonctionnent en MPA (`/offres/index.html`, etc.).

- `npm run format` — formater le dépôt (vérifiez le diff avant commit).
- `npm run format:check` — contrôle sans écrire (adaptable en CI).

**Important :** le déploiement (Hostinger, GitHub Pages, ZIP Netlify) continue d’utiliser les **fichiers sources** tels quels ; il n’y a **pas** d’étape `vite build` en prod pour éviter tout conflit avec le dossier `assets/` existant.

## Déploiement prévisualisation (GitHub Pages)

Après chaque push sur **`main`**, le workflow **Déployer GitHub Pages** publie le site.

1. Sur GitHub : **Settings → Pages** → **Build and deployment** : source **GitHub Actions** (pas « Deploy from a branch »).
2. Au premier déploiement, autorisez l’environnement **`github-pages`** si GitHub le demande.
3. URL du site : **[https://lauraliedaguzay-lang.github.io/pinapp-site/](https://lauraliedaguzay-lang.github.io/pinapp-site/)**
   - Ouvrir **exactement** ce lien (avec **`/pinapp-site/`**).
   - **`https://lauraliedaguzay-lang.github.io/`** seul → **404** (normal : ce n’est pas un site « utilisateur » à la racine).

### Si vous voyez encore une 404

1. **Settings → Pages** : la source doit être **GitHub Actions**, pas « Deploy from a branch ».
2. **Actions** : le workflow **Déployer GitHub Pages** doit être vert ; en cas d’échec, ouvrir le log du job **deploy**.
3. **Environnement** : au premier déploiement, valider **`github-pages`** dans **Settings → Environments** si une protection est activée.
4. Dépôt **privé** sur compte gratuit : vérifiez la [doc GitHub Pages](https://docs.github.com/pages) (visibilité du site).
5. Relancer manuellement : **Actions → Déployer GitHub Pages → Run workflow**.

Les fichiers **`.htaccess`** (Apache) ne s’appliquent pas sur Pages ; pour la prod **pinapp.fr**, utilisez **Hostinger** (ou équivalent) avec le ZIP ou le FTP.

Sous **Windows**, pour les enregistrements DNS et la vérification HTTP : **`.\pinapp.ps1 suite`**, **`.\pinapp.ps1 dns`**, ou en cas de **403 sur pinapp.fr** : **`.\pinapp.ps1 403`** ou **`.\pinapp.ps1 diagnose-fr`**, puis **`.\pinapp.ps1 corrige-fr`** après **`gh auth login`** pour pousser le domaine sur GitHub (API).

## Déploiement production (pinapp.fr)

- Hébergement type **Hostinger** (Apache) : uploader le contenu du dossier à la racine du domaine, en conservant **`.htaccess`** à la racine.
- ZIP complet pour Netlify manuel : `powershell -NoProfile -ExecutionPolicy Bypass -File .\tools\package-netlify.ps1` (voir `DEPLOIEMENT-NETLIFY.txt`).
- Vérifiez que **`/.well-known/security.txt`** est accessible en HTTPS.
- Ne déployez **jamais** `.htpasswd` ni `.env` via le dépôt : créez le fichier mot de passe **uniquement sur le serveur**.

Détails sécurité et signalement : voir **[SECURITY.md](./SECURITY.md)**.

## CI GitHub

Le workflow **Site — vérifications** contrôle la présence des fichiers critiques et l’absence de `.env` / `.htpasswd` dans le dépôt.

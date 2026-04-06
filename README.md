# Pinapp Studio — site vitrine

Site statique (HTML / CSS / JS) pour **pinapp.fr**.

## Dépôt GitHub

**URL du projet :** [https://github.com/lauraliedaguzay-lang/pinapp-site](https://github.com/lauraliedaguzay-lang/pinapp-site)

Branche par défaut : `main` ou `master` (les deux sont prises en charge par la CI).

### Premier envoi ou mise à jour (HTTPS + token)

```bash
cd pinapp-site
git init
git add .
git commit -m "Initial import Pinapp site"
git branch -M main
git remote add origin https://github.com/lauraliedaguzay-lang/pinapp-site.git
git push -u origin main
```

Si `origin` existe déjà avec une autre URL :

```bash
git remote set-url origin https://github.com/lauraliedaguzay-lang/pinapp-site.git
git push -u origin main
```

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

## Déploiement production (pinapp.fr)

- Hébergement type **Hostinger** (Apache) : uploader le contenu du dossier à la racine du domaine, en conservant **`.htaccess`** à la racine.
- ZIP complet pour Netlify manuel : `powershell -File tools\package-netlify.ps1` (voir `DEPLOIEMENT-NETLIFY.txt`).
- Vérifiez que **`/.well-known/security.txt`** est accessible en HTTPS.
- Ne déployez **jamais** `.htpasswd` ni `.env` via le dépôt : créez le fichier mot de passe **uniquement sur le serveur**.

Détails sécurité et signalement : voir **[SECURITY.md](./SECURITY.md)**.

## CI GitHub

Le workflow **Site — vérifications** contrôle la présence des fichiers critiques et l’absence de `.env` / `.htpasswd` dans le dépôt.

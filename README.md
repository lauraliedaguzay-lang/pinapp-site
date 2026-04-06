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

## Déploiement production

- Hébergement type **Hostinger** (Apache) : uploader le contenu du dossier à la racine du domaine, en conservant **`.htaccess`** à la racine.
- Vérifiez que **`/.well-known/security.txt`** est accessible en HTTPS.
- Ne déployez **jamais** `.htpasswd` ni `.env` via le dépôt : créez le fichier mot de passe **uniquement sur le serveur**.

Détails sécurité et signalement : voir **[SECURITY.md](./SECURITY.md)**.

## CI GitHub

Le workflow **Site — vérifications** contrôle la présence des fichiers critiques et l’absence de `.env` / `.htpasswd` dans le dépôt.

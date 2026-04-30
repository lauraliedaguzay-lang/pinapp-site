# PR-A Deploy Notes (Hostinger · pour opérateur / Claude en chat)

## Fichiers à placer sous `/public_html/api/`

| Fichier | Action |
|---------|--------|
| `email-template.php` | **NEW** |
| `diagnostic.php` | **UPDATE** (remplace v1) |
| `serve.php` | **NEW** |
| `uploads/.htaccess` | **NEW** (dans le dossier `uploads`) |

Branche Git : `feature/v12-prA-complete`  
Raw GitHub (adapter le SHA ou la branche) :

- `https://raw.githubusercontent.com/lauraliedaguzay-lang/pinapp-site/feature/v12-prA-complete/api/email-template.php`
- `https://raw.githubusercontent.com/lauraliedaguzay-lang/pinapp-site/feature/v12-prA-complete/api/diagnostic.php`
- `https://raw.githubusercontent.com/lauraliedaguzay-lang/pinapp-site/feature/v12-prA-complete/api/serve.php`
- `https://raw.githubusercontent.com/lauraliedaguzay-lang/pinapp-site/feature/v12-prA-complete/api/uploads/.htaccess`

Méthode éprouvée : récupérer le raw, coller dans l’éditeur ACE (hPanel), enregistrer.

## Dossiers à créer (permissions)

1. `/public_html/api/uploads/` — `chmod 0750`
2. `/public_html/api/rate-limit/` — `chmod 0750` (créé au premier passage si absent ; vérifier que PHP peut écrire)

## Secret HMAC (`PINAPP_UPLOAD_SECRET`)

Fichier **hors** `public_html`, par ex. `/home/u660645907/.pinapp-secrets.php` :

```php
<?php
define('PINAPP_UPLOAD_SECRET', 'REMPLACER_PAR_UNE_CHAINE_LONGUE_ALEATOIRE_HEX_OU_BASE64');
```

Génération possible : `openssl rand -hex 32` (ne pas commiter ce fichier).

Sans ce fichier : un **fallback dérivé** est utilisé (même valeur si `diagnostic.php` et `serve.php` identiques sur le serveur) — **à remplacer** par un secret explicite en production.

## Backup pré-déploiement

Renommer l’actuel endpoint avant écrasement :

`diagnostic.php` → `diagnostic-v1-backup.php`

## Tests post-déploiement

1. `GET https://api.pinapp.fr/diagnostic.php` → JSON `405 Method not allowed`
2. Wizard sur `pinapp.fr` sans fichier → email HTML interne + accusé HTML client
3. Soumission **avec** un petit PNG → email interne avec lien `serve.php` ; ouvrir le lien → liste des fichiers ; télécharger
4. `serve.php` avec mauvais jeton → `403`

## Rollback

Restaurer `diagnostic-v1-backup.php` en `diagnostic.php` (comportement v1 texte brut, sans upload).

## Front (GitHub Pages)

Après merge de la branche PR-A sur `main`, vérifier que `voyage-v9/index.html` charge `assets/css/pr3a-v12.css` et `assets/js/pr3a-v12.js`, et que `data-webhook-url` pointe vers `https://api.pinapp.fr/diagnostic.php`.

# Outils repo pinapp-site

## preview-v24dream.ps1

Lance un serveur local sur `http://127.0.0.1:8899/` pour prévisualiser la branche V2.4 DREAM dans un navigateur, sans déployer en prod.

### Prérequis

- PowerShell Windows
- Python 3 installé (`winget install Python.Python.3.12` sinon)
- Terminal ouvert à la racine du repo `pinapp-site`

### Usage

```powershell
.\tools\preview-v24dream.ps1
```

### Ce que ça fait

1. Bascule sur la branche `cursor/v24-step5-transitions-lightbox-df83`
2. Vérifie les 8 MP4 dans `assets/video/voyage/` et signale les manquants
3. Lance un serveur HTTP local sur le port 8899 (lié à `127.0.0.1` uniquement)
4. Ouvre le navigateur par défaut sur la preview

### Garde-fous

- Zéro modification du repo (pas de `git add` / `commit` / `push`)
- Serveur local uniquement (non exposé sur le réseau via ce script)
- Réversible : ferme le terminal ou `Stop-Job` pour arrêter

### Arrêter le serveur

Le script affiche une commande du type `Stop-Job <Id> ; Remove-Job <Id>` à la fin de l’exécution ; copie-la dans le même terminal PowerShell.

---

## commit-mp4-voyage.ps1

Place les 8 MP4 Higgsfield dans `assets/video/voyage/`, puis **`git add` uniquement ces fichiers** (pas de `git add -A`), commit, push sur `cursor/v24-step5-transitions-lightbox-df83`, et attend que la preview Netlify serve le premier MP4.

### Prérequis

- PowerShell Windows, Git configuré (push vers GitHub)
- Fichiers soit déjà nommés `01-…08-…mp4`, soit `hf_*.mp4` (ordre = date de modification croissante → chapitres 01 à 08)
- Emplacements scannés : `assets/video/voyage/`, `Downloads`, `Videos`, `Desktop`

### Usage

```powershell
.\tools\commit-mp4-voyage.ps1
```

### Ce que ça fait

1. Vérifie la racine repo et `.gitattributes` (`*.mp4 binary`)
2. Checkout + pull de la branche V2.4 DREAM
3. Résout les 8 noms ; copie depuis l’extérieur du repo si besoin (**confirmation Y/N**)
4. Avertit si poids total dépasse 100 Mo ; **stop** si total dépasse 500 Mo ou si un fichier dépasse 100 Mo (limite GitHub)
5. **`git add` fichier par fichier** sous `assets/video/voyage/`
6. Si rien à committer → message et sortie sans push
7. **Confirmation Y/N** avant commit + push
8. Push puis boucle **15 s** jusqu’à **3 min** : test `HEAD` puis `GET` range sur `…/assets/video/voyage/01-main-hologramme.mp4`
9. Ouvre la preview Netlify dans le navigateur par défaut

### Journal

Les traces vont dans `tools/logs/commit-mp4-YYYY-MM-DD.log` (dossier créé automatiquement ; les `*.log` restent ignorés par `.gitignore`).

### URL preview

Le script utilise la preview **PR #39** : `https://deploy-preview-39--stellular-liger-a492db.netlify.app/` — à mettre à jour dans le script si le numéro de déploiement Netlify change.

---

## see-preview.ps1

Ouvre uniquement la preview Netlify ci-dessus dans le navigateur par défaut (sans serveur local ni Git).

### Usage

```powershell
.\tools\see-preview.ps1
```

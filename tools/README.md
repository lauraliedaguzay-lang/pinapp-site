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

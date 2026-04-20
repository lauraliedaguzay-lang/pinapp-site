# Outils repo pinapp-site

Dépendance : **PowerShell 5.1+** (Windows 11 : OK par défaut). Utilise le **terminal intégré Cursor en mode PowerShell** — pas besoin d’un autre terminal.

---

## preview-v24dream.ps1

Serveur local sur `http://127.0.0.1:8899/` pour prévisualiser la branche V2.4 DREAM sans déployer.

### Usage

```powershell
.\tools\preview-v24dream.ps1
```

### Prérequis

- Python 3 (`winget install Python.Python.3.12` si besoin)

---

## pinapp-v24-finition.ps1

Workflow **V24 finition** en une passe : MP4 Higgsfield (`01`…`08` ou `hf_*.mp4` mappés), photos équipe vers `assets/img/team/lauralie.jpg` et `michael.jpg`, **deux commits** ciblés (jamais `git add -A`), **un seul** `git push` à la fin, sonde **HEAD** sur le MP4 `01` sur la preview Netlify (max **5 min**), ouverture du navigateur. Journal : **`tools/logs/finition-yyyy-MM-dd-HHmmss.log`**.

```powershell
.\tools\pinapp-v24-finition.ps1
```

Pour **MP4 seulement** sans photos, utiliser plutôt `commit-mp4-voyage.ps1`.

---

## commit-mp4-voyage.ps1

PowerShell **Windows natif** (pas bash, pas WSL). Trouve les MP4 voyage (**00-seedance-intro** + **01–09**), les copie dans `assets/video/voyage/`, puis **`git add` uniquement** `assets/video/voyage/*.mp4`, commit et push sur `cursor/v24-step5-transitions-lightbox-df83`, attend le redeploy Netlify (HEAD, max **5 min**), ouvre la preview.

### Usage

À la racine `pinapp-site` :

```powershell
.\tools\commit-mp4-voyage.ps1
```

### Étapes (résumé)

1. Vérifie `index.html`, **Git**, branche (propose checkout si besoin).
2. Scan : `assets/video/voyage/`, `Downloads`, `Videos`, `OneDrive\Downloads`, `OneDrive\Bureau`, `Desktop` — noms exacts **ou** `hf_*.mp4` (tri **LastWriteTime** croissant → 01…08). **Shell.Application** pour une durée indicative si possible.
3. Confirmations **Y/N** : mapping `hf_`, copies, poids total dépassant 100 Mo, commit+push.
4. Vérifie **`.gitattributes`** (`*.mp4 binary` et `*.mp4 -text`) — warning si incomplet.
5. `git status -- assets/video/voyage/` puis `git add -- assets/video/voyage/*.mp4` (jamais `git add -A`).
6. Boucle **15 s** jusqu’à **5 min** sur `HEAD` du MP4 `01` sur la preview Netlify.
7. Log : **`tools/logs/commit-mp4-yyyy-MM-dd-HHmmss.log`** (UTF-8 avec BOM).

### Limites GitHub

- Fichier dépassant **100 Mo** → arrêt.
- Total dépassant **500 Mo** → arrêt.
- Fichier dépassant **50 Mo** → avertissement HandBrake (CRF ~28).

### URL preview (PR #39)

`https://deploy-preview-39--stellular-liger-a492db.netlify.app/` — à mettre à jour dans le script si le deploy Netlify change.

---

## see-preview.ps1

Ouvre uniquement la preview Netlify ci-dessus dans le navigateur par défaut.

```powershell
.\tools\see-preview.ps1
```

---

## Fichiers ignorés

Les journaux `*.log` sous `tools/logs/` suivent la règle globale `*.log` du `.gitignore` (non versionnés).

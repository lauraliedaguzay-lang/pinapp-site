# Nettoyage des PR GitHub (à lancer en local)

`gh` doit être authentifié (`gh auth login` ou variable `GH_TOKEN`).

```bash
gh pr list --state open --limit 50
```

Pour chaque PR :

- Déjà dans `main` ou obsolète → `gh pr close <NUM> --comment "Obsolète — changements déjà dans main"`
- Utile et pas fusionné → `gh pr merge <NUM> --merge --delete-branch`

Objectif : **0 PR ouverte**.

Branches distantes fusionnées :

```bash
git fetch --prune
git checkout main
git pull origin main
```

Sous PowerShell (suppression des branches distantes déjà mergées dans `main`) :

```powershell
git branch -r --merged main |
  ForEach-Object { $_.Trim() } |
  Where-Object { $_ -match '^origin/' -and $_ -notmatch 'origin/main$' -and $_ -notmatch 'origin/HEAD' } |
  ForEach-Object { $b = $_ -replace '^origin/', ''; git push origin --delete $b }
```

Vérifier avant d’exécuter la boucle : certaines branches protégées peuvent refuser la suppression.

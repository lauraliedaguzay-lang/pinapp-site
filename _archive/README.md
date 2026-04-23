# \_archive/

Dossier d'archive pour les artefacts legacy qui ne sont plus utilisés activement
mais qu'on conserve par sécurité (restauration facile, traçabilité).

## `_archive/scripts/`

31 scripts PowerShell (`.ps1`) historiques, déplacés ici lors de la refonte V2
« Bioluminescence Avalon » (branche `v2-bioluminescence-avalon`).

### Pourquoi archiver plutôt que supprimer

- Certains scripts déploient sur Hostinger / pushent sur GitHub — au cas où un
  workflow local Lauralie les appelle encore en quotidien.
- L'historique Git les conserve de toute façon, mais garder le fichier à portée
  évite un `git log --diff-filter=D` pour restaurer.
- Les scripts `*.EXAMPLE.ps1` sont des gabarits pour secrets locaux
  (ne jamais committer les versions remplies).

### Restaurer un script

```bash
git mv _archive/scripts/<nom-du-script>.ps1 scripts/<nom-du-script>.ps1
git commit -m "chore: restore scripts/<nom-du-script>.ps1 from archive"
```

### Scripts archivés (snapshot avril 2026)

- `EXEC-PINAPP.ps1`
- `deploy-pinapp-fr.ps1`, `deploy-pinapp-fr-api.ps1`
- `pinapp-applique-tout.ps1`, `pinapp-install-complet.ps1`,
  `pinapp-orchestrate.ps1`, `pinapp-master-final-v4.ps1`,
  `pinapp-correctif-master-v3.ps1`, `pinapp-correctif-v2.ps1`,
  `pinapp-conformite.ps1`, `pinapp-fix-all.ps1`, `pinapp-fix-mobile.ps1`,
  `pinapp-da-finale.ps1`, `pinapp-dev.ps1`, `pinapp-dormir.ps1`,
  `pinapp-local.ps1`, `pinapp-formulaire-diagnostic.ps1`,
  `pinapp-automation-connect.ps1`, `pinapp-merge-deploy-main.ps1`,
  `pinapp-pr.ps1`, `pinapp-publie.ps1`, `pinapp-relie-tout.ps1`,
  `pinapp-reparation.ps1`
- `pandora-audit-fix.ps1`, `pandora-design.ps1`, `pandora-tdah-site.ps1`
- `*.EXAMPLE.ps1` (gabarits secrets locaux) — à garder comme exemples

Total : **31 fichiers `.ps1`**.

Les scripts `.mjs` / `.py` (outils de build côté Node/Python) restent dans
`scripts/` car utilisés par les pipelines actuels.

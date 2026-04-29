# DEPLOY-NOW.ps1 — pousse les 3 fixes vidéo sur main
# Usage : clic droit → Exécuter avec PowerShell

$ErrorActionPreference = "Stop"

Set-Location "C:\Users\Lauralie\Projects\pinapp-site"

Write-Host "[1/7] Fetch origin main..." -ForegroundColor Cyan
git fetch origin main

Write-Host "[2/7] Sauvegarde du commit local 35c74ad (decision-council) dans branche backup..." -ForegroundColor Cyan
git branch backup-35c74ad-local 2>$null
Write-Host "  → branch backup-35c74ad-local créée (ou déjà existante, OK)"

Write-Host "[3/7] Sauvegarde du fichier modifié (V5 + 3 fixes)..." -ForegroundColor Cyan
Copy-Item "voyage-v9\index.html" "voyage-v9\index.html.NEW" -Force
$lines = (Get-Content "voyage-v9\index.html.NEW" | Measure-Object -Line).Lines
Write-Host "  → fichier sauvegardé : $lines lignes"

Write-Host "[4/7] Reset HEAD local + working tree vers origin/main (V5 propre)..." -ForegroundColor Cyan
git reset --hard origin/main

Write-Host "[5/7] Restaure le fichier modifié par-dessus..." -ForegroundColor Cyan
Move-Item -Force "voyage-v9\index.html.NEW" "voyage-v9\index.html"

Write-Host "[6/7] Diff vs origin/main (devrait montrer ~120 lignes ajoutées CSS/HTML soft-video)..." -ForegroundColor Cyan
git diff --stat voyage-v9/index.html

Write-Host "[7/7] Commit + push direct sur main..." -ForegroundColor Cyan
git add voyage-v9/index.html
git commit -m "voyage-v9: soft placeholders s01 (Pinapp 60s) + s08 (Lauralie chante) visibles par defaut + placeholders draft compacts"
git push origin main

$shortHash = (git rev-parse --short HEAD).Trim()

Write-Host ""
Write-Host "=========================================" -ForegroundColor Green
Write-Host "  DEPLOIEMENT REUSSI" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Commit : $shortHash" -ForegroundColor Yellow
Write-Host ""
Write-Host "URL live (rechargement dur Ctrl+F5) :" -ForegroundColor Yellow
Write-Host "https://pinapp.fr/voyage-v9/?v=$shortHash" -ForegroundColor White
Write-Host ""
Write-Host "GitHub Pages deploie en 2-3 minutes." -ForegroundColor Cyan
Write-Host ""
Write-Host "Verifications :" -ForegroundColor Cyan
Write-Host "  - s01 (hero) : card video doree avec play icon + badge 'Bientot'"
Write-Host "  - s08 (climax) : card cinema cyan-or avec badge 'En production'"
Write-Host "  - Ctrl+D : autres placeholders Micha apparaissent compacts"
Write-Host ""
Write-Host "Si rollback necessaire : git reset --hard backup-35c74ad-local && git push -f origin main" -ForegroundColor DarkGray
Write-Host ""
Read-Host "Appuie sur Entree pour fermer cette fenetre"

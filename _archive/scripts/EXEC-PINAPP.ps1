# Une seule commande : tout preparer + ouvrir le site en LOCAL dans le navigateur.
# Double-clic ou : pwsh -File .\EXEC-PINAPP.ps1
# (Le site public pinapp.fr ne bouge pas tant que tu ne pousses pas sur GitHub ou Hostinger.)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$PinappRepoRoot = Split-Path $PSScriptRoot -Parent
Set-Location -LiteralPath $PinappRepoRoot

$env:PINAPP_SKIP_DEPLOY = '1'

Write-Host "`n[1/3] Pandora design (CSS + JS)..." -ForegroundColor Cyan
& pwsh -NoProfile -ExecutionPolicy Bypass -File (Join-Path $PSScriptRoot 'pandora-design.ps1') -SkipDeploy

Write-Host "`n[2/3] Audit fix (copy)..." -ForegroundColor Cyan
& pwsh -NoProfile -ExecutionPolicy Bypass -File (Join-Path $PSScriptRoot 'pandora-audit-fix.ps1') -SkipDeploy

Write-Host "`n[3/3] TDAH (modale)..." -ForegroundColor Cyan
& pwsh -NoProfile -ExecutionPolicy Bypass -File (Join-Path $PSScriptRoot 'pandora-tdah-site.ps1') -SkipDeploy

Remove-Item Env:\PINAPP_SKIP_DEPLOY -ErrorAction SilentlyContinue

Write-Host "`n========================================" -ForegroundColor Green
Write-Host " PRET. Ouvre cette adresse dans Chrome :" -ForegroundColor Green
Write-Host " http://127.0.0.1:5173/index.html" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Green
Write-Host "Le serveur demarre ; Ctrl+C pour arreter.`n" -ForegroundColor DarkGray

& npx --yes vite --host 127.0.0.1 --port 5173 --open /index.html

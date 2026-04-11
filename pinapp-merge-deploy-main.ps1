#requires -Version 5.1
<#
.SYNOPSIS
  Fusionne la branche courante dans main et pousse (declenche GitHub Actions / Pages).
.DESCRIPTION
  A lancer depuis la racine du depot, sur la branche a fusionner (ex. cursor/fr-auto-hostinger-diagnostics).
  git push origin main declenche le deploiement Pages + job pinapp.fr.
.EXAMPLE
  cd $env:USERPROFILE\Projects\pinapp-site
  .\pinapp-merge-deploy-main.ps1
#>
$ErrorActionPreference = 'Stop'
if (-not $PSScriptRoot) {
    Write-Error 'Lance comme fichier .ps1'
}
Set-Location -LiteralPath $PSScriptRoot
$feature = git branch --show-current
if (-not $feature) {
    Write-Error 'Branche courante inconnue'
}
Write-Host ('Branche source : ' + $feature) -ForegroundColor Cyan
Write-Host 'git fetch...' -ForegroundColor Gray
git fetch origin
Write-Host 'checkout main...' -ForegroundColor Gray
git checkout main
git pull --ff-only origin main
Write-Host ('merge ' + $feature + '...') -ForegroundColor Gray
git merge $feature --no-edit -m "merge: pinapp.fr deploy + automation ($feature)"
Write-Host 'push origin main...' -ForegroundColor Gray
git push origin main
Write-Host 'OK. Actions : deploiement Pages + sync pinapp.fr (secret HOSTINGER_API_TOKEN).' -ForegroundColor Green
git checkout $feature

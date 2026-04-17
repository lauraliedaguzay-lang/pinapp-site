#requires -Version 5.1
<#
.SYNOPSIS
  Declenche le workflow GitHub Actions qui applique pinapp.fr en API (sans jetons locaux).
.DESCRIPTION
  Meme logique que fr-auto / deploy-pinapp-fr.ps1, mais les appels REST s executent sur GitHub.
  Preconditions :
    - Secret repo : HOSTINGER_API_TOKEN (hPanel > API)
    - Branche poussee : ce fichier et .github/workflows/pinapp-fr-api.yml sur la branche par defaut
  Avec GitHub CLI authentifie : lance le workflow. Sinon : affiche l URL Actions.
.EXAMPLE
  cd $env:USERPROFILE\Projects\pinapp-site
  .\deploy-pinapp-fr-api.ps1
#>
$ErrorActionPreference = 'Stop'
$PinappRepoRoot = Split-Path $PSScriptRoot -Parent
Set-Location -LiteralPath $PinappRepoRoot

$repo = 'lauraliedaguzay-lang/pinapp-site'
$wfFile = 'pinapp-fr-api.yml'
$url = 'https://github.com/' + $repo + '/actions/workflows/' + $wfFile

$gh = Get-Command gh -ErrorAction SilentlyContinue
if (-not $gh) {
    Write-Host 'gh introuvable. Ouvre Actions et lance le workflow manuellement :' -ForegroundColor Yellow
    Write-Host ('  ' + $url) -ForegroundColor White
    Write-Host 'Secret requis sur le depot : HOSTINGER_API_TOKEN' -ForegroundColor DarkGray
    exit 0
}

Write-Host ('Declenchement workflow : ' + $wfFile) -ForegroundColor Cyan
& gh workflow run $wfFile --repo $repo
if ($LASTEXITCODE -ne 0) {
    Write-Host 'Echec gh workflow run. Ouvre :' -ForegroundColor Yellow
    Write-Host ('  ' + $url) -ForegroundColor White
    exit $LASTEXITCODE
}
Write-Host 'OK. Suivi : gh run watch (ou onglet Actions sur GitHub).' -ForegroundColor Green
Write-Host ('  ' + $url) -ForegroundColor DarkGray

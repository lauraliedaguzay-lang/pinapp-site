#requires -Version 5.1
<#
.SYNOPSIS
  Avant de dormir : build OK + liens pour rendre pinapp.fr fonctionnel (DNS + depot).
.PARAMETER NoBrowser
  N ouvre pas le navigateur (seulement le texte a suivre).
.NOTES
  pinapp.fr ne peut pas marcher tant que les DNS chez Hostinger ne pointent pas vers GitHub Pages.
  Sans jeton : fusion PR sur main + secret HOSTINGER_API_TOKEN sur GitHub declenche tout au prochain workflow.
#>
[CmdletBinding()]
param([switch] $NoBrowser)

$ErrorActionPreference = 'Continue'
$env:Path = [Environment]::GetEnvironmentVariable('Path', 'Machine') + ';' + [Environment]::GetEnvironmentVariable('Path', 'User')
$PinappRepoRoot = Split-Path $PSScriptRoot -Parent
Set-Location -LiteralPath $PinappRepoRoot

$ownerRepo = 'lauraliedaguzay-lang/pinapp-site'
$secretsUrl = 'https://github.com/' + $ownerRepo + '/settings/secrets/actions'
$prUrl = 'https://github.com/' + $ownerRepo + '/compare/main...cursor/fr-auto-hostinger-diagnostics?expand=1'
$actionsUrl = 'https://github.com/' + $ownerRepo + '/actions'
$hpanelDns = 'https://hpanel.hostinger.com/'

Write-Host ''
Write-Host '=== pinapp-dormir : build local ===' -ForegroundColor Cyan
& (Join-Path $PinappRepoRoot 'pinapp.ps1') ship
if (-not $?) {
    Write-Host 'ship a echoue — corrige avant de dormir.' -ForegroundColor Red
    exit 1
}

Write-Host ''
Write-Host '=== Ce qui manque pour pinapp.fr (une fois)' -ForegroundColor Yellow
Write-Host '  1) Fusionner la PR vers main (ouvre le lien ci-dessous).' -ForegroundColor White
Write-Host '  2) Repo > Settings > Secrets > Actions : ajouter HOSTINGER_API_TOKEN (jeton API hPanel).' -ForegroundColor White
Write-Host '     Au merge, le workflow Deployer GitHub Pages rebuild + met les DNS + declare le domaine sur Pages.' -ForegroundColor DarkGray
Write-Host '  3) Sans secret GitHub : DNS manuel hPanel (4x A @ GitHub + CNAME www) - voir .\pinapp.ps1 dns' -ForegroundColor White
Write-Host ''
Write-Host 'Liens :' -ForegroundColor Cyan
Write-Host ('  PR / merge : ' + $prUrl) -ForegroundColor Gray
Write-Host ('  Secrets    : ' + $secretsUrl) -ForegroundColor Gray
Write-Host ('  Actions    : ' + $actionsUrl) -ForegroundColor Gray
Write-Host ('  hPanel     : ' + $hpanelDns) -ForegroundColor Gray
Write-Host ''

if (-not $NoBrowser) {
    Start-Process $prUrl
    Start-Process $secretsUrl
}

Write-Host 'Bonne nuit. Demain : merge + secret (2 min), puis 15 min a 48 h de DNS.' -ForegroundColor Green
Write-Host ''

#requires -Version 5.1
<#
.SYNOPSIS
  Point d entree PowerShell pour le depot pinapp-site (tout en PowerShell).

.DESCRIPTION
  Depuis la racine du depot :  .\tools\Pinapp.ps1 <commande>

.PARAMETER Command
  pull | install | ci | build | domain | dns | status | check | help

.EXAMPLE
  cd $env:USERPROFILE\Projects\pinapp-site
  .\tools\Pinapp.ps1 pull
  .\tools\Pinapp.ps1 ci
  .\tools\Pinapp.ps1 domain

.NOTES
  Les scripts doivent etre lances comme fichiers .ps1 (pas de copier-coller ligne par ligne).
#>
[CmdletBinding()]
param(
    [Parameter(Position = 0)]
    [ValidateSet('pull', 'install', 'ci', 'build', 'domain', 'dns', 'status', 'check', 'help')]
    [string] $Command = 'help'
)

$ErrorActionPreference = 'Stop'

if (-not $PSScriptRoot) {
    Write-Error 'Lance ce fichier avec : .\tools\Pinapp.ps1 (depuis la racine du depot).'
}

$RepoRoot = Split-Path -Parent $PSScriptRoot
$DomainScript = Join-Path $PSScriptRoot 'pinapp-fr-domaine.ps1'

function Write-PinappHelp {
    Write-Host ''
    Write-Host 'Pinapp - commandes PowerShell (defaut Windows)' -ForegroundColor Cyan
    Write-Host '  Depuis npm : npm run pinapp -- <commande>   (ex. npm run pinapp -- check)' -ForegroundColor DarkGray
    Write-Host ''
    Write-Host '  .\tools\Pinapp.ps1 pull     - git pull' -ForegroundColor White
    Write-Host '  .\tools\Pinapp.ps1 install - npm install' -ForegroundColor White
    Write-Host '  .\tools\Pinapp.ps1 ci      - npm run ci (Prettier + verify)' -ForegroundColor White
    Write-Host '  .\tools\Pinapp.ps1 build   - npm run build (_site)' -ForegroundColor White
    Write-Host '  .\tools\Pinapp.ps1 domain  - domaine GitHub Pages (menu interactif)' -ForegroundColor White
    Write-Host '  .\tools\Pinapp.ps1 dns     - instructions DNS seulement' -ForegroundColor White
    Write-Host '  .\tools\Pinapp.ps1 status  - git status -sb' -ForegroundColor White
    Write-Host '  .\tools\Pinapp.ps1 check   - pull + install + ci + build' -ForegroundColor White
    Write-Host ''
}

Set-Location -LiteralPath $RepoRoot

switch ($Command) {
    'help' { Write-PinappHelp }
    'pull' {
        Write-Host 'git pull --ff-only...' -ForegroundColor Gray
        git pull --ff-only
    }
    'install' {
        Write-Host 'npm install...' -ForegroundColor Gray
        npm install
    }
    'ci' {
        Write-Host 'npm run ci...' -ForegroundColor Gray
        npm run ci
    }
    'build' {
        Write-Host 'npm run build...' -ForegroundColor Gray
        npm run build
    }
    'domain' {
        & $DomainScript
    }
    'dns' {
        & $DomainScript -DnsOnly
    }
    'status' {
        git status -sb
    }
    'check' {
        Write-Host '=== check : pull ===' -ForegroundColor Cyan
        git pull --ff-only
        Write-Host '=== check : npm install ===' -ForegroundColor Cyan
        npm install
        Write-Host '=== check : npm run ci ===' -ForegroundColor Cyan
        npm run ci
        Write-Host '=== check : npm run build ===' -ForegroundColor Cyan
        npm run build
        Write-Host '=== check : OK ===' -ForegroundColor Green
    }
}

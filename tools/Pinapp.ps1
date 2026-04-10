#requires -Version 5.1
<#
.SYNOPSIS
  Point d entree PowerShell pour le depot pinapp-site (tout en PowerShell).

.DESCRIPTION
  Depuis la racine du depot :  .\tools\Pinapp.ps1 <commande>

.PARAMETER Command
  pull | install | ci | build | domain | dns | auth | urls | probe | status | check | help

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
    [ValidateSet('pull', 'install', 'ci', 'build', 'domain', 'dns', 'auth', 'urls', 'probe', 'status', 'check', 'help')]
    [string] $Command = 'help'
)

$ErrorActionPreference = 'Stop'

if (-not $PSScriptRoot) {
    Write-Error 'Lance ce fichier avec : .\tools\Pinapp.ps1 (depuis la racine du depot).'
}

$RepoRoot = Split-Path -Parent $PSScriptRoot
$DomainScript = Join-Path $PSScriptRoot 'pinapp-fr-domaine.ps1'

function Invoke-PinappHttpProbe {
    param(
        [string] $Label,
        [string] $Uri
    )
    try {
        try {
            $r = Invoke-WebRequest -Uri $Uri -Method Head -MaximumRedirection 5 -TimeoutSec 20 -UseBasicParsing -ErrorAction Stop
        } catch {
            $r = Invoke-WebRequest -Uri $Uri -Method Get -MaximumRedirection 5 -TimeoutSec 20 -UseBasicParsing -ErrorAction Stop
        }
        Write-Host ($Label + ' : HTTP ' + [int]$r.StatusCode) -ForegroundColor Green
    } catch {
        $resp = $_.Exception.Response
        if ($resp -and $resp.StatusCode) {
            Write-Host ($Label + ' : HTTP ' + [int]$resp.StatusCode) -ForegroundColor Yellow
        } else {
            Write-Host ($Label + ' : ' + $_.Exception.Message) -ForegroundColor Red
        }
    }
}

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
    Write-Host '  .\tools\Pinapp.ps1 auth    - gh auth status (CLI GitHub)' -ForegroundColor White
    Write-Host '  .\tools\Pinapp.ps1 urls    - liens Pages / depot / domaine' -ForegroundColor White
    Write-Host '  .\tools\Pinapp.ps1 probe   - test HTTP Pages + pinapp.fr' -ForegroundColor White
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
    'auth' {
        $gh = Get-Command gh -ErrorAction SilentlyContinue
        if (-not $gh) {
            Write-Host 'gh (GitHub CLI) introuvable. Installe-le puis : gh auth login' -ForegroundColor Yellow
            Write-Host '  winget install GitHub.cli' -ForegroundColor White
            exit 1
        }
        & gh auth status
    }
    'urls' {
        Write-Host ''
        Write-Host 'Liens utiles (pinapp-site)' -ForegroundColor Cyan
        Write-Host '  Site Pages : https://lauraliedaguzay-lang.github.io/pinapp-site/' -ForegroundColor White
        Write-Host '  Domaine    : https://pinapp.fr/' -ForegroundColor White
        Write-Host '  Pages repo : https://github.com/lauraliedaguzay-lang/pinapp-site/settings/pages' -ForegroundColor White
        Write-Host '  DNS script : .\tools\Pinapp.ps1 dns' -ForegroundColor DarkGray
        Write-Host ''
    }
    'probe' {
        Write-Host ''
        Write-Host 'Sonde HTTP (HEAD puis GET si besoin)...' -ForegroundColor Cyan
        Invoke-PinappHttpProbe -Label 'GitHub Pages' -Uri 'https://lauraliedaguzay-lang.github.io/pinapp-site/'
        Invoke-PinappHttpProbe -Label 'pinapp.fr' -Uri 'https://pinapp.fr/'
        Write-Host ''
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

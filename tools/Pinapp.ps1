#requires -Version 5.1
<#
.SYNOPSIS
  Point d entree PowerShell pour le depot pinapp-site (tout en PowerShell).

.DESCRIPTION
  Depuis la racine du depot :  .\pinapp.ps1 <commande>   (recommande)
  ou  .\tools\Pinapp.ps1 <commande>

.PARAMETER Command
  pull | install | dev | serve | preview | ci | build | verify | ship | clean | format | format-check | info | 403 | diagnose-fr | corrige-fr | sync-fr | dns-hostinger | domain | dns | pages | auth | urls | probe | open | actions | repo | suite | status | check | help

.EXAMPLE
  cd $env:USERPROFILE\Projects\pinapp-site
  .\pinapp.ps1 suite
  .\tools\Pinapp.ps1 pull
  .\tools\Pinapp.ps1 ci
  .\tools\Pinapp.ps1 domain

.NOTES
  Les scripts doivent etre lances comme fichiers .ps1 (pas de copier-coller ligne par ligne).
#>
[CmdletBinding()]
param(
    [Parameter(Position = 0)]
    [ValidateSet('pull', 'install', 'dev', 'serve', 'preview', 'ci', 'build', 'verify', 'ship', 'clean', 'format', 'format-check', 'info', '403', 'diagnose-fr', 'corrige-fr', 'sync-fr', 'dns-hostinger', 'domain', 'dns', 'pages', 'auth', 'urls', 'probe', 'open', 'actions', 'repo', 'suite', 'status', 'check', 'help')]
    [string] $Command = 'help'
)

$ErrorActionPreference = 'Stop'

if (-not $PSScriptRoot) {
    Write-Error 'Lance ce fichier avec : .\tools\Pinapp.ps1 (depuis la racine du depot).'
}

$RepoRoot = Split-Path -Parent $PSScriptRoot
$DomainScript = Join-Path $PSScriptRoot 'pinapp-fr-domaine.ps1'
$DevHttpScript = Join-Path $PSScriptRoot 'dev-http.ps1'
$HostingerDnsScript = Join-Path $PSScriptRoot 'hostinger-dns-github-pages.ps1'
$PinappSelf = Join-Path $PSScriptRoot 'Pinapp.ps1'
$PagesSettingsUrl = 'https://github.com/lauraliedaguzay-lang/pinapp-site/settings/pages'
$GitHubRepoUrl = 'https://github.com/lauraliedaguzay-lang/pinapp-site'
$GitHubActionsUrl = 'https://github.com/lauraliedaguzay-lang/pinapp-site/actions'

function Get-PinappLocalHttpPort {
    $defaultPort = 8899
    $raw = $env:PINAPP_HTTP_PORT
    if ([string]::IsNullOrWhiteSpace($raw)) {
        return $defaultPort
    }
    if ($raw -match '^\d+$') {
        $p = [int]$raw
        if ($p -ge 1024 -and $p -le 65535) {
            return $p
        }
    }
    Write-Warning ('PINAPP_HTTP_PORT="' + $raw + '" ignore (entier 1024-65535 attendu). Port ' + $defaultPort + '.')
    return $defaultPort
}

function Test-PinappAffirmative {
    param([string] $Prompt)
    $c = Read-Host $Prompt
    if (-not $c) { return $false }
    $t = $c.Trim().ToLowerInvariant()
    return ($t -eq 'o' -or $t -eq 'oui' -or $t -eq 'y' -or $t -eq 'yes')
}

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
    Write-Host '  Racine du depot : .\pinapp.ps1 <commande>   (recommande)' -ForegroundColor White
    Write-Host '  Alternative npm : npm run pinapp -- <commande>' -ForegroundColor DarkGray
    Write-Host ''
    Write-Host '  .\pinapp.ps1 pull         - git pull' -ForegroundColor White
    Write-Host '  .\pinapp.ps1 install      - npm install' -ForegroundColor White
    Write-Host '  .\pinapp.ps1 dev          - npm run dev (Vite, laisser le terminal ouvert)' -ForegroundColor White
    Write-Host '  .\pinapp.ps1 serve        - HTTP local sources (defaut port 8899, Ctrl+C arrete)' -ForegroundColor White
    Write-Host '  .\pinapp.ps1 preview      - HTTP local _site (meme port ; PINAPP_HTTP_PORT pour changer)' -ForegroundColor White
    Write-Host '  .\pinapp.ps1 ci           - npm run ci (Prettier + verify)' -ForegroundColor White
    Write-Host '  .\pinapp.ps1 verify       - npm run verify (fichiers critiques, sans Prettier)' -ForegroundColor White
    Write-Host '  .\pinapp.ps1 ship         - ci + build (avant git push)' -ForegroundColor White
    Write-Host '  .\pinapp.ps1 clean        - supprime le dossier _site' -ForegroundColor White
    Write-Host '  .\pinapp.ps1 format       - npm run format (Prettier --write)' -ForegroundColor White
    Write-Host '  .\pinapp.ps1 format-check - npm run format:check' -ForegroundColor White
    Write-Host '  .\pinapp.ps1 build        - npm run build (_site)' -ForegroundColor White
    Write-Host '  .\pinapp.ps1 info         - Node / npm / git / dossier courant' -ForegroundColor White
    Write-Host '  .\pinapp.ps1 403          - alias : diagnostic 403 pinapp.fr (voir diagnose-fr)' -ForegroundColor White
    Write-Host '  .\pinapp.ps1 diagnose-fr  - DNS + HTTP pinapp.fr + instructions Hostinger' -ForegroundColor White
    Write-Host '  .\pinapp.ps1 corrige-fr   - diagnostic puis API GitHub (DNS Hostinger a la main)' -ForegroundColor White
    Write-Host '  .\pinapp.ps1 sync-fr      - assistant : diagnostic puis API Hostinger + GitHub (o/N)' -ForegroundColor White
    Write-Host '  .\pinapp.ps1 dns-hostinger - DNS via API Hostinger (HOSTINGER_API_TOKEN)' -ForegroundColor White
    Write-Host '  .\pinapp.ps1 domain       - domaine GitHub Pages (menu interactif)' -ForegroundColor White
    Write-Host '  .\pinapp.ps1 dns          - instructions DNS seulement' -ForegroundColor White
    Write-Host '  .\pinapp.ps1 pages        - lire statut GitHub Pages (API, jeton requis)' -ForegroundColor White
    Write-Host '  .\pinapp.ps1 auth         - gh auth status (CLI GitHub)' -ForegroundColor White
    Write-Host '  .\pinapp.ps1 urls         - liens Pages / depot / domaine' -ForegroundColor White
    Write-Host '  .\pinapp.ps1 probe        - test HTTP Pages + pinapp.fr + www' -ForegroundColor White
    Write-Host '  .\pinapp.ps1 open         - ouvrir reglages Pages sur GitHub (navigateur)' -ForegroundColor White
    Write-Host '  .\pinapp.ps1 actions      - ouvrir Actions GitHub du depot' -ForegroundColor White
    Write-Host '  .\pinapp.ps1 repo         - ouvrir la page du depot sur GitHub' -ForegroundColor White
    Write-Host '  .\pinapp.ps1 suite        - dns + urls + probe + rappel API domaine' -ForegroundColor White
    Write-Host '  .\pinapp.ps1 status       - git status -sb' -ForegroundColor White
    Write-Host '  .\pinapp.ps1 check        - pull + install + ci + build' -ForegroundColor White
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
    'dev' {
        Write-Host 'npm run dev (Vite)...' -ForegroundColor Gray
        npm run dev
    }
    'serve' {
        $httpPort = Get-PinappLocalHttpPort
        $url = 'http://127.0.0.1:' + $httpPort + '/'
        Write-Host ('Serveur HTTP local (sources du depot) : ' + $url) -ForegroundColor Cyan
        Write-Host 'Ctrl+C pour arreter.' -ForegroundColor DarkGray
        & $DevHttpScript -Port $httpPort
    }
    'preview' {
        $httpPort = Get-PinappLocalHttpPort
        $url = 'http://127.0.0.1:' + $httpPort + '/'
        Write-Host ('Serveur HTTP local (_site) : ' + $url) -ForegroundColor Cyan
        Write-Host 'Ctrl+C pour arreter.' -ForegroundColor DarkGray
        & $DevHttpScript -Built -Port $httpPort
    }
    'ci' {
        Write-Host 'npm run ci...' -ForegroundColor Gray
        npm run ci
    }
    'verify' {
        Write-Host 'npm run verify...' -ForegroundColor Gray
        npm run verify
    }
    'ship' {
        Write-Host '=== ship : npm run ci ===' -ForegroundColor Cyan
        npm run ci
        Write-Host '=== ship : npm run build ===' -ForegroundColor Cyan
        npm run build
        Write-Host '=== ship : OK (pret a pousser) ===' -ForegroundColor Green
    }
    'clean' {
        $siteDir = Join-Path $RepoRoot '_site'
        if (Test-Path -LiteralPath $siteDir) {
            Remove-Item -LiteralPath $siteDir -Recurse -Force
            Write-Host 'Dossier _site supprime.' -ForegroundColor Green
        } else {
            Write-Host 'Pas de dossier _site a supprimer.' -ForegroundColor Gray
        }
    }
    'build' {
        Write-Host 'npm run build...' -ForegroundColor Gray
        npm run build
    }
    'format' {
        Write-Host 'npm run format...' -ForegroundColor Gray
        npm run format
    }
    'format-check' {
        Write-Host 'npm run format:check...' -ForegroundColor Gray
        npm run format:check
    }
    'info' {
        Write-Host ''
        Write-Host 'Environnement (pinapp-site)' -ForegroundColor Cyan
        Write-Host ('  Dossier : ' + $RepoRoot) -ForegroundColor Gray
        $nodeCmd = Get-Command node -ErrorAction SilentlyContinue
        $npmCmd = Get-Command npm -ErrorAction SilentlyContinue
        $gitCmd = Get-Command git -ErrorAction SilentlyContinue
        if ($nodeCmd) {
            $nv = & node -v 2>$null
            Write-Host ('  Node : ' + $nv) -ForegroundColor White
        } else {
            Write-Host '  Node : (introuvable dans PATH)' -ForegroundColor Yellow
        }
        if ($npmCmd) {
            $pm = & npm -v 2>$null
            Write-Host ('  npm  : ' + $pm) -ForegroundColor White
        } else {
            Write-Host '  npm  : (introuvable dans PATH)' -ForegroundColor Yellow
        }
        if ($gitCmd) {
            $gv = (& git --version 2>$null | Out-String).Trim()
            Write-Host ('  ' + $gv) -ForegroundColor White
        } else {
            Write-Host '  git  : (introuvable dans PATH)' -ForegroundColor Yellow
        }
        Write-Host ''
    }
    '403' {
        & $DomainScript -Diagnose
        Write-Host 'Ensuite : DNS dans hPanel (4x A GitHub), puis avec gh connecte :' -ForegroundColor Cyan
        Write-Host '  .\pinapp.ps1 corrige-fr' -ForegroundColor White
        Write-Host ''
    }
    'diagnose-fr' {
        & $DomainScript -Diagnose
    }
    'corrige-fr' {
        & $DomainScript -Repair
    }
    'sync-fr' {
        Write-Host ''
        Write-Host '=== Synchro pinapp.fr (assistant PowerShell) ===' -ForegroundColor Cyan
        Write-Host 'Jetons : HOSTINGER_API_TOKEN (hPanel API) ; GitHub via gh ou GITHUB_TOKEN' -ForegroundColor DarkGray
        Write-Host ''
        & $DomainScript -Diagnose
        Write-Host '--- Etape A : DNS Hostinger (API) ---' -ForegroundColor Cyan
        if ($env:HOSTINGER_API_TOKEN) {
            if (Test-PinappAffirmative -Prompt 'Appliquer A GitHub + CNAME www via API Hostinger ? (o/N)') {
                & $HostingerDnsScript -Force -NonInteractive
            } else {
                Write-Host 'Etape A annulee.' -ForegroundColor Gray
            }
        } else {
            Write-Host 'HOSTINGER_API_TOKEN absent : etape A sautee. Definis le token ou DNS manuel (voir ci-dessus).' -ForegroundColor Yellow
        }
        Write-Host ''
        Write-Host '--- Etape B : domaine GitHub Pages (API) ---' -ForegroundColor Cyan
        if (Test-PinappAffirmative -Prompt 'Declarer pinapp.fr sur GitHub Pages (Repair) ? (o/N)') {
            & $DomainScript -Repair
        } else {
            Write-Host 'Etape B annulee. Plus tard : .\pinapp.ps1 corrige-fr' -ForegroundColor Gray
        }
        Write-Host ''
        Write-Host 'Apres propagation DNS : .\pinapp.ps1 diagnose-fr' -ForegroundColor Cyan
        Write-Host ''
    }
    'dns-hostinger' {
        Write-Host 'Jeton : $env:HOSTINGER_API_TOKEN (hPanel > API, voir developers.hostinger.com)' -ForegroundColor DarkGray
        Write-Host 'Options (-WhatIf, -GetOnly, -ApexOnly, -Force) : lancer le script directement :' -ForegroundColor DarkGray
        Write-Host '  .\tools\hostinger-dns-github-pages.ps1 -WhatIf' -ForegroundColor White
        Write-Host ''
        & $HostingerDnsScript
    }
    'domain' {
        & $DomainScript
    }
    'dns' {
        & $DomainScript -DnsOnly
    }
    'pages' {
        & $DomainScript -Status
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
        Write-Host ('  Depot      : ' + $GitHubRepoUrl) -ForegroundColor White
        Write-Host ('  Actions    : ' + $GitHubActionsUrl) -ForegroundColor White
        Write-Host ('  Pages repo : ' + $PagesSettingsUrl) -ForegroundColor White
        Write-Host '  DNS : .\pinapp.ps1 dns' -ForegroundColor DarkGray
        Write-Host ''
    }
    'probe' {
        Write-Host ''
        Write-Host 'Sonde HTTP (HEAD puis GET si besoin)...' -ForegroundColor Cyan
        Invoke-PinappHttpProbe -Label 'GitHub Pages' -Uri 'https://lauraliedaguzay-lang.github.io/pinapp-site/'
        Invoke-PinappHttpProbe -Label 'pinapp.fr' -Uri 'https://pinapp.fr/'
        Invoke-PinappHttpProbe -Label 'www.pinapp.fr' -Uri 'https://www.pinapp.fr/'
        Write-Host ''
    }
    'open' {
        Write-Host ('Ouverture : ' + $PagesSettingsUrl) -ForegroundColor Cyan
        Start-Process $PagesSettingsUrl
    }
    'actions' {
        Write-Host ('Ouverture : ' + $GitHubActionsUrl) -ForegroundColor Cyan
        Start-Process $GitHubActionsUrl
    }
    'repo' {
        Write-Host ('Ouverture : ' + $GitHubRepoUrl) -ForegroundColor Cyan
        Start-Process $GitHubRepoUrl
    }
    'suite' {
        Write-Host ''
        Write-Host '=== Pinapp : suite domaine (PowerShell) ===' -ForegroundColor Cyan
        Write-Host ''
        & $DomainScript -DnsOnly -Quiet
        Write-Host ''
        & $PinappSelf urls
        & $PinappSelf probe
        Write-Host 'Enregistrer le domaine sur GitHub (API ou UI) :' -ForegroundColor Cyan
        Write-Host '  .\pinapp.ps1 sync-fr   |   diagnose-fr   |   corrige-fr' -ForegroundColor White
        Write-Host '  .\pinapp.ps1 domain' -ForegroundColor White
        Write-Host '  .\pinapp.ps1 open' -ForegroundColor White
        Write-Host '  .\pinapp.ps1 pages' -ForegroundColor White
        Write-Host '  .\pinapp.ps1 actions   |   .\pinapp.ps1 repo' -ForegroundColor White
        Write-Host '  $env:GITHUB_TOKEN = gh auth token; .\tools\pinapp-fr-domaine.ps1 -NonInteractive' -ForegroundColor DarkGray
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

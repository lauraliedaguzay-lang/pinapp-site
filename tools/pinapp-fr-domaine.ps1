#requires -Version 5.1
<#
.SYNOPSIS
  Declarer pinapp.fr sur GitHub Pages (REST API) et afficher les DNS Hostinger.

.DESCRIPTION
  Jeton : $env:GITHUB_TOKEN, ou 'gh auth token', ou menu interactif (PAT / DNS seulement / quitter).

.PARAMETER NonInteractive
  Pas de menu ni Read-Host. Sans jeton : message + exit 2.

.PARAMETER DnsOnly
  N'appelle pas l'API : affiche uniquement les instructions DNS (exit 0).

.PARAMETER Quiet
  Avec DnsOnly : pas d en-tete (utile pour pinapp.ps1 suite).

.PARAMETER Status
  GET API Pages : affiche cname, HTTPS, statut de build (jeton requis comme pour PUT).

.PARAMETER Diagnose
  DNS + HTTP uniquement puis instructions Hostinger (sans API, sans menu).

.PARAMETER Repair
  Diagnostic puis enregistrement API (comme sans DnsOnly) : corrige le cote GitHub ; le DNS Hostinger reste a faire a la main.

.EXAMPLE
  cd $env:USERPROFILE\Projects\pinapp-site
  .\tools\pinapp-fr-domaine.ps1

.EXAMPLE
  $env:GITHUB_TOKEN = gh auth token
  .\tools\pinapp-fr-domaine.ps1 -NonInteractive

.NOTES
  Lancer comme FICHIER : .\tools\pinapp-fr-domaine.ps1
  Point d entree global : .\pinapp.ps1 fr-auto | fr-prepare-profile | diagnose-fr | corrige-fr | domain | dns | pages
  Codes sortie : 0 OK | 1 mauvais usage | 2 pas de jeton (NonInteractive) | 3 echec API
#>
[CmdletBinding()]
param(
    [string] $Owner = 'lauraliedaguzay-lang',
    [string] $Repo = 'pinapp-site',
    [string] $Domain = 'pinapp.fr',
    [switch] $NonInteractive,
    [switch] $DnsOnly,
    [switch] $Quiet,
    [switch] $Status,
    [switch] $Diagnose,
    [switch] $Repair
)

$ErrorActionPreference = 'Stop'

try {
    if ($OutputEncoding.CodePage -ne 65001) {
        $OutputEncoding = [System.Text.UTF8Encoding]::new($false)
    }
    if ([Console]::OutputEncoding.CodePage -ne 65001) {
        [Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)
    }
} catch {}

function Test-PinappScriptRoot {
    if (-not $PSScriptRoot) {
        Write-Host ''
        Write-Host 'Lance ce script comme fichier .ps1, pas en copier-collant ligne par ligne.' -ForegroundColor Red
        Write-Host 'Exemple :' -ForegroundColor Yellow
        Write-Host ('  cd ' + $env:USERPROFILE + '\Projects\pinapp-site') -ForegroundColor White
        Write-Host '  .\tools\pinapp-fr-domaine.ps1' -ForegroundColor White
        Write-Host ''
        exit 1
    }
}

function Get-PinappGitHubTokenSilent {
    $t = $env:GITHUB_TOKEN
    if ($t) { return $t.Trim() }
    $gh = Get-Command gh -ErrorAction SilentlyContinue
    if ($gh) {
        try {
            $raw = & gh auth token 2>$null
            if ($raw -and $raw.Trim()) { return $raw.Trim() }
        } catch {}
    }
    return $null
}

function Read-PinappPatSecure {
    Write-Host ''
    Write-Host 'Saisie masquee du PAT (GitHub : classic token, scope repo).' -ForegroundColor Yellow
    $sec = Read-Host 'Personal Access Token' -AsSecureString
    if (-not $sec) { throw 'Jeton requis. Annule.' }
    $bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($sec)
    try {
        $plain = [Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)
    } finally {
        [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr) | Out-Null
    }
    if (-not $plain -or -not $plain.Trim()) { throw 'Jeton vide. Annule.' }
    return $plain.Trim()
}

function Invoke-PinappInteractiveMenu {
    param(
        [string] $DomainName,
        [string] $RepoRootPath
    )
    while ($true) {
        Write-Host ''
        Write-Host '--- Aucun jeton GitHub detecte ---' -ForegroundColor Yellow
        Write-Host '  [1] Saisir un PAT (Personal Access Token, saisie masquee)' -ForegroundColor White
        Write-Host '  [2] Afficher uniquement les DNS Hostinger (pas d appel API)' -ForegroundColor White
        Write-Host '  [3] Quitter : configure d abord  gh auth login  puis relance ce script' -ForegroundColor White
        Write-Host ''
        $c = Read-Host 'Ton choix [1-3]'
        $c = if ($c) { $c.Trim() } else { '' }
        switch ($c) {
            '1' { return 'pat' }
            '2' {
                Show-PinappDnsBlock -DomainName $DomainName -RepoRootPath $RepoRootPath
                return 'dns_done'
            }
            '3' {
                Write-Host ''
                Write-Host 'Dans un autre terminal PowerShell :' -ForegroundColor Cyan
                Write-Host '  gh auth login' -ForegroundColor White
                Write-Host 'Puis :' -ForegroundColor Cyan
                Write-Host ('  $env:GITHUB_TOKEN = gh auth token') -ForegroundColor White
                Write-Host ('  .\tools\pinapp-fr-domaine.ps1 -NonInteractive') -ForegroundColor White
                Write-Host ''
                return 'quit'
            }
            default {
                Write-Host 'Choix invalide. Entre 1, 2 ou 3.' -ForegroundColor Red
            }
        }
    }
}

function Show-PinappDnsBlock {
    param(
        [string] $DomainName,
        [string] $RepoRootPath
    )
    $cnamePath = Join-Path $RepoRootPath 'CNAME'
    $dnsRef = Join-Path (Join-Path $RepoRootPath 'tools') 'dns-hostinger-pinapp-fr.txt'
    Write-Host ''
    Write-Host ('=== DNS Hostinger (hPanel > Domaines > ' + $DomainName + ' > DNS) ===') -ForegroundColor Cyan
    Write-Host @"

Reference detaillee (fichier dans le depot) : $dnsRef

API Hostinger (PowerShell, jeton hPanel) : .\tools\hostinger-dns-github-pages.ps1 -WhatIf
  puis avec HOSTINGER_API_TOKEN : .\tools\hostinger-dns-github-pages.ps1 -Force

Supprime les enregistrements A qui pointent encore vers l'IP d'hebergement Hostinger
si tu veux que le site soit servi uniquement par GitHub Pages.

Enregistrements A (apex / @) - 4 lignes :
  Type A | Nom @ | 185.199.108.153
  Type A | Nom @ | 185.199.109.153
  Type A | Nom @ | 185.199.110.153
  Type A | Nom @ | 185.199.111.153

Optionnel www :
  Type CNAME | Nom www | lauraliedaguzay-lang.github.io.

Apres propagation (souvent 15 min - 48 h) : https://$DomainName/
Verifie aussi : GitHub > Settings > Pages > Enforce HTTPS

Fichier CNAME dans le depot : $cnamePath
"@
    Write-Host ''
}

function Get-PinappGitHubPagesARecords {
    return @(
        '185.199.108.153',
        '185.199.109.153',
        '185.199.110.153',
        '185.199.111.153'
    )
}

function Invoke-PinappFrDnsHttpDiagnose {
    param(
        [string] $DomainName
    )
    $githubA = Get-PinappGitHubPagesARecords
    Write-Host ''
    Write-Host ('=== Diagnostic DNS + HTTP : ' + $DomainName + ' ===') -ForegroundColor Cyan
    try {
        $aRecs = @(Resolve-DnsName -Name $DomainName -Type A -DnsOnly -ErrorAction Stop | Where-Object { $_.IPAddress })
    } catch {
        try {
            $aRecs = @(Resolve-DnsName -Name $DomainName -Type A -ErrorAction Stop | Where-Object { $_.IPAddress })
        } catch {
            Write-Host ('  DNS A : echec (' + $_.Exception.Message + ')') -ForegroundColor Yellow
            $aRecs = @()
        }
    }
    if ($aRecs.Count -eq 0) {
        Write-Host '  Aucun enregistrement A (query DNS).' -ForegroundColor Yellow
    } else {
        $allGithub = $true
        foreach ($r in $aRecs) {
            $ip = [string]$r.IPAddress
            $ok = $githubA -contains $ip
            if (-not $ok) { $allGithub = $false }
            $color = if ($ok) { 'Green' } else { 'Red' }
            $label = if ($ok) { 'OK (GitHub Pages)' } else { 'PAS GitHub Pages (souvent Hostinger / ancien hebergeur)' }
            Write-Host ('  A  ' + $ip + '  -> ' + $label) -ForegroundColor $color
        }
        if (-not $allGithub) {
            Write-Host ''
            Write-Host '  Cause frequente du 403 : le domaine pointe encore vers Hostinger (LiteSpeed), pas vers GitHub.' -ForegroundColor Yellow
            Write-Host '  Action : modifier les DNS chez Hostinger (voir bloc ci-dessous).' -ForegroundColor Yellow
        }
    }
    try {
        $wc = @(Resolve-DnsName -Name ('www.' + $DomainName) -Type CNAME -DnsOnly -ErrorAction SilentlyContinue)
    } catch {
        $wc = @(Resolve-DnsName -Name ('www.' + $DomainName) -Type CNAME -ErrorAction SilentlyContinue)
    }
    foreach ($w in $wc) {
        if ($w.NameHost) {
            Write-Host ('  www CNAME -> ' + $w.NameHost) -ForegroundColor Gray
        }
    }
    Write-Host ''
    Write-Host '  Test HTTPS :' -ForegroundColor Gray
    try {
        $head = Invoke-WebRequest -Uri ('https://' + $DomainName + '/') -Method Head -TimeoutSec 20 -UseBasicParsing -MaximumRedirection 3 -ErrorAction Stop
        Write-Host ('  HTTP ' + [int]$head.StatusCode) -ForegroundColor Green
        if ($head.Headers['Server']) {
            Write-Host ('  Server: ' + $head.Headers['Server']) -ForegroundColor Gray
        }
    } catch {
        $resp = $_.Exception.Response
        if ($resp) {
            $code = [int]$resp.StatusCode
            Write-Host ('  HTTP ' + $code) -ForegroundColor $(if ($code -eq 403) { 'Yellow' } else { 'Yellow' })
            try {
                $srv = $resp.Headers['Server']
                if ($srv) { Write-Host ('  Server: ' + $srv) -ForegroundColor Gray }
            } catch {}
            if ($code -eq 403) {
                Write-Host '  (403 + LiteSpeed/hostinger => DNS encore sur Hostinger ou pas de site sur ce vhost)' -ForegroundColor DarkGray
            }
        } else {
            Write-Host ('  Erreur : ' + $_.Exception.Message) -ForegroundColor Red
        }
    }
    Write-Host ''
}

function Invoke-PinappGitHubPagesGet {
    param(
        [string] $OwnerName,
        [string] $RepoName,
        [string] $BearerToken
    )
    $uri = 'https://api.github.com/repos/' + $OwnerName + '/' + $RepoName + '/pages'
    $headers = @{
        Authorization          = 'Bearer ' + $BearerToken
        Accept                 = 'application/vnd.github+json'
        'X-GitHub-Api-Version' = '2022-11-28'
    }
    return Invoke-RestMethod -Method Get -Uri $uri -Headers $headers
}

function Invoke-PinappGitHubPagesPut {
    param(
        [string] $OwnerName,
        [string] $RepoName,
        [string] $DomainName,
        [string] $BearerToken
    )
    $uri = 'https://api.github.com/repos/' + $OwnerName + '/' + $RepoName + '/pages'
    $headers = @{
        Authorization          = 'Bearer ' + $BearerToken
        Accept                 = 'application/vnd.github+json'
        'X-GitHub-Api-Version' = '2022-11-28'
    }
    $body = @{ cname = $DomainName; https_enforced = $true } | ConvertTo-Json
    return Invoke-RestMethod -Method Put -Uri $uri -Headers $headers -Body $body -ContentType 'application/json'
}

# --- main ---
Test-PinappScriptRoot
$repoRoot = Split-Path -Parent $PSScriptRoot

if ($DnsOnly) {
    if (-not $Quiet) {
        Write-Host ''
        Write-Host '=== Pinapp - domaine GitHub Pages + DNS Hostinger ===' -ForegroundColor Cyan
        Write-Host ('Depot : ' + $Owner + '/' + $Repo + '  |  Domaine : ' + $Domain) -ForegroundColor Gray
        Write-Host ''
    }
    Show-PinappDnsBlock -DomainName $Domain -RepoRootPath $repoRoot
    exit 0
}

if ($Diagnose -and -not $Repair) {
    Invoke-PinappFrDnsHttpDiagnose -DomainName $Domain
    Show-PinappDnsBlock -DomainName $Domain -RepoRootPath $repoRoot
    exit 0
}

if ($Repair) {
    Invoke-PinappFrDnsHttpDiagnose -DomainName $Domain
    Write-Host '--- Correction cote GitHub (API Pages) ---' -ForegroundColor Cyan
    Write-Host ('Depot : ' + $Owner + '/' + $Repo + '  |  Domaine : ' + $Domain) -ForegroundColor Gray
    Write-Host 'DNS GitHub Pages : 4x A @ + CNAME www (hPanel ou .\tools\hostinger-dns-github-pages.ps1). Sans ca, pinapp.fr peut rester en 403.' -ForegroundColor DarkYellow
    Write-Host ''
} else {
    Write-Host ''
    Write-Host '=== Pinapp - domaine GitHub Pages + DNS Hostinger ===' -ForegroundColor Cyan
    Write-Host ('Depot : ' + $Owner + '/' + $Repo + '  |  Domaine : ' + $Domain) -ForegroundColor Gray
    Write-Host ''
}

$token = Get-PinappGitHubTokenSilent

if (-not $token -and -not $NonInteractive) {
    $action = Invoke-PinappInteractiveMenu -DomainName $Domain -RepoRootPath $repoRoot
    if ($action -eq 'dns_done') { exit 0 }
    if ($action -eq 'quit') { exit 0 }
    if ($action -eq 'pat') {
        try {
            $token = Read-PinappPatSecure
        } catch {
            Write-Host $_.Exception.Message -ForegroundColor Red
            exit 1
        }
    }
}

if (-not $token) {
    Write-Host 'Pas de jeton GitHub.' -ForegroundColor Red
    Write-Host 'Mode non interactif : definis GITHUB_TOKEN ou connecte gh, puis -NonInteractive.' -ForegroundColor Yellow
    exit 2
}

if ($Status) {
    Write-Host 'Lecture API GitHub Pages (GET)...' -ForegroundColor Gray
    try {
        $pg = Invoke-PinappGitHubPagesGet -OwnerName $Owner -RepoName $Repo -BearerToken $token
        Write-Host ''
        Write-Host ('--- GitHub Pages (depot ' + $Owner + '/' + $Repo + ') ---') -ForegroundColor Cyan
        Write-Host ('  status          : ' + $pg.status) -ForegroundColor White
        Write-Host ('  cname           : ' + $pg.cname) -ForegroundColor White
        Write-Host ('  https_enforced  : ' + $pg.https_enforced) -ForegroundColor White
        if ($pg.html_url) {
            Write-Host ('  html_url        : ' + $pg.html_url) -ForegroundColor White
        }
        if ($pg.build_type) {
            Write-Host ('  build_type      : ' + $pg.build_type) -ForegroundColor White
        }
        Write-Host ''
    } catch {
        $msg = $_.Exception.Message
        if ($_.ErrorDetails.Message) {
            try {
                $j = $_.ErrorDetails.Message | ConvertFrom-Json
                if ($j.message) { $msg = $j.message }
            } catch {}
        }
        Write-Host ('Echec GET Pages : ' + $msg) -ForegroundColor Red
        Write-Host 'Pages est peut-etre desactive ou le depot sans site Pages.' -ForegroundColor Yellow
        exit 3
    }
    exit 0
}

Write-Host 'Appel API GitHub Pages (PUT)...' -ForegroundColor Gray
try {
    $null = Invoke-PinappGitHubPagesPut -OwnerName $Owner -RepoName $Repo -DomainName $Domain -BearerToken $token
    Write-Host ('OK : domaine ' + $Domain + ' enregistre sur GitHub Pages (HTTPS).') -ForegroundColor Green
} catch {
    $msg = $_.Exception.Message
    if ($_.ErrorDetails.Message) {
        try {
            $j = $_.ErrorDetails.Message | ConvertFrom-Json
            if ($j.message) { $msg = $j.message }
        } catch {}
    }
    Write-Host ('Echec API : ' + $msg) -ForegroundColor Red
    Write-Host ('Manuel : GitHub > ' + $Repo + ' > Settings > Pages > Custom domain = ' + $Domain + ' > Save') -ForegroundColor Yellow
    Show-PinappDnsBlock -DomainName $Domain -RepoRootPath $repoRoot
    exit 3
}

Show-PinappDnsBlock -DomainName $Domain -RepoRootPath $repoRoot
exit 0

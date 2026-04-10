#requires -Version 5.1
<#
.SYNOPSIS
  Declarer pinapp.fr sur GitHub Pages (REST API) et afficher les DNS Hostinger.

.DESCRIPTION
  Jeton : $env:GITHUB_TOKEN, ou sortie de 'gh auth token', ou saisie masquee (mode interactif).

.PARAMETER NonInteractive
  Pas de Read-Host. Sans jeton : message + exit 2.

.PARAMETER DnsOnly
  N'appelle pas l'API : affiche uniquement les instructions DNS (exit 0).

.EXAMPLE
  cd $env:USERPROFILE\Projects\pinapp-site
  .\tools\pinapp-fr-domaine.ps1

.EXAMPLE
  $env:GITHUB_TOKEN = gh auth token
  .\tools\pinapp-fr-domaine.ps1 -NonInteractive

.NOTES
  Lancer comme FICHIER : .\tools\pinapp-fr-domaine.ps1 (ne pas coller le corps ligne par ligne).
  Codes sortie : 0 OK | 1 mauvais usage | 2 pas de jeton (NonInteractive) | 3 echec API
#>
[CmdletBinding()]
param(
    [string] $Owner = 'lauraliedaguzay-lang',
    [string] $Repo = 'pinapp-site',
    [string] $Domain = 'pinapp.fr',
    [switch] $NonInteractive,
    [switch] $DnsOnly
)

$ErrorActionPreference = 'Stop'

# Console UTF-8 (evite affichages type masquǸe sur Windows PowerShell 5.1)
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

function Get-PinappGitHubToken {
    param([switch] $AllowPrompt)
    $t = $env:GITHUB_TOKEN
    if ($t) { return $t.Trim() }

    $gh = Get-Command gh -ErrorAction SilentlyContinue
    if ($gh) {
        try {
            $raw = & gh auth token 2>$null
            if ($raw -and $raw.Trim()) { return $raw.Trim() }
        } catch {}
    }

    if (-not $AllowPrompt) { return $null }

    Write-Host 'Aucun jeton : connecte GitHub CLI (gh auth login) ou definis $env:GITHUB_TOKEN.' -ForegroundColor Yellow
    Write-Host 'Saisie masquee du PAT (classic, scope repo) :' -ForegroundColor Yellow
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

function Show-PinappDnsBlock {
    param(
        [string] $DomainName,
        [string] $RepoRootPath
    )
    $cnamePath = Join-Path $RepoRootPath 'CNAME'
    Write-Host ''
    Write-Host ('=== DNS Hostinger (hPanel > Domaines > ' + $DomainName + ' > DNS) ===') -ForegroundColor Cyan
    Write-Host @"

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

Write-Host ''
Write-Host '=== Pinapp - domaine GitHub Pages + DNS Hostinger ===' -ForegroundColor Cyan
Write-Host ('Depot : ' + $Owner + '/' + $Repo + '  |  Domaine : ' + $Domain) -ForegroundColor Gray
Write-Host ''

if ($DnsOnly) {
    Show-PinappDnsBlock -DomainName $Domain -RepoRootPath $repoRoot
    exit 0
}

$allowPrompt = -not $NonInteractive
try {
    $token = Get-PinappGitHubToken -AllowPrompt:$allowPrompt
} catch {
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

if (-not $token) {
    Write-Host 'Pas de jeton GitHub. Fais : gh auth login' -ForegroundColor Red
    Write-Host 'puis : $env:GITHUB_TOKEN = gh auth token' -ForegroundColor Yellow
    Write-Host 'Ou relance sans -NonInteractive pour saisir un PAT.' -ForegroundColor Yellow
    exit 2
}

Write-Host 'Appel API GitHub Pages (PUT)...' -ForegroundColor Gray
$apiOk = $false
try {
    $null = Invoke-PinappGitHubPagesPut -OwnerName $Owner -RepoName $Repo -DomainName $Domain -BearerToken $token
    $apiOk = $true
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

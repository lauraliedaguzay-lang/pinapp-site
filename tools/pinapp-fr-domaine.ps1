<#
.SYNOPSIS
  Configure pinapp.fr sur GitHub Pages (API) et affiche les DNS Hostinger.

.DESCRIPTION
  1) Récupère un jeton : variable GITHUB_TOKEN, ou `gh auth token`, ou saisie masquée.
  2) PUT https://api.github.com/repos/.../pages (cname + https_enforced).
  3) Affiche les enregistrements A / CNAME à créer chez Hostinger.

.EXAMPLE
  cd C:\Users\Lauralie\Projects\pinapp-site
  .\tools\pinapp-fr-domaine.ps1

.EXAMPLE
  $env:GITHUB_TOKEN = "ghp_xxxx"
  .\tools\pinapp-fr-domaine.ps1 -Domain "pinapp.fr"
#>
param(
    [string]$Owner = 'lauraliedaguzay-lang',
    [string]$Repo = 'pinapp-site',
    [string]$Domain = 'pinapp.fr'
)

$ErrorActionPreference = 'Stop'
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RepoRoot = Split-Path -Parent $ScriptDir

function Get-GitHubTokenFromGh {
    $gh = Get-Command gh -ErrorAction SilentlyContinue
    if (-not $gh) { return $null }
    try {
        $t = gh auth token 2>$null
        if ($t -and $t.Trim()) { return $t.Trim() }
    } catch {}
    return $null
}

Write-Host ""
Write-Host "=== Pinapp — domaine GitHub Pages + DNS Hostinger ===" -ForegroundColor Cyan
Write-Host "Dépôt : $Owner/$Repo  |  Domaine : $Domain" -ForegroundColor Gray
Write-Host ""

$token = $env:GITHUB_TOKEN
if (-not $token) {
    $token = Get-GitHubTokenFromGh
}
if (-not $token) {
    Write-Host "Aucun jeton : connecte GitHub CLI avec :  gh auth login" -ForegroundColor Yellow
    Write-Host "Ou colle un PAT (classic, scope repo) ci-dessous (saisie masquée)." -ForegroundColor Yellow
    $sec = Read-Host 'Personal Access Token' -AsSecureString
    if (-not $sec) { Write-Error 'Jeton requis. Annulé.' }
    $bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($sec)
    try {
        $token = [Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)
    } finally {
        [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr) | Out-Null
    }
    if (-not $token.Trim()) { Write-Error 'Jeton vide. Annulé.' }
}

$uri = "https://api.github.com/repos/$Owner/$Repo/pages"
$headers = @{
    Authorization          = "Bearer $token"
    Accept                 = 'application/vnd.github+json'
    'X-GitHub-Api-Version' = '2022-11-28'
}
$body = @{
    cname          = $Domain
    https_enforced = $true
} | ConvertTo-Json

Write-Host "Appel API GitHub Pages (PUT)..." -ForegroundColor Gray
try {
    $null = Invoke-RestMethod -Method Put -Uri $uri -Headers $headers -Body $body -ContentType 'application/json'
    Write-Host "OK — Domaine $Domain enregistré sur GitHub Pages (HTTPS forcé)." -ForegroundColor Green
} catch {
    $msg = $_.Exception.Message
    if ($_.ErrorDetails.Message) {
        try {
            $j = $_.ErrorDetails.Message | ConvertFrom-Json
            if ($j.message) { $msg = $j.message }
        } catch {}
    }
    Write-Host "Échec API : $msg" -ForegroundColor Red
    Write-Host "Alternative : GitHub → $Repo → Settings → Pages → Custom domain → $Domain → Save" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== DNS à saisir chez Hostinger (hPanel → Domaines → $Domain → DNS) ===" -ForegroundColor Cyan
Write-Host @"

Supprime les enregistrements A qui pointent encore vers l'IP d'hébergement Hostinger
si tu veux que le site soit servi uniquement par GitHub Pages.

Enregistrements A (apex / @) — 4 lignes :
  Type A | Nom @ | 185.199.108.153
  Type A | Nom @ | 185.199.109.153
  Type A | Nom @ | 185.199.110.153
  Type A | Nom @ | 185.199.111.153

Optionnel www :
  Type CNAME | Nom www | lauraliedaguzay-lang.github.io.

Après propagation (souvent 15 min – 48 h), ouvre : https://$Domain/
Vérifie aussi : GitHub → Settings → Pages → Enforce HTTPS

Fichier CNAME dans le dépôt : $(Join-Path $RepoRoot 'CNAME')
"@

Write-Host ""

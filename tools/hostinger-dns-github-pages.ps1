#requires -Version 5.1
<#
.SYNOPSIS
  Pointe le DNS Hostinger (API) vers GitHub Pages pour pinapp.fr.

.DESCRIPTION
  Utilise l API Hostinger DNS v1 (Bearer token).
  Jeton : variable d environnement HOSTINGER_API_TOKEN (hPanel > Compte > API).

  Remplace les enregistrements @ A par les 4 IP GitHub Pages.
  Par defaut remplace aussi www CNAME vers la cible Pages (user.github.io).

.PARAMETER Domain
  Nom de domaine gere chez Hostinger (ex. pinapp.fr).

.PARAMETER PagesCnameTarget
  Cible CNAME pour www (ex. lauraliedaguzay-lang.github.io.).

.PARAMETER ApexOnly
  Ne modifie que les A @ ; laisse www tel quel.

.PARAMETER GetOnly
  GET uniquement : affiche la zone DNS actuelle, sans modification.

.PARAMETER WhatIf
  Affiche le corps JSON qui serait envoye (aucun appel PUT).

.PARAMETER NonInteractive
  Pas de confirmation Read-Host (utiliser avec -Force ou apres relecture du JSON).

.PARAMETER Force
  Applique sans demander OUI (avec jeton).

.EXAMPLE
  $env:HOSTINGER_API_TOKEN = '...'
  .\tools\hostinger-dns-github-pages.ps1 -WhatIf

.EXAMPLE
  $env:HOSTINGER_API_TOKEN = '...'
  .\tools\hostinger-dns-github-pages.ps1 -Force
#>
[CmdletBinding()]
param(
    [string] $Domain = 'pinapp.fr',
    [string] $PagesCnameTarget = 'lauraliedaguzay-lang.github.io.',
    [switch] $ApexOnly,
    [switch] $GetOnly,
    [switch] $WhatIf,
    [switch] $NonInteractive,
    [switch] $Force
)

$ErrorActionPreference = 'Stop'

$script:HostingerApiBase = 'https://developers.hostinger.com'

function Test-HostingerScriptRoot {
    if (-not $PSScriptRoot) {
        Write-Host 'Lance ce fichier comme .ps1 (pas de copier-coller ligne par ligne).' -ForegroundColor Red
        exit 1
    }
}

function Get-HostingerApiToken {
    $t = $env:HOSTINGER_API_TOKEN
    if ($t) { return $t.Trim() }
    return $null
}

function Read-HostingerTokenSecure {
    Write-Host ''
    Write-Host 'Saisie masquee du jeton API Hostinger (hPanel > API).' -ForegroundColor Yellow
    $sec = Read-Host 'HOSTINGER API token' -AsSecureString
    if (-not $sec) { throw 'Jeton requis.' }
    $bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($sec)
    try {
        $plain = [Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)
    } finally {
        [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr) | Out-Null
    }
    if (-not $plain -or -not $plain.Trim()) { throw 'Jeton vide.' }
    return $plain.Trim()
}

function Get-PinappGitHubPagesIPv4 {
    return @(
        '185.199.108.153',
        '185.199.109.153',
        '185.199.110.153',
        '185.199.111.153'
    )
}

function Invoke-HostingerDnsRequest {
    param(
        [ValidateSet('Get', 'Put')]
        [string] $Method,
        [string] $DomainName,
        [string] $BearerToken,
        [object] $BodyObject
    )
    $path = '/api/dns/v1/zones/' + [Uri]::EscapeDataString($DomainName)
    $uri = $script:HostingerApiBase + $path
    $headers = @{
        Authorization = 'Bearer ' + $BearerToken
        Accept        = 'application/json'
    }
    if ($Method -eq 'Get') {
        return Invoke-RestMethod -Method Get -Uri $uri -Headers $headers
    }
    $json = $BodyObject | ConvertTo-Json -Depth 12 -Compress
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
    $wr = Invoke-WebRequest -Method Put -Uri $uri -Headers $headers -Body $bytes -ContentType 'application/json; charset=utf-8' -UseBasicParsing
    $code = [int]$wr.StatusCode
    if ($code -lt 200 -or $code -ge 300) {
        throw ('HTTP ' + $code + ' : ' + $wr.Content)
    }
    return $null
}

function Build-GitHubPagesZoneUpdate {
    param(
        [string] $CnameTarget,
        [switch] $ApexOnlyFlag
    )
    $ips = Get-PinappGitHubPagesIPv4
    $aRecords = @()
    foreach ($ip in $ips) {
        $aRecords += @{ content = $ip }
    }
    $zone = [System.Collections.ArrayList]@()
    [void]$zone.Add(@{
            name    = '@'
            type    = 'A'
            ttl     = 3600
            records = $aRecords
        })
    if (-not $ApexOnlyFlag) {
        $c = $CnameTarget.Trim()
        if (-not $c.EndsWith('.')) { $c = $c + '.' }
        [void]$zone.Add(@{
                name    = 'www'
                type    = 'CNAME'
                ttl     = 3600
                records = @(@{ content = $c })
            })
    }
    return @{
        overwrite = $true
        zone      = @($zone)
    }
}

# --- main ---
Test-HostingerScriptRoot

Write-Host ''
Write-Host '=== Hostinger API DNS -> GitHub Pages ===' -ForegroundColor Cyan
Write-Host ('Domaine : ' + $Domain) -ForegroundColor Gray
Write-Host ('API     : ' + $script:HostingerApiBase + '/api/dns/v1/zones/' + $Domain) -ForegroundColor DarkGray
Write-Host ''

$body = Build-GitHubPagesZoneUpdate -CnameTarget $PagesCnameTarget -ApexOnlyFlag:$ApexOnly
$jsonPreview = $body | ConvertTo-Json -Depth 12

if ($WhatIf) {
    Write-Host '--- Corps PUT prevu (overwrite true) ---' -ForegroundColor Yellow
    Write-Host $jsonPreview
    Write-Host ''
    $tokenPreview = Get-HostingerApiToken
    if ($tokenPreview) {
        try {
            $cur = Invoke-HostingerDnsRequest -Method Get -DomainName $Domain -BearerToken $tokenPreview
            Write-Host '--- Zone actuelle (GET) ---' -ForegroundColor Cyan
            Write-Host ($cur | ConvertTo-Json -Depth 8)
        } catch {
            Write-Host ('GET : ' + $_.Exception.Message) -ForegroundColor DarkYellow
        }
    } else {
        Write-Host 'Definis HOSTINGER_API_TOKEN pour aussi afficher la zone actuelle (GET).' -ForegroundColor DarkGray
    }
    Write-Host ''
    exit 0
}

$token = Get-HostingerApiToken
if (-not $token -and -not $NonInteractive) {
    try {
        $token = Read-HostingerTokenSecure
    } catch {
        Write-Host $_.Exception.Message -ForegroundColor Red
        Write-Host 'Definis HOSTINGER_API_TOKEN ou relance sans -NonInteractive.' -ForegroundColor Yellow
        exit 2
    }
}
if (-not $token) {
    Write-Host 'HOSTINGER_API_TOKEN manquant.' -ForegroundColor Red
    exit 2
}

try {
    $current = Invoke-HostingerDnsRequest -Method Get -DomainName $Domain -BearerToken $token
    Write-Host '--- Zone actuelle ---' -ForegroundColor Cyan
    Write-Host ($current | ConvertTo-Json -Depth 8)
    Write-Host ''
} catch {
    Write-Host ('GET DNS : ' + $_.Exception.Message) -ForegroundColor Red
    if ($_.ErrorDetails.Message) { Write-Host $_.ErrorDetails.Message -ForegroundColor Red }
    exit 3
}

if ($GetOnly) {
    Write-Host 'GetOnly : aucune modification.' -ForegroundColor Gray
    exit 0
}

if (-not $Force -and -not $NonInteractive) {
    $scope = if ($ApexOnly) { 'les A @' } else { 'les A @ et le CNAME www' }
    Write-Host ('Cette operation remplace ' + $scope + ' pour GitHub Pages.') -ForegroundColor Yellow
    $confirm = Read-Host 'Taper OUI pour appliquer'
    if ($confirm -ne 'OUI') {
        Write-Host 'Annule.' -ForegroundColor Gray
        exit 4
    }
}

try {
    $null = Invoke-HostingerDnsRequest -Method Put -DomainName $Domain -BearerToken $token -BodyObject $body
    Write-Host 'OK : DNS mis a jour via API Hostinger.' -ForegroundColor Green
    Write-Host 'Attendre la propagation puis : .\pinapp.ps1 diagnose-fr' -ForegroundColor Cyan
} catch {
    Write-Host ('PUT DNS : ' + $_.Exception.Message) -ForegroundColor Red
    if ($_.ErrorDetails.Message) { Write-Host $_.ErrorDetails.Message -ForegroundColor Red }
    exit 3
}

exit 0

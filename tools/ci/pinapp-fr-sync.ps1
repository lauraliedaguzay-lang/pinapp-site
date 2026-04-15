#requires -Version 5.1
<#
.SYNOPSIS
  Synchronise pinapp.fr : DNS Hostinger (optionnel) + domaine custom GitHub Pages.
.DESCRIPTION
  Meme contrat que tools/ci/pinapp-fr-sync.py (variables d'environnement, aucun secret en sortie).
  Entree CI / locale : pwsh -NoProfile -File ./tools/ci/pinapp-fr-sync.ps1
#>
$ErrorActionPreference = 'Stop'

function Test-PinappTruthyEnv {
    param([string] $Name)
    $v = [Environment]::GetEnvironmentVariable($Name, 'Process')
    if (-not $v) { return $false }
    $t = $v.Trim().ToLowerInvariant()
    return $t -in @('1', 'true', 'yes', 'on')
}

function Invoke-PinappGitHubPagesPut {
    if (Test-PinappTruthyEnv 'PINAPP_SKIP_GITHUB') {
        Write-Host 'GitHub Pages domaine : PINAPP_SKIP_GITHUB — ignore.'
        return 0
    }
    $repoFull = [Environment]::GetEnvironmentVariable('GITHUB_REPOSITORY', 'Process')
    if ($repoFull) { $repoFull = $repoFull.Trim() }
    if (-not $repoFull -or $repoFull -notmatch '^[^/]+/[^/]+$') {
        Write-Host '::error::GITHUB_REPOSITORY manquant ou invalide'
        return 1
    }
    $owner, $repo = $repoFull -split '/', 2
    $token = [Environment]::GetEnvironmentVariable('GITHUB_TOKEN', 'Process')
    if ($token) { $token = $token.Trim() }
    if (-not $token) {
        Write-Host '::error::GITHUB_TOKEN manquant'
        return 1
    }
    $cname = if ($env:PINAPP_DOMAIN) { $env:PINAPP_DOMAIN.Trim() } else { 'pinapp.fr' }
    $bodyObj = @{ cname = $cname; https_enforced = $true }
    $json = $bodyObj | ConvertTo-Json -Compress
    $url = "https://api.github.com/repos/$owner/$repo/pages"
    $headers = @{
        Authorization          = "Bearer $token"
        Accept                   = 'application/vnd.github+json'
        'X-GitHub-Api-Version'   = '2022-11-28'
        'Content-Type'           = 'application/json'
    }
    try {
        $r = Invoke-WebRequest -Uri $url -Method Put -Body ([System.Text.Encoding]::UTF8.GetBytes($json)) -Headers $headers -TimeoutSec 120 -UseBasicParsing
        Write-Host ('GitHub Pages PUT (cname) -> HTTP ' + [int]$r.StatusCode)
        return 0
    } catch {
        $code = $null
        $err = $_.Exception.Message
        if ($_.Exception.Response) {
            try {
                $code = [int]$_.Exception.Response.StatusCode
                $sr = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
                $err = $sr.ReadToEnd()
                $sr.Close()
            } catch { }
        }
        $snippet = if ($err.Length -gt 2000) { $err.Substring(0, 2000) } else { $err }
        Write-Host ('::error::GitHub API HTTP ' + $code + ': ' + $snippet)
        return 1
    }
}

function Invoke-PinappHostingerDnsPut {
    if (Test-PinappTruthyEnv 'PINAPP_SKIP_HOSTINGER') {
        Write-Host 'Hostinger DNS : PINAPP_SKIP_HOSTINGER — ignore.'
        return 0
    }
    $token = [Environment]::GetEnvironmentVariable('HOSTINGER_API_TOKEN', 'Process')
    if ($token) { $token = $token.Trim() }
    if (-not $token) {
        Write-Host 'Hostinger DNS : secret HOSTINGER_API_TOKEN absent — ignore (optionnel).'
        return 0
    }
    $domain = if ($env:PINAPP_DOMAIN) { $env:PINAPP_DOMAIN.Trim() } else { 'pinapp.fr' }
    $target = if ($env:PAGES_CNAME_TARGET) { $env:PAGES_CNAME_TARGET.Trim() } else { 'lauraliedaguzay-lang.github.io.' }
    if (-not $target.EndsWith('.')) {
        $target += '.'
    }
    $ips = @('185.199.108.153', '185.199.109.153', '185.199.110.153', '185.199.111.153')
    $aRecords = @()
    foreach ($ip in $ips) {
        $aRecords += @{ content = $ip }
    }
    $zone = @(
        @{ name = '@'; type = 'A'; ttl = 3600; records = $aRecords },
        @{ name = 'www'; type = 'CNAME'; ttl = 3600; records = @(@{ content = $target }) }
    )
    $payload = @{ overwrite = $true; zone = $zone }
    $json = $payload | ConvertTo-Json -Depth 8 -Compress
    $encoded = [uri]::EscapeDataString($domain)
    $url = 'https://developers.hostinger.com/api/dns/v1/zones/' + $encoded
    $headers = @{
        Authorization = "Bearer $token"
        Accept          = 'application/json'
        'Content-Type'  = 'application/json; charset=utf-8'
    }
    try {
        $r = Invoke-WebRequest -Uri $url -Method Put -Body ([System.Text.Encoding]::UTF8.GetBytes($json)) -Headers $headers -TimeoutSec 120 -UseBasicParsing
        Write-Host ('Hostinger DNS PUT -> HTTP ' + [int]$r.StatusCode)
        return 0
    } catch {
        $code = $null
        $err = $_.Exception.Message
        if ($_.Exception.Response) {
            try {
                $code = [int]$_.Exception.Response.StatusCode
                $sr = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
                $err = $sr.ReadToEnd()
                $sr.Close()
            } catch { }
        }
        $snippet = if ($err.Length -gt 2000) { $err.Substring(0, 2000) } else { $err }
        Write-Host ('::error::Hostinger API HTTP ' + $code + ': ' + $snippet)
        return 1
    }
}

# GitHub Pages en premier : declarer pinapp.fr sur le depot meme si Hostinger echoue ensuite.
$rc = 0
$rc = $rc -bor (Invoke-PinappGitHubPagesPut)
$rc = $rc -bor (Invoke-PinappHostingerDnsPut)
exit $rc

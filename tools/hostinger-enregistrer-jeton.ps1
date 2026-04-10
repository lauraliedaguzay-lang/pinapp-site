#requires -Version 5.1
<#
.SYNOPSIS
  Ouvre hPanel pour creer un jeton API Hostinger, puis enregistre le jeton dans ~\.pinapp-fr-env.ps1

.DESCRIPTION
  Hostinger ne permet PAS de generer un jeton uniquement par API REST (sans hPanel).
  Ce script ouvre le navigateur sur hPanel ; tu crees le jeton (Compte > API > New token),
  puis tu colles la valeur ici : elle est ecrite dans le profil local (hors depot Git).

.PARAMETER NoBrowser
  N ouvre pas le navigateur (tu es deja sur la page API).

.EXAMPLE
  .\tools\hostinger-enregistrer-jeton.ps1
#>
[CmdletBinding()]
param(
    [switch] $NoBrowser
)

$ErrorActionPreference = 'Stop'

if (-not $PSScriptRoot) {
    Write-Error 'Lance ce fichier comme .ps1.'
}

$profPath = Join-Path $env:USERPROFILE '.pinapp-fr-env.ps1'
$hpanelUrl = 'https://hpanel.hostinger.com/'
$helpUrl = 'https://support.hostinger.com/en/articles/10840865-what-is-hostinger-api'

Write-Host ''
Write-Host '=== Jeton API Hostinger ===' -ForegroundColor Cyan
Write-Host 'La creation du jeton se fait dans hPanel (pas d API publique "create token" sans navigateur).' -ForegroundColor Yellow
Write-Host ''
Write-Host 'Dans hPanel : menu compte / Account > API (ou recherche "API") > New token > copier.' -ForegroundColor White
Write-Host ('Aide : ' + $helpUrl) -ForegroundColor DarkGray
Write-Host ''

if (-not $NoBrowser) {
    Write-Host ('Ouverture : ' + $hpanelUrl) -ForegroundColor Gray
    Start-Process $hpanelUrl
}

Write-Host ''
Write-Host 'Apres creation du jeton dans hPanel, colle-le ci-dessous (saisie masquee).' -ForegroundColor Cyan
$sec = Read-Host 'Jeton API Hostinger' -AsSecureString
if (-not $sec) {
    Write-Error 'Jeton vide.'
}
$bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($sec)
try {
    $plain = [Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)
} finally {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr) | Out-Null
}
if (-not $plain -or -not $plain.Trim()) {
    Write-Error 'Jeton vide.'
}
$tok = $plain.Trim()
# echapper les guillemets doubles pour la ligne PowerShell
$tokEsc = $tok.Replace('"', '`"')

$lineToken = '$env:HOSTINGER_API_TOKEN = "' + $tokEsc + '"'

if (Test-Path -LiteralPath $profPath) {
    $lines = @(Get-Content -LiteralPath $profPath -Encoding UTF8)
    $found = $false
    $out = foreach ($ln in $lines) {
        if ($ln -match '^\s*\$env:HOSTINGER_API_TOKEN\s*=') {
            $found = $true
            $lineToken
        } else {
            $ln
        }
    }
    if ($found) {
        Set-Content -LiteralPath $profPath -Value $out -Encoding UTF8
        Write-Host ''
        Write-Host ('Ligne HOSTINGER_API_TOKEN mise a jour dans : ' + $profPath) -ForegroundColor Green
    } else {
        Add-Content -LiteralPath $profPath -Value ("`n" + $lineToken) -Encoding UTF8
        Write-Host ''
        Write-Host ('Ligne ajoutee dans : ' + $profPath) -ForegroundColor Green
    }
} else {
    $body = @"
# Profil pinapp.fr (local, ne pas committer)
$lineToken
# GitHub optionnel :
# `$env:GITHUB_TOKEN = "ghp_..."
"@
    Set-Content -LiteralPath $profPath -Value $body -Encoding UTF8
    Write-Host ''
    Write-Host ('Fichier cree : ' + $profPath) -ForegroundColor Green
}

Write-Host ''
Write-Host 'Charge puis teste :' -ForegroundColor Cyan
Write-Host ('  . ' + $profPath) -ForegroundColor White
Write-Host '  .\tools\hostinger-dns-github-pages.ps1 -GetOnly' -ForegroundColor White
Write-Host '  ou  .\pinapp.ps1 fr-auto' -ForegroundColor White
Write-Host '  (raccourci jeton : .\pinapp.ps1 hostinger-token)' -ForegroundColor DarkGray
Write-Host ''

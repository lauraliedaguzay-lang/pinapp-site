#requires -Version 5.1
<#
.SYNOPSIS
  Une bonne fois pour toute : charge TA config (fichier local), puis API Hostinger + API GitHub (fr-auto) + probe.
.DESCRIPTION
  Cherche et execute (dans l ordre, le premier qui existe) :
    1) -ConfigFile <chemin.ps1> si passe en parametre
    2) %USERPROFILE%\pinapp-fr-deploy.ps1
    3) pinapp-fr-deploy.local.ps1 a la racine du depot (gitignore)
  Puis charge comme deploy-pinapp-fr : .pinapp-fr-env.ps1 puis .pinapp-secrets.ps1
  Enfin : fr-auto (DNS + domaine Pages) puis probe.

  Mets les jetons du ton doc dans pinapp-fr-deploy.local.ps1 (copie pinapp-fr-deploy.EXAMPLE.ps1).
.PARAMETER ConfigFile
  Chemin absolu ou relatif vers un .ps1 qui definit HOSTINGER_API_TOKEN / GH_TOKEN / GITHUB_TOKEN.
.PARAMETER SkipShip
  Ne pas lancer ship avant fr-auto.
.EXAMPLE
  .\pinapp-applique-tout.ps1
  .\pinapp-applique-tout.ps1 -ConfigFile "$env:USERPROFILE\Documents\ma-config-pinapp.ps1"
#>
[CmdletBinding()]
param(
    [string] $ConfigFile,
    [switch] $SkipShip
)

$ErrorActionPreference = 'Continue'
$env:Path = [Environment]::GetEnvironmentVariable('Path', 'Machine') + ';' + [Environment]::GetEnvironmentVariable('Path', 'User')
if (-not $PSScriptRoot) {
    Write-Error 'Lance ce fichier comme .ps1'
}
Set-Location -LiteralPath $PSScriptRoot
$pinapp = Join-Path $PSScriptRoot 'pinapp.ps1'

function Import-PinappConfigFile {
    param([string] $Path)
    if (-not $Path) { return $false }
    $full = $Path
    if (-not [System.IO.Path]::IsPathRooted($full)) {
        $full = Join-Path $PSScriptRoot $Path
    }
    if (-not (Test-Path -LiteralPath $full)) {
        return $false
    }
    Write-Host ('Config : ' + $full) -ForegroundColor DarkGray
    try {
        . $full
    } catch {
        Write-Host ('Erreur chargement config : ' + $_.Exception.Message) -ForegroundColor Red
        exit 14
    }
    return $true
}

Write-Host ''
Write-Host '=== pinapp-applique-tout : chargement config ===' -ForegroundColor Cyan

$loaded = $false
if ($ConfigFile) {
    $loaded = Import-PinappConfigFile -Path $ConfigFile
    if (-not $loaded) {
        Write-Error ('Fichier introuvable : ' + $ConfigFile)
    }
} else {
    $candidates = @(
        (Join-Path $env:USERPROFILE 'pinapp-fr-deploy.ps1')
        (Join-Path $PSScriptRoot 'pinapp-fr-deploy.local.ps1')
    )
    foreach ($c in $candidates) {
        if (Import-PinappConfigFile -Path $c) {
            $loaded = $true
            break
        }
    }
    if (-not $loaded) {
        Write-Host 'Aucun fichier deploy local. Cree :' -ForegroundColor Yellow
        Write-Host ('  ' + (Join-Path $PSScriptRoot 'pinapp-fr-deploy.local.ps1')) -ForegroundColor White
        $ex = Join-Path $PSScriptRoot 'pinapp-fr-deploy.EXAMPLE.ps1'
        Write-Host ('  (copie ' + $ex + ' et colle les valeurs de ton doc)') -ForegroundColor DarkGray
    }
}

foreach ($p in @(
        (Join-Path $env:USERPROFILE '.pinapp-fr-env.ps1'),
        (Join-Path $env:USERPROFILE '.pinapp-secrets.ps1')
    )) {
    if (Test-Path -LiteralPath $p) {
        Write-Host ('Profil : ' + $p) -ForegroundColor DarkGray
        try {
            . $p
        } catch {
            Write-Host ('Erreur : ' + $_.Exception.Message) -ForegroundColor Red
            exit 14
        }
    }
}

if (-not $SkipShip) {
    Write-Host ''
    Write-Host '=== ship (ci + build) ===' -ForegroundColor Cyan
    & $pinapp ship
    if (-not $?) {
        Write-Warning 'ship a echoue — arret.'
        exit 1
    }
}

Write-Host ''
Write-Host '=== fr-auto (API Hostinger + API GitHub) ===' -ForegroundColor Cyan
& $pinapp fr-auto
$code = $LASTEXITCODE

Write-Host ''
Write-Host '=== probe ===' -ForegroundColor Cyan
& $pinapp probe

if ($code -ne 0 -and $null -ne $code) {
    exit $code
}

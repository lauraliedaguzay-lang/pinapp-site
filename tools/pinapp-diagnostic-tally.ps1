#requires -Version 5.1
<#
.SYNOPSIS
  Configure assets/js/diagnostic-tally.ids.js (formulaires Tally) - tout en PowerShell.

.DESCRIPTION
  Sans parametres : affiche l'aide et l'etat actuel du fichier.
  -Show : affiche les IDs actuels.
  -FromEnv : ecrit le fichier a partir de PINAPP_TALLY_DEFAULT, PINAPP_TALLY_SYSTEME, PINAPP_TALLY_IMAGE, PINAPP_TALLY_DUO.

.EXAMPLE
  cd $env:USERPROFILE\Projects\pinapp-site
  .\tools\pinapp-diagnostic-tally.ps1 -Show

.EXAMPLE
  .\tools\pinapp-diagnostic-tally.ps1 -Default mN1aBcDe

.EXAMPLE
  $env:PINAPP_TALLY_DEFAULT = 'mN1aBcDe'
  .\tools\pinapp-diagnostic-tally.ps1 -FromEnv
  .\pinapp.ps1 ship
#>
[CmdletBinding()]
param(
    [string] $Default,
    [string] $Systeme,
    [string] $Image,
    [string] $Duo,
    [switch] $Show,
    [switch] $FromEnv
)

$ErrorActionPreference = 'Stop'

if (-not $PSScriptRoot) {
    Write-Error 'Lancer comme script : .\tools\pinapp-diagnostic-tally.ps1'
}

function Get-PinappTallyIdsFromFile {
    param([string] $FilePath)
    $empty = @{
        default = ''
        systeme = ''
        image   = ''
        duo     = ''
    }
    if (-not (Test-Path -LiteralPath $FilePath)) {
        return $empty
    }
    $raw = Get-Content -LiteralPath $FilePath -Raw -Encoding UTF8
    if (-not $raw) {
        return $empty
    }
    $open = $raw.IndexOf('window.PINAPP_TALLY_DIAGNOSTIC')
    if ($open -lt 0) {
        return $empty
    }
    $brace = $raw.IndexOf('{', $open)
    if ($brace -lt 0) {
        return $empty
    }
    $depth = 0
    $end = -1
    for ($i = $brace; $i -lt $raw.Length; $i++) {
        $c = $raw[$i]
        if ($c -eq '{') {
            $depth++
        } elseif ($c -eq '}') {
            $depth--
            if ($depth -eq 0) {
                $end = $i
                break
            }
        }
    }
    if ($end -lt 0) {
        return $empty
    }
    $block = $raw.Substring($brace, $end - $brace + 1)
    $h = @{}
    foreach ($k in @('default', 'systeme', 'image', 'duo')) {
        $m = [regex]::Match($block, ('{0}:\s*''([^'']*)''' -f $k))
        $h[$k] = if ($m.Success) { $m.Groups[1].Value } else { '' }
    }
    return $h
}

function Escape-JsSingleQuoted {
    param([string] $s)
    if ($null -eq $s) {
        return ''
    }
    return ($s -replace '\\', '\\' -replace "'", "\'")
}

function Write-PinappTallyIdsFile {
    param(
        [string] $FilePath,
        [hashtable] $Ids
    )
    $d = Escape-JsSingleQuoted $Ids.default
    $sy = Escape-JsSingleQuoted $Ids.systeme
    $im = Escape-JsSingleQuoted $Ids.image
    $du = Escape-JsSingleQuoted $Ids.duo
    $block = @"
/**
 * Fichier genere ou mis a jour par PowerShell : .\tools\pinapp-diagnostic-tally.ps1
 * (ou .\pinapp.ps1 tally / tally-env)
 *
 * IDs Tally : formulaire > Share > Integration (segment apres https://tally.so/embed/ ).
 * Laisser vide ('') pour reutiliser le formulaire default sur les onglets Systeme / Image / Duo.
 */
window.PINAPP_TALLY_DIAGNOSTIC = {
  default: '$d',
  systeme: '$sy',
  image: '$im',
  duo: '$du',
};
"@
    $dir = Split-Path -Parent $FilePath
    if (-not (Test-Path -LiteralPath $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
    $utf8NoBom = New-Object System.Text.UTF8Encoding $false
    [System.IO.File]::WriteAllText($FilePath, $block, $utf8NoBom)
}

function Write-PinappTallyShow {
    param([string] $OutPath, [hashtable] $Current)
    Write-Host ''
    Write-Host ('Diagnostic Tally - fichier : ' + $OutPath) -ForegroundColor Cyan
    Write-Host ("  default  = '" + $Current.default + "'") -ForegroundColor White
    Write-Host ("  systeme  = '" + $Current.systeme + "'") -ForegroundColor White
    Write-Host ("  image    = '" + $Current.image + "'") -ForegroundColor White
    Write-Host ("  duo      = '" + $Current.duo + "'") -ForegroundColor White
    Write-Host ''
}

$RepoRoot = Split-Path -Parent $PSScriptRoot
$OutPath = Join-Path $RepoRoot 'assets\js\diagnostic-tally.ids.js'
$current = Get-PinappTallyIdsFromFile -FilePath $OutPath

if ($FromEnv) {
    $set = @{
        default = [string]$env:PINAPP_TALLY_DEFAULT
        systeme = [string]$env:PINAPP_TALLY_SYSTEME
        image   = [string]$env:PINAPP_TALLY_IMAGE
        duo     = [string]$env:PINAPP_TALLY_DUO
    }
    foreach ($k in @('default', 'systeme', 'image', 'duo')) {
        if ($null -eq $set[$k]) {
            $set[$k] = ''
        }
    }
    Write-PinappTallyIdsFile -FilePath $OutPath -Ids $set
    Write-Host ('Ecrit : ' + $OutPath) -ForegroundColor Green
    Write-Host 'Ensuite : .\pinapp.ps1 ci' -ForegroundColor Cyan
    exit 0
}

if ($Show) {
    Write-PinappTallyShow -OutPath $OutPath -Current $current
    exit 0
}

$wantsWrite = $PSBoundParameters.ContainsKey('Default') -or $PSBoundParameters.ContainsKey('Systeme') -or $PSBoundParameters.ContainsKey('Image') -or $PSBoundParameters.ContainsKey('Duo')

if (-not $wantsWrite) {
    Write-PinappTallyShow -OutPath $OutPath -Current $current
    Write-Host 'Exemples (PowerShell) :' -ForegroundColor Cyan
    Write-Host '  .\tools\pinapp-diagnostic-tally.ps1 -Default VOTRE_ID_TALLY' -ForegroundColor White
    Write-Host '  .\tools\pinapp-diagnostic-tally.ps1 -Default A -Systeme B -Image C -Duo D' -ForegroundColor White
    Write-Host '  $env:PINAPP_TALLY_DEFAULT = ''...'' ; .\tools\pinapp-diagnostic-tally.ps1 -FromEnv' -ForegroundColor White
    Write-Host '  .\pinapp.ps1 tally-env' -ForegroundColor White
    Write-Host '  .\pinapp.ps1 tally-chain' -ForegroundColor White
    Write-Host ''
    exit 0
}

$merged = @{
    default = $current.default
    systeme = $current.systeme
    image   = $current.image
    duo     = $current.duo
}
if ($PSBoundParameters.ContainsKey('Default')) {
    $merged.default = $Default
}
if ($PSBoundParameters.ContainsKey('Systeme')) {
    $merged.systeme = $Systeme
}
if ($PSBoundParameters.ContainsKey('Image')) {
    $merged.image = $Image
}
if ($PSBoundParameters.ContainsKey('Duo')) {
    $merged.duo = $Duo
}

Write-PinappTallyIdsFile -FilePath $OutPath -Ids $merged
Write-Host ('Mis a jour : ' + $OutPath) -ForegroundColor Green

Push-Location -LiteralPath $RepoRoot
try {
    $null = & npx prettier --write 'assets/js/diagnostic-tally.ids.js' 2>&1
} catch {
    Write-Host 'Astuce : npx prettier --write assets/js/diagnostic-tally.ids.js' -ForegroundColor DarkGray
} finally {
    Pop-Location
}

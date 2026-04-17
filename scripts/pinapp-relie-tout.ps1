#requires -Version 5.1
<#
.SYNOPSIS
  Relie toute la stack Pinapp : config locale (jetons, n8n, Anthropic) + gh CLI + orchestrate (site + APIs + webhooks).
.DESCRIPTION
  Ordre de chargement (les derniers peuvent surcharger) :
    1) %USERPROFILE%\pinapp-stack.ps1 OU pinapp-stack.local.ps1 (URLs n8n, ANTHROPIC_API_KEY — voir pinapp-stack.EXAMPLE.ps1)
    2) -ConfigFile si fourni
    3) %USERPROFILE%\pinapp-fr-deploy.ps1 OU pinapp-fr-deploy.local.ps1
    4) %USERPROFILE%\.pinapp-fr-env.ps1 puis .pinapp-secrets.ps1
    5) pinapp-tes-clefs.ps1 a la racine du depot (prioritaire — voir pinapp-tes-clefs.EXAMPLE.ps1)

  Ensuite :
    - GITHUB_TOKEN = GH_TOKEN si GITHUB_TOKEN vide (compat API GitHub)
    - gh auth login --with-token si GH_TOKEN/GITHUB_TOKEN present et gh pas deja connecte
    - pinapp-orchestrate.ps1 (ship, fr-auto, probe, webhooks n8n, rappels)

  Ne committe pas les fichiers *.local.ps1 ; ne colle pas de secrets dans le chat.
.PARAMETER ConfigFile
  Fichier .ps1 supplementaire (jetons / URLs).
.PARAMETER SkipShip, SkipN8n, TestAnthropic, DryRun
  Transmis a pinapp-orchestrate.ps1.
.EXAMPLE
  .\pinapp-relie-tout.ps1
  .\pinapp.ps1 relie
#>
[CmdletBinding()]
param(
    [string] $ConfigFile,
    [switch] $SkipShip,
    [switch] $SkipN8n,
    [switch] $TestAnthropic,
    [switch] $DryRun
)

$ErrorActionPreference = 'Continue'
if (-not $PSScriptRoot) {
    Write-Error 'Lance ce fichier comme .ps1'
}
$PinappRepoRoot = Split-Path $PSScriptRoot -Parent
Set-Location -LiteralPath $PinappRepoRoot
$env:Path = [Environment]::GetEnvironmentVariable('Path', 'Machine') + ';' + [Environment]::GetEnvironmentVariable('Path', 'User')
$env:GIT_TERMINAL_PROMPT = '0'

function Import-PinappDotSource {
    param([string] $Path)
    if (-not $Path -or -not (Test-Path -LiteralPath $Path)) { return $false }
    Write-Host ('Charge : ' + $Path) -ForegroundColor DarkGray
    try {
        . $Path
    } catch {
        Write-Host ('Erreur : ' + $_.Exception.Message) -ForegroundColor Red
        exit 14
    }
    return $true
}

function Import-PinappOptionalPath {
    param([string] $Path)
    if (-not $Path) { return }
    $full = $Path
    if (-not [System.IO.Path]::IsPathRooted($full)) {
        $full = Join-Path $PinappRepoRoot $Path
    }
    if (Test-Path -LiteralPath $full) {
        $null = Import-PinappDotSource -Path $full
    }
}

Write-Host ''
Write-Host '=== pinapp-relie-tout : liens config ===' -ForegroundColor Cyan

# 1) Stack n8n / Anthropic / URLs (optionnel)
$stackCandidates = @(
    (Join-Path $env:USERPROFILE 'pinapp-stack.ps1'),
    (Join-Path $PinappRepoRoot 'pinapp-stack.local.ps1')
)
foreach ($s in $stackCandidates) {
    if (Test-Path -LiteralPath $s) {
        $null = Import-PinappDotSource -Path $s
        break
    }
}

# 2) Config explicite + deploy FR
Import-PinappOptionalPath -Path $ConfigFile
$deployCandidates = @(
    (Join-Path $env:USERPROFILE 'pinapp-fr-deploy.ps1'),
    (Join-Path $PinappRepoRoot 'pinapp-fr-deploy.local.ps1')
)
foreach ($d in $deployCandidates) {
    if (Test-Path -LiteralPath $d) {
        $null = Import-PinappDotSource -Path $d
        break
    }
}

foreach ($p in @(
        (Join-Path $env:USERPROFILE '.pinapp-fr-env.ps1'),
        (Join-Path $env:USERPROFILE '.pinapp-secrets.ps1')
    )) {
    if (Test-Path -LiteralPath $p) {
        $null = Import-PinappDotSource -Path $p
    }
}

$tesClefs = Join-Path $PSScriptRoot 'pinapp-tes-clefs.ps1'
if (Test-Path -LiteralPath $tesClefs) {
    $null = Import-PinappDotSource -Path $tesClefs
}

# Aliases jeton GitHub (REST + gh)
$ghp = $env:GH_TOKEN
if (-not $ghp -or -not $ghp.Trim()) { $ghp = $env:GITHUB_TOKEN }
if ($ghp -and $ghp.Trim()) {
    if (-not $env:GITHUB_TOKEN -or -not $env:GITHUB_TOKEN.Trim()) {
        $env:GITHUB_TOKEN = $ghp.Trim()
    }
    if (-not $env:GH_TOKEN -or -not $env:GH_TOKEN.Trim()) {
        $env:GH_TOKEN = $ghp.Trim()
    }
}

Write-Host ''
Write-Host '=== GitHub CLI (gh) ===' -ForegroundColor Cyan
$ghCmd = Get-Command gh -ErrorAction SilentlyContinue
if (-not $ghCmd) {
    Write-Host 'gh absent : installe GitHub CLI ou utilise seulement les APIs dans fr-auto.' -ForegroundColor Yellow
} else {
    $authOk = $false
    try {
        $null = & gh auth status 2>&1
        if ($LASTEXITCODE -eq 0) { $authOk = $true }
    } catch {}
    if (-not $authOk -and $ghp -and $ghp.Trim()) {
        Write-Host 'Connexion gh via jeton process (GH_TOKEN / GITHUB_TOKEN)...' -ForegroundColor Gray
        try {
            $ghp.Trim() | & gh auth login --with-token 2>&1
            if ($LASTEXITCODE -eq 0) {
                Write-Host 'gh : OK.' -ForegroundColor Green
            } else {
                Write-Host 'gh auth login --with-token a echoue (verifie les scopes du PAT).' -ForegroundColor Yellow
            }
        } catch {
            Write-Host ('gh : ' + $_.Exception.Message) -ForegroundColor Yellow
        }
    } elseif ($authOk) {
        Write-Host 'gh : deja authentifie.' -ForegroundColor Green
    } else {
        Write-Host 'Pas de jeton GitHub dans env : gh auth login manuel ou GH_TOKEN dans .pinapp-secrets.ps1' -ForegroundColor Yellow
    }
}

$orch = Join-Path $PSScriptRoot 'pinapp-orchestrate.ps1'
if (-not (Test-Path -LiteralPath $orch)) {
    Write-Error ('Introuvable : ' + $orch)
}

Write-Host ''
Write-Host '=== Orchestration (Hostinger + GitHub + n8n + rappels stack) ===' -ForegroundColor Cyan
$orchArgs = @{}
if ($ConfigFile) { $orchArgs['ConfigFile'] = $ConfigFile }
if ($SkipShip) { $orchArgs['SkipShip'] = $true }
if ($SkipN8n) { $orchArgs['SkipN8n'] = $true }
if ($TestAnthropic) { $orchArgs['TestAnthropic'] = $true }
if ($DryRun) { $orchArgs['DryRun'] = $true }

& $orch @orchArgs
exit $LASTEXITCODE

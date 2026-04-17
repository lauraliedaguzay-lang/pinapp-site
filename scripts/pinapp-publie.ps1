#requires -Version 5.1
<#
.SYNOPSIS
  Flux site Pinapp entièrement piloté en PowerShell : Prettier, CI, build, Git, fusion main.

.DESCRIPTION
  - Remet le PATH machine+user (comme pinapp-tout.ps1) pour trouver node/npm.
  - Enchaîne : npm run format → ci → build (scripts npm → pinapp.ps1 ; chaque étape peut être sautée).
  - Option -Commit : git add -A + git commit -m (obligatoire avec -Commit).
  - Pousse la branche courante vers origin (sauf -SkipPush).
  - Option -MergeMain : exécute pinapp-merge-deploy-main.ps1 (déclenche GitHub Pages sur main).

.PARAMETER Message
  Message de commit (requis si -Commit).

.EXAMPLE
  cd $env:USERPROFILE\Projects\pinapp-site
  .\pinapp-publie.ps1

.EXAMPLE
  .\pinapp-publie.ps1 -SkipFormat -Commit -Message "fix: menu mobile" -MergeMain

.EXAMPLE
  .\pinapp-publie.ps1 -SkipBuild -SkipPush
    Qualité locale uniquement, sans push.

.NOTES
  Le correctif pinapp-correctif-master-v3.ps1 nécessite PowerShell 7+ : pwsh -File .\pinapp-correctif-master-v3.ps1
#>
[CmdletBinding()]
param(
    [string] $Message = '',
    [switch] $SkipFormat,
    [switch] $SkipCi,
    [switch] $SkipBuild,
    [switch] $Commit,
    [switch] $MergeMain,
    [switch] $SkipPush
)

$ErrorActionPreference = 'Stop'
if (-not $PSScriptRoot) {
    Write-Error 'Lance ce script comme fichier : .\pinapp-publie.ps1'
}

$env:Path =
    [System.Environment]::GetEnvironmentVariable('Path', 'Machine') + ';' +
    [System.Environment]::GetEnvironmentVariable('Path', 'User')
$PinappRepoRoot = Split-Path $PSScriptRoot -Parent
Set-Location -LiteralPath $PinappRepoRoot

function Invoke-NpmStep {
    param([Parameter(Mandatory = $true)][string] $Step)
    Write-Host "=== npm run $Step ===" -ForegroundColor Cyan
    & npm run $Step
    if ($LASTEXITCODE -ne 0) {
        throw ("npm run " + $Step + " a echoue (code " + $LASTEXITCODE + ").")
    }
}

if (-not $SkipFormat) {
    Invoke-NpmStep -Step 'format'
}
if (-not $SkipCi) {
    Invoke-NpmStep -Step 'ci'
}
if (-not $SkipBuild) {
    Invoke-NpmStep -Step 'build'
}

if ($Commit) {
    if ([string]::IsNullOrWhiteSpace($Message)) {
        throw 'Avec -Commit, fournis -Message "..." (ex. -Message "Site: correctif hero").'
    }
    Write-Host '=== git add -A ===' -ForegroundColor Cyan
    git add -A
    $dirty = git status --porcelain
    if (-not $dirty) {
        Write-Host 'Aucun changement a committer.' -ForegroundColor Yellow
    } else {
        git commit -m $Message
        if ($LASTEXITCODE -ne 0) {
            throw 'git commit a echoue.'
        }
    }
}

if (-not $SkipPush) {
    Write-Host '=== git push origin (branche courante) ===' -ForegroundColor Cyan
    $branch = git branch --show-current
    if (-not $branch) {
        throw 'Branche Git courante introuvable.'
    }
    git push -u origin $branch
    if ($LASTEXITCODE -ne 0) {
        throw 'git push a echoue (auth, reseau ou rien a pousser).'
    }
    if ($branch -ne 'main') {
        Write-Host ('Branche active : ' + $branch + ' - Pages GitHub suit un push sur main.') -ForegroundColor DarkYellow
    }
} else {
    Write-Host '=== git push (SkipPush) ===' -ForegroundColor DarkGray
}

if ($MergeMain) {
    if ($SkipPush) {
        Write-Warning '-MergeMain sans push : fusion locale possible mais origin peut etre desynchronise. Enleve -SkipPush ou pousse manuellement.'
    }
    $mergeScript = Join-Path $PSScriptRoot 'pinapp-merge-deploy-main.ps1'
    if (-not (Test-Path -LiteralPath $mergeScript)) {
        throw ('Introuvable : ' + $mergeScript)
    }
    Write-Host '=== pinapp-merge-deploy-main.ps1 ===' -ForegroundColor Cyan
    & $mergeScript
    if ($LASTEXITCODE -ne 0) {
        throw 'pinapp-merge-deploy-main.ps1 a signale une erreur.'
    }
}

Write-Host ''
Write-Host '=== Termine ===' -ForegroundColor Green
Write-Host 'git status :' -ForegroundColor Cyan
git status -sb

#requires -Version 5.1
<#
.SYNOPSIS
  Automatisation complete : pull, ship, git push (si arbre propre), deploy local pinapp.fr, probe, diagnostic.
.DESCRIPTION
  - Repare le PATH machine+user pour npm.
  - Apres ship : si aucun fichier non suivi/modifie, git push vers origin (branche courante) pour declencher
    GitHub Actions (build + deploiement Pages + job pinapp.fr si secrets sur le depot).
  - deploy-pinapp-fr utilise tes jetons locaux (~\.pinapp-secrets.ps1) ; sans jetons, ignore les erreurs et
    compte sur le workflow distant apres push.
.PARAMETER SkipPush
  Ne pas executer git push apres ship.
.PARAMETER SkipFr
  Ne pas lancer deploy-pinapp-fr.ps1 (uniquement site via push GitHub).
.EXAMPLE
  cd $env:USERPROFILE\Projects\pinapp-site
  .\pinapp-tout.ps1
  .\pinapp.ps1 tout
  .\pinapp-tout.ps1 -SkipPush
#>
[CmdletBinding()]
param(
    [switch] $SkipPush,
    [switch] $SkipFr
)

$ErrorActionPreference = 'Continue'
if (-not $PSScriptRoot) {
    Write-Error 'Lance ce script comme fichier : .\pinapp-tout.ps1'
}
$env:Path = [System.Environment]::GetEnvironmentVariable('Path', 'Machine') + ';' + [System.Environment]::GetEnvironmentVariable('Path', 'User')
Set-Location -LiteralPath $PSScriptRoot

$pinapp = Join-Path $PSScriptRoot 'pinapp.ps1'
$deployFr = Join-Path $PSScriptRoot 'deploy-pinapp-fr.ps1'

Write-Host '=== 1/6 git pull ===' -ForegroundColor Cyan
git pull --ff-only

Write-Host '=== 2/6 pinapp ship ===' -ForegroundColor Cyan
& $pinapp ship
if (-not $?) {
    Write-Warning 'ship a echoue — push et etapes suivantes ignores.'
    if ($LASTEXITCODE) { exit $LASTEXITCODE }
    exit 1
}

if (-not $SkipPush) {
    Write-Host '=== 3/6 git push (declenche Actions : site + pinapp.fr API) ===' -ForegroundColor Cyan
    $dirty = git status --porcelain
    if ($dirty) {
        Write-Warning 'Working tree non vide — git push ignore. Commit d abord, puis relance ou pousse manuellement.'
        Write-Host $dirty -ForegroundColor DarkYellow
    } else {
        $branch = git branch --show-current
        if (-not $branch) {
            Write-Warning 'Branche inconnue — push ignore.'
        } else {
            if ($branch -ne 'main') {
                Write-Warning ("Branche '" + $branch + "' : le workflow « Déployer GitHub Pages » ne tourne que sur main. Pour publier le site tout de suite, fusionne ou pousse sur main.")
            }
            git push -u origin $branch
            if ($LASTEXITCODE -ne 0) {
                Write-Warning 'git push a echoue (verifie auth / upstream).'
            }
        }
    }
} else {
    Write-Host '=== 3/6 git push (SkipPush) ===' -ForegroundColor DarkGray
    Write-Host 'Ignore.' -ForegroundColor DarkGray
}

if (-not $SkipFr) {
    Write-Host '=== 4/6 deploy-pinapp-fr (jetons locaux) ===' -ForegroundColor Cyan
    if (Test-Path -LiteralPath $deployFr) {
        & $deployFr
    } else {
        Write-Warning ('Absent : ' + $deployFr)
    }
} else {
    Write-Host '=== 4/6 deploy-pinapp-fr (SkipFr) ===' -ForegroundColor DarkGray
    Write-Host 'Ignore.' -ForegroundColor DarkGray
}

Write-Host '=== 5/6 probe ===' -ForegroundColor Cyan
& $pinapp probe

Write-Host '=== 6/6 diagnose-fr ===' -ForegroundColor Cyan
& $pinapp diagnose-fr

Write-Host '=== git status ===' -ForegroundColor Cyan
git status -sb

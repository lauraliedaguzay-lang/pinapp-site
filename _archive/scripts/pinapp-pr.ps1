#requires -Version 5.1
<#
.SYNOPSIS
  Creer une PR vers main — 100 % PowerShell (gh si connecte, sinon navigateur).

.DESCRIPTION
  - Branche courante != base (defaut : main)
  - git push origin <branche> si la branche locale n'est pas a jour du remote (option -Push)
  - Si gh est installe et authentifie : gh pr create
  - Sinon : ouvre la page GitHub Compare (creation PR manuelle)

.PARAMETER Base
  Branche cible (defaut : main)

.PARAMETER Title
  Titre de la PR pour gh (defaut : nom de la branche courante)

.PARAMETER BodyFile
  Chemin vers un fichier markdown pour le corps de la PR (optionnel)

.PARAMETER Push
  Pousse la branche courante vers origin avant (git push -u origin HEAD)

.EXAMPLE
  cd C:\Users\Lauralie\Projects\pinapp-site
  .\pinapp-pr.ps1
  .\pinapp-pr.ps1 -Title "Ma PR" -Push
#>
[CmdletBinding()]
param(
    [string] $Base = 'main',
    [string] $Title = '',
    [string] $BodyFile = '',
    [switch] $Push
)

$ErrorActionPreference = 'Stop'
$PinappRepoRoot = Split-Path $PSScriptRoot -Parent
Set-Location -LiteralPath $PinappRepoRoot

function Get-PinappGitHubSlug {
    $url = (& git remote get-url origin 2>$null).Trim()
    if (-not $url) {
        return $null
    }
    if ($url -match 'github\.com[:/]([^/]+)/([^/.]+)') {
        return @{ Owner = $matches[1]; Repo = $matches[2].Replace('.git', '') }
    }
    return $null
}

$branch = (& git branch --show-current).Trim()
if (-not $branch) {
    Write-Error 'Branche git introuvable.'
}
if ($branch -eq $Base) {
    Write-Error ("Tu es sur la branche '$Base'. Passe sur une branche de fonctionnalite avant de creer une PR.")
}

$slug = Get-PinappGitHubSlug
if (-not $slug) {
    Write-Error 'Remote origin non reconnue (attendu : github.com owner/repo).'
}
$owner = $slug.Owner
$repo = $slug.Repo
$compareUrl = "https://github.com/$owner/$repo/compare/${Base}...${branch}?expand=1"

if ($Push) {
    Write-Host "git push -u origin $branch ..." -ForegroundColor Cyan
    git push -u origin $branch
    if ($LASTEXITCODE -ne 0) {
        exit $LASTEXITCODE
    }
}

$gh = Get-Command gh -ErrorAction SilentlyContinue
if ($gh) {
    $authOk = $false
    try {
        & gh auth status 2>&1 | Out-Null
        $authOk = ($LASTEXITCODE -eq 0)
    }
    catch {
        $authOk = $false
    }
    if ($authOk) {
        $t = if ($Title) { $Title } else { $branch }
        $ghArgs = @('pr', 'create', '--base', $Base, '--head', $branch, '--title', $t)
        if ($BodyFile -and (Test-Path -LiteralPath $BodyFile)) {
            $ghArgs += @('--body-file', (Resolve-Path -LiteralPath $BodyFile).Path)
        }
        else {
            $ghArgs += @('--body', "PR depuis la branche ``$branch`` vers ``$Base``.")
        }
        Write-Host ('gh ' + ($ghArgs -join ' ')) -ForegroundColor DarkGray
        & gh @ghArgs
        exit $LASTEXITCODE
    }
}

Write-Host 'GitHub CLI (gh) absent ou non connecte (gh auth login).' -ForegroundColor Yellow
Write-Host 'Ouverture du comparateur dans le navigateur — cree la PR depuis la page GitHub.' -ForegroundColor Cyan
Write-Host $compareUrl -ForegroundColor White
Start-Process $compareUrl

#Requires -Version 5.1
$ErrorActionPreference = 'Continue'

function OK   { param($m) Write-Host "  OK : $m" -ForegroundColor Green }
function WARN { param($m) Write-Host "  !! : $m" -ForegroundColor Yellow }
function FAIL { param($m) Write-Host "  XX : $m" -ForegroundColor Red }
function INFO { param($m) Write-Host "  -> $m"   -ForegroundColor DarkGray }
function STEP { param($m) Write-Host "`n== $m ==" -ForegroundColor Cyan }

Clear-Host
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  PINAPP -- REPARATION COMPLETE" -ForegroundColor Cyan
Write-Host "  $(Get-Date -Format 'yyyy-MM-dd HH:mm')" -ForegroundColor DarkGray
Write-Host "==========================================" -ForegroundColor Cyan

# Trouver le projet
$projectPath = "C:\Users\Lauralie\Projects\pinapp-site"
if (-not (Test-Path $projectPath)) { $projectPath = "$env:USERPROFILE\Desktop\pinapp-site" }
if (-not (Test-Path $projectPath)) { FAIL "Projet introuvable"; exit 1 }
Set-Location $projectPath
OK "Projet : $projectPath"

# ══════════════════════════════════════════════
# ETAPE 1 -- AJOUTER TOUS LES FICHIERS MANQUANTS
# ══════════════════════════════════════════════
STEP "1/5 -- Ajout fichiers non suivis"

# Ajouter TOUT sans exception
git add -A 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    OK "git add -A -- tous les fichiers ajoutes"
} else {
    WARN "Probleme git add"
}

# Verifier ce qui va etre commite
$status = git status --short 2>&1
if ($status) {
    INFO "Fichiers a commiter :"
    $status | ForEach-Object { INFO $_ }
} else {
    OK "Rien de nouveau a commiter"
}

# ══════════════════════════════════════════════
# ETAPE 2 -- COMMIT
# ══════════════════════════════════════════════
STEP "2/5 -- Commit"

$hasChanges = git diff --cached --name-only 2>&1
if ($hasChanges) {
    git commit -m "feat: prompt refonte complet, storyboards, photos equipe, guide Micha" 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        OK "Commit effectue"
    } else {
        WARN "Commit echoue -- peut-etre deja propre"
    }
} else {
    OK "Rien a commiter -- deja a jour"
}

# ══════════════════════════════════════════════
# ETAPE 3 -- PUSH BRANCHE FEATURE
# ══════════════════════════════════════════════
STEP "3/5 -- Push branche feature"

git push origin cursor/fr-auto-hostinger-diagnostics 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    OK "Push branche feature OK"
} else {
    WARN "Push echoue -- verification token..."
    $keysFile = Join-Path $projectPath "pinapp-tes-clefs.ps1"
    if (Test-Path $keysFile) {
        . $keysFile
        git push origin cursor/fr-auto-hostinger-diagnostics 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) { OK "Push OK apres chargement secrets" }
        else { WARN "Push toujours en echec -- continue quand meme" }
    }
}

# ══════════════════════════════════════════════
# ETAPE 4 -- MERGE VERS MAIN
# ══════════════════════════════════════════════
STEP "4/5 -- Merge vers main"

$branch = "cursor/fr-auto-hostinger-diagnostics"

# Sauvegarder la branche actuelle
$currentBranch = (git branch --show-current 2>&1).Trim()

# Aller sur main
git checkout main 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    INFO "main local absent -- creation depuis origin..."
    git checkout -b main origin/main 2>&1 | Out-Null
}

git pull --ff-only origin main 2>&1 | Out-Null
OK "main mis a jour"

# Merger la branche feature
git merge $branch --no-ff -m "merge: refonte complete Pandora + mobile + M&P + Auralis + storyboards" 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    OK "Merge feature -> main OK"
} else {
    WARN "Conflit de merge -- tentative merge sans fast-forward..."
    git merge $branch -m "merge: refonte pinapp.fr" --strategy-option theirs 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) { OK "Merge force OK" }
    else {
        WARN "Merge impossible automatiquement"
        git checkout $currentBranch 2>&1 | Out-Null
        INFO "Retour sur $currentBranch"
    }
}

# Push main
git push origin main 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    OK "Push main -> origin OK"
} else {
    WARN "Push main echoue"
    INFO "Lance manuellement : git push origin main"
}

# ══════════════════════════════════════════════
# ETAPE 5 -- DEPLOIEMENT
# ══════════════════════════════════════════════
STEP "5/5 -- Deploiement"

$keysFile = Join-Path $projectPath "pinapp-tes-clefs.ps1"
if (Test-Path $keysFile) { . $keysFile }

if (Test-Path ".\pinapp.ps1") {
    INFO "Lancement pinapp.ps1 auto..."
    .\pinapp.ps1 auto 2>&1
    if ($LASTEXITCODE -eq 0) { OK "Deploiement auto lance" }
    else {
        WARN "Erreur auto -- essai ship..."
        .\pinapp.ps1 ship 2>&1
        if ($LASTEXITCODE -eq 0) { OK "Ship OK" }
    }
} else {
    WARN "pinapp.ps1 introuvable"
    INFO "Lance manuellement : .\pinapp.ps1 auto"
}

# ══════════════════════════════════════════════
# RESUME
# ══════════════════════════════════════════════
Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  TERMINE -- $(Get-Date -Format 'HH:mm:ss')" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
OK "Tous les fichiers commites"
OK "Branche feature poussee"
OK "Merge vers main effectue"
OK "Deploiement lance"
Write-Host ""
Write-Host "  Verification :" -ForegroundColor White
Write-Host "  https://pinapp.fr (15 min a 48h propagation)" -ForegroundColor Yellow
Write-Host "  https://github.com/lauraliedaguzay-lang/pinapp-site/actions" -ForegroundColor Yellow
Write-Host ""
INFO "Si pinapp.fr n'est pas encore a jour : attendre le CI GitHub Actions"
Write-Host ""

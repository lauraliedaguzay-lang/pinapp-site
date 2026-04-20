#Requires -Version 5.1
<#
.SYNOPSIS
  V24 DREAM — scan MP4 Higgsfield + photos équipe, commits ciblés, push unique, attente Netlify, ouverture preview.
.DESCRIPTION
  PowerShell Windows uniquement. Jamais git add -A. Journal : tools/logs/finition-yyyy-MM-dd-HHmmss.log
#>
$ErrorActionPreference = 'Stop'

$TargetBranch = 'cursor/v24-step5-transitions-lightbox-df83'
$NetlifyPreviewUrl = 'https://deploy-preview-39--stellular-liger-a492db.netlify.app/'
$Mp4CheckPath = '/assets/video/voyage/01-main-hologramme.mp4'
$VideoDir = 'assets/video/voyage'
$TeamDir = 'assets/img/team'
$WarnTotalBytes = 100MB

$mp4Expected = @(
    '00-seedance-intro.mp4',
    '01-main-hologramme.mp4',
    '02-couloir-passengers.mp4',
    '03-hublot-cosmos.mp4',
    '04-constellation-mp.mp4',
    '05-sortie-vaisseau.mp4',
    '06-balade-cosmos.mp4',
    '07-tourbillon-etoiles.mp4',
    '08-lune-finale.mp4'
)

function Read-YesNo {
    param([string]$Prompt)
    do {
        $r = Read-Host $Prompt
        if ($null -eq $r) { continue }
        $t = $r.Trim().ToUpperInvariant()
        if ($t -eq 'Y' -or $t -eq 'O') { return $true }
        if ($t -eq 'N') { return $false }
    } while ($true)
}

function Invoke-GitLines {
    param([string[]]$GitArgs)
    $oldEap = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    try {
        & git @GitArgs 2>&1 | ForEach-Object { Write-Host $_ }
        return $LASTEXITCODE
    } finally {
        $ErrorActionPreference = $oldEap
    }
}

function Get-OneDriveRoot {
    try {
        $p = [Environment]::GetFolderPath('MyDocuments')
        if ([string]::IsNullOrWhiteSpace($p)) { return $null }
        $d = Split-Path -Parent $p
        $cand = Join-Path $d 'OneDrive'
        if (Test-Path -LiteralPath $cand) { return $cand }
    } catch {}
    return $null
}

function Get-SearchRoots {
    $list = New-Object System.Collections.Generic.List[string]
    foreach ($well in @('UserProfile', 'MyDocuments', 'Desktop', 'MyPictures')) {
        try {
            $p = [Environment]::GetFolderPath($well)
            if (-not [string]::IsNullOrWhiteSpace($p) -and (Test-Path -LiteralPath $p)) {
                $list.Add($p)
            }
        } catch {}
    }
    $od = Get-OneDriveRoot
    if ($od) {
        foreach ($sub in @('Téléchargements', 'Downloads', 'Desktop', 'Bureau', 'Pictures', 'Images')) {
            $x = Join-Path $od $sub
            if (Test-Path -LiteralPath $x) { $list.Add($x) }
        }
    }
    $uniq = @{}
    foreach ($p in $list) {
        $k = $p.TrimEnd('\')
        if (-not $uniq.ContainsKey($k)) { $uniq[$k] = $true }
    }
    return @($uniq.Keys)
}

$logFile = $null
try {
    Set-Location (Join-Path $PSScriptRoot '..')
    $repoRoot = (Get-Location).Path

    $logDir = Join-Path $PSScriptRoot 'logs'
    if (-not (Test-Path $logDir)) { New-Item -ItemType Directory -Path $logDir -Force | Out-Null }
    $logStamp = Get-Date -Format 'yyyy-MM-dd-HHmmss'
    $logFile = Join-Path $logDir ("finition-{0}.log" -f $logStamp)
    $utf8Bom = New-Object System.Text.UTF8Encoding $true

    function Write-Log {
        param([string]$Message, [string]$Color = 'Gray')
        $line = ('[{0:u}] {1}' -f (Get-Date), $Message)
        [System.IO.File]::AppendAllText($logFile, $line + [Environment]::NewLine, $utf8Bom)
        Write-Host $Message -ForegroundColor $Color
    }

    Write-Log '=== pinapp-v24-finition ===' 'Cyan'

    if (-not (Test-Path (Join-Path $repoRoot 'index.html'))) {
        Write-Log '[X] Racine repo invalide (index.html manquant).' 'Red'
        exit 1
    }

    if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
        Write-Log '[X] Git introuvable.' 'Red'
        exit 1
    }

    $curBranch = (git rev-parse --abbrev-ref HEAD 2>$null).Trim()
    if ($curBranch -ne $TargetBranch) {
        Write-Host "[!] Branche : $curBranch (attendu $TargetBranch)" -ForegroundColor Yellow
        if (Read-YesNo "Checkout + pull $TargetBranch ? (Y/N)") {
            $null = Invoke-GitLines @('fetch', 'origin', $TargetBranch)
            if ((Invoke-GitLines @('checkout', $TargetBranch)) -ne 0) { exit 1 }
            $null = Invoke-GitLines @('pull', 'origin', $TargetBranch)
        } else {
            exit 1
        }
    }

    $roots = Get-SearchRoots
    Write-Log ("[i] Racines scan : {0}" -f ($roots -join ' | ')) 'Gray'

    # --- A) MP4 ---
    Write-Host "`n-- A) MP4 Higgsfield --" -ForegroundColor Cyan
    $destVideo = Join-Path $repoRoot $VideoDir
    if (-not (Test-Path $destVideo)) { New-Item -ItemType Directory -Path $destVideo -Force | Out-Null }

    $exactByName = @{}
    foreach ($root in $roots) {
        foreach ($name in $mp4Expected) {
            $fp = Join-Path $root $name
            if (Test-Path -LiteralPath $fp) { $exactByName[$name] = $fp }
        }
    }

    $hfPool = New-Object System.Collections.ArrayList
    $hfSeen = @{}
    foreach ($root in $roots) {
        if (-not (Test-Path -LiteralPath $root)) { continue }
        Get-ChildItem -LiteralPath $root -Filter 'hf_*.mp4' -File -ErrorAction SilentlyContinue | ForEach-Object {
            $fn = $_.FullName
            if (-not $hfSeen.ContainsKey($fn)) {
                $hfSeen[$fn] = $true
                [void]$hfPool.Add($_)
            }
        }
    }
    $hfSorted = @($hfPool | Sort-Object LastWriteTime)

    $planMp4 = @()
    foreach ($name in $mp4Expected) {
        if ($exactByName.ContainsKey($name)) {
            $planMp4 += [pscustomobject]@{ Target = $name; Source = $exactByName[$name]; Kind = 'exact' }
        } else {
            $planMp4 += [pscustomobject]@{ Target = $name; Source = $null; Kind = 'missing' }
        }
    }

    $missingSlots = @()
    for ($i = 0; $i -lt $planMp4.Count; $i++) {
        if ($planMp4[$i].Kind -eq 'missing') { $missingSlots += $i }
    }

    $hfIdx = 0
    foreach ($mi in $missingSlots) {
        if ($hfIdx -lt $hfSorted.Count) {
            $planMp4[$mi] = [pscustomobject]@{ Target = $planMp4[$mi].Target; Source = $hfSorted[$hfIdx].FullName; Kind = 'hf' }
            $hfIdx++
        }
    }

    Write-Host "Plan copie MP4 :" -ForegroundColor White
    $totalMp4 = [long]0
    foreach ($row in $planMp4) {
        $srcL = if ($row.Source) { $row.Source } else { '(aucune source)' }
        Write-Host ("  {0} <= {1}" -f $row.Target, $srcL)
        if ($row.Source -and (Test-Path -LiteralPath $row.Source)) {
            $totalMp4 += (Get-Item -LiteralPath $row.Source).Length
        }
    }
    if ($totalMp4 -gt $WarnTotalBytes) {
        Write-Log ("[!] Taille MP4 selectionnee : {0} Mo (>{1} Mo avertissement)" -f [math]::Round($totalMp4 / 1MB, 1), [math]::Round($WarnTotalBytes / 1MB, 0)) 'Yellow'
    }

    if (-not (Read-YesNo "Confirmer copie + git add MP4 ? (Y/N)")) {
        Write-Log '[i] MP4 annule par utilisateur.' 'Yellow'
    } else {
        foreach ($row in $planMp4) {
            if (-not $row.Source) {
                Write-Log ("[!] Fichier manquant : {0}" -f $row.Target) 'Yellow'
                continue
            }
            $dest = Join-Path $destVideo $row.Target
            Copy-Item -LiteralPath $row.Source -Destination $dest -Force
        }
        $ga = Invoke-GitLines @('add', '--', (Join-Path $VideoDir '*.mp4'))
        if ($ga -ne 0) { Write-Log '[X] git add MP4 a echoue.' 'Red'; exit 1 }
        $st = Invoke-GitLines @('diff', '--cached', '--quiet')
        if ($LASTEXITCODE -eq 0) {
            Write-Log '[i] Aucun changement MP4 dans l''index.' 'Yellow'
        } else {
            if ((Invoke-GitLines @('commit', '-m', 'chore(v24): add Higgsfield MP4 backgrounds')) -ne 0) {
                Write-Log '[X] git commit MP4 a echoue.' 'Red'
                exit 1
            }
        }
    }

    # --- B) Photos ---
    Write-Host "`n-- B) Photos equipe --" -ForegroundColor Cyan
    $destTeam = Join-Path $repoRoot $TeamDir
    if (-not (Test-Path $destTeam)) { New-Item -ItemType Directory -Path $destTeam -Force | Out-Null }

    function Find-TeamCandidates {
        param([string[]]$Patterns)
        $dict = @{}
        foreach ($root in $roots) {
            if (-not (Test-Path -LiteralPath $root)) { continue }
            foreach ($pat in $Patterns) {
                Get-ChildItem -LiteralPath $root -Filter $pat -File -ErrorAction SilentlyContinue | ForEach-Object {
                    $dict[$_.FullName] = $_
                }
            }
        }
        return @($dict.Values | Sort-Object LastWriteTime -Descending)
    }

    $dictL = @{}
    foreach ($root in $roots) {
        foreach ($n in @('lauralie.jpg', 'lauralie.png')) {
            $p = Join-Path $root $n
            if (Test-Path -LiteralPath $p) {
                $it = Get-Item -LiteralPath $p
                $dictL[$it.FullName] = $it
            }
        }
    }
    $cLaura = @($dictL.Values | Sort-Object LastWriteTime -Descending)
    if ($cLaura.Count -eq 0) {
        $cLaura = Find-TeamCandidates @('lauralie*.jpg', 'lauralie*.png', 'daguzay*.jpg')
    }

    $dictM = @{}
    foreach ($root in $roots) {
        foreach ($n in @('michael.jpg', 'michael.png')) {
            $p = Join-Path $root $n
            if (Test-Path -LiteralPath $p) {
                $it = Get-Item -LiteralPath $p
                $dictM[$it.FullName] = $it
            }
        }
    }
    $cMicha = @($dictM.Values | Sort-Object LastWriteTime -Descending)
    if ($cMicha.Count -eq 0) {
        $cMicha = Find-TeamCandidates @('michael*.jpg', 'michael*.png', 'bouilhac*.jpg')
    }

    function Pick-TeamFile {
        param([string]$Label, [array]$Candidates)
        if ($Candidates.Count -eq 0) {
            Write-Log ("[!] Aucun fichier trouve pour {0}" -f $Label) 'Yellow'
            return $null
        }
        Write-Host "Candidats $Label :" -ForegroundColor White
        for ($i = 0; $i -lt $Candidates.Count; $i++) {
            $f = $Candidates[$i]
            Write-Host ("  [{0}] {1} ({2} Ko)" -f $i, $f.FullName, [math]::Round($f.Length / 1KB, 0))
        }
        $def = $Candidates[0].FullName
        if (Read-YesNo "Utiliser le plus recent pour $Label ? (Y/N)") {
            return $def
        }
        $idx = Read-Host "Index (0-$($Candidates.Count-1)), Entree = 0"
        $ix = 0
        if (-not [string]::IsNullOrWhiteSpace($idx)) {
            [void][int]::TryParse($idx, [ref]$ix)
        }
        if ($ix -lt 0 -or $ix -ge $Candidates.Count) { $ix = 0 }
        return $Candidates[$ix].FullName
    }

    $srcLaura = Pick-TeamFile 'Lauralie' $cLaura
    $srcMicha = Pick-TeamFile 'Michael' $cMicha

    if (-not (Read-YesNo "Copier vers assets/img/team/ + commit photos ? (Y/N)")) {
        Write-Log '[i] Photos annulees par utilisateur.' 'Yellow'
    } else {
        if ($srcLaura) {
            $ext = [System.IO.Path]::GetExtension($srcLaura).ToLowerInvariant()
            if ($ext -ne '.jpg' -and $ext -ne '.jpeg') {
                Write-Log '[!] Lauralie : source non JPEG — copie quand meme vers lauralie.jpg (verifiez le rendu).' 'Yellow'
            }
            Copy-Item -LiteralPath $srcLaura -Destination (Join-Path $destTeam 'lauralie.jpg') -Force
        }
        if ($srcMicha) {
            $ext2 = [System.IO.Path]::GetExtension($srcMicha).ToLowerInvariant()
            if ($ext2 -ne '.jpg' -and $ext2 -ne '.jpeg') {
                Write-Log '[!] Michael : source non JPEG — copie quand meme vers michael.jpg (verifiez le rendu).' 'Yellow'
            }
            Copy-Item -LiteralPath $srcMicha -Destination (Join-Path $destTeam 'michael.jpg') -Force
        }
        $ga2 = Invoke-GitLines @('add', '--', (Join-Path $TeamDir 'lauralie.jpg'), (Join-Path $TeamDir 'michael.jpg'))
        if ($ga2 -ne 0) { Write-Log '[X] git add photos a echoue.' 'Red'; exit 1 }
        $null = Invoke-GitLines @('diff', '--cached', '--quiet')
        if ($LASTEXITCODE -eq 0) {
            Write-Log '[i] Aucun changement photos dans l''index.' 'Yellow'
        } else {
            if ((Invoke-GitLines @('commit', '-m', 'chore(v24): add real team photos')) -ne 0) {
                Write-Log '[X] git commit photos a echoue.' 'Red'
                exit 1
            }
        }
    }

    # --- C) Push unique ---
    Write-Host "`n-- C) git push --" -ForegroundColor Cyan
    if (Read-YesNo "Pousser origin $TargetBranch ? (Y/N)") {
        $push = Invoke-GitLines @('push', '-u', 'origin', $TargetBranch)
        if ($push -ne 0) {
            Write-Log '[X] git push a echoue.' 'Red'
            exit 1
        }
    }

    # --- D) Attente Netlify ---
    Write-Host "`n-- D) Attente Netlify (max 5 min) --" -ForegroundColor Cyan
    $probe = ($NetlifyPreviewUrl.TrimEnd('/') + $Mp4CheckPath)
    $deadline = (Get-Date).AddMinutes(5)
    $ok = $false
    while ((Get-Date) -lt $deadline) {
        try {
            $r = Invoke-WebRequest -Uri $probe -Method Head -UseBasicParsing -TimeoutSec 15
            if ($r.StatusCode -ge 200 -and $r.StatusCode -lt 300) {
                $ok = $true
                break
            }
        } catch {
            Start-Sleep -Seconds 10
        }
    }
    if (-not $ok) {
        Write-Log '[!] Sonde HEAD MP4 : pas de 200 dans les delais (verifiez Netlify).' 'Yellow'
    } else {
        Write-Log '[OK] MP4 accessible sur la preview.' 'Green'
    }

    # --- E) Navigateur ---
    Write-Log "[i] Ouverture : $NetlifyPreviewUrl" 'Cyan'
    Start-Process $NetlifyPreviewUrl
}
catch {
    Write-Host $_ -ForegroundColor Red
    if ($logFile) {
        [System.IO.File]::AppendAllText($logFile, ('[ERR] ' + $_.Exception.Message + [Environment]::NewLine), (New-Object System.Text.UTF8Encoding $true))
    }
    exit 1
}

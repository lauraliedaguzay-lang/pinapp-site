#requires -Version 5.1
# Deploy ZIP pinapp.fr -> Hostinger SFTP (WinSCP). Voir README ou docs internes pour les parametres.
[CmdletBinding()]
param(
    [string] $SftpHost,
    [string] $SftpUser,
    [int] $SftpPort = 22,
    [string] $RemotePath = '/public_html',
    [string] $ZipPath,
    [switch] $AcceptAnySshHostKey,
    [switch] $Mirror
)

$ErrorActionPreference = 'Stop'

function Get-PlainPasswordFromSecureString {
    param([System.Security.SecureString] $Secure)
    $bstr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($Secure)
    try {
        [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)
    }
    finally {
        if ($bstr -ne [IntPtr]::Zero) {
            [System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr) | Out-Null
        }
    }
}

function Resolve-WinScpNetDll {
    $candidates = @(
        (Join-Path ${env:ProgramFiles(x86)} 'WinSCP\WinSCPnet.dll'),
        (Join-Path $env:ProgramFiles 'WinSCP\WinSCPnet.dll'),
        (Join-Path $env:LOCALAPPDATA 'Programs\WinSCP\WinSCPnet.dll')
    )
    foreach ($p in $candidates) {
        if (Test-Path -LiteralPath $p) { return $p }
    }
    return $null
}

function Ensure-WinScp {
    $dll = Resolve-WinScpNetDll
    if ($dll) {
        Write-Host "WinSCP détecté : $dll" -ForegroundColor DarkGray
        return $dll
    }
    Write-Host 'WinSCP absent - tentative installation via winget...' -ForegroundColor Yellow
    $winget = Get-Command winget -ErrorAction SilentlyContinue
    if (-not $winget) {
        throw "winget introuvable. Installe WinSCP manuellement : https://winscp.net/ puis relance le script."
    }
    & winget install --id WinSCP.WinSCP -e --accept-source-agreements --accept-package-agreements
    if ($LASTEXITCODE -ne 0) {
        throw "Installation WinSCP via winget a échoué (code $LASTEXITCODE). Installe WinSCP à la main puis relance."
    }
    Start-Sleep -Seconds 2
    $dll = Resolve-WinScpNetDll
    if (-not $dll) {
        throw "WinSCP installé mais WinSCPnet.dll introuvable. Rouvre le terminal ou redémarre la session."
    }
    Write-Host "WinSCP prêt : $dll" -ForegroundColor Green
    return $dll
}

function Resolve-ZipPath {
    param([string] $Explicit)
    if ($Explicit) {
        if (-not (Test-Path -LiteralPath $Explicit)) {
            throw "ZIP introuvable : $Explicit"
        }
        return (Resolve-Path -LiteralPath $Explicit).Path
    }
    $downloads = Join-Path $env:USERPROFILE 'Downloads'
    if (-not (Test-Path -LiteralPath $downloads)) {
        throw "Dossier Downloads introuvable : $downloads"
    }
    $zip = Get-ChildItem -Path $downloads -Filter 'pinapp*.zip' -File -ErrorAction SilentlyContinue |
        Sort-Object LastWriteTime -Descending |
        Select-Object -First 1
    if (-not $zip) {
        throw ('Aucun pinapp*.zip dans ' + $downloads + '. Place pinapp-deploy-YYYYMMDD.zip dans Downloads puis relance.')
    }
    $mo = [math]::Round($zip.Length / 1MB, 1)
    Write-Host ('ZIP utilise : {0} ({1} Mo, {2})' -f $zip.FullName, $mo, $zip.LastWriteTime) -ForegroundColor Cyan
    return $zip.FullName
}

# --- Credentials (jamais loggés en clair) ---
if (-not $SftpHost) { $SftpHost = Read-Host 'SFTP host (ex. ftp.pinapp.fr)' }
if (-not $SftpUser) { $SftpUser = Read-Host 'SFTP user (ex. u123456789)' }
if ([string]::IsNullOrWhiteSpace($SftpHost) -or [string]::IsNullOrWhiteSpace($SftpUser)) {
    throw 'Hôte et utilisateur SFTP sont obligatoires.'
}

Write-Host 'Mot de passe SFTP (saisie masquée) :' -ForegroundColor Cyan
$secPass = Read-Host -AsSecureString
if ($null -eq $secPass -or $secPass.Length -lt 1) {
    throw 'Mot de passe vide - abandon.'
}
$plainPass = Get-PlainPasswordFromSecureString -Secure $secPass
try {

    $zipResolved = Resolve-ZipPath -Explicit $ZipPath
    $dllPath = Ensure-WinScp
    Add-Type -Path $dllPath

    $extractRoot = Join-Path ([System.IO.Path]::GetTempPath()) ("pinapp-deploy-" + [Guid]::NewGuid().ToString('N'))
    New-Item -ItemType Directory -Path $extractRoot -Force | Out-Null
    $session = $null
    try {
        Write-Host "Extraction vers $extractRoot ..." -ForegroundColor DarkGray
        Expand-Archive -LiteralPath $zipResolved -DestinationPath $extractRoot -Force

        $top = @(Get-ChildItem -LiteralPath $extractRoot -Force)
        if ($top.Count -eq 1 -and $top[0].PSIsContainer) {
            $localSite = $top[0].FullName
        }
        else {
            $localSite = $extractRoot
        }

        $remotePath = $RemotePath.TrimEnd('/')
        if (-not $remotePath.StartsWith('/')) {
            $remotePath = '/' + $remotePath
        }

        $sessionOptions = New-Object WinSCP.SessionOptions
        $sessionOptions.Protocol = [WinSCP.Protocol]::Sftp
        $sessionOptions.HostName = $SftpHost
        $sessionOptions.UserName = $SftpUser
        $sessionOptions.Password = $plainPass
        $sessionOptions.PortNumber = $SftpPort

        if ($AcceptAnySshHostKey) {
            if ($sessionOptions.PSObject.Properties['SshHostKeyPolicy']) {
                $sessionOptions.SshHostKeyPolicy = [WinSCP.SshHostKeyPolicy]::GiveUpSecurityAndAcceptAny
            }
            elseif ($sessionOptions.PSObject.Properties['GiveUpSecurityAndAcceptAnySshHostKey']) {
                $sessionOptions.GiveUpSecurityAndAcceptAnySshHostKey = $true
            }
        }

        $session = New-Object WinSCP.Session

        Write-Host "Connexion SFTP ${SftpHost}:${SftpPort} ..." -ForegroundColor Cyan
        $session.Open($sessionOptions)

        $mode = [WinSCP.SynchronizationMode]::Remote
        $removeExtra = [bool]$Mirror
        Write-Host ('Synchronisation locale -> {0} (miroir={1}) ...' -f $remotePath, $removeExtra) -ForegroundColor Cyan
        $syncResult = $session.SynchronizeDirectories($mode, $localSite, $remotePath, $removeExtra)
        $syncResult.Check()

        Write-Host ''
        Write-Host "DÉPLOIEMENT TERMINÉ AVEC SUCCÈS" -ForegroundColor Green
        Write-Host ('Fichiers transferes : ' + $syncResult.Uploads.Count) -ForegroundColor DarkGray
    }
    finally {
        if ($null -ne $session) {
            try { $session.Dispose() } catch { }
        }
        Remove-Item -LiteralPath $extractRoot -Recurse -Force -ErrorAction SilentlyContinue
    }
}
finally {
    if ($plainPass) {
        $plainPass = $null
    }
}

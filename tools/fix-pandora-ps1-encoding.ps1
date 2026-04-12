$ErrorActionPreference = 'Stop'
$p = 'C:\Users\Lauralie\Downloads\pinapp-refonte-pandora.ps1'
if (-not (Test-Path $p)) {
  Write-Error "Fichier introuvable: $p"
}
$c = [IO.File]::ReadAllText($p, [Text.UTF8Encoding]::new($false))
# Remplace caracteres qui cassent Windows PowerShell 5.1 sans BOM
$c = $c.Replace([string][char]0x2713, '[OK]') # checkmark
$c = $c.Replace([string][char]0x25BA, '>')    # black right-pointing pointer (▶)
$enc = New-Object System.Text.UTF8Encoding $true
[IO.File]::WriteAllText($p, $c, $enc)
Write-Host "OK: $p re-ecrit en UTF-8 BOM + substitutions ASCII."

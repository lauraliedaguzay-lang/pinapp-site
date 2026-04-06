# Reecrit href="/..." et src="/..." en chemins relatifs selon la profondeur du fichier.
# Corrige l'ouverture en file:// (page blanche : CSS/JS en 404 sous la racine du disque).
$ErrorActionPreference = 'Stop'
$siteRoot = Resolve-Path (Join-Path $PSScriptRoot '..')

function Get-DirDepth([string]$relPath) {
  $dir = Split-Path $relPath -Parent
  if ([string]::IsNullOrEmpty($dir) -or $dir -eq '.') { return 0 }
  return ($dir -split '[\\/]').Where({ $_ }).Count
}

function Get-RootPrefix([int]$depth) {
  if ($depth -le 0) { return '' }
  return ('../' * $depth)
}

function Get-SiteRelativePath([string]$rootPrefix, [string]$pathname) {
  $hash = ''
  $x = $pathname
  if ($x.Contains('#')) {
    $i = $x.IndexOf('#')
    $hash = $x.Substring($i)
    $x = $x.Substring(0, $i)
  }
  $query = ''
  if ($x.Contains('?')) {
    $i = $x.IndexOf('?')
    $query = $x.Substring($i)
    $x = $x.Substring(0, $i)
  }
  $x = $x.Trim().TrimStart('/').TrimEnd('/')
  if ([string]::IsNullOrEmpty($x)) { return "${rootPrefix}index.html$query$hash" }
  $last = ($x -split '/')[-1]
  if ($last -match '\.[a-z0-9]{2,8}$') { return "${rootPrefix}$x$query$hash" }
  return "${rootPrefix}$x/index.html$query$hash"
}

function Get-AssetPath([string]$rootPrefix, [string]$absPath) {
  $tail = $absPath.TrimStart('/')
  if ([string]::IsNullOrEmpty($rootPrefix)) { return $tail }
  return $rootPrefix + $tail
}

function Patch-HtmlContent([string]$html, [string]$rootPrefix) {
  $html = [regex]::Replace($html, '\bhref="(/[^"]*)"', {
    param($m)
    $p = $m.Groups[1].Value
    if ($p.StartsWith('//')) { return $m.Value }
    if ($p -match '^https?:') { return $m.Value }
    $newPath = Get-SiteRelativePath $rootPrefix $p
    return 'href="' + $newPath + '"'
  })
  $html = [regex]::Replace($html, '\bsrc="(/[^"]*)"', {
    param($m)
    $p = $m.Groups[1].Value
    if ($p.StartsWith('//')) { return $m.Value }
    if ($p -match '^https?:') { return $m.Value }
    $newPath = Get-AssetPath $rootPrefix $p
    return 'src="' + $newPath + '"'
  })
  return $html
}

$skipDirs = @('\tools\', '\node_modules\')
Get-ChildItem -Path $siteRoot -Recurse -Filter *.html -File | ForEach-Object {
  $full = $_.FullName
  foreach ($s in $skipDirs) {
    if ($full.Contains($s)) { return }
  }
  $rel = $full.Substring($siteRoot.Path.Length).TrimStart('\')
  $depth = Get-DirDepth $rel
  $prefix = Get-RootPrefix $depth
  $raw = Get-Content -LiteralPath $full -Raw -Encoding UTF8
  $patched = Patch-HtmlContent $raw $prefix
  if ($patched -ne $raw) {
    Set-Content -LiteralPath $full -Value $patched -Encoding UTF8 -NoNewline
    Write-Host "Patched $rel"
  }
}

Write-Host "Done."

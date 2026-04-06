$ErrorActionPreference = 'Stop'
$siteRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
$re = '(\.(?:svg|css|js|mjs|woff2|png|webp|jpg|jpeg|gif|ico))/index\.html"'
Get-ChildItem -Path $siteRoot -Recurse -Filter *.html -File | ForEach-Object {
  if ($_.FullName -match '\\tools\\') { return }
  $raw = Get-Content -LiteralPath $_.FullName -Raw -Encoding UTF8
  $fix = $raw -replace $re, '$1"'
  if ($fix -ne $raw) {
    Set-Content -LiteralPath $_.FullName -Value $fix -Encoding UTF8 -NoNewline
    Write-Host "Fixed $($_.Name)"
  }
}
Write-Host "Done fix-asset-index-suffix."

$root = Split-Path -Parent $PSScriptRoot
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add('http://127.0.0.1:8899/')
$listener.Start()
while ($listener.IsListening) {
  $ctx = $listener.GetContext()
  $req = $ctx.Request
  $res = $ctx.Response
  $p = $req.Url.LocalPath
  if ($p -eq '/' -or $p -eq '') { $p = '/index.html' }
  $rel = $p.TrimStart('/').Replace('/', [IO.Path]::DirectorySeparatorChar)
  $file = [IO.Path]::GetFullPath((Join-Path $root $rel))
  if (-not $file.StartsWith($root, [StringComparison]::OrdinalIgnoreCase)) {
    $res.StatusCode = 403
    $res.Close()
    continue
  }
  if (Test-Path $file -PathType Leaf) {
    $bytes = [IO.File]::ReadAllBytes($file)
    $ext = [IO.Path]::GetExtension($file).ToLowerInvariant()
    $res.ContentType = switch ($ext) {
      '.html' { 'text/html; charset=utf-8' }
      '.css' { 'text/css; charset=utf-8' }
      '.js' { 'application/javascript; charset=utf-8' }
      '.png' { 'image/png' }
      '.webp' { 'image/webp' }
      '.woff2' { 'font/woff2' }
      '.svg' { 'image/svg+xml' }
      '.json' { 'application/json; charset=utf-8' }
      '.xml' { 'application/xml; charset=utf-8' }
      default { 'application/octet-stream' }
    }
    $res.ContentLength64 = $bytes.Length
    $res.OutputStream.Write($bytes, 0, $bytes.Length)
  } else {
    $res.StatusCode = 404
    $msg = [Text.Encoding]::UTF8.GetBytes('404')
    $res.ContentLength64 = $msg.Length
    $res.OutputStream.Write($msg, 0, $msg.Length)
  }
  $res.Close()
}

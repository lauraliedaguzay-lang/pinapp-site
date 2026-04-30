<?php
/**
 * PINAPP — Téléchargement sécurisé des pièces jointes (diagnostic wizard).
 * Jeton HMAC valide 7 jours glissants (même logique que diagnostic.php).
 */
declare(strict_types=1);

function pinapp_serve_hmac_secret(): string
{
  if (defined('PINAPP_UPLOAD_SECRET')) {
    $s = (string) constant('PINAPP_UPLOAD_SECRET');
    if ($s !== '') {
      return $s;
    }
  }
  $e = getenv('PINAPP_UPLOAD_SECRET');
  if ($e !== false && $e !== '') {
    return $e;
  }
  $homeSecrets = '/home/u660645907/.pinapp-secrets.php';
  if (is_readable($homeSecrets)) {
    require_once $homeSecrets;
    if (defined('PINAPP_UPLOAD_SECRET')) {
      $s = (string) constant('PINAPP_UPLOAD_SECRET');
      if ($s !== '') {
        return $s;
      }
    }
  }
  return hash('sha256', __DIR__ . '|pinapp-upload-fallback-v1', true);
}

function pinapp_serve_mime(string $path): string
{
  if (function_exists('finfo_open')) {
    $fi = finfo_open(FILEINFO_MIME_TYPE);
    if ($fi) {
      $m = finfo_file($fi, $path);
      finfo_close($fi);
      if (is_string($m) && $m !== '') {
        return $m;
      }
    }
  }
  return 'application/octet-stream';
}

$uuid = isset($_GET['uuid']) ? (string) $_GET['uuid'] : '';
$token = isset($_GET['token']) ? (string) $_GET['token'] : '';
$file = isset($_GET['file']) ? (string) $_GET['file'] : '';

$uuid = strtolower(preg_replace('/[^a-f0-9]/', '', $uuid) ?? '');
if (strlen($uuid) !== 32 || !ctype_xdigit($uuid)) {
  http_response_code(400);
  header('Content-Type: text/plain; charset=utf-8');
  echo 'Requête invalide';
  exit;
}

if ($token === '') {
  http_response_code(400);
  header('Content-Type: text/plain; charset=utf-8');
  echo 'Jeton manquant';
  exit;
}

$key = pinapp_serve_hmac_secret();
$valid = false;
for ($i = 0; $i < 7; $i++) {
  $day = date('Ymd', strtotime('-' . $i . ' days'));
  $expected = hash_hmac('sha256', $uuid . $day, $key);
  if (hash_equals($expected, $token)) {
    $valid = true;
    break;
  }
}

if (!$valid) {
  http_response_code(403);
  header('Content-Type: text/plain; charset=utf-8');
  echo 'Accès refusé';
  exit;
}

$dir = __DIR__ . '/uploads/' . $uuid;
if (!is_dir($dir)) {
  http_response_code(404);
  header('Content-Type: text/plain; charset=utf-8');
  echo 'Dossier introuvable';
  exit;
}

if ($file === '') {
  header('Content-Type: text/html; charset=utf-8');
  $names = array_values(array_diff(scandir($dir) ?: [], ['.', '..']));
  sort($names, SORT_STRING);
  $esc = static function (string $s): string {
    return htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
  };
  echo '<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Fichiers · Pinapp</title>';
  echo '<style>body{margin:0;background:#FAF6EE;color:#1A1A1A;font-family:Inter,Helvetica Neue,Arial,sans-serif;padding:24px} .wrap{max-width:560px;margin:0 auto} h1{font-size:22px;font-style:italic;color:#1A1A1A;margin:0 0 8px} p{color:#6B6B6B;font-size:14px;margin:0 0 20px} ul{list-style:none;padding:0;margin:0} li{margin:0 0 10px} a{display:block;padding:14px 18px;background:#F4EEDF;border:1px solid #E0D5BC;border-radius:10px;color:#1B3A52;text-decoration:none;font-weight:600} a:hover{background:#E0D5BC} .ft{margin-top:28px;padding-top:16px;border-top:1px solid #B8975A;font-size:12px;color:#8E6F40}</style></head><body><div class="wrap">';
  echo '<p style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#B8975A;margin:0 0 12px">PINAPP</p><h1>Pièces jointes</h1><p>Liste des fichiers pour ce dossier sécurisé.</p><ul>';
  $qUuid = rawurlencode($uuid);
  $qTok = rawurlencode($token);
  foreach ($names as $n) {
    $qFile = rawurlencode($n);
    echo '<li><a href="serve.php?uuid=' . $qUuid . '&token=' . $qTok . '&file=' . $qFile . '">' . $esc($n) . '</a></li>';
  }
  echo '</ul><p class="ft">✦ Pinapp Inc. · Bordeaux</p></div></body></html>';
  exit;
}

$base = basename($file);
if ($base === '' || str_contains($base, '..')) {
  http_response_code(400);
  header('Content-Type: text/plain; charset=utf-8');
  echo 'Nom de fichier invalide';
  exit;
}

$path = $dir . '/' . $base;
if (!is_file($path)) {
  http_response_code(404);
  header('Content-Type: text/plain; charset=utf-8');
  echo 'Fichier introuvable';
  exit;
}

$mime = pinapp_serve_mime($path);
header('Content-Type: ' . $mime);
$dispName = preg_replace('/[^\pL\pN._-]+/u', '_', $base) ?: 'fichier';
header('Content-Disposition: attachment; filename="' . $dispName . '"');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: private, max-age=0, no-store');
readfile($path);
exit;

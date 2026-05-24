<?php
/**
 * PINAPP — Bridge diagnostic (Hostinger) v2
 * JSON ou multipart/form-data · emails HTML Avalon · uploads optionnels + rate limit.
 *
 * Secret HMAC : getenv('PINAPP_UPLOAD_SECRET') ou /home/u660645907/.pinapp-secrets.php
 * (sinon fallback hash fichier — À REMPLACER en production, voir commit message).
 *
 * Déploiement : /public_html/api/diagnostic.php
 */
declare(strict_types=1);

require_once __DIR__ . '/email-template.php';

/**
 * @return non-empty-string|null Secret pour HMAC (null si absent — uploads refusés)
 */
function pinapp_upload_hmac_secret(): ?string
{
  if (defined('PINAPP_UPLOAD_SECRET')) {
    $s = (string) constant('PINAPP_UPLOAD_SECRET');
    return $s !== '' ? $s : null;
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
      return $s !== '' ? $s : null;
    }
  }
  return null;
}

/** Fallback HMAC uniquement si aucun secret configuré (évite crash local ; prod = env ou fichier). */
function pinapp_upload_hmac_secret_or_fallback(): string
{
  $s = pinapp_upload_hmac_secret();
  if ($s !== null) {
    return $s;
  }
  // À DÉPLACER EN VAR D'ENV — dérivé stable du chemin (non recommandé prod)
  return hash('sha256', __DIR__ . '|pinapp-upload-fallback-v1', true);
}

function pinapp_normalize_rgpd(mixed $v): bool
{
  return $v === true || $v === 1 || $v === '1' || $v === 'true' || $v === 'on';
}

function pinapp_rate_allow(): bool
{
  $dir = __DIR__ . '/rate-limit';
  if (!is_dir($dir)) {
    @mkdir($dir, 0750, true);
  }
  $path = $dir . '/ip-counter.json';
  $ip = (string) ($_SERVER['REMOTE_ADDR'] ?? '');
  $hash = hash('sha256', $ip . '|pinapp-diag-v1');
  $hour = date('Y-m-d-H');
  $data = [];
  if (is_readable($path)) {
    $data = json_decode((string) file_get_contents($path), true) ?: [];
  }
  if (!isset($data[$hash]) || !is_array($data[$hash])) {
    $data[$hash] = [];
  }
  $cnt = (int) ($data[$hash][$hour] ?? 0);
  if ($cnt >= 5) {
    return false;
  }
  $data[$hash][$hour] = $cnt + 1;
  foreach ($data[$hash] as $hk => $_) {
    if ($hk !== $hour) {
      unset($data[$hash][$hk]);
    }
  }
  @file_put_contents($path, json_encode($data), LOCK_EX);
  return true;
}

/**
 * @return list<array{name:string,type:string,tmp_name:string,error:int,size:int}>
 */
function pinapp_collect_uploaded_files(): array
{
  if (empty($_FILES['files'])) {
    return [];
  }
  $f = $_FILES['files'];
  if (!isset($f['name']) || !is_array($f['name'])) {
    if (($f['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_NO_FILE) {
      return [];
    }
    return [$f];
  }
  $out = [];
  $n = count($f['name']);
  for ($i = 0; $i < $n; $i++) {
    if (($f['error'][$i] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_NO_FILE) {
      continue;
    }
    $out[] = [
      'name' => (string) $f['name'][$i],
      'type' => (string) ($f['type'][$i] ?? ''),
      'tmp_name' => (string) $f['tmp_name'][$i],
      'error' => (int) $f['error'][$i],
      'size' => (int) $f['size'][$i],
    ];
  }
  return $out;
}

function pinapp_mime_from_file(string $path): ?string
{
  if (!is_readable($path)) {
    return null;
  }
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
  return null;
}

/** @return array{0:string,1:string}|null ext, mime */
function pinapp_validate_upload_mime(string $tmp): ?array
{
  $mime = pinapp_mime_from_file($tmp);
  if ($mime === null) {
    return null;
  }
  $map = [
    'image/jpeg' => 'jpg',
    'image/png' => 'png',
    'video/mp4' => 'mp4',
    'video/quicktime' => 'mov',
    'application/pdf' => 'pdf',
    'application/zip' => 'zip',
  ];
  if (!isset($map[$mime])) {
    return null;
  }
  return [$map[$mime], $mime];
}

function pinapp_human_size(int $b): string
{
  if ($b < 1024) {
    return $b . ' o';
  }
  if ($b < 1024 * 1024) {
    return round($b / 1024, 1) . ' Ko';
  }
  return round($b / (1024 * 1024), 1) . ' Mo';
}

function pinapp_file_icon(string $mime): string
{
  return match ($mime) {
    'image/jpeg', 'image/png' => '📎',
    'video/mp4', 'video/quicktime' => '📎',
    'application/pdf' => '📎',
    'application/zip' => '📎',
    default => '📎',
  };
}

header('Content-Type: application/json; charset=utf-8');

$allowed = [
  'https://pinapp.fr',
  'https://www.pinapp.fr',
  'https://lauraliedaguzay-lang.github.io',
];
$origin = isset($_SERVER['HTTP_ORIGIN']) ? trim((string) $_SERVER['HTTP_ORIGIN']) : '';
if ($origin !== '' && in_array($origin, $allowed, true)) {
  header('Access-Control-Allow-Origin: ' . $origin);
  header('Vary: Origin');
} else {
  header('Access-Control-Allow-Origin: https://pinapp.fr');
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
  exit;
}

$contentType = $_SERVER['CONTENT_TYPE'] ?? $_SERVER['HTTP_CONTENT_TYPE'] ?? '';
$isMultipart = stripos((string) $contentType, 'multipart/form-data') !== false;

if ($isMultipart) {
  $payload = $_POST;
} else {
  $raw = file_get_contents('php://input');
  $payload = json_decode($raw, true);
}

if (!is_array($payload) || empty($payload['email'])) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Invalid payload']);
  exit;
}

if (!empty($payload['website'])) {
  echo json_encode(['ok' => true]);
  exit;
}

if (!pinapp_normalize_rgpd($payload['rgpd_consent'] ?? null)) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Consentement RGPD requis']);
  exit;
}

$plain = static function ($s, $max = 8000) {
  $t = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F]/', '', trim((string) $s));
  if (strlen($t) > $max) {
    $t = substr($t, 0, $max) . '…';
  }
  return $t;
};

$nom_complet = $plain($payload['nom_complet'] ?? '', 200);
$email = filter_var($payload['email'] ?? '', FILTER_VALIDATE_EMAIL);
$telephone = $plain($payload['telephone'] ?? '', 80);
$entreprise = $plain($payload['entreprise'] ?? '', 200);
$secteur = $plain($payload['secteur'] ?? '', 40);
$categorie = $plain($payload['categorie'] ?? 'inconnu', 40);
$description = $plain($payload['description'] ?? '');
$references = $plain($payload['references'] ?? '');
$pack_envisage = $plain($payload['pack_envisage'] ?? '', 40);
$budget = $plain($payload['budget'] ?? '', 40);
$delai = $plain($payload['delai'] ?? '', 40);
$contact_preference = $plain($payload['contact_preference'] ?? '', 40);
if ($contact_preference === '') {
  $contact_preference = $plain($payload['contact_pref'] ?? '', 40);
}
$creneau = $plain($payload['creneau'] ?? '', 200);
$source = $plain($payload['source'] ?? '', 80);

$allowedSecteurs = ['architecte', 'restaurant', 'esthetique', 'coach', 'avocat', 'artisan', 'commerce', 'autre'];
if ($secteur === '' || !in_array($secteur, $allowedSecteurs, true)) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Secteur requis ou invalide']);
  exit;
}

$allowedPacks = [
  'page_light',
  'pack_code',
  'pack_duo',
  'pack_clip',
  'anniversaire',
  'signature',
  'sur_mesure',
  'pas_encore',
];
if ($pack_envisage === '' || !in_array($pack_envisage, $allowedPacks, true)) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Pack invalide']);
  exit;
}

$allowedContact = ['email', 'telephone', 'visio'];
if ($contact_preference === '' || !in_array($contact_preference, $allowedContact, true)) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Préférence de contact invalide']);
  exit;
}

if (!$email) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Email invalide']);
  exit;
}

if (!pinapp_rate_allow()) {
  http_response_code(429);
  echo json_encode(['ok' => false, 'error' => 'Trop de demandes, réessayez plus tard']);
  exit;
}

$packLabels = [
  'page_light' => 'Page Light — 990 € HT — 1 page · code seul',
  'pack_code' => 'Pack Code — 1 490 € HT — 5 pages · code + 1 auto',
  'pack_duo' => 'Pack Duo ★ STAR — 1 890 € HT — 5 pages · code + 60s + 1 auto',
  'pack_clip' => 'Pack Clip artiste — 2 290 € HT — clip 90s · imagerie + montage',
  'anniversaire' => 'Anniversaire 3 min — 2 490 € HT — film famille · son cadré',
  'signature' => 'Pack Signature — 3 890 € HT — 10 pages · code + 120s + 2 auto',
  'sur_mesure' => 'Sur-Mesure — 5 990 € HT — sur cahier des charges',
  'pas_encore' => 'Je ne sais pas encore — orientation au diagnostic',
];
$packHuman = $packLabels[$pack_envisage] ?? $pack_envisage;
$parts = array_map('trim', explode('—', $packHuman));
$pack_label = $parts[0] ?? $packHuman;
$pack_price = $parts[1] ?? '';
$pack_desc = $parts[2] ?? '';

$budgetLabels = [
  'moins_1500' => 'Moins de 1 500 €',
  '1500_2500' => '1 500 € – 2 500 €',
  '2500_4000' => '2 500 € – 4 000 €',
  '4000_6000' => '4 000 € – 6 000 €',
  'plus_6000' => 'Plus de 6 000 €',
  'a_chiffrer' => 'À chiffrer ensemble',
];
$delaiLabels = [
  'urgent' => 'Urgent (sous 7 jours)',
  '21_jours' => 'Sous 21 jours (standard)',
  '1_mois' => 'Sous 1 mois',
  'pas_presse' => 'Pas pressé · qualité avant tout',
];
$contactLabels = [
  'email' => 'Email',
  'telephone' => 'Téléphone',
  'visio' => 'Visio (Google Meet)',
];
$budget_h = $budgetLabels[$budget] ?? $budget;
$delai_h = $delaiLabels[$delai] ?? $delai;
$contact_h = $contactLabels[$contact_preference] ?? $contact_preference;
$catLabels = [
  'code' => 'Code site',
  'imagerie' => 'Imagerie / films',
  'les_deux' => 'Site + image',
];
$categorie_h = $catLabels[$categorie] ?? $categorie;

$rawUuid = isset($payload['submission_uuid']) ? (string) $payload['submission_uuid'] : '';
$rawUuid = strtolower(preg_replace('/[^a-f0-9]/', '', $rawUuid) ?? '');
$submissionUuid = (strlen($rawUuid) === 32 && ctype_xdigit($rawUuid)) ? $rawUuid : bin2hex(random_bytes(16));

$uploadMetaForEmail = [];
$uploadPortalUrl = '';
$maxFile = 25 * 1024 * 1024;
$maxTotal = 100 * 1024 * 1024;

if ($isMultipart) {
  $uploads = pinapp_collect_uploaded_files();
  if (count($uploads) > 0) {
    $secretConfigured = pinapp_upload_hmac_secret() !== null;
    $hmacKey = pinapp_upload_hmac_secret_or_fallback();
    $uploadsRoot = __DIR__ . '/uploads';
    if (!is_dir($uploadsRoot)) {
      @mkdir($uploadsRoot, 0750, true);
    }
    $destDir = $uploadsRoot . '/' . $submissionUuid;
    if (!is_dir($destDir) && !@mkdir($destDir, 0750, true)) {
      http_response_code(500);
      echo json_encode(['ok' => false, 'error' => 'Stockage indisponible']);
      exit;
    }
    $total = 0;
    foreach ($uploads as $up) {
      if ($up['error'] !== UPLOAD_ERR_OK) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'Erreur upload']);
        exit;
      }
      if ($up['size'] > $maxFile) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'Fichier trop volumineux (max 25 Mo)']);
        exit;
      }
      $total += $up['size'];
    }
    if ($total > $maxTotal) {
      http_response_code(400);
      echo json_encode(['ok' => false, 'error' => 'Volume total trop important (max 100 Mo)']);
      exit;
    }
    foreach ($uploads as $up) {
      $vm = pinapp_validate_upload_mime($up['tmp_name']);
      if ($vm === null) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'Type de fichier non autorisé']);
        exit;
      }
      [$ext, $mimeOk] = $vm;
      $safeBase = bin2hex(random_bytes(12)) . '.' . $ext;
      $target = $destDir . '/' . $safeBase;
      if (!move_uploaded_file($up['tmp_name'], $target)) {
        http_response_code(500);
        echo json_encode(['ok' => false, 'error' => 'Échec enregistrement fichier']);
        exit;
      }
      @chmod($target, 0640);
      $origName = $plain($up['name'], 180);
      $uploadMetaForEmail[] = [
        'name' => $origName,
        'size_human' => pinapp_human_size($up['size']),
        'icon' => pinapp_file_icon($mimeOk),
        'mime' => $mimeOk,
      ];
    }
    $dayToken = date('Ymd');
    $token = hash_hmac('sha256', $submissionUuid . $dayToken, $hmacKey);
    $uploadPortalUrl = 'https://api.pinapp.fr/serve.php?uuid=' . rawurlencode($submissionUuid) . '&token=' . rawurlencode($token);
    if (!$secretConfigured && count($uploadMetaForEmail) > 0) {
      error_log('pinapp diagnostic: PINAPP_UPLOAD_SECRET non défini — fallback HMAC actif');
    }
  }
}

$emailData = [
  'nom_complet' => $nom_complet,
  'email' => $email,
  'telephone' => $telephone,
  'entreprise' => $entreprise,
  'secteur' => $secteur,
  'categorie' => $categorie_h,
  'description' => $description,
  'references' => $references,
  'pack_label' => $pack_label,
  'pack_price' => $pack_price,
  'pack_desc' => $pack_desc,
  'pack_star' => $pack_envisage === 'pack_duo',
  'budget' => $budget_h,
  'delai' => $delai_h,
  'contact_preference' => $contact_h,
  'creneau' => $creneau,
  'meta_ip' => (string) ($_SERVER['REMOTE_ADDR'] ?? 'N/A'),
  'meta_ua' => (string) ($_SERVER['HTTP_USER_AGENT'] ?? 'N/A'),
  'meta_date' => date('Y-m-d H:i:s'),
  'uuid' => $submissionUuid,
  'uuid_short' => substr($submissionUuid, 0, 8),
  'source' => $source,
  'upload_portal_url' => $uploadPortalUrl,
  'upload_files' => $uploadMetaForEmail,
];

$destinataire = 'contact@pinapp.fr';
$catU = strtoupper(str_replace([' ', '-'], '_', $categorie));
$packU = strtoupper($pack_envisage);
$sujet = '[Pinapp Diagnostic · ' . $catU . ' · ' . $packU . '] ' . $nom_complet;

$fromAddr = 'contact@pinapp.fr';
$htmlInternal = render_diagnostic_internal($emailData);
$htmlClient = render_diagnostic_client($emailData);

$headers = [];
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-Type: text/html; charset=UTF-8';
$headers[] = 'From: Pinapp <' . $fromAddr . '>';
$headers[] = 'Reply-To: ' . $email;
$headerStr = implode("\r\n", $headers);

$subjHdr = function_exists('mb_encode_mimeheader')
  ? mb_encode_mimeheader($sujet, 'UTF-8')
  : ('=?UTF-8?B?' . base64_encode($sujet) . '?=');

$sent = @mail($destinataire, $subjHdr, $htmlInternal, $headerStr);

$logFile = __DIR__ . '/diagnostic-logs.txt';
$logEntry = '[' . date('Y-m-d H:i:s') . "] {$email} | {$categorie} | {$pack_envisage} | {$nom_complet}\n";
@file_put_contents($logFile, $logEntry, FILE_APPEND | LOCK_EX);

if ($sent) {
  $userSub = 'Pinapp · Demande bien reçue';
  $userHeaders = [
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    'From: Pinapp <' . $fromAddr . '>',
  ];
  $userSubHdr = function_exists('mb_encode_mimeheader')
    ? mb_encode_mimeheader($userSub, 'UTF-8')
    : ('=?UTF-8?B?' . base64_encode($userSub) . '?=');
  @mail($email, $userSubHdr, $htmlClient, implode("\r\n", $userHeaders));
  echo json_encode(['ok' => true, 'message' => 'Diagnostic reçu']);
} else {
  http_response_code(500);
  echo json_encode(['ok' => false, 'error' => 'Email failed', 'logged' => true]);
}

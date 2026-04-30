<?php
/**
 * PINAPP — Bridge diagnostic (Hostinger) v2
 * JSON ou multipart/form-data · emails HTML Avalon · uploads optionnels (voir commit upload-back).
 *
 * Déploiement : /public_html/api/diagnostic.php
 */
declare(strict_types=1);

require_once __DIR__ . '/email-template.php';

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

// ——— Payload JSON uniquement (multipart géré dans commit suivant) ———
$raw = file_get_contents('php://input');
$payload = json_decode($raw, true);
if (!is_array($payload) || empty($payload['email'])) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Invalid payload']);
  exit;
}

if (!empty($payload['website'])) {
  echo json_encode(['ok' => true]);
  exit;
}

$rgpd = $payload['rgpd_consent'] ?? null;
if ($rgpd !== true && $rgpd !== 1 && $rgpd !== '1' && $rgpd !== 'true') {
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

$allowedContact = ['email', 'telephone', 'whatsapp', 'visio'];
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
  'whatsapp' => 'WhatsApp / SMS',
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

$submissionUuid = bin2hex(random_bytes(16));

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
  'upload_portal_url' => '',
  'upload_files' => [],
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

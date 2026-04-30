<?php
/**
 * PINAPP — Bridge diagnostic (Hostinger)
 * Déposer sur le serveur : /public_html/api/diagnostic.php
 * Reçoit le JSON du wizard #pinapp-contact-wizard (4 étapes).
 *
 * Les messages sont envoyés à contact@pinapp.fr (compte Hostinger + forwards).
 * CORS : ajuster $allowed si domaine différent.
 */
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
$packNote = $pack_envisage === 'pack_duo' ? 'Offre mise en avant (★ STAR).' : '';

// Hostinger : forwards depuis contact@pinapp.fr vers Lauralie + Micha (hPanel).
$destinataire = 'contact@pinapp.fr';

$catU = strtoupper(str_replace([' ', '-'], '_', $categorie));
$packU = strtoupper($pack_envisage);
$sujet = '[Pinapp Diagnostic · ' . $catU . ' · ' . $packU . '] ' . $nom_complet;

$corps = "Nouveau diagnostic Pinapp\n\n";
$corps .= "── Identité ──\n";
$corps .= "Nom complet      : {$nom_complet}\n";
$corps .= "Email            : {$email}\n";
$corps .= "Téléphone        : {$telephone}\n";
$corps .= "Entreprise       : {$entreprise}\n";
$corps .= "Secteur          : {$secteur}\n\n";
$corps .= "── Besoin ──\n";
$corps .= "Catégorie        : {$categorie}\n";
$corps .= "Description      : {$description}\n";
$corps .= "Inspirations     : {$references}\n\n";
$corps .= "── Pack envisagé ──\n";
$corps .= "Pack             : {$pack_envisage} — {$packHuman}\n";
if ($packNote !== '') {
  $corps .= "Note             : {$packNote}\n";
}
$corps .= "\n── Cadrage ──\n";
$corps .= "Budget           : {$budget}\n";
$corps .= "Délai            : {$delai}\n";
$corps .= "Contact préféré  : {$contact_preference}\n";
$corps .= "Créneau          : {$creneau}\n";
$corps .= "RGPD             : Accepté ✓\n\n";
$corps .= "── Métadonnées ──\n";
$corps .= 'IP               : ' . ($_SERVER['REMOTE_ADDR'] ?? 'N/A') . "\n";
$corps .= 'User-Agent       : ' . ($_SERVER['HTTP_USER_AGENT'] ?? 'N/A') . "\n";
$corps .= 'Date             : ' . date('Y-m-d H:i:s') . "\n";
$corps .= "Source           : {$source}\n";

$fromAddr = 'contact@pinapp.fr';
$headers = [];
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-Type: text/plain; charset=UTF-8';
$headers[] = 'From: Pinapp <' . $fromAddr . '>';
$headers[] = 'Reply-To: ' . $email;
$headerStr = implode("\r\n", $headers);

$subjHdr = function_exists('mb_encode_mimeheader')
  ? mb_encode_mimeheader($sujet, 'UTF-8')
  : ('=?UTF-8?B?' . base64_encode($sujet) . '?=');

$sent = @mail($destinataire, $subjHdr, $corps, $headerStr);

$logFile = __DIR__ . '/diagnostic-logs.txt';
$logEntry = '[' . date('Y-m-d H:i:s') . "] {$email} | {$categorie} | {$pack_envisage} | {$nom_complet}\n";
@file_put_contents($logFile, $logEntry, FILE_APPEND | LOCK_EX);

if ($sent) {
  $userSub = 'Pinapp · Demande bien reçue';
  $userBody = "Bonjour {$nom_complet},\n\n";
  $userBody .= "Nous avons bien reçu votre demande de diagnostic. Lauralie et Michaël vous répondent sous 24 h ouvrées.\n\n";
  $userBody .= "— Pinapp Inc.\n";
  $userHeaders = [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'From: Pinapp <' . $fromAddr . '>',
  ];
  $userSubHdr = function_exists('mb_encode_mimeheader')
    ? mb_encode_mimeheader($userSub, 'UTF-8')
    : ('=?UTF-8?B?' . base64_encode($userSub) . '?=');
  @mail($email, $userSubHdr, $userBody, implode("\r\n", $userHeaders));
  echo json_encode(['ok' => true, 'message' => 'Diagnostic reçu']);
} else {
  http_response_code(500);
  echo json_encode(['ok' => false, 'error' => 'Email failed', 'logged' => true]);
}

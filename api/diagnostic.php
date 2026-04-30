<?php
/**
 * PINAPP — Bridge diagnostic (Hostinger)
 * Déposer sur le serveur : /public_html/api/diagnostic.php
 * Reçoit le JSON du wizard #pinapp-contact-wizard (mêmes clés que le front).
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
$categorie = $plain($payload['categorie'] ?? 'inconnu', 40);
$description = $plain($payload['description'] ?? '');
$references = $plain($payload['references'] ?? '');
$budget = $plain($payload['budget'] ?? '', 40);
$delai = $plain($payload['delai'] ?? '', 40);
$contact_pref = $plain($payload['contact_pref'] ?? '', 40);
$data_routage = $plain($payload['data_routage'] ?? '', 40);
$source = $plain($payload['source'] ?? '', 80);

if (!$email) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Email invalide']);
  exit;
}

// Hostinger : forwards depuis contact@pinapp.fr vers Lauralie + Micha (hPanel).
$destinataire = 'contact@pinapp.fr';

$sujet = '[Pinapp Diagnostic · ' . strtoupper($categorie) . '] ' . $nom_complet;

$corps = "Nouveau diagnostic Pinapp\n\n";
$corps .= "── Identité ──\n";
$corps .= "Nom complet  : {$nom_complet}\n";
$corps .= "Email        : {$email}\n";
$corps .= "Téléphone    : {$telephone}\n";
$corps .= "Entreprise   : {$entreprise}\n\n";
$corps .= "── Besoin ──\n";
$corps .= "Catégorie    : {$categorie}\n";
$corps .= "Description  : {$description}\n";
$corps .= "Références   : {$references}\n\n";
$corps .= "── Cadrage ──\n";
$corps .= "Budget       : {$budget}\n";
$corps .= "Délai        : {$delai}\n";
$corps .= "Contact pref.: {$contact_pref}\n";
$corps .= "Routage (meta): {$data_routage}\n";
$corps .= "Source       : {$source}\n\n";
$corps .= "── Métadonnées ──\n";
$corps .= 'IP           : ' . ($_SERVER['REMOTE_ADDR'] ?? 'N/A') . "\n";
$corps .= 'User-Agent   : ' . ($_SERVER['HTTP_USER_AGENT'] ?? 'N/A') . "\n";
$corps .= 'Date         : ' . date('Y-m-d H:i:s') . "\n";

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
$logEntry = '[' . date('Y-m-d H:i:s') . "] {$email} | {$categorie} | {$nom_complet}\n";
@file_put_contents($logFile, $logEntry, FILE_APPEND | LOCK_EX);

if ($sent) {
  echo json_encode(['ok' => true, 'message' => 'Diagnostic reçu']);
} else {
  http_response_code(500);
  echo json_encode(['ok' => false, 'error' => 'Email failed', 'logged' => true]);
}

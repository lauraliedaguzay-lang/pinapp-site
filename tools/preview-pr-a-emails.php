<?php
/**
 * Aperçu local des gabarits email (PR-A) — sortie dans tools/_email-preview-output/
 * Usage : php tools/preview-pr-a-emails.php
 */
declare(strict_types=1);

require_once dirname(__DIR__) . '/api/email-template.php';

$base = dirname(__DIR__) . '/tools/_email-preview-output';
if (!is_dir($base)) {
  mkdir($base, 0755, true);
}

$mock = [
  'nom_complet' => 'Camille Fontaine',
  'email' => 'camille@example.com',
  'telephone' => '06 12 34 56 78',
  'entreprise' => 'Studio Rivage',
  'secteur' => 'esthetique',
  'categorie' => 'Code site',
  'description' => 'Refonte vitrine premium avec prise de rendez-vous en ligne et automatisations discrètes.',
  'references' => 'annetaintor.com, concurrent local XYZ',
  'pack_label' => 'Pack Duo ★ STAR',
  'pack_price' => '1 890 € HT',
  'pack_desc' => '5 pages · code + 60s + 1 auto',
  'pack_star' => true,
  'budget' => '2 500 € – 4 000 €',
  'delai' => 'Sous 21 jours (standard)',
  'contact_preference' => 'Email',
  'creneau' => '',
  'meta_ip' => '203.0.113.10',
  'meta_ua' => 'Mozilla/5.0 (preview)',
  'meta_date' => date('Y-m-d H:i:s'),
  'uuid' => 'a1b2c3d4e5f6789012345678abcdef01',
  'uuid_short' => 'a1b2c3d4',
  'source' => 'preview-local',
  'upload_portal_url' => 'https://api.pinapp.fr/serve.php?uuid=demo&token=demo',
  'upload_files' => [
    ['name' => 'brief.pdf', 'size_human' => '120 Ko', 'icon' => '📎'],
    ['name' => 'logo.png', 'size_human' => '45 Ko', 'icon' => '📎'],
  ],
];

file_put_contents($base . '/internal.html', render_diagnostic_internal($mock));

$mockClient = $mock;
$mockClient['upload_portal_url'] = '';
$mockClient['upload_files'] = [];
file_put_contents($base . '/client.html', render_diagnostic_client($mockClient));

echo "OK → tools/_email-preview-output/internal.html et client.html\n";

<?php
/**
 * PINAPP — Gabarits HTML email (diagnostic wizard) · palette Avalon · tables + inline CSS.
 * Inclus par diagnostic.php · pas d'accès direct requis.
 */

declare(strict_types=1);

if (!function_exists('pinapp_h')) {
  function pinapp_h(string $s): string
  {
    return htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
  }
}

/**
 * @param array<string,mixed> $d
 */
function render_diagnostic_internal(array $d): string
{
  $nom = pinapp_h((string) ($d['nom_complet'] ?? ''));
  $packLabel = pinapp_h((string) ($d['pack_label'] ?? ''));
  $email = pinapp_h((string) ($d['email'] ?? ''));
  $tel = pinapp_h((string) ($d['telephone'] ?? ''));
  $ent = pinapp_h((string) ($d['entreprise'] ?? ''));
  $sect = pinapp_h((string) ($d['secteur'] ?? ''));
  $cat = pinapp_h((string) ($d['categorie'] ?? ''));
  $desc = pinapp_h((string) ($d['description'] ?? ''));
  $refs = pinapp_h((string) ($d['references'] ?? ''));
  $packPrice = pinapp_h((string) ($d['pack_price'] ?? ''));
  $packDesc = pinapp_h((string) ($d['pack_desc'] ?? ''));
  $budget = pinapp_h((string) ($d['budget'] ?? ''));
  $delai = pinapp_h((string) ($d['delai'] ?? ''));
  $cpref = pinapp_h((string) ($d['contact_preference'] ?? ''));
  $creneau = pinapp_h((string) ($d['creneau'] ?? ''));
  $ip = pinapp_h((string) ($d['meta_ip'] ?? ''));
  $ua = pinapp_h((string) ($d['meta_ua'] ?? ''));
  $date = pinapp_h((string) ($d['meta_date'] ?? ''));
  $uuid = pinapp_h((string) ($d['uuid'] ?? ''));
  $src = pinapp_h((string) ($d['source'] ?? ''));
  $uploadUrl = (string) ($d['upload_portal_url'] ?? '');
  $uploadUrlH = pinapp_h($uploadUrl);
  $files = $d['upload_files'] ?? [];
  $isStar = !empty($d['pack_star']);

  $starBadge = $isStar
    ? '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 16px 0"><tr><td align="center" style="background-color:#B8975A;padding:8px 16px;border-radius:6px"><span style="font-family:Inter,Helvetica Neue,Arial,sans-serif;font-size:11px;font-weight:bold;letter-spacing:0.12em;color:#FAF6EE;text-transform:uppercase">★ STAR · Pack Duo</span></td></tr></table>'
    : '';

  $attachmentsBlock = '';
  if (is_array($files) && count($files) > 0 && $uploadUrl !== '') {
    $rows = '';
    foreach ($files as $f) {
      if (!is_array($f)) {
        continue;
      }
      $fn = pinapp_h((string) ($f['name'] ?? 'fichier'));
      $sz = pinapp_h((string) ($f['size_human'] ?? ''));
      $icon = pinapp_h((string) ($f['icon'] ?? '📎'));
      $rows .= '<tr><td style="padding:8px 0;border-bottom:1px solid #E0D5BC;font-family:Inter,Helvetica Neue,Arial,sans-serif;font-size:14px;color:#1A1A1A">' . $icon . ' &nbsp; ' . $fn . '</td><td align="right" style="padding:8px 0;border-bottom:1px solid #E0D5BC;font-family:Inter,Helvetica Neue,Arial,sans-serif;font-size:13px;font-style:italic;color:#8E6F40">' . $sz . '</td></tr>';
    }
    $attachmentsBlock = '
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0 0 0;background-color:#F4EEDF;border:1px solid #E0D5BC;border-radius:10px">
  <tr><td style="padding:20px 22px">
    <p style="margin:0 0 12px 0;font-family:Inter,Helvetica Neue,Arial,sans-serif;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#8E6F40">Pièces jointes</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">' . $rows . '</table>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:16px"><tr><td align="center" bgcolor="#B8975A" style="border-radius:8px"><a href="' . $uploadUrlH . '" style="display:inline-block;padding:12px 22px;font-family:Inter,Helvetica Neue,Arial,sans-serif;font-size:13px;font-weight:bold;color:#FAF6EE;text-decoration:none">📥 Voir tous les fichiers</a></td></tr></table>
  </td></tr>
</table>';
  }

  return '<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style type="text/css">@media only screen and (max-width:600px){.w100{width:100%!important}.pad{padding-left:16px!important;padding-right:16px!important}}</style></head><body style="margin:0;padding:0;background-color:#FAF6EE">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#FAF6EE"><tr><td align="center" style="padding:0">
<table role="presentation" class="w100" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%">
<tr><td style="background-color:#0E1116;padding:28px 24px;text-align:center">
  <p style="margin:0;font-family:Inter,Helvetica Neue,Arial,sans-serif;font-size:18px;letter-spacing:0.2em;color:#B8975A;font-weight:bold">PINAPP</p>
  <p style="margin:8px 0 0 0;font-family:Inter,Helvetica Neue,Arial,sans-serif;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#B8975A">STUDIO IA · BORDEAUX</p>
  <table role="presentation" width="120" cellpadding="0" cellspacing="0" border="0" style="margin:16px auto 0 auto"><tr><td style="border-top:1px solid #B8975A;font-size:0;line-height:0">&nbsp;</td></tr></table>
</td></tr>
<tr><td class="pad" style="padding:32px 28px 28px 28px">
  <p style="margin:0 0 8px 0;font-family:Inter,Helvetica Neue,Arial,sans-serif;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#B8975A">NOUVEAU DIAGNOSTIC</p>
  <h1 style="margin:0 0 8px 0;font-family:Inter,Helvetica Neue,Arial,sans-serif;font-size:28px;font-style:italic;font-weight:600;color:#1A1A1A;line-height:1.2">' . $nom . '</h1>
  <p style="margin:0 0 24px 0;font-family:Inter,Helvetica Neue,Arial,sans-serif;font-size:16px;color:#6B6B6B">veut un ' . $packLabel . '</p>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F4EEDF;border:1px solid #E0D5BC;border-radius:10px;margin-bottom:16px"><tr><td style="padding:20px 22px">
    <p style="margin:0 0 12px 0;font-family:Inter,Helvetica Neue,Arial,sans-serif;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#8E6F40">Identité</p>
    <p style="margin:0 0 6px 0;font-family:Inter,Helvetica Neue,Arial,sans-serif;font-size:14px;color:#1A1A1A"><strong>Nom</strong> · ' . $nom . '</p>
    <p style="margin:0 0 6px 0;font-family:Inter,Helvetica Neue,Arial,sans-serif;font-size:14px;color:#1A1A1A"><strong>Email</strong> · ' . $email . '</p>
    <p style="margin:0 0 6px 0;font-family:Inter,Helvetica Neue,Arial,sans-serif;font-size:14px;color:#1A1A1A"><strong>Tél.</strong> · ' . $tel . '</p>
    <p style="margin:0 0 6px 0;font-family:Inter,Helvetica Neue,Arial,sans-serif;font-size:14px;color:#1A1A1A"><strong>Entreprise</strong> · ' . $ent . '</p>
    <p style="margin:0;font-family:Inter,Helvetica Neue,Arial,sans-serif;font-size:14px;color:#1A1A1A"><strong>Secteur</strong> · ' . $sect . '</p>
  </td></tr></table>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F4EEDF;border:1px solid #E0D5BC;border-radius:10px;margin-bottom:16px"><tr><td style="padding:20px 22px">
    <p style="margin:0 0 12px 0;font-family:Inter,Helvetica Neue,Arial,sans-serif;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#8E6F40">Besoin</p>
    <p style="margin:0 0 12px 0;font-family:Inter,Helvetica Neue,Arial,sans-serif;font-size:14px;color:#1A1A1A"><strong>Catégorie</strong> · ' . $cat . '</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-left:3px solid #B8975A;padding-left:14px">
      <p style="margin:0;font-family:Inter,Helvetica Neue,Arial,sans-serif;font-size:14px;line-height:1.55;color:#1A1A1A;font-style:italic">' . $desc . '</p>
    </td></tr></table>
    <p style="margin:14px 0 0 0;font-family:Inter,Helvetica Neue,Arial,sans-serif;font-size:13px;color:#6B6B6B"><strong style="color:#1A1A1A">Inspirations</strong><br>' . ($refs !== '' ? $refs : '—') . '</p>
  </td></tr></table>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F4EEDF;border:1px solid #E0D5BC;border-radius:10px;margin-bottom:16px"><tr><td style="padding:20px 22px">
    <p style="margin:0 0 12px 0;font-family:Inter,Helvetica Neue,Arial,sans-serif;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#8E6F40">Pack envisagé</p>
    ' . $starBadge . '
    <p style="margin:0 0 8px 0;font-family:Inter,Helvetica Neue,Arial,sans-serif;font-size:24px;font-weight:bold;color:#B8975A">' . $packPrice . '</p>
    <p style="margin:0;font-family:Inter,Helvetica Neue,Arial,sans-serif;font-size:14px;color:#1A1A1A">' . $packDesc . '</p>
  </td></tr></table>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F4EEDF;border:1px solid #E0D5BC;border-radius:10px;margin-bottom:16px"><tr><td style="padding:20px 22px">
    <p style="margin:0 0 12px 0;font-family:Inter,Helvetica Neue,Arial,sans-serif;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#8E6F40">Cadrage</p>
    <p style="margin:0 0 6px 0;font-family:Inter,Helvetica Neue,Arial,sans-serif;font-size:14px;color:#1A1A1A"><strong>Budget</strong> · ' . $budget . '</p>
    <p style="margin:0 0 6px 0;font-family:Inter,Helvetica Neue,Arial,sans-serif;font-size:14px;color:#1A1A1A"><strong>Délai</strong> · ' . $delai . '</p>
    <p style="margin:0 0 6px 0;font-family:Inter,Helvetica Neue,Arial,sans-serif;font-size:14px;color:#1A1A1A"><strong>Contact</strong> · ' . $cpref . '</p>
    <p style="margin:0 0 6px 0;font-family:Inter,Helvetica Neue,Arial,sans-serif;font-size:14px;color:#1A1A1A"><strong>Créneau</strong> · ' . ($creneau !== '' ? $creneau : '—') . '</p>
    <p style="margin:0;font-family:Inter,Helvetica Neue,Arial,sans-serif;font-size:14px;color:#1A1A1A"><strong>RGPD</strong> · Accepté ✓</p>
  </td></tr></table>
  ' . $attachmentsBlock . '

  <p style="margin:24px 0 0 0;font-family:Inter,Helvetica Neue,Arial,sans-serif;font-size:13px;line-height:1.6;color:#6B6B6B">IP · ' . $ip . '<br>UA · ' . $ua . '<br>Date · ' . $date . '<br>UUID · ' . ($uuid !== '' ? $uuid : '—') . '<br>Source · ' . $src . '</p>
</td></tr>
<tr><td style="background-color:#0E1116;padding:24px;text-align:center">
  <p style="margin:0;font-family:Inter,Helvetica Neue,Arial,sans-serif;font-size:12px;color:#B8975A">Pinapp Inc. · Bordeaux · pinapp.fr</p>
  <p style="margin:8px 0 0 0;font-family:Inter,Helvetica Neue,Arial,sans-serif;font-size:11px;color:#8E6F40">✦ Designed in Bordeaux · Built with AI</p>
</td></tr>
</table></td></tr></table></body></html>';
}

/**
 * @param array<string,mixed> $d
 */
function render_diagnostic_client(array $d): string
{
  $nomComplet = (string) ($d['nom_complet'] ?? '');
  $parts = preg_split('/\s+/u', trim($nomComplet), 2);
  $prenom = pinapp_h($parts[0] ?? 'Bonjour');
  $packLabel = pinapp_h((string) ($d['pack_label'] ?? ''));
  $cat = pinapp_h((string) ($d['categorie'] ?? ''));
  $delai = pinapp_h((string) ($d['delai'] ?? ''));
  $budget = pinapp_h((string) ($d['budget'] ?? ''));
  $uuidShort = pinapp_h((string) ($d['uuid_short'] ?? ''));

  return '<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style type="text/css">@media only screen and (max-width:600px){.w100{width:100%!important}.pad{padding-left:16px!important;padding-right:16px!important}}</style></head><body style="margin:0;padding:0;background-color:#FAF6EE">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#FAF6EE"><tr><td align="center" style="padding:0">
<table role="presentation" class="w100" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%">
<tr><td style="background-color:#FAF6EE;padding:36px 24px 24px 24px;text-align:center;border-bottom:1px solid #B8975A">
  <p style="margin:0;font-family:Inter,Helvetica Neue,Arial,sans-serif;font-size:24px;letter-spacing:0.14em;color:#B8975A;font-weight:bold">PINAPP</p>
  <p style="margin:10px 0 0 0;font-family:Inter,Helvetica Neue,Arial,sans-serif;font-size:16px;color:#B8975A">✦</p>
</td></tr>
<tr><td class="pad" style="padding:32px 28px 28px 28px">
  <p style="margin:0 0 16px 0;font-family:Inter,Helvetica Neue,Arial,sans-serif;font-size:24px;font-style:italic;color:#1A1A1A">Bonjour ' . $prenom . ',</p>
  <p style="margin:0 0 20px 0;font-family:Inter,Helvetica Neue,Arial,sans-serif;font-size:16px;line-height:1.6;color:#1A1A1A">Nous avons bien reçu votre demande de diagnostic. Lauralie et Michaël lisent chaque message avec attention et vous répondent sous 24 h ouvrées, avec une proposition claire et sans jargon.</p>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F4EEDF;border:1px solid #E0D5BC;border-radius:10px;margin-bottom:24px"><tr><td style="padding:20px 22px">
    <p style="margin:0 0 12px 0;font-family:Inter,Helvetica Neue,Arial,sans-serif;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#8E6F40">Récapitulatif</p>
    <p style="margin:0 0 8px 0;font-family:Inter,Helvetica Neue,Arial,sans-serif;font-size:14px;color:#1A1A1A"><strong>Pack envisagé</strong> · ' . $packLabel . '</p>
    <p style="margin:0 0 8px 0;font-family:Inter,Helvetica Neue,Arial,sans-serif;font-size:14px;color:#1A1A1A"><strong>Catégorie</strong> · ' . $cat . '</p>
    <p style="margin:0 0 8px 0;font-family:Inter,Helvetica Neue,Arial,sans-serif;font-size:14px;color:#1A1A1A"><strong>Délai</strong> · ' . $delai . '</p>
    <p style="margin:0 0 8px 0;font-family:Inter,Helvetica Neue,Arial,sans-serif;font-size:14px;color:#1A1A1A"><strong>Budget</strong> · ' . $budget . '</p>
    <p style="margin:0;font-family:Inter,Helvetica Neue,Arial,sans-serif;font-size:14px;color:#6B6B6B">Référence <strong style="color:#1A1A1A">DGN-' . $uuidShort . '</strong></p>
  </td></tr></table>

  <p style="margin:0 0 12px 0;font-family:Inter,Helvetica Neue,Arial,sans-serif;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#8E6F40">EN ATTENDANT NOTRE RÉPONSE :</p>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:12px"><tr><td align="center" bgcolor="#B8975A" style="border-radius:8px"><a href="https://pinapp.fr/essayer-une-demo/" style="display:inline-block;padding:14px 22px;font-family:Inter,Helvetica Neue,Arial,sans-serif;font-size:14px;font-weight:bold;color:#FAF6EE;text-decoration:none">Voir nos 15 démos sectorielles →</a></td></tr></table>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px"><tr><td align="center" bgcolor="#1B3A52" style="border-radius:8px"><a href="https://pinapp.fr/#offres" style="display:inline-block;padding:14px 22px;font-family:Inter,Helvetica Neue,Arial,sans-serif;font-size:14px;font-weight:bold;color:#FAF6EE;text-decoration:none">Voir notre grille tarifaire 2026 →</a></td></tr></table>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F4EEDF;border:1px solid #E0D5BC;border-radius:10px;margin-bottom:24px"><tr><td style="padding:18px 22px">
    <p style="margin:0 0 8px 0;font-family:Inter,Helvetica Neue,Arial,sans-serif;font-size:14px;color:#1A1A1A"><strong>Contacts urgents</strong></p>
    <p style="margin:0;font-family:Inter,Helvetica Neue,Arial,sans-serif;font-size:14px;color:#1A1A1A">Email · <a href="mailto:contact@pinapp.fr" style="color:#B8975A;text-decoration:none">contact@pinapp.fr</a></p>
  </td></tr></table>

  <table role="presentation" width="120" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 24px auto"><tr><td style="border-top:1px solid #B8975A;font-size:0;line-height:0">&nbsp;</td></tr></table>

  <p style="margin:0;font-family:Inter,Helvetica Neue,Arial,sans-serif;font-size:15px;line-height:1.55;color:#1A1A1A">Lauralie Daguzay &amp; Michaël Bouilhac · Pinapp Inc. · Bordeaux</p>
  <p style="margin:20px 0 0 0;font-family:Inter,Helvetica Neue,Arial,sans-serif;font-size:12px;line-height:1.6;color:#6B6B6B">pinapp.fr · ✦ Designed in Bordeaux</p>
  <p style="margin:12px 0 0 0;font-family:Inter,Helvetica Neue,Arial,sans-serif;font-size:12px;line-height:1.6;color:#6B6B6B">RGPD : vos données sont conservées 6 mois max.<br>Suppression sur demande à <a href="mailto:contact@pinapp.fr" style="color:#B8975A">contact@pinapp.fr</a>.</p>
</td></tr>
</table></td></tr></table></body></html>';
}

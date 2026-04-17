/**
 * QR diagnostic : https://pinapp.fr/diagnostic/?source=qr
 * - SVG : vectoriel, logo ananas en relatif (pinapp-icon.png, même dossier)
 * - PNG : 800×800, violet #7B4FE8 sur blanc, logo centré (composite sharp)
 * Usage : npm install && node tools/generate-qr.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import QRCode from 'qrcode';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const outSvg = path.join(root, 'assets', 'images', 'qr-diagnostic.svg');
const outPng = path.join(root, 'assets', 'images', 'qr-diagnostic.png');
const iconPath = path.join(root, 'assets', 'images', 'pinapp-icon.png');

const URL = 'https://pinapp.fr/diagnostic/?source=qr';
const VIOLET = '#7B4FE8';
const WHITE = '#FFFFFF';

let svgCore = await QRCode.toString(URL, {
  type: 'svg',
  errorCorrectionLevel: 'H',
  margin: 2,
  color: { dark: VIOLET, light: WHITE },
});

svgCore = svgCore.trim().replace(/^<\?xml[^>]*>\s*/i, '');

const vbMatch = svgCore.match(/viewBox="([^"]+)"/);
if (!vbMatch) throw new Error('QR SVG : viewBox introuvable');
const vbParts = vbMatch[1].trim().split(/\s+/).map(Number);
const w = vbParts[2];
const h = vbParts[3];
const iw = Math.round(Math.min(w, h) * 0.22);
const ix = (w - iw) / 2;
const iy = (h - iw) / 2;
const pad = iw * 0.12;
const rx = Math.round(iw * 0.18);

const logoGroup =
  '<g id="pinapp-qr-logo">' +
  '<rect x="' +
  (ix - pad) +
  '" y="' +
  (iy - pad) +
  '" width="' +
  (iw + pad * 2) +
  '" height="' +
  (iw + pad * 2) +
  '" rx="' +
  rx +
  '" fill="' +
  WHITE +
  '" stroke="' +
  VIOLET +
  '" stroke-opacity="0.12"/>' +
  '<image href="pinapp-icon.png" x="' +
  ix +
  '" y="' +
  iy +
  '" width="' +
  iw +
  '" height="' +
  iw +
  '" preserveAspectRatio="xMidYMid meet"/>' +
  '</g>';

const close = svgCore.lastIndexOf('</svg>');
if (close === -1) throw new Error('QR SVG : balise fermante manquante');
const merged =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  svgCore.slice(0, close) +
  logoGroup +
  svgCore.slice(close);

fs.writeFileSync(outSvg, merged, 'utf8');
console.log('Écrit :', path.relative(root, outSvg));

const qrPngBuf = await QRCode.toBuffer(URL, {
  type: 'png',
  width: 800,
  margin: 2,
  errorCorrectionLevel: 'H',
  color: { dark: VIOLET, light: WHITE },
});

const iconSize = Math.round(800 * 0.2);
const iconPad = Math.round(iconSize * 0.18);
const iconLayer = await sharp(iconPath)
  .resize(iconSize, iconSize, { fit: 'contain' })
  .extend({
    top: iconPad,
    bottom: iconPad,
    left: iconPad,
    right: iconPad,
    background: WHITE,
  })
  .png()
  .toBuffer();

await sharp(qrPngBuf)
  .composite([{ input: iconLayer, gravity: 'center' }])
  .png()
  .toFile(outPng);

console.log('Écrit :', path.relative(root, outPng));

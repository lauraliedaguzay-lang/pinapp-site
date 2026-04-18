import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const p = path.resolve(__dirname, '..', 'index.html');
let html = fs.readFileSync(p, 'utf8');

const presRe =
  /<section class="section" id="home-presentation"[\s\S]*?<\/section>\s*(?=<section id="temoignages")/;
const presMatch = html.match(presRe);
if (!presMatch) throw new Error('home-presentation block not found');
const presBlock = presMatch[0].replace(/\s*(?=<section id="temoignages")/, '\n\n');
html = html.replace(presRe, '');

const pourquoiRe = /\n\s*<section id="pourquoi"[\s\S]*?<\/section>\s*\n\s*<!-- PROCESS -->/;
if (!pourquoiRe.test(html)) throw new Error('pourquoi section not found');
html = html.replace(pourquoiRe, '\n\n        <!-- PROCESS -->');

const offresStart = html.indexOf('<section class="section" id="offres"');
const studioStart = html.indexOf('      <section id="studio"');
if (offresStart === -1 || studioStart === -1 || studioStart < offresStart) {
  throw new Error('offres/studio markers not found');
}
html = html.slice(0, offresStart) + html.slice(studioStart);

const creaStart = html.indexOf('      <section id="createurs"');
const mpStart = html.indexOf('      <section id="memoire-presence"');
if (creaStart === -1 || mpStart === -1 || mpStart < creaStart) {
  throw new Error('createurs/memoire-presence markers not found');
}
html = html.slice(0, creaStart) + html.slice(mpStart);

const ctaNeedle = 'id="diagnostic"';
const ctaPos = html.indexOf(ctaNeedle);
if (ctaPos === -1) throw new Error('diagnostic section id not found');
const insertAt = html.lastIndexOf('<section', ctaPos);
if (insertAt === -1) throw new Error('cta section start not found');
html = html.slice(0, insertAt) + presBlock.trim() + '\n\n' + html.slice(insertAt);

fs.writeFileSync(p, html, 'utf8');
console.log('restructure-index-home: OK');

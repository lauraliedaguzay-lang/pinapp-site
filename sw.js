// sw.js — Pinapp Studio Service Worker
// Stratégie : network-first, fallback cache, fallback offline.
// Objectif : éviter les 404 et permettre une dégradation propre.

const CACHE = 'pinapp-v3';
const OFFLINE_URL = '/offline.html';

const PRECACHE = [
  '/',
  '/offres/',
  '/univers/',
  '/realisations/',
  '/diagnostic/',
  '/a-propos/',
  '/assets/css/deploy-harmonise.css',
  '/favicon.svg',
  OFFLINE_URL,
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .catch(() => {}) // Ne pas bloquer l'install si un asset manque
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  if (e.request.url.includes('/.netlify/')) return;
  if (e.request.url.includes('plausible.io')) return;
  if (e.request.url.includes('fonts.bunny.net')) return;
  // Ne jamais mettre en cache les espaces sensibles (tokens, pages internes)
  try {
    const u = new URL(e.request.url);
    const p = u.pathname || '';
    if (p.startsWith('/dashboard/') || p.startsWith('/client/')) return;
  } catch (err) {}

  e.respondWith(
    fetch(e.request)
      .then((resp) => {
        // Ne mettre en cache que les ressources de même origine (évite de “geler” du tiers)
        const sameOrigin = (() => {
          try {
            return new URL(e.request.url).origin === self.location.origin;
          } catch (err) {
            return false;
          }
        })();
        if (sameOrigin && resp && resp.status === 200) {
          const clone = resp.clone();
          caches.open(CACHE).then((cache) => cache.put(e.request, clone));
        }
        return resp;
      })
      .catch(() => caches.match(e.request).then((cached) => cached || caches.match(OFFLINE_URL))),
  );
});

// sw.js — Pinapp Studio Service Worker
// Cache stratégie : Network first, fallback cache, fallback offline

const CACHE = 'pinapp-v2';
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
      .then((cache) =>
        cache.addAll(
          PRECACHE.filter((url) => {
            // Ignorer les URLs qui pourraient échouer
            return true;
          }),
        ),
      )
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

  e.respondWith(
    fetch(e.request)
      .then((resp) => {
        if (resp && resp.status === 200) {
          const clone = resp.clone();
          caches.open(CACHE).then((cache) => cache.put(e.request, clone));
        }
        return resp;
      })
      .catch(() => caches.match(e.request).then((cached) => cached || caches.match(OFFLINE_URL))),
  );
});

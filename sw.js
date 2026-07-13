// EduVerse Malaysia — service worker (offline-first)
const CACHE = 'eduverse-v51';
const CORE = [
  './', './index.html', './manifest.json',
  './css/tokens.css', './css/app.css',
  './js/app.js', './js/views.js', './js/store.js',
  './js/gamification.js', './js/games.js', './js/ai.js', './js/ui.js',
  './js/config.js', './js/sounds.js', './js/avatar.js', './js/assets.js', './js/install.js', './js/payments.js', './js/data/curriculum.js',
  './assets/icons/icon.svg',
  './vendor/capacitor/core.js', './vendor/capacitor/firebase-authentication.js', './vendor/capacitor/definitions.js',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      // Cache core files individually so one miss doesn't fail the whole install.
      .then(c => Promise.allSettled(CORE.map(u => c.add(u))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // Never cache API calls (Gemini, Firestore) — network only.
  if (url.hostname.includes('googleapis.com') && !url.hostname.includes('fonts')) return;

  // Stale-while-revalidate for everything else.
  e.respondWith(
    caches.match(e.request).then(cached => {
      const fresh = fetch(e.request).then(res => {
        if (res.ok && e.request.method === 'GET') {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => cached);
      return cached || fresh;
    })
  );
});

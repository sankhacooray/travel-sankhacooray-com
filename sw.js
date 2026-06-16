// Service worker for travel.sankhacooray.com
// network-first for navigation (fresh HTML on deploy), cache-first for static assets.
const VERSION = "travel-v3";
const ASSETS = [
  "./",
  "./index.html",
  "./config.js",
  "./data.js",
  "./profile.jpg",
  "./icon.svg",
  "./manifest.webmanifest",
  "./vendor/jsvectormap.min.css",
  "./vendor/jsvectormap.min.js",
  "./vendor/world.js"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;

  // network-first for navigations so a redeploy is picked up promptly
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(VERSION).then((c) => c.put(req, copy));
        return res;
      }).catch(() => caches.match(req).then((m) => m || caches.match("./index.html")))
    );
    return;
  }

  // cache-first for static assets
  e.respondWith(
    caches.match(req).then((hit) =>
      hit || fetch(req).then((res) => {
        if (res.ok && new URL(req.url).origin === location.origin) {
          const copy = res.clone();
          caches.open(VERSION).then((c) => c.put(req, copy));
        }
        return res;
      }).catch(() => hit)
    )
  );
});

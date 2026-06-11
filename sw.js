/* El Camino al Uno — Service Worker
   Desarrollada por Vibras Positivas HM — Derechos de Autor Reservados */

const CACHE = "camino-al-uno-v1";
const ARCHIVOS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ARCHIVOS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then(resp =>
      resp ||
      fetch(e.request).then(net => {
        // Cachear recursos de mismo origen y fuentes de Google
        const url = new URL(e.request.url);
        if (url.origin === location.origin || url.hostname.includes("fonts.g")) {
          const copia = net.clone();
          caches.open(CACHE).then(c => c.put(e.request, copia));
        }
        return net;
      }).catch(() => caches.match("./index.html"))
    )
  );
});

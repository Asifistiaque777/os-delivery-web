self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener("fetch", (event) => {
  // সার্ভিস ওয়ার্কারকে সক্রিয় রাখার জন্য ন্যূনতম ফেচ লিসেনার
  event.respondWith(fetch(event.request).catch(() => new Response("Offline")));
});
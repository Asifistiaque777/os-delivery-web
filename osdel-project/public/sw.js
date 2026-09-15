const CACHE_NAME = 'osrush-cache-v2';

// 🚀 প্রথম লোডেই যেসব কোর ফাইল প্রিক্যাশ হবে
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/osdel_favicon.png'
];

// ১. ইনস্টলেশন: জরুরি ফাইলগুলো দ্রুত ক্যাশে জমা করা
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  self.skipWaiting();
});

// ২. অ্যাক্টিভেশন: পুরনো ক্যাশ ডিলিট করে নতুন ভার্সন রান করা
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// ৩. ফেচ হ্যান্ডলার: হাই-স্পিড লোডিং ও ক্যাশিং স্ট্র্যাটেজি
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // শুধুমাত্র GET রিকোয়েস্ট ক্যাশ করবে (POST, PUT বা অন্য মেথড সরাসরি পাস করবে)
  if (event.request.method !== 'GET') return;

  // ⚠️ Firebase, Firestore বা ব্যাকএন্ড API কল ক্যাশ করা যাবে না (রিয়েলটাইম অর্ডারের জন্য সরাসরি নেটওয়ার্কে যাবে)
  if (
    url.hostname.includes('firestore.googleapis.com') ||
    url.hostname.includes('firebaseio.com') ||
    url.hostname.includes('identitytoolkit.googleapis.com')
  ) {
    return;
  }

  // ⚡ JS, CSS, ফন্ট এবং ইমেজের জন্য: Stale-While-Revalidate (ইনস্ট্যান্ট ক্যাশ থেকে দেখাবে, গোপনে আপডেট আনবে)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // ইন্টারনেট না থাকলে ক্যাশ করা ফাইল বা ফলব্যাক
          return cachedResponse;
        });

      return cachedResponse || fetchPromise;
    })
  );
});
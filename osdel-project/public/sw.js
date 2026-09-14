self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('fetch', (e) => {
  // ক্যাশিং ছাড়াই সাধারণ ফেচ রিকোয়েস্ট পাস করবে
  return;
});
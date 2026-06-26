const CGN_NOW_CACHE = 'cgn-now-shell-v3-radar44';
const CORE_ASSETS = [
  "/",
  "/index.html",
  "/news/",
  "/sports/",
  "/weather/",
  "/weather/radar/",
  "/weather/radar/indianapolis/",
  "/weather/radar/valparaiso/",
  "/weather/radar/chicago/",
  "/weather/radar/des-moines/",
  "/weather/radar/st-louis/",
  "/weather/radar/kansas-city/",
  "/weather/radar/springfield/",
  "/weather/radar/tecumseh/",
  "/weather/radar/wichita/",
  "/weather/radar/detroit/",
  "/weather/radar/grand-rapids/",
  "/weather/radar/cleveland/",
  "/weather/radar/columbus/",
  "/weather/radar/cincinnati/",
  "/weather/radar/milwaukee/",
  "/weather/radar/madison/",
  "/weather/radar/minneapolis-st-paul/",
  "/weather/radar/omaha/",
  "/weather/radar/fargo/",
  "/weather/radar/sioux-falls/",
  "/weather/radar/louisville/",
  "/weather/radar/lexington/",
  "/weather/radar/nashville/",
  "/weather/radar/memphis/",
  "/weather/radar/new-york/",
  "/weather/radar/boston/",
  "/weather/radar/philadelphia/",
  "/weather/radar/pittsburgh/",
  "/weather/radar/washington-dc/",
  "/weather/radar/norfolk/",
  "/weather/radar/raleigh/",
  "/weather/radar/myrtle-beach/",
  "/weather/radar/miami/",
  "/weather/radar/tampa/",
  "/weather/radar/orlando/",
  "/weather/radar/baton-rouge/",
  "/weather/radar/atlanta/",
  "/weather/radar/dallas/",
  "/weather/radar/denver/",
  "/weather/radar/salt-lake-city/",
  "/weather/radar/las-vegas/",
  "/weather/radar/phoenix/",
  "/weather/radar/los-angeles/",
  "/weather/radar/seattle/",
  "/weather/weekly-weather-brief/",
  "/account/",
  "/support/",
  "/reporters/",
  "/terms-of-service/",
  "/privacy-policy/",
  "/editorial-standards/",
  "/equal-opportunity/",
  "/copyright/",
  "/assets/cgn-now.css",
  "/assets/cgn-now-shell.js",
  "/weather/CGNWeatherRadar01.png",
  "/weather/CGNWeatherRadar02.png",
  "/weather/radar/st-louis/CGNWeatherRadar03.png",
  "/CGNNewsNowLogo.png",
  "/icons/pwa-192.png",
  "/icons/pwa-512.png",
  "/icons/pwa-maskable-512.png",
  "/apple-touch-icon.png",
  "/site.webmanifest"
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CGN_NOW_CACHE).then(cache => cache.addAll(CORE_ASSETS)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CGN_NOW_CACHE).map(key => caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(() =>
        caches.match(req).then(match => match || caches.match('/news/')).then(match => match || caches.match('/'))
      )
    );
    return;
  }

  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CGN_NOW_CACHE).then(cache => cache.put(req, copy)).catch(() => {});
        return res;
      }).catch(() => cached);
    })
  );
});

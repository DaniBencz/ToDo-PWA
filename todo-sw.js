'use strict'

console.log("in todo-sw.js")
const cacheName = "todo2"

/* window. */self.addEventListener('install', function (e) {
  console.log('worker installed')
  e.waitUntil(
    caches.open(cacheName).then(function (cache) {
      console.log('caching')

      return cache.addAll([
        '/',  // this is needed, else won't work! 
        'favicon.ico',
        'index.html',
        'style.css',
        'main.js',
        'https://unpkg.com/primitive-ui/dist/css/main.css',
        'manifest.json',
        // 'png/launcher-icon-144.png'
      ])
    }).then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(cacheNames => {
      cacheNames.forEach(name => {
        if (name !== cacheName) caches.delete(name)
      })
    })
  )
})

// add home screen: https://developers.google.com/web/fundamentals/app-install-banners

self.addEventListener('fetch', e => {

  if (e.request.url.includes('/launcher-icon')) {
    console.log('.png!')
    e.respondWith(
      caches.match(e.request) // try cache first
        .then((resp) => {
          return resp || fetch(e.request) // cache won't yield first time around
            // .then() // use this to add .png files to cache
        })
    )
  }
  else {
    e.respondWith(

      // fetch(e.request) // do a regular fetch, no action
      //   //.then(() => console.log('fetching: ', e.request.url))
      //   .catch(() => { // there was network error, we use cache instead
      //     console.log('loading from cache')
      //     return caches.match(e.request)
      //   })

      caches.match(e.request)
        .then((resp) => {
          return resp || fetch(e.request)
        })
        .catch(() => { fetch(e.request) }) // caches.match always resolves, we never get here
    )
  }
})
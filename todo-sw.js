'use strict'

// console.log("in todo-sw.js")
const cacheName = "todo2"

/* window. */self.addEventListener('install', e => {
  // console.log('worker installed')
  e.waitUntil(
    caches.open(cacheName).then(cache => {
     // console.log('caching')
      return cache.addAll([
        '/',  // this is needed, else won't work! 
        'favicon.ico',
        'index.html',
        'style.css',
        'main.js',
        'https://unpkg.com/primitive-ui/dist/css/main.css',
        'manifest.json',
      ])
    }).then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', e => {
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

  if (e.request.url.includes('/launcher-icon')) { // all this only runs after reload
    e.respondWith(
      caches.match(e.request) // try cache first
        .then(resp => {
          // console.log(resp)
          return resp || fetch(e.request) // cache won't yield first time around
            .then(f_resp => {
              const respClone = f_resp.clone()  // resp can be used only once, workaround to clone it
              caches.open(cacheName)
                .then(cache => {
                  // console.log('updating')
                  cache.put(e.request, respClone)
                })
              return f_resp
            })
        })
    )
  }
  else {
    e.respondWith(
      caches.match(e.request)
        .then((resp) => {
          return resp || fetch(e.request)
        })
        .catch(() => { fetch(e.request) }) // caches.match always resolves, we never get here
    )
  }
})
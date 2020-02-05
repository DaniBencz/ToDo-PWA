'use strict'

// window.resizeTo(500, 500) disabled in Chrome

const form = document.querySelector('form'),
  ul = document.querySelector('ul'),
  clear = document.querySelector('button'),
  input = document.getElementById('item'),
  container = document.getElementsByClassName('small-container')[0]
let itemsArray = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : []

//local storage values are always string type!
localStorage.setItem('items', JSON.stringify(itemsArray))
const data = JSON.parse(localStorage.getItem('items'))

const liMaker = text => {
  const li = document.createElement('li')
  const del = document.createElement('button')
  del.innerHTML = '—'
  del.setAttribute('class', 'del')

  // const del = document.createElement('img')
  // del.setAttribute('src', 'delete.png')
  /*  del.setAttribute('height', '25')
   del.setAttribute('width', '25') */

  del.addEventListener('click', e => {
    e.preventDefault()
    document.querySelectorAll('li').forEach(el => {
      //delete element
      if (el.getAttribute('key') === text) {
        el.parentNode.removeChild(el)
      }
    })

    //remove from localSt
    let temp = JSON.parse(localStorage.getItem('items'))
    temp.splice(temp.indexOf(text), 1)
    localStorage.setItem('items', JSON.stringify(temp))
  })

  li.setAttribute('key', text)
  li.appendChild(del)

  const t = document.createTextNode(text)
  li.appendChild(t)
  // li.textContent = text
  ul.appendChild(li)
}

form.addEventListener('submit', function (e) {
  e.preventDefault()

  itemsArray.push(input.value)
  localStorage.setItem('items', JSON.stringify(itemsArray))
  liMaker(input.value)
  input.value = ''
})

data.forEach(item => {
  liMaker(item)
})

clear.addEventListener('click', function () {
  localStorage.clear()
  while (ul.firstChild) {
    ul.removeChild(ul.firstChild)
  }
})

// Service Worker and Caching
if (navigator.serviceWorker) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('todo-sw.js', {
      scope: '/'  // optional
    })
      .then((registration) =>
        console.log('todo-sw.js registered with scope: ' + registration.scope))
  })
}

const installHandler = () => {
  let install = document.getElementById('install')
  install.addEventListener('click', e => {
    install.style.display = 'none'
    deferredPromptEvent.prompt()
    deferredPromptEvent.userChoice
  })
}

// install promt
let deferredPromptEvent
window.addEventListener('beforeinstallprompt', (e) => {
  deferredPromptEvent = e // stash event to trigger later

  let install = document.createElement("button")
  install.innerHTML = "Install"
  install.setAttribute("id", "install")
  container.appendChild(install)
  //title.parentNode.insertBefore(install, title.nextSibling)

  installHandler()
})

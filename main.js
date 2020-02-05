'use strict'

// window.resizeTo(500, 500) disabled in Chrome

const form = document.querySelector('form'),
  ul = document.querySelector('ul'),
  clear = document.querySelector('button'),
  input = document.getElementById('item'),
  container = document.getElementsByClassName('small-container')[0]
let itemsArray = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : []

localStorage.setItem('items', JSON.stringify(itemsArray)) //local storage values are always string type!
const data = JSON.parse(localStorage.getItem('items'))

const liMaker = text => {
  const li = document.createElement('li')
  const del = document.createElement('button')
  del.innerHTML = '<b>—</b>'
  del.setAttribute('class', 'del')

  del.addEventListener('click', e => {
    e.preventDefault()
    document.querySelectorAll('li').forEach(el => {
      if (el.getAttribute('key') === text) {
        el.parentNode.removeChild(el) //delete element from DOM
      }
    })

    let temp = JSON.parse(localStorage.getItem('items'))
    temp.splice(temp.indexOf(text), 1) //remove from local storage
    localStorage.setItem('items', JSON.stringify(temp))
  })

  li.setAttribute('key', text)
  li.appendChild(del)

  const t = document.createTextNode(text)
  li.appendChild(t)
  // li.textContent = text // won't work with button
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

if (navigator.serviceWorker) {  // Service Worker and Caching
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

let deferredPromptEvent // install promt
window.addEventListener('beforeinstallprompt', (e) => {
  deferredPromptEvent = e // stash event to trigger later

  let install = document.createElement("button")
  install.innerHTML = "Install"
  install.setAttribute("id", "install")
  container.appendChild(install)
  //title.parentNode.insertBefore(install, title.nextSibling)

  installHandler()
})

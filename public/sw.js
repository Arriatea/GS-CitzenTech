/*
 * Service worker do Gota a Gota: guarda o app no aparelho para abrir mesmo sem internet
 * (o sinal no sítio é fraco). Só é registrado na versão final (npm run build).
 * - Páginas: tenta a rede primeiro; sem rede, usa a cópia guardada.
 * - Arquivos (JS, CSS, fontes): usa a cópia guardada e atualiza por trás.
 */
const CACHE = 'gota-a-gota-v1'
const BASICO = ['./', './index.html', './manifest.webmanifest', './icone.svg']

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(BASICO)))
  self.skipWaiting()
})

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((chaves) => Promise.all(chaves.filter((k) => k !== CACHE).map((k) => caches.delete(k)))))
  self.clients.claim()
})

self.addEventListener('fetch', (e) => {
  const pedido = e.request
  if (pedido.method !== 'GET') return
  const url = new URL(pedido.url)
  const fonte = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com'
  if (url.origin !== self.location.origin && !fonte) return

  if (pedido.mode === 'navigate') {
    e.respondWith(
      fetch(pedido)
        .then((resposta) => {
          const copia = resposta.clone()
          caches.open(CACHE).then((c) => c.put('./index.html', copia))
          return resposta
        })
        .catch(() => caches.match('./index.html')),
    )
    return
  }

  e.respondWith(
    caches.match(pedido).then((guardado) => {
      const daRede = fetch(pedido)
        .then((resposta) => {
          if (resposta.ok || resposta.type === 'opaque') {
            const copia = resposta.clone()
            caches.open(CACHE).then((c) => c.put(pedido, copia))
          }
          return resposta
        })
        .catch(() => guardado)
      return guardado || daRede
    }),
  )
})

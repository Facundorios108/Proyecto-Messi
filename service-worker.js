// Service Worker para Messi Stats PWA
const CACHE_NAME = 'messi-stats-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/pages/messi_page.html',
  '/pages/messi_page2.html',
  '/pages/messi_page3.html',
  '/pages/messi_page4.html',
  '/css/styles.css',
  '/js/messi-stats-loader.js',
  '/js/messi-bot-data.json',
  '/js/messi-stats.json',
  '/chatbot_engine_improved.js',
  '/images/MessiSeleccion.jpg',
  '/images/EscudoBar.png',
  '/images/EscudoPSG.png',
  '/images/EscudoInt.png',
  '/images/EscudoAFA.png',
  '/Lionel Messi.avif',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Instalación del Service Worker
self.addEventListener('install', event => {
  console.log('🔧 Service Worker: Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Service Worker: Cacheando archivos');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('✅ Service Worker: Instalado correctamente');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('❌ Error al cachear archivos:', error);
      })
  );
});

// Activación del Service Worker
self.addEventListener('activate', event => {
  console.log('🚀 Service Worker: Activando...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Service Worker: Eliminando caché antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Service Worker: Activado correctamente');
      return self.clients.claim();
    })
  );
});

// Estrategia de caché: Network First, fallback to Cache
self.addEventListener('fetch', event => {
  // Ignorar peticiones que no sean GET o que sean a APIs externas no críticas
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Si la respuesta es válida, actualizar el caché
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Si falla la red, buscar en caché
        return caches.match(event.request).then(cachedResponse => {
          if (cachedResponse) {
            console.log('📱 Sirviendo desde caché:', event.request.url);
            return cachedResponse;
          }
          
          // Si no está en caché y es una página HTML, devolver página offline
          if (event.request.headers.get('accept').includes('text/html')) {
            return caches.match('/index.html');
          }
        });
      })
  );
});

// Manejo de mensajes desde la app
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Sincronización en segundo plano
self.addEventListener('sync', event => {
  if (event.tag === 'sync-stats') {
    event.waitUntil(syncStats());
  }
});

async function syncStats() {
  try {
    const response = await fetch('http://localhost:9000/api/stats');
    if (response.ok) {
      const data = await response.json();
      // Guardar datos actualizados
      const cache = await caches.open(CACHE_NAME);
      await cache.put('/api/stats', new Response(JSON.stringify(data)));
      console.log('✅ Estadísticas sincronizadas');
    }
  } catch (error) {
    console.log('⚠️ No se pudieron sincronizar las estadísticas');
  }
}

// Notificaciones push (opcional para futuras actualizaciones)
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : '¡Nueva actualización disponible!',
    icon: '/images/icon-192x192.png',
    badge: '/images/icon-72x72.png',
    vibrate: [200, 100, 200],
    tag: 'messi-stats-notification',
    requireInteraction: false,
    actions: [
      { action: 'view', title: 'Ver ahora', icon: '/images/icon-72x72.png' },
      { action: 'close', title: 'Cerrar', icon: '/images/icon-72x72.png' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Messi Stats', options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

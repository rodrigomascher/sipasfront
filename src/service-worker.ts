/**
 * SIPAS Service Worker
 * 
 * Enables offline functionality, push notifications, and background sync
 */

const CACHE_NAME = 'sipas-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/main.js',
  '/polyfills.js',
  '/runtime.js'
];

/**
 * Install event - Cache static assets
 */
self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

/**
 * Activate event - Clean up old caches
 */
self.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
  self.clients.claim();
});

/**
 * Fetch event - Network first strategy with fallback to cache
 */
self.addEventListener('fetch', (event: FetchEvent) => {
  const url = new URL(event.request.url);
  
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Skip external requests
  if (url.origin !== self.location.origin) {
    return;
  }
  
  // API requests - Network first, fallback to cache
  if (url.pathname.startsWith('/api')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache successful API responses
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Return cached response on network failure
          return caches.match(event.request).then((response) => {
            return response || createErrorResponse('Offline - data unavailable');
          });
        })
    );
    return;
  }
  
  // Static assets - Cache first, fallback to network
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      
      return fetch(event.request).then((response) => {
        // Cache successful responses
        if (response.ok && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      }).catch(() => {
        // Return fallback for failed static assets
        return createErrorResponse('Resource unavailable');
      });
    })
  );
});

/**
 * Message event - Handle messages from the app
 */
self.addEventListener('message', (event) => {
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data.type === 'CACHE_CLEAR') {
    caches.delete(CACHE_NAME).then(() => {
      event.ports[0].postMessage({ success: true });
    });
  }
});

/**
 * Push event - Handle push notifications
 */
self.addEventListener('push', (event: PushEvent) => {
  const data = event.data?.json() || {};
  const options: NotificationOptions = {
    body: data.body || 'Nova notificação SIPAS',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-128x128.png',
    tag: data.tag || 'sipas-notification',
    requireInteraction: data.requireInteraction || false,
    actions: data.actions || [],
    data: data.data || {}
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'SIPAS', options)
  );
});

/**
 * Notification click event - Handle notification interactions
 */
self.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close();
  
  const urlToOpen = (event.notification.data && event.notification.data.url) || '/';
  
  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then((clientList) => {
      // Look for existing window/tab with target URL
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if ((client as any).url === urlToOpen && 'focus' in client) {
          return (client as any).focus();
        }
      }
      // Open new window/tab if not found
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

/**
 * Background sync event - Handle background sync
 */
self.addEventListener('sync', (event: any) => {
  if (event.tag === 'sync-pending-changes') {
    event.waitUntil(syncPendingChanges());
  }
});

/**
 * Sync pending changes with server
 */
async function syncPendingChanges() {
  try {
    const cache = await caches.open(CACHE_NAME);
    const keys = await cache.keys();
    
    for (const request of keys) {
      if (request.url.includes('/api')) {
        try {
          await fetch(request.clone());
        } catch (error) {
          console.error('Sync failed for:', request.url, error);
        }
      }
    }
  } catch (error) {
    console.error('Background sync error:', error);
    throw error;
  }
}

/**
 * Create a simple error response
 */
function createErrorResponse(message: string): Response {
  return new Response(
    JSON.stringify({
      error: message,
      offline: true,
      timestamp: new Date().toISOString()
    }),
    {
      status: 503,
      statusText: 'Service Unavailable',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
}

/**
 * Periodic background sync - Sync data periodically
 */
if ('periodicSync' in self.registration) {
  self.addEventListener('periodicsync', (event: any) => {
    if (event.tag === 'update-data') {
      event.waitUntil(updateAppData());
    }
  });
}

/**
 * Update app data from server
 */
async function updateAppData() {
  try {
    const response = await fetch('/api/data-sync');
    if (response.ok) {
      const data = await response.json();
      // Notify all clients of data update
      const clients = await self.clients.matchAll();
      clients.forEach((client: any) => {
        client.postMessage({
          type: 'DATA_SYNC',
          data
        });
      });
    }
  } catch (error) {
    console.error('Data sync error:', error);
  }
}

export {};

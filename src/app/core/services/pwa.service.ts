import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * PWA Service
 * 
 * Manages Progressive Web App features:
 * - Service Worker registration
 * - Push notifications
 * - Offline detection
 * - App update handling
 * - Installation prompts
 */
@Injectable({
  providedIn: 'root'
})
export class PwaService {
  private readonly isOnline$ = new BehaviorSubject<boolean>(navigator.onLine);
  private readonly updateAvailable$ = new BehaviorSubject<boolean>(false);
  private readonly installPrompt$ = new BehaviorSubject<any>(null);
  
  private serviceWorkerReady = false;
  private deferredPrompt: any;

  constructor() {
    this.initializeServiceWorker();
    this.setupOnlineOfflineDetection();
    this.setupInstallPrompt();
  }

  /**
   * Register service worker
   */
  private initializeServiceWorker(): void {
    if (!('serviceWorker' in navigator)) {
      console.warn('Service Worker not supported');
      return;
    }

    navigator.serviceWorker.register('/service-worker.js', {
      scope: '/'
    }).then((registration) => {
      console.log('Service Worker registered:', registration);
      this.serviceWorkerReady = true;

      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker available
              this.updateAvailable$.next(true);
              this.notifyUpdateAvailable();
            }
          });
        }
      });

      // Periodic check for updates (every hour)
      setInterval(() => {
        registration.update();
      }, 3600000);
    }).catch((error) => {
      console.error('Service Worker registration failed:', error);
    });
  }

  /**
   * Setup online/offline detection
   */
  private setupOnlineOfflineDetection(): void {
    window.addEventListener('online', () => {
      this.isOnline$.next(true);
      console.log('App is now online');
      this.syncOfflineChanges();
    });

    window.addEventListener('offline', () => {
      this.isOnline$.next(false);
      console.log('App is now offline');
    });
  }

  /**
   * Setup install prompt handling
   */
  private setupInstallPrompt(): void {
    window.addEventListener('beforeinstallprompt', (event: any) => {
      // Prevent the mini-infobar from appearing
      event.preventDefault();
      // Store the event for later use
      this.deferredPrompt = event;
      // Show install button
      this.installPrompt$.next(event);
    });

    window.addEventListener('appinstalled', () => {
      console.log('SIPAS app installed');
      this.deferredPrompt = null;
      this.installPrompt$.next(null);
    });
  }

  /**
   * Get online status observable
   */
  getOnlineStatus$(): Observable<boolean> {
    return this.isOnline$.asObservable();
  }

  /**
   * Get update available observable
   */
  getUpdateAvailable$(): Observable<boolean> {
    return this.updateAvailable$.asObservable();
  }

  /**
   * Get install prompt observable
   */
  getInstallPrompt$(): Observable<any> {
    return this.installPrompt$.asObservable();
  }

  /**
   * Check if app is online
   */
  isOnline(): boolean {
    return this.isOnline$.value;
  }

  /**
   * Check if update is available
   */
  isUpdateAvailable(): boolean {
    return this.updateAvailable$.value;
  }

  /**
   * Show install prompt
   */
  async showInstallPrompt(): Promise<boolean> {
    if (!this.deferredPrompt) {
      return false;
    }

    this.deferredPrompt.prompt();
    const { outcome } = await this.deferredPrompt.userChoice;
    
    this.deferredPrompt = null;
    this.installPrompt$.next(null);
    
    return outcome === 'accepted';
  }

  /**
   * Handle app update
   */
  skipWaitingAndReload(): void {
    if (!this.serviceWorkerReady) {
      return;
    }

    navigator.serviceWorker.controller?.postMessage({ type: 'SKIP_WAITING' });

    // Reload page after waiting for new worker activation
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });
  }

  /**
   * Request notification permission
   */
  async requestNotificationPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('Notifications not supported');
      return 'denied';
    }

    if (Notification.permission !== 'granted') {
      return Notification.requestPermission();
    }

    return 'granted';
  }

  /**
   * Subscribe to push notifications
   */
  async subscribeToPushNotifications(): Promise<PushSubscription | null> {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('Push notifications not supported');
      return null;
    }

    const permission = await this.requestNotificationPermission();
    if (permission !== 'granted') {
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        return subscription;
      }

      // Create new subscription
      // In production, use real VAPID public key from server
      const newSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array('YOUR_VAPID_PUBLIC_KEY')
      });

      return newSubscription;
    } catch (error) {
      console.error('Push subscription failed:', error);
      return null;
    }
  }

  /**
   * Convert base64 VAPID key to Uint8Array
   */
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  /**
   * Register periodic background sync
   */
  async registerPeriodicSync(): Promise<void> {
    if (!('serviceWorker' in navigator) || !('periodicSync' in ServiceWorkerRegistration.prototype)) {
      console.warn('Periodic sync not supported');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const periodicReg = registration as any;
      
      if (periodicReg.periodicSync) {
        await periodicReg.periodicSync.register('update-data', {
          minInterval: 24 * 60 * 60 * 1000 // 24 hours
        });
        console.log('Periodic sync registered');
      }
    } catch (error) {
      console.error('Periodic sync registration failed:', error);
    }
  }

  /**
   * Register background sync
   */
  async registerBackgroundSync(): Promise<void> {
    if (!('serviceWorker' in navigator) || !('SyncManager' in window)) {
      console.warn('Background sync not supported');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const syncManager = registration.sync as any;
      await syncManager.register('sync-pending-changes');
      console.log('Background sync registered');
    } catch (error) {
      console.error('Background sync registration failed:', error);
    }
  }

  /**
   * Sync offline changes when back online
   */
  private syncOfflineChanges(): void {
    if (!('serviceWorker' in navigator)) {
      return;
    }

    navigator.serviceWorker.ready.then((registration) => {
      const syncManager = registration.sync as any;
      if (syncManager) {
        syncManager.register('sync-pending-changes')
          .then(() => console.log('Offline changes synced'))
          .catch((error) => console.error('Sync failed:', error));
      }
    });
  }

  /**
   * Notify user of available update
   */
  private notifyUpdateAvailable(): void {
    const message = 'Nova versão do SIPAS disponível';
    
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Atualização disponível', {
        body: message,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-128x128.png'
      });
    }
  }

  /**
   * Clear all caches
   */
  async clearCache(): Promise<boolean> {
    if (!('caches' in window)) {
      return false;
    }

    const cacheNames = await caches.keys();
    const deletionPromises = cacheNames.map((cacheName) => caches.delete(cacheName));
    await Promise.all(deletionPromises);
    return true;
  }

  /**
   * Get cache size
   */
  async getCacheSize(): Promise<string> {
    if (!('storage' in navigator)) {
      return 'N/A';
    }

    try {
      const estimate = await (navigator.storage as any).estimate();
      const usage = estimate.usage || 0;
      const quota = estimate.quota || 0;
      const percent = ((usage / quota) * 100).toFixed(2);
      return `${(usage / 1024 / 1024).toFixed(2)} MB / ${(quota / 1024 / 1024).toFixed(2)} MB (${percent}%)`;
    } catch (error) {
      console.error('Cache size estimation failed:', error);
      return 'N/A';
    }
  }
}

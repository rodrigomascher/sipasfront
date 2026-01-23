import { Injectable, inject } from '@angular/core';
import {
  PreloadingStrategy,
  Route,
} from '@angular/router';
import { Observable, of, timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

/**
 * QuicklinkStrategy: Preload modules that are linked on the page
 * This helps improve performance by preloading routes that the user is likely to visit
 */
@Injectable({
  providedIn: 'root'
})
export class QuicklinkStrategy implements PreloadingStrategy {
  /**
   * Set of routes that should NOT be preloaded
   */
  private noPreload = new Set<string>([
    'auth',  // Auth routes load on demand
  ]);

  preload(route: Route, load: () => Observable<any>): Observable<any> {
    if (!route.path) {
      return of(null);
    }

    // Don't preload routes in the noPreload set
    if (this.noPreload.has(route.path)) {
      return of(null);
    }

    // Preload other routes with a delay to not block initial render
    return timer(100).pipe(
      mergeMap(() => load())
    );
  }
}

/**
 * AggressivePreloadingStrategy: Preload all lazy modules
 * Use with caution as this loads all modules regardless
 */
@Injectable({
  providedIn: 'root'
})
export class AggressivePreloadingStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    // Don't preload modules with preloadDelay: 0 in their data
    if (route.data && route.data['preloadDelay'] === 0) {
      return of(null);
    }

    // Preload with delay to avoid blocking initial render
    return timer(500).pipe(
      mergeMap(() => load())
    );
  }
}

/**
 * NoPreloadStrategy: Don't preload any modules
 * Load only when explicitly requested
 */
@Injectable({
  providedIn: 'root'
})
export class NoPreloadStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    return of(null);
  }
}

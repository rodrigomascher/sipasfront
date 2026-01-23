import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * LoadingService: Manages global loading state
 * Used to show/hide global loading indicator during API calls
 */
@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingCount$ = new BehaviorSubject<number>(0);
  private isLoading$ = this.loadingCount$.asObservable();

  constructor() {}

  /**
   * Get loading state as Observable
   */
  getLoading(): Observable<boolean> {
    return new Observable(observer => {
      this.loadingCount$.subscribe(count => {
        observer.next(count > 0);
      });
    });
  }

  /**
   * Show loading indicator (increment counter)
   */
  show(): void {
    const current = this.loadingCount$.value;
    this.loadingCount$.next(current + 1);
  }

  /**
   * Hide loading indicator (decrement counter)
   */
  hide(): void {
    const current = this.loadingCount$.value;
    if (current > 0) {
      this.loadingCount$.next(current - 1);
    }
  }

  /**
   * Hide all loading indicators
   */
  hideAll(): void {
    this.loadingCount$.next(0);
  }

  /**
   * Check if currently loading
   */
  isLoading(): boolean {
    return this.loadingCount$.value > 0;
  }

  /**
   * Get current loading count
   */
  getLoadingCount(): number {
    return this.loadingCount$.value;
  }
}

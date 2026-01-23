import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number; // Duration in milliseconds, 0 = no auto-dismiss
}

/**
 * Service for managing notifications (toasts/snackbars)
 * Provides a centralized way to show user-facing messages
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications$ = new BehaviorSubject<Notification[]>([]);
  private notificationIdCounter = 0;

  constructor() {}

  /**
   * Get all active notifications as Observable
   */
  getNotifications(): Observable<Notification[]> {
    return this.notifications$.asObservable();
  }

  /**
   * Show success notification
   */
  success(title: string, message: string, duration: number = 3000): void {
    this.show({
      type: 'success',
      title,
      message,
      duration,
    });
  }

  /**
   * Show error notification
   */
  error(title: string, message: string, duration: number = 5000): void {
    this.show({
      type: 'error',
      title,
      message,
      duration,
    });
  }

  /**
   * Show warning notification
   */
  warning(title: string, message: string, duration: number = 4000): void {
    this.show({
      type: 'warning',
      title,
      message,
      duration,
    });
  }

  /**
   * Show info notification
   */
  info(title: string, message: string, duration: number = 3000): void {
    this.show({
      type: 'info',
      title,
      message,
      duration,
    });
  }

  /**
   * Show a custom notification
   */
  show(notification: Omit<Notification, 'id'>): void {
    const id = `notification-${this.notificationIdCounter++}`;
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration ?? 3000,
    };

    // Add notification to the list
    const current = this.notifications$.value;
    this.notifications$.next([...current, newNotification]);

    // Auto-dismiss if duration is set
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, newNotification.duration);
    }
  }

  /**
   * Dismiss a specific notification
   */
  dismiss(id: string): void {
    const current = this.notifications$.value;
    this.notifications$.next(
      current.filter(notification => notification.id !== id)
    );
  }

  /**
   * Dismiss all notifications
   */
  dismissAll(): void {
    this.notifications$.next([]);
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from '../../../core/services/notification.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-notification-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notification-container">
      <div
        *ngFor="let notification of notifications"
        [@slideIn]
        class="notification"
        [ngClass]="'notification--' + notification.type"
      >
        <div class="notification__content">
          <div class="notification__title">{{ notification.title }}</div>
          <div class="notification__message">{{ notification.message }}</div>
        </div>
        <button
          class="notification__close"
          (click)="onDismiss(notification.id)"
          aria-label="Close notification"
        >
          ✕
        </button>
      </div>
    </div>
  `,
  styles: [`
    .notification-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-width: 400px;
    }

    .notification {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 16px;
      border-radius: 8px;
      background: white;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      animation: slideInRight 0.3s ease-out;
      min-height: 60px;
    }

    .notification__content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .notification__title {
      font-weight: 600;
      font-size: 14px;
      line-height: 1.4;
    }

    .notification__message {
      font-size: 13px;
      line-height: 1.4;
      opacity: 0.8;
    }

    .notification__close {
      background: none;
      border: none;
      padding: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      opacity: 0.5;
      font-size: 18px;
      line-height: 1;
      transition: opacity 0.2s;
      flex-shrink: 0;
    }

    .notification__close:hover {
      opacity: 0.8;
    }

    /* Success notification */
    .notification--success {
      background: #ecfdf5;
      border-left: 4px solid #10b981;
    }

    .notification--success .notification__title {
      color: #047857;
    }

    .notification--success .notification__message {
      color: #065f46;
    }

    .notification--success .notification__close {
      color: #10b981;
    }

    /* Error notification */
    .notification--error {
      background: #fef2f2;
      border-left: 4px solid #ef4444;
    }

    .notification--error .notification__title {
      color: #dc2626;
    }

    .notification--error .notification__message {
      color: #991b1b;
    }

    .notification--error .notification__close {
      color: #ef4444;
    }

    /* Warning notification */
    .notification--warning {
      background: #fffbeb;
      border-left: 4px solid #f59e0b;
    }

    .notification--warning .notification__title {
      color: #d97706;
    }

    .notification--warning .notification__message {
      color: #92400e;
    }

    .notification--warning .notification__close {
      color: #f59e0b;
    }

    /* Info notification */
    .notification--info {
      background: #eff6ff;
      border-left: 4px solid #3b82f6;
    }

    .notification--info .notification__title {
      color: #1e40af;
    }

    .notification--info .notification__message {
      color: #1e3a8a;
    }

    .notification--info .notification__close {
      color: #3b82f6;
    }

    @keyframes slideInRight {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @media (max-width: 768px) {
      .notification-container {
        left: 10px;
        right: 10px;
        top: 10px;
        max-width: none;
      }

      .notification {
        min-height: auto;
      }
    }
  `]
})
export class NotificationContainerComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  private destroy$ = new Subject<void>();

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.notificationService
      .getNotifications()
      .pipe(takeUntil(this.destroy$))
      .subscribe(notifications => {
        this.notifications = notifications;
      });
  }

  onDismiss(id: string): void {
    this.notificationService.dismiss(id);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

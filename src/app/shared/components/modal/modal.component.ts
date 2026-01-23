import { Component, Input, Output, EventEmitter, ContentChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Generic Modal Component
 * Provides a reusable modal wrapper with header, body, and footer sections
 * Uses shared styles from shared-theme.scss
 */
@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" (click)="onBackdropClick()" *ngIf="isOpen">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <!-- Modal Header -->
        <div class="modal-header" *ngIf="title">
          <h2>{{ title }}</h2>
          <button class="close-btn" (click)="close()">✕</button>
        </div>

        <!-- Modal Body - Custom Content -->
        <div class="modal-body">
          <ng-content></ng-content>
        </div>

        <!-- Modal Footer/Actions -->
        <div class="modal-actions" *ngIf="showActions">
          <ng-content select="[modal-actions]"></ng-content>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-body {
      padding: 20px;
    }
  `]
})
export class ModalComponent {
  @Input() isOpen = false;
  @Input() title?: string;
  @Input() showActions = true;
  @Input() closeOnBackdropClick = true;

  @Output() closed = new EventEmitter<void>();

  open(): void {
    this.isOpen = true;
  }

  close(): void {
    this.isOpen = false;
    this.closed.emit();
  }

  onBackdropClick(): void {
    if (this.closeOnBackdropClick) {
      this.close();
    }
  }
}

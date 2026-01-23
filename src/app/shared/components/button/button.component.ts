import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
export type ButtonSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [disabled]="disabled || loading"
      [class]="buttonClasses"
      (click)="onClick()"
    >
      <span *ngIf="!loading">
        <ng-content></ng-content>
      </span>
      <span *ngIf="loading" class="loading-state">
        <span class="spinner"></span>
        <span *ngIf="loadingText">{{ loadingText }}</span>
      </span>
    </button>
  `,
  styles: [`
    button {
      font-family: inherit;
      font-weight: 600;
      border: none;
      border-radius: 0.55rem;
      cursor: pointer;
      transition: all 0.15s ease;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      white-space: nowrap;
      text-decoration: none;
      user-select: none;
    }

    /* Sizes */
    button.size-small {
      padding: 0.5rem 1rem;
      font-size: 0.85rem;
    }

    button.size-medium {
      padding: 0.625rem 1.25rem;
      font-size: 0.9rem;
    }

    button.size-large {
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
    }

    /* Variants */
    button.variant-primary {
      background: linear-gradient(135deg, #5e72e4 0%, #825ee4 100%);
      color: white;
      border: 2px solid transparent;
    }

    button.variant-primary:hover:not(:disabled) {
      background: linear-gradient(135deg, #4c63d2 0%, #6d46d3 100%);
      box-shadow: 0 5px 15px rgba(94, 114, 228, 0.3);
      transform: translateY(-2px);
    }

    button.variant-primary:active:not(:disabled) {
      transform: translateY(0);
    }

    button.variant-secondary {
      background: #f7fafc;
      color: #525f7f;
      border: 2px solid #e3e6f0;
    }

    button.variant-secondary:hover:not(:disabled) {
      background: #f0f4ff;
      border-color: #5e72e4;
      color: #5e72e4;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    }

    button.variant-secondary:active:not(:disabled) {
      transform: translateY(0);
    }

    button.variant-danger {
      background: #f5365c;
      color: white;
      border: 2px solid transparent;
    }

    button.variant-danger:hover:not(:disabled) {
      background: #ec0c38;
      box-shadow: 0 5px 15px rgba(245, 54, 92, 0.3);
      transform: translateY(-2px);
    }

    button.variant-danger:active:not(:disabled) {
      transform: translateY(0);
    }

    button.variant-success {
      background: #2dce89;
      color: white;
      border: 2px solid transparent;
    }

    button.variant-success:hover:not(:disabled) {
      background: #1fb471;
      box-shadow: 0 5px 15px rgba(45, 206, 137, 0.3);
      transform: translateY(-2px);
    }

    button.variant-success:active:not(:disabled) {
      transform: translateY(0);
    }

    button.variant-warning {
      background: #fb6340;
      color: white;
      border: 2px solid transparent;
    }

    button.variant-warning:hover:not(:disabled) {
      background: #f04f1f;
      box-shadow: 0 5px 15px rgba(251, 99, 64, 0.3);
      transform: translateY(-2px);
    }

    button.variant-warning:active:not(:disabled) {
      transform: translateY(0);
    }

    /* Disabled State */
    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    /* Loading State */
    .loading-state {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .spinner {
      display: inline-block;
      width: 1em;
      height: 1em;
      border: 2px solid currentColor;
      border-right-color: transparent;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `]
})
export class ButtonComponent implements OnInit {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'medium';
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() loadingText: string = '';
  @Output() click = new EventEmitter<void>();

  buttonClasses: string = '';

  ngOnInit(): void {
    this.updateButtonClasses();
  }

  ngOnChanges(): void {
    this.updateButtonClasses();
  }

  private updateButtonClasses(): void {
    this.buttonClasses = `size-${this.size} variant-${this.variant}`;
  }

  onClick(): void {
    if (!this.disabled && !this.loading) {
      this.click.emit();
    }
  }
}

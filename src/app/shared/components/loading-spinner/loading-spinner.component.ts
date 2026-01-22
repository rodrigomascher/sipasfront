import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Overlay Mode (Full Screen) -->
    <div *ngIf="mode === 'overlay'" class="loading-overlay">
      <div class="spinner-box">
        <div class="spinner"></div>
        <p class="loading-text">{{ message }}</p>
      </div>
    </div>

    <!-- Container Mode (Inline) -->
    <div *ngIf="mode === 'container'" class="loading-container">
      <div class="spinner-wrapper">
        <div class="spinner"></div>
        <p class="loading-text">{{ message }}</p>
      </div>
    </div>

    <!-- Inline Mode (Button Text) -->
    <span *ngIf="mode === 'inline'" class="loading-inline">
      <span class="spinner-mini"></span>
      {{ message }}
    </span>

    <!-- Mini Mode (Small Indicator) -->
    <span *ngIf="mode === 'mini'" class="loading-mini">
      <span class="spinner-small"></span>
      <span *ngIf="message">{{ message }}</span>
    </span>
  `,
  styles: [`
    /* Overlay Mode - Full Screen Loading */
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 999;
    }

    .spinner-box {
      text-align: center;
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    /* Container Mode - Inline in Page */
    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 3rem 2rem;
      min-height: 200px;
    }

    .spinner-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    /* Main Spinner - Large */
    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #007bff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    /* Inline Mode - Inside Button */
    .loading-inline {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .spinner-mini {
      display: inline-block;
      width: 12px;
      height: 12px;
      border: 2px solid #ffffff;
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin-mini 0.6s linear infinite;
    }

    /* Mini Mode - Small Loading Indicator */
    .loading-mini {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: #666;
      font-size: 14px;
    }

    .spinner-small {
      display: inline-block;
      width: 14px;
      height: 14px;
      border: 2px solid #e0e0e0;
      border-top-color: #007bff;
      border-radius: 50%;
      animation: spin-small 0.8s linear infinite;
    }

    /* Text */
    .loading-text {
      color: #666;
      font-size: 14px;
      font-weight: 500;
      margin: 0;
      letter-spacing: 0.5px;
    }

    /* Animations */
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @keyframes spin-mini {
      to { transform: rotate(360deg); }
    }

    @keyframes spin-small {
      to { transform: rotate(360deg); }
    }

    /* Accessibility */
    @media (prefers-reduced-motion: reduce) {
      .spinner,
      .spinner-mini,
      .spinner-small {
        animation: none;
        border-top-color: #ccc;
      }
    }
  `]
})
export class LoadingSpinnerComponent {
  @Input() message: string = 'Carregando...';
  @Input() mode: 'overlay' | 'container' | 'inline' | 'mini' = 'container';
}

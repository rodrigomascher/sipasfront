import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading-container">
      <div class="spinner-wrapper">
        <div class="spinner"></div>
        <p class="loading-text">{{ message }}</p>
      </div>
    </div>
  `,
  styles: [`
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

    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid #f0f0f0;
      border-top: 4px solid #1976d2;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .loading-text {
      color: #666;
      font-size: 14px;
      font-weight: 500;
      margin: 0;
      letter-spacing: 0.5px;
    }

    @media (prefers-reduced-motion: reduce) {
      .spinner {
        animation: none;
        border-top-color: #ccc;
      }
    }
  `]
})
export class LoadingSpinnerComponent {
  @Input() message: string = 'Carregando...';
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-session-timer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="session-timer" *ngIf="isAuthenticated && timeRemaining !== null">
      <span class="timer-label">Sessão:</span>
      <span class="timer-value" [ngClass]="{ 'timer-warning': timeRemaining < 600 }">
        ⏱️ {{ formattedTime }}
      </span>
    </div>
  `,
  styles: [`
    .session-timer {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1.25rem;
      background: rgba(255, 255, 255, 0.15);
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 0.55rem;
      font-size: 0.95rem;
      font-weight: 600;
      backdrop-filter: blur(10px);
    }

    .timer-label {
      color: rgba(255, 255, 255, 0.95);
      font-size: 0.9rem;
    }

    .timer-value {
      font-family: 'Courier New', monospace;
      font-weight: 700;
      font-size: 1.1rem;
      color: #ffffff;
      text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
      letter-spacing: 0.5px;
    }

    .timer-warning {
      color: #FFD700;
      text-shadow: 0 0 10px rgba(255, 215, 0, 0.6);
      animation: pulse 1s infinite;
    }

    @keyframes pulse {
      0%, 100% {
        opacity: 1;
        transform: scale(1);
      }
      50% {
        opacity: 0.7;
        transform: scale(1.05);
      }
    }
  `]
})
export class SessionTimerComponent implements OnInit, OnDestroy {
  timeRemaining: number | null = null;
  formattedTime: string = '00:00:00';
  isAuthenticated: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.isAuthenticated = this.authService.isAuthenticated();
    
    if (this.isAuthenticated) {
      this.authService.getTimeRemaining$()
        .pipe(takeUntil(this.destroy$))
        .subscribe(remaining => {
          this.timeRemaining = remaining;
          this.formattedTime = this.authService.formatTime(remaining);
        });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

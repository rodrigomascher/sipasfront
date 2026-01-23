import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SessionTimerComponent } from '../session-timer/session-timer.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, SessionTimerComponent],
  template: `
    <header class="app-header" *ngIf="showHeader">
      <div class="navbar-brand" (click)="goToDashboard()" [title]="'Sistema Integrado de Prontuário e Assistência Social'">
        <h1 class="logo">SIPAS</h1>
        <p class="unit-name" *ngIf="selectedUnit$ | async as unit">
          {{ unit?.name }}
        </p>
      </div>
      
      <div class="header-right">
        <app-session-timer></app-session-timer>
        <div class="user-section">
          <div class="user-info">
            <p class="user-name">{{ (user$ | async)?.name || 'Usuário' }}</p>
            <span class="user-email">{{ (user$ | async)?.email }}</span>
          </div>
          <button class="logout-btn" (click)="onLogout()">
            <span>Sair</span>
          </button>
        </div>
      </div>
    </header>
  `,
  styles: [`
    /* Header/Navbar */
    .app-header {
      background: linear-gradient(135deg, #5e72e4 0%, #825ee4 100%);
      color: white;
      padding: 1.5rem 2rem;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .navbar-brand {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      cursor: pointer;
      transition: all 0.15s ease;
      
      &:hover {
        transform: scale(1.05);
        filter: brightness(1.1);
      }
    }

    .logo {
      margin: 0;
      font-size: 2rem;
      font-weight: 700;
      letter-spacing: -1px;
      text-transform: uppercase;
    }

    .unit-name {
      margin: 4px 0 0 0;
      font-size: 0.85rem;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.8);
      letter-spacing: 0.5px;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 2rem;
    }

    .user-section {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      padding-left: 1.5rem;
      border-left: 2px solid rgba(255, 255, 255, 0.2);
    }

    .user-info {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.25rem;
    }

    .user-name {
      margin: 0;
      font-size: 0.95rem;
      font-weight: 600;
    }

    .user-email {
      font-size: 0.8rem;
      opacity: 0.85;
    }

    .logout-btn {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 2px solid rgba(255, 255, 255, 0.3);
      padding: 0.625rem 1.25rem;
      border-radius: 0.55rem;
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: 600;
      transition: all 0.15s ease;
      backdrop-filter: blur(10px);

      &:hover {
        background: rgba(255, 255, 255, 0.3);
        border-color: rgba(255, 255, 255, 0.5);
        transform: translateY(-2px);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
      }

      &:active {
        transform: translateY(0);
      }
    }

    /* Responsive */
    @media (max-width: 768px) {
      .app-header {
        padding: 1rem;
        flex-wrap: wrap;
        gap: 1rem;
      }

      .navbar-brand {
        flex: 1;
      }

      .logo {
        font-size: 1.35rem;
      }

      .header-right {
        gap: 1rem;
        flex: 1;
      }
    }
  `]
})
export class HeaderComponent implements OnInit {
  @Input() showHeader: boolean = true;
  @Input() user$: Observable<any> = new Observable();
  @Input() selectedUnit$: Observable<any> = new Observable();
  @Output() logout = new EventEmitter<void>();

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Initialization if needed
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  onLogout(): void {
    this.logout.emit();
  }
}

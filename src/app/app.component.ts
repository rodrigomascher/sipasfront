import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './core/services/auth.service';
import { SessionTimerComponent } from './shared/components/session-timer/session-timer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, SessionTimerComponent],
  template: `
    <div class="app-container">
      <!-- Header/Navbar -->
      <header class="app-header" *ngIf="showHeader$ | async">
        <div class="navbar-brand" (click)="goToDashboard()" [title]="'Sistema Integrado de Prontuário e Assistência Social'">
          <h1 class="logo">SIPAS</h1>
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

      <div class="app-wrapper">
        <!-- Sidebar -->
        <aside class="sidebar" *ngIf="showHeader$ | async">
          <nav class="sidebar-nav">
            <!-- SEGURANÇA -->
            <div class="menu-section">
              <div class="menu-group">
                <button class="menu-group-title" (click)="toggleMenu('seguranca')">
                  <span class="icon-group">🔐</span>
                  <span>Segurança</span>
                  <span class="chevron" [class.open]="expandedMenus['seguranca']">›</span>
                </button>
                <ul class="menu-items" [class.expanded]="expandedMenus['seguranca']">
                  <li><a routerLink="/users" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
                    <span class="icon">👤</span>
                    <span>Cadastro de Usuários</span>
                  </a></li>
                </ul>
              </div>
            </div>

            <!-- CADASTRO -->
            <div class="menu-section">
              <div class="menu-group">
                <button class="menu-group-title" (click)="toggleMenu('cadastro')">
                  <span class="icon-group">📋</span>
                  <span>Cadastro</span>
                  <span class="chevron" [class.open]="expandedMenus['cadastro']">›</span>
                </button>
                <ul class="menu-items" [class.expanded]="expandedMenus['cadastro']">
                  <li><a routerLink="/genders" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
                    <span class="icon">⚧</span>
                    <span>Gêneros</span>
                  </a></li>
                  <li><a routerLink="/gender-identities" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
                    <span class="icon">💎</span>
                    <span>Identidades</span>
                  </a></li>
                  <li><a routerLink="/sexual-orientations" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
                    <span class="icon">❤️</span>
                    <span>Orientações</span>
                  </a></li>
                  <li><a routerLink="/relationship-degrees" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
                    <span class="icon">👨‍👩‍👧</span>
                    <span>Graus de Parentesco</span>
                  </a></li>
                  <li><a routerLink="/units" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
                    <span class="icon">🏢</span>
                    <span>Unidades</span>
                  </a></li>
                  <li><a routerLink="/departments" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
                    <span class="icon">📂</span>
                    <span>Departamentos</span>
                  </a></li>
                  <li><a routerLink="/roles" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
                    <span class="icon">👔</span>
                    <span>Cargos</span>
                  </a></li>
                  <li><a routerLink="/employees" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
                    <span class="icon">👥</span>
                    <span>Funcionários</span>
                  </a></li>
                </ul>
              </div>
            </div>

            <!-- MUNÍCIPES -->
            <div class="menu-section">
              <div class="menu-group">
                <button class="menu-group-title" (click)="toggleMenu('municipes')">
                  <span class="icon-group">👫</span>
                  <span>Munícipes</span>
                  <span class="chevron" [class.open]="expandedMenus['municipes']">›</span>
                </button>
                <ul class="menu-items" [class.expanded]="expandedMenus['municipes']">
                  <li><a routerLink="/persons" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
                    <span class="icon">📋</span>
                    <span>Cadastro de Munícipes</span>
                  </a></li>
                  <li><a routerLink="/family-composition" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
                    <span class="icon">👨‍👩‍👧‍👦</span>
                    <span>Composição Familiar</span>
                  </a></li>
                </ul>
              </div>
            </div>
          </nav>
        </aside>
        
        <!-- Main Content -->
        <main class="app-main">
          <router-outlet></router-outlet>
        </main>
      </div>

      <!-- Footer -->
      <footer class="app-footer" *ngIf="showHeader$ | async">
        <p>&copy; 2026 SIPAS - Todos os direitos reservados</p>
      </footer>
    </div>
  `,
  styles: [`
    * {
      box-sizing: border-box;
    }

    :host ::ng-deep {
      --primary: #5e72e4;
      --primary-hover: #4c63d2;
      --secondary: #825ee4;
      --success: #2dce89;
      --danger: #f5365c;
      --warning: #fb6340;
      --info: #11cdef;
      --light: #f7fafc;
      --dark: #32325d;
      --border-radius: 0.55rem;
      --transition: all 0.15s ease;
    }

    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background-color: #f7fafc;
    }

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
      transition: var(--transition);
      
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

    .tagline {
      display: none;
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
      transition: var(--transition);
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

    /* App Wrapper */
    .app-wrapper {
      display: flex;
      flex: 1;
    }

    /* Sidebar */
    .sidebar {
      width: 260px;
      background: white;
      border-right: 1px solid #e3e6f0;
      padding: 1.5rem 0;
      overflow-y: auto;
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
    }

    .sidebar::-webkit-scrollbar {
      width: 6px;
    }

    .sidebar::-webkit-scrollbar-track {
      background: transparent;
    }

    .sidebar::-webkit-scrollbar-thumb {
      background: #cbd5e0;
      border-radius: 3px;

      &:hover {
        background: #a0aec0;
      }
    }

    .sidebar-nav {
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .menu-section {
      padding: 1rem 0.75rem;
      margin-bottom: 0.5rem;
    }

    .menu-group {
      margin-bottom: 0.5rem;
    }

    .menu-group-title {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      width: 100%;
      padding: 0.75rem 1rem;
      background: transparent;
      border: none;
      color: #525f7f;
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: 500;
      transition: var(--transition);
      margin: 0 0.5rem 0.25rem 0.5rem;
      border-radius: 0.55rem;
      text-align: left;

      .icon-group {
        font-size: 1rem;
        min-width: 1.25rem;
      }

      .chevron {
        margin-left: auto;
        font-size: 1.5rem;
        transition: transform 0.3s ease;
        display: inline-block;

        &.open {
          transform: rotate(90deg);
        }
      }

      &:hover {
        background-color: #f8f9fe;
        color: #5e72e4;
      }
    }

    .menu-title {
      font-size: 0.75rem;
      font-weight: 700;
      color: #8898aa;
      text-transform: uppercase;
      margin: 0 1rem 0.75rem 1rem;
      padding: 0;
      letter-spacing: 0.75px;
    }

    .menu-items {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      max-height: 500px;
      overflow: hidden;
      transition: max-height 0.3s ease, opacity 0.3s ease;
      opacity: 1;

      &:not(.expanded) {
        max-height: 0;
        opacity: 0;
        pointer-events: none;
      }

      &.expanded {
        max-height: 500px;
        opacity: 1;
        pointer-events: auto;
      }

      li {
        margin: 0;
        padding: 0;

        a {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          color: #525f7f;
          text-decoration: none;
          border-left: 3px solid transparent;
          transition: var(--transition);
          font-size: 0.9rem;
          font-weight: 500;
          margin: 0 0.5rem;
          border-radius: 0.55rem;

          .icon {
            font-size: 1rem;
            min-width: 1.25rem;
          }

          &:hover {
            background-color: #f8f9fe;
            color: #5e72e4;
            border-left-color: #5e72e4;
            padding-left: 1rem;
          }

          &.active {
            background: linear-gradient(135deg, #5e72e4 0%, #825ee4 100%);
            color: white;
            border-left-color: transparent;
            box-shadow: 0 5px 15px rgba(94, 114, 228, 0.3);

            .icon {
              opacity: 0.9;
            }
          }
        }
      }
    }

    /* Main Content */
    .app-main {
      flex: 1;
      padding: 2rem;
      overflow-y: auto;
      background: #f7fafc;
    }

    .app-main::-webkit-scrollbar {
      width: 8px;
    }

    .app-main::-webkit-scrollbar-track {
      background: transparent;
    }

    .app-main::-webkit-scrollbar-thumb {
      background: #cbd5e0;
      border-radius: 4px;

      &:hover {
        background: #a0aec0;
      }
    }

    /* Footer */
    .app-footer {
      background: white;
      padding: 2rem;
      text-align: center;
      border-top: 1px solid #e3e6f0;
      color: #8898aa;
      font-size: 0.9rem;
      margin-top: auto;
      box-shadow: 0 -5px 20px rgba(0, 0, 0, 0.03);

      p {
        margin: 0;
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

      .tagline {
        display: none;
      }

      .header-right {
        gap: 1rem;
        flex: 1;
      }

      .sidebar {
        display: none;
      }

      .app-main {
        padding: 1rem;
      }
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'SIPAS Frontend';
  showHeader$: Observable<boolean>;
  user$: Observable<any>;
  expandedMenus: { [key: string]: boolean } = {
    seguranca: true,
    cadastro: true,
    municipes: false
  };

  constructor(private router: Router, private authService: AuthService) {
    this.showHeader$ = this.router.events.pipe(
      map(() => !this.router.url.includes('/auth/login'))
    );
    
    this.user$ = new Observable(observer => {
      const user = this.authService.getUser();
      observer.next(user);
    });
  }

  ngOnInit(): void {}

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  toggleMenu(menu: string): void {
    this.expandedMenus[menu] = !this.expandedMenus[menu];
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-container">
      <header class="app-header" *ngIf="showHeader$ | async">
        <div class="header-content">
          <h1>🏥 SIPAS - Sistema Integrado de Prontuário e Assistência Social</h1>
          <nav>
            <a routerLink="/units">Unidades</a>
            <a routerLink="/departments">Departamentos</a>
            <a routerLink="/roles">Cargos</a>
            <a routerLink="/employees">Funcionários</a>
          </nav>
        </div>
        <div class="header-user">
          <div class="user-info">
            <p class="user-name">{{ (user$ | async)?.name || 'Usuário' }}</p>
            <button class="logout-btn" (click)="onLogout()">Sair</button>
          </div>
        </div>
      </header>
      
      <div class="app-wrapper">
        <aside class="sidebar" *ngIf="showHeader$ | async">
          <nav class="sidebar-nav">
            <div class="menu-section">
              <h3 class="menu-title">Segurança</h3>
              <ul class="menu-items">
                <li><a routerLink="/users" routerLinkActive="active">Cadastro de Usuários</a></li>
              </ul>
            </div>
            
            <div class="menu-section">
              <h3 class="menu-title">Cadastro</h3>
              <ul class="menu-items">
                <li><a routerLink="/units" routerLinkActive="active">Cadastro de Unidades</a></li>
                <li><a routerLink="/departments" routerLinkActive="active">Departamentos</a></li>
                <li><a routerLink="/roles" routerLinkActive="active">Cargos</a></li>
                <li><a routerLink="/employees" routerLinkActive="active">Funcionários</a></li>
                <li><a routerLink="/genders" routerLinkActive="active">Gêneros</a></li>
                <li><a routerLink="/gender-identities" routerLinkActive="active">Identidades de Gênero</a></li>
                <li><a routerLink="/sexual-orientations" routerLinkActive="active">Orientação Sexual</a></li>
              </ul>
            </div>

            <div class="menu-section">
              <h3 class="menu-title">Munícipes</h3>
              <ul class="menu-items">
                <li><a routerLink="/persons" routerLinkActive="active">Cadastro de Munícipes</a></li>
              </ul>
            </div>
          </nav>
        </aside>
        
        <main class="app-main">
          <router-outlet></router-outlet>
        </main>
      </div>
      
      <footer class="app-footer" *ngIf="showHeader$ | async">
        <p>&copy; 2026 SIPAS - All rights reserved</p>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .app-header {
      background-color: #1976d2;
      color: white;
      padding: 1rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header-content {
      flex: 1;
    }

    h1 {
      margin: 0 0 1rem 0;
      font-size: 1.5rem;
    }

    nav {
      display: flex;
      gap: 1rem;

      a {
        color: white;
        text-decoration: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        transition: background-color 0.3s;

        &:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }
      }
    }

    .header-user {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.5rem;
    }

    .user-name {
      margin: 0;
      font-size: 14px;
      opacity: 0.9;
    }

    .logout-btn {
      background-color: rgba(255, 255, 255, 0.2);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.4);
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.3s;

      &:hover {
        background-color: rgba(255, 255, 255, 0.3);
        border-color: rgba(255, 255, 255, 0.6);
      }

      &:active {
        background-color: rgba(255, 255, 255, 0.4);
      }
    }

    .app-main {
      flex: 1;
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
    }

    .app-wrapper {
      display: flex;
      flex: 1;
    }

    .sidebar {
      width: 280px;
      background-color: #f5f5f5;
      border-right: 1px solid #ddd;
      padding: 1.5rem 0;
      overflow-y: auto;
    }

    .sidebar-nav {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .menu-section {
      padding: 0 1rem;
      margin-bottom: 1.5rem;
    }

    .menu-title {
      font-size: 13px;
      font-weight: 600;
      color: #666;
      text-transform: uppercase;
      margin: 0 0 0.75rem 0;
      padding: 0 0.5rem;
      letter-spacing: 0.5px;
    }

    .menu-items {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;

      li {
        margin: 0;
        padding: 0;

        a {
          display: block;
          padding: 0.75rem 1rem;
          color: #333;
          text-decoration: none;
          border-left: 3px solid transparent;
          transition: all 0.3s;
          font-size: 14px;

          &:hover {
            background-color: #e8e8e8;
            color: #1976d2;
          }

          &.active {
            background-color: #d3d3d3;
            color: #1976d2;
            border-left-color: #1976d2;
            font-weight: 500;
          }
        }
      }
    }

    .app-main {
      flex: 1;
      padding: 2rem;
      max-width: 100%;
      overflow-y: auto;
    }

    .app-footer {
      background-color: #f5f5f5;
      padding: 1rem;
      text-align: center;
      border-top: 1px solid #ddd;
      color: #666;
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'SIPAS Frontend';
  showHeader$: Observable<boolean>;
  user$: Observable<any>;

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

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}

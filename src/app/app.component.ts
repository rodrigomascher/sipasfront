import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './core/services/auth.service';
import { SelectedUnitService } from './core/services/selected-unit.service';
import { HeaderComponent } from './shared/components/header/header.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, SidebarComponent],
  template: `
    <div class="app-container">
      <!-- Header Component -->
      <app-header 
        [showHeader]="(showHeader$ | async) ?? false" 
        [user$]="user$"
        [selectedUnit$]="selectedUnit$"
        (logout)="onLogout()">
      </app-header>

      <div class="app-wrapper">
        <!-- Sidebar Component -->
        <app-sidebar [showSidebar]="(showHeader$ | async) ?? false"></app-sidebar>
        
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

    /* App Wrapper */
    .app-wrapper {
      display: flex;
      flex: 1;
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
  selectedUnit$: Observable<any>;

  constructor(
    private router: Router,
    private authService: AuthService,
    private selectedUnitService: SelectedUnitService
  ) {
    this.showHeader$ = this.router.events.pipe(
      map(() => {
        // Ocultar header se estiver em login ou na tela de seleção de unidade
        const isLogin = this.router.url.includes('/auth/login');
        const isUnitSelector = this.router.url.includes('/auth/unit-selector');
        const isSelecting = this.selectedUnitService.isSelectingUnit();
        
        return !isLogin && !isUnitSelector && !isSelecting;
      })
    );
    
    this.user$ = new Observable(observer => {
      const user = this.authService.getUser();
      observer.next(user);
    });

    this.selectedUnit$ = this.selectedUnitService.getSelectedUnit$();
  }

  ngOnInit(): void {
    // Sincronizar unidade selecionada com JWT
    this.selectedUnitService.refreshFromJWT();
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}

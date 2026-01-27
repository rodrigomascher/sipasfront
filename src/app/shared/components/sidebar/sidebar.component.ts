import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <!-- Hamburger Button for Mobile -->
    <button class="mobile-menu-toggle" (click)="toggleMobileMenu()" *ngIf="isMobile && showSidebar">
      <span class="hamburger" [class.open]="mobileMenuOpen">
        <span></span>
        <span></span>
        <span></span>
      </span>
    </button>

    <!-- Overlay for Mobile Menu -->
    <div class="mobile-menu-overlay" *ngIf="isMobile && mobileMenuOpen && showSidebar" (click)="closeMobileMenu()"></div>

    <!-- Sidebar -->
    <aside class="sidebar" [class.mobile-open]="isMobile && mobileMenuOpen" *ngIf="showSidebar">
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
              <li><a routerLink="/races" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
                <span class="icon">🎨</span>
                <span>Raça/Cor</span>
              </a></li>
              <li><a routerLink="/ethnicities" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
                <span class="icon">🌍</span>
                <span>Etnia</span>
              </a></li>
              <li><a routerLink="/income-types" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
                <span class="icon">💰</span>
                <span>Tipo de Renda</span>
              </a></li>
              <li><a routerLink="/marital-statuses" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
                <span class="icon">💍</span>
                <span>Estado Civil</span>
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
  `,
  styles: [`
    /* Mobile Menu Toggle - Hidden by default on desktop */
    .mobile-menu-toggle {
      display: none;
    }

    .mobile-menu-overlay {
      display: none;
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
      transition: all 0.15s ease;
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
          transition: all 0.15s ease;
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

    /* Responsive */
    @media (max-width: 768px) {
      .mobile-menu-toggle {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 50px;
        height: 50px;
        background: #2c3e50;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0;
        margin: 10px;
        border-radius: 4px;
        z-index: 1000;
      }

      .hamburger {
        display: flex;
        flex-direction: column;
        gap: 5px;
        width: 24px;
        height: 20px;
      }

      .hamburger span {
        display: block;
        width: 100%;
        height: 2px;
        background: white;
        transition: all 0.3s ease;
        border-radius: 2px;
      }

      .hamburger.open span:nth-child(1) {
        transform: rotate(45deg) translate(8px, 8px);
      }

      .hamburger.open span:nth-child(2) {
        opacity: 0;
      }

      .hamburger.open span:nth-child(3) {
        transform: rotate(-45deg) translate(8px, -8px);
      }

      .mobile-menu-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 900;
        display: block;
      }

      .sidebar {
        position: fixed;
        left: 0;
        top: 0;
        width: 80%;
        max-width: 280px;
        height: 100vh;
        background: white;
        transform: translateX(-100%);
        transition: transform 0.3s ease;
        z-index: 950;
        overflow-y: auto;
        box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
      }

      .sidebar.mobile-open {
        transform: translateX(0);
      }
    }
  `]
})
export class SidebarComponent implements OnInit {
  @Input() showSidebar: boolean = true;

  expandedMenus: { [key: string]: boolean } = {
    seguranca: true,
    cadastro: true,
    municipes: false
  };

  isMobile: boolean = false;
  mobileMenuOpen: boolean = false;

  constructor() {}

  ngOnInit(): void {
    // Initialize mobile detection
    this.checkMobileView();
    window.addEventListener('resize', () => this.checkMobileView());
  }

  checkMobileView(): void {
    this.isMobile = window.innerWidth <= 768;
    // Close mobile menu when resizing to desktop
    if (!this.isMobile) {
      this.mobileMenuOpen = false;
    }
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  toggleMenu(menu: string): void {
    this.expandedMenus[menu] = !this.expandedMenus[menu];
  }
}

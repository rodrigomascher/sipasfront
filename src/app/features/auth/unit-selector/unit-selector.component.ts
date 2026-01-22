import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthService } from '@core/services/auth.service';
import { UnitsService } from '@core/services/units.service';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-unit-selector',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  template: `
    <div class="unit-selector-container">
      <div class="unit-selector-box">
        <div class="unit-selector-header">
          <h1>Selecione uma Unidade</h1>
          <p class="user-info">Bem-vindo, {{ user?.name }}!</p>
        </div>

        <div *ngIf="loading" class="loading-state">
          <app-loading-spinner mode="overlay" message="Carregando unidades..."></app-loading-spinner>
        </div>

        <div *ngIf="!loading && units.length > 0" class="units-grid">
          <button
            *ngFor="let unit of units"
            type="button"
            class="unit-card"
            (click)="selectUnit(unit)"
          >
            <div class="unit-icon">🏢</div>
            <div class="unit-details">
              <h3>{{ unit.name }}</h3>
              <p class="unit-type">{{ unit.type }}</p>
              <p class="unit-location">{{ unit.city }}, {{ unit.state }}</p>
            </div>
            <div class="unit-arrow">→</div>
          </button>
        </div>

        <div *ngIf="!loading && units.length === 0" class="no-units">
          <p>Nenhuma unidade associada ao seu usuário.</p>
        </div>

        <div *ngIf="error" class="alert alert-danger">
          {{ error }}
        </div>

        <div class="unit-selector-footer">
          <button type="button" class="btn btn-secondary" (click)="logout()">
            Sair
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .unit-selector-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .unit-selector-box {
      background: white;
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      padding: 40px;
      width: 100%;
      max-width: 600px;
    }

    .unit-selector-header {
      text-align: center;
      margin-bottom: 30px;
    }

    h1 {
      font-size: 28px;
      font-weight: 700;
      color: #333;
      margin-bottom: 8px;
    }

    .user-info {
      font-size: 14px;
      color: #666;
      margin: 0;
    }

    .units-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 15px;
      margin-bottom: 30px;
    }

    .unit-card {
      display: flex;
      align-items: center;
      gap: 15px;
      padding: 16px;
      background: #f8f9fa;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s;
      text-align: left;
    }

    .unit-card:hover {
      background: #e7f3ff;
      border-color: #007bff;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 123, 255, 0.2);
    }

    .unit-icon {
      font-size: 32px;
      flex-shrink: 0;
    }

    .unit-details {
      flex: 1;
      min-width: 0;
    }

    .unit-details h3 {
      margin: 0 0 4px;
      font-size: 16px;
      font-weight: 600;
      color: #333;
      word-break: break-word;
    }

    .unit-type {
      margin: 2px 0;
      font-size: 12px;
      color: #666;
      font-weight: 500;
    }

    .unit-location {
      margin: 2px 0;
      font-size: 12px;
      color: #999;
    }

    .unit-arrow {
      font-size: 20px;
      color: #007bff;
      flex-shrink: 0;
      opacity: 0;
      transition: opacity 0.3s;
    }

    .unit-card:hover .unit-arrow {
      opacity: 1;
    }

    .no-units {
      text-align: center;
      padding: 40px 20px;
      color: #999;
      font-size: 16px;
    }

    .alert {
      padding: 12px 16px;
      border-radius: 6px;
      margin-bottom: 20px;
    }

    .alert-danger {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }

    .loading-state {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 300px;
    }

    .unit-selector-footer {
      display: flex;
      justify-content: center;
      gap: 10px;
      padding-top: 20px;
      border-top: 1px solid #eee;
    }

    .btn {
      padding: 10px 24px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: background 0.3s;
      font-weight: 500;
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background: #545b62;
    }
  `]
})
export class UnitSelectorComponent implements OnInit {
  units: any[] = [];
  user: any = null;
  loading = true;
  error = '';

  constructor(
    private authService: AuthService,
    private unitsService: UnitsService,
    private router: Router,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    
    if (!this.user) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.loadUserUnits();
  }

  private loadUserUnits(): void {
    this.unitsService.getUnits().subscribe({
      next: (response) => {
        this.units = response.data || [];
        this.loading = false;

        // Se só tem 1 unidade, seleciona automaticamente
        if (this.units.length === 1) {
          this.selectUnit(this.units[0]);
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Erro ao carregar unidades. Tente novamente.';
      }
    });
  }

  selectUnit(unit: any): void {
    // Armazenar unidade selecionada no localStorage
    localStorage.setItem('selectedUnit', JSON.stringify(unit));
    
    // Dispatch action no store se necessário
    // this.store.dispatch(new SetSelectedUnit(unit));
    
    // Redirecionar para dashboard
    this.router.navigate(['/dashboard']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}

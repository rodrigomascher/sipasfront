import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { SelectedUnitService } from '@core/services/selected-unit.service';
import { UnitsService } from '@core/services/units.service';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { ButtonComponent } from '@shared/components/button/button.component';

@Component({
  selector: 'app-unit-selector',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent, ButtonComponent],
  template: `
    <div class="unit-selector-container">
      <div class="unit-selector-box">
        <div class="unit-selector-header">
          <h1>Selecione uma Unidade</h1>
          <p class="user-info">Bem-vindo, {{ user?.name }}!</p>
          <p class="subtitle">Escolha a unidade que deseja acessar</p>
        </div>

        <div *ngIf="loading" class="loading-state">
          <app-loading-spinner mode="overlay" message="Carregando unidades..."></app-loading-spinner>
        </div>

        <form (ngSubmit)="handleSelectUnit()" *ngIf="!loading && units.length > 0" class="unit-form">
          <div class="form-group">
            <label for="unitSelect">Unidade</label>
            <select
              id="unitSelect"
              [(ngModel)]="selectedUnitId"
              name="selectedUnit"
              class="unit-select"
              required
              [disabled]="isSelecting"
            >
              <option value="" disabled>-- Selecione uma unidade --</option>
              <option 
                *ngFor="let unit of units"
                [value]="unit.id"
              >
                {{ unit.name }} ({{ unit.type }}) - {{ unit.city }}, {{ unit.state }}
              </option>
            </select>
          </div>

          <app-button 
            type="submit" 
            variant="primary"
            size="large"
            [disabled]="!selectedUnitId"
            [loading]="isSelecting"
            loadingText="Acessando..."
          >
            Acessar
          </app-button>
        </form>

        <div *ngIf="!loading && units.length === 0" class="no-units">
          <p>Nenhuma unidade associada ao seu usuário.</p>
        </div>

        <div *ngIf="error" class="alert alert-danger">
          {{ error }}
        </div>

        <div class="unit-selector-footer">
          <app-button type="button" variant="secondary" (click)="logout()">
            Sair
          </app-button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .unit-selector-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .unit-selector-box {
      background: white;
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      padding: 40px;
      width: 100%;
      max-width: 500px;
    }

    .unit-selector-header {
      text-align: center;
      margin-bottom: 30px;
    }

    h1 {
      font-size: 28px;
      font-weight: 700;
      color: #333;
      margin: 0 0 8px;
    }

    .user-info {
      font-size: 14px;
      color: #666;
      margin: 0 0 4px;
      font-weight: 500;
    }

    .subtitle {
      font-size: 13px;
      color: #999;
      margin: 0;
    }

    .unit-form {
      margin-bottom: 20px;
    }

    .unit-select {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      background: white;
      cursor: pointer;
      transition: border-color 0.3s;
    }

    .unit-select:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .unit-select:disabled {
      background: #f5f5f5;
      cursor: not-allowed;
      opacity: 0.6;
    }

    .no-units {
      text-align: center;
      padding: 40px 20px;
      color: #999;
      font-size: 16px;
    }

    .loading-state {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 250px;
    }

    .unit-selector-footer {
      display: flex;
      justify-content: center;
      gap: 10px;
      padding-top: 20px;
      border-top: 1px solid #eee;
    }
  `]
})
export class UnitSelectorComponent implements OnInit {
  units: any[] = [];
  user: any = null;
  selectedUnitId: number | null = null;
  loading = true;
  isSelecting = false;
  error = '';

  constructor(
    private authService: AuthService,
    private selectedUnitService: SelectedUnitService,
    private unitsService: UnitsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Indicar que estamos na tela de seleção (ocultar header)
    this.selectedUnitService.setIsSelectingUnit(true);
    
    this.user = this.authService.getUser();
    
    if (!this.user) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.loadUserUnits();
  }

  private loadUserUnits(): void {
    let units: any[] = [];
    
    // First, try to get units from the user object
    if (this.user?.['units']) {
      units = Array.isArray(this.user['units']) ? this.user['units'] : [];
    }
    
    // If no units from user, try localStorage
    if (units.length === 0) {
      const unitsJson = localStorage.getItem('userUnits');
      if (unitsJson) {
        try {
          units = JSON.parse(unitsJson);
        } catch (err) {
          console.error('[UNIT-SELECTOR] Error parsing userUnits:', err);
        }
      }
    }
    
    this.units = units;
    this.loading = false;
    
    // Se só tem 1 unidade, seleciona automaticamente
    if (this.units.length === 1) {
      this.selectUnit(this.units[0]);
    }
  }

  private loadUnitsFromApi(): void {
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
    // Chamar backend para atualizar token com a unidade selecionada
    this.selectedUnitService.selectUnitViaBackend(unit.id).subscribe({
      next: (response) => {
        // Atualizar token
        this.authService.setToken(response.access_token);
        this.authService.setUser(response.user);
        
        // Atualizar serviço de unidade selecionada
        this.selectedUnitService.setSelectedUnit(unit);
        
        // Redirecionar para dashboard
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        const errorMessage = err.error?.message || err.message || 'Erro ao selecionar unidade. Tente novamente.';
        this.error = errorMessage;
        this.isSelecting = false;
      }
    });
  }

  handleSelectUnit(): void {
    if (this.selectedUnitId) {
      this.isSelecting = true;
      // Convert to number for comparison (ngModel returns string from select)
      const unitIdToFind = Number(this.selectedUnitId);
      
      // Find the selected unit object to pass to selectUnit
      const selectedUnit = this.units.find(u => u.id === unitIdToFind);
      if (selectedUnit) {
        this.selectUnit(selectedUnit);
      } else {
        this.error = 'Unidade não encontrada. Tente novamente.';
        this.isSelecting = false;
      }
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}

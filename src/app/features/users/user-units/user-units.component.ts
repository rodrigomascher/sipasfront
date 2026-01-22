import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnitsService } from '../../../core/services/units.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-user-units',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="user-units-container">
      <div class="user-units-header">
        <h3>Unidades</h3>
        <button 
          type="button" 
          class="btn btn-primary btn-sm"
          (click)="toggleAddUnit()"
          [disabled]="isLoading"
        >
          {{ showSelector ? '- Cancelar' : '+ Adicionar Unidade' }}
        </button>
      </div>

      <!-- Seletor de unidades (dentro da área) -->
      <div class="unit-selector" *ngIf="showSelector">
        <div class="selector-content">
          <h5>Selecione uma Unidade para Adicionar</h5>
          <div class="unit-list">
            <div *ngIf="isLoading" class="loading-area">
              <div class="spinner-small"></div>
              Adicionando unidade...
            </div>
            <button
              type="button"
              *ngFor="let unit of (availableUnits$ | async)"
              class="unit-item"
              (click)="addUnit(unit)"
              [disabled]="isLoading"
            >
              <strong>{{ unit.name }}</strong>
              <span class="unit-info">{{ unit.type }} • {{ unit.city }}, {{ unit.state }}</span>
            </button>
            <div *ngIf="!(availableUnits$ | async) || (availableUnits$ | async)?.length === 0" class="alert alert-info">
              Todas as unidades já foram adicionadas
            </div>
          </div>
        </div>
      </div>

      <!-- Grid de unidades selecionadas -->
      <div class="user-units-grid" *ngIf="selectedUnits && selectedUnits.length > 0">
        <table class="table table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Tipo</th>
              <th>Cidade</th>
              <th>Estado</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let unit of selectedUnits">
              <td>{{ unit.id }}</td>
              <td>{{ unit.name }}</td>
              <td>{{ unit.type }}</td>
              <td>{{ unit.city }}</td>
              <td>{{ unit.state }}</td>
              <td>
                <button 
                  type="button"
                  class="btn btn-danger btn-sm"
                  (click)="removeUnit(unit.id)"
                  [disabled]="isLoading"
                >
                  Remover
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="alert alert-info" *ngIf="!showSelector && (!selectedUnits || selectedUnits.length === 0)">
        Nenhuma unidade selecionada
      </div>
    </div>
  `,
  styles: [`
    .user-units-container {
      margin: 20px 0;
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 4px;
      background: #f9f9f9;
    }

    .user-units-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }

    .user-units-header h3 {
      margin: 0;
      color: #333;
    }

    .unit-selector {
      background: white;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 15px;
      margin-bottom: 15px;
    }

    .selector-content h5 {
      margin-top: 0;
      margin-bottom: 15px;
      color: #333;
    }

    .unit-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
      max-height: 300px;
      overflow-y: auto;
    }

    .unit-item {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 10px;
      background: #f5f5f5;
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
      text-align: left;
      transition: all 0.2s;
      font-size: 14px;
    }

    .unit-item:hover {
      background: #e8f5e9;
      border-color: #4caf50;
      transform: translateX(5px);
    }

    .unit-item strong {
      color: #333;
      margin-bottom: 4px;
    }

    .unit-info {
      font-size: 12px;
      color: #666;
    }

    .user-units-grid {
      margin-bottom: 15px;
      border: 1px solid #ddd;
      border-radius: 4px;
      overflow: hidden;
      background: white;
    }

    .table {
      margin: 0;
      font-size: 14px;
    }

    .btn-sm {
      padding: 4px 8px;
      font-size: 12px;
    }

    .alert {
      margin: 0;
    }

    .loading-area {
      padding: 15px;
      text-align: center;
      color: #666;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
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

    @keyframes spin-small {
      to { transform: rotate(360deg); }
    }

    button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  `]
})
export class UserUnitsComponent implements OnInit {
  @Input() selectedUnits: any[] = [];
  @Output() unitsChanged = new EventEmitter<any[]>();

  showSelector = false;
  isLoading = false;
  availableUnits$: Observable<any[]>;

  constructor(private unitsService: UnitsService) {
    this.availableUnits$ = new Observable();
  }

  ngOnInit(): void {
    this.loadAvailableUnits();
  }

  private loadAvailableUnits(): void {
    this.availableUnits$ = this.unitsService.getUnits().pipe(
      map(response => {
        // Filtrar apenas unidades não selecionadas
        const selectedIds = this.selectedUnits.map(u => u.id);
        return response.data.filter(unit => !selectedIds.includes(unit.id));
      })
    );
  }

  toggleAddUnit(): void {
    this.showSelector = !this.showSelector;
    if (this.showSelector) {
      this.loadAvailableUnits();
    }
  }

  addUnit(unit: any): void {
    this.isLoading = true;
    const updated = [...(this.selectedUnits || []), unit];
    this.selectedUnits = updated;
    this.unitsChanged.emit(updated);
    this.showSelector = false;
    this.loadAvailableUnits();
    // Reset loading state
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  }

  removeUnit(unitId: number): void {
    this.isLoading = true;
    const updated = (this.selectedUnits || []).filter(u => u.id !== unitId);
    this.selectedUnits = updated;
    this.unitsChanged.emit(updated);
    this.loadAvailableUnits();
    // Reset loading state
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  }
}


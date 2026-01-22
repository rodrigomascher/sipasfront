import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnitsService } from '../../../core/services/units.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { GenericSimpleGridComponent, GridColumn, GridAction } from '../../../shared/components/generic-simple-grid/generic-simple-grid.component';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-user-units',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent, GenericSimpleGridComponent],
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
            <app-loading-spinner *ngIf="isLoading" mode="mini" message="Adicionando unidade..."></app-loading-spinner>
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
      <app-generic-simple-grid
        [items]="selectedUnits"
        [columns]="gridColumns"
        [actions]="gridActions"
        [isLoading]="isLoading"
        emptyMessage="Nenhuma unidade selecionada">
      </app-generic-simple-grid>
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

    .btn-sm {
      padding: 4px 8px;
      font-size: 12px;
    }

    .alert {
      margin: 0;
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

  gridColumns: GridColumn[] = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nome' },
    { key: 'type', label: 'Tipo' },
    { key: 'city', label: 'Cidade' },
    { key: 'state', label: 'Estado' }
  ];

  gridActions: GridAction[] = [
    {
      label: 'Remover',
      class: 'btn-danger',
      callback: (unit: any) => this.removeUnit(unit.id)
    }
  ];

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


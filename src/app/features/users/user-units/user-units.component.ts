import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UnitsService } from '../../../core/services/units.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { GenericSimpleGridComponent, GridColumn, GridAction } from '../../../shared/components/generic-simple-grid/generic-simple-grid.component';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-user-units',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent, GenericSimpleGridComponent],
  template: `
    <div class="user-units-container">
      <div class="user-units-header">
        <h3>Unidades</h3>
        <button 
          type="button" 
          class="btn btn-primary"
          (click)="toggleAddUnit()"
          [disabled]="isLoading"
        >
          {{ showSelector ? '- Cancelar' : '+ Adicionar Unidade' }}
        </button>
      </div>

      <!-- Seletor de unidades com autocomplete -->
      <div class="unit-selector" *ngIf="showSelector">
        <div class="selector-content">
          <div class="autocomplete-wrapper">
            <input
              type="text"
              class="autocomplete-input"
              placeholder="Buscar unidade..."
              [(ngModel)]="searchTerm"
              (ngModelChange)="onSearchChange($event)"
              (keyup.enter)="addSelectedUnit()"
              [disabled]="isLoading"
            />
            <button
              type="button"
              class="btn btn-success"
              (click)="addSelectedUnit()"
              [disabled]="!selectedUnit || isLoading"
            >
              Adicionar
            </button>
          </div>

          <!-- Dropdown de sugestões -->
          <div class="autocomplete-dropdown" *ngIf="filteredUnits$ | async as filtered">
            <div 
              *ngIf="filtered.length > 0"
              class="dropdown-list"
            >
              <button
                type="button"
                *ngFor="let unit of filtered"
                class="dropdown-item"
                (click)="selectUnit(unit)"
                [class.selected]="selectedUnit?.id === unit.id"
              >
                <strong>{{ unit.name }}</strong>
                <span class="unit-info">{{ unit.type }} • {{ unit.city }}, {{ unit.state }}</span>
              </button>
            </div>
            <div *ngIf="filtered.length === 0 && searchTerm" class="no-results">
              Nenhuma unidade encontrada
            </div>
            <div *ngIf="filtered.length === 0 && !searchTerm" class="no-results">
              Digite para buscar unidades
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

    .selector-content {
      position: relative;
    }

    .autocomplete-wrapper {
      display: flex;
      gap: 8px;
      margin-bottom: 15px;
    }

    .autocomplete-input {
      flex: 1;
      padding: 10px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      transition: border-color 0.3s;
    }

    .autocomplete-input:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
    }

    .autocomplete-input:disabled {
      background: #f5f5f5;
      cursor: not-allowed;
    }

    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: background 0.3s;
    }

    .btn-success {
      background: #28a745;
      color: white;
    }

    .btn-success:hover:not(:disabled) {
      background: #218838;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .autocomplete-dropdown {
      position: relative;
      z-index: 100;
    }

    .dropdown-list {
      max-height: 300px;
      overflow-y: auto;
      border: 1px solid #ddd;
      border-radius: 4px;
      background: white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .dropdown-item {
      width: 100%;
      padding: 10px 12px;
      background: white;
      border: none;
      border-bottom: 1px solid #eee;
      text-align: left;
      cursor: pointer;
      transition: background 0.2s;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
    }

    .dropdown-item:last-child {
      border-bottom: none;
    }

    .dropdown-item:hover {
      background: #f5f5f5;
    }

    .dropdown-item.selected {
      background: #e7f3ff;
      border-left: 3px solid #007bff;
      padding-left: 9px;
    }

    .dropdown-item strong {
      color: #333;
    }

    .unit-info {
      font-size: 12px;
      color: #666;
    }

    .no-results {
      padding: 15px;
      text-align: center;
      color: #999;
      font-size: 14px;
      background: #fafafa;
      border-radius: 4px;
    }

    .btn-sm {
      padding: 4px 8px;
      font-size: 12px;
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
  searchTerm = '';
  selectedUnit: any = null;
  
  availableUnits$: Observable<any[]>;
  filteredUnits$: Observable<any[]>;

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
      variant: 'danger',
      callback: (unit: any) => this.removeUnit(unit.id)
    }
  ];

  constructor(private unitsService: UnitsService) {
    this.availableUnits$ = new Observable();
    this.filteredUnits$ = new Observable();
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
    this.filteredUnits$ = this.availableUnits$;
  }

  toggleAddUnit(): void {
    this.showSelector = !this.showSelector;
    if (this.showSelector) {
      this.searchTerm = '';
      this.selectedUnit = null;
      this.loadAvailableUnits();
    }
  }

  onSearchChange(term: string): void {
    this.searchTerm = term;
    this.selectedUnit = null;
    
    this.filteredUnits$ = this.availableUnits$.pipe(
      map(units => {
        if (!term.trim()) {
          return units;
        }
        const lowerTerm = term.toLowerCase();
        return units.filter(unit => 
          unit.name.toLowerCase().includes(lowerTerm) ||
          unit.city.toLowerCase().includes(lowerTerm) ||
          unit.state.toLowerCase().includes(lowerTerm) ||
          unit.type.toLowerCase().includes(lowerTerm)
        );
      })
    );
  }

  selectUnit(unit: any): void {
    this.selectedUnit = unit;
    this.searchTerm = unit.name;
  }

  addSelectedUnit(): void {
    if (this.selectedUnit) {
      this.addUnit(this.selectedUnit);
    }
  }

  addUnit(unit: any): void {
    this.isLoading = true;
    const updated = [...(this.selectedUnits || []), unit];
    this.selectedUnits = updated;
    this.unitsChanged.emit(updated);
    this.showSelector = false;
    this.searchTerm = '';
    this.selectedUnit = null;
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


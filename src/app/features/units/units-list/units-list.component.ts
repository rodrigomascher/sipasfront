import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Unit } from '../../../core/services/units.service';
import { GenericListComponent, ListColumn, ListAction } from '../../../shared/components/generic-list/generic-list.component';
import { 
  selectAllUnits, 
  selectUnitsLoading
} from '../../../store/units/units.selectors';
import * as UnitsActions from '../../../store/units/units.actions';

@Component({
  selector: 'app-units-list',
  standalone: true,
  imports: [CommonModule, GenericListComponent],
  template: `
    <app-generic-list
      [items$]="units$"
      [loading$]="loading$"
      [columns]="columns"
      [actions]="actions"
      title="Cadastro de Unidades"
      createButtonLabel="Nova Unidade"
      createRoute="/units/create"
      searchPlaceholder="Buscar por cidade ou nome..."
      emptyMessage="Nenhuma unidade encontrada"
      [searchFields]="['city', 'name', 'type']"
      (delete)="onDelete($event)"
    ></app-generic-list>
  `

      <app-loading-spinner *ngIf="loading$ | async" message="Carregando unidades..."></app-loading-spinner>

      <div *ngIf="error$ | async as error" class="alert alert-danger">
        {{ error }}
      </div>

      <table class="data-table" *ngIf="(units$ | async) as units; else noData">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Tipo</th>
            <th>Cidade</th>
            <th>Estado</th>
            <th>Blindada</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let unit of filteredUnits">
            <td>#{{ unit.id }}</td>
            <td>{{ unit.name }}</td>
            <td>{{ unit.type }}</td>
            <td>{{ unit.city }}</td>
            <td>{{ unit.state }}</td>
            <td>
              <span class="badge" [ngClass]="{ 'badge-success': unit.isArmored, 'badge-gray': !unit.isArmored }">
                {{ unit.isArmored ? 'Sim' : 'Não' }}
              </span>
            </td>
            <td class="actions">
              <button class="btn-sm btn-info" routerLink="/units/{{ unit.id }}/edit" title="Editar">
                ✎ Editar
              </button>
              <button
                class="btn-sm btn-danger"
                (click)="deleteUnit(unit.id)"
                title="Deletar"
              >
                🗑 Deletar
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <ng-template #noData>
        <div class="no-data">
          <p>Nenhuma unidade encontrada</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .container {
      padding: 2rem;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    h1 {
      margin: 0;
      font-size: 2rem;
      color: #333;
    }

    .search-box {
      margin-bottom: 2rem;
    }

    .search-input {
      width: 100%;
      max-width: 500px;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      border-radius: 4px;
      overflow: hidden;
    }

    thead {
      background-color: #f5f5f5;
      border-bottom: 2px solid #ddd;
    }

    th {
      padding: 1rem;
      text-align: left;
      font-weight: 600;
      color: #333;
    }

    td {
      padding: 0.75rem 1rem;
      border-bottom: 1px solid #eee;
    }

    tbody tr:hover {
      background-color: #f9f9f9;
    }

    .badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
    }

    .badge-success {
      background-color: #d4edda;
      color: #155724;
    }

    .badge-gray {
      background-color: #e2e3e5;
      color: #383d41;
    }

    .actions {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .btn-sm {
      padding: 0.5rem 0.75rem;
      font-size: 12px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-info {
      background-color: #17a2b8;
      color: white;
    }

    .btn-info:hover {
      background-color: #138496;
    }

    .btn-danger {
      background-color: #dc3545;
      color: white;
    }

    .btn-danger:hover {
      background-color: #c82333;
    }

    .no-data {
      text-align: center;
      padding: 2rem;
      color: #666;
    }

    .alert-danger {
      padding: 1rem;
      background-color: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
      border-radius: 4px;
      margin-bottom: 2rem;
    }
  `]
})
export class UnitsListComponent implements OnInit {
  units$: Observable<Unit[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  filteredUnits: Unit[] = [];
  searchTerm: string = '';

  constructor(private store: Store<{ units: any }>) {
    this.units$ = this.store.select(selectAllUnits);
    this.loading$ = this.store.select(selectUnitsLoading);
    this.error$ = this.store.select(selectUnitsError);
  }

  ngOnInit(): void {
    this.store.dispatch(UnitsActions.loadUnits());
    this.units$.subscribe(units => {
      this.filteredUnits = units;
    });
  }

  onSearch(): void {
    this.units$.subscribe(units => {
      const term = this.searchTerm.toLowerCase();
      this.filteredUnits = units.filter(u =>
        u.city.toLowerCase().includes(term) ||
        u.name.toLowerCase().includes(term) ||
        u.type.toLowerCase().includes(term)
      );
    });
  }

  deleteUnit(id: number): void {
    if (confirm('Tem certeza que deseja deletar esta unidade?')) {
      this.store.dispatch(UnitsActions.deleteUnit({ id }));
    }
  }
}

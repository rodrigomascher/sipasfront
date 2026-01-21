import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Department } from '../../../core/services/departments.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { 
  selectAllDepartments, 
  selectDepartmentsLoading, 
  selectDepartmentsError 
} from '../../../store/departments/departments.selectors';
import * as DepartmentsActions from '../../../store/departments/departments.actions';

@Component({
  selector: 'app-departments-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LoadingSpinnerComponent],
  template: `
    <div class="container">
      <div class="header">
        <h1>Cadastro de Departamentos</h1>
        <button class="btn btn-primary" routerLink="/departments/create">+ Novo Departamento</button>
      </div>

      <div class="search-box">
        <input
          type="text"
          placeholder="Buscar por nome..."
          [(ngModel)]="searchTerm"
          (ngModelChange)="onSearch()"
          class="search-input"
        />
      </div>

      <app-loading-spinner *ngIf="loading$ | async" message="Carregando departamentos..."></app-loading-spinner>

      <div *ngIf="error$ | async as error" class="alert alert-danger">
        {{ error }}
      </div>

      <table class="data-table" *ngIf="(departments$ | async) as departments; else noData">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let department of filteredDepartments">
            <td>#{{ department.id }}</td>
            <td>{{ department.name }}</td>
            <td>{{ department.description || '-' }}</td>
            <td class="actions">
              <button class="btn-sm btn-info" routerLink="/departments/{{ department.id }}/edit" title="Editar">
                ✎ Editar
              </button>
              <button
                class="btn-sm btn-danger"
                (click)="deleteDepartment(department.id)"
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
          <p>Nenhum departamento encontrado</p>
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
export class DepartmentsListComponent implements OnInit {
  departments$: Observable<Department[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  filteredDepartments: Department[] = [];
  searchTerm: string = '';

  constructor(private store: Store<{ departments: any }>) {
    this.departments$ = this.store.select(selectAllDepartments);
    this.loading$ = this.store.select(selectDepartmentsLoading);
    this.error$ = this.store.select(selectDepartmentsError);
  }

  ngOnInit(): void {
    this.store.dispatch(DepartmentsActions.loadDepartments());
    this.departments$.subscribe(departments => {
      this.filteredDepartments = departments;
    });
  }

  onSearch(): void {
    this.departments$.subscribe(departments => {
      const term = this.searchTerm.toLowerCase();
      this.filteredDepartments = departments.filter(d =>
        d.name.toLowerCase().includes(term) ||
        (d.description && d.description.toLowerCase().includes(term))
      );
    });
  }

  deleteDepartment(id: number): void {
    if (confirm('Tem certeza que deseja deletar este departamento?')) {
      this.store.dispatch(DepartmentsActions.deleteDepartment({ id }));
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Employee } from '../../../core/services/employees.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { 
  selectAllEmployees, 
  selectEmployeesLoading, 
  selectEmployeesError 
} from '../../../store/employees/employees.selectors';
import * as EmployeesActions from '../../../store/employees/employees.actions';

@Component({
  selector: 'app-employees-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LoadingSpinnerComponent],
  template: `
    <div class="container">
      <div class="header">
        <h1>Cadastro de Funcionários</h1>
        <button class="btn btn-primary" routerLink="/employees/create">+ Novo Funcionário</button>
      </div>

      <div class="search-box">
        <input
          type="text"
          placeholder="Buscar por nome ou email..."
          [(ngModel)]="searchTerm"
          (ngModelChange)="onSearch()"
          class="search-input"
        />
      </div>

      <app-loading-spinner *ngIf="loading$ | async" message="Carregando funcionários..."></app-loading-spinner>

      <div *ngIf="error$ | async as error" class="alert alert-danger">
        {{ error }}
      </div>

      <table class="data-table" *ngIf="(employees$ | async) as employees; else noData">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Cargo</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let employee of filteredEmployees">
            <td>#{{ employee.id }}</td>
            <td>{{ employee.name }}</td>
            <td>{{ employee.email }}</td>
            <td>{{ employee.phone || '-' }}</td>
            <td>{{ employee.position || '-' }}</td>
            <td class="actions">
              <button class="btn-sm btn-info" routerLink="/employees/{{ employee.id }}/edit" title="Editar">
                ✎ Editar
              </button>
              <button
                class="btn-sm btn-danger"
                (click)="deleteEmployee(employee.id)"
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
          <p>Nenhum funcionário encontrado</p>
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
export class EmployeesListComponent implements OnInit {
  employees$: Observable<Employee[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  filteredEmployees: Employee[] = [];
  searchTerm: string = '';

  constructor(private store: Store<{ employees: any }>) {
    this.employees$ = this.store.select(selectAllEmployees);
    this.loading$ = this.store.select(selectEmployeesLoading);
    this.error$ = this.store.select(selectEmployeesError);
  }

  ngOnInit(): void {
    this.store.dispatch(EmployeesActions.loadEmployees());
    this.employees$.subscribe(employees => {
      this.filteredEmployees = employees;
    });
  }

  onSearch(): void {
    this.employees$.subscribe(employees => {
      const term = this.searchTerm.toLowerCase();
      this.filteredEmployees = employees.filter(e =>
        e.name.toLowerCase().includes(term) ||
        e.email.toLowerCase().includes(term) ||
        (e.position && e.position.toLowerCase().includes(term))
      );
    });
  }

  deleteEmployee(id: number): void {
    if (confirm('Tem certeza que deseja deletar este funcionário?')) {
      this.store.dispatch(EmployeesActions.deleteEmployee({ id }));
    }
  }
}

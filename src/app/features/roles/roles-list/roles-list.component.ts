import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Role } from '../../../core/services/roles.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { 
  selectAllRoles, 
  selectRolesLoading, 
  selectRolesError 
} from '../../../store/roles/roles.selectors';
import * as RolesActions from '../../../store/roles/roles.actions';

@Component({
  selector: 'app-roles-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LoadingSpinnerComponent],
  template: `
    <div class="container">
      <div class="header">
        <h1>Cadastro de Cargos</h1>
        <button class="btn btn-primary" routerLink="/roles/create">+ Novo Cargo</button>
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

      <app-loading-spinner *ngIf="loading$ | async" message="Carregando cargos..."></app-loading-spinner>

      <div *ngIf="error$ | async as error" class="alert alert-danger">
        {{ error }}
      </div>

      <table class="data-table" *ngIf="(roles$ | async) as roles; else noData">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let role of filteredRoles">
            <td>#{{ role.id }}</td>
            <td>{{ role.name }}</td>
            <td>{{ role.description || '-' }}</td>
            <td class="actions">
              <button class="btn-sm btn-info" routerLink="/roles/{{ role.id }}/edit" title="Editar">
                ✎ Editar
              </button>
              <button
                class="btn-sm btn-danger"
                (click)="deleteRole(role.id)"
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
          <p>Nenhum cargo encontrado</p>
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
export class RolesListComponent implements OnInit {
  roles$: Observable<Role[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  filteredRoles: Role[] = [];
  searchTerm: string = '';

  constructor(private store: Store<{ roles: any }>) {
    this.roles$ = this.store.select(selectAllRoles);
    this.loading$ = this.store.select(selectRolesLoading);
    this.error$ = this.store.select(selectRolesError);
  }

  ngOnInit(): void {
    this.store.dispatch(RolesActions.loadRoles());
    this.roles$.subscribe(roles => {
      this.filteredRoles = roles;
    });
  }

  onSearch(): void {
    this.roles$.subscribe(roles => {
      const term = this.searchTerm.toLowerCase();
      this.filteredRoles = roles.filter(r =>
        r.name.toLowerCase().includes(term) ||
        (r.description && r.description.toLowerCase().includes(term))
      );
    });
  }

  deleteRole(id: number): void {
    if (confirm('Tem certeza que deseja deletar este cargo?')) {
      this.store.dispatch(RolesActions.deleteRole({ id }));
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from '../../../core/services/users.service';
import * as UsersActions from '../../../store/users/users.actions';
import * as UsersSelectors from '../../../store/users/users.selectors';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LoadingSpinnerComponent],
  template: `
    <div class="container">
      <div class="header">
        <h1>Cadastro de Usuários</h1>
        <button class="btn btn-primary" routerLink="/users/create">+ Novo Usuário</button>
      </div>

      <div class="search-box">
        <input
          type="text"
          placeholder="Buscar por email ou nome..."
          [(ngModel)]="searchTerm"
          (ngModelChange)="onSearch()"
          class="search-input"
        />
      </div>

      <app-loading-spinner *ngIf="loading$ | async" message="Carregando usuários..."></app-loading-spinner>

      <div *ngIf="error$ | async as error" class="alert alert-danger">
        {{ error }}
      </div>

      <table class="data-table" *ngIf="(users$ | async) as users; else noData">
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Nome</th>
            <th>Status</th>
            <th>Último Acesso</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let user of filteredUsers">
            <td>#{{ user.id }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.name }}</td>
            <td>
              <span class="badge" [ngClass]="{ 'badge-success': user.isActive, 'badge-danger': !user.isActive }">
                {{ user.isActive ? 'Ativo' : 'Inativo' }}
              </span>
            </td>
            <td>{{ user.lastLogin ? (user.lastLogin | date:'dd/MM/yyyy HH:mm') : 'Nunca' }}</td>
            <td class="actions">
              <button class="btn-sm btn-info" routerLink="/users/{{ user.id }}/edit" title="Editar">
                ✎ Editar
              </button>
              <button
                class="btn-sm btn-warning"
                (click)="toggleUserStatus(user)"
                title="Ativar/Desativar"
              >
                {{ user.isActive ? '✓ Desativar' : '✗ Ativar' }}
              </button>
              <button
                class="btn-sm btn-danger"
                (click)="deleteUser(user.id)"
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
          <p>Nenhum usuário encontrado</p>
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

    .badge-danger {
      background-color: #f8d7da;
      color: #721c24;
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

    .btn-warning {
      background-color: #ffc107;
      color: #333;
    }

    .btn-warning:hover {
      background-color: #e0a800;
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
  `]
})
export class UsersListComponent implements OnInit {
  users$: Observable<User[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  filteredUsers: User[] = [];
  searchTerm: string = '';

  constructor(private store: Store<{ users: any }>) {
    this.users$ = this.store.select(UsersSelectors.selectAllUsers);
    this.loading$ = this.store.select(UsersSelectors.selectUsersLoading);
    this.error$ = this.store.select(UsersSelectors.selectUsersError);
  }

  ngOnInit(): void {
    this.store.dispatch(UsersActions.loadUsers());
    this.users$.subscribe(users => {
      this.filteredUsers = users;
    });
  }

  onSearch(): void {
    this.users$.subscribe(users => {
      const term = this.searchTerm.toLowerCase();
      this.filteredUsers = users.filter(u =>
        u.email.toLowerCase().includes(term) ||
        u.name.toLowerCase().includes(term)
      );
    });
  }

  deleteUser(id: number): void {
    if (confirm('Tem certeza que deseja deletar este usuário?')) {
      this.store.dispatch(UsersActions.deleteUser({ id }));
    }
  }

  toggleUserStatus(user: User): void {
    if (user.isActive) {
      this.store.dispatch(UsersActions.deactivateUser({ id: user.id }));
    } else {
      this.store.dispatch(UsersActions.activateUser({ id: user.id }));
    }
  }
}

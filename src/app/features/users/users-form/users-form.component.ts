import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CreateUserDto, UpdateUserDto } from '../../../core/services/users.service';
import * as UsersActions from '../../../store/users/users.actions';
import * as UsersSelectors from '../../../store/users/users.selectors';

@Component({
  selector: 'app-users-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container">
      <div class="form-header">
        <h1>{{ isEdit ? 'Editar Usuário' : 'Novo Usuário' }}</h1>
        <button class="btn btn-secondary" routerLink="/users">← Voltar</button>
      </div>

      <div class="form-card">
        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="email">Email *</label>
            <input
              type="email"
              id="email"
              [(ngModel)]="form.email"
              name="email"
              placeholder="usuario@example.com"
              required
              [disabled]="isEdit"
            />
          </div>

          <div class="form-group">
            <label for="name">Nome *</label>
            <input
              type="text"
              id="name"
              [(ngModel)]="form.name"
              name="name"
              placeholder="João Silva"
              required
            />
          </div>

          <div class="form-group" *ngIf="!isEdit">
            <label for="password">Senha *</label>
            <input
              type="password"
              id="password"
              [(ngModel)]="form.password"
              name="password"
              placeholder="••••••••"
              required
            />
          </div>

          <div class="form-group" *ngIf="isEdit">
            <label for="isActive">
              <input
                type="checkbox"
                id="isActive"
                [(ngModel)]="form.isActive"
                name="isActive"
              />
              Usuário Ativo
            </label>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary" [disabled]="loading$ | async">
              {{ (loading$ | async) ? 'Salvando...' : 'Salvar' }}
            </button>
            <button type="button" class="btn btn-secondary" routerLink="/users">
              Cancelar
            </button>
          </div>
        </form>

        <div *ngIf="error$ | async as error" class="alert alert-danger">
          {{ error }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 2rem;
      max-width: 600px;
      margin: 0 auto;
    }

    .form-header {
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

    .form-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #333;
    }

    input[type="text"],
    input[type="email"],
    input[type="password"] {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      transition: border-color 0.3s;
    }

    input[type="text"]:focus,
    input[type="email"]:focus,
    input[type="password"]:focus {
      outline: none;
      border-color: #1976d2;
      box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
    }

    input[type="text"]:disabled,
    input[type="email"]:disabled,
    input[type="password"]:disabled {
      background-color: #f5f5f5;
      cursor: not-allowed;
    }

    input[type="checkbox"] {
      margin-right: 0.5rem;
      cursor: pointer;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.3s;
    }

    .btn-primary {
      background-color: #1976d2;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #1565c0;
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-secondary {
      background-color: #f5f5f5;
      color: #333;
      border: 1px solid #ddd;
    }

    .btn-secondary:hover {
      background-color: #e8e8e8;
    }

    .alert-danger {
      margin-top: 1rem;
      padding: 1rem;
      background-color: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
      border-radius: 4px;
    }
  `]
})
export class UsersFormComponent implements OnInit {
  isEdit = false;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  
  form = {
    email: '',
    name: '',
    password: '',
    isActive: true
  };

  private userId: number | null = null;

  constructor(
    private store: Store<{ users: any }>,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.loading$ = this.store.select(UsersSelectors.selectUsersLoading);
    this.error$ = this.store.select(UsersSelectors.selectUsersError);
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.userId = +params['id']; // Convert to number
        if (this.userId) {
          this.store.dispatch(UsersActions.loadUserById({ id: this.userId }));
        }
        
        this.store.select(UsersSelectors.selectSelectedUser).subscribe(user => {
          if (user) {
            this.form = {
              email: user.email,
              name: user.name,
              password: '',
              isActive: user.isActive
            };
          }
        });
      }
    });
  }

  onSubmit(): void {
    if (!this.form.email || !this.form.name) {
      alert('Email e Nome são obrigatórios');
      return;
    }

    if (this.isEdit && this.userId) {
      const updateDto: UpdateUserDto = {
        email: this.form.email,
        name: this.form.name,
        isActive: this.form.isActive
      };
      this.store.dispatch(UsersActions.updateUser({ id: this.userId, user: updateDto }));
    } else {
      if (!this.form.password) {
        alert('Senha é obrigatória para novo usuário');
        return;
      }
      const createDto: CreateUserDto = {
        email: this.form.email,
        name: this.form.name,
        password: this.form.password
      };
      this.store.dispatch(UsersActions.createUser({ user: createDto }));
    }

    // Aguarda um pouco antes de voltar para a lista
    setTimeout(() => {
      this.router.navigate(['/users']);
    }, 1000);
  }
}

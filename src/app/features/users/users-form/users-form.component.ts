import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CreateUserDto, UpdateUserDto } from '../../../core/services/users.service';
import { FormFieldComponent } from '../../../shared/components/generic-form/form-field.component';
import { FormFieldConfig } from '../../../shared/components/generic-form/form-field-config';
import * as UsersActions from '../../../store/users/users.actions';
import * as UsersSelectors from '../../../store/users/users.selectors';
import { UserUnitsComponent } from '../user-units/user-units.component';

@Component({
  selector: 'app-users-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormFieldComponent, UserUnitsComponent, RouterLink],
  template: `
    <div class="form-container">
      <div class="form-header">
        <h2>{{ title }}</h2>
        <a [routerLink]="'/users'" class="btn btn-secondary">Voltar</a>
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit($event)" class="form-content">
        <!-- Campos do usuário -->
        <div class="form-fields">
          <app-form-field
            *ngFor="let field of fields"
            [field]="field"
            [form]="form"
          ></app-form-field>
        </div>

        <!-- Grid de unidades -->
        <app-user-units
          [selectedUnits]="selectedUnits"
          (unitsChanged)="onUnitsChanged($event)"
        ></app-user-units>

        <!-- Botões de ação -->
        <div class="form-actions">
          <button type="submit" class="btn btn-primary" [disabled]="form.invalid">
            {{ isEdit ? 'Atualizar' : 'Salvar' }}
          </button>
          <a [routerLink]="'/users'" class="btn btn-secondary">Cancelar</a>
        </div>
      </form>

      <!-- Erros -->
      <div *ngIf="error$ | async as error" class="alert alert-danger mt-3">
        {{ error }}
      </div>

      <!-- Loading -->
      <div *ngIf="loading$ | async" class="spinner">
        Carregando...
      </div>
    </div>
  `,
  styles: [`
    .form-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 20px;
    }

    .form-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }

    .form-header h2 {
      margin: 0;
      color: #333;
    }

    .form-content {
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .form-fields {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 20px;
    }

    .form-fields app-form-field:last-child {
      grid-column: 1 / -1;
    }

    .form-actions {
      display: flex;
      gap: 10px;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #eee;
    }

    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      text-decoration: none;
      display: inline-block;
      transition: background 0.3s;
    }

    .btn-primary {
      background: #007bff;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #0056b3;
    }

    .btn-primary:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background: #545b62;
    }

    .alert {
      padding: 12px 20px;
      border-radius: 4px;
      margin-top: 20px;
    }

    .alert-danger {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }

    .spinner {
      text-align: center;
      padding: 20px;
      color: #666;
    }
  `]
})
export class UsersFormComponent implements OnInit {
  isEdit = false;
  title = 'Novo Usuário';
  form!: FormGroup;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  selectedUnits: any[] = [];
  fields: FormFieldConfig[] = [];

  private userId: number | null = null;

  constructor(
    private store: Store<{ users: any }>,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.loading$ = this.store.select(UsersSelectors.selectUsersLoading);
    this.error$ = this.store.select(UsersSelectors.selectUsersError);
    this.form = this.createForm(false);
  }

  private createForm(isEdit: boolean): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required, Validators.minLength(3)]],
      password: !isEdit ? ['', [Validators.required, Validators.minLength(6)]] : ['']
    });
  }

  private buildFields(): void {
    this.fields = [
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'usuario@example.com',
        required: true,
        disabled: this.isEdit
      },
      {
        name: 'name',
        label: 'Nome',
        type: 'text',
        placeholder: 'João Silva',
        required: true
      },
      ...(!this.isEdit
        ? [
            {
              name: 'password' as const,
              label: 'Senha',
              type: 'text' as const,
              placeholder: '••••••••',
              required: true
            }
          ]
        : [])
    ];
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.title = 'Editar Usuário';
        this.userId = +params['id'];
        this.form = this.createForm(true);
        this.buildFields();

        this.store.dispatch(UsersActions.loadUserById({ id: this.userId }));
        this.store.select(UsersSelectors.selectSelectedUser).subscribe(user => {
          if (user) {
            this.form.patchValue({
              email: user.email,
              name: user.name
            });
            this.selectedUnits = user.units || [];
          }
        });
      } else {
        this.buildFields();
      }
    });
  }

  onUnitsChanged(units: any[]): void {
    this.selectedUnits = units;
  }

  onSubmit(event: any): void {
    // Ignore if it's a SubmitEvent instead of form data
    if (event instanceof SubmitEvent) {
      event.preventDefault();
    }
    
    if (!this.form.valid) {
      return;
    }

    const formValue = this.form.value;
    
    if (this.isEdit && this.userId) {
      const updateDto: UpdateUserDto = {
        email: formValue.email,
        name: formValue.name,
        unitIds: this.selectedUnits.map(u => u.id)
      };
      this.store.dispatch(UsersActions.updateUser({ id: this.userId, user: updateDto }));
    } else {
      const createDto: CreateUserDto = {
        email: formValue.email,
        name: formValue.name,
        password: formValue.password,
        unitIds: this.selectedUnits.map(u => u.id)
      };
      this.store.dispatch(UsersActions.createUser({ user: createDto }));
    }

    setTimeout(() => {
      this.router.navigate(['/users']);
    }, 1000);
  }
}



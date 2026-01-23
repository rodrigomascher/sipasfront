import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CreateUserDto, UpdateUserDto } from '../../../core/services/users.service';
import { FormFieldComponent } from '../../../shared/components/generic-form/form-field.component';
import { FormFieldConfig } from '../../../shared/components/generic-form/form-field-config';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import * as UsersActions from '../../../store/users/users.actions';
import * as UsersSelectors from '../../../store/users/users.selectors';
import { UserUnitsComponent } from '../user-units/user-units.component';
import { ChangePasswordDialogComponent } from '../change-password-dialog/change-password-dialog.component';

@Component({
  selector: 'app-users-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormFieldComponent, UserUnitsComponent, RouterLink, ChangePasswordDialogComponent, LoadingSpinnerComponent],
  template: `
    <app-change-password-dialog
      #passwordDialog
      (passwordChanged)="onPasswordChanged($event)"
    ></app-change-password-dialog>

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
          
          <!-- Checkbox: Ativo/Inativo -->
          <div class="checkbox-field">
            <label>
              <input type="checkbox" formControlName="isActive" />
              Ativo
            </label>
          </div>
          
          <!-- Last Login (somente leitura) -->
          <div class="readonly-field" *ngIf="isEdit && lastLoginDate">
            <label>Último Login:</label>
            <div class="readonly-value">{{ lastLoginDate | date: 'dd/MM/yyyy HH:mm:ss' }}</div>
          </div>
        </div>

        <!-- Botão para alterar senha (apenas em edição) -->
        <div *ngIf="isEdit" class="password-button-section">
          <button type="button" class="btn btn-info" (click)="openChangePasswordDialog()">
            🔑 Alterar Senha
          </button>
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
      <app-loading-spinner
        *ngIf="loading$ | async"
        mode="overlay"
        message="Carregando...">
      </app-loading-spinner>
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

    .checkbox-field {
      display: flex;
      align-items: center;
    }

    .checkbox-field label {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      margin: 0;
    }

    .checkbox-field input[type="checkbox"] {
      width: 18px;
      height: 18px;
      cursor: pointer;
    }

    .readonly-field {
      padding: 12px;
      background: #f5f5f5;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .readonly-field label {
      font-weight: 500;
      color: #666;
      display: block;
      margin-bottom: 5px;
    }

    .readonly-value {
      color: #333;
      font-family: monospace;
    }

    .password-button-section {
      margin: 20px 0;
      padding: 15px 0;
      border-top: 1px solid #eee;
      border-bottom: 1px solid #eee;
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
  lastLoginDate: Date | null = null;

  @ViewChild(ChangePasswordDialogComponent) passwordDialog!: ChangePasswordDialogComponent;

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
      password: !isEdit ? ['', [Validators.required, Validators.minLength(6)]] : [''],
      isActive: [true],
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
              name: user.name,
              isActive: user.isActive !== false
            });
            this.selectedUnits = user.units || [];
            this.lastLoginDate = user.lastLogin ? new Date(user.lastLogin) : null;
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

  openChangePasswordDialog(): void {
    if (this.passwordDialog) {
      this.passwordDialog.open();
    }
  }

  onPasswordChanged(newPassword: string | null): void {
    if (newPassword && this.userId) {
      // Dispatch action to change password
      this.store.dispatch(UsersActions.updateUser({
        id: this.userId!,
        user: {
          password: newPassword
        } as UpdateUserDto
      }));
    }
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
        isActive: formValue.isActive,
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


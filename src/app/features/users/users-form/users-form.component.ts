import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CreateUserDto, UpdateUserDto } from '../../../core/services/users.service';
import { GenericFormComponent } from '../../../shared/components/generic-form/generic-form.component';
import { FormFieldConfig } from '../../../shared/components/generic-form/form-field-config';
import * as UsersActions from '../../../store/users/users.actions';
import * as UsersSelectors from '../../../store/users/users.selectors';

@Component({
  selector: 'app-users-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, GenericFormComponent],
  template: `
    <app-generic-form
      [title]="title"
      [fields]="fields"
      [form]="form"
      backRoute="/users"
      [submitLabel]="isEdit ? 'Atualizar' : 'Salvar'"
      [loading$]="loading$"
      [error$]="error$"
      (submit)="onSubmit($event)"
    ></app-generic-form>
  `
})
export class UsersFormComponent implements OnInit {
  isEdit = false;
  title = 'Novo Usuário';
  form!: FormGroup;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

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
      password: !isEdit ? ['', [Validators.required, Validators.minLength(6)]] : [''],
      isActive: [true]
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
        : []),
      {
        name: 'isActive' as const,
        label: 'Usuário Ativo',
        type: 'checkbox' as const
      }
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
              isActive: user.isActive
            });
          }
        });
      } else {
        this.buildFields();
      }
    });
  }

  onSubmit(formValue: any): void {
    // Ignore if it's a SubmitEvent instead of form data
    if (formValue instanceof SubmitEvent) {
      console.warn('[UsersFormComponent] Received SubmitEvent instead of form data, ignoring');
      return;
    }
    
    if (this.isEdit && this.userId) {
      const updateDto: UpdateUserDto = {
        email: formValue.email,
        name: formValue.name,
        isActive: formValue.isActive
      };
      this.store.dispatch(UsersActions.updateUser({ id: this.userId, user: updateDto }));
    } else {
      const createDto: CreateUserDto = {
        email: formValue.email,
        name: formValue.name,
        password: formValue.password
      };
      this.store.dispatch(UsersActions.createUser({ user: createDto }));
    }

    setTimeout(() => {
      this.router.navigate(['/users']);
    }, 1000);
  }
}

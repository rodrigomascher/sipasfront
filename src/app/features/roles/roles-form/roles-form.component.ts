import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CreateRoleDto, UpdateRoleDto } from '../../../core/services/roles.service';
import { GenericFormComponent } from '../../../shared/components/generic-form/generic-form.component';
import { FormFieldConfig } from '../../../shared/components/generic-form/form-field-config';
import { selectRoleById } from '../../../store/roles/roles.selectors';
import * as RolesActions from '../../../store/roles/roles.actions';

@Component({
  selector: 'app-roles-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, GenericFormComponent],
  template: `
    <app-generic-form
      [title]="title"
      [fields]="fields"
      [form]="form"
      backRoute="/roles"
      [submitLabel]="isEdit ? 'Atualizar' : 'Salvar'"
      [loading$]="loading$"
      [error$]="error$"
      (submit)="onSubmit($event)"
    ></app-generic-form>
  `
})
export class RolesFormComponent implements OnInit {
  isEdit = false;
  title = 'Novo Cargo';
  form!: FormGroup;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  fields: FormFieldConfig[] = [
    {
      name: 'name',
      label: 'Nome',
      type: 'text',
      placeholder: 'Digite o nome do cargo',
      required: true
    },
    {
      name: 'description',
      label: 'Descrição',
      type: 'textarea',
      placeholder: 'Digite a descrição do cargo'
    }
  ];

  private roleId: number | null = null;

  constructor(
    private store: Store<{ roles: any }>,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.loading$ = this.store.select(state => state.roles?.loading || false);
    this.error$ = this.store.select(state => state.roles?.error || null);
    this.form = this.createForm();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.title = 'Editar Cargo';
        this.roleId = +params['id'];

        this.store.select(selectRoleById(this.roleId)).subscribe(role => {
          if (role) {
            this.form.patchValue({
              name: role.name,
              description: role.description || ''
            });
          } else {
            this.store.dispatch(RolesActions.loadRoleById({ id: this.roleId! }));
          }
        });
      }
    });
  }

  onSubmit(formValue: any): void {
    if (this.isEdit && this.roleId) {
      const updateDto: UpdateRoleDto = formValue;
      this.store.dispatch(RolesActions.updateRole({
        id: this.roleId,
        role: updateDto
      }));
    } else {
      const createDto: CreateRoleDto = formValue;
      this.store.dispatch(RolesActions.createRole({ role: createDto }));
    }

    setTimeout(() => {
      this.router.navigate(['/roles']);
    }, 1000);
  }
}

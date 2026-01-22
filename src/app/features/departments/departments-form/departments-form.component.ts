import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CreateDepartmentDto, UpdateDepartmentDto } from '../../../core/services/departments.service';
import { GenericFormComponent } from '../../../shared/components/generic-form/generic-form.component';
import { FormFieldConfig } from '../../../shared/components/generic-form/form-field-config';
import { selectDepartmentById } from '../../../store/departments/departments.selectors';
import * as DepartmentsActions from '../../../store/departments/departments.actions';

@Component({
  selector: 'app-departments-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, GenericFormComponent],
  template: `
    <app-generic-form
      [title]="title"
      [fields]="fields"
      [form]="form"
      backRoute="/departments"
      [submitLabel]="isEdit ? 'Atualizar' : 'Salvar'"
      [loading$]="loading$"
      [error$]="error$"
      (submit)="onSubmit($event)"
    ></app-generic-form>
  `
})
export class DepartmentsFormComponent implements OnInit {
  isEdit = false;
  title = 'Novo Departamento';
  form!: FormGroup;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  fields: FormFieldConfig[] = [
    {
      name: 'description',
      label: 'Descrição',
      type: 'text',
      placeholder: 'Digite a descrição do departamento',
      required: true
    },
    {
      name: 'unitId',
      label: 'Unidade',
      type: 'select',
      required: true,
      options: []
    }
  ];

  private departmentId: number | null = null;

  constructor(
    private store: Store<{ departments: any }>,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.loading$ = this.store.select(state => state.departments?.loading || false);
    this.error$ = this.store.select(state => state.departments?.error || null);
    this.form = this.createForm();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      description: ['', [Validators.required, Validators.minLength(2)]],
      unitId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.title = 'Editar Departamento';
        this.departmentId = +params['id'];

        this.store.select(selectDepartmentById(this.departmentId)).subscribe(department => {
          if (department) {
            this.form.patchValue({
              description: department.description,
              unitId: department.unitId
            });
          } else {
            this.store.dispatch(DepartmentsActions.loadDepartmentById({ id: this.departmentId! }));
          }
        });
      }
    });
  }

  onSubmit(formValue: any): void {
    // Ignore if it's a SubmitEvent instead of form data
    if (formValue instanceof SubmitEvent) {
      console.warn('[DepartmentsFormComponent] Received SubmitEvent instead of form data, ignoring');
      return;
    }
    
    if (this.isEdit && this.departmentId) {
      const updateDto: UpdateDepartmentDto = formValue;
      this.store.dispatch(DepartmentsActions.updateDepartment({
        id: this.departmentId,
        department: updateDto
      }));
    } else {
      const createDto: CreateDepartmentDto = formValue;
      this.store.dispatch(DepartmentsActions.createDepartment({ department: createDto }));
    }

    setTimeout(() => {
      this.router.navigate(['/departments']);
    }, 1000);
  }
}

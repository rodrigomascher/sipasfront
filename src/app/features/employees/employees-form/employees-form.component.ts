import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CreateEmployeeDto, UpdateEmployeeDto } from '../../../core/services/employees.service';
import { GenericFormComponent } from '../../../shared/components/generic-form/generic-form.component';
import { FormFieldConfig } from '../../../shared/components/generic-form/form-field-config';
import { selectEmployeeById } from '../../../store/employees/employees.selectors';
import * as EmployeesActions from '../../../store/employees/employees.actions';

@Component({
  selector: 'app-employees-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, GenericFormComponent],
  template: `
    <app-generic-form
      [title]="title"
      [fields]="fields"
      [form]="form"
      backRoute="/employees"
      [submitLabel]="isEdit ? 'Atualizar' : 'Salvar'"
      [loading$]="loading$"
      [error$]="error$"
      (submit)="onSubmit($event)"
    ></app-generic-form>
  `
})
export class EmployeesFormComponent implements OnInit {
  isEdit = false;
  title = 'Novo Funcionário';
  form!: FormGroup;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  fields: FormFieldConfig[] = [
    {
      name: 'employeeId',
      label: 'Matrícula',
      type: 'text',
      placeholder: 'Digite a matrícula do funcionário',
      required: true
    },
    {
      name: 'fullName',
      label: 'Nome',
      type: 'text',
      placeholder: 'Digite o nome do funcionário',
      required: true
    },
    {
      name: 'unitId',
      label: 'Unidade',
      type: 'number',
      placeholder: 'ID da unidade'
    },
    {
      name: 'departmentId',
      label: 'Departamento',
      type: 'number',
      placeholder: 'ID do departamento'
    },
    {
      name: 'roleId',
      label: 'Cargo',
      type: 'number',
      placeholder: 'ID do cargo'
    },
    {
      name: 'isTechnician',
      label: 'É Técnico',
      type: 'checkbox'
    }
  ];

  private employeeId: number | null = null;

  constructor(
    private store: Store<{ employees: any }>,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.loading$ = this.store.select(state => state.employees?.loading || false);
    this.error$ = this.store.select(state => state.employees?.error || null);
    this.form = this.createForm();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      employeeId: ['', [Validators.required, Validators.minLength(2)]],
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      unitId: [null],
      departmentId: [null],
      roleId: [null],
      isTechnician: [false]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.title = 'Editar Funcionário';
        this.employeeId = +params['id'];

        this.store.select(selectEmployeeById(this.employeeId)).subscribe(employee => {
          if (employee) {
            this.form.patchValue({
              employeeId: employee.employeeId,
              fullName: employee.fullName,
              unitId: employee.unitId,
              departmentId: employee.departmentId,
              roleId: employee.roleId,
              isTechnician: employee.isTechnician
            });
          } else {
            this.store.dispatch(EmployeesActions.loadEmployeeById({ id: this.employeeId! }));
          }
        });
      }
    });
  }

  onSubmit(formValue: any): void {
    if (this.isEdit && this.employeeId) {
      const updateDto: UpdateEmployeeDto = formValue;
      this.store.dispatch(EmployeesActions.updateEmployee({
        id: this.employeeId,
        employee: updateDto
      }));
    } else {
      const createDto: CreateEmployeeDto = formValue;
      this.store.dispatch(EmployeesActions.createEmployee({ employee: createDto }));
    }

    setTimeout(() => {
      this.router.navigate(['/employees']);
    }, 1000);
  }
}

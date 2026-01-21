import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { CreateEmployeeDto, UpdateEmployeeDto } from '../../../core/services/employees.service';
import { selectEmployeeById } from '../../../store/employees/employees.selectors';
import * as EmployeesActions from '../../../store/employees/employees.actions';

@Component({
  selector: 'app-employees-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <div class="form-header">
        <h1>{{ isEdit ? 'Editar' : 'Criar' }} Funcionário</h1>
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="form-container">
        <div class="form-group">
          <label for="name">Nome *</label>
          <input
            type="text"
            id="name"
            formControlName="name"
            class="form-input"
            placeholder="Digite o nome do funcionário"
          />
          <span *ngIf="form.get('name')?.hasError('required') && form.get('name')?.touched" class="error-text">
            Nome é obrigatório
          </span>
        </div>

        <div class="form-group">
          <label for="email">Email *</label>
          <input
            type="email"
            id="email"
            formControlName="email"
            class="form-input"
            placeholder="Digite o email do funcionário"
          />
          <span *ngIf="form.get('email')?.hasError('required') && form.get('email')?.touched" class="error-text">
            Email é obrigatório
          </span>
          <span *ngIf="form.get('email')?.hasError('email') && form.get('email')?.touched" class="error-text">
            Email inválido
          </span>
        </div>

        <div class="form-group">
          <label for="phone">Telefone</label>
          <input
            type="tel"
            id="phone"
            formControlName="phone"
            class="form-input"
            placeholder="Digite o telefone"
          />
        </div>

        <div class="form-group">
          <label for="position">Cargo</label>
          <input
            type="text"
            id="position"
            formControlName="position"
            class="form-input"
            placeholder="Digite o cargo"
          />
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary" [disabled]="!form.valid || isSubmitting">
            {{ isSubmitting ? 'Salvando...' : 'Salvar' }}
          </button>
          <button type="button" class="btn btn-secondary" (click)="onCancel()">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .container {
      padding: 2rem;
      max-width: 600px;
      margin: 0 auto;
    }

    .form-header {
      margin-bottom: 2rem;
    }

    h1 {
      margin: 0;
      font-size: 1.8rem;
      color: #333;
    }

    .form-container {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .form-group {
      margin-bottom: 1.5rem;
      display: flex;
      flex-direction: column;
    }

    label {
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: #333;
    }

    .form-input {
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      font-family: inherit;
    }

    .form-input:focus {
      outline: none;
      border-color: #1976d2;
      box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.1);
    }

    .error-text {
      color: #dc3545;
      font-size: 12px;
      margin-top: 0.25rem;
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
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
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
      background-color: #ccc;
      cursor: not-allowed;
    }

    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background-color: #5a6268;
    }
  `]
})
export class EmployeesFormComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  isSubmitting = false;
  employeeId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<{ employees: any }>
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      position: ['']
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.employeeId = +params['id'];
        
        this.store.select(selectEmployeeById(this.employeeId)).subscribe(employee => {
          if (employee) {
            this.form.patchValue({
              name: employee.name,
              email: employee.email,
              phone: employee.phone || '',
              position: employee.position || ''
            });
          } else {
            this.store.dispatch(EmployeesActions.loadEmployeeById({ id: this.employeeId! }));
          }
        });
      }
    });
  }

  onSubmit(): void {
    if (!this.form.valid) return;

    this.isSubmitting = true;
    const formValue = this.form.value;

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

  onCancel(): void {
    this.router.navigate(['/employees']);
  }
}

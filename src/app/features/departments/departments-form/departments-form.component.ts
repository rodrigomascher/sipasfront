import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { CreateDepartmentDto, UpdateDepartmentDto } from '../../../core/services/departments.service';
import { selectDepartmentById } from '../../../store/departments/departments.selectors';
import * as DepartmentsActions from '../../../store/departments/departments.actions';

@Component({
  selector: 'app-departments-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <div class="form-header">
        <h1>{{ isEdit ? 'Editar' : 'Criar' }} Departamento</h1>
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="form-container">
        <div class="form-group">
          <label for="name">Nome *</label>
          <input
            type="text"
            id="name"
            formControlName="name"
            class="form-input"
            placeholder="Digite o nome do departamento"
          />
          <span *ngIf="form.get('name')?.hasError('required') && form.get('name')?.touched" class="error-text">
            Nome é obrigatório
          </span>
        </div>

        <div class="form-group">
          <label for="description">Descrição</label>
          <textarea
            id="description"
            formControlName="description"
            class="form-input"
            placeholder="Digite a descrição do departamento"
            rows="4"
          ></textarea>
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
export class DepartmentsFormComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  isSubmitting = false;
  departmentId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<{ departments: any }>
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.departmentId = +params['id'];
        
        this.store.select(selectDepartmentById(this.departmentId)).subscribe(department => {
          if (department) {
            this.form.patchValue({
              name: department.name,
              description: department.description || ''
            });
          } else {
            this.store.dispatch(DepartmentsActions.loadDepartmentById({ id: this.departmentId! }));
          }
        });
      }
    });
  }

  onSubmit(): void {
    if (!this.form.valid) return;

    this.isSubmitting = true;
    const formValue = this.form.value;

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

  onCancel(): void {
    this.router.navigate(['/departments']);
  }
}

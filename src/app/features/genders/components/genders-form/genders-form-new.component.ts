import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as Actions from '../../store/genders.actions';
import * as Selectors from '../../store/genders.selectors';

@Component({
  selector: 'app-genders-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <div class="form-header">
        <h1>{{ isEditMode ? 'Editar Gênero' : 'Novo Gênero' }}</h1>
      </div>

      <form [formGroup]="form" (ngSubmit)="submit()" class="form-container">
        <div class="form-group">
          <label for="description">Descrição *</label>
          <input
            type="text"
            id="description"
            formControlName="description"
            class="form-input"
            placeholder="Ex: Masculino, Feminino"
          />
          <span *ngIf="form.get('description')?.hasError('required') && form.get('description')?.touched" class="error-text">
            Descrição é obrigatória
          </span>
        </div>

        <div class="form-group">
          <label for="active">
            <input
              type="checkbox"
              id="active"
              formControlName="active"
              class="form-checkbox"
            />
            Ativo
          </label>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary" [disabled]="!form.valid || (loading$ | async)">
            {{ (loading$ | async) ? 'Salvando...' : (isEditMode ? 'Atualizar' : 'Salvar') }}
          </button>
          <button type="button" class="btn btn-secondary" (click)="onCancel()">
            Cancelar
          </button>
        </div>

        <div *ngIf="error$ | async as error" class="alert alert-danger">
          {{ error }}
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

    .form-checkbox {
      margin-right: 0.5rem;
      cursor: pointer;
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

    .alert {
      margin-top: 1rem;
      padding: 0.75rem;
      border-radius: 4px;
      font-size: 14px;
    }

    .alert-danger {
      background-color: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }
  `]
})
export class GendersFormComponent implements OnInit {
  form: FormGroup;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  isEditMode = false;
  itemId: number | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<{ genders: any }>,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.formBuilder.group({
      description: ['', [Validators.required]],
      active: [true],
    });
    this.loading$ = this.store.select(Selectors.selectGendersLoading);
    this.error$ = this.store.select(Selectors.selectGendersError);
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.itemId = +params['id'];
        this.isEditMode = true;
        this.store.dispatch(Actions.loadGenderById({ id: this.itemId }));
        this.store.select(Selectors.selectSelectedGender).subscribe((gender) => {
          if (gender) {
            this.form.patchValue(gender);
          }
        });
      }
    });
  }

  submit() {
    if (!this.form.valid) return;

    const formValue = this.form.value;
    formValue.createdBy = 1;

    if (this.isEditMode && this.itemId) {
      this.store.dispatch(
        Actions.updateGender({
          id: this.itemId,
          gender: formValue,
        })
      );
    } else {
      this.store.dispatch(Actions.createGender({ gender: formValue }));
    }

    setTimeout(() => {
      this.router.navigate(['/genders']);
    }, 1000);
  }

  onCancel() {
    this.router.navigate(['/genders']);
  }
}

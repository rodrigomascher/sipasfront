import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Gender } from '../../../../core/services/genders.service';
import * as GendersActions from '../../store/genders.actions';
import * as GendersSelectors from '../../store/genders.selectors';

@Component({
  selector: 'app-genders-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container">
      <div class="form-header">
        <h1>{{ isEditMode ? 'Editar Gênero' : 'Novo Gênero' }}</h1>
        <button class="btn btn-secondary" routerLink="/genders">← Voltar</button>
      </div>

      <div class="form-card">
        <div *ngIf="error$ | async as error" class="alert alert-danger">
          ⚠️ {{ error }}
        </div>

        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="form-group">
            <label for="description">Descrição *</label>
            <input
              type="text"
              id="description"
              formControlName="description"
              placeholder="Ex: Masculino, Feminino"
              required
            />
            <small *ngIf="form.get('description')?.invalid && form.get('description')?.touched" class="error">
              Campo obrigatório
            </small>
          </div>

          <div class="form-group">
            <label for="active">
              <input
                type="checkbox"
                id="active"
                formControlName="active"
              />
              Ativo
            </label>
          </div>

          <div class="form-actions">
            <button 
              type="submit" 
              class="btn btn-primary" 
              [disabled]="!form.valid || (loading$ | async)"
            >
              {{ (loading$ | async) ? 'Salvando...' : (isEditMode ? 'Atualizar' : 'Salvar') }}
            </button>
            <button type="button" class="btn btn-secondary" routerLink="/genders">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 2rem;
      max-width: 800px;
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
    input[type="number"],
    select,
    textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      font-family: inherit;
    }

    input[type="text"]:focus,
    input[type="email"]:focus,
    input[type="number"]:focus,
    select:focus,
    textarea:focus {
      outline: none;
      border-color: #1976d2;
      box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
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
      font-size: 1rem;
      font-weight: 500;
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
      background-color: #f0f0f0;
      color: #333;
      border: 1px solid #ddd;
    }

    .btn-secondary:hover {
      background-color: #e0e0e0;
    }

    .alert {
      padding: 1rem;
      border-radius: 4px;
      margin-bottom: 1.5rem;
    }

    .alert-danger {
      background-color: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }

    small.error {
      display: block;
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
  `]
})
export class GendersFormComponent implements OnInit {
  form: FormGroup;
  loading$: Observable<boolean>;
  error$: Observable<any>;
  isEditMode = false;
  genderId: number | null = null;

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
    this.loading$ = this.store.select(GendersSelectors.selectGendersLoading);
    this.error$ = this.store.select(GendersSelectors.selectGendersError);
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.genderId = +params['id'];
        this.isEditMode = true;
        this.store.dispatch(GendersActions.loadGenderById({ id: this.genderId }));
        this.store.select(GendersSelectors.selectSelectedGender).subscribe((gender) => {
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
    formValue.createdBy = 1; // Ajustar com usuário logado

    if (this.isEditMode && this.genderId) {
      this.store.dispatch(
        GendersActions.updateGender({
          id: this.genderId,
          gender: formValue,
        })
      );
    } else {
      this.store.dispatch(GendersActions.createGender({ gender: formValue }));
    }

    setTimeout(() => {
      this.router.navigate(['/genders']);
    }, 1000);
  }
}

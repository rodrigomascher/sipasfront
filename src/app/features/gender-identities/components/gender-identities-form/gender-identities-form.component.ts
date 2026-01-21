import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as Actions from '../../store/gender-identities.actions';
import * as Selectors from '../../store/gender-identities.selectors';

@Component({
  selector: 'app-gender-identities-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container">
      <div class="form-header">
        <h1>{{ isEditMode ? 'Editar Identidade de Gênero' : 'Nova Identidade de Gênero' }}</h1>
        <button class="btn btn-secondary" routerLink="/gender-identities">← Voltar</button>
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
              placeholder="Ex: Cisgênero, Transgênero"
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
            <button type="button" class="btn btn-secondary" routerLink="/gender-identities">
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
export class GenderIdentitiesFormComponent implements OnInit {
  form: FormGroup;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  isEditMode = false;
  itemId: number | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<{ genderIdentities: any }>,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.formBuilder.group({
      description: ['', [Validators.required]],
      active: [true],
    });
    this.loading$ = this.store.select(Selectors.selectGenderIdentitiesLoading);
    this.error$ = this.store.select(Selectors.selectGenderIdentitiesError);
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.itemId = +params['id'];
        this.isEditMode = true;
      }
    });
  }

  submit() {
    if (!this.form.valid) return;

    const formValue = this.form.value;
    formValue.createdBy = 1;

    if (this.isEditMode && this.itemId) {
      this.store.dispatch(
        Actions.updateGenderIdentity({
          id: this.itemId,
          genderIdentity: formValue,
        })
      );
    } else {
      this.store.dispatch(Actions.createGenderIdentity({ genderIdentity: formValue }));
    }

    setTimeout(() => {
      this.router.navigate(['/gender-identities']);
    }, 1000);
  }
}

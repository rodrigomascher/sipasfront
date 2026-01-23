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
    @import '../../../../shared/styles/form-styles.scss';

    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }

    .form-header {
      margin-bottom: 30px;
    }

    .form-header h1 {
      margin: 0;
      color: #333;
      font-size: 24px;
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

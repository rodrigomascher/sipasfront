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
    <div style="padding: 20px; max-width: 600px; margin: 0 auto;">
      <h2>{{ isEditMode ? 'Editar Gênero' : 'Novo Gênero' }}</h2>

      <div *ngIf="error$ | async as error" style="background: #f8d7da; color: #721c24; padding: 12px; border-radius: 4px; margin-bottom: 15px; border: 1px solid #f5c6cb;">
        ⚠️ Erro: {{ error }}
      </div>

      <form [formGroup]="form" (ngSubmit)="submit()" style="margin-top: 20px;">
        <div style="margin-bottom: 15px;">
          <label style="display: block; margin-bottom: 5px; font-weight: bold;">Descrição *</label>
          <input
            type="text"
            formControlName="description"
            placeholder="Ex: Masculino"
            style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; box-sizing: border-box;"
          />
          <div *ngIf="form.get('description')?.invalid && form.get('description')?.touched" style="color: #dc3545; font-size: 12px; margin-top: 5px;">
            Campo obrigatório
          </div>
        </div>

        <div style="margin-bottom: 15px;">
          <label style="display: flex; align-items: center;">
            <input type="checkbox" formControlName="active" style="margin-right: 8px;" />
            <span>Ativo</span>
          </label>
        </div>

        <div style="display: flex; gap: 10px;">
          <button
            type="submit"
            [disabled]="!form.valid || (loading$ | async)"
            style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; flex: 1;"
          >
            {{ (loading$ | async) ? 'Processando...' : (isEditMode ? 'Atualizar' : 'Criar') }}
          </button>
          <a routerLink="/genders" style="padding: 10px 20px; background: #6c757d; color: white; text-decoration: none; border-radius: 4px; text-align: center; flex: 1;">
            Cancelar
          </a>
        </div>
      </form>
    </div>
  `,
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

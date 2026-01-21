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
    <div style="padding: 20px; max-width: 600px; margin: 0 auto;">
      <h2>{{ isEditMode ? 'Editar Identidade' : 'Nova Identidade' }}</h2>

      <form [formGroup]="form" (ngSubmit)="submit()" style="margin-top: 20px;">
        <div style="margin-bottom: 15px;">
          <label style="display: block; margin-bottom: 5px; font-weight: bold;">Descrição *</label>
          <input
            type="text"
            formControlName="description"
            placeholder="Ex: Cisgênero"
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
            {{ isEditMode ? 'Atualizar' : 'Criar' }}
          </button>
          <a routerLink="/gender-identities" style="padding: 10px 20px; background: #6c757d; color: white; text-decoration: none; border-radius: 4px; text-align: center; flex: 1;">
            Cancelar
          </a>
        </div>
      </form>
    </div>
  `,
})
export class GenderIdentitiesFormComponent implements OnInit {
  form: FormGroup;
  loading$: Observable<boolean>;
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

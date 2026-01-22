import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { GenericFormComponent } from '../../../../shared/components/generic-form/generic-form.component';
import { FormFieldConfig } from '../../../../shared/components/generic-form/form-field-config';
import * as Actions from '../../store/gender-identities.actions';
import * as Selectors from '../../store/gender-identities.selectors';

@Component({
  selector: 'app-gender-identities-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, GenericFormComponent],
  template: `
    <app-generic-form
      [title]="title"
      [fields]="fields"
      [form]="form"
      backRoute="/gender-identities"
      [submitLabel]="isEditMode ? 'Atualizar' : 'Salvar'"
      [loading$]="loading$"
      [error$]="error$"
      (submit)="onSubmit($event)"
    ></app-generic-form>
  `
})
export class GenderIdentitiesFormComponent implements OnInit {
  isEditMode = false;
  title = 'Nova Identidade de Gênero';
  form!: FormGroup;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  fields: FormFieldConfig[] = [
    {
      name: 'description',
      label: 'Descrição',
      type: 'text',
      placeholder: 'Ex: Cisgênero, Transgênero',
      required: true
    },
    {
      name: 'active',
      label: 'Ativo',
      type: 'checkbox'
    }
  ];

  private itemId: number | null = null;

  constructor(
    private store: Store<{ genderIdentities: any }>,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.loading$ = this.store.select(Selectors.selectGenderIdentitiesLoading);
    this.error$ = this.store.select(Selectors.selectGenderIdentitiesError);
    this.form = this.createForm();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      description: ['', [Validators.required, Validators.minLength(2)]],
      active: [true]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.title = 'Editar Identidade de Gênero';
        this.itemId = +params['id'];
        this.store.select(Selectors.selectAllGenderIdentities).subscribe(items => {
          const item = items.find((x: any) => x.id === this.itemId);
          if (item) {
            this.form.patchValue({
              description: item.description,
              active: item.active
            });
          }
        });
      }
    });
  }

  onSubmit(formValue: any): void {
    if (this.isEditMode && this.itemId) {
      this.store.dispatch(Actions.updateGenderIdentity({ id: this.itemId, genderIdentity: formValue }));
    } else {
      this.store.dispatch(Actions.createGenderIdentity({ genderIdentity: formValue }));
    }

    setTimeout(() => {
      this.router.navigate(['/gender-identities']);
    }, 1000);
  }
}

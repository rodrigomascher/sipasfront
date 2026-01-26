import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { GenericFormComponent } from '../../../../shared/components/generic-form/generic-form.component';
import { FormFieldConfig } from '../../../../shared/components/generic-form/form-field-config';
import * as Actions from '../../store/income-types.actions';
import * as Selectors from '../../store/income-types.selectors';

@Component({
  selector: 'app-income-types-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, GenericFormComponent],
  template: `
    <app-generic-form
      [title]="title"
      [fields]="fields"
      [form]="form"
      backRoute="/income-types"
      [submitLabel]="isEditMode ? 'Atualizar' : 'Salvar'"
      [loading$]="loading$"
      [error$]="error$"
      (submit)="onSubmit($event)"
    ></app-generic-form>
  `
})
export class IncomeTypesFormComponent implements OnInit {
  isEditMode = false;
  title = 'Novo Tipo de Renda';
  form!: FormGroup;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  fields: FormFieldConfig[] = [
    {
      name: 'description',
      label: 'Descrição',
      type: 'text',
      placeholder: 'Ex: Salário, Aposentadoria, Benefício Social',
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
    private store: Store<{ incomeTypes: any }>,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.loading$ = this.store.select(Selectors.selectIncomeTypesLoading);
    this.error$ = this.store.select(Selectors.selectIncomeTypesError);
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
        this.title = 'Editar Tipo de Renda';
        this.itemId = +params['id'];
        this.store.dispatch(Actions.loadIncomeTypeById({ id: this.itemId }));
        this.store.select(Selectors.selectSelectedIncomeType).subscribe(incomeType => {
          if (incomeType) {
            this.form.patchValue({
              description: incomeType.description,
              active: incomeType.active
            });
          }
        });
      }
    });
  }

  onSubmit(formValue: any): void {
    // Ignore if it's a SubmitEvent instead of form data
    if (formValue instanceof SubmitEvent) {
      console.warn('[IncomeTypesFormComponent] Received SubmitEvent instead of form data, ignoring');
      return;
    }
    
    if (this.isEditMode && this.itemId) {
      this.store.dispatch(Actions.updateIncomeType({ id: this.itemId, incomeType: formValue }));
    } else {
      this.store.dispatch(Actions.createIncomeType({ incomeType: formValue }));
    }

    setTimeout(() => {
      this.router.navigate(['/income-types']);
    }, 1000);
  }
}

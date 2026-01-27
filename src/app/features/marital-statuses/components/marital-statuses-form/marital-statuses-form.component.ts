import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { GenericFormComponent } from '../../../../shared/components/generic-form/generic-form.component';
import { FormFieldConfig } from '../../../../shared/components/generic-form/form-field-config';
import * as Actions from '../../store/marital-statuses.actions';
import * as Selectors from '../../store/marital-statuses.selectors';

@Component({
  selector: 'app-marital-statuses-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, GenericFormComponent],
  template: `
    <app-generic-form
      [title]="title"
      [fields]="fields"
      [form]="form"
      backRoute="/marital-statuses"
      [submitLabel]="isEditMode ? 'Atualizar' : 'Salvar'"
      [loading$]="loading$"
      [error$]="error$"
      (submit)="onSubmit($event)"
    ></app-generic-form>
  `
})
export class MaritalStatusesFormComponent implements OnInit {
  isEditMode = false;
  title = 'Novo Estado Civil';
  form!: FormGroup;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  fields: FormFieldConfig[] = [
    {
      name: 'description',
      label: 'Descrição',
      type: 'text',
      placeholder: 'Ex: Solteiro(a), Casado(a), Divorciado(a)',
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
    private store: Store<{ maritalStatuses: any }>,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.loading$ = this.store.select(Selectors.selectMaritalStatusesLoading);
    this.error$ = this.store.select(Selectors.selectMaritalStatusesError);
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
        this.title = 'Editar Estado Civil';
        this.itemId = +params['id'];
        this.store.dispatch(Actions.loadMaritalStatusById({ id: this.itemId }));
        this.store.select(Selectors.selectSelectedMaritalStatus).subscribe(maritalStatus => {
          if (maritalStatus) {
            this.form.patchValue({
              description: maritalStatus.description,
              active: maritalStatus.active
            });
          }
        });
      }
    });
  }

  onSubmit(formValue: any): void {
    // Ignore if it's a SubmitEvent instead of form data
    if (formValue instanceof SubmitEvent) {
      console.warn('[MaritalStatusesFormComponent] Received SubmitEvent instead of form data, ignoring');
      return;
    }
    
    if (this.isEditMode && this.itemId) {
      this.store.dispatch(Actions.updateMaritalStatus({ id: this.itemId, maritalStatus: formValue }));
    } else {
      this.store.dispatch(Actions.createMaritalStatus({ maritalStatus: formValue }));
    }

    setTimeout(() => {
      this.router.navigate(['/marital-statuses']);
    }, 1000);
  }
}

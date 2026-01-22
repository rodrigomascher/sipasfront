import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { GenericFormComponent } from '../../../../shared/components/generic-form/generic-form.component';
import { FormFieldConfig } from '../../../../shared/components/generic-form/form-field-config';
import * as Actions from '../../store/sexual-orientations.actions';
import * as Selectors from '../../store/sexual-orientations.selectors';

@Component({
  selector: 'app-sexual-orientations-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, GenericFormComponent],
  template: `
    <app-generic-form
      [title]="title"
      [fields]="fields"
      [form]="form"
      backRoute="/sexual-orientations"
      [submitLabel]="isEditMode ? 'Atualizar' : 'Salvar'"
      [loading$]="loading$"
      [error$]="error$"
      (submit)="onSubmit($event)"
    ></app-generic-form>
  `
})
export class SexualOrientationsFormComponent implements OnInit {
  isEditMode = false;
  title = 'Nova Orientação Sexual';
  form!: FormGroup;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  fields: FormFieldConfig[] = [
    {
      name: 'description',
      label: 'Descrição',
      type: 'text',
      placeholder: 'Ex: Heterossexual, Homossexual',
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
    private store: Store<{ sexualOrientations: any }>,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.loading$ = this.store.select(Selectors.selectSexualOrientationsLoading);
    this.error$ = this.store.select(Selectors.selectSexualOrientationsError);
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
        this.title = 'Editar Orientação Sexual';
        this.itemId = +params['id'];
        this.store.select(Selectors.selectAllSexualOrientations).subscribe(items => {
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
    // Ignore if it's a SubmitEvent instead of form data
    if (formValue instanceof SubmitEvent) {
      console.warn('[SexualOrientationsFormComponent] Received SubmitEvent instead of form data, ignoring');
      return;
    }
    
    if (this.isEditMode && this.itemId) {
      this.store.dispatch(Actions.updateSexualOrientation({ id: this.itemId, sexualOrientation: formValue }));
    } else {
      this.store.dispatch(Actions.createSexualOrientation({ sexualOrientation: formValue }));
    }

    setTimeout(() => {
      this.router.navigate(['/sexual-orientations']);
    }, 1000);
  }
}

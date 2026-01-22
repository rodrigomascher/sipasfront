import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { GenericFormComponent } from '../../../../shared/components/generic-form/generic-form.component';
import { FormFieldConfig } from '../../../../shared/components/generic-form/form-field-config';
import * as Actions from '../../store/genders.actions';
import * as Selectors from '../../store/genders.selectors';

@Component({
  selector: 'app-genders-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, GenericFormComponent],
  template: `
    <app-generic-form
      [title]="title"
      [fields]="fields"
      [form]="form"
      backRoute="/genders"
      [submitLabel]="isEditMode ? 'Atualizar' : 'Salvar'"
      [loading$]="loading$"
      [error$]="error$"
      (submit)="onSubmit($event)"
    ></app-generic-form>
  `
})
export class GendersFormComponent implements OnInit {
  isEditMode = false;
  title = 'Novo Gênero';
  form!: FormGroup;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  fields: FormFieldConfig[] = [
    {
      name: 'description',
      label: 'Descrição',
      type: 'text',
      placeholder: 'Ex: Masculino, Feminino',
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
    private store: Store<{ genders: any }>,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.loading$ = this.store.select(Selectors.selectGendersLoading);
    this.error$ = this.store.select(Selectors.selectGendersError);
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
        this.title = 'Editar Gênero';
        this.itemId = +params['id'];
        this.store.dispatch(Actions.loadGenderById({ id: this.itemId }));
        this.store.select(Selectors.selectSelectedGender).subscribe(gender => {
          if (gender) {
            this.form.patchValue({
              description: gender.description,
              active: gender.active
            });
          }
        });
      }
    });
  }

  onSubmit(formValue: any): void {
    // Ignore if it's a SubmitEvent instead of form data
    if (formValue instanceof SubmitEvent) {
      console.warn('[GendersFormComponent] Received SubmitEvent instead of form data, ignoring');
      return;
    }
    
    if (this.isEditMode && this.itemId) {
      this.store.dispatch(Actions.updateGender({ id: this.itemId, gender: formValue }));
    } else {
      this.store.dispatch(Actions.createGender({ gender: formValue }));
    }

    setTimeout(() => {
      this.router.navigate(['/genders']);
    }, 1000);
  }
}

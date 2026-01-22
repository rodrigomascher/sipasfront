import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { GenericFormComponent } from '../../../../shared/components/generic-form/generic-form.component';
import { FormFieldConfig } from '../../../../shared/components/generic-form/form-field-config';
import * as RelationshipDegreeActions from '../../../../store/relationship-degree/relationship-degree.actions';

@Component({
  selector: 'app-relationship-degree-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, GenericFormComponent],
  template: `
    <app-generic-form
      [title]="title"
      [fields]="fields"
      [form]="form"
      backRoute="/relationship-degrees"
      [submitLabel]="isEdit ? 'Atualizar' : 'Salvar'"
      [loading$]="loading$"
      [error$]="error$"
      (submit)="onSubmit($event)"
    ></app-generic-form>
  `
})
export class RelationshipDegreeFormComponent implements OnInit {
  isEdit = false;
  title = 'Novo Grau de Parentesco';
  form!: FormGroup;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  fields: FormFieldConfig[] = [
    {
      name: 'description',
      label: 'Descrição',
      type: 'text',
      placeholder: 'Ex: Pai/Mãe, Cônjuge, Filho(a)',
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
    private store: Store<{ relationshipDegrees: any }>,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.loading$ = this.store.select(state => state.relationshipDegrees?.loading || false);
    this.error$ = this.store.select(state => state.relationshipDegrees?.error || null);
    this.form = this.createForm();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      description: ['', [Validators.required, Validators.minLength(2)]],
      active: [true]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEdit = true;
      this.title = 'Editar Grau de Parentesco';
      this.itemId = +id;
      this.store.select(state => state.relationshipDegrees?.relationshipDegrees || []).subscribe(items => {
        const item = items.find((x: any) => x.id === +id!);
        if (item) {
          this.form.patchValue({
            description: item.description,
            active: item.active
          });
        }
      });
    }
  }

  onSubmit(formValue: any): void {    // Ignore if it's a SubmitEvent instead of form data
    if (formValue instanceof SubmitEvent) {
      console.warn('[RelationshipDegreeFormComponent] Received SubmitEvent instead of form data, ignoring');
      return;
    }
        if (this.isEdit && this.itemId) {
      this.store.dispatch(RelationshipDegreeActions.updateRelationshipDegree({
        id: this.itemId,
        relationshipDegree: formValue
      }));
    } else {
      this.store.dispatch(RelationshipDegreeActions.createRelationshipDegree({
        relationshipDegree: formValue
      }));
    }

    setTimeout(() => {
      this.router.navigate(['/relationship-degrees']);
    }, 1000);
  }
}

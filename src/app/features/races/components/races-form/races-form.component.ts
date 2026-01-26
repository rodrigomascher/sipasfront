import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { GenericFormComponent } from '../../../../shared/components/generic-form/generic-form.component';
import { FormFieldConfig } from '../../../../shared/components/generic-form/form-field-config';
import * as Actions from '../../store/races.actions';
import * as Selectors from '../../store/races.selectors';

@Component({
  selector: 'app-races-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, GenericFormComponent],
  template: `
    <app-generic-form
      [title]="title"
      [fields]="fields"
      [form]="form"
      backRoute="/races"
      [submitLabel]="isEditMode ? 'Atualizar' : 'Salvar'"
      [loading$]="loading$"
      [error$]="error$"
      (submit)="onSubmit($event)"
    ></app-generic-form>
  `
})
export class RacesFormComponent implements OnInit {
  isEditMode = false;
  title = 'Nova Raça/Cor';
  form!: FormGroup;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  fields: FormFieldConfig[] = [
    {
      name: 'description',
      label: 'Descrição',
      type: 'text',
      placeholder: 'Ex: Branca, Preta, Parda',
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
    private store: Store<{ races: any }>,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.loading$ = this.store.select(Selectors.selectRacesLoading);
    this.error$ = this.store.select(Selectors.selectRacesError);
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
        this.title = 'Editar Raça/Cor';
        this.itemId = +params['id'];
        this.store.dispatch(Actions.loadRaceById({ id: this.itemId }));
        this.store.select(Selectors.selectSelectedRace).subscribe(race => {
          if (race) {
            this.form.patchValue({
              description: race.description,
              active: race.active
            });
          }
        });
      }
    });
  }

  onSubmit(formValue: any): void {
    // Ignore if it's a SubmitEvent instead of form data
    if (formValue instanceof SubmitEvent) {
      console.warn('[RacesFormComponent] Received SubmitEvent instead of form data, ignoring');
      return;
    }
    
    if (this.isEditMode && this.itemId) {
      this.store.dispatch(Actions.updateRace({ id: this.itemId, race: formValue }));
    } else {
      this.store.dispatch(Actions.createRace({ race: formValue }));
    }

    setTimeout(() => {
      this.router.navigate(['/races']);
    }, 1000);
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CreateUnitDto, UpdateUnitDto } from '../../../core/services/units.service';
import { GenericFormComponent } from '../../../shared/components/generic-form/generic-form.component';
import { FormFieldConfig } from '../../../shared/components/generic-form/form-field-config';
import * as UnitsActions from '../../../store/units/units.actions';
import * as UnitsSelectors from '../../../store/units/units.selectors';

@Component({
  selector: 'app-units-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, GenericFormComponent],
  template: `
    <app-generic-form
      [title]="title"
      [fields]="fields"
      [form]="form"
      backRoute="/units"
      [submitLabel]="isEdit ? 'Atualizar' : 'Salvar'"
      [loading$]="loading$"
      [error$]="error$"
      (submit)="onSubmit($event)"
    ></app-generic-form>
  `
})
export class UnitsFormComponent implements OnInit {
  isEdit = false;
  title = 'Nova Unidade';
  form!: FormGroup;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  fields: FormFieldConfig[] = [
    {
      name: 'name',
      label: 'Nome da Unidade',
      type: 'text',
      placeholder: 'Ex: Unidade Centro',
      required: true,
      colSpan: 2
    },
    {
      name: 'type',
      label: 'Tipo',
      type: 'select',
      required: true,
      options: [
        { label: 'Posto', value: 'Posto' },
        { label: 'Centro', value: 'Centro' },
        { label: 'Clínica', value: 'Clínica' },
        { label: 'Hospital', value: 'Hospital' }
      ]
    },
    {
      name: 'city',
      label: 'Cidade',
      type: 'text',
      placeholder: 'São Paulo',
      required: true
    },
    {
      name: 'state',
      label: 'Estado (UF)',
      type: 'text',
      placeholder: 'SP',
      required: true,
      maxLength: 2
    },
    {
      name: 'isArmored',
      label: 'Unidade Blindada',
      type: 'checkbox'
    }
  ];

  private unitId: number | null = null;

  constructor(
    private store: Store<{ units: any }>,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.loading$ = this.store.select(UnitsSelectors.selectUnitsLoading);
    this.error$ = this.store.select(UnitsSelectors.selectUnitsError);
    this.form = this.createForm();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      type: ['', Validators.required],
      city: ['', [Validators.required, Validators.minLength(2)]],
      state: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
      isArmored: [false]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.title = 'Editar Unidade';
        this.unitId = +params['id'];

        this.store.dispatch(UnitsActions.loadUnitById({ id: this.unitId }));
        this.store.select(UnitsSelectors.selectSelectedUnit).subscribe(unit => {
          if (unit) {
            this.form.patchValue({
              name: unit.name,
              type: unit.type,
              city: unit.city,
              state: unit.state,
              isArmored: unit.isArmored
            });
          }
        });
      }
    });
  }

  onSubmit(formValue: any): void {
    console.log('[UnitsFormComponent] onSubmit called with:', formValue);
    
    // Ignore if it's a SubmitEvent instead of form data
    if (formValue instanceof SubmitEvent) {
      console.warn('[UnitsFormComponent] Received SubmitEvent instead of form data, ignoring');
      return;
    }
    
    console.log('[UnitsFormComponent] formValue keys:', Object.keys(formValue));
    
    if (this.isEdit && this.unitId) {
      const updateDto: UpdateUnitDto = formValue;
      this.store.dispatch(UnitsActions.updateUnit({ id: this.unitId, unit: updateDto }));
    } else {
      const createDto: CreateUnitDto = formValue;
      this.store.dispatch(UnitsActions.createUnit({ unit: createDto }));
    }

    setTimeout(() => {
      this.router.navigate(['/units']);
    }, 1000);
  }
}

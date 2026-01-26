import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Person } from '../../../../core/services/persons.service';
import * as PersonsActions from '../../store/persons.actions';
import * as PersonsSelectors from '../../store/persons.selectors';
import * as GendersActions from '../../../genders/store/genders.actions';
import * as GenderIdentitiesActions from '../../../gender-identities/store/gender-identities.actions';
import * as SexualOrientationsActions from '../../../sexual-orientations/store/sexual-orientations.actions';
import * as RacesActions from '../../../races/store/races.actions';
import { TabbedFormComponent, TabConfig } from '../../../../shared/components/tabbed-form/tabbed-form.component';
import { FormFieldConfig } from '../../../../shared/components/generic-form/form-field-config';

@Component({
  selector: 'app-persons-form',
  standalone: true,
  imports: [ReactiveFormsModule, TabbedFormComponent],
  template: `
    <app-tabbed-form
      [title]="isEditMode ? 'Editar Munícipe' : 'Novo Munícipe'"
      [tabs]="tabs"
      [form]="form"
      backRoute="/persons"
      [loading$]="loading$"
      [error$]="error$"
      [isEditMode]="isEditMode"
      (submit)="onSubmit($event)"
    ></app-tabbed-form>
  `
})
export class PersonsFormComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;
  personId: number | null = null;
  loading$: Observable<boolean>;
  error$: Observable<any>;
  genders$: Observable<any[]>;
  genderIdentities$: Observable<any[]>;
  sexualOrientations$: Observable<any[]>;
  races$: Observable<any[]>;

  tabs: TabConfig[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store
  ) {
    this.form = this.createForm();
    this.loading$ = this.store.select(state => (state as any).persons?.loading || false);
    this.error$ = this.store.select(state => (state as any).persons?.error || null);
    this.genders$ = this.store.select(state => (state as any).genders?.genders || []);
    this.genderIdentities$ = this.store.select(state => (state as any).genderIdentities?.genderIdentities || []);
    this.sexualOrientations$ = this.store.select(state => (state as any).sexualOrientations?.sexualOrientations || []);
    this.races$ = this.store.select(state => (state as any).races?.races || []);
  }

  private createForm(): FormGroup {
    return this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      birthDate: ['', Validators.required],
      fullName: [''],
      socialName: [''],
      sex: [''],
      genderId: [''],
      genderIdentityId: [''],
      sexualOrientation: [''],
      raceId: [''],
      ethnicityId: [''],
      communityId: [''],
      maritalStatusId: [''],
      nationality: [''],
      originCountryId: [''],
      arrivalDateBrazil: [''],
      motherPersonId: [''],
      fatherPersonId: [''],
      motherResidenceOrder: [''],
      fatherResidenceOrder: [''],
      cpf: [''],
      nis: [''],
      nisn: [''],
      susNumber: [''],
      rg: [''],
      rgIssuanceDate: [''],
      rgStateAbbr: [''],
      rgIssuingOrgId: [''],
      rgComplementary: [''],
      certStandardNew: [1],
      certTermNumber: [''],
      certBook: [''],
      certPage: [''],
      certIssuanceDate: [''],
      certStateAbbr: [''],
      certRegistry: [''],
      certYear: [''],
      certIssuingOrg: [''],
      birthCity: [''],
      birthSubdistrict: [''],
      voterIdNumber: [''],
      voterIdZone: [''],
      voterIdSection: [''],
      voterIdIssuanceDate: [''],
      profCardNumber: [''],
      profCardSeries: [''],
      profCardIssuanceDate: [''],
      profCardState: [''],
      militaryRegistration: [''],
      militaryIssuanceDate: [''],
      militaryReserveNumber: [''],
      incomeTypeId: [''],
      monthlyIncome: [''],
      annualIncome: [''],
      educationLevelId: [''],
      schoolName: [''],
      completionYear: [''],
      currentlyStudying: [''],
      deceased: [''],
      deathCertIssuanceDate: [''],
      deathCity: [''],
      cemetery: [''],
      notes: [''],
      createdUnitId: [''],
      referredUnitId: [''],
    });
  }

  ngOnInit(): void {
    this.initializeTabs();
    this.store.dispatch(PersonsActions.loadPersons({}));
    this.store.dispatch(GendersActions.loadGenders({ params: {} }));
    this.store.dispatch(GenderIdentitiesActions.loadGenderIdentities({ params: {} }));
    this.store.dispatch(SexualOrientationsActions.loadSexualOrientations({ params: {} }));
    this.store.dispatch(RacesActions.loadRaces({ params: {} }));

    // Subscribe to races and update the field options
    this.races$.subscribe(races => {
      const raceField = this.tabs[0].fields.find(f => f.name === 'raceId');
      if (raceField) {
        raceField.options = races.map(race => ({ label: race.description, value: race.id }));
      }
    });

    // Subscribe to genders and update the field options
    this.genders$.subscribe(genders => {
      const genderField = this.tabs[0].fields.find(f => f.name === 'genderId');
      if (genderField) {
        genderField.options = genders.map(gender => ({ label: gender.description, value: gender.id }));
      }
    });

    // Subscribe to gender identities and update the field options
    this.genderIdentities$.subscribe(identities => {
      const identityField = this.tabs[0].fields.find(f => f.name === 'genderIdentityId');
      if (identityField) {
        identityField.options = identities.map(identity => ({ label: identity.description, value: identity.id }));
      }
    });

    // Subscribe to sexual orientations and update the field options
    this.sexualOrientations$.subscribe(orientations => {
      const orientationField = this.tabs[0].fields.find(f => f.name === 'sexualOrientation');
      if (orientationField) {
        orientationField.options = orientations.map(orientation => ({ label: orientation.description, value: orientation.id }));
      }
    });

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.personId = parseInt(params['id'], 10);
        this.store.dispatch(PersonsActions.loadPersonById({ id: this.personId }));

        this.store.select(PersonsSelectors.selectSelectedPerson).subscribe(person => {
          if (person) {
            this.form.patchValue(person);
          }
        });
      }
    });
  }

  private initializeTabs(): void {
    this.tabs = [
      {
        title: 'Dados Básicos',
        fields: [
          {
            name: 'firstName',
            label: 'Nome',
            type: 'text',
            placeholder: 'Nome',
            required: true,
            colSpan: 1
          },
          {
            name: 'lastName',
            label: 'Sobrenome',
            type: 'text',
            placeholder: 'Sobrenome',
            required: true,
            colSpan: 1
          },
          {
            name: 'birthDate',
            label: 'Data de Nascimento',
            type: 'date',
            required: true,
            colSpan: 1
          },
          {
            name: 'sex',
            label: 'Sexo',
            type: 'select',
            options: [
              { label: 'Selecione...', value: '' },
              { label: 'Masculino', value: '1' },
              { label: 'Feminino', value: '2' }
            ],
            colSpan: 1
          },
          {
            name: 'genderId',
            label: 'Gênero',
            type: 'select',
            options: [],
            colSpan: 1
          },
          {
            name: 'genderIdentityId',
            label: 'Identidade de Gênero',
            type: 'select',
            options: [],
            colSpan: 1
          },
          {
            name: 'sexualOrientation',
            label: 'Orientação Sexual',
            type: 'select',
            options: [],
            colSpan: 1
          },
          {
            name: 'raceId',
            label: 'Raça/Cor',
            type: 'select',
            options: [],
            colSpan: 1
          },
          {
            name: 'motherPersonId',
            label: 'Mãe (Munícipe)',
            type: 'select',
            options: [],
            colSpan: 2
          },
          {
            name: 'fatherPersonId',
            label: 'Pai (Munícipe)',
            type: 'select',
            options: [],
            colSpan: 2
          }
        ]
      },
      {
        title: 'Documentação',
        fields: [
          {
            name: 'cpf',
            label: 'CPF',
            type: 'text',
            placeholder: '999.999.999-99',
            colSpan: 1
          },
          {
            name: 'nis',
            label: 'NIS',
            type: 'number',
            placeholder: 'NIS',
            colSpan: 1
          },
          {
            name: 'nisn',
            label: 'NISN',
            type: 'text',
            placeholder: 'NISN',
            colSpan: 1
          },
          {
            name: 'susNumber',
            label: 'Nº SUS',
            type: 'number',
            placeholder: 'Número SUS',
            colSpan: 1
          },
          {
            name: 'rg',
            label: 'RG',
            type: 'text',
            placeholder: 'RG',
            colSpan: 1
          },
          {
            name: 'rgIssuanceDate',
            label: 'Data de Expedição RG',
            type: 'date',
            colSpan: 1
          },
          {
            name: 'rgStateAbbr',
            label: 'UF RG',
            type: 'text',
            placeholder: 'UF',
            maxLength: 2,
            colSpan: 1
          }
        ]
      },
      {
        title: 'Certidão',
        fields: [
          {
            name: 'certTermNumber',
            label: 'Nº Termo',
            type: 'text',
            placeholder: 'Número do Termo',
            colSpan: 1
          },
          {
            name: 'certBook',
            label: 'Livro',
            type: 'text',
            placeholder: 'Livro',
            colSpan: 1
          },
          {
            name: 'certPage',
            label: 'Folha',
            type: 'text',
            placeholder: 'Folha',
            colSpan: 1
          },
          {
            name: 'certIssuanceDate',
            label: 'Data de Emissão',
            type: 'date',
            colSpan: 1
          },
          {
            name: 'certStateAbbr',
            label: 'UF Certidão',
            type: 'text',
            placeholder: 'UF',
            maxLength: 2,
            colSpan: 1
          },
          {
            name: 'birthCity',
            label: 'Cidade Nascimento',
            type: 'text',
            placeholder: 'Cidade',
            colSpan: 2
          },
          {
            name: 'birthSubdistrict',
            label: 'Subdistrito',
            type: 'text',
            placeholder: 'Subdistrito',
            colSpan: 2
          }
        ]
      },
      {
        title: 'Títulos',
        fields: [
          {
            name: 'voterIdNumber',
            label: 'Título Eleitor - Número',
            type: 'text',
            placeholder: 'Número Título',
            colSpan: 1
          },
          {
            name: 'voterIdZone',
            label: 'Zona',
            type: 'text',
            placeholder: 'Zona',
            colSpan: 1
          },
          {
            name: 'voterIdSection',
            label: 'Seção',
            type: 'text',
            placeholder: 'Seção',
            colSpan: 1
          },
          {
            name: 'profCardNumber',
            label: 'Carteira Prof. - Número',
            type: 'text',
            placeholder: 'Número Carteira',
            colSpan: 1
          },
          {
            name: 'profCardSeries',
            label: 'Série',
            type: 'text',
            placeholder: 'Série',
            colSpan: 1
          },
          {
            name: 'profCardIssuanceDate',
            label: 'Data Expedição',
            type: 'date',
            colSpan: 1
          },
          {
            name: 'militaryRegistration',
            label: 'Alistamento Militar',
            type: 'text',
            placeholder: 'Nº Alistamento',
            colSpan: 2
          },
          {
            name: 'militaryReserveNumber',
            label: 'Nº Certificado Reservista',
            type: 'text',
            placeholder: 'Nº Reservista',
            colSpan: 2
          }
        ]
      },
      {
        title: 'Complementar',
        fields: [
          {
            name: 'ethnicityId',
            label: 'Etnia',
            type: 'text',
            placeholder: 'ID Etnia',
            colSpan: 1
          },
          {
            name: 'maritalStatusId',
            label: 'Estado Civil',
            type: 'text',
            placeholder: 'ID Estado Civil',
            colSpan: 1
          },
          {
            name: 'nationality',
            label: 'Nacionalidade',
            type: 'text',
            placeholder: 'ID Nacionalidade',
            colSpan: 1
          },
          {
            name: 'deceased',
            label: 'Falecido',
            type: 'select',
            options: [
              { label: 'Selecione...', value: '' },
              { label: 'Não', value: '0' },
              { label: 'Sim', value: '1' }
            ],
            colSpan: 1
          },
          {
            name: 'deathCity',
            label: 'Cidade Óbito',
            type: 'text',
            placeholder: 'Cidade',
            colSpan: 1
          },
          {
            name: 'cemetery',
            label: 'Cemitério',
            type: 'text',
            placeholder: 'Cemitério',
            colSpan: 2
          }
        ]
      },
      {
        title: 'Renda',
        fields: [
          {
            name: 'incomeTypeId',
            label: 'Tipo de Renda',
            type: 'text',
            placeholder: 'ID Tipo Renda',
            colSpan: 1
          },
          {
            name: 'monthlyIncome',
            label: 'Renda Mensal',
            type: 'number',
            placeholder: 'Renda Mensal',
            colSpan: 1
          },
          {
            name: 'annualIncome',
            label: 'Renda Anual',
            type: 'number',
            placeholder: 'Renda Anual',
            colSpan: 1
          }
        ]
      },
      {
        title: 'Escolaridade',
        fields: [
          {
            name: 'educationLevelId',
            label: 'Nível de Educação',
            type: 'text',
            placeholder: 'ID Nível Educação',
            colSpan: 1
          },
          {
            name: 'schoolName',
            label: 'Escola',
            type: 'text',
            placeholder: 'Nome da Escola',
            colSpan: 2
          },
          {
            name: 'completionYear',
            label: 'Ano de Conclusão',
            type: 'number',
            placeholder: 'Ano',
            min: 1900,
            max: 2099,
            colSpan: 1
          },
          {
            name: 'currentlyStudying',
            label: 'Estudando Atualmente',
            type: 'select',
            options: [
              { label: 'Selecione...', value: '' },
              { label: 'Não', value: '0' },
              { label: 'Sim', value: '1' }
            ],
            colSpan: 1
          }
        ]
      },
      {
        title: 'Obs. Gerais',
        fields: [
          {
            name: 'notes',
            label: 'Observações',
            type: 'textarea',
            placeholder: 'Observações gerais',
            colSpan: 4
          }
        ]
      }
    ];
  }

  onSubmit(formValue: any): void {
    // Ignore if it's a SubmitEvent instead of form data
    if (formValue instanceof SubmitEvent) {
      console.warn('[PersonsFormComponent] Received SubmitEvent instead of form data, ignoring');
      return;
    }
    
    if (this.form.invalid) {
      return;
    }

    if (this.isEditMode && this.personId) {
      this.store.dispatch(PersonsActions.updatePerson({ id: this.personId, person: formValue }));
    } else {
      this.store.dispatch(PersonsActions.createPerson({ person: formValue }));
    }

    setTimeout(() => {
      this.router.navigate(['/persons']);
    }, 1000);
  }
}

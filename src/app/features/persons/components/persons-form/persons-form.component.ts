import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Person } from '../../../../core/services/persons.service';
import * as PersonsActions from '../../store/persons.actions';
import * as PersonsSelectors from '../../store/persons.selectors';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-persons-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LoadingSpinnerComponent],
  template: `
    <div class="container">
      <div class="header">
        <h2>{{ isEditMode ? 'Editar' : 'Novo' }} Munícipe</h2>
      </div>

      <app-loading-spinner
        *ngIf="loading$ | async"
        message="Carregando..."
      ></app-loading-spinner>

      <div *ngIf="error$ | async as error" class="alert alert-error">
        Erro: {{ error }}
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" *ngIf="!(loading$ | async)">
        <!-- Tab Navigation -->
        <div class="tabs">
          <button
            *ngFor="let tab of tabs; let i = index"
            type="button"
            [class.active]="selectedTab === i"
            (click)="selectedTab = i"
            class="tab-button"
          >
            {{ tab }}
          </button>
        </div>

        <!-- Tab 1: Dados Básicos -->
        <div class="tab-content" *ngIf="selectedTab === 0">
          <div class="form-group">
            <label>Nome *</label>
            <input type="text" formControlName="firstName" placeholder="Nome" />
            <span class="error" *ngIf="form.get('firstName')?.invalid && form.get('firstName')?.touched">
              Nome é obrigatório (mín. 3 caracteres)
            </span>
          </div>

          <div class="form-group">
            <label>Sobrenome *</label>
            <input type="text" formControlName="lastName" placeholder="Sobrenome" />
            <span class="error" *ngIf="form.get('lastName')?.invalid && form.get('lastName')?.touched">
              Sobrenome é obrigatório (mín. 3 caracteres)
            </span>
          </div>

          <div class="form-group">
            <label>Data de Nascimento *</label>
            <input type="date" formControlName="birthDate" />
            <span class="error" *ngIf="form.get('birthDate')?.invalid && form.get('birthDate')?.touched">
              Data de nascimento é obrigatória
            </span>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Apelido</label>
              <input type="text" formControlName="nickname" placeholder="Apelido" />
            </div>

            <div class="form-group">
              <label>Sexo</label>
              <select formControlName="sex">
                <option value="">Selecione...</option>
                <option value="1">Masculino</option>
                <option value="2">Feminino</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Gênero</label>
              <input type="text" formControlName="genderId" placeholder="ID do Gênero" />
            </div>

            <div class="form-group">
              <label>Identidade de Gênero</label>
              <input type="text" formControlName="genderIdentityId" placeholder="ID da Identidade de Gênero" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Mãe (Munícipe)</label>
              <select formControlName="motherPersonId">
                <option value="">Vincular a outro munícipe...</option>
                <option *ngFor="let person of (persons$ | async)" [value]="person.id">
                  {{ person.firstName }} {{ person.lastName }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label>Pai (Munícipe)</label>
              <select formControlName="fatherPersonId">
                <option value="">Vincular a outro munícipe...</option>
                <option *ngFor="let person of (persons$ | async)" [value]="person.id">
                  {{ person.firstName }} {{ person.lastName }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- Tab 2: Documentação -->
        <div class="tab-content" *ngIf="selectedTab === 1">
          <div class="form-group">
            <label>CPF</label>
            <input type="text" formControlName="cpf" placeholder="999.999.999-99" />
            <span class="error" *ngIf="form.get('cpf')?.invalid && form.get('cpf')?.touched">
              CPF inválido
            </span>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>NIS</label>
              <input type="number" formControlName="nis" placeholder="NIS" />
            </div>

            <div class="form-group">
              <label>NISN</label>
              <input type="text" formControlName="nisn" placeholder="NISN" />
            </div>

            <div class="form-group">
              <label>Nº SUS</label>
              <input type="number" formControlName="susNumber" placeholder="Número SUS" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>RG</label>
              <input type="text" formControlName="rg" placeholder="RG" />
            </div>

            <div class="form-group">
              <label>Data de Expedição RG</label>
              <input type="date" formControlName="rgIssuanceDate" />
            </div>

            <div class="form-group">
              <label>UF RG</label>
              <input type="text" formControlName="rgStateAbbr" placeholder="UF" maxlength="2" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>RG Mãe</label>
              <input type="text" formControlName="motherRg" placeholder="RG da Mãe" />
            </div>

            <div class="form-group">
              <label>RG Pai</label>
              <input type="text" formControlName="fatherRg" placeholder="RG do Pai" />
            </div>
          </div>
        </div>

        <!-- Tab 3: Certidão -->
        <div class="tab-content" *ngIf="selectedTab === 2">
          <div class="form-row">
            <div class="form-group">
              <label>Nº Termo</label>
              <input type="text" formControlName="certTermNumber" placeholder="Número do Termo" />
            </div>

            <div class="form-group">
              <label>Livro</label>
              <input type="text" formControlName="certBook" placeholder="Livro" />
            </div>

            <div class="form-group">
              <label>Folha</label>
              <input type="text" formControlName="certPage" placeholder="Folha" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Data de Emissão</label>
              <input type="date" formControlName="certIssuanceDate" />
            </div>

            <div class="form-group">
              <label>UF Certidão</label>
              <input type="text" formControlName="certStateAbbr" placeholder="UF" maxlength="2" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Cidade Nascimento</label>
              <input type="text" formControlName="birthCity" placeholder="Cidade" />
            </div>

            <div class="form-group">
              <label>Subdistrito</label>
              <input type="text" formControlName="birthSubdistrict" placeholder="Subdistrito" />
            </div>
          </div>
        </div>

        <!-- Tab 4: Títulos -->
        <div class="tab-content" *ngIf="selectedTab === 3">
          <h3>Título Eleitor</h3>
          <div class="form-row">
            <div class="form-group">
              <label>Número</label>
              <input type="text" formControlName="voterIdNumber" placeholder="Número Título" />
            </div>

            <div class="form-group">
              <label>Zona</label>
              <input type="text" formControlName="voterIdZone" placeholder="Zona" />
            </div>

            <div class="form-group">
              <label>Seção</label>
              <input type="text" formControlName="voterIdSection" placeholder="Seção" />
            </div>
          </div>

          <h3>Carteira Profissional</h3>
          <div class="form-row">
            <div class="form-group">
              <label>Número</label>
              <input type="text" formControlName="profCardNumber" placeholder="Número Carteira" />
            </div>

            <div class="form-group">
              <label>Série</label>
              <input type="text" formControlName="profCardSeries" placeholder="Série" />
            </div>

            <div class="form-group">
              <label>Data Expedição</label>
              <input type="date" formControlName="profCardIssuanceDate" />
            </div>
          </div>

          <h3>Documento Militar</h3>
          <div class="form-row">
            <div class="form-group">
              <label>Alistamento Militar</label>
              <input type="text" formControlName="militaryRegistration" placeholder="Nº Alistamento" />
            </div>

            <div class="form-group">
              <label>Nº Certificado Reservista</label>
              <input type="text" formControlName="militaryReserveNumber" placeholder="Nº Reservista" />
            </div>
          </div>
        </div>

        <!-- Tab 5: Complementar -->
        <div class="tab-content" *ngIf="selectedTab === 4">
          <div class="form-row">
            <div class="form-group">
              <label>Orientação Sexual</label>
              <select formControlName="sexualOrientation">
                <option value="">Selecione...</option>
                <option value="H">Heterossexual</option>
                <option value="G">Gay</option>
                <option value="L">Lésbica</option>
                <option value="B">Bissexual</option>
                <option value="O">Outro</option>
              </select>
            </div>

            <div class="form-group">
              <label>Raça/Cor</label>
              <input type="text" formControlName="raceId" placeholder="ID Raça/Cor" />
            </div>

            <div class="form-group">
              <label>Etnia</label>
              <input type="text" formControlName="ethnicityId" placeholder="ID Etnia" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Estado Civil</label>
              <input type="text" formControlName="maritalStatusId" placeholder="ID Estado Civil" />
            </div>

            <div class="form-group">
              <label>Nacionalidade</label>
              <input type="text" formControlName="nationality" placeholder="ID Nacionalidade" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Falecido</label>
              <select formControlName="deceased">
                <option value="">Selecione...</option>
                <option value="0">Não</option>
                <option value="1">Sim</option>
              </select>
            </div>

            <div class="form-group">
              <label>Cidade Óbito</label>
              <input type="text" formControlName="deathCity" placeholder="Cidade" />
            </div>

            <div class="form-group">
              <label>Cemitério</label>
              <input type="text" formControlName="cemetery" placeholder="Cemitério" />
            </div>
          </div>
        </div>

        <!-- Tab 6: Renda -->
        <div class="tab-content" *ngIf="selectedTab === 5">
          <div class="form-row">
            <div class="form-group">
              <label>Tipo de Renda</label>
              <input type="text" formControlName="incomeTypeId" placeholder="ID Tipo Renda" />
            </div>

            <div class="form-group">
              <label>Renda Mensal</label>
              <input type="number" formControlName="monthlyIncome" placeholder="Renda Mensal" />
            </div>

            <div class="form-group">
              <label>Renda Anual</label>
              <input type="number" formControlName="annualIncome" placeholder="Renda Anual" />
            </div>
          </div>
        </div>

        <!-- Tab 7: Escolaridade -->
        <div class="tab-content" *ngIf="selectedTab === 6">
          <div class="form-row">
            <div class="form-group">
              <label>Nível de Educação</label>
              <input type="text" formControlName="educationLevelId" placeholder="ID Nível Educação" />
            </div>

            <div class="form-group">
              <label>Escola</label>
              <input type="text" formControlName="schoolName" placeholder="Nome da Escola" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Ano de Conclusão</label>
              <input type="number" formControlName="completionYear" placeholder="Ano" min="1900" max="2099" />
            </div>

            <div class="form-group">
              <label>Estudando Atualmente</label>
              <select formControlName="currentlyStudying">
                <option value="">Selecione...</option>
                <option value="0">Não</option>
                <option value="1">Sim</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Tab 8: Programas Sociais -->
        <div class="tab-content" *ngIf="selectedTab === 7">
          <p style="color: #666; margin-bottom: 20px;">
            Aba de Programas Sociais será disponibilizada após criação do munícipe.
          </p>
          <div class="form-group">
            <label>Observações</label>
            <textarea formControlName="notes" placeholder="Observações gerais" rows="6"></textarea>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="form-actions">
          <button type="submit" class="btn btn-primary" [disabled]="form.invalid">
            {{ isEditMode ? 'Atualizar' : 'Criar' }}
          </button>
          <a routerLink=".." class="btn btn-outline">Cancelar</a>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
      max-width: 900px;
      margin: 0 auto;
    }

    .header {
      margin-bottom: 20px;
    }

    .tabs {
      display: flex;
      gap: 5px;
      border-bottom: 2px solid #ddd;
      margin-bottom: 20px;
      overflow-x: auto;
    }

    .tab-button {
      padding: 12px 16px;
      border: none;
      background: transparent;
      cursor: pointer;
      font-size: 14px;
      white-space: nowrap;
      border-bottom: 3px solid transparent;
      color: #666;
      transition: all 0.3s ease;
    }

    .tab-button:hover {
      color: #1976d2;
    }

    .tab-button.active {
      color: #1976d2;
      border-bottom-color: #1976d2;
    }

    .tab-content {
      background: white;
      padding: 20px;
      border-radius: 4px;
      margin-bottom: 20px;
    }

    .form-group {
      margin-bottom: 15px;
    }

    .form-group label {
      display: block;
      margin-bottom: 5px;
      font-weight: 600;
      font-size: 14px;
      color: #333;
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      font-family: inherit;
    }

    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: #1976d2;
      box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 15px;
    }

    .error {
      color: #d32f2f;
      font-size: 12px;
      display: block;
      margin-top: 5px;
    }

    .alert {
      padding: 12px;
      border-radius: 4px;
      margin-bottom: 20px;
    }

    .alert-error {
      background-color: #ffebee;
      color: #c62828;
      border: 1px solid #ef5350;
    }

    h3 {
      margin-top: 20px;
      margin-bottom: 15px;
      color: #333;
      font-size: 16px;
    }

    .form-actions {
      display: flex;
      gap: 10px;
      justify-content: flex-start;
      margin-top: 30px;
    }

    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      text-decoration: none;
      display: inline-block;
      transition: background-color 0.3s ease;
    }

    .btn-primary {
      background-color: #1976d2;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #1565c0;
    }

    .btn-primary:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    .btn-outline {
      background-color: transparent;
      color: #1976d2;
      border: 1px solid #1976d2;
    }

    .btn-outline:hover {
      background-color: #f0f0f0;
    }
  `]
})
export class PersonsFormComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;
  selectedTab = 0;
  personId: number | null = null;
  persons$: Observable<Person[]>;
  loading$: Observable<boolean>;
  error$: Observable<any>;

  tabs = [
    'Dados Básicos',
    'Documentação',
    'Certidão',
    'Títulos',
    'Complementar',
    'Renda',
    'Escolaridade',
    'Programas Sociais'
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store
  ) {
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      birthDate: ['', Validators.required],
      fullName: [''],
      nickname: [''],
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
      motherRg: [''],
      fatherRg: [''],
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

    this.persons$ = this.store.select(state => (state as any).persons?.persons || []);
    this.loading$ = this.store.select(state => (state as any).persons?.loading || false);
    this.error$ = this.store.select(state => (state as any).persons?.error || null);
  }

  ngOnInit(): void {
    this.store.dispatch(PersonsActions.loadPersons());

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

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    const formData = this.form.value;

    if (this.isEditMode && this.personId) {
      this.store.dispatch(PersonsActions.updatePerson({ id: this.personId, person: formData }));
    } else {
      this.store.dispatch(PersonsActions.createPerson({ person: formData }));
    }

    setTimeout(() => {
      this.router.navigate(['../..'], { relativeTo: this.route });
    }, 1000);
  }
}

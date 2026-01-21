import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { FamilyComposition } from '../../../../core/services/family-composition.service';
import * as FamilyCompositionActions from '../../../../store/family-composition/family-composition.actions';

@Component({
  selector: 'app-family-composition-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="form-container">
      <div class="form-header">
        <h1>{{ isEdit ? 'Editar' : 'Nova' }} Composição Familiar</h1>
        <button class="btn btn-secondary" (click)="goBack()">← Voltar</button>
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="idFamilyComposition">ID da Família *</label>
          <input 
            type="number" 
            id="idFamilyComposition" 
            formControlName="idFamilyComposition"
            placeholder="Identificador único da família"
            [readonly]="isEdit"
          />
        </div>

        <div class="form-group">
          <label for="idPerson">ID da Pessoa *</label>
          <input 
            type="number" 
            id="idPerson" 
            formControlName="idPerson"
            placeholder="Identificador da pessoa"
            [readonly]="isEdit"
          />
        </div>

        <div class="form-group">
          <label for="idRelationshipDegree">Grau de Parentesco</label>
          <input 
            type="number" 
            id="idRelationshipDegree" 
            formControlName="idRelationshipDegree"
            placeholder="ID do grau de parentesco"
          />
        </div>

        <div class="form-group checkbox">
          <input 
            type="checkbox" 
            id="responsible" 
            formControlName="responsible"
          />
          <label for="responsible">É Responsável pela Família</label>
        </div>

        <div class="form-group">
          <label for="createdBy">Criado Por</label>
          <input 
            type="text" 
            id="createdBy" 
            formControlName="createdBy"
            placeholder="Usuário que criou o registro"
          />
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary" [disabled]="!form.valid">
            {{ isEdit ? 'Atualizar' : 'Criar' }}
          </button>
          <button type="button" class="btn btn-secondary" (click)="goBack()">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .form-container {
      max-width: 600px;
      margin: 2rem auto;
      background: white;
      border-radius: 0.55rem;
      padding: 2rem;
      box-shadow: 0 5px 20px rgba(0,0,0,0.05);
    }

    .form-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    h1 {
      margin: 0;
      font-size: 1.75rem;
      color: #32325d;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #525f7f;
      font-size: 0.9rem;
    }

    input:not([type="checkbox"]) {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 0.55rem;
      font-size: 0.95rem;
      transition: all 0.3s;

      &:focus {
        outline: none;
        border-color: #5e72e4;
        box-shadow: 0 0 0 3px rgba(94, 114, 228, 0.1);
      }

      &[readonly] {
        background-color: #f8f9fe;
        color: #8898aa;
      }
    }

    .checkbox {
      display: flex;
      align-items: center;
      gap: 0.75rem;

      input {
        width: auto;
        margin: 0;
      }

      label {
        margin: 0;
      }
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 0.55rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      flex: 1;

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    .btn-primary {
      background: linear-gradient(135deg, #5e72e4 0%, #825ee4 100%);
      color: white;

      &:not(:disabled):hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 25px rgba(94, 114, 228, 0.3);
      }
    }

    .btn-secondary {
      background: #e3e6f0;
      color: #525f7f;

      &:hover {
        background: #d3d6e0;
      }
    }
  `]
})
export class FamilyCompositionFormComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  familyComposition: FamilyComposition | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<{ familyComposition: any }>
  ) {
    this.form = this.fb.group({
      idFamilyComposition: ['', Validators.required],
      idPerson: ['', Validators.required],
      idRelationshipDegree: [''],
      responsible: [false],
      createdBy: [''],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const pessoaId = this.route.snapshot.paramMap.get('pessoaId');

    if (id && pessoaId) {
      this.isEdit = true;
      // Carregar dados para edição
      this.form.patchValue({
        idFamilyComposition: id,
        idPerson: pessoaId,
      });
    }
  }

  onSubmit(): void {
    if (!this.form.valid) return;

    const payload = this.form.value;

    if (this.isEdit) {
      this.store.dispatch(FamilyCompositionActions.updateFamilyComposition({
        idFamilyComposition: parseInt(payload.idFamilyComposition),
        idPerson: parseInt(payload.idPerson),
        familyComposition: payload,
      }));
    } else {
      this.store.dispatch(FamilyCompositionActions.createFamilyComposition({
        familyComposition: payload,
      }));
    }

    setTimeout(() => this.goBack(), 1000);
  }

  goBack(): void {
    this.router.navigate(['/family-composition']);
  }
}

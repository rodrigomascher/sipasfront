import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { RelationshipDegree } from '../../../../core/services/relationship-degree.service';
import * as RelationshipDegreeActions from '../../../../store/relationship-degree/relationship-degree.actions';

@Component({
  selector: 'app-relationship-degree-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="form-container">
      <div class="form-header">
        <h1>{{ isEdit ? 'Editar' : 'Novo' }} Grau de Parentesco</h1>
        <button class="btn btn-secondary" (click)="goBack()">← Voltar</button>
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="description">Descrição *</label>
          <input 
            type="text" 
            id="description" 
            formControlName="description"
            placeholder="Ex: Pai/Mãe, Cônjuge, Filho(a)..."
          />
        </div>

        <div class="form-group checkbox">
          <input 
            type="checkbox" 
            id="active" 
            formControlName="active"
          />
          <label for="active">Ativo</label>
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
export class RelationshipDegreeFormComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  relationshipDegree: RelationshipDegree | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<{ relationshipDegree: any }>
  ) {
    this.form = this.fb.group({
      description: ['', Validators.required],
      active: [true],
      createdBy: [''],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEdit = true;
      this.form.patchValue({ id });
    }
  }

  onSubmit(): void {
    if (!this.form.valid) return;

    const payload = this.form.value;

    if (this.isEdit) {
      const id = parseInt(this.route.snapshot.paramMap.get('id') || '0');
      this.store.dispatch(RelationshipDegreeActions.updateRelationshipDegree({
        id,
        relationshipDegree: payload,
      }));
    } else {
      this.store.dispatch(RelationshipDegreeActions.createRelationshipDegree({
        relationshipDegree: payload,
      }));
    }

    setTimeout(() => this.goBack(), 1000);
  }

  goBack(): void {
    this.router.navigate(['/relationship-degrees']);
  }
}

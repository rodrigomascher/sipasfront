import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CreateUnitDto, UpdateUnitDto } from '../../../core/services/units.service';
import * as UnitsActions from '../../../store/units/units.actions';
import * as UnitsSelectors from '../../../store/units/units.selectors';

@Component({
  selector: 'app-units-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container">
      <div class="form-header">
        <h1>{{ isEdit ? 'Editar Unidade' : 'Nova Unidade' }}</h1>
        <button class="btn btn-secondary" routerLink="/units">← Voltar</button>
      </div>

      <div class="form-card">
        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="name">Nome da Unidade *</label>
            <input
              type="text"
              id="name"
              [(ngModel)]="form.name"
              name="name"
              placeholder="Ex: Unidade Centro"
              required
            />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="type">Tipo *</label>
              <select
                id="type"
                [(ngModel)]="form.type"
                name="type"
                required
              >
                <option value="">Selecione um tipo</option>
                <option value="Posto">Posto</option>
                <option value="Centro">Centro</option>
                <option value="Clínica">Clínica</option>
                <option value="Hospital">Hospital</option>
              </select>
            </div>

            <div class="form-group">
              <label for="city">Cidade *</label>
              <input
                type="text"
                id="city"
                [(ngModel)]="form.city"
                name="city"
                placeholder="São Paulo"
                required
              />
            </div>

            <div class="form-group">
              <label for="state">Estado (UF) *</label>
              <input
                type="text"
                id="state"
                [(ngModel)]="form.state"
                name="state"
                placeholder="SP"
                maxlength="2"
                required
              />
            </div>
          </div>

          <div class="form-group">
            <label for="isArmored">
              <input
                type="checkbox"
                id="isArmored"
                [(ngModel)]="form.isArmored"
                name="isArmored"
              />
              Unidade Blindada
            </label>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary" [disabled]="loading$ | async">
              {{ (loading$ | async) ? 'Salvando...' : 'Salvar' }}
            </button>
            <button type="button" class="btn btn-secondary" routerLink="/units">
              Cancelar
            </button>
          </div>
        </form>

        <div *ngIf="error$ | async as error" class="alert alert-danger">
          {{ error }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }

    .form-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    h1 {
      margin: 0;
      font-size: 2rem;
      color: #333;
    }

    .form-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 1rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #333;
    }

    input[type="text"],
    input[type="number"],
    select {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      transition: border-color 0.3s;
    }

    input[type="text"]:focus,
    input[type="number"]:focus,
    select:focus {
      outline: none;
      border-color: #1976d2;
      box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
    }

    input[type="checkbox"] {
      margin-right: 0.5rem;
      cursor: pointer;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.3s;
    }

    .btn-primary {
      background-color: #1976d2;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #1565c0;
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-secondary {
      background-color: #f5f5f5;
      color: #333;
      border: 1px solid #ddd;
    }

    .btn-secondary:hover {
      background-color: #e8e8e8;
    }

    .alert-danger {
      margin-top: 1rem;
      padding: 1rem;
      background-color: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
      border-radius: 4px;
    }
  `]
})
export class UnitsFormComponent implements OnInit {
  isEdit = false;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  
  form = {
    name: '',
    type: '',
    city: '',
    state: '',
    isArmored: false
  };

  private unitId: number | null = null;

  constructor(
    private store: Store<{ units: any }>,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.loading$ = this.store.select(UnitsSelectors.selectUnitsLoading);
    this.error$ = this.store.select(UnitsSelectors.selectUnitsError);
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.unitId = +params['id'];
        if (this.unitId) {
          this.store.dispatch(UnitsActions.loadUnitById({ id: this.unitId }));
        }
        
        this.store.select(UnitsSelectors.selectSelectedUnit).subscribe(unit => {
          if (unit) {
            this.form = {
              name: unit.name,
              type: unit.type,
              city: unit.city,
              state: unit.state,
              isArmored: unit.isArmored
            };
          }
        });
      }
    });
  }

  onSubmit(): void {
    if (!this.form.name || !this.form.type || !this.form.city || !this.form.state) {
      alert('Nome, Tipo, Cidade e Estado são obrigatórios');
      return;
    }

    if (this.isEdit && this.unitId) {
      const updateDto: UpdateUnitDto = {
        name: this.form.name,
        type: this.form.type,
        city: this.form.city,
        state: this.form.state,
        isArmored: this.form.isArmored
      };
      this.store.dispatch(UnitsActions.updateUnit({ id: this.unitId, unit: updateDto }));
    } else {
      const createDto: CreateUnitDto = {
        name: this.form.name,
        type: this.form.type,
        city: this.form.city,
        state: this.form.state,
        isArmored: this.form.isArmored
      };
      this.store.dispatch(UnitsActions.createUnit({ unit: createDto }));
    }

    setTimeout(() => {
      this.router.navigate(['/units']);
    }, 1000);
  }
}

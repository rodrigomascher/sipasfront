import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Unit } from '../../../core/services/units.service';
import { selectSelectedUnit, selectUnitsLoading } from '../../../store/units/units.selectors';
import * as UnitsActions from '../../../store/units/units.actions';

@Component({
  selector: 'app-units-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="detail-container">
      <h2>Detalhes da Unidade</h2>

      <div *ngIf="loading$ | async" class="spinner"></div>

      <div class="card" *ngIf="unit$ | async as unit">
        <div class="grid-2">
          <div>
            <strong>ID:</strong>
            <p>{{ unit.id }}</p>
          </div>
          <div>
            <strong>Nome:</strong>
            <p>{{ unit.name }}</p>
          </div>
          <div>
            <strong>Tipo:</strong>
            <p>{{ unit.type }}</p>
          </div>
          <div>
            <strong>Cidade:</strong>
            <p>{{ unit.city }}</p>
          </div>
          <div>
            <strong>Estado:</strong>
            <p>{{ unit.state }}</p>
          </div>
          <div>
            <strong>Blindada:</strong>
            <p>{{ unit.isArmored ? 'Sim' : 'Não' }}</p>
          </div>
          <div>
            <strong>Criada em:</strong>
            <p>{{ unit.createdAt | date }}</p>
          </div>
          <div>
            <strong>Atualizada em:</strong>
            <p>{{ unit.updatedAt | date }}</p>
          </div>
        </div>

        <div class="actions mt-3">
          <button class="btn-primary">Editar</button>
          <button class="btn-secondary">Voltar</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @import '../../../shared/styles/form-styles.scss';

    .detail-container {
      padding: 20px;
      max-width: 1000px;
      margin: 0 auto;
    }

    .grid-2 {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
      margin-bottom: 30px;

      > div {
        strong {
          display: block;
          color: #666;
          font-size: 12px;
          margin-bottom: 8px;
          text-transform: uppercase;
          font-weight: 600;
        }

        p {
          font-size: 16px;
          color: #333;
          margin: 0;
        }
      }
    }

    .actions {
      display: flex;
      gap: 12px;
      margin-top: 24px;
      padding-top: 20px;
      border-top: 1px solid #eee;

      button {
        padding: 10px 20px;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 600;
        border: none;
        transition: all 0.2s;
      }

      .btn-primary {
        background: linear-gradient(135deg, #5e72e4 0%, #825ee4 100%);
        color: white;
      }

      .btn-primary:hover {
        background: linear-gradient(135deg, #4c63d2 0%, #6d46d3 100%);
        box-shadow: 0 5px 15px rgba(94, 114, 228, 0.3);
      }

      .btn-secondary {
        background: #f7fafc;
        color: #525f7f;
        border: 2px solid #e3e6f0;
      }

      .btn-secondary:hover {
        background: #f0f4ff;
        border-color: #5e72e4;
        color: #5e72e4;
      }
    }
  `]
})
export class UnitsDetailComponent implements OnInit {
  unit$: Observable<Unit | null>;
  loading$: Observable<boolean>;

  constructor(
    private route: ActivatedRoute,
    private store: Store<{ units: any }>
  ) {
    this.unit$ = this.store.select(selectSelectedUnit);
    this.loading$ = this.store.select(selectUnitsLoading);
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.store.dispatch(UnitsActions.loadUnitById({ id }));
  }
}

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
    .detail-container {
      padding: 1rem;
    }

    .grid-2 {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;

      > div {
        strong {
          display: block;
          color: #666;
          font-size: 0.875rem;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
        }

        p {
          font-size: 1rem;
          color: #333;
        }
      }
    }

    .actions {
      display: flex;
      gap: 1rem;

      button {
        margin-top: 1rem;
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

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { SexualOrientation } from '../../../../core/services/sexual-orientations.service';
import * as Actions from '../../store/sexual-orientations.actions';
import * as Selectors from '../../store/sexual-orientations.selectors';

@Component({
  selector: 'app-sexual-orientations-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div style="padding: 20px;">
      <h2>Orientações Sexuais</h2>
      
      <div style="margin-bottom: 20px;">
        <a routerLink="/sexual-orientations/create" style="padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 4px;">
          + Nova Orientação
        </a>
      </div>

      <div *ngIf="loading$ | async" style="text-align: center; padding: 20px;">
        Carregando...
      </div>

      <table style="width: 100%; border-collapse: collapse;" *ngIf="!(loading$ | async)">
        <thead>
          <tr style="background: #f8f9fa; border-bottom: 2px solid #dee2e6;">
            <th style="padding: 12px; text-align: left;">ID</th>
            <th style="padding: 12px; text-align: left;">Descrição</th>
            <th style="padding: 12px; text-align: left;">Ativo</th>
            <th style="padding: 12px; text-align: center;">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let item of sexualOrientations$ | async" style="border-bottom: 1px solid #dee2e6;">
            <td style="padding: 12px;">{{ item.id }}</td>
            <td style="padding: 12px;">{{ item.description }}</td>
            <td style="padding: 12px;">{{ item.active ? 'Sim' : 'Não' }}</td>
            <td style="padding: 12px; text-align: center;">
              <a [routerLink]="['/sexual-orientations', item.id, 'edit']" style="margin-right: 10px; color: #007bff; text-decoration: none;">
                Editar
              </a>
              <button (click)="delete(item.id)" style="background: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">
                Deletar
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div *ngIf="(sexualOrientations$ | async)?.length === 0 && !(loading$ | async)" style="text-align: center; padding: 40px; color: #999;">
        Nenhuma orientação cadastrada
      </div>
    </div>
  `,
})
export class SexualOrientationsListComponent implements OnInit {
  sexualOrientations$: Observable<SexualOrientation[]>;
  loading$: Observable<boolean>;

  constructor(private store: Store<{ sexualOrientations: any }>) {
    this.sexualOrientations$ = this.store.select(Selectors.selectAllSexualOrientations);
    this.loading$ = this.store.select(Selectors.selectSexualOrientationsLoading);
  }

  ngOnInit() {
    this.store.dispatch(Actions.loadSexualOrientations());
  }

  delete(id: number) {
    if (confirm('Tem certeza?')) {
      this.store.dispatch(Actions.deleteSexualOrientation({ id }));
    }
  }
}

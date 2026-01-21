import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Gender } from '../../../../core/services/genders.service';
import * as GendersActions from '../../store/genders.actions';
import * as GendersSelectors from '../../store/genders.selectors';

@Component({
  selector: 'app-genders-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div style="padding: 20px;">
      <h2>Gêneros</h2>
      
      <div style="margin-bottom: 20px;">
        <a routerLink="/genders/create" style="padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 4px;">
          + Novo Gênero
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
          <tr *ngFor="let gender of genders$ | async" style="border-bottom: 1px solid #dee2e6;">
            <td style="padding: 12px;">{{ gender.id }}</td>
            <td style="padding: 12px;">{{ gender.description }}</td>
            <td style="padding: 12px;">{{ gender.active ? 'Sim' : 'Não' }}</td>
            <td style="padding: 12px; text-align: center;">
              <a [routerLink]="['/genders', gender.id, 'edit']" style="margin-right: 10px; color: #007bff; text-decoration: none;">
                Editar
              </a>
              <button (click)="delete(gender.id)" style="background: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">
                Deletar
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div *ngIf="(genders$ | async)?.length === 0 && !(loading$ | async)" style="text-align: center; padding: 40px; color: #999;">
        Nenhum gênero cadastrado
      </div>
    </div>
  `,
})
export class GendersListComponent implements OnInit {
  genders$: Observable<Gender[]>;
  loading$: Observable<boolean>;

  constructor(
    private store: Store<{ genders: any }>,
    private router: Router
  ) {
    this.genders$ = this.store.select(GendersSelectors.selectAllGenders);
    this.loading$ = this.store.select(GendersSelectors.selectGendersLoading);
  }

  ngOnInit() {
    this.store.dispatch(GendersActions.loadGenders());
  }

  delete(id: number) {
    if (confirm('Tem certeza?')) {
      this.store.dispatch(GendersActions.deleteGender({ id }));
    }
  }
}

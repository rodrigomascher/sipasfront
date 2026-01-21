import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { GenderIdentity } from '../../../../core/services/gender-identities.service';
import * as Actions from '../../store/gender-identities.actions';
import * as Selectors from '../../store/gender-identities.selectors';

@Component({
  selector: 'app-gender-identities-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div style="padding: 20px;">
      <h2>Identidades de Gênero</h2>
      
      <div style="margin-bottom: 20px;">
        <a routerLink="/gender-identities/create" style="padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 4px;">
          + Nova Identidade
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
          <tr *ngFor="let item of genderIdentities$ | async" style="border-bottom: 1px solid #dee2e6;">
            <td style="padding: 12px;">{{ item.id }}</td>
            <td style="padding: 12px;">{{ item.description }}</td>
            <td style="padding: 12px;">{{ item.active ? 'Sim' : 'Não' }}</td>
            <td style="padding: 12px; text-align: center;">
              <a [routerLink]="['/gender-identities', item.id, 'edit']" style="margin-right: 10px; color: #007bff; text-decoration: none;">
                Editar
              </a>
              <button (click)="delete(item.id)" style="background: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">
                Deletar
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div *ngIf="(genderIdentities$ | async)?.length === 0 && !(loading$ | async)" style="text-align: center; padding: 40px; color: #999;">
        Nenhuma identidade cadastrada
      </div>
    </div>
  `,
})
export class GenderIdentitiesListComponent implements OnInit {
  genderIdentities$: Observable<GenderIdentity[]>;
  loading$: Observable<boolean>;

  constructor(private store: Store<{ genderIdentities: any }>) {
    this.genderIdentities$ = this.store.select(Selectors.selectAllGenderIdentities);
    this.loading$ = this.store.select(Selectors.selectGenderIdentitiesLoading);
  }

  ngOnInit() {
    this.store.dispatch(Actions.loadGenderIdentities());
  }

  delete(id: number) {
    if (confirm('Tem certeza?')) {
      this.store.dispatch(Actions.deleteGenderIdentity({ id }));
    }
  }
}

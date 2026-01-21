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
    <div class="container">
      <div class="header">
        <h1>Identidades de Gênero</h1>
        <button class="btn btn-primary" routerLink="/gender-identities/create">+ Nova Identidade</button>
      </div>

      <div *ngIf="loading$ | async" style="text-align: center; padding: 20px;">
        Carregando...
      </div>

      <table class="data-table" *ngIf="!(loading$ | async)">
        <thead>
          <tr>
            <th>ID</th>
            <th>Descrição</th>
            <th>Ativo</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let item of genderIdentities$ | async">
            <td>{{ item.id }}</td>
            <td>{{ item.description }}</td>
            <td>{{ item.active ? 'Sim' : 'Não' }}</td>
            <td class="actions">
              <button class="btn-sm btn-info" [routerLink]="['/gender-identities', item.id, 'edit']" title="Editar">
                Editar
              </button>
              <button class="btn-sm btn-danger" (click)="delete(item.id)" title="Deletar">
                Deletar
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div *ngIf="(genderIdentities$ | async)?.length === 0 && !(loading$ | async)" class="no-data">
        <p>Nenhuma identidade cadastrada</p>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    h1 {
      margin: 0;
      font-size: 1.8rem;
      color: #333;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      text-decoration: none;
      display: inline-block;
    }

    .btn-primary {
      background-color: #1976d2;
      color: white;
    }

    .btn-primary:hover {
      background-color: #1565c0;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .data-table thead {
      background: #f8f9fa;
      border-bottom: 2px solid #dee2e6;
    }

    .data-table th {
      padding: 12px;
      text-align: left;
      font-weight: 600;
      color: #333;
    }

    .data-table td {
      padding: 12px;
      border-bottom: 1px solid #dee2e6;
    }

    .data-table tbody tr:hover {
      background: #f8f9fa;
    }

    .actions {
      display: flex;
      gap: 0.5rem;
      justify-content: center;
    }

    .btn-sm {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      text-decoration: none;
      display: inline-block;
    }

    .btn-info {
      background-color: #17a2b8;
      color: white;
    }

    .btn-info:hover {
      background-color: #138496;
    }

    .btn-danger {
      background-color: #dc3545;
      color: white;
    }

    .btn-danger:hover {
      background-color: #c82333;
    }

    .no-data {
      text-align: center;
      padding: 40px;
      color: #999;
    }
  `]
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

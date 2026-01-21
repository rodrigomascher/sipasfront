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
    <div class="container">
      <div class="header">
        <h1>Gêneros</h1>
        <button class="btn btn-primary" routerLink="/genders/create">+ Novo Gênero</button>
      </div>

      <div class="search-box">
        <input
          type="text"
          placeholder="Buscar por descrição..."
          [(ngModel)]="searchTerm"
          (ngModelChange)="onSearch()"
          class="search-input"
        />
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
          <tr *ngFor="let gender of filteredGenders">
            <td>#{{ gender.id }}</td>
            <td>{{ gender.description }}</td>
            <td>{{ gender.active ? 'Sim' : 'Não' }}</td>
            <td class="actions">
              <button class="btn-sm btn-info" [routerLink]="['/genders', gender.id, 'edit']" title="Editar">
                Editar
              </button>
              <button class="btn-sm btn-danger" (click)="delete(gender.id)" title="Deletar">
                Deletar
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div *ngIf="(genders$ | async)?.length === 0 && !(loading$ | async)" class="no-data">
        <p>Nenhum gênero cadastrado</p>
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

    .search-box {
      margin-bottom: 1.5rem;
    }

    .search-input {
      width: 100%;
      max-width: 500px;
      padding: 0.75rem;
      font-size: 14px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .search-input:focus {
      outline: none;
      border-color: #1976d2;
      box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
    }
  `]
})
export class GendersListComponent implements OnInit {
  genders$: Observable<Gender[]>;
  loading$: Observable<boolean>;
  filteredGenders: Gender[] = [];
  searchTerm: string = '';

  constructor(
    private store: Store<{ genders: any }>,
    private router: Router
  ) {
    this.genders$ = this.store.select(GendersSelectors.selectAllGenders);
    this.loading$ = this.store.select(GendersSelectors.selectGendersLoading);
  }

  ngOnInit() {
    this.store.dispatch(GendersActions.loadGenders());
    this.genders$.subscribe(genders => {
      this.filteredGenders = genders;
    });
  }

  onSearch() {
    this.genders$.subscribe(genders => {
      this.filteredGenders = genders.filter(gender =>
        gender.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    });
  }

  delete(id: number) {
    if (confirm('Tem certeza?')) {
      this.store.dispatch(GendersActions.deleteGender({ id }));
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Person } from '../../../../core/services/persons.service';
import * as PersonsActions from '../../store/persons.actions';
import * as PersonsSelectors from '../../store/persons.selectors';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-persons-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LoadingSpinnerComponent],
  template: `
    <div class="container">
      <div class="header">
        <h2>Munícipes</h2>
        <a routerLink="create" class="btn btn-primary">Novo Munícipe</a>
      </div>

      <div class="search-bar">
        <input
          type="text"
          placeholder="Buscar por nome, CPF ou NIS..."
          [(ngModel)]="searchTerm"
          (keyup.enter)="search()"
        />
        <button (click)="search()" class="btn btn-secondary">Buscar</button>
        <button (click)="clearSearch()" class="btn btn-outline">Limpar</button>
      </div>

      <app-loading-spinner
        *ngIf="loading$ | async"
        message="Carregando munícipes..."
      ></app-loading-spinner>

      <div *ngIf="error$ | async as error" class="alert alert-error">
        Erro ao carregar munícipes: {{ error }}
      </div>

      <div class="table-responsive">
        <table class="table" *ngIf="(persons$ | async) as persons">
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>Data de Nascimento</th>
              <th>Sexo</th>
              <th>Renda Mensal</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let person of persons">
              <td>{{ person.fullName || person.firstName + ' ' + person.lastName }}</td>
              <td>{{ person.cpf || '-' }}</td>
              <td>{{ person.birthDate | date: 'dd/MM/yyyy' || '-' }}</td>
              <td>{{ person.sex === 1 ? 'M' : person.sex === 2 ? 'F' : '-' }}</td>
              <td>{{ person.monthlyIncome ? ('R$ ' + (person.monthlyIncome | number: '1.2-2')) : '-' }}</td>
              <td class="actions">
                <a [routerLink]="[person.id, 'edit']" class="btn btn-sm btn-info">Editar</a>
                <button (click)="deletePerson(person.id!)" class="btn btn-sm btn-danger">Deletar</button>
              </td>
            </tr>
          </tbody>
        </table>

        <div *ngIf="((persons$ | async) || []).length === 0" class="empty-state">
          <p>Nenhum munícipe encontrado</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .search-bar {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
    }

    .search-bar input {
      flex: 1;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }

    .table-responsive {
      overflow-x: auto;
    }

    .table {
      width: 100%;
      border-collapse: collapse;
      background: white;
    }

    .table th {
      background-color: #f5f5f5;
      padding: 12px;
      text-align: left;
      font-weight: 600;
      border-bottom: 2px solid #ddd;
    }

    .table td {
      padding: 12px;
      border-bottom: 1px solid #eee;
    }

    .table tr:hover {
      background-color: #f9f9f9;
    }

    .actions {
      display: flex;
      gap: 8px;
    }

    .btn {
      padding: 8px 12px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      text-decoration: none;
      display: inline-block;
    }

    .btn-primary {
      background-color: #1976d2;
      color: white;
    }

    .btn-secondary {
      background-color: #757575;
      color: white;
    }

    .btn-outline {
      background-color: transparent;
      color: #1976d2;
      border: 1px solid #1976d2;
    }

    .btn-sm {
      padding: 4px 8px;
      font-size: 12px;
    }

    .btn-info {
      background-color: #0288d1;
      color: white;
    }

    .btn-danger {
      background-color: #d32f2f;
      color: white;
    }

    .alert {
      padding: 12px;
      border-radius: 4px;
      margin-bottom: 20px;
    }

    .alert-error {
      background-color: #ffebee;
      color: #c62828;
      border: 1px solid #ef5350;
    }

    .empty-state {
      text-align: center;
      padding: 40px;
      color: #999;
    }
  `]
})
export class PersonsListComponent implements OnInit {
  persons$: Observable<Person[]>;
  loading$: Observable<boolean>;
  error$: Observable<any>;
  searchTerm = '';

  constructor(private store: Store) {
    this.persons$ = this.store.select(PersonsSelectors.selectAllPersons);
    this.loading$ = this.store.select(PersonsSelectors.selectPersonsLoading);
    this.error$ = this.store.select(PersonsSelectors.selectPersonsError);
  }

  ngOnInit(): void {
    this.store.dispatch(PersonsActions.loadPersons());
  }

  search(): void {
    if (this.searchTerm.trim()) {
      this.store.dispatch(PersonsActions.searchPersons({ query: this.searchTerm }));
    }
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.store.dispatch(PersonsActions.loadPersons());
  }

  deletePerson(id: number): void {
    if (confirm('Tem certeza que deseja deletar este munícipe?')) {
      this.store.dispatch(PersonsActions.deletePerson({ id }));
    }
  }
}

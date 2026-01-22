import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Person } from '../../../../core/services/persons.service';
import { GenericListComponent, ListColumn, PaginationParams } from '../../../../shared/components/generic-list/generic-list.component';
import { GenericAction } from '../../../../shared/components/generic-actions/generic-actions.component';
import * as PersonsActions from '../../store/persons.actions';
import * as PersonsSelectors from '../../store/persons.selectors';

@Component({
  selector: 'app-persons-list',
  standalone: true,
  imports: [CommonModule, GenericListComponent],
  template: `
    <app-generic-list
      [items$]="persons$"
      [loading$]="loading$"
      [totalItems$]="totalItems$"
      [currentPage$]="currentPage$"
      [totalPages$]="totalPages$"
      [currentPageStart$]="currentPageStart$"
      [currentPageEnd$]="currentPageEnd$"
      [columns]="columns"
      [actions]="actions"
      title="Cadastro de Munícipes"
      createButtonLabel="Novo Munícipe"
      createRoute="/persons/create"
      searchPlaceholder="Buscar por nome ou CPF..."
      emptyMessage="Nenhum munícipe encontrado"
      [searchFields]="['fullName', 'cpf']"
      (paginationChange)="onPaginationChange($event)"
      (delete)="onDelete($event)"
    ></app-generic-list>
  `
})
export class PersonsListComponent implements OnInit {
  persons$: Observable<Person[]>;
  loading$: Observable<boolean>;
  totalItems$: Observable<number>;
  currentPage$: Observable<number>;
  totalPages$: Observable<number>;
  currentPageStart$: Observable<number>;
  currentPageEnd$: Observable<number>;

  columns: ListColumn[] = [
    { key: 'id', label: 'ID', formatter: (val) => `#${val}`, sortable: true },
    { key: 'fullName', label: 'Nome', sortable: true },
    { key: 'cpf', label: 'CPF', sortable: true },
    { key: 'birthDate', label: 'Data de Nascimento', formatter: (val) => val ? new Date(val).toLocaleDateString('pt-BR') : '-', sortable: true },
    { key: 'monthlyIncome', label: 'Renda Mensal', formatter: (val) => val ? `R$ ${val.toFixed(2)}` : '-', sortable: true }
  ];

  actions: GenericAction[] = [
    {
      label: 'Editar',
      icon: '✎',
      class: 'btn-info',
      callback: (item) => this.router.navigate(['/persons', item.id, 'edit'])
    },
    {
      label: 'Deletar',
      icon: '🗑',
      class: 'btn-danger',
      confirm: 'Tem certeza que deseja deletar este munícipe?',
      callback: (item) => this.onDelete(item)
    }
  ];

  constructor(
    private store: Store<{ persons: any }>,
    private router: Router
  ) {
    this.persons$ = this.store.select(PersonsSelectors.selectAllPersons);
    this.loading$ = this.store.select(PersonsSelectors.selectPersonsLoading);
    this.totalItems$ = this.store.select(PersonsSelectors.selectTotalItems);
    this.currentPage$ = this.store.select(PersonsSelectors.selectCurrentPage);
    this.totalPages$ = this.store.select(PersonsSelectors.selectTotalPages);
    this.currentPageStart$ = this.store.select(PersonsSelectors.selectCurrentPageStart);
    this.currentPageEnd$ = this.store.select(PersonsSelectors.selectCurrentPageEnd);
  }

  ngOnInit(): void {
    this.store.dispatch(PersonsActions.loadPersons({ params: { page: 1, pageSize: 10 } }));
  }

  onPaginationChange(params: PaginationParams): void {
    this.store.dispatch(PersonsActions.loadPersons({ params }));
  }

  onDelete(item: Person): void {
    this.store.dispatch(PersonsActions.deletePerson({ id: item.id! }));
  }
}

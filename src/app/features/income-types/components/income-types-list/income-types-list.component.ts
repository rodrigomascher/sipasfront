import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IncomeType } from '../../../../core/services/income-types.service';
import { GenericListComponent, ListColumn, PaginationParams } from '../../../../shared/components/generic-list/generic-list.component';
import { GenericAction } from '../../../../shared/components/generic-actions/generic-actions.component';
import * as IncomeTypesActions from '../../store/income-types.actions';
import * as IncomeTypesSelectors from '../../store/income-types.selectors';

@Component({
  selector: 'app-income-types-list',
  standalone: true,
  imports: [CommonModule, GenericListComponent],
  template: `
    <app-generic-list
      [items$]="incomeTypes$"
      [loading$]="loading$"
      [totalItems$]="totalItems$"
      [currentPage$]="currentPage$"
      [totalPages$]="totalPages$"
      [currentPageStart$]="currentPageStart$"
      [currentPageEnd$]="currentPageEnd$"
      [columns]="columns"
      [actions]="actions"
      title="Tipo de Renda"
      createButtonLabel="Novo Tipo de Renda"
      createRoute="/income-types/create"
      searchPlaceholder="Buscar por descrição..."
      emptyMessage="Nenhum tipo de renda cadastrado"
      [searchFields]="['description']"
      (paginationChange)="onPaginationChange($event)"
    ></app-generic-list>
  `
})
export class IncomeTypesListComponent implements OnInit {
  incomeTypes$: Observable<IncomeType[]>;
  loading$: Observable<boolean>;
  totalItems$: Observable<number>;
  currentPage$: Observable<number>;
  totalPages$: Observable<number>;
  currentPageStart$: Observable<number>;
  currentPageEnd$: Observable<number>;
  columns: ListColumn[] = [
    { key: 'id', label: 'ID', formatter: (val) => `#${val}`, sortable: true },
    { key: 'description', label: 'Descrição', sortable: true },
    { key: 'active', label: 'Ativo', formatter: (val) => val ? 'Sim' : 'Não' }
  ];
  actions: GenericAction[] = [
    {
      label: 'Editar',
      icon: '✎',
      class: 'btn-info',
      callback: (item) => this.router.navigate(['/income-types', item.id, 'edit'])
    },
    {
      label: 'Deletar',
      icon: '🗑',
      class: 'btn-danger',
      confirm: 'Tem certeza que deseja deletar este tipo de renda?',
      callback: (item) => this.onDelete(item)
    }
  ];

  constructor(
    private store: Store<{ incomeTypes: any }>,
    private router: Router
  ) {
    this.incomeTypes$ = this.store.select(IncomeTypesSelectors.selectAllIncomeTypes);
    this.loading$ = this.store.select(IncomeTypesSelectors.selectIncomeTypesLoading);
    this.totalItems$ = this.store.select(IncomeTypesSelectors.selectTotalItems);
    this.currentPage$ = this.store.select(IncomeTypesSelectors.selectCurrentPage);
    this.totalPages$ = this.store.select(IncomeTypesSelectors.selectTotalPages);
    this.currentPageStart$ = this.store.select(IncomeTypesSelectors.selectCurrentPageStart);
    this.currentPageEnd$ = this.store.select(IncomeTypesSelectors.selectCurrentPageEnd);
  }

  ngOnInit(): void {
    this.store.dispatch(IncomeTypesActions.loadIncomeTypes({ params: { page: 1, pageSize: 10 } }));
  }

  onPaginationChange(params: PaginationParams): void {
    this.store.dispatch(IncomeTypesActions.loadIncomeTypes({ params }));
  }

  onDelete(item: IncomeType): void {
    this.store.dispatch(IncomeTypesActions.deleteIncomeType({ id: item.id }));
  }
}

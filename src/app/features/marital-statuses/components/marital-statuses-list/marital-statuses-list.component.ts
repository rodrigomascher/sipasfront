import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MaritalStatus } from '../../../../core/services/marital-statuses.service';
import { GenericListComponent, ListColumn, PaginationParams } from '../../../../shared/components/generic-list/generic-list.component';
import { GenericAction } from '../../../../shared/components/generic-actions/generic-actions.component';
import * as MaritalStatusesActions from '../../store/marital-statuses.actions';
import * as MaritalStatusesSelectors from '../../store/marital-statuses.selectors';

@Component({
  selector: 'app-marital-statuses-list',
  standalone: true,
  imports: [CommonModule, GenericListComponent],
  template: `
    <app-generic-list
      [items$]="maritalStatuses$"
      [loading$]="loading$"
      [totalItems$]="totalItems$"
      [currentPage$]="currentPage$"
      [totalPages$]="totalPages$"
      [currentPageStart$]="currentPageStart$"
      [currentPageEnd$]="currentPageEnd$"
      [columns]="columns"
      [actions]="actions"
      title="Estado Civil"
      createButtonLabel="Novo Estado Civil"
      createRoute="/marital-statuses/create"
      searchPlaceholder="Buscar por descrição..."
      emptyMessage="Nenhum estado civil cadastrado"
      [searchFields]="['description']"
      (paginationChange)="onPaginationChange($event)"
    ></app-generic-list>
  `
})
export class MaritalStatusesListComponent implements OnInit {
  maritalStatuses$: Observable<MaritalStatus[]>;
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
      callback: (item) => this.router.navigate(['/marital-statuses', item.id, 'edit'])
    },
    {
      label: 'Deletar',
      icon: '🗑',
      class: 'btn-danger',
      confirm: 'Tem certeza que deseja deletar este estado civil?',
      callback: (item) => this.onDelete(item)
    }
  ];

  constructor(
    private store: Store<{ maritalStatuses: any }>,
    private router: Router
  ) {
    this.maritalStatuses$ = this.store.select(MaritalStatusesSelectors.selectAllMaritalStatuses);
    this.loading$ = this.store.select(MaritalStatusesSelectors.selectMaritalStatusesLoading);
    this.totalItems$ = this.store.select(MaritalStatusesSelectors.selectTotalItems);
    this.currentPage$ = this.store.select(MaritalStatusesSelectors.selectCurrentPage);
    this.totalPages$ = this.store.select(MaritalStatusesSelectors.selectTotalPages);
    this.currentPageStart$ = this.store.select(MaritalStatusesSelectors.selectCurrentPageStart);
    this.currentPageEnd$ = this.store.select(MaritalStatusesSelectors.selectCurrentPageEnd);
  }

  ngOnInit(): void {
    this.store.dispatch(MaritalStatusesActions.loadMaritalStatuses({ params: { page: 1, pageSize: 10 } }));
  }

  onPaginationChange(params: PaginationParams): void {
    this.store.dispatch(MaritalStatusesActions.loadMaritalStatuses({ params }));
  }

  onDelete(item: MaritalStatus): void {
    this.store.dispatch(MaritalStatusesActions.deleteMaritalStatus({ id: item.id }));
  }
}

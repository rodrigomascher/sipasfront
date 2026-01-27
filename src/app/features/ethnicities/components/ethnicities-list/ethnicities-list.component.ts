import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Ethnicity } from '../../../../core/services/ethnicities.service';
import { GenericListComponent, ListColumn, PaginationParams } from '../../../../shared/components/generic-list/generic-list.component';
import { GenericAction } from '../../../../shared/components/generic-actions/generic-actions.component';
import * as EthnicitiesActions from '../../store/ethnicities.actions';
import * as EthnicitiesSelectors from '../../store/ethnicities.selectors';

@Component({
  selector: 'app-ethnicities-list',
  standalone: true,
  imports: [CommonModule, GenericListComponent],
  template: `
    <app-generic-list
      [items$]="ethnicities$"
      [loading$]="loading$"
      [totalItems$]="totalItems$"
      [currentPage$]="currentPage$"
      [totalPages$]="totalPages$"
      [currentPageStart$]="currentPageStart$"
      [currentPageEnd$]="currentPageEnd$"
      [columns]="columns"
      [actions]="actions"
      title="Etnia"
      createButtonLabel="Nova Etnia"
      createRoute="/ethnicities/create"
      searchPlaceholder="Buscar por descrição..."
      emptyMessage="Nenhuma etnia cadastrada"
      [searchFields]="['description']"
      (paginationChange)="onPaginationChange($event)"
    ></app-generic-list>
  `
})
export class EthnicitiesListComponent implements OnInit {
  ethnicities$: Observable<Ethnicity[]>;
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
      callback: (item) => this.router.navigate(['/ethnicities', item.id, 'edit'])
    },
    {
      label: 'Deletar',
      icon: '🗑',
      class: 'btn-danger',
      confirm: 'Tem certeza que deseja deletar esta etnia?',
      callback: (item) => this.onDelete(item)
    }
  ];

  constructor(
    private store: Store<{ ethnicities: any }>,
    private router: Router
  ) {
    this.ethnicities$ = this.store.select(EthnicitiesSelectors.selectAllEthnicities);
    this.loading$ = this.store.select(EthnicitiesSelectors.selectEthnicitiesLoading);
    this.totalItems$ = this.store.select(EthnicitiesSelectors.selectTotalItems);
    this.currentPage$ = this.store.select(EthnicitiesSelectors.selectCurrentPage);
    this.totalPages$ = this.store.select(EthnicitiesSelectors.selectTotalPages);
    this.currentPageStart$ = this.store.select(EthnicitiesSelectors.selectCurrentPageStart);
    this.currentPageEnd$ = this.store.select(EthnicitiesSelectors.selectCurrentPageEnd);
  }

  ngOnInit(): void {
    this.store.dispatch(EthnicitiesActions.loadEthnicities({ params: { page: 1, pageSize: 10 } }));
  }

  onPaginationChange(params: PaginationParams): void {
    this.store.dispatch(EthnicitiesActions.loadEthnicities({ params }));
  }

  onDelete(item: Ethnicity): void {
    this.store.dispatch(EthnicitiesActions.deleteEthnicity({ id: item.id }));
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { SexualOrientation } from '../../../../core/services/sexual-orientations.service';
import { GenericListComponent, ListColumn, PaginationParams } from '../../../../shared/components/generic-list/generic-list.component';
import { GenericAction } from '../../../../shared/components/generic-actions/generic-actions.component';
import * as Actions from '../../store/sexual-orientations.actions';
import * as Selectors from '../../store/sexual-orientations.selectors';

@Component({
  selector: 'app-sexual-orientations-list',
  standalone: true,
  imports: [CommonModule, GenericListComponent],
  template: `
    <app-generic-list
      [items$]="sexualOrientations$"
      [loading$]="loading$"
      [totalItems$]="totalItems$"
      [currentPage$]="currentPage$"
      [totalPages$]="totalPages$"
      [currentPageStart$]="currentPageStart$"
      [currentPageEnd$]="currentPageEnd$"
      [columns]="columns"
      [actions]="actions"
      title="Orientações Sexuais"
      createButtonLabel="Nova Orientação"
      createRoute="/sexual-orientations/create"
      searchPlaceholder="Buscar por descrição..."
      emptyMessage="Nenhuma orientação cadastrada"
      [searchFields]="['description']"
      (paginationChange)="onPaginationChange($event)"
    ></app-generic-list>
  `
})
export class SexualOrientationsListComponent implements OnInit {
  sexualOrientations$: Observable<SexualOrientation[]>;
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
      callback: (item) => this.router.navigate(['/sexual-orientations', item.id, 'edit'])
    },
    {
      label: 'Deletar',
      icon: '🗑',
      class: 'btn-danger',
      confirm: 'Tem certeza que deseja deletar esta orientação?',
      callback: (item) => this.onDelete(item)
    }
  ];

  constructor(
    private store: Store<{ sexualOrientations: any }>,
    private router: Router
  ) {
    this.sexualOrientations$ = this.store.select(Selectors.selectAllSexualOrientations);
    this.loading$ = this.store.select(Selectors.selectSexualOrientationsLoading);
    this.totalItems$ = this.store.select(Selectors.selectTotalItems);
    this.currentPage$ = this.store.select(Selectors.selectCurrentPage);
    this.totalPages$ = this.store.select(Selectors.selectTotalPages);
    this.currentPageStart$ = this.store.select(Selectors.selectCurrentPageStart);
    this.currentPageEnd$ = this.store.select(Selectors.selectCurrentPageEnd);
  }

  ngOnInit(): void {
    this.store.dispatch(Actions.loadSexualOrientations({ params: { page: 1, pageSize: 10 } }));
  }

  onPaginationChange(params: PaginationParams): void {
    this.store.dispatch(Actions.loadSexualOrientations({ params }));
  }

  onDelete(item: SexualOrientation): void {
    this.store.dispatch(Actions.deleteSexualOrientation({ id: item.id }));
  }
}

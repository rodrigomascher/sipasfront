import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Gender } from '../../../../core/services/genders.service';
import { GenericListComponent, ListColumn, PaginationParams } from '../../../../shared/components/generic-list/generic-list.component';
import { GenericAction } from '../../../../shared/components/generic-actions/generic-actions.component';
import * as GendersActions from '../../store/genders.actions';
import * as GendersSelectors from '../../store/genders.selectors';

@Component({
  selector: 'app-genders-list',
  standalone: true,
  imports: [CommonModule, GenericListComponent],
  template: `
    <app-generic-list
      [items$]="genders$"
      [loading$]="loading$"
      [totalItems$]="totalItems$"
      [currentPage$]="currentPage$"
      [totalPages$]="totalPages$"
      [currentPageStart$]="currentPageStart$"
      [currentPageEnd$]="currentPageEnd$"
      [columns]="columns"
      [actions]="actions"
      title="Gêneros"
      createButtonLabel="Novo Gênero"
      createRoute="/genders/create"
      searchPlaceholder="Buscar por descrição..."
      emptyMessage="Nenhum gênero cadastrado"
      [searchFields]="['description']"
      (paginationChange)="onPaginationChange($event)"
    ></app-generic-list>
  `
})
export class GendersListComponent implements OnInit {
  genders$: Observable<Gender[]>;
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
      callback: (item) => this.router.navigate(['/genders', item.id, 'edit'])
    },
    {
      label: 'Deletar',
      icon: '🗑',
      class: 'btn-danger',
      confirm: 'Tem certeza que deseja deletar este gênero?',
      callback: (item) => this.onDelete(item)
    }
  ];

  constructor(
    private store: Store<{ genders: any }>,
    private router: Router
  ) {
    this.genders$ = this.store.select(GendersSelectors.selectAllGenders);
    this.loading$ = this.store.select(GendersSelectors.selectGendersLoading);
    this.totalItems$ = this.store.select(GendersSelectors.selectTotalItems);
    this.currentPage$ = this.store.select(GendersSelectors.selectCurrentPage);
    this.totalPages$ = this.store.select(GendersSelectors.selectTotalPages);
    this.currentPageStart$ = this.store.select(GendersSelectors.selectCurrentPageStart);
    this.currentPageEnd$ = this.store.select(GendersSelectors.selectCurrentPageEnd);
  }

  ngOnInit(): void {
    this.store.dispatch(GendersActions.loadGenders({ params: {} }));
  }

  onPaginationChange(params: PaginationParams): void {
    this.store.dispatch(GendersActions.loadGenders({ params }));
  }

  onDelete(item: Gender): void {
    this.store.dispatch(GendersActions.deleteGender({ id: item.id }));
  }
}

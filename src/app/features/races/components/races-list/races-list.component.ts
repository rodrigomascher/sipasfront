import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Race } from '../../../../core/services/races.service';
import { GenericListComponent, ListColumn, PaginationParams } from '../../../../shared/components/generic-list/generic-list.component';
import { GenericAction } from '../../../../shared/components/generic-actions/generic-actions.component';
import * as RacesActions from '../../store/races.actions';
import * as RacesSelectors from '../../store/races.selectors';

@Component({
  selector: 'app-races-list',
  standalone: true,
  imports: [CommonModule, GenericListComponent],
  template: `
    <app-generic-list
      [items$]="races$"
      [loading$]="loading$"
      [totalItems$]="totalItems$"
      [currentPage$]="currentPage$"
      [totalPages$]="totalPages$"
      [currentPageStart$]="currentPageStart$"
      [currentPageEnd$]="currentPageEnd$"
      [columns]="columns"
      [actions]="actions"
      title="Raça/Cor"
      createButtonLabel="Nova Raça/Cor"
      createRoute="/races/create"
      searchPlaceholder="Buscar por descrição..."
      emptyMessage="Nenhuma raça/cor cadastrada"
      [searchFields]="['description']"
      (paginationChange)="onPaginationChange($event)"
    ></app-generic-list>
  `
})
export class RacesListComponent implements OnInit {
  races$: Observable<Race[]>;
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
      callback: (item) => this.router.navigate(['/races', item.id, 'edit'])
    },
    {
      label: 'Deletar',
      icon: '🗑',
      class: 'btn-danger',
      confirm: 'Tem certeza que deseja deletar esta raça/cor?',
      callback: (item) => this.onDelete(item)
    }
  ];

  constructor(
    private store: Store<{ races: any }>,
    private router: Router
  ) {
    this.races$ = this.store.select(RacesSelectors.selectAllRaces);
    this.loading$ = this.store.select(RacesSelectors.selectRacesLoading);
    this.totalItems$ = this.store.select(RacesSelectors.selectTotalItems);
    this.currentPage$ = this.store.select(RacesSelectors.selectCurrentPage);
    this.totalPages$ = this.store.select(RacesSelectors.selectTotalPages);
    this.currentPageStart$ = this.store.select(RacesSelectors.selectCurrentPageStart);
    this.currentPageEnd$ = this.store.select(RacesSelectors.selectCurrentPageEnd);
  }

  ngOnInit(): void {
    this.store.dispatch(RacesActions.loadRaces({ params: { page: 1, pageSize: 10 } }));
  }

  onPaginationChange(params: PaginationParams): void {
    this.store.dispatch(RacesActions.loadRaces({ params }));
  }

  onDelete(item: Race): void {
    this.store.dispatch(RacesActions.deleteRace({ id: item.id }));
  }
}

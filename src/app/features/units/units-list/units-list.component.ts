import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Unit } from '../../../core/services/units.service';
import { GenericListComponent, ListColumn, PaginationParams } from '../../../shared/components/generic-list/generic-list.component';
import { GenericAction } from '../../../shared/components/generic-actions/generic-actions.component';
import { 
  selectAllUnits, 
  selectUnitsLoading,
  selectTotalItems,
  selectCurrentPage,
  selectTotalPages,
  selectCurrentPageStart,
  selectCurrentPageEnd
} from '../../../store/units/units.selectors';
import * as UnitsActions from '../../../store/units/units.actions';

@Component({
  selector: 'app-units-list',
  standalone: true,
  imports: [CommonModule, GenericListComponent],
  template: `
    <app-generic-list
      [items$]="units$"
      [loading$]="loading$"
      [totalItems$]="totalItems$"
      [currentPage$]="currentPage$"
      [totalPages$]="totalPages$"
      [currentPageStart$]="currentPageStart$"
      [currentPageEnd$]="currentPageEnd$"
      [columns]="columns"
      [actions]="actions"
      title="Cadastro de Unidades"
      createButtonLabel="Nova Unidade"
      createRoute="/units/create"
      searchPlaceholder="Buscar por cidade ou nome..."
      emptyMessage="Nenhuma unidade encontrada"
      [searchFields]="['city', 'name', 'type']"
      (paginationChange)="onPaginationChange($event)"
      (delete)="onDelete($event)"
    ></app-generic-list>
  `
})
export class UnitsListComponent implements OnInit {
  units$: Observable<Unit[]>;
  loading$: Observable<boolean>;
  totalItems$: Observable<number>;
  currentPage$: Observable<number>;
  totalPages$: Observable<number>;
  currentPageStart$: Observable<number>;
  currentPageEnd$: Observable<number>;

  columns: ListColumn[] = [
    { key: 'id', label: 'ID', formatter: (val) => `#${val}`, sortable: true },
    { key: 'name', label: 'Nome', sortable: true },
    { key: 'type', label: 'Tipo', sortable: true },
    { key: 'city', label: 'Cidade', sortable: true },
    { key: 'state', label: 'Estado', sortable: true },
    { key: 'isArmored', label: 'Blindada', formatter: (val) => val ? 'Sim' : 'Não', sortable: true }
  ];
  actions: GenericAction[] = [
    {
      label: 'Editar',
      icon: '✎',
      class: 'btn-info',
      callback: (item) => this.router.navigate(['/units', item.id, 'edit'])
    },
    {
      label: 'Deletar',
      icon: '🗑',
      class: 'btn-danger',
      confirm: 'Tem certeza que deseja deletar esta unidade?',
      callback: (item) => this.onDelete(item)
    }
  ];

  constructor(
    private store: Store<{ units: any }>,
    private router: Router
  ) {
    this.units$ = this.store.select(selectAllUnits);
    this.loading$ = this.store.select(selectUnitsLoading);
    this.totalItems$ = this.store.select(selectTotalItems);
    this.currentPage$ = this.store.select(selectCurrentPage);
    this.totalPages$ = this.store.select(selectTotalPages);
    this.currentPageStart$ = this.store.select(selectCurrentPageStart);
    this.currentPageEnd$ = this.store.select(selectCurrentPageEnd);
  }

  ngOnInit(): void {
    this.store.dispatch(UnitsActions.loadUnits({ params: { page: 1, pageSize: 10 } }));
  }

  onPaginationChange(params: PaginationParams): void {
    this.store.dispatch(UnitsActions.loadUnits({ params }));
  }

  onDelete(item: Unit): void {
    this.store.dispatch(UnitsActions.deleteUnit({ id: item.id }));
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Role } from '../../../core/services/roles.service';
import { GenericListComponent, ListColumn, PaginationParams } from '../../../shared/components/generic-list/generic-list.component';
import { GenericAction } from '../../../shared/components/generic-actions/generic-actions.component';
import { 
  selectAllRoles, 
  selectRolesLoading,
  selectTotalItems,
  selectCurrentPage,
  selectTotalPages,
  selectCurrentPageStart,
  selectCurrentPageEnd
} from '../../../store/roles/roles.selectors';
import * as RolesActions from '../../../store/roles/roles.actions';

@Component({
  selector: 'app-roles-list',
  standalone: true,
  imports: [CommonModule, GenericListComponent],
  template: `
    <app-generic-list
      [items$]="roles$"
      [loading$]="loading$"
      [totalItems$]="totalItems$"
      [currentPage$]="currentPage$"
      [totalPages$]="totalPages$"
      [currentPageStart$]="currentPageStart$"
      [currentPageEnd$]="currentPageEnd$"
      [columns]="columns"
      [actions]="actions"
      title="Cadastro de Cargos"
      createButtonLabel="Novo Cargo"
      createRoute="/roles/create"
      searchPlaceholder="Buscar por nome..."
      emptyMessage="Nenhum cargo encontrado"
      [searchFields]="['name']"
      (paginationChange)="onPaginationChange($event)"
      (delete)="onDelete($event)"
    ></app-generic-list>
  `
})
export class RolesListComponent implements OnInit {
  roles$: Observable<Role[]>;
  loading$: Observable<boolean>;
  totalItems$: Observable<number>;
  currentPage$: Observable<number>;
  totalPages$: Observable<number>;
  currentPageStart$: Observable<number>;
  currentPageEnd$: Observable<number>;

  columns: ListColumn[] = [
    { key: 'id', label: 'ID', formatter: (val) => `#${val}`, sortable: true },
    { key: 'name', label: 'Nome', sortable: true },
    { key: 'description', label: 'Descrição', formatter: (val) => val || '-', sortable: true }
  ];
  actions: GenericAction[] = [
    {
      label: 'Editar',
      icon: '✎',
      class: 'btn-info',
      callback: (item) => this.router.navigate(['/roles', item.id, 'edit'])
    },
    {
      label: 'Deletar',
      icon: '🗑',
      class: 'btn-danger',
      confirm: 'Tem certeza que deseja deletar este cargo?',
      callback: (item) => this.onDelete(item)
    }
  ];

  constructor(
    private store: Store<{ roles: any }>,
    private router: Router
  ) {
    this.roles$ = this.store.select(selectAllRoles);
    this.loading$ = this.store.select(selectRolesLoading);
    this.totalItems$ = this.store.select(selectTotalItems);
    this.currentPage$ = this.store.select(selectCurrentPage);
    this.totalPages$ = this.store.select(selectTotalPages);
    this.currentPageStart$ = this.store.select(selectCurrentPageStart);
    this.currentPageEnd$ = this.store.select(selectCurrentPageEnd);
  }

  ngOnInit(): void {
    this.store.dispatch(RolesActions.loadRoles({ params: { page: 1, pageSize: 10 } }));
  }

  onPaginationChange(params: PaginationParams): void {
    this.store.dispatch(RolesActions.loadRoles({ params }));
  }

  onDelete(item: Role): void {
    this.store.dispatch(RolesActions.deleteRole({ id: item.id }));
  }
}

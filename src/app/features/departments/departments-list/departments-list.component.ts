import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Department } from '../../../core/services/departments.service';
import { GenericListComponent, ListColumn, PaginationParams } from '../../../shared/components/generic-list/generic-list.component';
import { GenericAction } from '../../../shared/components/generic-actions/generic-actions.component';
import { 
  selectAllDepartments, 
  selectDepartmentsLoading,
  selectTotalItems,
  selectCurrentPage,
  selectTotalPages,
  selectCurrentPageStart,
  selectCurrentPageEnd
} from '../../../store/departments/departments.selectors';
import * as DepartmentsActions from '../../../store/departments/departments.actions';

@Component({
  selector: 'app-departments-list',
  standalone: true,
  imports: [CommonModule, GenericListComponent],
  template: `
    <app-generic-list
      [items$]="departments$"
      [loading$]="loading$"
      [totalItems$]="totalItems$"
      [currentPage$]="currentPage$"
      [totalPages$]="totalPages$"
      [currentPageStart$]="currentPageStart$"
      [currentPageEnd$]="currentPageEnd$"
      [columns]="columns"
      [actions]="actions"
      title="Cadastro de Departamentos"
      createButtonLabel="Novo Departamento"
      createRoute="/departments/create"
      searchPlaceholder="Buscar por nome..."
      emptyMessage="Nenhum departamento encontrado"
      [searchFields]="['name']"
      (paginationChange)="onPaginationChange($event)"
      (delete)="onDelete($event)"
    ></app-generic-list>
  `
})
export class DepartmentsListComponent implements OnInit {
  departments$: Observable<Department[]>;
  loading$: Observable<boolean>;
  totalItems$: Observable<number>;
  currentPage$: Observable<number>;
  totalPages$: Observable<number>;
  currentPageStart$: Observable<number>;
  currentPageEnd$: Observable<number>;

  columns: ListColumn[] = [
    { key: 'id', label: 'ID', formatter: (val) => `#${val}`, sortable: true },
    { key: 'description', label: 'Descrição', formatter: (val) => val || '-', sortable: true }
  ];
  actions: GenericAction[] = [
    {
      label: 'Editar',
      icon: '✎',
      class: 'btn-info',
      callback: (item) => this.router.navigate(['/departments', item.id, 'edit'])
    },
    {
      label: 'Deletar',
      icon: '🗑',
      class: 'btn-danger',
      confirm: 'Tem certeza que deseja deletar este departamento?',
      callback: (item) => this.onDelete(item)
    }
  ];

  constructor(
    private store: Store<{ departments: any }>,
    private router: Router
  ) {
    this.departments$ = this.store.select(selectAllDepartments);
    this.loading$ = this.store.select(selectDepartmentsLoading);
    this.totalItems$ = this.store.select(selectTotalItems);
    this.currentPage$ = this.store.select(selectCurrentPage);
    this.totalPages$ = this.store.select(selectTotalPages);
    this.currentPageStart$ = this.store.select(selectCurrentPageStart);
    this.currentPageEnd$ = this.store.select(selectCurrentPageEnd);
  }

  ngOnInit(): void {
    this.store.dispatch(DepartmentsActions.loadDepartments({ params: { page: 1, pageSize: 10 } }));
  }

  onPaginationChange(params: PaginationParams): void {
    this.store.dispatch(DepartmentsActions.loadDepartments({ params }));
  }

  onDelete(item: Department): void {
    this.store.dispatch(DepartmentsActions.deleteDepartment({ id: item.id }));
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Employee } from '../../../core/services/employees.service';
import { GenericListComponent, ListColumn, PaginationParams } from '../../../shared/components/generic-list/generic-list.component';
import { GenericAction } from '../../../shared/components/generic-actions/generic-actions.component';
import { 
  selectAllEmployees, 
  selectEmployeesLoading,
  selectTotalItems,
  selectCurrentPage,
  selectTotalPages,
  selectCurrentPageStart,
  selectCurrentPageEnd
} from '../../../store/employees/employees.selectors';
import * as EmployeesActions from '../../../store/employees/employees.actions';

@Component({
  selector: 'app-employees-list',
  standalone: true,
  imports: [CommonModule, GenericListComponent],
  template: `
    <app-generic-list
      [items$]="employees$"
      [loading$]="loading$"
      [totalItems$]="totalItems$"
      [currentPage$]="currentPage$"
      [totalPages$]="totalPages$"
      [currentPageStart$]="currentPageStart$"
      [currentPageEnd$]="currentPageEnd$"
      [columns]="columns"
      [actions]="actions"
      title="Cadastro de Funcionários"
      createButtonLabel="Novo Funcionário"
      createRoute="/employees/create"
      searchPlaceholder="Buscar por nome ou email..."
      emptyMessage="Nenhum funcionário encontrado"
      [searchFields]="['fullName', 'employeeId']"
      (paginationChange)="onPaginationChange($event)"
      (delete)="onDelete($event)"
    ></app-generic-list>
  `
})
export class EmployeesListComponent implements OnInit {
  employees$: Observable<Employee[]>;
  loading$: Observable<boolean>;
  totalItems$: Observable<number>;
  currentPage$: Observable<number>;
  totalPages$: Observable<number>;
  currentPageStart$: Observable<number>;
  currentPageEnd$: Observable<number>;

  columns: ListColumn[] = [
    { key: 'id', label: 'ID', formatter: (val) => `#${val}`, sortable: true },
    { key: 'employeeId', label: 'Matrícula', sortable: true },
    { key: 'fullName', label: 'Nome', sortable: true },
    { key: 'departmentId', label: 'Departamento', formatter: (val) => val || '-', sortable: true },
    { key: 'isTechnician', label: 'Técnico', formatter: (val) => val ? 'Sim' : 'Não', sortable: true }
  ];
  actions: GenericAction[] = [
    {
      label: 'Editar',
      icon: '✎',
      class: 'btn-info',
      callback: (item) => this.router.navigate(['/employees', item.id, 'edit'])
    },
    {
      label: 'Deletar',
      icon: '🗑',
      class: 'btn-danger',
      confirm: 'Tem certeza que deseja deletar este funcionário?',
      callback: (item) => this.onDelete(item)
    }
  ];

  constructor(
    private store: Store<{ employees: any }>,
    private router: Router
  ) {
    this.employees$ = this.store.select(selectAllEmployees);
    this.loading$ = this.store.select(selectEmployeesLoading);
    this.totalItems$ = this.store.select(selectTotalItems);
    this.currentPage$ = this.store.select(selectCurrentPage);
    this.totalPages$ = this.store.select(selectTotalPages);
    this.currentPageStart$ = this.store.select(selectCurrentPageStart);
    this.currentPageEnd$ = this.store.select(selectCurrentPageEnd);
  }

  ngOnInit(): void {
    this.store.dispatch(EmployeesActions.loadEmployees({ params: { page: 1, pageSize: 10 } }));
  }

  onPaginationChange(params: PaginationParams): void {
    this.store.dispatch(EmployeesActions.loadEmployees({ params }));
  }

  onDelete(item: Employee): void {
    this.store.dispatch(EmployeesActions.deleteEmployee({ id: item.id }));
  }
}

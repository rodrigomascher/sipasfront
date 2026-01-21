import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Employee } from '../../../core/services/employees.service';
import { GenericListComponent, ListColumn } from '../../../shared/components/generic-list/generic-list.component';
import { GenericAction } from '../../../shared/components/generic-actions/generic-actions.component';
import { 
  selectAllEmployees, 
  selectEmployeesLoading
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
      [columns]="columns"
      [actions]="actions"
      title="Cadastro de Funcionários"
      createButtonLabel="Novo Funcionário"
      createRoute="/employees/create"
      searchPlaceholder="Buscar por nome ou email..."
      emptyMessage="Nenhum funcionário encontrado"
      [searchFields]="['name', 'email']"
      (delete)="onDelete($event)"
    ></app-generic-list>
  `
})
export class EmployeesListComponent implements OnInit {
  employees$: Observable<Employee[]>;
  loading$: Observable<boolean>;
  columns: ListColumn[] = [
    { key: 'id', label: 'ID', formatter: (val) => `#${val}` },
    { key: 'name', label: 'Nome' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Telefone', formatter: (val) => val || '-' },
    { key: 'position', label: 'Cargo', formatter: (val) => val || '-' }
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
  }

  ngOnInit(): void {
    this.store.dispatch(EmployeesActions.loadEmployees());
  }

  onDelete(item: Employee): void {
    this.store.dispatch(EmployeesActions.deleteEmployee({ id: item.id }));
  }
}

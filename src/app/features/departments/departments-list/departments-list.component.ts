import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Department } from '../../../core/services/departments.service';
import { GenericListComponent, ListColumn, ListAction } from '../../../shared/components/generic-list/generic-list.component';
import { 
  selectAllDepartments, 
  selectDepartmentsLoading
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
      [columns]="columns"
      [actions]="actions"
      title="Cadastro de Departamentos"
      createButtonLabel="Novo Departamento"
      createRoute="/departments/create"
      searchPlaceholder="Buscar por nome..."
      emptyMessage="Nenhum departamento encontrado"
      [searchFields]="['name']"
      (delete)="onDelete($event)"
    ></app-generic-list>
  `
})
export class DepartmentsListComponent implements OnInit {
  departments$: Observable<Department[]>;
  loading$: Observable<boolean>;
  columns: ListColumn[] = [
    { key: 'id', label: 'ID', formatter: (val) => `#${val}` },
    { key: 'name', label: 'Nome' },
    { key: 'description', label: 'Descrição', formatter: (val) => val || '-' }
  ];
  actions: ListAction[] = [
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
      callback: (item) => this.onDelete(item)
    }
  ];

  constructor(
    private store: Store<{ departments: any }>,
    private router: Router
  ) {
    this.departments$ = this.store.select(selectAllDepartments);
    this.loading$ = this.store.select(selectDepartmentsLoading);
  }

  ngOnInit(): void {
    this.store.dispatch(DepartmentsActions.loadDepartments());
  }

  onDelete(item: Department): void {
    if (confirm('Tem certeza que deseja deletar este departamento?')) {
      this.store.dispatch(DepartmentsActions.deleteDepartment({ id: item.id }));
    }
  }
}

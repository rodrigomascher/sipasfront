import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from '../../../core/services/users.service';
import { GenericListComponent, ListColumn, PaginationParams } from '../../../shared/components/generic-list/generic-list.component';
import { GenericAction } from '../../../shared/components/generic-actions/generic-actions.component';
import * as UsersActions from '../../../store/users/users.actions';
import * as UsersSelectors from '../../../store/users/users.selectors';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, GenericListComponent],
  template: `
    <app-generic-list
      [items$]="users$"
      [loading$]="loading$"
      [totalItems$]="totalItems$"
      [currentPage$]="currentPage$"
      [totalPages$]="totalPages$"
      [currentPageStart$]="currentPageStart$"
      [currentPageEnd$]="currentPageEnd$"
      [columns]="columns"
      [actions]="actions"
      title="Cadastro de Usuários"
      createButtonLabel="Novo Usuário"
      createRoute="/users/create"
      searchPlaceholder="Buscar por email ou nome..."
      emptyMessage="Nenhum usuário encontrado"
      [searchFields]="['email', 'name']"
      (paginationChange)="onPaginationChange($event)"
      (delete)="onDelete($event)"
    ></app-generic-list>
  `
})
export class UsersListComponent implements OnInit {
  users$: Observable<User[]>;
  loading$: Observable<boolean>;
  totalItems$: Observable<number>;
  currentPage$: Observable<number>;
  totalPages$: Observable<number>;
  currentPageStart$: Observable<number>;
  currentPageEnd$: Observable<number>;

  columns: ListColumn[] = [
    { key: 'id', label: 'ID', formatter: (val) => `#${val}`, sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'name', label: 'Nome', sortable: true },
    { key: 'isActive', label: 'Status', formatter: (val) => val ? 'Ativo' : 'Inativo' },
    { key: 'lastLogin', label: 'Último Acesso', formatter: (val) => val ? new Date(val).toLocaleDateString('pt-BR') : 'Nunca', sortable: true }
  ];
  actions: GenericAction[] = [
    {
      label: 'Editar',
      icon: '✎',
      class: 'btn-info',
      callback: (item) => this.router.navigate(['/users', item.id, 'edit'])
    },
    {
      label: 'Deletar',
      icon: '🗑',
      class: 'btn-danger',
      confirm: 'Tem certeza que deseja deletar este usuário?',
      callback: (item) => this.onDelete(item)
    }
  ];

  constructor(
    private store: Store<{ users: any }>,
    private router: Router
  ) {
    this.users$ = this.store.select(UsersSelectors.selectAllUsers);
    this.loading$ = this.store.select(UsersSelectors.selectUsersLoading);
    this.totalItems$ = this.store.select(UsersSelectors.selectTotalItems);
    this.currentPage$ = this.store.select(UsersSelectors.selectCurrentPage);
    this.totalPages$ = this.store.select(UsersSelectors.selectTotalPages);
    this.currentPageStart$ = this.store.select(UsersSelectors.selectCurrentPageStart);
    this.currentPageEnd$ = this.store.select(UsersSelectors.selectCurrentPageEnd);
  }

  ngOnInit(): void {
    this.store.dispatch(UsersActions.loadUsers({ params: { page: 1, pageSize: 10 } }));
  }

  onPaginationChange(params: PaginationParams): void {
    this.store.dispatch(UsersActions.loadUsers({ params }));
  }

  onDelete(item: User): void {
    this.store.dispatch(UsersActions.deleteUser({ id: item.id }));
  }
}

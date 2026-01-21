import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from '../../../core/services/users.service';
import { GenericListComponent, ListColumn, ListAction } from '../../../shared/components/generic-list/generic-list.component';
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
      [columns]="columns"
      [actions]="actions"
      title="Cadastro de Usuários"
      createButtonLabel="Novo Usuário"
      createRoute="/users/create"
      searchPlaceholder="Buscar por email ou nome..."
      emptyMessage="Nenhum usuário encontrado"
      [searchFields]="['email', 'name']"
      (delete)="onDelete($event)"
    ></app-generic-list>
  `
})
export class UsersListComponent implements OnInit {
  users$: Observable<User[]>;
  loading$: Observable<boolean>;
  columns: ListColumn[] = [
    { key: 'id', label: 'ID', formatter: (val) => `#${val}` },
    { key: 'email', label: 'Email' },
    { key: 'name', label: 'Nome' },
    { key: 'isActive', label: 'Status', formatter: (val) => val ? 'Ativo' : 'Inativo' },
    { key: 'lastLogin', label: 'Último Acesso', formatter: (val) => val ? new Date(val).toLocaleDateString('pt-BR') : 'Nunca' }
  ];
  actions: ListAction[] = [
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
      callback: (item) => this.onDelete(item)
    }
  ];

  constructor(
    private store: Store<{ users: any }>,
    private router: Router
  ) {
    this.users$ = this.store.select(UsersSelectors.selectAllUsers);
    this.loading$ = this.store.select(UsersSelectors.selectUsersLoading);
  }

  ngOnInit(): void {
    this.store.dispatch(UsersActions.loadUsers());
  }

  onDelete(item: User): void {
    if (confirm('Tem certeza que deseja deletar este usuário?')) {
      this.store.dispatch(UsersActions.deleteUser({ id: item.id }));
    }
  }
}

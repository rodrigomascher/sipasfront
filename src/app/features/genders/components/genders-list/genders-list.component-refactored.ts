import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Gender } from '../../../../core/services/genders.service';
import { GenericListComponent, ListColumn, ListAction } from '../../../../shared/components/generic-list/generic-list.component';
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
      [columns]="columns"
      [actions]="actions"
      title="Gêneros"
      createButtonLabel="Novo Gênero"
      createRoute="/genders/create"
      searchPlaceholder="Buscar por descrição..."
      emptyMessage="Nenhum gênero cadastrado"
      [searchFields]="['description']"
      (delete)="onDelete($event)"
    ></app-generic-list>
  `
})
export class GendersListComponent implements OnInit {
  genders$: Observable<Gender[]>;
  loading$: Observable<boolean>;
  columns: ListColumn[] = [
    { key: 'id', label: 'ID', formatter: (val) => `#${val}` },
    { key: 'description', label: 'Descrição' },
    { key: 'active', label: 'Ativo', formatter: (val) => val ? 'Sim' : 'Não' }
  ];
  actions: ListAction[] = [
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
      callback: (item) => this.onDelete(item)
    }
  ];

  constructor(
    private store: Store<{ genders: any }>,
    private router: Router
  ) {
    this.genders$ = this.store.select(GendersSelectors.selectAllGenders);
    this.loading$ = this.store.select(GendersSelectors.selectGendersLoading);
  }

  ngOnInit() {
    this.store.dispatch(GendersActions.loadGenders());
  }

  onDelete(item: Gender) {
    if (confirm('Tem certeza?')) {
      this.store.dispatch(GendersActions.deleteGender({ id: item.id }));
    }
  }
}

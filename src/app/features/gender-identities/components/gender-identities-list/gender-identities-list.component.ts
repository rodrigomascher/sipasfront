import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { GenderIdentity } from '../../../../core/services/gender-identities.service';
import { GenericListComponent, ListColumn, ListAction } from '../../../../shared/components/generic-list/generic-list.component';
import * as Actions from '../../store/gender-identities.actions';
import * as Selectors from '../../store/gender-identities.selectors';

@Component({
  selector: 'app-gender-identities-list',
  standalone: true,
  imports: [CommonModule, GenericListComponent],
  template: `
    <app-generic-list
      [items$]="genderIdentities$"
      [loading$]="loading$"
      [columns]="columns"
      [actions]="actions"
      title="Identidades de Gênero"
      createButtonLabel="Nova Identidade"
      createRoute="/gender-identities/create"
      searchPlaceholder="Buscar por descrição..."
      emptyMessage="Nenhuma identidade cadastrada"
      [searchFields]="['description']"
      (delete)="onDelete($event)"
    ></app-generic-list>
  `
})
export class GenderIdentitiesListComponent implements OnInit {
  genderIdentities$: Observable<GenderIdentity[]>;
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
      callback: (item) => this.router.navigate(['/gender-identities', item.id, 'edit'])
    },
    {
      label: 'Deletar',
      icon: '🗑',
      class: 'btn-danger',
      callback: (item) => this.onDelete(item)
    }
  ];

  constructor(
    private store: Store<{ genderIdentities: any }>,
    private router: Router
  ) {
    this.genderIdentities$ = this.store.select(Selectors.selectAllGenderIdentities);
    this.loading$ = this.store.select(Selectors.selectGenderIdentitiesLoading);
  }

  ngOnInit() {
    this.store.dispatch(Actions.loadGenderIdentities());
  }

  onDelete(item: GenderIdentity) {
    if (confirm('Tem certeza?')) {
      this.store.dispatch(Actions.deleteGenderIdentity({ id: item.id }));
    }
  }
}

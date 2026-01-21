import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { SexualOrientation } from '../../../../core/services/sexual-orientations.service';
import { GenericListComponent, ListColumn } from '../../../../shared/components/generic-list/generic-list.component';
import { GenericAction } from '../../../../shared/components/generic-actions/generic-actions.component';
import * as Actions from '../../store/sexual-orientations.actions';
import * as Selectors from '../../store/sexual-orientations.selectors';

@Component({
  selector: 'app-sexual-orientations-list',
  standalone: true,
  imports: [CommonModule, GenericListComponent],
  template: `
    <app-generic-list
      [items$]="sexualOrientations$"
      [loading$]="loading$"
      [columns]="columns"
      [actions]="actions"
      title="Orientações Sexuais"
      createButtonLabel="Nova Orientação"
      createRoute="/sexual-orientations/create"
      searchPlaceholder="Buscar por descrição..."
      emptyMessage="Nenhuma orientação cadastrada"
      [searchFields]="['description']"
      (delete)="onDelete($event)"
    ></app-generic-list>
  `
})
export class SexualOrientationsListComponent implements OnInit {
  sexualOrientations$: Observable<SexualOrientation[]>;
  loading$: Observable<boolean>;
  columns: ListColumn[] = [
    { key: 'id', label: 'ID', formatter: (val) => `#${val}` },
    { key: 'description', label: 'Descrição' },
    { key: 'active', label: 'Ativo', formatter: (val) => val ? 'Sim' : 'Não' }
  ];
  actions: GenericAction[] = [
    {
      label: 'Editar',
      icon: '✎',
      class: 'btn-info',
      callback: (item) => this.router.navigate(['/sexual-orientations', item.id, 'edit'])
    },
    {
      label: 'Deletar',
      icon: '🗑',
      class: 'btn-danger',
      confirm: 'Tem certeza?',
      callback: (item) => this.onDelete(item)
    }
  ];

  constructor(
    private store: Store<{ sexualOrientations: any }>,
    private router: Router
  ) {
    this.sexualOrientations$ = this.store.select(Selectors.selectAllSexualOrientations);
    this.loading$ = this.store.select(Selectors.selectSexualOrientationsLoading);
  }

  ngOnInit() {
    this.store.dispatch(Actions.loadSexualOrientations());
  }

  onDelete(item: SexualOrientation) {
    this.store.dispatch(Actions.deleteSexualOrientation({ id: item.id }));
  }
}

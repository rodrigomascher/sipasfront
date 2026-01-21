import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { FamilyComposition } from '../../../../core/services/family-composition.service';
import { GenericListComponent, ListColumn } from '../../../../shared/components/generic-list/generic-list.component';
import { GenericAction } from '../../../../shared/components/generic-actions/generic-actions.component';
import * as FamilyCompositionActions from '../../../../store/family-composition/family-composition.actions';
import * as FamilyCompositionSelectors from '../../../../store/family-composition/family-composition.selectors';

@Component({
  selector: 'app-family-composition-list',
  standalone: true,
  imports: [CommonModule, GenericListComponent],
  template: `
    <app-generic-list
      [items$]="familyCompositions$"
      [loading$]="loading$"
      [columns]="columns"
      [actions]="actions"
      title="Composição Familiar"
      createButtonLabel="Nova Composição"
      createRoute="/family-composition/create"
      searchPlaceholder="Buscar por ID da família ou pessoa..."
      emptyMessage="Nenhuma composição familiar encontrada"
      [searchFields]="['idFamilyComposition', 'idPerson']"
    ></app-generic-list>
  `
})
export class FamilyCompositionListComponent implements OnInit {
  familyCompositions$: Observable<FamilyComposition[]>;
  loading$: Observable<boolean>;
  columns: ListColumn[] = [
    { key: 'idFamilyComposition', label: 'ID Família', formatter: (val) => `#${val}` },
    { key: 'idPerson', label: 'ID Pessoa', formatter: (val) => `#${val}` },
    { key: 'responsible', label: 'Responsável', formatter: (val) => val ? 'Sim' : 'Não' },
    { key: 'createdBy', label: 'Criado Por' },
    { key: 'createdAt', label: 'Criado Em', formatter: (val) => new Date(val).toLocaleDateString() },
  ];
  actions: GenericAction[] = [
    {
      label: 'Editar',
      icon: '✎',
      class: 'btn-info',
      callback: (item) => this.router.navigate(['/family-composition', item.idFamilyComposition, item.idPerson, 'edit'])
    },
    {
      label: 'Deletar',
      icon: '🗑',
      class: 'btn-danger',
      confirm: 'Tem certeza que deseja deletar esta composição?',
      callback: (item) => this.onDelete(item)
    }
  ];

  constructor(
    private store: Store<{ familyComposition: any }>,
    private router: Router
  ) {
    this.familyCompositions$ = this.store.select(FamilyCompositionSelectors.selectAllFamilyCompositions);
    this.loading$ = this.store.select(FamilyCompositionSelectors.selectFamilyCompositionLoading);
  }

  ngOnInit(): void {
    this.store.dispatch(FamilyCompositionActions.loadFamilyCompositions());
  }

  onDelete(item: FamilyComposition): void {
    this.store.dispatch(FamilyCompositionActions.deleteFamilyComposition({ 
      idFamilyComposition: item.idFamilyComposition, 
      idPerson: item.idPerson 
    }));
  }
}

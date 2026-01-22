import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { FamilyComposition } from '../../../../core/services/family-composition.service';
import { GenericListComponent, ListColumn, PaginationParams } from '../../../../shared/components/generic-list/generic-list.component';
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
      [totalItems$]="totalItems$"
      [currentPage$]="currentPage$"
      [totalPages$]="totalPages$"
      [currentPageStart$]="currentPageStart$"
      [currentPageEnd$]="currentPageEnd$"
      [columns]="columns"
      [actions]="actions"
      title="Composição Familiar"
      createButtonLabel="Nova Composição"
      createRoute="/family-composition/create"
      searchPlaceholder="Buscar por ID da família ou pessoa..."
      emptyMessage="Nenhuma composição familiar encontrada"
      [searchFields]="['idFamilyComposition', 'idPerson']"
      (paginationChange)="onPaginationChange($event)"
    ></app-generic-list>
  `
})
export class FamilyCompositionListComponent implements OnInit {
  familyCompositions$: Observable<FamilyComposition[]>;
  loading$: Observable<boolean>;
  totalItems$: Observable<number>;
  currentPage$: Observable<number>;
  totalPages$: Observable<number>;
  currentPageStart$: Observable<number>;
  currentPageEnd$: Observable<number>;

  columns: ListColumn[] = [
    { key: 'idFamilyComposition', label: 'ID Família', formatter: (val) => `#${val}`, sortable: true },
    { key: 'idPerson', label: 'ID Pessoa', formatter: (val) => `#${val}`, sortable: true },
    { key: 'responsible', label: 'Responsável', formatter: (val) => val ? 'Sim' : 'Não' },
    { key: 'createdBy', label: 'Criado Por' },
    { key: 'createdAt', label: 'Criado Em', formatter: (val) => new Date(val).toLocaleDateString(), sortable: true },
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
    this.totalItems$ = this.store.select(FamilyCompositionSelectors.selectTotalItems);
    this.currentPage$ = this.store.select(FamilyCompositionSelectors.selectCurrentPage);
    this.totalPages$ = this.store.select(FamilyCompositionSelectors.selectTotalPages);
    this.currentPageStart$ = this.store.select(FamilyCompositionSelectors.selectCurrentPageStart);
    this.currentPageEnd$ = this.store.select(FamilyCompositionSelectors.selectCurrentPageEnd);
  }

  ngOnInit(): void {
    this.store.dispatch(FamilyCompositionActions.loadFamilyCompositions({ params: {} }));
  }

  onPaginationChange(params: PaginationParams): void {
    this.store.dispatch(FamilyCompositionActions.loadFamilyCompositions({ params }));
  }

  onDelete(item: FamilyComposition): void {
    this.store.dispatch(FamilyCompositionActions.deleteFamilyComposition({ 
      idFamilyComposition: item.idFamilyComposition, 
      idPerson: item.idPerson 
    }));
  }
}

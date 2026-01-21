import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { RelationshipDegree } from '../../../../core/services/relationship-degree.service';
import { GenericListComponent, ListColumn, PaginationParams } from '../../../../shared/components/generic-list/generic-list.component';
import { GenericAction } from '../../../../shared/components/generic-actions/generic-actions.component';
import * as RelationshipDegreeActions from '../../../../store/relationship-degree/relationship-degree.actions';
import * as RelationshipDegreeSelectors from '../../../../store/relationship-degree/relationship-degree.selectors';

@Component({
  selector: 'app-relationship-degree-list',
  standalone: true,
  imports: [CommonModule, GenericListComponent],
  template: `
    <app-generic-list
      [items$]="relationshipDegrees$"
      [loading$]="loading$"
      [totalItems$]="totalItems$"
      [currentPage$]="currentPage$"
      [totalPages$]="totalPages$"
      [currentPageStart$]="currentPageStart$"
      [currentPageEnd$]="currentPageEnd$"
      [columns]="columns"
      [actions]="actions"
      title="Graus de Parentesco"
      createButtonLabel="Novo Grau"
      createRoute="/relationship-degrees/create"
      searchPlaceholder="Buscar por descrição..."
      emptyMessage="Nenhum grau de parentesco encontrado"
      [searchFields]="['description']"
      (paginationChange)="onPaginationChange($event)"
    ></app-generic-list>
  `
})
export class RelationshipDegreeListComponent implements OnInit {
  relationshipDegrees$: Observable<RelationshipDegree[]>;
  loading$: Observable<boolean>;
  totalItems$: Observable<number>;
  currentPage$: Observable<number>;
  totalPages$: Observable<number>;
  currentPageStart$: Observable<number>;
  currentPageEnd$: Observable<number>;

  columns: ListColumn[] = [
    { key: 'id', label: 'ID', formatter: (val) => `#${val}`, sortable: true },
    { key: 'description', label: 'Descrição', sortable: true },
    { key: 'active', label: 'Ativo', formatter: (val) => val ? '✓' : '✗' },
    { key: 'createdBy', label: 'Criado Por' },
    { key: 'createdAt', label: 'Criado Em', formatter: (val) => new Date(val).toLocaleDateString(), sortable: true },
  ];
  actions: GenericAction[] = [
    {
      label: 'Editar',
      icon: '✎',
      class: 'btn-info',
      callback: (item) => this.router.navigate(['/relationship-degrees', item.id, 'edit'])
    },
    {
      label: 'Deletar',
      icon: '🗑',
      class: 'btn-danger',
      confirm: 'Tem certeza que deseja deletar este grau?',
      callback: (item) => this.onDelete(item)
    }
  ];

  constructor(
    private store: Store<{ relationshipDegree: any }>,
    private router: Router
  ) {
    this.relationshipDegrees$ = this.store.select(RelationshipDegreeSelectors.selectAllRelationshipDegrees);
    this.loading$ = this.store.select(RelationshipDegreeSelectors.selectRelationshipDegreeLoading);
    this.totalItems$ = this.store.select(RelationshipDegreeSelectors.selectTotalItems);
    this.currentPage$ = this.store.select(RelationshipDegreeSelectors.selectCurrentPage);
    this.totalPages$ = this.store.select(RelationshipDegreeSelectors.selectTotalPages);
    this.currentPageStart$ = this.store.select(RelationshipDegreeSelectors.selectCurrentPageStart);
    this.currentPageEnd$ = this.store.select(RelationshipDegreeSelectors.selectCurrentPageEnd);
  }

  ngOnInit(): void {
    this.store.dispatch(RelationshipDegreeActions.loadRelationshipDegrees({ params: {} }));
  }

  onPaginationChange(params: PaginationParams): void {
    this.store.dispatch(RelationshipDegreeActions.loadRelationshipDegrees({ params }));

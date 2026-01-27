import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { GenderIdentity } from '../../../../core/services/gender-identities.service';
import { GenericListComponent, ListColumn, PaginationParams } from '../../../../shared/components/generic-list/generic-list.component';
import { GenericAction } from '../../../../shared/components/generic-actions/generic-actions.component';
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
      [totalItems$]="totalItems$"
      [currentPage$]="currentPage$"
      [totalPages$]="totalPages$"
      [currentPageStart$]="currentPageStart$"
      [currentPageEnd$]="currentPageEnd$"
      [columns]="columns"
      [actions]="actions"
      title="Identidades de Gênero"
      createButtonLabel="Nova Identidade"
      createRoute="/gender-identities/create"
      searchPlaceholder="Buscar por descrição..."
      emptyMessage="Nenhuma identidade cadastrada"
      [searchFields]="['description']"
      (paginationChange)="onPaginationChange($event)"
    ></app-generic-list>
  `
})
export class GenderIdentitiesListComponent implements OnInit {
  genderIdentities$: Observable<GenderIdentity[]>;
  loading$: Observable<boolean>;
  totalItems$: Observable<number>;
  currentPage$: Observable<number>;
  totalPages$: Observable<number>;
  currentPageStart$: Observable<number>;
  currentPageEnd$: Observable<number>;
  columns: ListColumn[] = [
    { key: 'id', label: 'ID', formatter: (val) => `#${val}`, sortable: true },
    { key: 'description', label: 'Descrição', sortable: true },
    { key: 'active', label: 'Ativo', formatter: (val) => val ? 'Sim' : 'Não' }
  ];
  actions: GenericAction[] = [
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
      confirm: 'Tem certeza que deseja deletar esta identidade?',
      callback: (item) => this.onDelete(item)
    }
  ];

  constructor(
    private store: Store<{ genderIdentities: any }>,
    private router: Router
  ) {
    this.genderIdentities$ = this.store.select(Selectors.selectAllGenderIdentities);
    this.loading$ = this.store.select(Selectors.selectGenderIdentitiesLoading);
    this.totalItems$ = this.store.select(Selectors.selectTotalItems);
    this.currentPage$ = this.store.select(Selectors.selectCurrentPage);
    this.totalPages$ = this.store.select(Selectors.selectTotalPages);
    this.currentPageStart$ = this.store.select(Selectors.selectCurrentPageStart);
    this.currentPageEnd$ = this.store.select(Selectors.selectCurrentPageEnd);
  }

  ngOnInit(): void {
    this.store.dispatch(Actions.loadGenderIdentities({ params: { page: 1, pageSize: 10 } }));
  }

  onPaginationChange(params: PaginationParams): void {
    this.store.dispatch(Actions.loadGenderIdentities({ params }));
  }

  onDelete(item: GenderIdentity): void {
    this.store.dispatch(Actions.deleteGenderIdentity({ id: item.id }));
  }
}

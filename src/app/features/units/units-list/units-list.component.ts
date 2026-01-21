import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Unit } from '../../../core/services/units.service';
import { GenericListComponent, ListColumn } from '../../../shared/components/generic-list/generic-list.component';
import { GenericAction } from '../../../shared/components/generic-actions/generic-actions.component';
import { 
  selectAllUnits, 
  selectUnitsLoading
} from '../../../store/units/units.selectors';
import * as UnitsActions from '../../../store/units/units.actions';

@Component({
  selector: 'app-units-list',
  standalone: true,
  imports: [CommonModule, GenericListComponent],
  template: `
    <app-generic-list
      [items$]="units$"
      [loading$]="loading$"
      [columns]="columns"
      [actions]="actions"
      title="Cadastro de Unidades"
      createButtonLabel="Nova Unidade"
      createRoute="/units/create"
      searchPlaceholder="Buscar por cidade ou nome..."
      emptyMessage="Nenhuma unidade encontrada"
      [searchFields]="['city', 'name', 'type']"
      (delete)="onDelete($event)"
    ></app-generic-list>
  `
})
export class UnitsListComponent implements OnInit {
  units$: Observable<Unit[]>;
  loading$: Observable<boolean>;
  columns: ListColumn[] = [
    { key: 'id', label: 'ID', formatter: (val) => `#${val}` },
    { key: 'name', label: 'Nome' },
    { key: 'type', label: 'Tipo' },
    { key: 'city', label: 'Cidade' },
    { key: 'state', label: 'Estado' },
    { key: 'isArmored', label: 'Blindada', formatter: (val) => val ? 'Sim' : 'Não' }
  ];
  actions: GenericAction[] = [
    {
      label: 'Editar',
      icon: '✎',
      class: 'btn-info',
      callback: (item) => this.router.navigate(['/units', item.id, 'edit'])
    },
    {
      label: 'Deletar',
      icon: '🗑',
      class: 'btn-danger',
      confirm: 'Tem certeza que deseja deletar esta unidade?',
      callback: (item) => this.onDelete(item)
    }
  ];

  constructor(
    private store: Store<{ units: any }>,
    private router: Router
  ) {
    this.units$ = this.store.select(selectAllUnits);
    this.loading$ = this.store.select(selectUnitsLoading);
  }

  ngOnInit(): void {
    this.store.dispatch(UnitsActions.loadUnits());
  }

  onDelete(item: Unit): void {
    this.store.dispatch(UnitsActions.deleteUnit({ id: item.id }));
  }
}

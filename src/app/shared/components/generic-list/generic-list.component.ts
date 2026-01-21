import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil, debounceTime, startWith } from 'rxjs/operators';
import { GenericActionsComponent, GenericAction } from '../generic-actions/generic-actions.component';

export interface ListColumn {
  key: string;
  label: string;
  formatter?: (value: any) => string;
}

export type ListAction = GenericAction;

@Component({
  selector: 'app-generic-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, GenericActionsComponent],
  template: `
    <div class="container">
      <div class="header">
        <h1>{{ title }}</h1>
        <button class="btn btn-primary" [routerLink]="createRoute">+ {{ createButtonLabel }}</button>
      </div>

      <div class="search-box">
        <input
          type="text"
          [placeholder]="searchPlaceholder"
          [(ngModel)]="searchTerm"
          (ngModelChange)="onSearch()"
          class="search-input"
        />
      </div>

      <div *ngIf="loading$ | async" style="text-align: center; padding: 20px;">
        Carregando...
      </div>

      <table class="data-table" *ngIf="!(loading$ | async) && (filteredItems$ | async)?.length">
        <thead>
          <tr>
            <th *ngFor="let col of columns">{{ col.label }}</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let item of (filteredItems$ | async)">
            <td *ngFor="let col of columns">
              {{ col.formatter ? col.formatter(item[col.key]) : item[col.key] }}
            </td>
            <td>
              <app-generic-actions
                [actions]="actions"
                [item]="item"
                (actionTriggered)="onActionTriggered($event)"
              ></app-generic-actions>
            </td>
          </tr>
        </tbody>
      </table>

      <div *ngIf="(filteredItems$ | async)?.length === 0 && !(loading$ | async)" class="no-data">
        <p>{{ emptyMessage }}</p>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    h1 {
      margin: 0;
      font-size: 1.8rem;
      color: #333;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      text-decoration: none;
      display: inline-block;
    }

    .btn-primary {
      background-color: #1976d2;
      color: white;
    }

    .btn-primary:hover {
      background-color: #1565c0;
    }

    .search-box {
      margin-bottom: 1.5rem;
    }

    .search-input {
      width: 100%;
      max-width: 500px;
      padding: 0.75rem;
      font-size: 14px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .search-input:focus {
      outline: none;
      border-color: #1976d2;
      box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .data-table thead {
      background: #f8f9fa;
      border-bottom: 2px solid #dee2e6;
    }

    .data-table th {
      padding: 1rem;
      text-align: left;
      font-weight: 600;
      color: #333;
    }

    .data-table td {
      padding: 0.75rem 1rem;
      border-bottom: 1px solid #eee;
    }

    .data-table tbody tr:hover {
      background-color: #f9f9f9;
    }

    .no-data {
      text-align: center;
      padding: 40px;
      color: #999;
    }
  `]
})
export class GenericListComponent implements OnInit, OnDestroy {
  @Input() items$!: Observable<any[]>;
  @Input() loading$!: Observable<boolean>;
  @Input() columns: ListColumn[] = [];
  @Input() actions: ListAction[] = [];
  @Input() title: string = '';
  @Input() createButtonLabel: string = '+ Novo';
  @Input() createRoute: string = '';
  @Input() searchPlaceholder: string = 'Buscar...';
  @Input() emptyMessage: string = 'Nenhum item encontrado';
  @Input() searchFields: string[] = ['description'];

  @Output() delete = new EventEmitter<any>();

  filteredItems$!: Observable<any[]>;
  searchTerm: string = '';
  private searchTerm$ = new Subject<string>();
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.filteredItems$ = this.items$.pipe(
      takeUntil(this.destroy$),
      startWith([])
    );

    this.searchTerm$
      .pipe(
        debounceTime(300),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.filteredItems$ = this.items$.pipe(
          takeUntil(this.destroy$),
          startWith([])
        );
      });
  }

  onSearch() {
    this.searchTerm$.next(this.searchTerm);
    this.filteredItems$ = this.items$.pipe(
      startWith([]),
      takeUntil(this.destroy$)
    );
  }

  onActionTriggered(event: any) {
    // Handler for when an action is triggered
    // Can be used for logging or other side effects
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

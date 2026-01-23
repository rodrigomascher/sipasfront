import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { GenericActionsComponent, GenericAction } from '../generic-actions/generic-actions.component';
import { ButtonComponent } from '../button/button.component';

export interface ListColumn {
  key: string;
  label: string;
  formatter?: (value: any, item?: any) => string;
  sortable?: boolean;
}

export interface PaginationConfig {
  pageSize: number;
  pageSizeOptions: number[];
}

export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  search?: string;
}

export type ListAction = GenericAction;

@Component({
  selector: 'app-generic-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, GenericActionsComponent, ButtonComponent],
  template: `
    <div class="container">
      <div class="header">
        <h1>{{ title }}</h1>
        <app-button variant="primary" [routerLink]="createRoute">
          + {{ createButtonLabel }}
        </app-button>
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

      <table class="data-table" *ngIf="!(loading$ | async) && (items$ | async)?.length">
        <thead>
          <tr>
            <th 
              *ngFor="let col of columns"
              [class.sortable]="col.sortable"
              (click)="col.sortable && onSort(col.key)"
            >
              <div class="header-content">
                {{ col.label }}
                <span class="sort-icon" *ngIf="col.sortable && sortColumn === col.key">
                  {{ sortDirection === 'asc' ? '▲' : '▼' }}
                </span>
              </div>
            </th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let item of (items$ | async)">
            <td *ngFor="let col of columns">
              {{ col.formatter ? col.formatter(item[col.key], item) : item[col.key] }}
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

      <div *ngIf="(items$ | async)?.length === 0 && !(loading$ | async)" class="no-data">
        <p>{{ emptyMessage }}</p>
      </div>

      <!-- Pagination Controls -->
      <div class="pagination-container" *ngIf="(totalItems$ | async) && paginationConfig">
        <div class="pagination-info">
          Mostrando {{ (currentPageStart$ | async) }} a {{ (currentPageEnd$ | async) }} de {{ (totalItems$ | async) }} registros
        </div>
        
        <div class="pagination-controls">
          <select [(ngModel)]="pageSize" (change)="onPageSizeChange()" class="page-size-select">
            <option *ngFor="let size of paginationConfig.pageSizeOptions" [value]="size">
              {{ size }} registros
            </option>
          </select>

          <div class="pagination-buttons">
            <app-button 
              type="button"
              variant="secondary"
              size="small"
              (click)="previousPage()"
              [disabled]="(currentPage$ | async) === 1"
            >
              ← Anterior
            </app-button>

            <span class="page-info">
              Página {{ (currentPage$ | async) }} de {{ (totalPages$ | async) }}
            </span>

            <app-button 
              type="button"
              variant="secondary"
              size="small"
              (click)="nextPage()"
              [disabled]="(currentPage$ | async) === (totalPages$ | async)"
            >
              Próxima →
            </app-button>
          </div>
        </div>
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

    .btn-sm {
      padding: 0.5rem 1rem;
      font-size: 13px;
    }

    .btn-pagination {
      background-color: #e3e6f0;
      color: #525f7f;
      border: 1px solid #dee2e6;
    }

    .btn-pagination:hover:not(:disabled) {
      background-color: #d3d6e0;
    }

    .btn-pagination:disabled {
      opacity: 0.5;
      cursor: not-allowed;
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
      margin-bottom: 2rem;
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
      user-select: none;
    }

    .data-table th.sortable {
      cursor: pointer;
      transition: all 0.3s;
    }

    .data-table th.sortable:hover {
      background-color: #f0f0f0;
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .sort-icon {
      font-size: 0.8rem;
      color: #1976d2;
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

    .pagination-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 4px;
      margin-top: 1rem;
    }

    .pagination-info {
      font-size: 14px;
      color: #666;
    }

    .pagination-controls {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .page-size-select {
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 13px;
      cursor: pointer;
    }

    .pagination-buttons {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .page-info {
      font-size: 13px;
      color: #666;
      min-width: 120px;
      text-align: center;
    }
  `]
})
export class GenericListComponent implements OnInit, OnDestroy {
  @Input() items$!: Observable<any[]>;
  @Input() loading$!: Observable<boolean>;
  @Input() totalItems$!: Observable<number>;
  @Input() currentPage$!: Observable<number>;
  @Input() totalPages$!: Observable<number>;
  @Input() currentPageStart$!: Observable<number>;
  @Input() currentPageEnd$!: Observable<number>;
  @Input() columns: ListColumn[] = [];
  @Input() actions: ListAction[] = [];
  @Input() title: string = '';
  @Input() createButtonLabel: string = '+ Novo';
  @Input() createRoute: string = '';
  @Input() searchPlaceholder: string = 'Buscar...';
  @Input() emptyMessage: string = 'Nenhum item encontrado';
  @Input() searchFields: string[] = ['description'];
  @Input() paginationConfig: PaginationConfig = {
    pageSize: 10,
    pageSizeOptions: [5, 10, 25, 50, 100]
  };

  @Output() paginationChange = new EventEmitter<PaginationParams>();
  @Output() delete = new EventEmitter<any>();

  searchTerm: string = '';
  pageSize: number = 10;
  currentPage: number = 1;
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  private searchTerm$ = new Subject<string>();
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.pageSize = this.paginationConfig.pageSize;
    this.emitPaginationChange();

    this.searchTerm$
      .pipe(
        debounceTime(300),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.currentPage = 1;
        this.emitPaginationChange();
      });
  }

  onSearch() {
    this.searchTerm$.next(this.searchTerm);
  }

  onSort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.currentPage = 1;
    this.emitPaginationChange();
  }

  onPageSizeChange() {
    this.currentPage = 1;
    this.emitPaginationChange();
  }

  nextPage() {
    this.currentPage++;
    this.emitPaginationChange();
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.emitPaginationChange();
    }
  }

  private emitPaginationChange() {
    this.paginationChange.emit({
      page: this.currentPage,
      pageSize: this.pageSize,
      sortBy: this.sortColumn,
      sortDirection: this.sortDirection,
      search: this.searchTerm
    });
  }

  onActionTriggered(event: any) {
    // Handler for when an action is triggered
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

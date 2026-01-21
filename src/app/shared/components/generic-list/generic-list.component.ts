import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

export interface ListColumn {
  key: string;
  label: string;
  formatter?: (value: any) => string;
}

export interface ListAction {
  label: string;
  icon?: string;
  class: string;
  callback: (item: any) => void;
}

@Component({
  selector: 'app-generic-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
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

      <table class="data-table" *ngIf="!(loading$ | async)">
        <thead>
          <tr>
            <th *ngFor="let col of columns">{{ col.label }}</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let item of filteredItems">
            <td *ngFor="let col of columns">
              {{ col.formatter ? col.formatter(item[col.key]) : item[col.key] }}
            </td>
            <td class="actions">
              <button
                *ngFor="let action of actions"
                [class]="'btn-sm ' + action.class"
                (click)="action.callback(item)"
                [title]="action.label"
              >
                {{ action.icon ? action.icon + ' ' : '' }}{{ action.label }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div *ngIf="(items$ | async)?.length === 0 && !(loading$ | async)" class="no-data">
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

    .actions {
      display: flex;
      gap: 0.5rem;
      justify-content: center;
    }

    .btn-sm {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      text-decoration: none;
      display: inline-block;
    }

    .btn-info {
      background-color: #17a2b8;
      color: white;
    }

    .btn-info:hover {
      background-color: #138496;
    }

    .btn-danger {
      background-color: #dc3545;
      color: white;
    }

    .btn-danger:hover {
      background-color: #c82333;
    }

    .no-data {
      text-align: center;
      padding: 40px;
      color: #999;
    }
  `]
})
export class GenericListComponent implements OnInit {
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

  filteredItems: any[] = [];
  searchTerm: string = '';

  ngOnInit() {
    this.items$.subscribe(items => {
      this.filteredItems = items;
    });
  }

  onSearch() {
    this.items$.subscribe(items => {
      this.filteredItems = items.filter(item =>
        this.searchFields.some(field =>
          String(item[field]).toLowerCase().includes(this.searchTerm.toLowerCase())
        )
      );
    });
  }
}

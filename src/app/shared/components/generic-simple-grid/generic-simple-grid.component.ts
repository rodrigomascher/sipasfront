import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

export interface GridColumn {
  key: string;
  label: string;
  formatter?: (value: any, item?: any) => string;
}

export interface GridAction {
  label: string;
  callback: (item: any) => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
}

@Component({
  selector: 'app-generic-simple-grid',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <!-- Grid com dados -->
    <div class="generic-grid" *ngIf="items && items.length > 0">
      <table class="table table-sm">
        <thead>
          <tr>
            <th *ngFor="let col of columns">{{ col.label }}</th>
            <th *ngIf="actions && actions.length > 0">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let item of items">
            <td *ngFor="let col of columns">
              {{ col.formatter ? col.formatter(item[col.key], item) : item[col.key] }}
            </td>
            <td *ngIf="actions && actions.length > 0" class="actions-cell">
              <app-button 
                type="button"
                *ngFor="let action of actions"
                size="small"
                [variant]="action.variant || 'primary'"
                (click)="onAction(action, item)"
                [disabled]="isLoading"
              >
                {{ action.label }}
              </app-button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mensagem vazia -->
    <div class="alert alert-info" *ngIf="!items || items.length === 0">
      {{ emptyMessage }}
    </div>
  `,
  styles: [`
    @import '../../styles/alert-styles.scss';

    .generic-grid {
      margin-bottom: 15px;
      border: 1px solid #ddd;
      border-radius: 4px;
      overflow: hidden;
      background: white;
    }

    .table {
      margin: 0;
      font-size: 14px;
      width: 100%;
      border-collapse: collapse;
    }

    .table thead {
      background: #f5f5f5;
    }

    .table thead th {
      padding: 12px;
      font-weight: 600;
      color: #333;
      border-bottom: 2px solid #ddd;
      text-align: left;
    }

    .table tbody td {
      padding: 10px 12px;
      border-bottom: 1px solid #eee;
    }

    .table tbody tr:hover {
      background: #fafafa;
    }

    .actions-cell {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }
  `]
})
export class GenericSimpleGridComponent {
  @Input() items: any[] = [];
  @Input() columns: GridColumn[] = [];
  @Input() actions: GridAction[] = [];
  @Input() emptyMessage: string = 'Nenhum registro encontrado';
  @Input() isLoading: boolean = false;

  onAction(action: GridAction, item: any): void {
    action.callback(item);
  }
}

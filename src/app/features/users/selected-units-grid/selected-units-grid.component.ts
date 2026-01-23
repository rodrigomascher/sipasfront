import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-selected-units-grid',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <!-- Grid de unidades selecionadas -->
    <div class="user-units-grid" *ngIf="units && units.length > 0">
      <table class="table table-sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Tipo</th>
            <th>Cidade</th>
            <th>Estado</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let unit of units">
            <td>{{ unit.id }}</td>
            <td>{{ unit.name }}</td>
            <td>{{ unit.type }}</td>
            <td>{{ unit.city }}</td>
            <td>{{ unit.state }}</td>
            <td>
              <app-button 
                type="button"
                variant="danger"
                size="small"
                (click)="onRemove(unit.id)"
                [disabled]="isLoading"
              >
                Remover
              </app-button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mensagem vazia -->
    <div class="alert alert-info" *ngIf="!units || units.length === 0">
      {{ emptyMessage }}
    </div>
  `,
  styles: [`
    .user-units-grid {
      margin-bottom: 15px;
      border: 1px solid #ddd;
      border-radius: 4px;
      overflow: hidden;
      background: white;
    }

    .table {
      margin: 0;
      font-size: 14px;
    }

    .table thead {
      background: #f5f5f5;
    }

    .table thead th {
      padding: 12px;
      font-weight: 600;
      color: #333;
      border-bottom: 2px solid #ddd;
    }

    .table tbody td {
      padding: 10px 12px;
      border-bottom: 1px solid #eee;
    }

    .table tbody tr:hover {
      background: #fafafa;
    }

    .btn-sm {
      padding: 4px 8px;
      font-size: 12px;
    }

    .btn {
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.3s;
    }

    .btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .alert {
      margin: 0;
      padding: 12px 15px;
      border-radius: 4px;
      background: #d1ecf1;
      color: #0c5460;
      border: 1px solid #bee5eb;
    }
  `]
})
export class SelectedUnitsGridComponent {
  @Input() units: any[] = [];
  @Input() emptyMessage: string = 'Nenhuma unidade selecionada';
  @Input() isLoading: boolean = false;
  @Output() unitRemoved = new EventEmitter<number>();

  onRemove(unitId: number): void {
    this.unitRemoved.emit(unitId);
  }
}

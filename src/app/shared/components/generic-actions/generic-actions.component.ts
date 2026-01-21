import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface GenericAction {
  label: string;
  icon?: string;
  class: string;
  callback: (item: any) => void;
  confirm?: string;
}

@Component({
  selector: 'app-generic-actions',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="actions">
      <button
        *ngFor="let action of actions"
        [class]="'btn-sm ' + action.class"
        (click)="handleAction(action)"
        [title]="action.label"
      >
        {{ action.icon ? action.icon + ' ' : '' }}{{ action.label }}
      </button>
    </div>
  `,
  styles: [`
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

    .btn-warning {
      background-color: #ffc107;
      color: #333;
    }

    .btn-warning:hover {
      background-color: #e0a800;
    }
  `]
})
export class GenericActionsComponent {
  @Input() actions: GenericAction[] = [];
  @Input() item: any;

  @Output() actionTriggered = new EventEmitter<{ action: GenericAction; item: any }>();

  handleAction(action: GenericAction) {
    if (action.confirm) {
      if (confirm(action.confirm)) {
        action.callback(this.item);
        this.actionTriggered.emit({ action, item: this.item });
      }
    } else {
      action.callback(this.item);
      this.actionTriggered.emit({ action, item: this.item });
    }
  }
}

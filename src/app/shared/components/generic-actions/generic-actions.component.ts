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

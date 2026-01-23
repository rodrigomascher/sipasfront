import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { GenericFormComponent } from '../generic-form/generic-form.component';
import { FormFieldComponent } from '../generic-form/form-field.component';
import { FormFieldConfig } from '../generic-form/form-field-config';
import { ButtonComponent } from '../button/button.component';

export interface TabConfig {
  title: string;
  fields: FormFieldConfig[];
}

@Component({
  selector: 'app-tabbed-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FormFieldComponent, ButtonComponent],
  template: `
    <div class="container">
      <div class="header">
        <h2>{{ title }}</h2>
      </div>

      <div *ngIf="error$ | async as error" class="alert alert-error">
        Erro: {{ error }}
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" *ngIf="!(loading$ | async)">
        <!-- Tab Navigation -->
        <div class="tabs">
          <button
            *ngFor="let tab of tabs; let i = index"
            type="button"
            [class.active]="selectedTab === i"
            (click)="selectTab(i)"
            class="tab-button"
          >
            {{ tab.title }}
          </button>
        </div>

        <!-- Tab Content -->
        <div class="tab-content">
          <div class="form-row">
            <app-form-field
              *ngFor="let field of currentTabFields"
              [field]="field"
              [form]="form"
            ></app-form-field>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="form-actions">
          <app-button 
            type="submit" 
            variant="primary"
            [loading]="(loading$ | async) || false"
            [disabled]="form.invalid"
            loadingText="Salvando..."
          >
            {{ isEditMode ? 'Atualizar' : 'Criar' }}
          </app-button>
          <app-button type="button" variant="secondary" [routerLink]="backRoute">
            Cancelar
          </app-button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
      max-width: 900px;
      margin: 0 auto;
    }

    .header {
      margin-bottom: 20px;
    }

    h2 {
      margin: 0;
      font-size: 2rem;
      color: #333;
    }

    .tabs {
      display: flex;
      gap: 5px;
      border-bottom: 2px solid #ddd;
      margin-bottom: 20px;
      overflow-x: auto;
      flex-wrap: wrap;
    }

    .tab-button {
      padding: 12px 16px;
      border: none;
      background: transparent;
      cursor: pointer;
      font-size: 14px;
      white-space: nowrap;
      border-bottom: 3px solid transparent;
      color: #666;
      transition: all 0.3s ease;
    }

    .tab-button:hover {
      color: #1976d2;
    }

    .tab-button.active {
      color: #1976d2;
      border-bottom-color: #1976d2;
      font-weight: 600;
    }

    .tab-content {
      background: white;
      padding: 20px;
      border-radius: 4px;
      margin-bottom: 20px;
      animation: fadeIn 0.3s ease-in;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }

    .form-actions {
      display: flex;
      gap: 10px;
      justify-content: flex-start;
      margin-top: 30px;
    }

    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      text-decoration: none;
      display: inline-block;
      transition: all 0.3s ease;
      font-weight: 500;
    }

    .btn-primary {
      background-color: #1976d2;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #1565c0;
    }

    .btn-primary:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    .btn-outline {
      background-color: transparent;
      color: #1976d2;
      border: 1px solid #1976d2;
    }

    .btn-outline:hover {
      background-color: #f0f0f0;
    }

    .alert {
      padding: 12px;
      border-radius: 4px;
      margin-bottom: 20px;
    }

    .alert-error {
      background-color: #ffebee;
      color: #c62828;
      border: 1px solid #ef5350;
    }
  `]
})
export class TabbedFormComponent {
  @Input() title = 'Formulário';
  @Input() tabs: TabConfig[] = [];
  @Input() form!: FormGroup;
  @Input() backRoute: string = '/';
  @Input() loading$!: Observable<boolean>;
  @Input() error$!: Observable<string | null>;
  @Input() isEditMode = false;

  @Output() submit = new EventEmitter<any>();

  selectedTab = 0;

  get currentTabFields(): FormFieldConfig[] {
    return this.tabs[this.selectedTab]?.fields || [];
  }

  selectTab(index: number): void {
    this.selectedTab = index;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }
    this.submit.emit(this.form.value);
  }
}

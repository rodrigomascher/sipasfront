import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { FormFieldConfig } from './form-field-config';
import { FormFieldComponent } from './form-field.component';

/**
 * Generic form component
 * Reusable form wrapper with title, fields, actions, and error handling
 * Eliminates duplicated form templates across modules
 */
@Component({
  selector: 'app-generic-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FormFieldComponent],
  template: `
    <div class="container">
      <div class="form-header">
        <h1>{{ title }}</h1>
        <button type="button" class="btn btn-secondary" [routerLink]="backRoute">
          ← Voltar
        </button>
      </div>

      <div class="form-card">
        <form [formGroup]="form" (ngSubmit)="onSubmit($event)">
          <!-- Grid para campos -->
          <div class="form-grid">
            <app-form-field
              *ngFor="let field of fields"
              [field]="field"
              [form]="form"
              [ngClass]="{
                'col-span-2': field.colSpan === 2,
                'col-span-3': field.colSpan === 3,
                'col-span-4': field.colSpan === 4
              }"
            ></app-form-field>
          </div>

          <!-- Erro geral do formulário -->
          <div *ngIf="error$ | async as error" class="alert alert-danger">
            {{ error }}
          </div>

          <!-- Botões de ação -->
          <div class="form-actions">
            <button
              type="submit"
              class="btn btn-primary"
              [disabled]="form.invalid || (loading$ | async)"
            >
              {{ (loading$ | async) ? 'Salvando...' : (submitLabel || 'Salvar') }}
            </button>
            <button type="button" class="btn btn-secondary" [routerLink]="backRoute">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 2rem;
      max-width: 900px;
      margin: 0 auto;
    }

    .form-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    h1 {
      margin: 0;
      font-size: 2rem;
      color: #333;
    }

    .form-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    @media (min-width: 768px) {
      .form-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.3s;
    }

    .btn-primary {
      background-color: #1976d2;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #1565c0;
      box-shadow: 0 2px 8px rgba(25, 118, 210, 0.3);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-secondary {
      background-color: #f5f5f5;
      color: #333;
      border: 1px solid #ddd;
    }

    .btn-secondary:hover {
      background-color: #e8e8e8;
    }

    .alert-danger {
      margin-bottom: 1.5rem;
      padding: 1rem;
      background-color: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
      border-radius: 4px;
    }
  `]
})
export class GenericFormComponent {
  @Input() title!: string;
  @Input() fields!: FormFieldConfig[];
  @Input() form!: FormGroup;
  @Input() backRoute!: string;
  @Input() submitLabel?: string;
  @Input() loading$!: Observable<boolean>;
  @Input() error$!: Observable<string | null>;
  @Output() submit = new EventEmitter<any>();

  private isSubmitting = false;

  onSubmit(event?: Event): void {
    // Prevent default form submission to avoid double submit
    if (event) {
      event.preventDefault();
    }
    
    if (this.form.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      console.log('[GenericFormComponent] Emitting form value:', this.form.value);
      this.submit.emit(this.form.value);
      
      // Reset the flag after a short delay to allow for the submit to be processed
      setTimeout(() => {
        this.isSubmitting = false;
      }, 100);
    }
  }
}

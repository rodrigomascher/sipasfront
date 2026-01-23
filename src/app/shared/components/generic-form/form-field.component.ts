import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { FormFieldConfig } from './form-field-config';

/**
 * Generic form field component
 * Renders individual form fields based on configuration
 * Supports: text, number, email, select, checkbox, textarea, date, tel
 */
@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div [ngSwitch]="field.type" class="form-group" [class]="field.class">
      <!-- Text, Number, Email, Tel inputs -->
      <ng-container *ngSwitchCase="'text'">
        <label [for]="field.name">
          {{ field.label }}
          <span *ngIf="field.required" class="required">*</span>
        </label>
        <input
          type="text"
          [id]="field.name"
          [formControl]="control"
          [placeholder]="field.placeholder || ''"
          [maxlength]="field.maxLength || null"
          [disabled]="field.disabled || false"
          class="form-control"
        />
      </ng-container>

      <ng-container *ngSwitchCase="'number'">
        <label [for]="field.name">
          {{ field.label }}
          <span *ngIf="field.required" class="required">*</span>
        </label>
        <input
          type="number"
          [id]="field.name"
          [formControl]="control"
          [placeholder]="field.placeholder || ''"
          [min]="field.min || null"
          [max]="field.max || null"
          [disabled]="field.disabled || false"
          class="form-control"
        />
      </ng-container>

      <ng-container *ngSwitchCase="'email'">
        <label [for]="field.name">
          {{ field.label }}
          <span *ngIf="field.required" class="required">*</span>
        </label>
        <input
          type="email"
          [id]="field.name"
          [formControl]="control"
          [placeholder]="field.placeholder || ''"
          [disabled]="field.disabled || false"
          class="form-control"
        />
      </ng-container>

      <ng-container *ngSwitchCase="'tel'">
        <label [for]="field.name">
          {{ field.label }}
          <span *ngIf="field.required" class="required">*</span>
        </label>
        <input
          type="tel"
          [id]="field.name"
          [formControl]="control"
          [placeholder]="field.placeholder || ''"
          [disabled]="field.disabled || false"
          class="form-control"
        />
      </ng-container>

      <ng-container *ngSwitchCase="'select'">
        <label [for]="field.name">
          {{ field.label }}
          <span *ngIf="field.required" class="required">*</span>
        </label>
        <select
          [id]="field.name"
          [formControl]="control"
          [disabled]="field.disabled || false"
          class="form-control"
        >
          <option value="">Selecione uma opção</option>
          <option *ngFor="let option of (field.options$ | async) || field.options" [value]="option.value || option.id">
            {{ option.label || option.name }}
          </option>
        </select>
      </ng-container>

      <ng-container *ngSwitchCase="'checkbox'">
        <label class="checkbox-label">
          <input
            type="checkbox"
            [id]="field.name"
            [formControl]="control"
            [disabled]="field.disabled || false"
          />
          {{ field.label }}
        </label>
      </ng-container>

      <ng-container *ngSwitchCase="'textarea'">
        <label [for]="field.name">
          {{ field.label }}
          <span *ngIf="field.required" class="required">*</span>
        </label>
        <textarea
          [id]="field.name"
          [formControl]="control"
          [placeholder]="field.placeholder || ''"
          [disabled]="field.disabled || false"
          class="form-control"
          rows="4"
        ></textarea>
      </ng-container>

      <ng-container *ngSwitchCase="'date'">
        <label [for]="field.name">
          {{ field.label }}
          <span *ngIf="field.required" class="required">*</span>
        </label>
        <input
          type="date"
          [id]="field.name"
          [formControl]="control"
          [disabled]="field.disabled || false"
          class="form-control"
        />
      </ng-container>

      <!-- Error messages -->
      <div *ngIf="control.invalid && control.touched" class="form-error">
        <span *ngIf="control.errors?.['required']">
          {{ field.errorMessages?.['required'] || field.label + ' é obrigatório' }}
        </span>
        <span *ngIf="control.errors?.['email']">
          {{ field.errorMessages?.['email'] || 'Email inválido' }}
        </span>
        <span *ngIf="control.errors?.['min']">
          {{ field.errorMessages?.['min'] || 'Valor mínimo: ' + field.min }}
        </span>
        <span *ngIf="control.errors?.['max']">
          {{ field.errorMessages?.['max'] || 'Valor máximo: ' + field.max }}
        </span>
      </div>

      <!-- Hint text -->
      <small *ngIf="field.hint && control.valid" class="form-hint">
        {{ field.hint }}
      </small>
    </div>
  `,
  styles: [`
    .checkbox-label {
      display: flex;
      align-items: center;
      margin-bottom: 0;
      cursor: pointer;
      font-weight: normal;
    }

    textarea {
      resize: vertical;
      font-family: inherit;
    }

    .form-error {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .form-hint {
      display: block;
      color: #6c757d;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
  `]
})
export class FormFieldComponent implements OnInit {
  @Input() field!: FormFieldConfig;
  @Input() form!: FormGroup;

  control: any;

  ngOnInit(): void {
    this.control = this.form.get(this.field.name);
  }
}

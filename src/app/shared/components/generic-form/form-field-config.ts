/**
 * Configuration interface for form fields
 * Used by GenericFormComponent and FormFieldComponent to render dynamic form fields
 */
import { Observable } from 'rxjs';

export interface FormFieldConfig {
  /** Unique field identifier and form control name */
  name: string;

  /** Display label for the field */
  label: string;

  /** Input type (text, number, email, select, checkbox, textarea, date, tel) */
  type: 'text' | 'number' | 'email' | 'select' | 'checkbox' | 'textarea' | 'date' | 'tel';

  /** Placeholder text (optional) */
  placeholder?: string;

  /** Is this field required? */
  required?: boolean;

  /** CSS grid column span (default: 1) */
  colSpan?: 1 | 2 | 3 | 4;

  /** Options for select fields */
  options?: { label: string; value: any }[];

  /** Options observable for dynamic options (select) */
  options$?: Observable<any[]>;

  /** Max length for text inputs */
  maxLength?: number;

  /** Min value for number inputs */
  min?: number;

  /** Max value for number inputs */
  max?: number;

  /** Help text displayed below the field */
  hint?: string;

  /** Validation error messages */
  errorMessages?: {
    [key: string]: string;
  };

  /** Custom CSS class */
  class?: string;

  /** Is the field disabled? */
  disabled?: boolean;
}

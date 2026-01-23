import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject, Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

/**
 * Interface for auto-save configuration
 */
export interface AutoSaveConfig {
  debounceMs?: number;      // Milliseconds to wait before saving (default: 2000)
  draftKey?: string;        // LocalStorage key for drafts
  enableDraftRecovery?: boolean; // Auto-recover drafts on load
}

/**
 * Interface for draft data
 */
export interface DraftData<T> {
  data: T;
  timestamp: number;
  formKey: string;
}

/**
 * Auto-Save Service
 * 
 * Automatically saves form data as user types with debouncing.
 * Features:
 * - Debounced saves to prevent excessive API calls
 * - Draft recovery from local storage
 * - Save status tracking
 * - Error handling and retry
 * 
 * @example
 * constructor(private autoSaveService: AutoSaveService) {}
 * 
 * ngOnInit() {
 *   this.autoSaveService.enable(this.form, {
 *     debounceMs: 2000,
 *     draftKey: 'person-form-draft',
 *     enableDraftRecovery: true
 *   }, (data) => this.personService.updatePerson(id, data));
 * }
 * 
 * ngOnDestroy() {
 *   this.autoSaveService.disable();
 * }
 */
@Injectable({
  providedIn: 'root'
})
export class AutoSaveService {
  private subscription: Subscription | null = null;
  private saveSubject$ = new Subject<any>();
  private isSaving$ = new Subject<boolean>();
  private saveError$ = new Subject<string | null>();
  private lastSavedData: any = null;
  private config: Required<AutoSaveConfig> = {
    debounceMs: 2000,
    draftKey: 'auto-save-draft',
    enableDraftRecovery: true
  };

  private isEnabled = false;

  constructor() {}

  /**
   * Enable auto-save for a form
   * 
   * @param {FormGroup} form - The form to auto-save
   * @param {AutoSaveConfig} config - Configuration options
   * @param {(data: any) => Observable<any>} saveFunction - Function to call on save
   * @returns {Observable<any>} Observable of save results
   * 
   * @example
   * this.autoSaveService.enable(
   *   this.form,
   *   { debounceMs: 2000 },
   *   (data) => this.service.update(id, data)
   * ).subscribe(
   *   result => console.log('Saved:', result),
   *   error => console.error('Save failed:', error)
   * );
   */
  enable<T>(
    form: FormGroup,
    config: AutoSaveConfig = {},
    saveFunction: (data: T) => Observable<any>
  ): Observable<any> {
    if (this.isEnabled) {
      this.disable();
    }

    // Merge config with defaults
    this.config = { ...this.config, ...config };
    this.isEnabled = true;

    // Enable draft recovery if configured
    if (this.config.enableDraftRecovery) {
      const draft = this.recoverDraft();
      if (draft) {
        form.patchValue(draft, { emitEvent: false });
      }
    }

    // Setup auto-save trigger
    this.subscription = form.valueChanges
      .pipe(
        debounceTime(this.config.debounceMs),
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr))
      )
      .subscribe((formData) => {
        this.performSave(formData, saveFunction);
      });

    return this.saveSubject$.asObservable();
  }

  /**
   * Disable auto-save
   */
  disable(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
    this.isEnabled = false;
  }

  /**
   * Get observable for save status
   */
  isSaving$(): Observable<boolean> {
    return this.isSaving$.asObservable();
  }

  /**
   * Get observable for save errors
   */
  saveError$(): Observable<string | null> {
    return this.saveError$.asObservable();
  }

  /**
   * Get last saved data
   */
  getLastSavedData(): any {
    return this.lastSavedData;
  }

  /**
   * Check if form has unsaved changes
   */
  hasUnsavedChanges(currentData: any): boolean {
    return JSON.stringify(this.lastSavedData) !== JSON.stringify(currentData);
  }

  /**
   * Perform the save operation
   */
  private performSave<T>(formData: T, saveFunction: (data: T) => Observable<any>): void {
    // Don't save if data hasn't changed
    if (JSON.stringify(this.lastSavedData) === JSON.stringify(formData)) {
      return;
    }

    this.isSaving$.next(true);
    this.saveError$.next(null);

    // Save draft to local storage
    this.saveDraft(formData);

    // Call save function
    saveFunction(formData).subscribe(
      (result) => {
        this.lastSavedData = formData;
        this.isSaving$.next(false);
        this.saveSubject$.next({ success: true, data: result });
        // Clear draft on successful save
        this.clearDraft();
      },
      (error) => {
        this.isSaving$.next(false);
        const errorMessage = error?.error?.message || 'Erro ao salvar automaticamente';
        this.saveError$.next(errorMessage);
        this.saveSubject$.next({ success: false, error });
        // Keep draft in case of error
      }
    );
  }

  /**
   * Save form data to local storage as draft
   */
  private saveDraft<T>(data: T): void {
    try {
      const draft: DraftData<T> = {
        data,
        timestamp: Date.now(),
        formKey: this.config.draftKey
      };
      localStorage.setItem(this.config.draftKey, JSON.stringify(draft));
    } catch (error) {
      console.error('Failed to save draft:', error);
    }
  }

  /**
   * Recover draft data from local storage
   */
  private recoverDraft<T>(): T | null {
    try {
      const draft = localStorage.getItem(this.config.draftKey);
      if (draft) {
        const parsed: DraftData<T> = JSON.parse(draft);
        return parsed.data;
      }
    } catch (error) {
      console.error('Failed to recover draft:', error);
    }
    return null;
  }

  /**
   * Clear draft data from local storage
   */
  private clearDraft(): void {
    try {
      localStorage.removeItem(this.config.draftKey);
    } catch (error) {
      console.error('Failed to clear draft:', error);
    }
  }

  /**
   * Manually trigger a save
   */
  save<T>(data: T, saveFunction: (data: T) => Observable<any>): void {
    this.performSave(data, saveFunction);
  }

  /**
   * Get all drafts from storage
   */
  getAllDrafts(): DraftData<any>[] {
    const drafts: DraftData<any>[] = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('draft') || key.includes('auto-save'))) {
          const item = localStorage.getItem(key);
          if (item) {
            drafts.push(JSON.parse(item));
          }
        }
      }
    } catch (error) {
      console.error('Failed to retrieve drafts:', error);
    }
    return drafts;
  }

  /**
   * Clear all drafts from storage
   */
  clearAllDrafts(): void {
    try {
      const keysToDelete: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('draft') || key.includes('auto-save'))) {
          keysToDelete.push(key);
        }
      }
      keysToDelete.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Failed to clear drafts:', error);
    }
  }

  /**
   * Get storage usage statistics
   */
  getStorageStats(): { totalSize: number; formDrafts: number; estimatedSize: string } {
    let totalSize = 0;
    let formDrafts = 0;

    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key || '');
        if (key && value) {
          totalSize += key.length + value.length;
          if (key.includes('draft') || key.includes('auto-save')) {
            formDrafts++;
          }
        }
      }
    } catch (error) {
      console.error('Failed to get storage stats:', error);
    }

    return {
      totalSize,
      formDrafts,
      estimatedSize: `${(totalSize / 1024).toFixed(2)} KB`
    };
  }
}

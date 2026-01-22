import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Unit {
  id: number;
  name: string;
  type: string;
  city: string;
  state: string;
}

@Injectable({
  providedIn: 'root'
})
export class SelectedUnitService {
  private readonly STORAGE_KEY = 'selectedUnit';
  private selectedUnitSubject = new BehaviorSubject<Unit | null>(
    this.getSelectedUnitFromStorage()
  );

  selectedUnit$: Observable<Unit | null> = this.selectedUnitSubject.asObservable();

  constructor() {}

  /**
   * Set the selected unit
   */
  setSelectedUnit(unit: Unit | null): void {
    if (unit) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(unit));
    } else {
      localStorage.removeItem(this.STORAGE_KEY);
    }
    this.selectedUnitSubject.next(unit);
  }

  /**
   * Get the currently selected unit (synchronous)
   */
  getSelectedUnit(): Unit | null {
    return this.selectedUnitSubject.value;
  }

  /**
   * Get the currently selected unit as Observable
   */
  getSelectedUnit$(): Observable<Unit | null> {
    return this.selectedUnit$;
  }

  /**
   * Clear the selected unit
   */
  clearSelectedUnit(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.selectedUnitSubject.next(null);
  }

  /**
   * Get selected unit from localStorage
   */
  private getSelectedUnitFromStorage(): Unit | null {
    try {
      const unit = localStorage.getItem(this.STORAGE_KEY);
      return unit ? JSON.parse(unit) : null;
    } catch {
      return null;
    }
  }

  /**
   * Check if a unit is selected
   */
  isUnitSelected(): boolean {
    return this.selectedUnitSubject.value !== null;
  }
}

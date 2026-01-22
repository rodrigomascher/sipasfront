import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';

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
  private selectedUnitSubject = new BehaviorSubject<Unit | null>(null);
  private isSelectingUnitSubject = new BehaviorSubject<boolean>(false);

  selectedUnit$: Observable<Unit | null> = this.selectedUnitSubject.asObservable();
  isSelectingUnit$: Observable<boolean> = this.isSelectingUnitSubject.asObservable();

  constructor(private authService: AuthService) {
    // Inicializar com a unidade do JWT
    this.refreshFromJWT();
  }

  /**
   * Atualizar unidade a partir do JWT
   */
  refreshFromJWT(): void {
    const unit = this.authService.getSelectedUnitFromToken();
    this.selectedUnitSubject.next(unit);
  }

  /**
   * Seleção de unidade via backend (atualiza token)
   */
  selectUnitViaBackend(unitId: number): Observable<any> {
    return this.authService.selectUnit(unitId);
  }

  /**
   * Set the selected unit after backend response
   */
  setSelectedUnit(unit: Unit | null): void {
    if (unit) {
      this.isSelectingUnitSubject.next(false);
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
    this.selectedUnitSubject.next(null);
  }

  /**
   * Set unit selection state (show/hide header)
   */
  setIsSelectingUnit(isSelecting: boolean): void {
    this.isSelectingUnitSubject.next(isSelecting);
  }

  /**
   * Get unit selection state
   */
  isSelectingUnit(): boolean {
    return this.isSelectingUnitSubject.value;
  }

  /**
   * Check if a unit is selected
   */
  isUnitSelected(): boolean {
    return this.selectedUnitSubject.value !== null;
  }
}

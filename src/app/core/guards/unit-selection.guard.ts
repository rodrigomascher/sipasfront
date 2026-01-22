import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SelectedUnitService } from '../services/selected-unit.service';

@Injectable({
  providedIn: 'root'
})
export class UnitSelectionGuard implements CanActivate {
  constructor(
    private selectedUnitService: SelectedUnitService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const selectedUnit = this.selectedUnitService.getSelectedUnit();

    if (selectedUnit) {
      return true;
    }

    // Redirect to unit selector if no unit is selected
    this.router.navigate(['/auth/unit-selector']);
    return false;
  }
}

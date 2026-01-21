import { createSelector } from '@ngrx/store';
import { UnitsState } from './units.reducer';

export const selectUnitsState = (state: { units: UnitsState }) => state.units;

export const selectAllUnits = createSelector(
  selectUnitsState,
  (state: UnitsState) => state.units
);

export const selectSelectedUnit = createSelector(
  selectUnitsState,
  (state: UnitsState) => state.selectedUnit
);

export const selectUnitsLoading = createSelector(
  selectUnitsState,
  (state: UnitsState) => state.loading
);

export const selectUnitsError = createSelector(
  selectUnitsState,
  (state: UnitsState) => state.error
);

export const selectUnitById = (id: number) => createSelector(
  selectAllUnits,
  (units) => units.find(unit => unit.id === id)
);

export const selectUnitCount = createSelector(
  selectAllUnits,
  (units) => units.length
);

export const selectUnitsByCity = (city: string) => createSelector(
  selectAllUnits,
  (units) => units.filter(unit => unit.city === city)
);

export const selectUnitsByState = (state: string) => createSelector(
  selectAllUnits,
  (units) => units.filter(unit => unit.state === state)
);

import { createAction, props } from '@ngrx/store';
import { Unit, CreateUnitDto } from '../../core/services/units.service';

// Load Actions
export const loadUnits = createAction(
  '[Units] Load Units'
);

export const loadUnitsSuccess = createAction(
  '[Units] Load Units Success',
  props<{ units: Unit[] }>()
);

export const loadUnitsFailure = createAction(
  '[Units] Load Units Failure',
  props<{ error: string }>()
);

// Load Unit By ID
export const loadUnitById = createAction(
  '[Units] Load Unit By ID',
  props<{ id: number }>()
);

export const loadUnitByIdSuccess = createAction(
  '[Units] Load Unit By ID Success',
  props<{ unit: Unit }>()
);

export const loadUnitByIdFailure = createAction(
  '[Units] Load Unit By ID Failure',
  props<{ error: string }>()
);

// Create Unit
export const createUnit = createAction(
  '[Units] Create Unit',
  props<{ unit: CreateUnitDto }>()
);

export const createUnitSuccess = createAction(
  '[Units] Create Unit Success',
  props<{ unit: Unit }>()
);

export const createUnitFailure = createAction(
  '[Units] Create Unit Failure',
  props<{ error: string }>()
);

// Update Unit
export const updateUnit = createAction(
  '[Units] Update Unit',
  props<{ id: number; unit: Partial<CreateUnitDto> }>()
);

export const updateUnitSuccess = createAction(
  '[Units] Update Unit Success',
  props<{ unit: Unit }>()
);

export const updateUnitFailure = createAction(
  '[Units] Update Unit Failure',
  props<{ error: string }>()
);

// Delete Unit
export const deleteUnit = createAction(
  '[Units] Delete Unit',
  props<{ id: number }>()
);

export const deleteUnitSuccess = createAction(
  '[Units] Delete Unit Success',
  props<{ id: number }>()
);

export const deleteUnitFailure = createAction(
  '[Units] Delete Unit Failure',
  props<{ error: string }>()
);

import { createAction, props } from '@ngrx/store';
import { IncomeType } from '../../../core/services/income-types.service';
import { PaginationParams } from '../../../core/services/income-types.service';

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const loadIncomeTypes = createAction('[Income Types] Load Income Types', props<{ params?: PaginationParams }>());
export const loadIncomeTypesSuccess = createAction('[Income Types] Load Income Types Success', props<{ response: PaginatedResponse<IncomeType> }>());
export const loadIncomeTypesFailure = createAction('[Income Types] Load Income Types Failure', props<{ error: any }>());

export const loadIncomeTypeById = createAction('[Income Types] Load Income Type By Id', props<{ id: number }>());
export const loadIncomeTypeByIdSuccess = createAction('[Income Types] Load Income Type By Id Success', props<{ incomeType: IncomeType }>());
export const loadIncomeTypeByIdFailure = createAction('[Income Types] Load Income Type By Id Failure', props<{ error: any }>());

export const createIncomeType = createAction('[Income Types] Create Income Type', props<{ incomeType: Omit<IncomeType, 'id'> }>());
export const createIncomeTypeSuccess = createAction('[Income Types] Create Income Type Success', props<{ incomeType: IncomeType }>());
export const createIncomeTypeFailure = createAction('[Income Types] Create Income Type Failure', props<{ error: any }>());

export const updateIncomeType = createAction('[Income Types] Update Income Type', props<{ id: number; incomeType: Partial<IncomeType> }>());
export const updateIncomeTypeSuccess = createAction('[Income Types] Update Income Type Success', props<{ incomeType: IncomeType }>());
export const updateIncomeTypeFailure = createAction('[Income Types] Update Income Type Failure', props<{ error: any }>());

export const deleteIncomeType = createAction('[Income Types] Delete Income Type', props<{ id: number }>());
export const deleteIncomeTypeSuccess = createAction('[Income Types] Delete Income Type Success', props<{ id: number }>());
export const deleteIncomeTypeFailure = createAction('[Income Types] Delete Income Type Failure', props<{ error: any }>());

export const selectIncomeType = createAction('[Income Types] Select Income Type', props<{ id: number }>());
export const clearIncomeTypeSelection = createAction('[Income Types] Clear Income Type Selection');

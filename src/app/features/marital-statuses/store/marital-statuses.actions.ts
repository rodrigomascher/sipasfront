import { createAction, props } from '@ngrx/store';
import { MaritalStatus } from '../../../core/services/marital-statuses.service';
import { PaginationParams } from '../../../core/services/marital-statuses.service';

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const loadMaritalStatuses = createAction('[Marital Statuses] Load Marital Statuses', props<{ params?: PaginationParams }>());
export const loadMaritalStatusesSuccess = createAction('[Marital Statuses] Load Marital Statuses Success', props<{ response: PaginatedResponse<MaritalStatus> }>());
export const loadMaritalStatusesFailure = createAction('[Marital Statuses] Load Marital Statuses Failure', props<{ error: any }>());

export const loadMaritalStatusById = createAction('[Marital Statuses] Load Marital Status By Id', props<{ id: number }>());
export const loadMaritalStatusByIdSuccess = createAction('[Marital Statuses] Load Marital Status By Id Success', props<{ maritalStatus: MaritalStatus }>());
export const loadMaritalStatusByIdFailure = createAction('[Marital Statuses] Load Marital Status By Id Failure', props<{ error: any }>());

export const createMaritalStatus = createAction('[Marital Statuses] Create Marital Status', props<{ maritalStatus: Omit<MaritalStatus, 'id'> }>());
export const createMaritalStatusSuccess = createAction('[Marital Statuses] Create Marital Status Success', props<{ maritalStatus: MaritalStatus }>());
export const createMaritalStatusFailure = createAction('[Marital Statuses] Create Marital Status Failure', props<{ error: any }>());

export const updateMaritalStatus = createAction('[Marital Statuses] Update Marital Status', props<{ id: number; maritalStatus: Partial<MaritalStatus> }>());
export const updateMaritalStatusSuccess = createAction('[Marital Statuses] Update Marital Status Success', props<{ maritalStatus: MaritalStatus }>());
export const updateMaritalStatusFailure = createAction('[Marital Statuses] Update Marital Status Failure', props<{ error: any }>());

export const deleteMaritalStatus = createAction('[Marital Statuses] Delete Marital Status', props<{ id: number }>());
export const deleteMaritalStatusSuccess = createAction('[Marital Statuses] Delete Marital Status Success', props<{ id: number }>());
export const deleteMaritalStatusFailure = createAction('[Marital Statuses] Delete Marital Status Failure', props<{ error: any }>());

export const selectMaritalStatus = createAction('[Marital Statuses] Select Marital Status', props<{ id: number }>());
export const clearMaritalStatusSelection = createAction('[Marital Statuses] Clear Marital Status Selection');

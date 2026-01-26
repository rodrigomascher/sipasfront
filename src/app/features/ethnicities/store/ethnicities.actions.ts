import { createAction, props } from '@ngrx/store';
import { Ethnicity } from '../../../core/services/ethnicities.service';
import { PaginationParams } from '../../../core/services/ethnicities.service';

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const loadEthnicities = createAction('[Ethnicities] Load Ethnicities', props<{ params?: PaginationParams }>());
export const loadEthnicitiesSuccess = createAction('[Ethnicities] Load Ethnicities Success', props<{ response: PaginatedResponse<Ethnicity> }>());
export const loadEthnicitiesFailure = createAction('[Ethnicities] Load Ethnicities Failure', props<{ error: any }>());

export const loadEthnicityById = createAction('[Ethnicities] Load Ethnicity By Id', props<{ id: number }>());
export const loadEthnicityByIdSuccess = createAction('[Ethnicities] Load Ethnicity By Id Success', props<{ ethnicity: Ethnicity }>());
export const loadEthnicityByIdFailure = createAction('[Ethnicities] Load Ethnicity By Id Failure', props<{ error: any }>());

export const createEthnicity = createAction('[Ethnicities] Create Ethnicity', props<{ ethnicity: Omit<Ethnicity, 'id'> }>());
export const createEthnicitySuccess = createAction('[Ethnicities] Create Ethnicity Success', props<{ ethnicity: Ethnicity }>());
export const createEthnicityFailure = createAction('[Ethnicities] Create Ethnicity Failure', props<{ error: any }>());

export const updateEthnicity = createAction('[Ethnicities] Update Ethnicity', props<{ id: number; ethnicity: Partial<Ethnicity> }>());
export const updateEthnicitySuccess = createAction('[Ethnicities] Update Ethnicity Success', props<{ ethnicity: Ethnicity }>());
export const updateEthnicityFailure = createAction('[Ethnicities] Update Ethnicity Failure', props<{ error: any }>());

export const deleteEthnicity = createAction('[Ethnicities] Delete Ethnicity', props<{ id: number }>());
export const deleteEthnicitySuccess = createAction('[Ethnicities] Delete Ethnicity Success', props<{ id: number }>());
export const deleteEthnicityFailure = createAction('[Ethnicities] Delete Ethnicity Failure', props<{ error: any }>());

export const selectEthnicity = createAction('[Ethnicities] Select Ethnicity', props<{ id: number }>());
export const clearEthnicitySelection = createAction('[Ethnicities] Clear Ethnicity Selection');

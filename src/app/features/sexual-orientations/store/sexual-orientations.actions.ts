import { createAction, props } from '@ngrx/store';
import { SexualOrientation } from '../../../core/services/sexual-orientations.service';
import { PaginationParams } from '../../../core/services/sexual-orientations.service';

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const loadSexualOrientations = createAction('[Sexual Orientations] Load', props<{ params?: PaginationParams }>());
export const loadSexualOrientationsSuccess = createAction('[Sexual Orientations] Load Success', props<{ response: PaginatedResponse<SexualOrientation> }>());
export const loadSexualOrientationsFailure = createAction('[Sexual Orientations] Load Failure', props<{ error: any }>());

export const createSexualOrientation = createAction('[Sexual Orientations] Create', props<{ sexualOrientation: Omit<SexualOrientation, 'id'> }>());
export const createSexualOrientationSuccess = createAction('[Sexual Orientations] Create Success', props<{ sexualOrientation: SexualOrientation }>());
export const createSexualOrientationFailure = createAction('[Sexual Orientations] Create Failure', props<{ error: any }>());

export const updateSexualOrientation = createAction('[Sexual Orientations] Update', props<{ id: number; sexualOrientation: Partial<SexualOrientation> }>());
export const updateSexualOrientationSuccess = createAction('[Sexual Orientations] Update Success', props<{ sexualOrientation: SexualOrientation }>());
export const updateSexualOrientationFailure = createAction('[Sexual Orientations] Update Failure', props<{ error: any }>());

export const deleteSexualOrientation = createAction('[Sexual Orientations] Delete', props<{ id: number }>());
export const deleteSexualOrientationSuccess = createAction('[Sexual Orientations] Delete Success', props<{ id: number }>());
export const deleteSexualOrientationFailure = createAction('[Sexual Orientations] Delete Failure', props<{ error: any }>());

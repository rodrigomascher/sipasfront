import { createAction, props } from '@ngrx/store';
import { Gender } from '../../../core/services/genders.service';
import { PaginationParams } from '../../../core/services/genders.service';

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const loadGenders = createAction('[Genders] Load Genders', props<{ params?: PaginationParams }>());
export const loadGendersSuccess = createAction('[Genders] Load Genders Success', props<{ response: PaginatedResponse<Gender> }>());
export const loadGendersFailure = createAction('[Genders] Load Genders Failure', props<{ error: any }>());

export const loadGenderById = createAction('[Genders] Load Gender By Id', props<{ id: number }>());
export const loadGenderByIdSuccess = createAction('[Genders] Load Gender By Id Success', props<{ gender: Gender }>());
export const loadGenderByIdFailure = createAction('[Genders] Load Gender By Id Failure', props<{ error: any }>());

export const createGender = createAction('[Genders] Create Gender', props<{ gender: Omit<Gender, 'id'> }>());
export const createGenderSuccess = createAction('[Genders] Create Gender Success', props<{ gender: Gender }>());
export const createGenderFailure = createAction('[Genders] Create Gender Failure', props<{ error: any }>());

export const updateGender = createAction('[Genders] Update Gender', props<{ id: number; gender: Partial<Gender> }>());
export const updateGenderSuccess = createAction('[Genders] Update Gender Success', props<{ gender: Gender }>());
export const updateGenderFailure = createAction('[Genders] Update Gender Failure', props<{ error: any }>());

export const deleteGender = createAction('[Genders] Delete Gender', props<{ id: number }>());
export const deleteGenderSuccess = createAction('[Genders] Delete Gender Success', props<{ id: number }>());
export const deleteGenderFailure = createAction('[Genders] Delete Gender Failure', props<{ error: any }>());

export const selectGender = createAction('[Genders] Select Gender', props<{ id: number }>());
export const clearGenderSelection = createAction('[Genders] Clear Gender Selection');

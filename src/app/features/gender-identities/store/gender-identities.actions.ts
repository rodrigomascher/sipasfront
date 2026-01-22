import { createAction, props } from '@ngrx/store';
import { GenderIdentity } from '../../../core/services/gender-identities.service';
import { PaginationParams } from '../../../core/services/gender-identities.service';

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const loadGenderIdentities = createAction('[Gender Identities] Load Gender Identities', props<{ params?: PaginationParams }>());
export const loadGenderIdentitiesSuccess = createAction('[Gender Identities] Load Gender Identities Success', props<{ response: PaginatedResponse<GenderIdentity> }>());
export const loadGenderIdentitiesFailure = createAction('[Gender Identities] Load Gender Identities Failure', props<{ error: any }>());

export const createGenderIdentity = createAction('[Gender Identities] Create', props<{ genderIdentity: Omit<GenderIdentity, 'id'> }>());
export const createGenderIdentitySuccess = createAction('[Gender Identities] Create Success', props<{ genderIdentity: GenderIdentity }>());
export const createGenderIdentityFailure = createAction('[Gender Identities] Create Failure', props<{ error: any }>());

export const updateGenderIdentity = createAction('[Gender Identities] Update', props<{ id: number; genderIdentity: Partial<GenderIdentity> }>());
export const updateGenderIdentitySuccess = createAction('[Gender Identities] Update Success', props<{ genderIdentity: GenderIdentity }>());
export const updateGenderIdentityFailure = createAction('[Gender Identities] Update Failure', props<{ error: any }>());

export const deleteGenderIdentity = createAction('[Gender Identities] Delete', props<{ id: number }>());
export const deleteGenderIdentitySuccess = createAction('[Gender Identities] Delete Success', props<{ id: number }>());
export const deleteGenderIdentityFailure = createAction('[Gender Identities] Delete Failure', props<{ error: any }>());

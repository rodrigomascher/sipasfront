import { createAction, props } from '@ngrx/store';

export interface FamilyComposition {
  idFamilyComposition: number;
  idPerson: number;
  person?: any;
  idRelationshipDegree: number;
  responsible: number;
  registrationDate: Date;
  createdBy: string;
  createdAt: Date;
  updatedBy: string;
  updatedAt: Date;
}

export const loadFamilyCompositions = createAction(
  '[Family Composition] Load Family Compositions',
);

export const loadFamilyCompositionsSuccess = createAction(
  '[Family Composition] Load Family Compositions Success',
  props<{ familyCompositions: FamilyComposition[] }>(),
);

export const loadFamilyCompositionsFailure = createAction(
  '[Family Composition] Load Family Compositions Failure',
  props<{ error: string }>(),
);

export const createFamilyComposition = createAction(
  '[Family Composition] Create Family Composition',
  props<{ familyComposition: Omit<FamilyComposition, 'createdAt' | 'updatedAt'> }>(),
);

export const createFamilyCompositionSuccess = createAction(
  '[Family Composition] Create Family Composition Success',
  props<{ familyComposition: FamilyComposition }>(),
);

export const createFamilyCompositionFailure = createAction(
  '[Family Composition] Create Family Composition Failure',
  props<{ error: string }>(),
);

export const updateFamilyComposition = createAction(
  '[Family Composition] Update Family Composition',
  props<{ idFamilyComposition: number; idPerson: number; familyComposition: Partial<FamilyComposition> }>(),
);

export const updateFamilyCompositionSuccess = createAction(
  '[Family Composition] Update Family Composition Success',
  props<{ familyComposition: FamilyComposition }>(),
);

export const updateFamilyCompositionFailure = createAction(
  '[Family Composition] Update Family Composition Failure',
  props<{ error: string }>(),
);

export const deleteFamilyComposition = createAction(
  '[Family Composition] Delete Family Composition',
  props<{ idFamilyComposition: number; idPerson: number }>(),
);

export const deleteFamilyCompositionSuccess = createAction(
  '[Family Composition] Delete Family Composition Success',
  props<{ idFamilyComposition: number; idPerson: number }>(),
);

export const deleteFamilyCompositionFailure = createAction(
  '[Family Composition] Delete Family Composition Failure',
  props<{ error: string }>(),
);

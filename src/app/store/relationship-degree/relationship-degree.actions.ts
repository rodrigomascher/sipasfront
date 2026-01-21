import { createAction, props } from '@ngrx/store';

export interface RelationshipDegree {
  id: number;
  description: string;
  active: boolean;
  createdBy: string;
  createdAt: Date;
  updatedBy: string;
  updatedAt: Date;
}

export const loadRelationshipDegrees = createAction(
  '[Relationship Degree] Load Relationship Degrees',
);

export const loadRelationshipDegreesSuccess = createAction(
  '[Relationship Degree] Load Relationship Degrees Success',
  props<{ relationshipDegrees: RelationshipDegree[] }>(),
);

export const loadRelationshipDegreesFailure = createAction(
  '[Relationship Degree] Load Relationship Degrees Failure',
  props<{ error: string }>(),
);

export const createRelationshipDegree = createAction(
  '[Relationship Degree] Create Relationship Degree',
  props<{ relationshipDegree: Omit<RelationshipDegree, 'id' | 'createdAt' | 'updatedAt'> }>(),
);

export const createRelationshipDegreeSuccess = createAction(
  '[Relationship Degree] Create Relationship Degree Success',
  props<{ relationshipDegree: RelationshipDegree }>(),
);

export const createRelationshipDegreeFailure = createAction(
  '[Relationship Degree] Create Relationship Degree Failure',
  props<{ error: string }>(),
);

export const updateRelationshipDegree = createAction(
  '[Relationship Degree] Update Relationship Degree',
  props<{ id: number; relationshipDegree: Partial<RelationshipDegree> }>(),
);

export const updateRelationshipDegreeSuccess = createAction(
  '[Relationship Degree] Update Relationship Degree Success',
  props<{ relationshipDegree: RelationshipDegree }>(),
);

export const updateRelationshipDegreeFailure = createAction(
  '[Relationship Degree] Update Relationship Degree Failure',
  props<{ error: string }>(),
);

export const deleteRelationshipDegree = createAction(
  '[Relationship Degree] Delete Relationship Degree',
  props<{ id: number }>(),
);

export const deleteRelationshipDegreeSuccess = createAction(
  '[Relationship Degree] Delete Relationship Degree Success',
  props<{ id: number }>(),
);

export const deleteRelationshipDegreeFailure = createAction(
  '[Relationship Degree] Delete Relationship Degree Failure',
  props<{ error: string }>(),
);

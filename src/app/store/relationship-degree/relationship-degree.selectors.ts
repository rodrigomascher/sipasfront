import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RelationshipDegreeState } from './relationship-degree.reducer';

export const selectRelationshipDegreeState = createFeatureSelector<RelationshipDegreeState>('relationshipDegree');

export const selectAllRelationshipDegrees = createSelector(
  selectRelationshipDegreeState,
  (state) => state.relationshipDegrees,
);

export const selectRelationshipDegreeLoading = createSelector(
  selectRelationshipDegreeState,
  (state) => state.loading,
);

export const selectRelationshipDegreeError = createSelector(
  selectRelationshipDegreeState,
  (state) => state.error,
);

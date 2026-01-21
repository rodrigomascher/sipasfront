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
export const selectTotalItems = createSelector(
  selectRelationshipDegreeState,
  (state) => state.total,
);

export const selectCurrentPage = createSelector(
  selectRelationshipDegreeState,
  (state) => state.page,
);

export const selectTotalPages = createSelector(
  selectRelationshipDegreeState,
  (state) => state.totalPages,
);

export const selectCurrentPageStart = createSelector(
  selectRelationshipDegreeState,
  (state) => (state.page - 1) * state.pageSize + 1,
);

export const selectCurrentPageEnd = createSelector(
  selectRelationshipDegreeState,
  (state) => Math.min(state.page * state.pageSize, state.total),
);
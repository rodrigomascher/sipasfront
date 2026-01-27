import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MaritalStatusesState } from './marital-statuses.reducer';

export const selectMaritalStatusesState = createFeatureSelector<MaritalStatusesState>('maritalStatuses');

export const selectAllMaritalStatuses = createSelector(
  selectMaritalStatusesState,
  (state) => state.maritalStatuses
);

export const selectSelectedMaritalStatus = createSelector(
  selectMaritalStatusesState,
  (state) => state.selectedMaritalStatus
);

export const selectMaritalStatusesLoading = createSelector(
  selectMaritalStatusesState,
  (state) => state.loading
);

export const selectMaritalStatusesError = createSelector(
  selectMaritalStatusesState,
  (state) => state.error
);

export const selectMaritalStatusCount = createSelector(
  selectAllMaritalStatuses,
  (maritalStatuses) => maritalStatuses.length
);

export const selectTotalItems = createSelector(
  selectMaritalStatusesState,
  (state) => state.total,
);

export const selectCurrentPage = createSelector(
  selectMaritalStatusesState,
  (state) => state.page,
);

export const selectTotalPages = createSelector(
  selectMaritalStatusesState,
  (state) => state.totalPages,
);

export const selectCurrentPageStart = createSelector(
  selectMaritalStatusesState,
  (state) => (state.page - 1) * state.pageSize + 1,
);

export const selectCurrentPageEnd = createSelector(
  selectMaritalStatusesState,
  (state) => Math.min(state.page * state.pageSize, state.total),
);

import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GenderIdentitiesState } from './gender-identities.reducer';

export const selectGenderIdentitiesState = createFeatureSelector<GenderIdentitiesState>('genderIdentities');

export const selectAllGenderIdentities = createSelector(
  selectGenderIdentitiesState,
  (state) => state.genderIdentities
);

export const selectGenderIdentitiesLoading = createSelector(
  selectGenderIdentitiesState,
  (state) => state.loading
);

export const selectGenderIdentitiesError = createSelector(
  selectGenderIdentitiesState,
  (state) => state.error
);

export const selectTotalItems = createSelector(
  selectGenderIdentitiesState,
  (state) => state.total,
);

export const selectCurrentPage = createSelector(
  selectGenderIdentitiesState,
  (state) => state.page,
);

export const selectTotalPages = createSelector(
  selectGenderIdentitiesState,
  (state) => state.totalPages,
);

export const selectCurrentPageStart = createSelector(
  selectGenderIdentitiesState,
  (state) => (state.page - 1) * state.pageSize + 1,
);

export const selectCurrentPageEnd = createSelector(
  selectGenderIdentitiesState,
  (state) => Math.min(state.page * state.pageSize, state.total),
);

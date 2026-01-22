import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GendersState } from './genders.reducer';

export const selectGendersState = createFeatureSelector<GendersState>('genders');

export const selectAllGenders = createSelector(
  selectGendersState,
  (state) => state.genders
);

export const selectSelectedGender = createSelector(
  selectGendersState,
  (state) => state.selectedGender
);

export const selectGendersLoading = createSelector(
  selectGendersState,
  (state) => state.loading
);

export const selectGendersError = createSelector(
  selectGendersState,
  (state) => state.error
);

export const selectGenderCount = createSelector(
  selectAllGenders,
  (genders) => genders.length
);

export const selectTotalItems = createSelector(
  selectGendersState,
  (state) => state.total,
);

export const selectCurrentPage = createSelector(
  selectGendersState,
  (state) => state.page,
);

export const selectTotalPages = createSelector(
  selectGendersState,
  (state) => state.totalPages,
);

export const selectCurrentPageStart = createSelector(
  selectGendersState,
  (state) => (state.page - 1) * state.pageSize + 1,
);

export const selectCurrentPageEnd = createSelector(
  selectGendersState,
  (state) => Math.min(state.page * state.pageSize, state.total),
);

export const selectGenderById = (id: number) =>
  createSelector(selectAllGenders, (genders) => genders.find((g) => g.id === id));

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

export const selectGenderById = (id: number) =>
  createSelector(selectAllGenders, (genders) => genders.find((g) => g.id === id));

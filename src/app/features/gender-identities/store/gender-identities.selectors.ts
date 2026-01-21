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

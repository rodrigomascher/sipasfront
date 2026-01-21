import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SexualOrientationsState } from './sexual-orientations.reducer';

export const selectSexualOrientationsState = createFeatureSelector<SexualOrientationsState>('sexualOrientations');

export const selectAllSexualOrientations = createSelector(
  selectSexualOrientationsState,
  (state) => state.sexualOrientations
);

export const selectSexualOrientationsLoading = createSelector(
  selectSexualOrientationsState,
  (state) => state.loading
);

export const selectSexualOrientationsError = createSelector(
  selectSexualOrientationsState,
  (state) => state.error
);

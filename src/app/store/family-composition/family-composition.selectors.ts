import { createSelector } from '@ngrx/store';
import { FamilyCompositionState } from './family-composition.reducer';

const selectFamilyCompositionState = (state: { familyComposition: FamilyCompositionState }) =>
  state.familyComposition;

export const selectAllFamilyCompositions = createSelector(
  selectFamilyCompositionState,
  (state: FamilyCompositionState) => state.familyCompositions,
);

export const selectFamilyCompositionLoading = createSelector(
  selectFamilyCompositionState,
  (state: FamilyCompositionState) => state.loading,
);

export const selectFamilyCompositionError = createSelector(
  selectFamilyCompositionState,
  (state: FamilyCompositionState) => state.error,
);

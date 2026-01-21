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

export const selectTotalItems = createSelector(
  selectFamilyCompositionState,
  (state: FamilyCompositionState) => state.total,
);

export const selectCurrentPage = createSelector(
  selectFamilyCompositionState,
  (state: FamilyCompositionState) => state.page,
);

export const selectTotalPages = createSelector(
  selectFamilyCompositionState,
  (state: FamilyCompositionState) => state.totalPages,
);

export const selectCurrentPageStart = createSelector(
  selectFamilyCompositionState,
  (state: FamilyCompositionState) => (state.page - 1) * state.pageSize + 1,
);

export const selectCurrentPageEnd = createSelector(
  selectFamilyCompositionState,
  (state: FamilyCompositionState) => Math.min(state.page * state.pageSize, state.total),
);

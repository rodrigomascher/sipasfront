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

export const selectTotalItems = createSelector(
  selectSexualOrientationsState,
  (state) => state.total,
);

export const selectCurrentPage = createSelector(
  selectSexualOrientationsState,
  (state) => state.page,
);

export const selectTotalPages = createSelector(
  selectSexualOrientationsState,
  (state) => state.totalPages,
);

export const selectCurrentPageStart = createSelector(
  selectSexualOrientationsState,
  (state) => (state.page - 1) * state.pageSize + 1,
);

export const selectCurrentPageEnd = createSelector(
  selectSexualOrientationsState,
  (state) => Math.min(state.page * state.pageSize, state.total),
);

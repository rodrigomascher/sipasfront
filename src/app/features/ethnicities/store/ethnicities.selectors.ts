import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EthnicitiesState } from './ethnicities.reducer';

export const selectEthnicitiesState = createFeatureSelector<EthnicitiesState>('ethnicities');

export const selectAllEthnicities = createSelector(
  selectEthnicitiesState,
  (state) => state.ethnicities
);

export const selectSelectedEthnicity = createSelector(
  selectEthnicitiesState,
  (state) => state.selectedEthnicity
);

export const selectEthnicitiesLoading = createSelector(
  selectEthnicitiesState,
  (state) => state.loading
);

export const selectEthnicitiesError = createSelector(
  selectEthnicitiesState,
  (state) => state.error
);

export const selectEthnicityCount = createSelector(
  selectAllEthnicities,
  (ethnicities) => ethnicities.length
);

export const selectTotalItems = createSelector(
  selectEthnicitiesState,
  (state) => state.total,
);

export const selectCurrentPage = createSelector(
  selectEthnicitiesState,
  (state) => state.page,
);

export const selectTotalPages = createSelector(
  selectEthnicitiesState,
  (state) => state.totalPages,
);

export const selectCurrentPageStart = createSelector(
  selectEthnicitiesState,
  (state) => (state.page - 1) * state.pageSize + 1,
);

export const selectCurrentPageEnd = createSelector(
  selectEthnicitiesState,
  (state) => Math.min(state.page * state.pageSize, state.total),
);

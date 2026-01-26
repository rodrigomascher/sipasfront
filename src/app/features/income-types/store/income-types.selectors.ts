import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IncomeTypesState } from './income-types.reducer';

export const selectIncomeTypesState = createFeatureSelector<IncomeTypesState>('incomeTypes');

export const selectAllIncomeTypes = createSelector(
  selectIncomeTypesState,
  (state) => state.incomeTypes
);

export const selectSelectedIncomeType = createSelector(
  selectIncomeTypesState,
  (state) => state.selectedIncomeType
);

export const selectIncomeTypesLoading = createSelector(
  selectIncomeTypesState,
  (state) => state.loading
);

export const selectIncomeTypesError = createSelector(
  selectIncomeTypesState,
  (state) => state.error
);

export const selectIncomeTypeCount = createSelector(
  selectAllIncomeTypes,
  (incomeTypes) => incomeTypes.length
);

export const selectTotalItems = createSelector(
  selectIncomeTypesState,
  (state) => state.total,
);

export const selectCurrentPage = createSelector(
  selectIncomeTypesState,
  (state) => state.page,
);

export const selectTotalPages = createSelector(
  selectIncomeTypesState,
  (state) => state.totalPages,
);

export const selectCurrentPageStart = createSelector(
  selectIncomeTypesState,
  (state) => (state.page - 1) * state.pageSize + 1,
);

export const selectCurrentPageEnd = createSelector(
  selectIncomeTypesState,
  (state) => Math.min(state.page * state.pageSize, state.total),
);

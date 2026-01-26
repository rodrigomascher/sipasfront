import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RacesState } from './races.reducer';

export const selectRacesState = createFeatureSelector<RacesState>('races');

export const selectAllRaces = createSelector(
  selectRacesState,
  (state) => state.races
);

export const selectSelectedRace = createSelector(
  selectRacesState,
  (state) => state.selectedRace
);

export const selectRacesLoading = createSelector(
  selectRacesState,
  (state) => state.loading
);

export const selectRacesError = createSelector(
  selectRacesState,
  (state) => state.error
);

export const selectRaceCount = createSelector(
  selectAllRaces,
  (races) => races.length
);

export const selectTotalItems = createSelector(
  selectRacesState,
  (state) => state.total,
);

export const selectCurrentPage = createSelector(
  selectRacesState,
  (state) => state.page,
);

export const selectTotalPages = createSelector(
  selectRacesState,
  (state) => state.totalPages,
);

export const selectCurrentPageStart = createSelector(
  selectRacesState,
  (state) => (state.page - 1) * state.pageSize + 1,
);

export const selectCurrentPageEnd = createSelector(
  selectRacesState,
  (state) => Math.min(state.page * state.pageSize, state.total),
);

export const selectRaceById = (id: number) =>
  createSelector(selectAllRaces, (races) => races.find((r) => r.id === id));

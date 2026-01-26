import { createReducer, on } from '@ngrx/store';
import { Race } from '../../../core/services/races.service';
import * as RacesActions from './races.actions';

export interface RacesState {
  races: Race[];
  selectedRace: Race | null;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  loading: boolean;
  error: any;
}

const initialState: RacesState = {
  races: [],
  selectedRace: null,
  total: 0,
  page: 1,
  pageSize: 10,
  totalPages: 0,
  loading: false,
  error: null,
};

export const racesReducer = createReducer(
  initialState,
  on(RacesActions.loadRaces, (state) => ({ ...state, loading: true, error: null })),
  on(RacesActions.loadRacesSuccess, (state, { response }) => ({
    ...state,
    races: response.data,
    total: response.total,
    page: response.page,
    pageSize: response.pageSize,
    totalPages: response.totalPages,
    loading: false,
  })),
  on(RacesActions.loadRacesFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(RacesActions.createRaceSuccess, (state, { race }) => ({
    ...state,
    races: [...state.races, race],
    loading: false,
  })),
  on(RacesActions.updateRaceSuccess, (state, { race }) => ({
    ...state,
    races: state.races.map((r) => (r.id === race.id ? race : r)),
    loading: false,
  })),
  on(RacesActions.deleteRaceSuccess, (state, { id }) => ({
    ...state,
    races: state.races.filter((r) => r.id !== id),
    loading: false,
  })),
  on(RacesActions.selectRace, (state, { id }) => ({
    ...state,
    selectedRace: state.races.find((r) => r.id === id) || null,
  })),
  on(RacesActions.clearRaceSelection, (state) => ({
    ...state,
    selectedRace: null,
  }))
);

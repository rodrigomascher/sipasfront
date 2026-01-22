import { createReducer, on } from '@ngrx/store';
import { Gender } from '../../../core/services/genders.service';
import * as GendersActions from './genders.actions';

export interface GendersState {
  genders: Gender[];
  selectedGender: Gender | null;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  loading: boolean;
  error: any;
}

const initialState: GendersState = {
  genders: [],
  selectedGender: null,
  total: 0,
  page: 1,
  pageSize: 10,
  totalPages: 0,
  loading: false,
  error: null,
};

export const gendersReducer = createReducer(
  initialState,
  on(GendersActions.loadGenders, (state) => ({ ...state, loading: true, error: null })),
  on(GendersActions.loadGendersSuccess, (state, { response }) => ({
    ...state,
    genders: response.data,
    total: response.total,
    page: response.page,
    pageSize: response.pageSize,
    totalPages: response.totalPages,
    loading: false,
  })),
  on(GendersActions.loadGendersFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(GendersActions.createGenderSuccess, (state, { gender }) => ({
    ...state,
    genders: [...state.genders, gender],
    loading: false,
  })),
  on(GendersActions.updateGenderSuccess, (state, { gender }) => ({
    ...state,
    genders: state.genders.map((g) => (g.id === gender.id ? gender : g)),
    loading: false,
  })),
  on(GendersActions.deleteGenderSuccess, (state, { id }) => ({
    ...state,
    genders: state.genders.filter((g) => g.id !== id),
    loading: false,
  })),
  on(GendersActions.selectGender, (state, { id }) => ({
    ...state,
    selectedGender: state.genders.find((g) => g.id === id) || null,
  })),
  on(GendersActions.clearGenderSelection, (state) => ({
    ...state,
    selectedGender: null,
  }))
);

import { createReducer, on } from '@ngrx/store';
import { Gender } from '../../../core/services/genders.service';
import * as GendersActions from './genders.actions';

export interface GendersState {
  genders: Gender[];
  selectedGender: Gender | null;
  loading: boolean;
  error: any;
}

const initialState: GendersState = {
  genders: [],
  selectedGender: null,
  loading: false,
  error: null,
};

export const gendersReducer = createReducer(
  initialState,
  on(GendersActions.loadGenders, (state) => ({ ...state, loading: true, error: null })),
  on(GendersActions.loadGendersSuccess, (state, { genders }) => ({
    ...state,
    genders,
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

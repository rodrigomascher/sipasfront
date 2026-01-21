import { createReducer, on } from '@ngrx/store';
import { SexualOrientation } from '../../../core/services/sexual-orientations.service';
import * as Actions from './sexual-orientations.actions';

export interface SexualOrientationsState {
  sexualOrientations: SexualOrientation[];
  loading: boolean;
  error: any;
}

const initialState: SexualOrientationsState = {
  sexualOrientations: [],
  loading: false,
  error: null,
};

export const sexualOrientationsReducer = createReducer(
  initialState,
  on(Actions.loadSexualOrientations, (state) => ({ ...state, loading: true, error: null })),
  on(Actions.loadSexualOrientationsSuccess, (state, { sexualOrientations }) => ({
    ...state,
    sexualOrientations,
    loading: false,
  })),
  on(Actions.createSexualOrientationSuccess, (state, { sexualOrientation }) => ({
    ...state,
    sexualOrientations: [...state.sexualOrientations, sexualOrientation],
    loading: false,
  })),
  on(Actions.updateSexualOrientationSuccess, (state, { sexualOrientation }) => ({
    ...state,
    sexualOrientations: state.sexualOrientations.map((s) => (s.id === sexualOrientation.id ? sexualOrientation : s)),
    loading: false,
  })),
  on(Actions.deleteSexualOrientationSuccess, (state, { id }) => ({
    ...state,
    sexualOrientations: state.sexualOrientations.filter((s) => s.id !== id),
    loading: false,
  }))
);

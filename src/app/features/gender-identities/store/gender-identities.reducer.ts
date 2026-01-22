import { createReducer, on } from '@ngrx/store';
import { GenderIdentity } from '../../../core/services/gender-identities.service';
import * as Actions from './gender-identities.actions';

export interface GenderIdentitiesState {
  genderIdentities: GenderIdentity[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  loading: boolean;
  error: any;
}

const initialState: GenderIdentitiesState = {
  genderIdentities: [],
  total: 0,
  page: 1,
  pageSize: 10,
  totalPages: 0,
  loading: false,
  error: null,
};

export const genderIdentitiesReducer = createReducer(
  initialState,
  on(Actions.loadGenderIdentities, (state) => ({ ...state, loading: true, error: null })),
  on(Actions.loadGenderIdentitiesSuccess, (state, { response }) => ({
    ...state,
    genderIdentities: response.data,
    total: response.total,
    page: response.page,
    pageSize: response.pageSize,
    totalPages: response.totalPages,
    loading: false,
  })),
  on(Actions.createGenderIdentitySuccess, (state, { genderIdentity }) => ({
    ...state,
    genderIdentities: [...state.genderIdentities, genderIdentity],
    loading: false,
  })),
  on(Actions.updateGenderIdentitySuccess, (state, { genderIdentity }) => ({
    ...state,
    genderIdentities: state.genderIdentities.map((g) => (g.id === genderIdentity.id ? genderIdentity : g)),
    loading: false,
  })),
  on(Actions.deleteGenderIdentitySuccess, (state, { id }) => ({
    ...state,
    genderIdentities: state.genderIdentities.filter((g) => g.id !== id),
    loading: false,
  }))
);

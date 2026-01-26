import { createReducer, on } from '@ngrx/store';
import { Ethnicity } from '../../../core/services/ethnicities.service';
import * as EthnicitiesActions from './ethnicities.actions';

export interface EthnicitiesState {
  ethnicities: Ethnicity[];
  selectedEthnicity: Ethnicity | null;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  loading: boolean;
  error: any;
}

const initialState: EthnicitiesState = {
  ethnicities: [],
  selectedEthnicity: null,
  total: 0,
  page: 1,
  pageSize: 10,
  totalPages: 0,
  loading: false,
  error: null,
};

export const ethnicitiesReducer = createReducer(
  initialState,
  on(EthnicitiesActions.loadEthnicities, (state) => ({ ...state, loading: true, error: null })),
  on(EthnicitiesActions.loadEthnicitiesSuccess, (state, { response }) => ({
    ...state,
    ethnicities: response.data,
    total: response.total,
    page: response.page,
    pageSize: response.pageSize,
    totalPages: response.totalPages,
    loading: false,
  })),
  on(EthnicitiesActions.loadEthnicitiesFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(EthnicitiesActions.createEthnicitySuccess, (state, { ethnicity }) => ({
    ...state,
    ethnicities: [...state.ethnicities, ethnicity],
    loading: false,
  })),
  on(EthnicitiesActions.updateEthnicitySuccess, (state, { ethnicity }) => ({
    ...state,
    ethnicities: state.ethnicities.map((e) => (e.id === ethnicity.id ? ethnicity : e)),
    loading: false,
  })),
  on(EthnicitiesActions.deleteEthnicitySuccess, (state, { id }) => ({
    ...state,
    ethnicities: state.ethnicities.filter((e) => e.id !== id),
    loading: false,
  })),
  on(EthnicitiesActions.selectEthnicity, (state, { id }) => ({
    ...state,
    selectedEthnicity: state.ethnicities.find((e) => e.id === id) || null,
  })),
  on(EthnicitiesActions.clearEthnicitySelection, (state) => ({
    ...state,
    selectedEthnicity: null,
  }))
);

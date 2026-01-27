import { createReducer, on } from '@ngrx/store';
import { MaritalStatus } from '../../../core/services/marital-statuses.service';
import * as MaritalStatusesActions from './marital-statuses.actions';

export interface MaritalStatusesState {
  maritalStatuses: MaritalStatus[];
  selectedMaritalStatus: MaritalStatus | null;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  loading: boolean;
  error: any;
}

const initialState: MaritalStatusesState = {
  maritalStatuses: [],
  selectedMaritalStatus: null,
  total: 0,
  page: 1,
  pageSize: 10,
  totalPages: 0,
  loading: false,
  error: null,
};

export const maritalStatusesReducer = createReducer(
  initialState,
  on(MaritalStatusesActions.loadMaritalStatuses, (state) => ({ ...state, loading: true, error: null })),
  on(MaritalStatusesActions.loadMaritalStatusesSuccess, (state, { response }) => ({
    ...state,
    maritalStatuses: response.data,
    total: response.total,
    page: response.page,
    pageSize: response.pageSize,
    totalPages: response.totalPages,
    loading: false,
  })),
  on(MaritalStatusesActions.loadMaritalStatusesFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(MaritalStatusesActions.createMaritalStatusSuccess, (state, { maritalStatus }) => ({
    ...state,
    maritalStatuses: [...state.maritalStatuses, maritalStatus],
    loading: false,
  })),
  on(MaritalStatusesActions.updateMaritalStatusSuccess, (state, { maritalStatus }) => ({
    ...state,
    maritalStatuses: state.maritalStatuses.map((ms) => (ms.id === maritalStatus.id ? maritalStatus : ms)),
    loading: false,
  })),
  on(MaritalStatusesActions.deleteMaritalStatusSuccess, (state, { id }) => ({
    ...state,
    maritalStatuses: state.maritalStatuses.filter((ms) => ms.id !== id),
    loading: false,
  })),
  on(MaritalStatusesActions.selectMaritalStatus, (state, { id }) => ({
    ...state,
    selectedMaritalStatus: state.maritalStatuses.find((ms) => ms.id === id) || null,
  })),
  on(MaritalStatusesActions.clearMaritalStatusSelection, (state) => ({
    ...state,
    selectedMaritalStatus: null,
  }))
);

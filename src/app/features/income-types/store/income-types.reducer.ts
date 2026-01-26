import { createReducer, on } from '@ngrx/store';
import { IncomeType } from '../../../core/services/income-types.service';
import * as IncomeTypesActions from './income-types.actions';

export interface IncomeTypesState {
  incomeTypes: IncomeType[];
  selectedIncomeType: IncomeType | null;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  loading: boolean;
  error: any;
}

const initialState: IncomeTypesState = {
  incomeTypes: [],
  selectedIncomeType: null,
  total: 0,
  page: 1,
  pageSize: 10,
  totalPages: 0,
  loading: false,
  error: null,
};

export const incomeTypesReducer = createReducer(
  initialState,
  on(IncomeTypesActions.loadIncomeTypes, (state) => ({ ...state, loading: true, error: null })),
  on(IncomeTypesActions.loadIncomeTypesSuccess, (state, { response }) => ({
    ...state,
    incomeTypes: response.data,
    total: response.total,
    page: response.page,
    pageSize: response.pageSize,
    totalPages: response.totalPages,
    loading: false,
  })),
  on(IncomeTypesActions.loadIncomeTypesFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(IncomeTypesActions.createIncomeTypeSuccess, (state, { incomeType }) => ({
    ...state,
    incomeTypes: [...state.incomeTypes, incomeType],
    loading: false,
  })),
  on(IncomeTypesActions.updateIncomeTypeSuccess, (state, { incomeType }) => ({
    ...state,
    incomeTypes: state.incomeTypes.map((it) => (it.id === incomeType.id ? incomeType : it)),
    loading: false,
  })),
  on(IncomeTypesActions.deleteIncomeTypeSuccess, (state, { id }) => ({
    ...state,
    incomeTypes: state.incomeTypes.filter((it) => it.id !== id),
    loading: false,
  })),
  on(IncomeTypesActions.selectIncomeType, (state, { id }) => ({
    ...state,
    selectedIncomeType: state.incomeTypes.find((it) => it.id === id) || null,
  })),
  on(IncomeTypesActions.clearIncomeTypeSelection, (state) => ({
    ...state,
    selectedIncomeType: null,
  }))
);

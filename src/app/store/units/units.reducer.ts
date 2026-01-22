import { createReducer, on } from '@ngrx/store';
import { Unit } from '../../core/services/units.service';
import * as UnitsActions from './units.actions';

export interface UnitsState {
  units: Unit[];
  selectedUnit: Unit | null;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
}

export const initialState: UnitsState = {
  units: [],
  selectedUnit: null,
  total: 0,
  page: 1,
  pageSize: 10,
  totalPages: 0,
  loading: false,
  error: null
};

export const unitsReducer = createReducer(
  initialState,

  // Load Units
  on(UnitsActions.loadUnits, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(UnitsActions.loadUnitsSuccess, (state, { response }) => ({
    ...state,
    units: response.data,
    total: response.total,
    page: response.page,
    pageSize: response.pageSize,
    totalPages: response.totalPages,
    loading: false
  })),

  on(UnitsActions.loadUnitsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),

  // Load Unit By ID
  on(UnitsActions.loadUnitById, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(UnitsActions.loadUnitByIdSuccess, (state, { unit }) => ({
    ...state,
    selectedUnit: unit,
    loading: false
  })),

  on(UnitsActions.loadUnitByIdFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),

  // Create Unit
  on(UnitsActions.createUnit, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(UnitsActions.createUnitSuccess, (state, { unit }) => ({
    ...state,
    units: [...state.units, unit],
    loading: false
  })),

  on(UnitsActions.createUnitFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),

  // Update Unit
  on(UnitsActions.updateUnit, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(UnitsActions.updateUnitSuccess, (state, { unit }) => ({
    ...state,
    units: state.units.map(u => u.id === unit.id ? unit : u),
    selectedUnit: state.selectedUnit?.id === unit.id ? unit : state.selectedUnit,
    loading: false
  })),

  on(UnitsActions.updateUnitFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),

  // Delete Unit
  on(UnitsActions.deleteUnit, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(UnitsActions.deleteUnitSuccess, (state, { id }) => ({
    ...state,
    units: state.units.filter(u => u.id !== id),
    selectedUnit: state.selectedUnit?.id === id ? null : state.selectedUnit,
    loading: false
  })),

  on(UnitsActions.deleteUnitFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
);

import { createReducer, on } from '@ngrx/store';
import * as FamilyCompositionActions from './family-composition.actions';
import { FamilyComposition, PaginatedResponse } from './family-composition.actions';

export interface FamilyCompositionState {
  familyCompositions: FamilyComposition[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
}

const initialState: FamilyCompositionState = {
  familyCompositions: [],
  total: 0,
  page: 1,
  pageSize: 10,
  totalPages: 0,
  loading: false,
  error: null,
};

export const familyCompositionReducer = createReducer(
  initialState,
  on(FamilyCompositionActions.loadFamilyCompositions, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(FamilyCompositionActions.loadFamilyCompositionsSuccess, (state, { response }) => ({
    ...state,
    familyCompositions: response.data,
    total: response.total,
    page: response.page,
    pageSize: response.pageSize,
    totalPages: response.totalPages,
    loading: false,
  })),
  on(FamilyCompositionActions.loadFamilyCompositionsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(FamilyCompositionActions.createFamilyCompositionSuccess, (state, { familyComposition }) => ({
    ...state,
    familyCompositions: [...state.familyCompositions, familyComposition],
  })),
  on(FamilyCompositionActions.updateFamilyCompositionSuccess, (state, { familyComposition }) => ({
    ...state,
    familyCompositions: state.familyCompositions.map((f) =>
      f.idFamilyComposition === familyComposition.idFamilyComposition &&
      f.idPerson === familyComposition.idPerson
        ? familyComposition
        : f,
    ),
  })),
  on(FamilyCompositionActions.deleteFamilyCompositionSuccess, (state, { idFamilyComposition, idPerson }) => ({
    ...state,
    familyCompositions: state.familyCompositions.filter(
      (f) => !(f.idFamilyComposition === idFamilyComposition && f.idPerson === idPerson),
    ),
  })),
);

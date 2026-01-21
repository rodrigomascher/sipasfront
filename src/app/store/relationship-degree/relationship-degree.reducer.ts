import { createReducer, on } from '@ngrx/store';
import * as RelationshipDegreeActions from './relationship-degree.actions';
import { RelationshipDegree, PaginatedResponse } from './relationship-degree.actions';

export interface RelationshipDegreeState {
  relationshipDegrees: RelationshipDegree[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
}

const initialState: RelationshipDegreeState = {
  relationshipDegrees: [],
  total: 0,
  page: 1,
  pageSize: 10,
  totalPages: 0,
  loading: false,
  error: null,
};

export const relationshipDegreeReducer = createReducer(
  initialState,
  on(RelationshipDegreeActions.loadRelationshipDegrees, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(RelationshipDegreeActions.loadRelationshipDegreesSuccess, (state, { response }) => ({
    ...state,
    relationshipDegrees: response.data,
    total: response.total,
    page: response.page,
    pageSize: response.pageSize,
    totalPages: response.totalPages,
  on(RelationshipDegreeActions.loadRelationshipDegreesFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(RelationshipDegreeActions.createRelationshipDegreeSuccess, (state, { relationshipDegree }) => ({
    ...state,
    relationshipDegrees: [...state.relationshipDegrees, relationshipDegree],
  })),
  on(RelationshipDegreeActions.updateRelationshipDegreeSuccess, (state, { relationshipDegree }) => ({
    ...state,
    relationshipDegrees: state.relationshipDegrees.map((r) =>
      r.id === relationshipDegree.id ? relationshipDegree : r,
    ),
  })),
  on(RelationshipDegreeActions.deleteRelationshipDegreeSuccess, (state, { id }) => ({
    ...state,
    relationshipDegrees: state.relationshipDegrees.filter((r) => r.id !== id),
  })),
);

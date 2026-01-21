import { createReducer, on } from '@ngrx/store';
import * as RelationshipDegreeActions from './relationship-degree.actions';
import { RelationshipDegree } from './relationship-degree.actions';

export interface RelationshipDegreeState {
  relationshipDegrees: RelationshipDegree[];
  loading: boolean;
  error: string | null;
}

const initialState: RelationshipDegreeState = {
  relationshipDegrees: [],
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
  on(RelationshipDegreeActions.loadRelationshipDegreesSuccess, (state, { relationshipDegrees }) => ({
    ...state,
    relationshipDegrees,
    loading: false,
  })),
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

import { createReducer, on } from '@ngrx/store';
import { Person } from '../../../core/services/persons.service';
import * as PersonsActions from './persons.actions';

export interface PersonsState {
  persons: Person[];
  selectedPerson: Person | null;
  loading: boolean;
  error: any | null;
}

export const initialState: PersonsState = {
  persons: [],
  selectedPerson: null,
  loading: false,
  error: null,
};

export const personsReducer = createReducer(
  initialState,

  // Load Persons
  on(PersonsActions.loadPersons, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(PersonsActions.loadPersonsSuccess, (state, { persons }) => ({
    ...state,
    persons,
    loading: false,
  })),
  on(PersonsActions.loadPersonsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Load Person By ID
  on(PersonsActions.loadPersonById, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(PersonsActions.loadPersonByIdSuccess, (state, { person }) => ({
    ...state,
    selectedPerson: person,
    loading: false,
  })),
  on(PersonsActions.loadPersonByIdFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Create Person
  on(PersonsActions.createPerson, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(PersonsActions.createPersonSuccess, (state, { person }) => ({
    ...state,
    persons: [...state.persons, person],
    loading: false,
  })),
  on(PersonsActions.createPersonFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Update Person
  on(PersonsActions.updatePerson, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(PersonsActions.updatePersonSuccess, (state, { person }) => ({
    ...state,
    persons: state.persons.map(p => (p.id === person.id ? person : p)),
    selectedPerson: person,
    loading: false,
  })),
  on(PersonsActions.updatePersonFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Delete Person
  on(PersonsActions.deletePerson, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(PersonsActions.deletePersonSuccess, (state, { id }) => ({
    ...state,
    persons: state.persons.filter(p => p.id !== id),
    loading: false,
  })),
  on(PersonsActions.deletePersonFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Search Persons
  on(PersonsActions.searchPersons, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(PersonsActions.searchPersonsSuccess, (state, { persons }) => ({
    ...state,
    persons,
    loading: false,
  })),
  on(PersonsActions.searchPersonsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Select Person
  on(PersonsActions.selectPerson, (state, { person }) => ({
    ...state,
    selectedPerson: person,
  })),

  // Clear Selection
  on(PersonsActions.clearPersonSelection, (state) => ({
    ...state,
    selectedPerson: null,
  })),
);

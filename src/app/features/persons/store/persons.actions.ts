import { createAction, props } from '@ngrx/store';
import { Person } from '../../../core/services/persons.service';

// Load Actions
export const loadPersons = createAction(
  '[Persons] Load Persons'
);

export const loadPersonsSuccess = createAction(
  '[Persons] Load Persons Success',
  props<{ persons: Person[] }>()
);

export const loadPersonsFailure = createAction(
  '[Persons] Load Persons Failure',
  props<{ error: any }>()
);

// Load by ID Actions
export const loadPersonById = createAction(
  '[Persons] Load Person By ID',
  props<{ id: number }>()
);

export const loadPersonByIdSuccess = createAction(
  '[Persons] Load Person By ID Success',
  props<{ person: Person }>()
);

export const loadPersonByIdFailure = createAction(
  '[Persons] Load Person By ID Failure',
  props<{ error: any }>()
);

// Create Actions
export const createPerson = createAction(
  '[Persons] Create Person',
  props<{ person: Partial<Person> }>()
);

export const createPersonSuccess = createAction(
  '[Persons] Create Person Success',
  props<{ person: Person }>()
);

export const createPersonFailure = createAction(
  '[Persons] Create Person Failure',
  props<{ error: any }>()
);

// Update Actions
export const updatePerson = createAction(
  '[Persons] Update Person',
  props<{ id: number; person: Partial<Person> }>()
);

export const updatePersonSuccess = createAction(
  '[Persons] Update Person Success',
  props<{ person: Person }>()
);

export const updatePersonFailure = createAction(
  '[Persons] Update Person Failure',
  props<{ error: any }>()
);

// Delete Actions
export const deletePerson = createAction(
  '[Persons] Delete Person',
  props<{ id: number }>()
);

export const deletePersonSuccess = createAction(
  '[Persons] Delete Person Success',
  props<{ id: number }>()
);

export const deletePersonFailure = createAction(
  '[Persons] Delete Person Failure',
  props<{ error: any }>()
);

// Search Actions
export const searchPersons = createAction(
  '[Persons] Search Persons',
  props<{ query: string }>()
);

export const searchPersonsSuccess = createAction(
  '[Persons] Search Persons Success',
  props<{ persons: Person[] }>()
);

export const searchPersonsFailure = createAction(
  '[Persons] Search Persons Failure',
  props<{ error: any }>()
);

// Select Person Action
export const selectPerson = createAction(
  '[Persons] Select Person',
  props<{ person: Person | null }>()
);

// Clear Selection
export const clearPersonSelection = createAction(
  '[Persons] Clear Person Selection'
);

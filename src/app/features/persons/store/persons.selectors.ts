import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PersonsState } from './persons.reducer';

export const selectPersonsFeature = createFeatureSelector<PersonsState>('persons');

export const selectAllPersons = createSelector(
  selectPersonsFeature,
  (state: PersonsState) => state.persons
);

export const selectSelectedPerson = createSelector(
  selectPersonsFeature,
  (state: PersonsState) => state.selectedPerson
);

export const selectPersonsLoading = createSelector(
  selectPersonsFeature,
  (state: PersonsState) => state.loading
);

export const selectPersonsError = createSelector(
  selectPersonsFeature,
  (state: PersonsState) => state.error
);

export const selectPersonCount = createSelector(
  selectAllPersons,
  (persons) => persons.length
);

export const selectPersonById = (id: number) =>
  createSelector(
    selectAllPersons,
    (persons) => persons.find(p => p.id === id) || null
  );

export const selectPersonsByCpf = (cpf: string) =>
  createSelector(
    selectAllPersons,
    (persons) => persons.find(p => p.cpf === cpf) || null
  );

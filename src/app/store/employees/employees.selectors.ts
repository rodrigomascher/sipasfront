import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EmployeesState } from './employees.reducer';

const selectEmployeesState = createFeatureSelector<EmployeesState>('employees');

export const selectAllEmployees = createSelector(
  selectEmployeesState,
  (state: EmployeesState) => state.employees
);

export const selectSelectedEmployee = createSelector(
  selectEmployeesState,
  (state: EmployeesState) => state.selectedEmployee
);

export const selectEmployeesLoading = createSelector(
  selectEmployeesState,
  (state: EmployeesState) => state.loading
);

export const selectEmployeesError = createSelector(
  selectEmployeesState,
  (state: EmployeesState) => state.error
);

export const selectEmployeeById = (id: number) => createSelector(
  selectAllEmployees,
  (employees) => employees.find(e => e.id === id) || null
);

export const selectEmployeeCount = createSelector(
  selectAllEmployees,
  (employees) => employees.length
);

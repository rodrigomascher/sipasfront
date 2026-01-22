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

export const selectTotalItems = createSelector(
  selectEmployeesState,
  (state: EmployeesState) => state.total,
);

export const selectCurrentPage = createSelector(
  selectEmployeesState,
  (state: EmployeesState) => state.page,
);

export const selectTotalPages = createSelector(
  selectEmployeesState,
  (state: EmployeesState) => state.totalPages,
);

export const selectCurrentPageStart = createSelector(
  selectEmployeesState,
  (state: EmployeesState) => (state.page - 1) * state.pageSize + 1,
);

export const selectCurrentPageEnd = createSelector(
  selectEmployeesState,
  (state: EmployeesState) => Math.min(state.page * state.pageSize, state.total),
);

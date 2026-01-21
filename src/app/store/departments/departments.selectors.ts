import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DepartmentsState } from './departments.reducer';

const selectDepartmentsState = createFeatureSelector<DepartmentsState>('departments');

export const selectAllDepartments = createSelector(
  selectDepartmentsState,
  (state: DepartmentsState) => state.departments
);

export const selectSelectedDepartment = createSelector(
  selectDepartmentsState,
  (state: DepartmentsState) => state.selectedDepartment
);

export const selectDepartmentsLoading = createSelector(
  selectDepartmentsState,
  (state: DepartmentsState) => state.loading
);

export const selectDepartmentsError = createSelector(
  selectDepartmentsState,
  (state: DepartmentsState) => state.error
);

export const selectDepartmentById = (id: number) => createSelector(
  selectAllDepartments,
  (departments) => departments.find(d => d.id === id) || null
);

export const selectDepartmentCount = createSelector(
  selectAllDepartments,
  (departments) => departments.length
);

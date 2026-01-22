import { createReducer, on } from '@ngrx/store';
import { Department } from '../../core/services/departments.service';
import * as DepartmentsActions from './departments.actions';

export interface DepartmentsState {
  departments: Department[];
  selectedDepartment: Department | null;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
}

export const initialState: DepartmentsState = {
  departments: [],
  selectedDepartment: null,
  total: 0,
  page: 1,
  pageSize: 10,
  totalPages: 0,
  loading: false,
  error: null
};

export const departmentsReducer = createReducer(
  initialState,

  // Load Departments
  on(DepartmentsActions.loadDepartments, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(DepartmentsActions.loadDepartmentsSuccess, (state, { response }) => ({
    ...state,
    departments: response.data,
    total: response.total,
    page: response.page,
    pageSize: response.pageSize,
    totalPages: response.totalPages,
    loading: false
  })),
  on(DepartmentsActions.loadDepartmentsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Load Department by ID
  on(DepartmentsActions.loadDepartmentById, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(DepartmentsActions.loadDepartmentByIdSuccess, (state, { department }) => ({
    ...state,
    selectedDepartment: department,
    loading: false
  })),
  on(DepartmentsActions.loadDepartmentByIdFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Create Department
  on(DepartmentsActions.createDepartment, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(DepartmentsActions.createDepartmentSuccess, (state, { department }) => ({
    ...state,
    departments: [...state.departments, department],
    loading: false
  })),
  on(DepartmentsActions.createDepartmentFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Update Department
  on(DepartmentsActions.updateDepartment, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(DepartmentsActions.updateDepartmentSuccess, (state, { department }) => ({
    ...state,
    departments: state.departments.map(d => d.id === department.id ? department : d),
    selectedDepartment: department,
    loading: false
  })),
  on(DepartmentsActions.updateDepartmentFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Delete Department
  on(DepartmentsActions.deleteDepartment, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(DepartmentsActions.deleteDepartmentSuccess, (state, { id }) => ({
    ...state,
    departments: state.departments.filter(d => d.id !== id),
    selectedDepartment: null,
    loading: false
  })),
  on(DepartmentsActions.deleteDepartmentFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);

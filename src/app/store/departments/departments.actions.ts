import { createAction, props } from '@ngrx/store';
import { Department, CreateDepartmentDto, UpdateDepartmentDto, PaginationParams } from '../../core/services/departments.service';

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Load Departments
export const loadDepartments = createAction(
  '[Departments] Load Departments',
  props<{ params?: PaginationParams }>()
);

export const loadDepartmentsSuccess = createAction(
  '[Departments] Load Departments Success',
  props<{ response: PaginatedResponse<Department> }>()
);

export const loadDepartmentsFailure = createAction(
  '[Departments] Load Departments Failure',
  props<{ error: string }>()
);

// Load Department by ID
export const loadDepartmentById = createAction(
  '[Departments] Load Department by ID',
  props<{ id: number }>()
);

export const loadDepartmentByIdSuccess = createAction(
  '[Departments] Load Department by ID Success',
  props<{ department: Department }>()
);

export const loadDepartmentByIdFailure = createAction(
  '[Departments] Load Department by ID Failure',
  props<{ error: string }>()
);

// Create Department
export const createDepartment = createAction(
  '[Departments] Create Department',
  props<{ department: CreateDepartmentDto }>()
);

export const createDepartmentSuccess = createAction(
  '[Departments] Create Department Success',
  props<{ department: Department }>()
);

export const createDepartmentFailure = createAction(
  '[Departments] Create Department Failure',
  props<{ error: string }>()
);

// Update Department
export const updateDepartment = createAction(
  '[Departments] Update Department',
  props<{ id: number; department: UpdateDepartmentDto }>()
);

export const updateDepartmentSuccess = createAction(
  '[Departments] Update Department Success',
  props<{ department: Department }>()
);

export const updateDepartmentFailure = createAction(
  '[Departments] Update Department Failure',
  props<{ error: string }>()
);

// Delete Department
export const deleteDepartment = createAction(
  '[Departments] Delete Department',
  props<{ id: number }>()
);

export const deleteDepartmentSuccess = createAction(
  '[Departments] Delete Department Success',
  props<{ id: number }>()
);

export const deleteDepartmentFailure = createAction(
  '[Departments] Delete Department Failure',
  props<{ error: string }>()
);

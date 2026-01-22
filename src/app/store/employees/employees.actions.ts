import { createAction, props } from '@ngrx/store';
import { Employee, CreateEmployeeDto, UpdateEmployeeDto, PaginationParams } from '../../core/services/employees.service';

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const loadEmployees = createAction('[Employees] Load Employees', props<{ params?: PaginationParams }>());

export const loadEmployeesSuccess = createAction(
  '[Employees] Load Employees Success',
  props<{ response: PaginatedResponse<Employee> }>()
);

export const loadEmployeesFailure = createAction(
  '[Employees] Load Employees Failure',
  props<{ error: string }>()
);

export const loadEmployeeById = createAction(
  '[Employees] Load Employee by ID',
  props<{ id: number }>()
);

export const loadEmployeeByIdSuccess = createAction(
  '[Employees] Load Employee by ID Success',
  props<{ employee: Employee }>()
);

export const loadEmployeeByIdFailure = createAction(
  '[Employees] Load Employee by ID Failure',
  props<{ error: string }>()
);

export const createEmployee = createAction(
  '[Employees] Create Employee',
  props<{ employee: CreateEmployeeDto }>()
);

export const createEmployeeSuccess = createAction(
  '[Employees] Create Employee Success',
  props<{ employee: Employee }>()
);

export const createEmployeeFailure = createAction(
  '[Employees] Create Employee Failure',
  props<{ error: string }>()
);

export const updateEmployee = createAction(
  '[Employees] Update Employee',
  props<{ id: number; employee: UpdateEmployeeDto }>()
);

export const updateEmployeeSuccess = createAction(
  '[Employees] Update Employee Success',
  props<{ employee: Employee }>()
);

export const updateEmployeeFailure = createAction(
  '[Employees] Update Employee Failure',
  props<{ error: string }>()
);

export const deleteEmployee = createAction(
  '[Employees] Delete Employee',
  props<{ id: number }>()
);

export const deleteEmployeeSuccess = createAction(
  '[Employees] Delete Employee Success',
  props<{ id: number }>()
);

export const deleteEmployeeFailure = createAction(
  '[Employees] Delete Employee Failure',
  props<{ error: string }>()
);

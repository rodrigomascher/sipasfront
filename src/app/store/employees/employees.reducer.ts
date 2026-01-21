import { createReducer, on } from '@ngrx/store';
import { Employee } from '../../core/services/employees.service';
import * as EmployeesActions from './employees.actions';

export interface EmployeesState {
  employees: Employee[];
  selectedEmployee: Employee | null;
  loading: boolean;
  error: string | null;
}

export const initialState: EmployeesState = {
  employees: [],
  selectedEmployee: null,
  loading: false,
  error: null
};

export const employeesReducer = createReducer(
  initialState,

  on(EmployeesActions.loadEmployees, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(EmployeesActions.loadEmployeesSuccess, (state, { employees }) => ({
    ...state,
    employees,
    loading: false
  })),
  on(EmployeesActions.loadEmployeesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(EmployeesActions.loadEmployeeById, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(EmployeesActions.loadEmployeeByIdSuccess, (state, { employee }) => ({
    ...state,
    selectedEmployee: employee,
    loading: false
  })),
  on(EmployeesActions.loadEmployeeByIdFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(EmployeesActions.createEmployee, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(EmployeesActions.createEmployeeSuccess, (state, { employee }) => ({
    ...state,
    employees: [...state.employees, employee],
    loading: false
  })),
  on(EmployeesActions.createEmployeeFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(EmployeesActions.updateEmployee, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(EmployeesActions.updateEmployeeSuccess, (state, { employee }) => ({
    ...state,
    employees: state.employees.map(e => e.id === employee.id ? employee : e),
    selectedEmployee: employee,
    loading: false
  })),
  on(EmployeesActions.updateEmployeeFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(EmployeesActions.deleteEmployee, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(EmployeesActions.deleteEmployeeSuccess, (state, { id }) => ({
    ...state,
    employees: state.employees.filter(e => e.id !== id),
    selectedEmployee: null,
    loading: false
  })),
  on(EmployeesActions.deleteEmployeeFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);

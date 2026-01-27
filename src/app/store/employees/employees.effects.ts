import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { EmployeesService, Employee } from '../../core/services/employees.service';
import * as EmployeesActions from './employees.actions';

@Injectable()
export class EmployeesEffects {
  loadEmployees$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeesActions.loadEmployees),
      concatMap(({ params }) => {
        console.log('[EmployeesEffects] loadEmployees with params:', params);
        return this.employeesService.getEmployees(params).pipe(
          map((response) => {
            console.log('[EmployeesEffects] loadEmployeesSuccess response:', response);
            return EmployeesActions.loadEmployeesSuccess({ response });
          }),
          catchError(error => {
            console.error('[EmployeesEffects] loadEmployeesFailure error:', error);
            return of(EmployeesActions.loadEmployeesFailure({ error: error.message }));
          })
        );
      })
    )
  );

  loadEmployeeById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeesActions.loadEmployeeById),
      switchMap(({ id }) =>
        this.employeesService.getEmployeeById(id).pipe(
          map(employee => EmployeesActions.loadEmployeeByIdSuccess({ employee })),
          catchError(error => of(EmployeesActions.loadEmployeeByIdFailure({ error: error.message })))
        )
      )
    )
  );

  createEmployee$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeesActions.createEmployee),
      switchMap(({ employee }) =>
        this.employeesService.createEmployee(employee).pipe(
          map(newEmployee => EmployeesActions.createEmployeeSuccess({ employee: newEmployee })),
          catchError(error => of(EmployeesActions.createEmployeeFailure({ error: error.message })))
        )
      )
    )
  );

  updateEmployee$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeesActions.updateEmployee),
      switchMap(({ id, employee }) =>
        this.employeesService.updateEmployee(id, employee).pipe(
          map(updatedEmployee => EmployeesActions.updateEmployeeSuccess({ employee: updatedEmployee })),
          catchError(error => of(EmployeesActions.updateEmployeeFailure({ error: error.message })))
        )
      )
    )
  );

  deleteEmployee$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeesActions.deleteEmployee),
      switchMap(({ id }) =>
        this.employeesService.deleteEmployee(id).pipe(
          map(() => EmployeesActions.deleteEmployeeSuccess({ id })),
          catchError(error => of(EmployeesActions.deleteEmployeeFailure({ error: error.message })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private employeesService: EmployeesService
  ) {}
}

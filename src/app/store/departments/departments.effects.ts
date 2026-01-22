import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { DepartmentsService, Department } from '../../core/services/departments.service';
import * as DepartmentsActions from './departments.actions';

@Injectable()
export class DepartmentsEffects {
  loadDepartments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DepartmentsActions.loadDepartments),
      switchMap(({ params }) =>
        this.departmentsService.getDepartments(params).pipe(
          map((response) => DepartmentsActions.loadDepartmentsSuccess({ response })),
          catchError(error => of(DepartmentsActions.loadDepartmentsFailure({ error: error.message })))
        )
      )
    )
  );

  loadDepartmentById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DepartmentsActions.loadDepartmentById),
      switchMap(({ id }) =>
        this.departmentsService.getDepartmentById(id).pipe(
          map(department => DepartmentsActions.loadDepartmentByIdSuccess({ department })),
          catchError(error => of(DepartmentsActions.loadDepartmentByIdFailure({ error: error.message })))
        )
      )
    )
  );

  createDepartment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DepartmentsActions.createDepartment),
      switchMap(({ department }) =>
        this.departmentsService.createDepartment(department).pipe(
          map(newDepartment => DepartmentsActions.createDepartmentSuccess({ department: newDepartment })),
          catchError(error => of(DepartmentsActions.createDepartmentFailure({ error: error.message })))
        )
      )
    )
  );

  updateDepartment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DepartmentsActions.updateDepartment),
      switchMap(({ id, department }) =>
        this.departmentsService.updateDepartment(id, department).pipe(
          map(updatedDepartment => DepartmentsActions.updateDepartmentSuccess({ department: updatedDepartment })),
          catchError(error => of(DepartmentsActions.updateDepartmentFailure({ error: error.message })))
        )
      )
    )
  );

  deleteDepartment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DepartmentsActions.deleteDepartment),
      switchMap(({ id }) =>
        this.departmentsService.deleteDepartment(id).pipe(
          map(() => DepartmentsActions.deleteDepartmentSuccess({ id })),
          catchError(error => of(DepartmentsActions.deleteDepartmentFailure({ error: error.message })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private departmentsService: DepartmentsService
  ) {}
}

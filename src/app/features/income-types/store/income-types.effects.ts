import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { IncomeTypesService } from '../../../core/services/income-types.service';
import * as IncomeTypesActions from './income-types.actions';

@Injectable()
export class IncomeTypesEffects {
  loadIncomeTypes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(IncomeTypesActions.loadIncomeTypes),
      switchMap(({ params }) =>
        this.incomeTypesService.getAll(params).pipe(
          map((response) => IncomeTypesActions.loadIncomeTypesSuccess({ response })),
          catchError((error) => of(IncomeTypesActions.loadIncomeTypesFailure({ error })))
        )
      )
    )
  );

  loadIncomeTypeById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(IncomeTypesActions.loadIncomeTypeById),
      switchMap(({ id }) =>
        this.incomeTypesService.getById(id).pipe(
          map((incomeType) => IncomeTypesActions.loadIncomeTypeByIdSuccess({ incomeType })),
          catchError((error) => of(IncomeTypesActions.loadIncomeTypeByIdFailure({ error })))
        )
      )
    )
  );

  createIncomeType$ = createEffect(() =>
    this.actions$.pipe(
      ofType(IncomeTypesActions.createIncomeType),
      switchMap(({ incomeType }) =>
        this.incomeTypesService.create(incomeType).pipe(
          map((createdIncomeType) => IncomeTypesActions.createIncomeTypeSuccess({ incomeType: createdIncomeType })),
          catchError((error) => of(IncomeTypesActions.createIncomeTypeFailure({ error })))
        )
      )
    )
  );

  updateIncomeType$ = createEffect(() =>
    this.actions$.pipe(
      ofType(IncomeTypesActions.updateIncomeType),
      switchMap(({ id, incomeType }) =>
        this.incomeTypesService.update(id, incomeType).pipe(
          map((updatedIncomeType) => IncomeTypesActions.updateIncomeTypeSuccess({ incomeType: updatedIncomeType })),
          catchError((error) => of(IncomeTypesActions.updateIncomeTypeFailure({ error })))
        )
      )
    )
  );

  deleteIncomeType$ = createEffect(() =>
    this.actions$.pipe(
      ofType(IncomeTypesActions.deleteIncomeType),
      switchMap(({ id }) =>
        this.incomeTypesService.delete(id).pipe(
          map(() => IncomeTypesActions.deleteIncomeTypeSuccess({ id })),
          catchError((error) => of(IncomeTypesActions.deleteIncomeTypeFailure({ error })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private incomeTypesService: IncomeTypesService
  ) {}
}

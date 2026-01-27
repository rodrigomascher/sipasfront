import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, concatMap, switchMap } from 'rxjs/operators';
import { MaritalStatusesService } from '../../../core/services/marital-statuses.service';
import * as MaritalStatusesActions from './marital-statuses.actions';

@Injectable()
export class MaritalStatusesEffects {
  loadMaritalStatuses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MaritalStatusesActions.loadMaritalStatuses),
      concatMap(({ params }) =>
        this.maritalStatusesService.getAll(params).pipe(
          map((response) => MaritalStatusesActions.loadMaritalStatusesSuccess({ response })),
          catchError((error) => of(MaritalStatusesActions.loadMaritalStatusesFailure({ error })))
        )
      )
    )
  );

  loadMaritalStatusById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MaritalStatusesActions.loadMaritalStatusById),
      switchMap(({ id }) =>
        this.maritalStatusesService.getById(id).pipe(
          map((maritalStatus) => MaritalStatusesActions.loadMaritalStatusByIdSuccess({ maritalStatus })),
          catchError((error) => of(MaritalStatusesActions.loadMaritalStatusByIdFailure({ error })))
        )
      )
    )
  );

  createMaritalStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MaritalStatusesActions.createMaritalStatus),
      switchMap(({ maritalStatus }) =>
        this.maritalStatusesService.create(maritalStatus).pipe(
          map((createdMaritalStatus) => MaritalStatusesActions.createMaritalStatusSuccess({ maritalStatus: createdMaritalStatus })),
          catchError((error) => of(MaritalStatusesActions.createMaritalStatusFailure({ error })))
        )
      )
    )
  );

  updateMaritalStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MaritalStatusesActions.updateMaritalStatus),
      switchMap(({ id, maritalStatus }) =>
        this.maritalStatusesService.update(id, maritalStatus).pipe(
          map((updatedMaritalStatus) => MaritalStatusesActions.updateMaritalStatusSuccess({ maritalStatus: updatedMaritalStatus })),
          catchError((error) => of(MaritalStatusesActions.updateMaritalStatusFailure({ error })))
        )
      )
    )
  );

  deleteMaritalStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MaritalStatusesActions.deleteMaritalStatus),
      switchMap(({ id }) =>
        this.maritalStatusesService.delete(id).pipe(
          map(() => MaritalStatusesActions.deleteMaritalStatusSuccess({ id })),
          catchError((error) => of(MaritalStatusesActions.deleteMaritalStatusFailure({ error })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private maritalStatusesService: MaritalStatusesService
  ) {}
}

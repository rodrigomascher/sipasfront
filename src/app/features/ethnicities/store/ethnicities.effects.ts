import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { EthnicitiesService } from '../../../core/services/ethnicities.service';
import * as EthnicitiesActions from './ethnicities.actions';

@Injectable()
export class EthnicitiesEffects {
  loadEthnicities$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EthnicitiesActions.loadEthnicities),
      switchMap(({ params }) =>
        this.ethnicitiesService.getAll(params).pipe(
          map((response) => EthnicitiesActions.loadEthnicitiesSuccess({ response })),
          catchError((error) => of(EthnicitiesActions.loadEthnicitiesFailure({ error })))
        )
      )
    )
  );

  loadEthnicityById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EthnicitiesActions.loadEthnicityById),
      switchMap(({ id }) =>
        this.ethnicitiesService.getById(id).pipe(
          map((ethnicity) => EthnicitiesActions.loadEthnicityByIdSuccess({ ethnicity })),
          catchError((error) => of(EthnicitiesActions.loadEthnicityByIdFailure({ error })))
        )
      )
    )
  );

  createEthnicity$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EthnicitiesActions.createEthnicity),
      switchMap(({ ethnicity }) =>
        this.ethnicitiesService.create(ethnicity).pipe(
          map((createdEthnicity) => EthnicitiesActions.createEthnicitySuccess({ ethnicity: createdEthnicity })),
          catchError((error) => of(EthnicitiesActions.createEthnicityFailure({ error })))
        )
      )
    )
  );

  updateEthnicity$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EthnicitiesActions.updateEthnicity),
      switchMap(({ id, ethnicity }) =>
        this.ethnicitiesService.update(id, ethnicity).pipe(
          map((updatedEthnicity) => EthnicitiesActions.updateEthnicitySuccess({ ethnicity: updatedEthnicity })),
          catchError((error) => of(EthnicitiesActions.updateEthnicityFailure({ error })))
        )
      )
    )
  );

  deleteEthnicity$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EthnicitiesActions.deleteEthnicity),
      switchMap(({ id }) =>
        this.ethnicitiesService.delete(id).pipe(
          map(() => EthnicitiesActions.deleteEthnicitySuccess({ id })),
          catchError((error) => of(EthnicitiesActions.deleteEthnicityFailure({ error })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private ethnicitiesService: EthnicitiesService
  ) {}
}

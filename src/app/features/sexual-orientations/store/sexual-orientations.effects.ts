import { Injectable } from '@angular/core';
import { Actions as NgRxActions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { SexualOrientationsService } from '../../../core/services/sexual-orientations.service';
import * as Actions from './sexual-orientations.actions';

@Injectable()
export class SexualOrientationsEffects {
  loadSexualOrientations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(Actions.loadSexualOrientations),
      switchMap(({ params }) =>
        this.service.getAll(params).pipe(
          map((response) => Actions.loadSexualOrientationsSuccess({ response })),
          catchError((error) => of(Actions.loadSexualOrientationsFailure({ error })))
        )
      )
    )
  );

  createSexualOrientation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(Actions.createSexualOrientation),
      switchMap(({ sexualOrientation }) =>
        this.service.create(sexualOrientation).pipe(
          map((created) => Actions.createSexualOrientationSuccess({ sexualOrientation: created })),
          catchError((error) => of(Actions.createSexualOrientationFailure({ error })))
        )
      )
    )
  );

  updateSexualOrientation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(Actions.updateSexualOrientation),
      switchMap(({ id, sexualOrientation }) =>
        this.service.update(id, sexualOrientation).pipe(
          map((updated) => Actions.updateSexualOrientationSuccess({ sexualOrientation: updated })),
          catchError((error) => of(Actions.updateSexualOrientationFailure({ error })))
        )
      )
    )
  );

  deleteSexualOrientation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(Actions.deleteSexualOrientation),
      switchMap(({ id }) =>
        this.service.delete(id).pipe(
          map(() => Actions.deleteSexualOrientationSuccess({ id })),
          catchError((error) => of(Actions.deleteSexualOrientationFailure({ error })))
        )
      )
    )
  );

  constructor(
    private actions$: NgRxActions,
    private service: SexualOrientationsService
  ) {}
}

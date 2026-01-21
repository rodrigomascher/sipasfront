import { Injectable } from '@angular/core';
import { Actions as NgRxActions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { GenderIdentitiesService } from '../../../core/services/gender-identities.service';
import * as Actions from './gender-identities.actions';

@Injectable()
export class GenderIdentitiesEffects {
  loadGenderIdentities$ = createEffect(() =>
    this.actions$.pipe(
      ofType(Actions.loadGenderIdentities),
      switchMap(() =>
        this.service.getAll().pipe(
          map((genderIdentities) => Actions.loadGenderIdentitiesSuccess({ genderIdentities })),
          catchError((error) => of(Actions.loadGenderIdentitiesFailure({ error })))
        )
      )
    )
  );

  createGenderIdentity$ = createEffect(() =>
    this.actions$.pipe(
      ofType(Actions.createGenderIdentity),
      switchMap(({ genderIdentity }) =>
        this.service.create(genderIdentity).pipe(
          map((created) => Actions.createGenderIdentitySuccess({ genderIdentity: created })),
          catchError((error) => of(Actions.createGenderIdentityFailure({ error })))
        )
      )
    )
  );

  updateGenderIdentity$ = createEffect(() =>
    this.actions$.pipe(
      ofType(Actions.updateGenderIdentity),
      switchMap(({ id, genderIdentity }) =>
        this.service.update(id, genderIdentity).pipe(
          map((updated) => Actions.updateGenderIdentitySuccess({ genderIdentity: updated })),
          catchError((error) => of(Actions.updateGenderIdentityFailure({ error })))
        )
      )
    )
  );

  deleteGenderIdentity$ = createEffect(() =>
    this.actions$.pipe(
      ofType(Actions.deleteGenderIdentity),
      switchMap(({ id }) =>
        this.service.delete(id).pipe(
          map(() => Actions.deleteGenderIdentitySuccess({ id })),
          catchError((error) => of(Actions.deleteGenderIdentityFailure({ error })))
        )
      )
    )
  );

  constructor(
    private actions$: NgRxActions,
    private service: GenderIdentitiesService
  ) {}
}

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { GendersService } from '../../../core/services/genders.service';
import * as GendersActions from './genders.actions';

@Injectable()
export class GendersEffects {
  loadGenders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GendersActions.loadGenders),
      switchMap(({ params }) =>
        this.gendersService.getAll(params).pipe(
          map((response) => GendersActions.loadGendersSuccess({ response })),
          catchError((error) => of(GendersActions.loadGendersFailure({ error })))
        )
      )
    )
  );

  loadGenderById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GendersActions.loadGenderById),
      switchMap(({ id }) =>
        this.gendersService.getById(id).pipe(
          map((gender) => GendersActions.loadGenderByIdSuccess({ gender })),
          catchError((error) => of(GendersActions.loadGenderByIdFailure({ error })))
        )
      )
    )
  );

  createGender$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GendersActions.createGender),
      switchMap(({ gender }) =>
        this.gendersService.create(gender).pipe(
          map((createdGender) => GendersActions.createGenderSuccess({ gender: createdGender })),
          catchError((error) => of(GendersActions.createGenderFailure({ error })))
        )
      )
    )
  );

  updateGender$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GendersActions.updateGender),
      switchMap(({ id, gender }) =>
        this.gendersService.update(id, gender).pipe(
          map((updatedGender) => GendersActions.updateGenderSuccess({ gender: updatedGender })),
          catchError((error) => of(GendersActions.updateGenderFailure({ error })))
        )
      )
    )
  );

  deleteGender$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GendersActions.deleteGender),
      switchMap(({ id }) =>
        this.gendersService.delete(id).pipe(
          map(() => GendersActions.deleteGenderSuccess({ id })),
          catchError((error) => of(GendersActions.deleteGenderFailure({ error })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private gendersService: GendersService
  ) {}
}

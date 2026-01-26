import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { RacesService } from '../../../core/services/races.service';
import * as RacesActions from './races.actions';

@Injectable()
export class RacesEffects {
  loadRaces$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RacesActions.loadRaces),
      switchMap(({ params }) =>
        this.racesService.getAll(params).pipe(
          map((response) => RacesActions.loadRacesSuccess({ response })),
          catchError((error) => of(RacesActions.loadRacesFailure({ error })))
        )
      )
    )
  );

  loadRaceById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RacesActions.loadRaceById),
      switchMap(({ id }) =>
        this.racesService.getById(id).pipe(
          map((race) => RacesActions.loadRaceByIdSuccess({ race })),
          catchError((error) => of(RacesActions.loadRaceByIdFailure({ error })))
        )
      )
    )
  );

  createRace$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RacesActions.createRace),
      switchMap(({ race }) =>
        this.racesService.create(race).pipe(
          map((createdRace) => RacesActions.createRaceSuccess({ race: createdRace })),
          catchError((error) => of(RacesActions.createRaceFailure({ error })))
        )
      )
    )
  );

  updateRace$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RacesActions.updateRace),
      switchMap(({ id, race }) =>
        this.racesService.update(id, race).pipe(
          map((updatedRace) => RacesActions.updateRaceSuccess({ race: updatedRace })),
          catchError((error) => of(RacesActions.updateRaceFailure({ error })))
        )
      )
    )
  );

  deleteRace$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RacesActions.deleteRace),
      switchMap(({ id }) =>
        this.racesService.delete(id).pipe(
          map(() => RacesActions.deleteRaceSuccess({ id })),
          catchError((error) => of(RacesActions.deleteRaceFailure({ error })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private racesService: RacesService
  ) {}
}

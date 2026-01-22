import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { UnitsService } from '../../core/services/units.service';
import * as UnitsActions from './units.actions';

@Injectable()
export class UnitsEffects {
  loadUnits$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UnitsActions.loadUnits),
      mergeMap(({ params }) => {
        console.log('[UnitsEffects] loadUnits with params:', params);
        return this.unitsService.getUnits(params).pipe(
          map(response => {
            console.log('[UnitsEffects] loadUnitsSuccess response:', response);
            return UnitsActions.loadUnitsSuccess({ response });
          }),
          catchError(error => {
            console.error('[UnitsEffects] loadUnitsFailure error:', error);
            return of(UnitsActions.loadUnitsFailure({ error: error.message }));
          })
        );
      })
    )
  );

  loadUnitById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UnitsActions.loadUnitById),
      mergeMap(({ id }) =>
        this.unitsService.getUnitById(id).pipe(
          map(unit => UnitsActions.loadUnitByIdSuccess({ unit })),
          catchError(error => of(UnitsActions.loadUnitByIdFailure({ error: error.message })))
        )
      )
    )
  );

  createUnit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UnitsActions.createUnit),
      mergeMap(({ unit }) =>
        this.unitsService.createUnit(unit).pipe(
          map(newUnit => UnitsActions.createUnitSuccess({ unit: newUnit })),
          catchError(error => of(UnitsActions.createUnitFailure({ error: error.message })))
        )
      )
    )
  );

  updateUnit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UnitsActions.updateUnit),
      mergeMap(({ id, unit }) =>
        this.unitsService.updateUnit(id, unit).pipe(
          map(updatedUnit => UnitsActions.updateUnitSuccess({ unit: updatedUnit })),
          catchError(error => of(UnitsActions.updateUnitFailure({ error: error.message })))
        )
      )
    )
  );

  deleteUnit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UnitsActions.deleteUnit),
      mergeMap(({ id }) =>
        this.unitsService.deleteUnit(id).pipe(
          map(() => UnitsActions.deleteUnitSuccess({ id })),
          catchError(error => of(UnitsActions.deleteUnitFailure({ error: error.message })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private unitsService: UnitsService
  ) {}
}

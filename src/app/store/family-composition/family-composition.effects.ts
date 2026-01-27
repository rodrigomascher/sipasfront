import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, concatMap, switchMap } from 'rxjs/operators';
import * as FamilyCompositionActions from './family-composition.actions';
import { FamilyCompositionService } from '../../core/services/family-composition.service';

@Injectable()
export class FamilyCompositionEffects {
  loadFamilyCompositions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FamilyCompositionActions.loadFamilyCompositions),
      concatMap(({ params }) => {
        console.log('[FamilyCompositionEffects] loadFamilyCompositions with params:', params);
        return this.service.getAll(params).pipe(
          map((response) => {
            console.log('[FamilyCompositionEffects] loadFamilyCompositionsSuccess response:', response);
            return FamilyCompositionActions.loadFamilyCompositionsSuccess({ response });
          }),
          catchError((error) => {
            console.error('[FamilyCompositionEffects] loadFamilyCompositionsFailure error:', error);
            return of(FamilyCompositionActions.loadFamilyCompositionsFailure({ error: error.message }));
          }),
        );
      }),
    ),
  );

  createFamilyComposition$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FamilyCompositionActions.createFamilyComposition),
      switchMap(({ familyComposition }) =>
        this.service.createFamilyComposition(familyComposition).pipe(
          map((created) =>
            FamilyCompositionActions.createFamilyCompositionSuccess({ familyComposition: created }),
          ),
          catchError((error) =>
            of(FamilyCompositionActions.createFamilyCompositionFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  );

  updateFamilyComposition$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FamilyCompositionActions.updateFamilyComposition),
      switchMap(({ idFamilyComposition, idPerson, familyComposition }) =>
        this.service.updateFamilyComposition(idFamilyComposition, idPerson, familyComposition).pipe(
          map((updated) =>
            FamilyCompositionActions.updateFamilyCompositionSuccess({ familyComposition: updated }),
          ),
          catchError((error) =>
            of(FamilyCompositionActions.updateFamilyCompositionFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  );

  deleteFamilyComposition$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FamilyCompositionActions.deleteFamilyComposition),
      switchMap(({ idFamilyComposition, idPerson }) =>
        this.service.deleteFamilyComposition(idFamilyComposition, idPerson).pipe(
          map(() =>
            FamilyCompositionActions.deleteFamilyCompositionSuccess({ idFamilyComposition, idPerson }),
          ),
          catchError((error) =>
            of(FamilyCompositionActions.deleteFamilyCompositionFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  );

  constructor(private actions$: Actions, private service: FamilyCompositionService) {}
}

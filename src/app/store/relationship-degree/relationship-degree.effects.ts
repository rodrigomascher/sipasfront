import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as RelationshipDegreeActions from './relationship-degree.actions';
import { RelationshipDegreeService } from '../../core/services/relationship-degree.service';

@Injectable()
export class RelationshipDegreeEffects {
  loadRelationshipDegrees$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RelationshipDegreeActions.loadRelationshipDegrees),
      switchMap(({ params }) =>
        this.service.getAll(params).pipe(
          map((response) =>
            RelationshipDegreeActions.loadRelationshipDegreesSuccess({ response }),
          ),
          catchError((error) =>
            of(RelationshipDegreeActions.loadRelationshipDegreesFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  );

  createRelationshipDegree$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RelationshipDegreeActions.createRelationshipDegree),
      switchMap(({ relationshipDegree }) =>
        this.service.create(relationshipDegree).pipe(
          map((created) =>
            RelationshipDegreeActions.createRelationshipDegreeSuccess({ relationshipDegree: created }),
          ),
          catchError((error) =>
            of(RelationshipDegreeActions.createRelationshipDegreeFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  );

  updateRelationshipDegree$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RelationshipDegreeActions.updateRelationshipDegree),
      switchMap(({ id, relationshipDegree }) =>
        this.service.update(id, relationshipDegree).pipe(
          map((updated) =>
            RelationshipDegreeActions.updateRelationshipDegreeSuccess({ relationshipDegree: updated }),
          ),
          catchError((error) =>
            of(RelationshipDegreeActions.updateRelationshipDegreeFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  );

  deleteRelationshipDegree$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RelationshipDegreeActions.deleteRelationshipDegree),
      switchMap(({ id }) =>
        this.service.delete(id).pipe(
          map(() =>
            RelationshipDegreeActions.deleteRelationshipDegreeSuccess({ id }),
          ),
          catchError((error) =>
            of(RelationshipDegreeActions.deleteRelationshipDegreeFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  );

  constructor(private actions$: Actions, private service: RelationshipDegreeService) {}
}

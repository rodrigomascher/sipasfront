import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { PersonsService } from '../../../core/services/persons.service';
import * as PersonsActions from './persons.actions';

@Injectable()
export class PersonsEffects {
  loadPersons$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PersonsActions.loadPersons),
      switchMap(() =>
        this.personsService.getPersons().pipe(
          map((persons) => PersonsActions.loadPersonsSuccess({ persons: persons as any[] })),
          catchError((error) => of(PersonsActions.loadPersonsFailure({ error })))
        )
      )
    )
  );

  loadPersonById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PersonsActions.loadPersonById),
      switchMap(({ id }) =>
        this.personsService.getPersonById(id).pipe(
          map((person) => PersonsActions.loadPersonByIdSuccess({ person: person as any })),
          catchError((error) => of(PersonsActions.loadPersonByIdFailure({ error })))
        )
      )
    )
  );

  createPerson$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PersonsActions.createPerson),
      switchMap(({ person }) =>
        this.personsService.createPerson(person as any).pipe(
          map((newPerson) => PersonsActions.createPersonSuccess({ person: newPerson as any })),
          catchError((error) => of(PersonsActions.createPersonFailure({ error })))
        )
      )
    )
  );

  updatePerson$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PersonsActions.updatePerson),
      switchMap(({ id, person }) =>
        this.personsService.updatePerson(id, person as any).pipe(
          map((updatedPerson) => PersonsActions.updatePersonSuccess({ person: updatedPerson as any })),
          catchError((error) => of(PersonsActions.updatePersonFailure({ error })))
        )
      )
    )
  );

  deletePerson$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PersonsActions.deletePerson),
      switchMap(({ id }) =>
        this.personsService.deletePerson(id).pipe(
          map(() => PersonsActions.deletePersonSuccess({ id })),
          catchError((error) => of(PersonsActions.deletePersonFailure({ error })))
        )
      )
    )
  );

  searchPersons$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PersonsActions.searchPersons),
      switchMap(({ query }) =>
        this.personsService.searchPersons(query).pipe(
          map((persons) => PersonsActions.searchPersonsSuccess({ persons: persons as any[] })),
          catchError((error) => of(PersonsActions.searchPersonsFailure({ error })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private personsService: PersonsService
  ) {}
}

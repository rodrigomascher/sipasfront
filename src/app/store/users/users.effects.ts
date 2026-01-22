import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { UsersService } from '../../core/services/users.service';
import * as UsersActions from './users.actions';

@Injectable()
export class UsersEffects {
  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.loadUsers),
      mergeMap(({ params }) =>
        this.usersService.getUsers(params).pipe(
          map(response => UsersActions.loadUsersSuccess({ response })),
          catchError(error => of(UsersActions.loadUsersFailure({ error: error.message })))
        )
      )
    )
  );

  loadUserById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.loadUserById),
      mergeMap(({ id }) =>
        this.usersService.getUserById(id).pipe(
          map(user => UsersActions.loadUserByIdSuccess({ user })),
          catchError(error => of(UsersActions.loadUserByIdFailure({ error: error.message })))
        )
      )
    )
  );

  createUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.createUser),
      mergeMap(({ user }) =>
        this.usersService.createUser(user).pipe(
          map(newUser => UsersActions.createUserSuccess({ user: newUser })),
          catchError(error => of(UsersActions.createUserFailure({ error: error.message })))
        )
      )
    )
  );

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.updateUser),
      mergeMap(({ id, user }) =>
        this.usersService.updateUser(id, user).pipe(
          map(updatedUser => UsersActions.updateUserSuccess({ user: updatedUser })),
          catchError(error => of(UsersActions.updateUserFailure({ error: error.message })))
        )
      )
    )
  );

  deleteUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.deleteUser),
      mergeMap(({ id }) =>
        this.usersService.deleteUser(id).pipe(
          map(() => UsersActions.deleteUserSuccess({ id })),
          catchError(error => of(UsersActions.deleteUserFailure({ error: error.message })))
        )
      )
    )
  );

  activateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.activateUser),
      mergeMap(({ id }) =>
        this.usersService.activateUser(id).pipe(
          map(user => UsersActions.activateUserSuccess({ user })),
          catchError(error => of(UsersActions.activateUserFailure({ error: error.message })))
        )
      )
    )
  );

  deactivateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.deactivateUser),
      mergeMap(({ id }) =>
        this.usersService.deactivateUser(id).pipe(
          map(user => UsersActions.deactivateUserSuccess({ user })),
          catchError(error => of(UsersActions.deactivateUserFailure({ error: error.message })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private usersService: UsersService
  ) {}
}

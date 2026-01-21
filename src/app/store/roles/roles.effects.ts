import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { RolesService, Role } from '../../core/services/roles.service';
import * as RolesActions from './roles.actions';

@Injectable()
export class RolesEffects {
  loadRoles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RolesActions.loadRoles),
      switchMap(() =>
        this.rolesService.getRoles().pipe(
          map((roles: Role[]) => RolesActions.loadRolesSuccess({ roles })),
          catchError(error => of(RolesActions.loadRolesFailure({ error: error.message })))
        )
      )
    )
  );

  loadRoleById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RolesActions.loadRoleById),
      switchMap(({ id }) =>
        this.rolesService.getRoleById(id).pipe(
          map(role => RolesActions.loadRoleByIdSuccess({ role })),
          catchError(error => of(RolesActions.loadRoleByIdFailure({ error: error.message })))
        )
      )
    )
  );

  createRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RolesActions.createRole),
      switchMap(({ role }) =>
        this.rolesService.createRole(role).pipe(
          map(newRole => RolesActions.createRoleSuccess({ role: newRole })),
          catchError(error => of(RolesActions.createRoleFailure({ error: error.message })))
        )
      )
    )
  );

  updateRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RolesActions.updateRole),
      switchMap(({ id, role }) =>
        this.rolesService.updateRole(id, role).pipe(
          map(updatedRole => RolesActions.updateRoleSuccess({ role: updatedRole })),
          catchError(error => of(RolesActions.updateRoleFailure({ error: error.message })))
        )
      )
    )
  );

  deleteRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RolesActions.deleteRole),
      switchMap(({ id }) =>
        this.rolesService.deleteRole(id).pipe(
          map(() => RolesActions.deleteRoleSuccess({ id })),
          catchError(error => of(RolesActions.deleteRoleFailure({ error: error.message })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private rolesService: RolesService
  ) {}
}

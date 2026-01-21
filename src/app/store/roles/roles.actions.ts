import { createAction, props } from '@ngrx/store';
import { Role, CreateRoleDto, UpdateRoleDto } from '../../core/services/roles.service';

export const loadRoles = createAction('[Roles] Load Roles');

export const loadRolesSuccess = createAction(
  '[Roles] Load Roles Success',
  props<{ roles: Role[] }>()
);

export const loadRolesFailure = createAction(
  '[Roles] Load Roles Failure',
  props<{ error: string }>()
);

export const loadRoleById = createAction(
  '[Roles] Load Role by ID',
  props<{ id: number }>()
);

export const loadRoleByIdSuccess = createAction(
  '[Roles] Load Role by ID Success',
  props<{ role: Role }>()
);

export const loadRoleByIdFailure = createAction(
  '[Roles] Load Role by ID Failure',
  props<{ error: string }>()
);

export const createRole = createAction(
  '[Roles] Create Role',
  props<{ role: CreateRoleDto }>()
);

export const createRoleSuccess = createAction(
  '[Roles] Create Role Success',
  props<{ role: Role }>()
);

export const createRoleFailure = createAction(
  '[Roles] Create Role Failure',
  props<{ error: string }>()
);

export const updateRole = createAction(
  '[Roles] Update Role',
  props<{ id: number; role: UpdateRoleDto }>()
);

export const updateRoleSuccess = createAction(
  '[Roles] Update Role Success',
  props<{ role: Role }>()
);

export const updateRoleFailure = createAction(
  '[Roles] Update Role Failure',
  props<{ error: string }>()
);

export const deleteRole = createAction(
  '[Roles] Delete Role',
  props<{ id: number }>()
);

export const deleteRoleSuccess = createAction(
  '[Roles] Delete Role Success',
  props<{ id: number }>()
);

export const deleteRoleFailure = createAction(
  '[Roles] Delete Role Failure',
  props<{ error: string }>()
);

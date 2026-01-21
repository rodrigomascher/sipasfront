import { createAction, props } from '@ngrx/store';
import { User, CreateUserDto, UpdateUserDto } from '../../core/services/users.service';

// Load Users
export const loadUsers = createAction('[Users] Load Users');
export const loadUsersSuccess = createAction(
  '[Users] Load Users Success',
  props<{ users: User[] }>()
);
export const loadUsersFailure = createAction(
  '[Users] Load Users Failure',
  props<{ error: string }>()
);

// Load User by ID
export const loadUserById = createAction(
  '[Users] Load User By ID',
  props<{ id: number }>()
);
export const loadUserByIdSuccess = createAction(
  '[Users] Load User By ID Success',
  props<{ user: User }>()
);
export const loadUserByIdFailure = createAction(
  '[Users] Load User By ID Failure',
  props<{ error: string }>()
);

// Create User
export const createUser = createAction(
  '[Users] Create User',
  props<{ user: CreateUserDto }>()
);
export const createUserSuccess = createAction(
  '[Users] Create User Success',
  props<{ user: User }>()
);
export const createUserFailure = createAction(
  '[Users] Create User Failure',
  props<{ error: string }>()
);

// Update User
export const updateUser = createAction(
  '[Users] Update User',
  props<{ id: number; user: UpdateUserDto }>()
);
export const updateUserSuccess = createAction(
  '[Users] Update User Success',
  props<{ user: User }>()
);
export const updateUserFailure = createAction(
  '[Users] Update User Failure',
  props<{ error: string }>()
);

// Delete User
export const deleteUser = createAction(
  '[Users] Delete User',
  props<{ id: number }>()
);
export const deleteUserSuccess = createAction(
  '[Users] Delete User Success',
  props<{ id: number }>()
);
export const deleteUserFailure = createAction(
  '[Users] Delete User Failure',
  props<{ error: string }>()
);

// Activate User
export const activateUser = createAction(
  '[Users] Activate User',
  props<{ id: number }>()
);
export const activateUserSuccess = createAction(
  '[Users] Activate User Success',
  props<{ user: User }>()
);
export const activateUserFailure = createAction(
  '[Users] Activate User Failure',
  props<{ error: string }>()
);

// Deactivate User
export const deactivateUser = createAction(
  '[Users] Deactivate User',
  props<{ id: number }>()
);
export const deactivateUserSuccess = createAction(
  '[Users] Deactivate User Success',
  props<{ user: User }>()
);
export const deactivateUserFailure = createAction(
  '[Users] Deactivate User Failure',
  props<{ error: string }>()
);

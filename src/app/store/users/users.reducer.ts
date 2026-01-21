import { createReducer, on } from '@ngrx/store';
import { User } from '../../core/services/users.service';
import * as UsersActions from './users.actions';

export interface UsersState {
  users: User[];
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
}

export const initialState: UsersState = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null,
};

export const usersReducer = createReducer(
  initialState,
  
  // Load Users
  on(UsersActions.loadUsers, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(UsersActions.loadUsersSuccess, (state, { users }) => ({
    ...state,
    users,
    loading: false,
  })),
  on(UsersActions.loadUsersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Load User by ID
  on(UsersActions.loadUserById, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(UsersActions.loadUserByIdSuccess, (state, { user }) => ({
    ...state,
    selectedUser: user,
    loading: false,
  })),
  on(UsersActions.loadUserByIdFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Create User
  on(UsersActions.createUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(UsersActions.createUserSuccess, (state, { user }) => ({
    ...state,
    users: [...state.users, user],
    loading: false,
  })),
  on(UsersActions.createUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Update User
  on(UsersActions.updateUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(UsersActions.updateUserSuccess, (state, { user }) => ({
    ...state,
    users: state.users.map(u => u.id === user.id ? user : u),
    selectedUser: state.selectedUser?.id === user.id ? user : state.selectedUser,
    loading: false,
  })),
  on(UsersActions.updateUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Delete User
  on(UsersActions.deleteUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(UsersActions.deleteUserSuccess, (state, { id }) => ({
    ...state,
    users: state.users.filter(u => u.id !== id),
    loading: false,
  })),
  on(UsersActions.deleteUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Activate User
  on(UsersActions.activateUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(UsersActions.activateUserSuccess, (state, { user }) => ({
    ...state,
    users: state.users.map(u => u.id === user.id ? user : u),
    loading: false,
  })),
  on(UsersActions.activateUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Deactivate User
  on(UsersActions.deactivateUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(UsersActions.deactivateUserSuccess, (state, { user }) => ({
    ...state,
    users: state.users.map(u => u.id === user.id ? user : u),
    loading: false,
  })),
  on(UsersActions.deactivateUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
);

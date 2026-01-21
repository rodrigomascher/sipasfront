import { createReducer, on } from '@ngrx/store';
import { Role } from '../../core/services/roles.service';
import * as RolesActions from './roles.actions';

export interface RolesState {
  roles: Role[];
  selectedRole: Role | null;
  loading: boolean;
  error: string | null;
}

export const initialState: RolesState = {
  roles: [],
  selectedRole: null,
  loading: false,
  error: null
};

export const rolesReducer = createReducer(
  initialState,

  on(RolesActions.loadRoles, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(RolesActions.loadRolesSuccess, (state, { roles }) => ({
    ...state,
    roles,
    loading: false
  })),
  on(RolesActions.loadRolesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(RolesActions.loadRoleById, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(RolesActions.loadRoleByIdSuccess, (state, { role }) => ({
    ...state,
    selectedRole: role,
    loading: false
  })),
  on(RolesActions.loadRoleByIdFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(RolesActions.createRole, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(RolesActions.createRoleSuccess, (state, { role }) => ({
    ...state,
    roles: [...state.roles, role],
    loading: false
  })),
  on(RolesActions.createRoleFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(RolesActions.updateRole, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(RolesActions.updateRoleSuccess, (state, { role }) => ({
    ...state,
    roles: state.roles.map(r => r.id === role.id ? role : r),
    selectedRole: role,
    loading: false
  })),
  on(RolesActions.updateRoleFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(RolesActions.deleteRole, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(RolesActions.deleteRoleSuccess, (state, { id }) => ({
    ...state,
    roles: state.roles.filter(r => r.id !== id),
    selectedRole: null,
    loading: false
  })),
  on(RolesActions.deleteRoleFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);

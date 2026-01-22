import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RolesState } from './roles.reducer';

const selectRolesState = createFeatureSelector<RolesState>('roles');

export const selectAllRoles = createSelector(
  selectRolesState,
  (state: RolesState) => state.roles
);

export const selectSelectedRole = createSelector(
  selectRolesState,
  (state: RolesState) => state.selectedRole
);

export const selectRolesLoading = createSelector(
  selectRolesState,
  (state: RolesState) => state.loading
);

export const selectRolesError = createSelector(
  selectRolesState,
  (state: RolesState) => state.error
);

export const selectRoleById = (id: number) => createSelector(
  selectAllRoles,
  (roles) => roles.find(r => r.id === id) || null
);

export const selectRoleCount = createSelector(
  selectAllRoles,
  (roles) => roles.length
);

export const selectTotalItems = createSelector(
  selectRolesState,
  (state: RolesState) => state.total,
);

export const selectCurrentPage = createSelector(
  selectRolesState,
  (state: RolesState) => state.page,
);

export const selectTotalPages = createSelector(
  selectRolesState,
  (state: RolesState) => state.totalPages,
);

export const selectCurrentPageStart = createSelector(
  selectRolesState,
  (state: RolesState) => (state.page - 1) * state.pageSize + 1,
);

export const selectCurrentPageEnd = createSelector(
  selectRolesState,
  (state: RolesState) => Math.min(state.page * state.pageSize, state.total),
);

import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UsersState } from './users.reducer';

export const selectUsersState = createFeatureSelector<UsersState>('users');

export const selectAllUsers = createSelector(
  selectUsersState,
  (state) => state.users
);

export const selectSelectedUser = createSelector(
  selectUsersState,
  (state) => state.selectedUser
);

export const selectUsersLoading = createSelector(
  selectUsersState,
  (state) => state.loading
);

export const selectUsersError = createSelector(
  selectUsersState,
  (state) => state.error
);

export const selectUserById = (id: number) =>
  createSelector(
    selectAllUsers,
    (users) => users.find(u => u.id === id)
  );

export const selectUserCount = createSelector(
  selectAllUsers,
  (users) => users.length
);

export const selectTotalItems = createSelector(
  selectUsersState,
  (state) => state.total,
);

export const selectCurrentPage = createSelector(
  selectUsersState,
  (state) => state.page,
);

export const selectTotalPages = createSelector(
  selectUsersState,
  (state) => state.totalPages,
);

export const selectCurrentPageStart = createSelector(
  selectUsersState,
  (state) => (state.page - 1) * state.pageSize + 1,
);

export const selectCurrentPageEnd = createSelector(
  selectUsersState,
  (state) => Math.min(state.page * state.pageSize, state.total),
);

export const selectActiveUsers = createSelector(
  selectAllUsers,
  (users) => users.filter(u => u.isActive)
);

export const selectInactiveUsers = createSelector(
  selectAllUsers,
  (users) => users.filter(u => !u.isActive)
);

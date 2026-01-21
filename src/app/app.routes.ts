import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES)
  },
  {
    path: 'users',
    canActivate: [authGuard],
    loadChildren: () => import('./features/users/users.routes').then(m => m.USERS_ROUTES)
  },
  {
    path: 'units',
    canActivate: [authGuard],
    loadChildren: () => import('./features/units/units.routes').then(m => m.UNITS_ROUTES)
  },
  {
    path: 'departments',
    canActivate: [authGuard],
    loadChildren: () => import('./features/departments/departments.routes').then(m => m.DEPARTMENTS_ROUTES)
  },
  {
    path: 'roles',
    canActivate: [authGuard],
    loadChildren: () => import('./features/roles/roles.routes').then(m => m.ROLES_ROUTES)
  },
  {
    path: 'employees',
    canActivate: [authGuard],
    loadChildren: () => import('./features/employees/employees.routes').then(m => m.EMPLOYEES_ROUTES)
  },
  {
    path: 'persons',
    canActivate: [authGuard],
    loadChildren: () => import('./features/persons/persons.routes').then(m => m.personsRoutes)
  },
  {
    path: '**',
    redirectTo: '/auth/login'
  }
];

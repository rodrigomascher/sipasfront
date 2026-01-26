import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { UnitSelectionGuard } from './core/guards/unit-selection.guard';

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
    canActivate: [authGuard, UnitSelectionGuard],
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
    path: 'genders',
    canActivate: [authGuard],
    loadChildren: () => import('./features/genders/genders.routes').then(m => m.gendersRoutes)
  },
  {
    path: 'gender-identities',
    canActivate: [authGuard],
    loadChildren: () => import('./features/gender-identities/gender-identities.routes').then(m => m.genderIdentitiesRoutes)
  },
  {
    path: 'sexual-orientations',
    canActivate: [authGuard],
    loadChildren: () => import('./features/sexual-orientations/sexual-orientations.routes').then(m => m.sexualOrientationsRoutes)
  },
  {
    path: 'relationship-degrees',
    canActivate: [authGuard],
    loadChildren: () => import('./features/relationship-degrees/relationship-degrees.routes').then(m => m.relationshipDegreeRoutes)
  },
  {
    path: 'family-composition',
    canActivate: [authGuard],
    loadChildren: () => import('./features/family-composition/family-composition.routes').then(m => m.familyCompositionRoutes)
  },
  {
    path: 'races',
    canActivate: [authGuard],
    loadChildren: () => import('./features/races/races.routes').then(m => m.racesRoutes)
  },
  {
    path: 'ethnicities',
    canActivate: [authGuard],
    loadChildren: () => import('./features/ethnicities/ethnicities.routes').then(m => m.ethnicitiesRoutes)
  },
  {
    path: '**',
    redirectTo: '/auth/login'
  }
];

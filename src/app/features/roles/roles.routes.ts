import { Routes } from '@angular/router';
import { RolesListComponent } from './roles-list/roles-list.component';
import { RolesFormComponent } from './roles-form/roles-form.component';

export const ROLES_ROUTES: Routes = [
  {
    path: '',
    component: RolesListComponent
  },
  {
    path: 'create',
    component: RolesFormComponent
  },
  {
    path: ':id/edit',
    component: RolesFormComponent
  }
];

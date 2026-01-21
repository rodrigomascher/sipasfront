import { Routes } from '@angular/router';
import { GendersListComponent } from './components/genders-list/genders-list.component';
import { GendersFormComponent } from './components/genders-form/genders-form.component';

export const gendersRoutes: Routes = [
  {
    path: '',
    component: GendersListComponent,
  },
  {
    path: 'create',
    component: GendersFormComponent,
  },
  {
    path: ':id/edit',
    component: GendersFormComponent,
  },
];

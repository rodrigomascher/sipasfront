import { Routes } from '@angular/router';
import { DepartmentsListComponent } from './departments-list/departments-list.component';
import { DepartmentsFormComponent } from './departments-form/departments-form.component';

export const DEPARTMENTS_ROUTES: Routes = [
  {
    path: '',
    component: DepartmentsListComponent
  },
  {
    path: 'create',
    component: DepartmentsFormComponent
  },
  {
    path: ':id/edit',
    component: DepartmentsFormComponent
  }
];

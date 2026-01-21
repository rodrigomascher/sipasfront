import { Routes } from '@angular/router';
import { EmployeesListComponent } from './employees-list/employees-list.component';
import { EmployeesFormComponent } from './employees-form/employees-form.component';

export const EMPLOYEES_ROUTES: Routes = [
  {
    path: '',
    component: EmployeesListComponent
  },
  {
    path: 'create',
    component: EmployeesFormComponent
  },
  {
    path: ':id/edit',
    component: EmployeesFormComponent
  }
];

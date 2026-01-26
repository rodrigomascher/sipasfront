import { Routes } from '@angular/router';
import { IncomeTypesListComponent } from './components/income-types-list/income-types-list.component';
import { IncomeTypesFormComponent } from './components/income-types-form/income-types-form.component';

export const incomeTypesRoutes: Routes = [
  {
    path: '',
    component: IncomeTypesListComponent,
  },
  {
    path: 'create',
    component: IncomeTypesFormComponent,
  },
  {
    path: ':id/edit',
    component: IncomeTypesFormComponent,
  },
];

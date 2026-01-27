import { Routes } from '@angular/router';
import { MaritalStatusesListComponent } from './components/marital-statuses-list/marital-statuses-list.component';
import { MaritalStatusesFormComponent } from './components/marital-statuses-form/marital-statuses-form.component';

export const maritalStatusesRoutes: Routes = [
  {
    path: '',
    component: MaritalStatusesListComponent,
  },
  {
    path: 'create',
    component: MaritalStatusesFormComponent,
  },
  {
    path: ':id/edit',
    component: MaritalStatusesFormComponent,
  },
];

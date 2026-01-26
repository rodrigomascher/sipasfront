import { Routes } from '@angular/router';
import { EthnicitiesListComponent } from './components/ethnicities-list/ethnicities-list.component';
import { EthnicitiesFormComponent } from './components/ethnicities-form/ethnicities-form.component';

export const ethnicitiesRoutes: Routes = [
  {
    path: '',
    component: EthnicitiesListComponent,
  },
  {
    path: 'create',
    component: EthnicitiesFormComponent,
  },
  {
    path: ':id/edit',
    component: EthnicitiesFormComponent,
  },
];

// Alias for consistency with other modules
export { ethnicitiesRoutes as routes };

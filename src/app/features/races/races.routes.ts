import { Routes } from '@angular/router';
import { RacesListComponent } from './components/races-list/races-list.component';
import { RacesFormComponent } from './components/races-form/races-form.component';

export const racesRoutes: Routes = [
  {
    path: '',
    component: RacesListComponent,
  },
  {
    path: 'create',
    component: RacesFormComponent,
  },
  {
    path: ':id/edit',
    component: RacesFormComponent,
  },
];

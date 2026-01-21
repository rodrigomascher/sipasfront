import { Routes } from '@angular/router';
import { UnitsListComponent } from './units-list/units-list.component';
import { UnitsDetailComponent } from './units-detail/units-detail.component';
import { UnitsFormComponent } from './units-form/units-form.component';

export const UNITS_ROUTES: Routes = [
  {
    path: '',
    component: UnitsListComponent
  },
  {
    path: 'create',
    component: UnitsFormComponent
  },
  {
    path: ':id/edit',
    component: UnitsFormComponent
  },
  {
    path: ':id',
    component: UnitsDetailComponent
  }
];

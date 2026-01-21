import { Routes } from '@angular/router';
import { SexualOrientationsListComponent } from './components/sexual-orientations-list/sexual-orientations-list.component';
import { SexualOrientationsFormComponent } from './components/sexual-orientations-form/sexual-orientations-form.component';

export const sexualOrientationsRoutes: Routes = [
  { path: '', component: SexualOrientationsListComponent },
  { path: 'create', component: SexualOrientationsFormComponent },
  { path: ':id/edit', component: SexualOrientationsFormComponent },
];

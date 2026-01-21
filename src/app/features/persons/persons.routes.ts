import { Routes } from '@angular/router';
import { PersonsListComponent } from './components/persons-list/persons-list.component';
import { PersonsFormComponent } from './components/persons-form/persons-form.component';

export const personsRoutes: Routes = [
  { path: '', component: PersonsListComponent },
  { path: 'create', component: PersonsFormComponent },
  { path: ':id/edit', component: PersonsFormComponent },
];

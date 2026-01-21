import { Routes } from '@angular/router';
import { GenderIdentitiesListComponent } from './components/gender-identities-list/gender-identities-list.component';
import { GenderIdentitiesFormComponent } from './components/gender-identities-form/gender-identities-form.component';

export const genderIdentitiesRoutes: Routes = [
  { path: '', component: GenderIdentitiesListComponent },
  { path: 'create', component: GenderIdentitiesFormComponent },
  { path: ':id/edit', component: GenderIdentitiesFormComponent },
];

import { Routes } from '@angular/router';
import { FamilyCompositionListComponent } from './components/family-composition-list/family-composition-list.component';
import { FamilyCompositionFormComponent } from './components/family-composition-form/family-composition-form.component';

export const familyCompositionRoutes: Routes = [
  { path: '', component: FamilyCompositionListComponent },
  { path: 'create', component: FamilyCompositionFormComponent },
  { path: ':id/:pessoaId/edit', component: FamilyCompositionFormComponent },
];

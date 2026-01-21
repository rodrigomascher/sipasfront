import { Routes } from '@angular/router';
import { RelationshipDegreeListComponent } from './components/relationship-degree-list/relationship-degree-list.component';
import { RelationshipDegreeFormComponent } from './components/relationship-degree-form/relationship-degree-form.component';

export const relationshipDegreeRoutes: Routes = [
  {
    path: '',
    component: RelationshipDegreeListComponent,
  },
  {
    path: 'create',
    component: RelationshipDegreeFormComponent,
  },
  {
    path: ':id/edit',
    component: RelationshipDegreeFormComponent,
  },
];

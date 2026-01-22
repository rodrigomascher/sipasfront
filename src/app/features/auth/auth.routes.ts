import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UnitSelectorComponent } from './unit-selector/unit-selector.component';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'unit-selector',
    component: UnitSelectorComponent
  }
];

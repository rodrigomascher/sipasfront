import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { authInterceptor } from './app/core/interceptors/auth.interceptor';
import { environment } from './environments/environment';
import { unitsReducer } from './app/store/units/units.reducer';
import { usersReducer } from './app/store/users/users.reducer';
import { departmentsReducer } from './app/store/departments/departments.reducer';
import { rolesReducer } from './app/store/roles/roles.reducer';
import { employeesReducer } from './app/store/employees/employees.reducer';
import { personsReducer } from './app/features/persons/store/persons.reducer';
import { UnitsEffects } from './app/store/units/units.effects';
import { UsersEffects } from './app/store/users/users.effects';
import { DepartmentsEffects } from './app/store/departments/departments.effects';
import { RolesEffects } from './app/store/roles/roles.effects';
import { EmployeesEffects } from './app/store/employees/employees.effects';
import { PersonsEffects } from './app/features/persons/store/persons.effects';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    provideStore({
      units: unitsReducer,
      users: usersReducer,
      departments: departmentsReducer,
      roles: rolesReducer,
      employees: employeesReducer,
      persons: personsReducer
    }),
    provideEffects([UnitsEffects, UsersEffects, DepartmentsEffects, RolesEffects, EmployeesEffects, PersonsEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: environment.production }),
  ],
}).catch(err => console.error(err));


import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withPreloading } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { authInterceptor } from './app/core/interceptors/auth.interceptor';
import { errorInterceptor } from './app/core/interceptors/error.interceptor';
import { loadingInterceptor } from './app/core/interceptors/loading.interceptor';
import { QuicklinkStrategy } from './app/core/strategies/preloading.strategy';
import { environment } from './environments/environment';
import { unitsReducer } from './app/store/units/units.reducer';
import { usersReducer } from './app/store/users/users.reducer';
import { departmentsReducer } from './app/store/departments/departments.reducer';
import { rolesReducer } from './app/store/roles/roles.reducer';
import { employeesReducer } from './app/store/employees/employees.reducer';
import { personsReducer } from './app/features/persons/store/persons.reducer';
import { gendersReducer } from './app/features/genders/store/genders.reducer';
import { genderIdentitiesReducer } from './app/features/gender-identities/store/gender-identities.reducer';
import { sexualOrientationsReducer } from './app/features/sexual-orientations/store/sexual-orientations.reducer';
import { relationshipDegreeReducer } from './app/store/relationship-degree/relationship-degree.reducer';
import { familyCompositionReducer } from './app/store/family-composition/family-composition.reducer';
import { UnitsEffects } from './app/store/units/units.effects';
import { UsersEffects } from './app/store/users/users.effects';
import { DepartmentsEffects } from './app/store/departments/departments.effects';
import { RolesEffects } from './app/store/roles/roles.effects';
import { EmployeesEffects } from './app/store/employees/employees.effects';
import { PersonsEffects } from './app/features/persons/store/persons.effects';
import { GendersEffects } from './app/features/genders/store/genders.effects';
import { GenderIdentitiesEffects } from './app/features/gender-identities/store/gender-identities.effects';
import { SexualOrientationsEffects } from './app/features/sexual-orientations/store/sexual-orientations.effects';
import { RelationshipDegreeEffects } from './app/store/relationship-degree/relationship-degree.effects';
import { FamilyCompositionEffects } from './app/store/family-composition/family-composition.effects';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes, withPreloading(QuicklinkStrategy)),
    provideHttpClient(
      withInterceptors([authInterceptor, loadingInterceptor, errorInterceptor])
    ),
    provideStore({
      units: unitsReducer,
      users: usersReducer,
      departments: departmentsReducer,
      roles: rolesReducer,
      employees: employeesReducer,
      persons: personsReducer,
      genders: gendersReducer,
      genderIdentities: genderIdentitiesReducer,
      sexualOrientations: sexualOrientationsReducer,
      relationshipDegree: relationshipDegreeReducer,
      familyComposition: familyCompositionReducer
    }),
    provideEffects([UnitsEffects, UsersEffects, DepartmentsEffects, RolesEffects, EmployeesEffects, PersonsEffects, GendersEffects, GenderIdentitiesEffects, SexualOrientationsEffects, RelationshipDegreeEffects, FamilyCompositionEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: environment.production }),
  ],
}).catch(err => console.error(err));


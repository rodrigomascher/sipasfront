# SIPAS Frontend - Architecture & Services

## 📋 Overview

Angular 17 standalone frontend for SIPAS (Sistema Integrado de Proteção e Acompanhamento Social) with:
- NgRx state management (11 feature stores)
- Lazy-loaded routes (22 chunks)
- Standalone components
- Comprehensive SCSS styling
- Error interceptors and loading indicators
- Smart preloading strategy

**Build Size:** 425.97 kB total | 110.85 kB gzipped

## 🏗️ Architecture

### Service Layer

#### GenericHttpService
**Location:** `src/app/core/services/generic-http.service.ts`

Base class for all CRUD services providing:
- `getAll(params?)` - List with pagination
- `getById(id)` - Get single item
- `create(data)` - Create new item
- `update(id, data)` - Update item
- `patch(id, data)` - Partial update
- `delete(id)` - Delete item

**Features:**
- Automatic HttpParams building
- Pagination support (page, pageSize, sortBy, sortDirection)
- Custom filter parameters
- Type-safe with generics

**Usage:**
```typescript
@Injectable({ providedIn: 'root' })
export class UsersService extends GenericHttpService<User> {
  constructor(http: HttpClient) {
    super(http, `${environment.apiUrl}/users`);
  }
}
```

#### PersonsService
**Location:** `src/app/core/services/persons.service.ts`

Enhanced service for person records extending GenericHttpService:

**Methods:**
- `getPersons(params?)` - Get paginated list of persons
- `getPersonById(id)` - Get specific person
- `createPerson(data)` - Create new person
- `updatePerson(id, data)` - Update person
- `deletePerson(id)` - Delete person
- `searchPersons(query)` - Full-text search by name, CPF, or NIS
- `getPersonFamilyMembers(personId, params?)` - Paginated family members
- `getPersonWithFamily(personId, params?)` - Person with paginated family data

**Example Usage:**
```typescript
// Get persons with pagination
this.personsService.getPersons({
  page: 1,
  pageSize: 20,
  sortBy: 'lastName',
  sortDirection: 'asc'
}).subscribe(response => {
  console.log(response.data);    // Array of persons
  console.log(response.total);   // Total count
  console.log(response.totalPages);
});

// Get person with family members
this.personsService.getPersonWithFamily(1, {
  page: 1,
  pageSize: 5
}).subscribe(person => {
  console.log(person.familyComposition.data);  // Family members page 1
});

// Search persons
this.personsService.searchPersons('João').subscribe(results => {
  console.log(results); // [{ id: 1, firstName: 'João', ... }]
});
```

### State Management (NgRx)

11 complete feature stores covering:

1. **units** - Organizational units/departments
2. **users** - User accounts
3. **departments** - Department hierarchy
4. **roles** - User roles
5. **employees** - Employee records
6. **persons** - Person demographics
7. **genders** - Gender types
8. **gender-identities** - Gender identity classifications
9. **sexual-orientations** - Sexual orientation categories
10. **relationship-degrees** - Family relationship types
11. **family-composition** - Family structures

**Store Structure (per feature):**
- `actions.ts` - 21 action creators per store
- `reducer.ts` - State mutations
- `selectors.ts` - 8 selectors for data access
- `effects.ts` - Side effects (API calls)
- `state.ts` - TypeScript interfaces

**Usage Example:**
```typescript
constructor(private store: Store) {}

// Dispatch action
this.store.dispatch(PersonsActions.loadPersons({ 
  page: 1, 
  pageSize: 20 
}));

// Subscribe to selector
this.store.select(PersonsSelectors.selectPersons$).subscribe(persons => {
  console.log(persons);
});

// Select single person by ID
this.store.select(PersonsSelectors.selectPersonById$({ id: 1 })).subscribe(person => {
  console.log(person);
});
```

### Components

#### GenericFormComponent
**Location:** `src/app/shared/components/generic-form/`

Reusable form component for CRUD operations:
- Form grid layout (responsive columns)
- Field configuration-driven
- Built-in validation display
- Error handling
- Loading state
- Submit/Cancel actions
- Back navigation

**Usage:**
```html
<app-generic-form
  [title]="'Edit Person'"
  [form]="form"
  [fields]="formFields"
  [loading$]="loading$"
  [error$]="error$"
  [submitLabel]="'Save Person'"
  [backRoute]="'/persons'"
  (submit)="onSubmit($event)"
>
</app-generic-form>
```

#### GenericListComponent
**Location:** `src/app/shared/components/generic-list/`

Reusable list/table component with:
- Column configuration
- Pagination controls
- Sorting
- Search
- Row actions (Edit, Delete)
- Lazy loading indicators
- Empty state handling

#### LoadingIndicatorComponent
**Location:** `src/app/shared/components/loading-indicator/`

Full-screen loading overlay:
- Global loading state counter
- Smooth animations
- Prevents user interaction during loading
- Auto shows/hides

#### NotificationContainerComponent
**Location:** `src/app/shared/components/notification-container/`

Toast notification system:
- Auto-dismiss (configurable)
- Color-coded (success, error, warning, info)
- Fixed top-right positioning
- Slide animations

### Error Handling

#### ErrorInterceptor
**Location:** `src/app/core/interceptors/error.interceptor.ts`

Centralized HTTP error handling:
- 400: Bad Request validation errors
- 401: Unauthorized (redirect to login)
- 403: Forbidden
- 404: Not Found
- 409: Conflict (duplicate CPF, etc.)
- 422: Unprocessable Entity
- 429: Too Many Requests
- 500+: Server errors

**Behavior:**
- Extracts error message from response
- Displays in NotificationService
- Logs to console in dev
- Prevents error propagation

#### LoadingInterceptor
**Location:** `src/app/core/interceptors/loading.interceptor.ts`

Automatic loading indicator:
- Counter pattern for concurrent requests
- Shows overlay on first request
- Hides overlay on last request completion
- Prevents race conditions

### Routing

#### QuicklinkStrategy
**Location:** `src/app/core/services/quicklink.strategy.ts`

Smart preloading strategy:
- Preloads 10 most accessed modules
- Excludes authentication routes
- 100ms delay before preloading
- Reduces navigation latency
- Improves perceived performance

**Configuration:**
```typescript
preloadingStrategy: QuicklinkStrategy
```

## 📦 Build & Deployment

### Development
```bash
npm install
npm start  # Runs ng serve with automatic reload
```

### Production Build
```bash
npm run build  # Output to dist/

# Build Output
Initial chunks:     425.97 kB total (110.85 kB gzipped)
Lazy chunks:        22 feature routes
Build time:         ~37 seconds
```

### Environment Configuration
**Files:**
- `environment.ts` - Development
- `environment.prod.ts` - Production

**Key Variables:**
```typescript
apiUrl: 'http://localhost:3000/api'  // Backend API endpoint
environment: 'production'             // Environment name
```

## 🎨 Styling

### SCSS Architecture
**Location:** `src/styles/`

Organized by scope:
- `variables.scss` - Colors, spacing, fonts
- `mixins.scss` - Reusable style functions
- `globals.scss` - Reset, typography, common classes
- `layout.scss` - Grid, flexbox, containers
- `theme.scss` - Color schemes

**Variables:**
- **Colors:** Primary (#2563eb), Secondary (#64748b), Success (#10b981), etc.
- **Spacing:** 0.25rem to 4rem scale
- **Breakpoints:** sm (640px), md (768px), lg (1024px), xl (1280px)

## 🔄 Data Flow Example

### Persons Module Flow

```
[PersonsListComponent]
    ↓
[Store dispatch] PersonsActions.loadPersons()
    ↓
[PersonsEffects] Calls PersonsService.getPersons()
    ↓
[PersonsService] Extends GenericHttpService
    ↓
[HTTP GET] /api/persons?page=1&pageSize=20
    ↓
[ErrorInterceptor] Handles errors, shows notifications
    ↓
[LoadingInterceptor] Shows/hides loading indicator
    ↓
[PersonsEffects] Dispatches success/error action
    ↓
[PersonsReducer] Updates state
    ↓
[PersonsSelectors] Components subscribe to updated data
    ↓
[PersonsListComponent] Re-renders with new data
```

## 🚀 Performance Optimizations

1. **Lazy Loading** - 22 feature chunks loaded on demand
2. **Preloading** - QuicklinkStrategy for better navigation
3. **Change Detection** - OnPush strategy in components
4. **Virtual Scrolling** - For large lists (when needed)
5. **HTTP Caching** - Service-level caching via NgRx
6. **Bundle Size** - 110.85 kB gzipped (baseline)

## 📝 Coding Standards

### Component Naming
- Standalone components with `standalone: true`
- kebab-case file names: `persons-list.component.ts`
- PascalCase class names: `PersonsListComponent`

### Service Naming
- Extend GenericHttpService for CRUD
- Singular entity names: `PersonService` not `PersonsService`
- Provide in 'root' for singleton

### Store Naming
- Feature name + Entity: `PersonsFeature`
- Actions: `PersonsActions.loadPersons()`
- Selectors: `selectPersons$`, `selectPersonById$`

### Styling
- Use SCSS variables for colors and spacing
- BEM methodology for class naming
- Mobile-first responsive design

## 🧪 Testing

```bash
# Unit tests
ng test

# E2E tests
ng e2e

# Build
ng build
```

## 📚 Resources

- [Angular Documentation](https://angular.io/docs)
- [NgRx Documentation](https://ngrx.io/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [SCSS Documentation](https://sass-lang.com/documentation)

## 🔐 Security

1. **XSS Protection** - Angular sanitization by default
2. **CSRF Tokens** - Via HttpClientModule
3. **Input Validation** - Reactive Forms validators
4. **Error Handling** - No sensitive data in errors
5. **Authentication** - JWT tokens via interceptors

## 📋 Checklist for New Features

- [ ] Create service extending GenericHttpService
- [ ] Create NgRx store (actions, reducer, selectors, effects)
- [ ] Create list component using GenericListComponent
- [ ] Create form component using GenericFormComponent
- [ ] Add routing with lazy loading
- [ ] Add unit tests
- [ ] Update this documentation

---

**Last Updated:** January 2024
**Angular Version:** 17.x
**Build Size:** 425.97 kB (110.85 kB gzipped)

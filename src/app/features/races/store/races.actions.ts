import { createAction, props } from '@ngrx/store';
import { Race } from '../../../core/services/races.service';
import { PaginationParams } from '../../../core/services/races.service';

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const loadRaces = createAction('[Races] Load Races', props<{ params?: PaginationParams }>());
export const loadRacesSuccess = createAction('[Races] Load Races Success', props<{ response: PaginatedResponse<Race> }>());
export const loadRacesFailure = createAction('[Races] Load Races Failure', props<{ error: any }>());

export const loadRaceById = createAction('[Races] Load Race By Id', props<{ id: number }>());
export const loadRaceByIdSuccess = createAction('[Races] Load Race By Id Success', props<{ race: Race }>());
export const loadRaceByIdFailure = createAction('[Races] Load Race By Id Failure', props<{ error: any }>());

export const createRace = createAction('[Races] Create Race', props<{ race: Omit<Race, 'id'> }>());
export const createRaceSuccess = createAction('[Races] Create Race Success', props<{ race: Race }>());
export const createRaceFailure = createAction('[Races] Create Race Failure', props<{ error: any }>());

export const updateRace = createAction('[Races] Update Race', props<{ id: number; race: Partial<Race> }>());
export const updateRaceSuccess = createAction('[Races] Update Race Success', props<{ race: Race }>());
export const updateRaceFailure = createAction('[Races] Update Race Failure', props<{ error: any }>());

export const deleteRace = createAction('[Races] Delete Race', props<{ id: number }>());
export const deleteRaceSuccess = createAction('[Races] Delete Race Success', props<{ id: number }>());
export const deleteRaceFailure = createAction('[Races] Delete Race Failure', props<{ error: any }>());

export const selectRace = createAction('[Races] Select Race', props<{ id: number }>());
export const clearRaceSelection = createAction('[Races] Clear Race Selection');

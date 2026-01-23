import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environment/environment';
import { GenericHttpService, PaginationParams, PaginatedResponse } from './generic-http.service';

// Re-export for backward compatibility
export { PaginationParams, PaginatedResponse };

export interface Unit {
  id: number;
  name: string;
  type: string;
  isArmored: boolean;
  city: string;
  state: string;
  createdBy?: number;
  updatedBy?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUnitDto {
  name: string;
  type: string;
  isArmored: boolean;
  city: string;
  state: string;
}

export interface UpdateUnitDto extends Partial<CreateUnitDto> {}

@Injectable({
  providedIn: 'root'
})
export class UnitsService extends GenericHttpService<Unit> {
  constructor(http: HttpClient) {
    super(http, `${environment.apiUrl}/units`);
  }

  // Backward compatibility methods
  getUnits(params?: PaginationParams): Observable<PaginatedResponse<Unit>> {
    return this.getAll(params);
  }

  getUnitById(id: number): Observable<Unit> {
    return this.getById(id);
  }

  getUnitsByCity(city: string): Observable<Unit[]> {
    return this.http.get<Unit[]>(`${this.apiUrl}/search/city/${city}`);
  }

  getUnitsByState(state: string): Observable<Unit[]> {
    return this.http.get<Unit[]>(`${this.apiUrl}/search/state/${state}`);
  }

  createUnit(unit: CreateUnitDto): Observable<Unit> {
    return this.create(unit);
  }

  updateUnit(id: number, unit: Partial<CreateUnitDto>): Observable<Unit> {
    return this.patch(id, unit);
  }

  deleteUnit(id: number): Observable<void> {
    return this.delete(id);
  }
}

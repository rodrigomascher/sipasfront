import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environment/environment';

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
export class UnitsService {
  private apiUrl = `${environment.apiUrl}/units`;

  constructor(private http: HttpClient) {}

  getUnits(): Observable<Unit[]> {
    return this.http.get<Unit[]>(this.apiUrl);
  }

  getUnitById(id: number): Observable<Unit> {
    return this.http.get<Unit>(`${this.apiUrl}/${id}`);
  }

  getUnitsByCity(city: string): Observable<Unit[]> {
    return this.http.get<Unit[]>(`${this.apiUrl}/search/city/${city}`);
  }

  getUnitsByState(state: string): Observable<Unit[]> {
    return this.http.get<Unit[]>(`${this.apiUrl}/search/state/${state}`);
  }

  createUnit(unit: CreateUnitDto): Observable<Unit> {
    return this.http.post<Unit>(this.apiUrl, unit);
  }

  updateUnit(id: number, unit: Partial<CreateUnitDto>): Observable<Unit> {
    return this.http.patch<Unit>(`${this.apiUrl}/${id}`, unit);
  }

  deleteUnit(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

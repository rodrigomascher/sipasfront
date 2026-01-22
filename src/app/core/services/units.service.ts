import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class UnitsService {
  private apiUrl = `${environment.apiUrl}/units`;

  constructor(private http: HttpClient) {}

  getUnits(params?: PaginationParams): Observable<PaginatedResponse<Unit>> {
    let httpParams = new HttpParams();
    if (params) {
      if (params.page) httpParams = httpParams.set('page', params.page.toString());
      if (params.pageSize) httpParams = httpParams.set('pageSize', params.pageSize.toString());
      if (params.sortBy) httpParams = httpParams.set('sortBy', params.sortBy);
      if (params.sortDirection) httpParams = httpParams.set('sortDirection', params.sortDirection);
      if (params.search) httpParams = httpParams.set('search', params.search);
    }
    return this.http.get<PaginatedResponse<Unit>>(this.apiUrl, { params: httpParams });
  }

  getAll(params?: PaginationParams): Observable<PaginatedResponse<Unit>> {
    return this.getUnits(params);
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

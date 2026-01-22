import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface GenderIdentity {
  id: number;
  description: string;
  active?: boolean;
  createdBy: number;
  updatedBy?: number;
  createdAt: Date;
  updatedAt?: Date;
}

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
export class GenderIdentitiesService {
  private apiUrl = `${environment.apiUrl}/api/gender-identities`;

  constructor(private http: HttpClient) {}

  getAll(params?: PaginationParams): Observable<PaginatedResponse<GenderIdentity>> {
    let httpParams = new HttpParams();
    if (params) {
      if (params.page) httpParams = httpParams.set('page', params.page.toString());
      if (params.pageSize) httpParams = httpParams.set('pageSize', params.pageSize.toString());
      if (params.sortBy) httpParams = httpParams.set('sortBy', params.sortBy);
      if (params.sortDirection) httpParams = httpParams.set('sortDirection', params.sortDirection);
      if (params.search) httpParams = httpParams.set('search', params.search);
    }
    return this.http.get<PaginatedResponse<GenderIdentity>>(this.apiUrl, { params: httpParams });
  }

  getById(id: number): Observable<GenderIdentity> {
    return this.http.get<GenderIdentity>(`${this.apiUrl}/${id}`);
  }

  create(genderIdentity: Omit<GenderIdentity, 'id'>): Observable<GenderIdentity> {
    return this.http.post<GenderIdentity>(this.apiUrl, genderIdentity);
  }

  update(id: number, genderIdentity: Partial<GenderIdentity>): Observable<GenderIdentity> {
    return this.http.put<GenderIdentity>(`${this.apiUrl}/${id}`, genderIdentity);
  }

  delete(id: number): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.apiUrl}/${id}`);
  }
}

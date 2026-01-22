import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Gender {
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
export class GendersService {
  private apiUrl = `${environment.apiUrl}/api/genders`;

  constructor(private http: HttpClient) {}

  getAll(params?: PaginationParams): Observable<PaginatedResponse<Gender>> {
    let httpParams = new HttpParams();
    if (params) {
      if (params.page) httpParams = httpParams.set('page', params.page.toString());
      if (params.pageSize) httpParams = httpParams.set('pageSize', params.pageSize.toString());
      if (params.sortBy) httpParams = httpParams.set('sortBy', params.sortBy);
      if (params.sortDirection) httpParams = httpParams.set('sortDirection', params.sortDirection);
      if (params.search) httpParams = httpParams.set('search', params.search);
    }
    return this.http.get<PaginatedResponse<Gender>>(this.apiUrl, { params: httpParams });
  }

  getById(id: number): Observable<Gender> {
    return this.http.get<Gender>(`${this.apiUrl}/${id}`);
  }

  create(gender: Omit<Gender, 'id'>): Observable<Gender> {
    return this.http.post<Gender>(this.apiUrl, gender);
  }

  update(id: number, gender: Partial<Gender>): Observable<Gender> {
    return this.http.put<Gender>(`${this.apiUrl}/${id}`, gender);
  }

  delete(id: number): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.apiUrl}/${id}`);
  }
}

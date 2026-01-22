import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface SexualOrientation {
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
export class SexualOrientationsService {
  private apiUrl = `${environment.apiUrl}/api/sexual-orientations`;

  constructor(private http: HttpClient) {}

  getAll(params?: PaginationParams): Observable<PaginatedResponse<SexualOrientation>> {
    let httpParams = new HttpParams();
    if (params) {
      if (params.page) httpParams = httpParams.set('page', params.page.toString());
      if (params.pageSize) httpParams = httpParams.set('pageSize', params.pageSize.toString());
      if (params.sortBy) httpParams = httpParams.set('sortBy', params.sortBy);
      if (params.sortDirection) httpParams = httpParams.set('sortDirection', params.sortDirection);
      if (params.search) httpParams = httpParams.set('search', params.search);
    }
    return this.http.get<PaginatedResponse<SexualOrientation>>(this.apiUrl, { params: httpParams });
  }

  getById(id: number): Observable<SexualOrientation> {
    return this.http.get<SexualOrientation>(`${this.apiUrl}/${id}`);
  }

  create(sexualOrientation: Omit<SexualOrientation, 'id'>): Observable<SexualOrientation> {
    return this.http.post<SexualOrientation>(this.apiUrl, sexualOrientation);
  }

  update(id: number, sexualOrientation: Partial<SexualOrientation>): Observable<SexualOrientation> {
    return this.http.put<SexualOrientation>(`${this.apiUrl}/${id}`, sexualOrientation);
  }

  delete(id: number): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.apiUrl}/${id}`);
  }
}

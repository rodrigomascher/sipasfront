import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environment/environment';

export interface RelationshipDegree {
  id: number;
  description: string;
  active: boolean;
  createdBy: string;
  createdAt: Date;
  updatedBy: string;
  updatedAt: Date;
}

export interface CreateRelationshipDegreeDto {
  description: string;
  active?: boolean;
  createdBy?: string;
}

export interface UpdateRelationshipDegreeDto {
  description?: string;
  active?: boolean;
  updatedBy?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  search?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RelationshipDegreeService {
  private apiUrl = `${environment.apiUrl}/relationship-degrees`;

  constructor(private http: HttpClient) {}

  getAll(params?: PaginationParams): Observable<PaginatedResponse<RelationshipDegree>> {
    let httpParams = new HttpParams();
    if (params) {
      if (params.page) httpParams = httpParams.set('page', params.page.toString());
      if (params.pageSize) httpParams = httpParams.set('pageSize', params.pageSize.toString());
      if (params.sortBy) httpParams = httpParams.set('sortBy', params.sortBy);
      if (params.sortDirection) httpParams = httpParams.set('sortDirection', params.sortDirection);
      if (params.search) httpParams = httpParams.set('search', params.search);
    }
    return this.http.get<PaginatedResponse<RelationshipDegree>>(this.apiUrl, { params: httpParams });
  }

  getOne(id: number): Observable<RelationshipDegree> {
    return this.http.get<RelationshipDegree>(`${this.apiUrl}/${id}`);
  }

  create(dto: CreateRelationshipDegreeDto): Observable<RelationshipDegree> {
    return this.http.post<RelationshipDegree>(this.apiUrl, dto);
  }

  update(id: number, dto: UpdateRelationshipDegreeDto): Observable<RelationshipDegree> {
    return this.http.patch<RelationshipDegree>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

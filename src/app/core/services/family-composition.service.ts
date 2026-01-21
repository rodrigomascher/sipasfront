import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environment/environment';

export interface FamilyComposition {
  idFamilyComposition: number;
  idPerson: number;
  person?: any;
  idRelationshipDegree: number;
  responsible: number;
  registrationDate: Date;
  createdBy: string;
  createdAt: Date;
  updatedBy: string;
  updatedAt: Date;
}

export interface CreateFamilyCompositionDto {
  idFamilyComposition: number;
  idPerson: number;
  idRelationshipDegree?: number;
  responsible?: number;
  createdBy?: string;
}

export interface UpdateFamilyCompositionDto {
  idRelationshipDegree?: number;
  responsible?: number;
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
export class FamilyCompositionService {
  private apiUrl = `${environment.apiUrl}/family-composition`;

  constructor(private http: HttpClient) {}

  getAll(params?: PaginationParams): Observable<PaginatedResponse<FamilyComposition>> {
    let httpParams = new HttpParams();
    if (params) {
      if (params.page) httpParams = httpParams.set('page', params.page.toString());
      if (params.pageSize) httpParams = httpParams.set('pageSize', params.pageSize.toString());
      if (params.sortBy) httpParams = httpParams.set('sortBy', params.sortBy);
      if (params.sortDirection) httpParams = httpParams.set('sortDirection', params.sortDirection);
      if (params.search) httpParams = httpParams.set('search', params.search);
    }
    return this.http.get<PaginatedResponse<FamilyComposition>>(this.apiUrl, { params: httpParams });
  }

  getByFamily(idFamilyComposition: number): Observable<FamilyComposition[]> {
    return this.http.get<FamilyComposition[]>(`${this.apiUrl}/family/${idFamilyComposition}`);
  }

  getOne(idFamilyComposition: number, idPerson: number): Observable<FamilyComposition> {
    return this.http.get<FamilyComposition>(`${this.apiUrl}/${idFamilyComposition}/${idPerson}`);
  }

  create(dto: CreateFamilyCompositionDto): Observable<FamilyComposition> {
    return this.http.post<FamilyComposition>(this.apiUrl, dto);
  }

  update(
    idFamilyComposition: number,
    idPerson: number,
    dto: UpdateFamilyCompositionDto,
  ): Observable<FamilyComposition> {
    return this.http.patch<FamilyComposition>(
      `${this.apiUrl}/${idFamilyComposition}/${idPerson}`,
      dto,
    );
  }

  delete(idFamilyComposition: number, idPerson: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${idFamilyComposition}/${idPerson}`);
  }
}

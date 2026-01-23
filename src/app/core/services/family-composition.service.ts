import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environment/environment';
import { GenericHttpService, PaginationParams, PaginatedResponse } from './generic-http.service';

// Re-export for backward compatibility
export { PaginationParams, PaginatedResponse };

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

@Injectable({
  providedIn: 'root'
})
export class FamilyCompositionService extends GenericHttpService<FamilyComposition> {
  constructor(http: HttpClient) {
    super(http, `${environment.apiUrl}/family-composition`);
  }

  getByFamily(idFamilyComposition: number): Observable<FamilyComposition[]> {
    return this.http.get<FamilyComposition[]>(`${this.apiUrl}/family/${idFamilyComposition}`);
  }

  getOne(idFamilyComposition: number, idPerson: number): Observable<FamilyComposition> {
    return this.http.get<FamilyComposition>(`${this.apiUrl}/${idFamilyComposition}/${idPerson}`);
  }

  createFamilyComposition(dto: CreateFamilyCompositionDto): Observable<FamilyComposition> {
    return this.http.post<FamilyComposition>(this.apiUrl, dto);
  }

  updateFamilyComposition(
    idFamilyComposition: number,
    idPerson: number,
    dto: UpdateFamilyCompositionDto,
  ): Observable<FamilyComposition> {
    return this.http.patch<FamilyComposition>(
      `${this.apiUrl}/${idFamilyComposition}/${idPerson}`,
      dto,
    );
  }

  deleteFamilyComposition(idFamilyComposition: number, idPerson: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${idFamilyComposition}/${idPerson}`);
  }
}

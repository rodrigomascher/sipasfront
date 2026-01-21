import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

@Injectable({
  providedIn: 'root'
})
export class FamilyCompositionService {
  private apiUrl = `${environment.apiUrl}/family-composition`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<FamilyComposition[]> {
    return this.http.get<FamilyComposition[]>(this.apiUrl);
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

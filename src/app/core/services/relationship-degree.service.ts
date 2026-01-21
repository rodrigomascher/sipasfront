import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

@Injectable({
  providedIn: 'root'
})
export class RelationshipDegreeService {
  private apiUrl = `${environment.apiUrl}/relationship-degrees`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<RelationshipDegree[]> {
    return this.http.get<RelationshipDegree[]>(this.apiUrl);
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

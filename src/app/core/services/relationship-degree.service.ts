import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environment/environment';
import { GenericHttpService, PaginationParams, PaginatedResponse } from './generic-http.service';

// Re-export for backward compatibility
export { PaginationParams, PaginatedResponse };

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
export class RelationshipDegreeService extends GenericHttpService<RelationshipDegree> {
  constructor(http: HttpClient) {
    super(http, `${environment.apiUrl}/relationship-degrees`);
  }

  // Backward compatibility methods
  getOne(id: number): Observable<RelationshipDegree> {
    return this.getById(id);
  }
}

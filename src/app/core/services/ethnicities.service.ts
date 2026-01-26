import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { GenericHttpService } from './generic-http.service';

// Re-export for backward compatibility
export { PaginationParams, PaginatedResponse } from './generic-http.service';

export interface Ethnicity {
  id: number;
  description: string;
  active?: boolean;
  createdBy: number;
  updatedBy?: number;
  createdAt: Date;
  updatedAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class EthnicitiesService extends GenericHttpService<Ethnicity> {
  constructor(http: HttpClient) {
    super(http, `${environment.apiUrl}/api/ethnicities`);
  }
}

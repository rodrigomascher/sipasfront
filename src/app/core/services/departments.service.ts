import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environment/environment';
import { GenericHttpService, PaginationParams, PaginatedResponse } from './generic-http.service';
import { Observable } from 'rxjs';

// Re-export for backward compatibility
export { PaginationParams, PaginatedResponse };

export interface Department {
  id: number;
  description: string;
  createdBy?: number;
  updatedBy?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateDepartmentDto {
  description: string;
}

export interface UpdateDepartmentDto extends Partial<CreateDepartmentDto> {}

@Injectable({
  providedIn: 'root'
})
export class DepartmentsService extends GenericHttpService<Department> {
  constructor(http: HttpClient) {
    super(http, `${environment.apiUrl}/departments`);
  }

  // Backward compatibility methods
  getDepartments(params?: PaginationParams): Observable<PaginatedResponse<Department>> {
    return this.getAll(params);
  }

  getDepartmentById(id: number): Observable<Department> {
    return this.getById(id);
  }

  createDepartment(department: CreateDepartmentDto): Observable<Department> {
    return this.create(department);
  }

  updateDepartment(id: number, department: UpdateDepartmentDto): Observable<Department> {
    return this.patch(id, department);
  }

  deleteDepartment(id: number): Observable<void> {
    return this.delete(id);
  }
}

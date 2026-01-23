import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environment/environment';
import { GenericHttpService, PaginationParams, PaginatedResponse } from './generic-http.service';

// Re-export for backward compatibility
export { PaginationParams, PaginatedResponse };

export interface Employee {
  id: number;
  employeeId: string;
  fullName: string;
  unitId?: number;
  departmentId?: number;
  roleId?: number;
  isTechnician?: boolean;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateEmployeeDto {
  employeeId?: string;
  fullName: string;
  unitId?: number;
  departmentId?: number;
  roleId?: number;
  isTechnician?: boolean;
  createdBy?: string;
}

export interface UpdateEmployeeDto extends Partial<CreateEmployeeDto> {}

@Injectable({
  providedIn: 'root'
})
export class EmployeesService extends GenericHttpService<Employee> {
  constructor(http: HttpClient) {
    super(http, `${environment.apiUrl}/employees`);
  }

  // Backward compatibility methods
  getEmployees(params?: PaginationParams): Observable<PaginatedResponse<Employee>> {
    return this.getAll(params);
  }

  getEmployeeById(id: number): Observable<Employee> {
    return this.getById(id);
  }

  createEmployee(employee: CreateEmployeeDto): Observable<Employee> {
    return this.create(employee);
  }

  updateEmployee(id: number, employee: UpdateEmployeeDto): Observable<Employee> {
    return this.patch(id, employee);
  }

  deleteEmployee(id: number): Observable<void> {
    return this.delete(id);
  }
}

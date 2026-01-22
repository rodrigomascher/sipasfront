import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environment/environment';

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
export class EmployeesService {
  private apiUrl = `${environment.apiUrl}/employees`;

  constructor(private http: HttpClient) {}

  getEmployees(params?: PaginationParams): Observable<PaginatedResponse<Employee>> {
    let httpParams = new HttpParams();
    if (params) {
      if (params.page) httpParams = httpParams.set('page', params.page.toString());
      if (params.pageSize) httpParams = httpParams.set('pageSize', params.pageSize.toString());
      if (params.sortBy) httpParams = httpParams.set('sortBy', params.sortBy);
      if (params.sortDirection) httpParams = httpParams.set('sortDirection', params.sortDirection);
      if (params.search) httpParams = httpParams.set('search', params.search);
    }
    return this.http.get<PaginatedResponse<Employee>>(this.apiUrl, { params: httpParams });
  }

  getAll(params?: PaginationParams): Observable<PaginatedResponse<Employee>> {
    return this.getEmployees(params);
  }

  getEmployeeById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`);
  }

  createEmployee(employee: CreateEmployeeDto): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl, employee);
  }

  updateEmployee(id: number, employee: UpdateEmployeeDto): Observable<Employee> {
    return this.http.patch<Employee>(`${this.apiUrl}/${id}`, employee);
  }

  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

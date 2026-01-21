import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environment/environment';

export interface Employee {
  id: number;
  name: string;
  email: string;
  phone?: string;
  position?: string;
  departmentId?: number;
  createdBy?: number;
  updatedBy?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateEmployeeDto {
  name: string;
  email: string;
  phone?: string;
  position?: string;
  departmentId?: number;
}

export interface UpdateEmployeeDto extends Partial<CreateEmployeeDto> {}

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {
  private apiUrl = `${environment.apiUrl}/employees`;

  constructor(private http: HttpClient) {}

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl);
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

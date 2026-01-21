import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environment/environment';

export interface Department {
  id: number;
  name: string;
  description?: string;
  createdBy?: number;
  updatedBy?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateDepartmentDto {
  name: string;
  description?: string;
}

export interface UpdateDepartmentDto extends Partial<CreateDepartmentDto> {}

@Injectable({
  providedIn: 'root'
})
export class DepartmentsService {
  private apiUrl = `${environment.apiUrl}/departments`;

  constructor(private http: HttpClient) {}

  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(this.apiUrl);
  }

  getDepartmentById(id: number): Observable<Department> {
    return this.http.get<Department>(`${this.apiUrl}/${id}`);
  }

  createDepartment(department: CreateDepartmentDto): Observable<Department> {
    return this.http.post<Department>(this.apiUrl, department);
  }

  updateDepartment(id: number, department: UpdateDepartmentDto): Observable<Department> {
    return this.http.patch<Department>(`${this.apiUrl}/${id}`, department);
  }

  deleteDepartment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environment/environment';

export interface Role {
  id: number;
  name: string;
  description?: string;
  createdBy?: number;
  updatedBy?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateRoleDto {
  name: string;
  description?: string;
}

export interface UpdateRoleDto extends Partial<CreateRoleDto> {}

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private apiUrl = `${environment.apiUrl}/roles`;

  constructor(private http: HttpClient) {}

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(this.apiUrl);
  }

  getRoleById(id: number): Observable<Role> {
    return this.http.get<Role>(`${this.apiUrl}/${id}`);
  }

  createRole(role: CreateRoleDto): Observable<Role> {
    return this.http.post<Role>(this.apiUrl, role);
  }

  updateRole(id: number, role: UpdateRoleDto): Observable<Role> {
    return this.http.patch<Role>(`${this.apiUrl}/${id}`, role);
  }

  deleteRole(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

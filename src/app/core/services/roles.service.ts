import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environment/environment';
import { GenericHttpService, PaginationParams, PaginatedResponse } from './generic-http.service';
import { Observable } from 'rxjs';

// Re-export for backward compatibility
export { PaginationParams, PaginatedResponse };

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
export class RolesService extends GenericHttpService<Role> {
  constructor(http: HttpClient) {
    super(http, `${environment.apiUrl}/roles`);
  }

  // Backward compatibility methods
  getRoles(params?: PaginationParams): Observable<PaginatedResponse<Role>> {
    return this.getAll(params);
  }

  getRoleById(id: number): Observable<Role> {
    return this.getById(id);
  }

  createRole(role: CreateRoleDto): Observable<Role> {
    return this.create(role);
  }

  updateRole(id: number, role: UpdateRoleDto): Observable<Role> {
    return this.patch(id, role);
  }

  deleteRole(id: number): Observable<void> {
    return this.delete(id);
  }
}

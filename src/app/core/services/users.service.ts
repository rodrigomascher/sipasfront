import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environment/environment';
import { GenericHttpService, PaginationParams, PaginatedResponse } from './generic-http.service';

// Re-export for backward compatibility
export { PaginationParams, PaginatedResponse };

export interface User {
  id: number;
  email: string;
  name: string;
  employeeId?: number;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt?: string;
  units?: any[];
}

export interface CreateUserDto {
  email: string;
  name: string;
  password: string;
  unitIds?: number[];
}

export interface UpdateUserDto {
  email?: string;
  name?: string;
  password?: string;
  isActive?: boolean;
  unitIds?: number[];
}

export interface ChangePasswordDto {
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService extends GenericHttpService<User> {
  constructor(http: HttpClient) {
    super(http, `${environment.apiUrl}/users`);
  }

  // Backward compatibility methods
  getUsers(params?: PaginationParams): Observable<PaginatedResponse<User>> {
    return this.getAll(params);
  }

  getUserById(id: number): Observable<User> {
    return this.getById(id);
  }

  getUsersByActive(isActive: boolean): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/filter/active/${isActive}`);
  }

  createUser(user: CreateUserDto): Observable<User> {
    return this.create(user);
  }

  updateUser(id: number, user: UpdateUserDto): Observable<User> {
    return this.update(id, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.delete(id);
  }

  activateUser(id: number): Observable<User> {
    return this.patch(id, { isActive: true });
  }

  deactivateUser(id: number): Observable<User> {
    return this.patch(id, { isActive: false });
  }

  changePassword(id: number, newPassword: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/${id}/change-password`, {
      password: newPassword
    });
  }
}

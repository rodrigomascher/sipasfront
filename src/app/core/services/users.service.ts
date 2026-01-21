import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environment/environment';

export interface User {
  id: number;
  email: string;
  name: string;
  employeeId?: number;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateUserDto {
  email: string;
  name: string;
  password: string;
}

export interface UpdateUserDto {
  email?: string;
  name?: string;
  isActive?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  getUsersByActive(isActive: boolean): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/filter/active/${isActive}`);
  }

  createUser(user: CreateUserDto): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  updateUser(id: number, user: UpdateUserDto): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  activateUser(id: number): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}`, { isActive: true });
  }

  deactivateUser(id: number): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}`, { isActive: false });
  }
}

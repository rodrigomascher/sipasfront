import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Gender {
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
export class GendersService {
  private apiUrl = `${environment.apiUrl}/api/genders`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Gender[]> {
    return this.http.get<Gender[]>(this.apiUrl);
  }

  getById(id: number): Observable<Gender> {
    return this.http.get<Gender>(`${this.apiUrl}/${id}`);
  }

  create(gender: Omit<Gender, 'id'>): Observable<Gender> {
    return this.http.post<Gender>(this.apiUrl, gender);
  }

  update(id: number, gender: Partial<Gender>): Observable<Gender> {
    return this.http.put<Gender>(`${this.apiUrl}/${id}`, gender);
  }

  delete(id: number): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.apiUrl}/${id}`);
  }
}

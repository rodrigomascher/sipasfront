import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface SexualOrientation {
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
export class SexualOrientationsService {
  private apiUrl = `${environment.apiUrl}/api/sexual-orientations`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<SexualOrientation[]> {
    return this.http.get<SexualOrientation[]>(this.apiUrl);
  }

  getById(id: number): Observable<SexualOrientation> {
    return this.http.get<SexualOrientation>(`${this.apiUrl}/${id}`);
  }

  create(sexualOrientation: Omit<SexualOrientation, 'id'>): Observable<SexualOrientation> {
    return this.http.post<SexualOrientation>(this.apiUrl, sexualOrientation);
  }

  update(id: number, sexualOrientation: Partial<SexualOrientation>): Observable<SexualOrientation> {
    return this.http.put<SexualOrientation>(`${this.apiUrl}/${id}`, sexualOrientation);
  }

  delete(id: number): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.apiUrl}/${id}`);
  }
}

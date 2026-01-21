import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface GenderIdentity {
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
export class GenderIdentitiesService {
  private apiUrl = '/api/gender-identities';

  constructor(private http: HttpClient) {}

  getAll(): Observable<GenderIdentity[]> {
    return this.http.get<GenderIdentity[]>(this.apiUrl);
  }

  getById(id: number): Observable<GenderIdentity> {
    return this.http.get<GenderIdentity>(`${this.apiUrl}/${id}`);
  }

  create(genderIdentity: Omit<GenderIdentity, 'id'>): Observable<GenderIdentity> {
    return this.http.post<GenderIdentity>(this.apiUrl, genderIdentity);
  }

  update(id: number, genderIdentity: Partial<GenderIdentity>): Observable<GenderIdentity> {
    return this.http.put<GenderIdentity>(`${this.apiUrl}/${id}`, genderIdentity);
  }

  delete(id: number): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.apiUrl}/${id}`);
  }
}

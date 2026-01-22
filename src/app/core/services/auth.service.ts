import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, interval, map, startWith } from 'rxjs';
import { environment } from '@environment/environment';

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
    name: string;
    employeeId: number;
    isActive: boolean;
    [key: string]: any;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  login(credentials: AuthCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials);
  }

  selectUnit(unitId: number): Observable<AuthResponse> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this.http.post<AuthResponse>(`${this.apiUrl}/select-unit`, { unitId }, { headers });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  setUser(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Gerenciar unidade selecionada (ler do JWT)
  getSelectedUnitFromToken(): any {
    const token = this.getToken();
    if (!token) return null;

    const decoded = this.decodeToken(token);
    if (!decoded) return null;

    return {
      id: decoded.unitId,
      name: decoded.unitName,
      type: decoded.unitType,
      city: decoded.city,
      state: decoded.state,
    };
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Decodificar JWT e pegar tempo de expiração
  private decodeToken(token: string): any {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      
      const decoded = JSON.parse(atob(parts[1]));
      return decoded;
    } catch (error) {
      return null;
    }
  }

  // Obter tempo restante em segundos
  getTimeRemaining(): number {
    const token = this.getToken();
    if (!token) return 0;

    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) return 0;

    const expirationTime = decoded.exp * 1000; // Converter para ms
    const currentTime = Date.now();
    const remaining = Math.max(0, Math.floor((expirationTime - currentTime) / 1000));

    return remaining;
  }

  // Observable que atualiza a cada segundo
  getTimeRemaining$(): Observable<number> {
    return interval(1000).pipe(
      startWith(0),
      map(() => this.getTimeRemaining())
    );
  }

  // Formatar segundos para HH:MM:SS
  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return [hours, minutes, secs]
      .map(v => String(v).padStart(2, '0'))
      .join(':');
  }
}

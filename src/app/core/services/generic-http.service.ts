import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Pagination parameters interface for list requests
 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  search?: string;
  [key: string]: any; // Allow additional filter parameters
}

/**
 * Generic paginated response structure
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Generic HTTP service base class for CRUD operations
 * 
 * Provides common methods for:
 * - getAll() - list with pagination
 * - getById() - get single item
 * - create() - create new item
 * - update() - update existing item
 * - delete() - delete item
 * 
 * Usage:
 * @Injectable({ providedIn: 'root' })
 * export class UsersService extends GenericHttpService<User> {
 *   constructor(http: HttpClient) {
 *     super(http, `${environment.apiUrl}/users`);
 *   }
 * }
 */
@Injectable()
export abstract class GenericHttpService<T> {
  protected apiUrl: string;

  constructor(protected http: HttpClient, apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  /**
   * Get all items with pagination support
   * @param params - Pagination and filter parameters
   * @returns Observable of paginated response
   */
  getAll(params?: PaginationParams): Observable<PaginatedResponse<T>> {
    const httpParams = this.buildHttpParams(params);
    return this.http.get<PaginatedResponse<T>>(this.apiUrl, { params: httpParams });
  }

  /**
   * Get single item by ID
   * @param id - Item ID
   * @returns Observable of item
   */
  getById(id: number): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create new item
   * @param data - Item data to create
   * @returns Observable of created item
   */
  create(data: any): Observable<T> {
    return this.http.post<T>(this.apiUrl, data);
  }

  /**
   * Update existing item
   * @param id - Item ID
   * @param data - Item data to update
   * @returns Observable of updated item
   */
  update(id: number, data: any): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}/${id}`, data);
  }

  /**
   * Partially update item
   * @param id - Item ID
   * @param data - Partial item data
   * @returns Observable of updated item
   */
  patch(id: number, data: any): Observable<T> {
    return this.http.patch<T>(`${this.apiUrl}/${id}`, data);
  }

  /**
   * Delete item by ID
   * @param id - Item ID
   * @returns Observable of void
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Build HttpParams from pagination parameters
   * @param params - Pagination and filter parameters
   * @returns HttpParams instance
   */
  protected buildHttpParams(params?: PaginationParams): HttpParams {
    let httpParams = new HttpParams();

    if (!params) {
      return httpParams;
    }

    // Standard pagination parameters
    if (params.page) {
      httpParams = httpParams.set('page', params.page.toString());
    }
    if (params.pageSize) {
      httpParams = httpParams.set('pageSize', params.pageSize.toString());
    }
    if (params.sortBy) {
      httpParams = httpParams.set('sortBy', params.sortBy);
    }
    if (params.sortDirection) {
      httpParams = httpParams.set('sortDirection', params.sortDirection);
    }
    if (params.search) {
      httpParams = httpParams.set('search', params.search);
    }

    // Additional custom parameters
    for (const key of Object.keys(params)) {
      if (!['page', 'pageSize', 'sortBy', 'sortDirection', 'search'].includes(key)) {
        const value = (params as any)[key];
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, value.toString());
        }
      }
    }

    return httpParams;
  }
}

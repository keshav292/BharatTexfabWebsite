import {
  HttpClient,
  HttpErrorResponse,
  HttpStatusCode,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Category } from '../../models/Category';
import { API_BASE_URL } from '../../api.config';
import { CategoryDto } from '../../dto/CategoryDto';
import { HttpHeadersService } from '../HttpHeadersService/http-headers.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = `${inject(API_BASE_URL)}/categories`;

  constructor(
    private http: HttpClient,
    private headerService: HttpHeadersService
  ) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }

  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`);
  }

  deleteCategory(id: number): Observable<string> {
    const headers = this.headerService.getAuthHeaders();
    return this.http
      .delete<{ message: string }>(`${this.apiUrl}/${id}`, { headers })
      .pipe(
        map((response) => response.message), // Extract message from response
        catchError((error: HttpErrorResponse) => {
          if (error.status === 404) {
            return throwError(() => new Error('Category not found!'));
          }
          if (error.status === 409) {
            return throwError(
              () =>
                new Error('Category contains products and cannot be deleted!')
            );
          }
          return throwError(
            () => new Error('An error occurred while deleting the category.')
          );
        })
      );
  }

  addCategory(category: CategoryDto): Observable<Category> {
    const headers = this.headerService.getAuthHeaders();
    return this.http.post<Category>(this.apiUrl, category, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 409) {
          return throwError(() => new Error('Category already exists!'));
        }
        return throwError(
          () => new Error('An error occurred while adding the category.')
        );
      })
    );
  }

  updateCategory(id: number, category: CategoryDto): Observable<Category> {
    const headers = this.headerService.getAuthHeaders();
    return this.http
      .put<Category>(`${this.apiUrl}/${id}`, category, { headers })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(
            () => new Error('An error occurred while updating the category.')
          );
        })
      );
  }
}

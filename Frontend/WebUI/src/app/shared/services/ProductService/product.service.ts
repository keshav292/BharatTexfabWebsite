import {
  HttpClient,
  HttpErrorResponse,
  HttpStatusCode,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Product } from '../../models/Product';
import { API_BASE_URL } from '../../api.config';
import { ProductDto } from '../../dto/ProductDto';
import { HttpHeadersService } from '../HttpHeadersService/http-headers.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = `${inject(API_BASE_URL)}/products`;
  private headerService = inject(HttpHeadersService);

  constructor(private http: HttpClient) {}

  getProductsByCategoryId(categoryId: Number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/category/${categoryId}`);
  }

  getProductById(productId: Number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${productId}`);
  }

  addProduct(product: ProductDto): Observable<Product> {
    const headers = this.headerService.getAuthHeaders();
    return this.http.post<Product>(this.apiUrl, product, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 409) {
          return throwError(() => new Error('Product already exists!'));
        }
        return throwError(
          () => new Error('An error occurred while adding the product.')
        );
      })
    );
  }

  updateProduct(id: number, product: ProductDto): Observable<Product> {
    const headers = this.headerService.getAuthHeaders();
    return this.http
      .put<Product>(`${this.apiUrl}/${id}`, product, { headers })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(
            () => new Error('An error occurred while updating the product.')
          );
        })
      );
  }

  deleteProduct(id: number): Observable<HttpStatusCode> {
    const headers = this.headerService.getAuthHeaders();
    return this.http
      .delete<HttpStatusCode>(`${this.apiUrl}/${id}`, { headers })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(
            () => new Error('An error occurred while updating the product.')
          );
        })
      );
  }
}

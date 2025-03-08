import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL, IMAGE_BASE_URL } from '../../api.config';
import { AuthService } from '../AuthenticationService/auth.service';
import { HttpHeadersService } from '../HttpHeadersService/http-headers.service';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private apiUrl = `${inject(API_BASE_URL)}/productImage`;
  private imageBaseUrl = `${inject(IMAGE_BASE_URL)}`;
  private authService = inject(AuthService);
  private headerService = inject(HttpHeadersService);

  constructor(private http: HttpClient) {}

  upload(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const headers = this.headerService.getAuthHeaders();
    return this.http.post<{ url: string }>(this.apiUrl, formData, { headers });
  }

  getImageByUrl(url: string): Observable<Blob> {
    const imageUrl = `${this.imageBaseUrl}${url}`;
    return this.http.get(imageUrl, { responseType: 'blob' });
  }

  getImageUrl(url: string): string {
    return `${this.imageBaseUrl}${url}`;
  }
}

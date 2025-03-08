import { Injectable, inject } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from '../AuthenticationService/auth.service';

@Injectable({
  providedIn: 'root',
})
export class HttpHeadersService {
  private authService = inject(AuthService);

  getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }
}

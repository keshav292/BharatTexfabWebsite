import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { API_BASE_URL } from '../../api.config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = inject(API_BASE_URL);

  login(username: string, password: string) {
    return this.http
      .post<{ token: string }>(`${this.apiUrl}/auth/login`, {
        username,
        password,
      })
      .subscribe((response) => {
        localStorage.setItem('authToken', response.token);
        this.router.navigate(['/admin']);
      });
  }

  logout() {
    console.log('Logging out');
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  getToken(): string | null {
    if (this.isAuthenticated()) return localStorage.getItem('authToken');
    return null;
  }
}

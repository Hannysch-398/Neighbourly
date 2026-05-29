import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { Router } from '@angular/router';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly apiUrl = '/api/auth';
  private readonly TOKEN_KEY = 'auth_token';

  login(data: LoginRequest) {
    return this.http.post(`${this.apiUrl}/login`, data, { responseType: 'text' }).pipe(
      tap((token) => this.saveToken(token))
    );
  }

  register(data: RegisterRequest) {
    return this.http.post(`${this.apiUrl}/register`, data, { responseType: 'text' });
  }

  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  logout(returnUrl?: string): Promise<boolean> {
    localStorage.removeItem(this.TOKEN_KEY);

    return this.router.navigate(['/auth'], {
      queryParams: returnUrl ? { returnUrl } : undefined,
    });
  }
}

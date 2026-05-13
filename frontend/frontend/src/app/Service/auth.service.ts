import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

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
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/auth';
  private readonly tokenKey = 'auth_token';
  private readonly loggedIn = signal(this.hasStoredToken());

  readonly isLoggedIn = this.loggedIn.asReadonly();

  login(data: LoginRequest) {
    return this.http
      .post(`${this.apiUrl}/login`, data, { responseType: 'text' })
      .pipe(tap((token) => localStorage.setItem(this.tokenKey, token)));
  }

  register(data: RegisterRequest) {
    return this.http.post(`${this.apiUrl}/register`, data, { responseType: 'text' });
  }

  private hasStoredToken(): boolean {
    try {
      return !!localStorage.getItem(this.tokenKey);
    } catch {
      return false;
    }
  }

  private storeToken(token: string): void {
    try {
      localStorage.setItem(this.tokenKey, token);
    } catch {
      // localStorage can be unavailable in some render/test environments.
    }

    this.loggedIn.set(!!token);
  }
}

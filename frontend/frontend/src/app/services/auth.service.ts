import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
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
  private readonly router = inject(Router);

  private readonly apiUrl = '/api/auth';
  private readonly tokenKey = 'auth_token';
  private readonly loggedIn = signal(this.hasStoredToken());

  readonly loggedInState = this.loggedIn.asReadonly();

  login(data: LoginRequest) {
    return this.http
      .post(`${this.apiUrl}/login`, data, { responseType: 'text' })
      .pipe(tap((token) => this.saveToken(token)));
  }

  register(data: RegisterRequest) {
    return this.http.post(`${this.apiUrl}/register`, data, { responseType: 'text' });
  }

  saveToken(token: string): void {
    try {
      localStorage.setItem(this.tokenKey, token);
    } catch {
      // localStorage can be unavailable in some render/test environments.
    }

    this.loggedIn.set(!!token);
  }

  getToken(): string | null {
    try {
      return localStorage.getItem(this.tokenKey);
    } catch {
      return null;
    }
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  logout(returnUrl?: string): Promise<boolean> {
    try {
      localStorage.removeItem(this.tokenKey);
    } catch {
      // localStorage can be unavailable in some render/test environments.
    }

    this.loggedIn.set(false);

    if (returnUrl) {
      return this.router.navigate(['/auth'], {
        queryParams: {
          returnUrl,
        },
      });
    }

    return this.router.navigate(['/auth']);
  }

  private hasStoredToken(): boolean {
    return this.getToken() !== null;
  }
}

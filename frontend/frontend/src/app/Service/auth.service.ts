import { Injectable, inject } from '@angular/core';
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
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/auth';

  login(data: LoginRequest) {
    return this.http.post(`${this.apiUrl}/login`, data, { responseType: 'text' }).pipe(
      tap((token) => localStorage.setItem('token', token))
    );
  }

  register(data: RegisterRequest) {
    return this.http.post(`${this.apiUrl}/register`, data, { responseType: 'text' });
  }
}

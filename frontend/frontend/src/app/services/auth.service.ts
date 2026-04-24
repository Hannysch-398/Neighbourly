import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';

  constructor(private router: Router) {}

  // Ziel: JWT nach Login speichern
  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  // Ziel: Token für Interceptor bereitstellen
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Akzeptanzkriterium: Logout entfernt Token & Redirect
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(['/login']);
  }
}

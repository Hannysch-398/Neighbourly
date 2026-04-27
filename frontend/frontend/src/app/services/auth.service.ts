import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';

  constructor(private router: Router) {}

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

    if(returnUrl) {
      return this.router.navigate(['/login'], {
        queryParams: {
          returnUrl,
        },
      });
    }

    return this.router.navigate(['/login']);
  }
}

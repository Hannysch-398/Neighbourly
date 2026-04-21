import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';

export interface RegisterUser {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class RegisterFormService {
  readonly isRegistered = signal(false);
  readonly message = signal<string | null>(null);

  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/auth/register';

  register(user: RegisterUser) {
    const payload = {
      email: user.email,
      password: user.password
    };
    console.log('POST /api/auth/register');
    console.log('payload:', payload);
    return this.http.post(this.apiUrl, payload, { responseType: 'text' }).pipe(
      tap((responseMessage) => {
        this.isRegistered.set(true);
        this.message.set(responseMessage || 'Registrierung erfolgreich');
      }),
      catchError((error) => {
        this.isRegistered.set(false);

        const backendMessage =
          typeof error.error === 'string'
            ? error.error
            : error.error?.message ||
              error.error?.error ||
              Object.values(error.error ?? {})[0] ||
              'Registrierung fehlgeschlagen';

        this.message.set(String(backendMessage));
        return throwError(() => error);
      })
    );
  }
}

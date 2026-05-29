import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';

export interface RegisterUser {
  username: string;
  email: string;
  password: string;
}

interface ApiErrorResponse {
  status?: number;
  message?: string;
  errors?: Record<string, string>;
}

@Injectable({
  providedIn: 'root'
})
export class RegisterFormService {
  readonly isRegistered = signal(false);
  readonly message = signal<string | null>(null);

  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'api/auth/register';

  register(user: RegisterUser) {
    this.message.set(null);

    const payload = {
      username: user.username,
      email: user.email,
      password: user.password
    };
    return this.http.post(this.apiUrl, payload, { responseType: 'text' }).pipe(
      tap((responseMessage) => {
        this.isRegistered.set(true);
        this.message.set(responseMessage || 'Registrierung erfolgreich');
      }),
      catchError((error) => {
        this.isRegistered.set(false);
        this.message.set(this.getRegisterErrorMessage(error));
        return throwError(() => error);
      })
    );
  }

  private getRegisterErrorMessage(error: HttpErrorResponse): string {
    const backendMessage = this.extractBackendMessage(error.error);

    const normalizedMessage = String(backendMessage).toLowerCase();

    if (normalizedMessage.includes('username') || normalizedMessage.includes('benutzername')) {
      return 'Benutzername ist bereits vergeben.';
    }

    if (normalizedMessage.includes('email') || normalizedMessage.includes('e-mail')) {
      return 'E-Mail ist bereits vergeben.';
    }

    return 'Registrierung fehlgeschlagen. Bitte versuche es erneut.';
  }

  private extractBackendMessage(errorBody: unknown): string {
    if (typeof errorBody === 'string') {
      return errorBody;
    }

    if (!errorBody || typeof errorBody !== 'object') {
      return '';
    }

    const apiError = errorBody as ApiErrorResponse;
    const fieldError = apiError.errors ? Object.values(apiError.errors)[0] : '';

    return fieldError || apiError.message || '';
  }
}

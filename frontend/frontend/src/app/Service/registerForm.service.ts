import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RegisterUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class RegisterFormService {
  readonly isRegistered = signal(false); // Signal: Registrierung erfolgreich?
  readonly message = signal<string | null>(null); // Signal: Feedbackmeldung

  private apiUrl = 'http://localhost:8080/api/auth/register'; // Dein Spring Boot Endpoint

  constructor(private http: HttpClient) {}

  // Registrierungsfunktion
  register(user: RegisterUser): Observable<any> {
    return new Observable(observer => {
      this.http.post<{ message: string }>(this.apiUrl, user).subscribe({
        next: res => {
          this.isRegistered.set(true);       // Registrierung erfolgreich
          this.message.set(res.message);     // Erfolgsmeldung
          observer.next(res);
          observer.complete();
        },
        error: err => {
          this.isRegistered.set(false);      // Registrierung fehlgeschlagen
          this.message.set(err.error ?? 'Registrierung fehlgeschlagen');
          observer.error(err);
        }
      });
    });
  }
}

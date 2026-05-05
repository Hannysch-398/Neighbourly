import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VerifyEmailService {
  private baseUrl = 'http://localhost:8080/api/auth/verify';

  constructor(private http: HttpClient) {}

  verifyEmail(token: string): Observable<string> {
    const params = new HttpParams().set('token', token);

    return this.http.get(this.baseUrl, {
      params,
      responseType: 'text',
    });
  }
}

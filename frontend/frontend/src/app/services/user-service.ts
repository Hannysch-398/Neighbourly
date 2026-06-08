import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

export interface ProfileData {
  id: number;
  username: string;
  email: string;
  // role?: string;
  // createdAt?: string;
}

export interface SuccessResponse {
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getUserIdSignal() {
    return toSignal(
      this.http.get<ProfileData>(`${this.baseUrl}/me`, {
        headers: this.getHeaders(),
      }).pipe(map(profile => profile.id)),
      { initialValue: null }
    );
  }

  submitPasswords(
    data: { oldPassword: string; newPassword: string },
    userId: number
  ) {
    return this.http.put(
      `${this.baseUrl}/me/change-password`,
      data,
      {
        headers: this.getHeaders(),
        responseType: 'text'
      }
    );
  }

  deleteAccount() {
    return this.http.delete<SuccessResponse>(`${this.baseUrl}/me`, {
      headers: this.getHeaders()
    });
  }

  getUserById(id: number) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<ProfileData>(`${this.baseUrl}/${id}`, {headers});
  }
}

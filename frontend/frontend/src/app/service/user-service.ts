import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {
  };


  submitPasswords(data: { oldPassword: string; newPassword: string }, userId: string) {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.put(
      `${this.baseUrl}/${userId}/change-password`,
      data,
      {
        headers,
        responseType: 'text'
      }
    );
  }
}

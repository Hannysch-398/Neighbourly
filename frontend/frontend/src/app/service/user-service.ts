import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {
  };

  submitPasswords(data: {oldPassword: string, newPassword: string }, userId: string) {
    return this.http.put(`${this.baseUrl}/${userId}/change-password`, data)
  }

}

import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginData = {
    email: '',
    password: ''
  };

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  onLogin() {
    this.http.post('http://localhost:8080/api/auth/login', this.loginData, {
      responseType: 'text',
    })
      .subscribe({
        next: (token) => {
          this.authService.saveToken(token);

          const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/profile';
          void this.router.navigateByUrl(returnUrl);
        },
        error: (err) => {
          alert('Login fehlgeschlagen: ' + err.error);
        },
      });
  }
}

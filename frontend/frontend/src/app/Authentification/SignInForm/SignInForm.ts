import { Component, inject, signal } from '@angular/core';
import { form, FormField, required } from '@angular/forms/signals';
import { AuthService, LoginRequest } from '../../Service/auth.service';
import {Router} from '@angular/router';

interface LoginModel {
  email: string;
  password: string;
}

const initial: LoginModel = {
  email: '',
  password: ''
};

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [FormField],
  templateUrl: './SignInForm.html',
  styleUrls: ['./SignInForm.css']
})
export class SignInFormComponent {
  private router = inject(Router);
  private authService = inject(AuthService);

  model = signal<LoginModel>({ ...initial });

  form = form(this.model, (path) => {
    required(path.email, { message: 'Email ist erforderlich' });
    required(path.password, { message: 'Password ist erforderlich' });
  });

  isValid = () =>
    !this.form.email().invalid() &&
    !this.form.password().invalid();

  submit() {
    if (!this.isValid()) return;

    const payload: LoginRequest = this.model();

    this.authService.login(payload).subscribe({
      next: () => this.router.navigate(['/profile']),
      error: err => console.error('Login fehlgeschlagen', err)
    });
  }
}

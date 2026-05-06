import { Component, inject, signal } from '@angular/core';
import { form, FormField, required,pattern } from '@angular/forms/signals';
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

  readonly submitted = signal(false);
  private router = inject(Router);
  private authService = inject(AuthService);
  backendError = signal('');

  model = signal<LoginModel>({ ...initial });

  form = form(this.model, (path) => {
    required(path.email, { message: 'E-Mail ist erforderlich' });
    pattern(path.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
      message: 'Ungültige E-Mail-Adresse'
    });
    required(path.password, { message: 'Passwort ist erforderlich' });
  });

  isValid = () =>
    !this.form.email().invalid() &&
    !this.form.password().invalid();

  submit() {
    this.submitted.set(true);
    this.backendError.set('');

    if (!this.isValid()) return;

    const payload: LoginRequest = this.model();

    this.authService.login(payload).subscribe({
      next: () => this.router.navigate(['/profile']), //'/profile' muss in späteren Sprints zum Pfad zur Hauptseite ausgetauscht werden
      error: err => {
        if (err.status === 401) {
          this.backendError.set('E-Mail oder Passwort ist falsch.');
        } else if (err.status === 403) {
          this.backendError.set('Bitte verifiziere zuerst deine E-Mail-Adresse.');
        } else {
          this.backendError.set('Login fehlgeschlagen. Bitte versuche es erneut.');
        }
      }
    });
  }


}

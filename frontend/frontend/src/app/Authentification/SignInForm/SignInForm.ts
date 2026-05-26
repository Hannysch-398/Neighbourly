import {Component, inject, signal} from '@angular/core';
import {form, FormField, pattern, required} from '@angular/forms/signals';
import {HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';
import {AuthService, LoginRequest} from '../../service/auth.service';

interface LoginModel {
  email: string;
  password: string;
}

interface ApiErrorResponse {
  status?: number;
  message?: string;
  errors?: Record<string, string>;
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
  showPassword = signal(false);
  model = signal<LoginModel>({...initial});

  form = form(this.model, (path) => {
    required(path.email, {message: 'E-Mail ist erforderlich'});
    pattern(path.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
      message: 'Ungültige E-Mail-Adresse'
    });
    required(path.password, {message: 'Passwort ist erforderlich'});
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
      next: () => this.router.navigate(['/profile']),
      error: err => this.backendError.set(this.getLoginErrorMessage(err))
    });
  }

  private getLoginErrorMessage(error: unknown): string {
    if (!(error instanceof HttpErrorResponse)) {
      return 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es erneut.';
    }

    const backendMessage = this.extractBackendMessage(error.error);
    const normalizedMessage = backendMessage.toLowerCase();

    if (error.status === 401 || normalizedMessage.includes('invalid credentials')) {
      return 'E-Mail oder Passwort ist falsch.';
    }

    if (error.status === 403) {
      return backendMessage || 'Bitte verifiziere zuerst deine E-Mail-Adresse.';
    }

    if (error.status === 0 || error.status >= 500) {
      return 'Server momentan nicht erreichbar. Bitte versuche es später erneut.';
    }

    return backendMessage || 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es erneut.';
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

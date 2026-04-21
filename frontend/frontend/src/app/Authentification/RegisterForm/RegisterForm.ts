import { Component, computed, inject, signal } from '@angular/core';

import { form, FormField, pattern, required } from '@angular/forms/signals';
import { RegisterFormService } from '../../Service/registerForm.service';


interface RegisterFormModel {
  email: string;
  password: string;
  confirmPassword: string;
}

const initialData: RegisterFormModel = {
  email: '',
  password: '',
  confirmPassword: ''
};

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [
    FormField,

  ],
  templateUrl: './RegisterForm.html',
  styleUrls: ['./RegisterForm.css']
})
export class RegisterForm {
  private readonly registerService = inject(RegisterFormService);

  readonly isSignUp = signal(true);
  readonly feedbackMessage = this.registerService.message;
  readonly registrationSucceeded = this.registerService.isRegistered;

  toggleForm() {
    this.isSignUp.set(!this.isSignUp());
  }

  setSignUp(value: boolean) {
    this.isSignUp.set(value);
  }
  readonly registerModel = signal<RegisterFormModel>({ ...initialData });

  registerForm = form(this.registerModel, (schemaPath) => {
    required(schemaPath.email, { message: 'E-Mail eingeben' });
    pattern(schemaPath.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/, { message: 'ungültige E-Mail' });
    required(schemaPath.password, { message: 'Passwort eingeben' });
    pattern(
      schemaPath.password,
      /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!_])(?=\S+$).{8,}$/,
      {
        message: 'Benutze 8+ Buchstaben mit Klein- und Großschreibung, Nummern und Sonderzeichen'
      }
    );
  });

  readonly isFormValid = computed(() =>
    !this.registerForm.email().invalid() &&
    !this.registerForm.password().invalid() &&
    this.passwordsMatch()
  );

  readonly passwordsMatch = computed(() =>
    this.registerModel().password === this.registerModel().confirmPassword
  );

  submitForm() {
    if (!this.isFormValid()) return;

    this.registerService.register(this.registerModel()).subscribe({
      next: () => {
        this.registerModel.set({ ...initialData });
      },
      error: err => console.error('Error', err)
    });
  }
}

import { Component, computed, inject, signal } from '@angular/core';

import { form, FormField, pattern, required } from '@angular/forms/signals';
import { RegisterFormService } from '../../Service/registerForm.service';


interface RegisterFormModel {
  email: string;
  password: string;
}

const initialData: RegisterFormModel = {
  email: '',
  password: ''
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
    required(schemaPath.email, { message: 'enter E-Mail' });
    pattern(schemaPath.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/, { message: 'invalid E-Mail' });
    required(schemaPath.password, { message: 'enter password' });
    pattern(
      schemaPath.password,
      /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!_])(?=\S+$).{8,}$/,
      {
        message: 'Use 8+ chars with upper, lower, number and special character'
      }
    );
  });

  readonly isFormValid = computed(() =>
    !this.registerForm.email().invalid() &&
    !this.registerForm.password().invalid()
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

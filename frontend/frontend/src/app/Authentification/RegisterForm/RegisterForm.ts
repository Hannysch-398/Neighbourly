import { Component, computed, inject, signal } from '@angular/core';

import { form, FormField, pattern, required } from '@angular/forms/signals';
import { RegisterFormService } from '../../Service/registerForm.service';


interface RegisterFormModel {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;

}

const initialData: RegisterFormModel = {
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
};

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [FormField],
  templateUrl: './RegisterForm.html',
  styleUrls: ['./RegisterForm.css']
})
export class RegisterForm {
  private readonly registerService = inject(RegisterFormService);

  readonly isSignUp = signal(true);
  readonly feedbackMessage = this.registerService.message;
  readonly registrationSucceeded = this.registerService.isRegistered;
  readonly registerModel = signal<RegisterFormModel>({ ...initialData });


  toggleForm() {
    this.isSignUp.set(!this.isSignUp());
  }

  setSignUp(value: boolean) {
    this.isSignUp.set(value);
  }


  registerForm = form(this.registerModel, (schemaPath) => {
    required(schemaPath.username, { message: 'Benutzername ist erforderlich' });
    pattern(schemaPath.username, /^[a-zA-Z0-9._-]{3,20}$/, {
      message: 'Benutzername muss 3–20 Zeichen lang sein und darf nur Buchstaben, Zahlen sowie . _ - enthalten'
    });
    required(schemaPath.email, { message: 'E-Mail ist erforderlich' });
    pattern(schemaPath.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/, { message: 'Ungültige E-Mail-Adresse' });

    required(schemaPath.password, { message: 'Passwort ist erforderlich'});
    pattern(
      schemaPath.password,
      /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!_])(?=\S+$).{8,}$/,
      {
        message: 'Benutze 8+ Buchstaben mit Klein- und Großschreibung, Nummern und Sonderzeichen'
      }
    );
  });

  readonly isFormValid = computed(() =>
    !this.registerForm.username().invalid() &&
    !this.registerForm.email().invalid() &&
    !this.registerForm.password().invalid() &&
    !!this.registerModel().confirmPassword &&
    this.passwordsMatch()
  );

  readonly passwordsMatch = computed(() =>
    this.registerModel().password === this.registerModel().confirmPassword
  );


  updateConfirmPassword(value: string) {
    this.registerModel.set({
      ...this.registerModel(),
      confirmPassword: value
    });
  }


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

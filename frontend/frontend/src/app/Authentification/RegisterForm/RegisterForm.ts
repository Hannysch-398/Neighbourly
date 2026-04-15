import {Component, signal, inject, computed} from '@angular/core';
import {RegisterFormService} from '../Service/registerForm.service';
import {form, FormField, pattern, required} from '@angular/forms/signals';


interface RegisterFormModel {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const initialData: RegisterFormModel = {
  firstName: '',
  lastName: '',
  email: '',
  password: ''
};

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [
    FormField,

  ],
  templateUrl: './registerform.html',
  styleUrls: ['./registerform.css']
})
export class RegisterForm {
  isSignUp = signal(true);

  toggleForm() {
    this.isSignUp.set(!this.isSignUp());
  }

  setSignUp(value: boolean) {
    this.isSignUp.set(value);
  }

  registerModel = signal<RegisterFormModel>({ ...initialData });
  private registerService = inject(RegisterFormService);

  registerForm = form(this.registerModel, (schemaPath) => {
    required(schemaPath.firstName, { message: 'enter your firstname' });
    required(schemaPath.lastName, { message: 'enter your lastname' });
    required(schemaPath.email, { message: 'enter E-Mail' });
    pattern(schemaPath.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/, { message: 'invalid E-Mail' });
    required(schemaPath.password, { message: 'enter password' });
    pattern(schemaPath.password, /^.{6,}$/, { message: 'Password must at least contain 6 characters' });
  });
  readonly isFormValid = computed(() =>
    !this.registerForm.lastName().invalid() &&
    !this.registerForm.firstName().invalid() &&
    !this.registerForm.email().invalid() &&
    !this.registerForm.password().invalid()
  );
  submitForm() {
    if (!this.isFormValid()) return;

    this.registerService.register(this.registerModel()).subscribe({
      next: res => console.log('Erfolg', res),
      error: err => console.error('Fehler', err)
    });
  }

}

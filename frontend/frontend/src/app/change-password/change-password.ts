import { Component, computed, inject, input, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { form, FormField, pattern, required } from '@angular/forms/signals';
import { GenericButton } from '../components/generic-button/generic-button';
import { UserService } from '../service/user-service';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-change-password',
  imports: [FormField, GenericButton],
  templateUrl: './change-password.html',
  styleUrl: './change-password.css',
})
export class ChangePassword {
  regexp = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!_])(?=\S+$).{8,}$/;

  private activatedRoute = inject(ActivatedRoute);
  userId = input.required<string>();

  loading = signal(false);
  successMessage = signal('');
  backendError = signal('');
  oldPasswordError = signal('');
  newPasswordBackendError = signal('');

  constructor(private userService: UserService) {}

  passwordModel = signal({
    password: '',
    newPassword: '',
    repeatPassword: '',
  });

  changePasswordForm = form(this.passwordModel, (p) => {
    required(p.password, { message: 'Bitte das ursprüngliche Passwort eingeben' });
    required(p.newPassword, { message: 'Bitte das neue Passwort eingeben' });
    pattern(p.newPassword, this.regexp, {
      message: 'Das eingegebene Passwort erfüllt nicht die Anforderungen.',
    });
    required(p.repeatPassword, { message: 'Bitte das neue Passwort wiederholen' });
  });

  passwordsMatch = computed(() => {
    const newPw = this.changePasswordForm.newPassword().value();
    const repeatPw = this.changePasswordForm.repeatPassword().value();
    return newPw === repeatPw;
  });

  oldAndNewAreEqual = computed(() => {
    const oldPw = this.changePasswordForm.password().value();
    const newPw = this.changePasswordForm.newPassword().value();

    if (!oldPw || !newPw) {
      return false;
    }

    return oldPw === newPw;
  });

  formValidForSubmit = computed(() => {
    const password = this.changePasswordForm.password().value().trim();
    const newPassword = this.changePasswordForm.newPassword().value();
    const repeatPassword = this.changePasswordForm.repeatPassword().value();

    if (!password) return false;
    if (!newPassword) return false;
    if (!repeatPassword) return false;
    if (!this.passwordsMatch()) return false;
    if (this.oldAndNewAreEqual()) return false;
    if (!this.regexp.test(newPassword)) return false;

    return true;
  });

  buttonDisabled = computed(() => {
    return this.loading() || !this.formValidForSubmit();
  });

  clearMessages() {
    this.successMessage.set('');
    this.backendError.set('');
    this.oldPasswordError.set('');
    this.newPasswordBackendError.set('');
  }

  resetForm() {
    this.passwordModel.set({
      password: '',
      newPassword: '',
      repeatPassword: '',
    });
  }

  private mapBackendError(error: unknown) {
    this.backendError.set('Beim Ändern des Passworts ist ein Fehler aufgetreten.');
    this.oldPasswordError.set('');
    this.newPasswordBackendError.set('');

    if (!(error instanceof HttpErrorResponse)) {
      return;
    }

    const message =
      typeof error.error === 'string' ? error.error : error.error?.message || error.message;

    if (error.status === 404) {
      this.backendError.set('Der Benutzer wurde nicht gefunden.');
      return;
    }

    if (error.status === 400) {
      if (message?.includes('Das alte Passwort ist falsch')) {
        this.oldPasswordError.set('Das alte Passwort ist falsch.');
        this.backendError.set('');
        return;
      }

      if (message?.includes('Das neue Passwort darf nicht dem alten Passwort entsprechen')) {
        this.newPasswordBackendError.set(
          'Das neue Passwort darf nicht dem alten Passwort entsprechen.',
        );
        this.backendError.set('');
        return;
      }

      this.backendError.set(message || 'Die Eingaben sind ungültig.');
      return;
    }

    if (error.status >= 500) {
      this.backendError.set('Serverfehler. Bitte versuche es später erneut.');
      return;
    }

    this.backendError.set(message || 'Unbekannter Fehler beim Ändern des Passworts.');
  }

  async submitForm(event: Event) {
    event.preventDefault();

    this.clearMessages();

    if (!this.formValidForSubmit()) {
      return;
    }

    const password = this.changePasswordForm.password().value();
    const newPassword = this.changePasswordForm.newPassword().value();

    const data = {
      oldPassword: password,
      newPassword,
    };

    this.loading.set(true);

    try {
      await firstValueFrom(this.userService.submitPasswords(data, this.userId()));
      this.successMessage.set('Das Passwort wurde erfolgreich geändert.');
      this.resetForm();
    } catch (error) {
      this.mapBackendError(error);
    } finally {
      this.loading.set(false);
    }
  }
}

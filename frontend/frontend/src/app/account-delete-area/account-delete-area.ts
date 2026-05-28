import {Component, inject, signal} from '@angular/core';
import {UserService} from '../service/user-service';
import {Router} from '@angular/router';
import {firstValueFrom} from 'rxjs';

@Component({
  selector: 'app-account-delete-area',
  imports: [],
  templateUrl: './account-delete-area.html',
  styleUrl: './account-delete-area.css',
})
export class AccountDeleteArea {
  private router = inject(Router);
  private userService = inject(UserService);
  userId = this.userService.getUserIdSignal();

  isConfirming = false;
  isDeleting = signal(false);
  successMessage = signal('');
  errorMessage = signal('');

  triggerConfirmation() {
    this.isConfirming = true;
  }

  cancel() {
    this.isConfirming = false;
  }

  async confirmDelete() {
    if (this.isDeleting()) {
      return;
    }

    this.successMessage.set('');
    this.errorMessage.set('');

    const userId = this.userId();

    if (userId === null) {
      this.errorMessage.set('Dein Benutzerprofil konnte nicht geladen werden. Bitte versuche es später erneut.');
      this.isConfirming = false;
      return;
    }

    this.isDeleting.set(true);

    try {
      await firstValueFrom(this.userService.deleteAccount());
      this.successMessage.set('Dein Account wurde erfolgreich gelöscht. Du wirst ausgeloggt...');
      this.isConfirming = false;

      setTimeout(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('auth_token');
        this.router.navigate(['/auth']);
      }, 2000);
    } catch {
      this.successMessage.set('');
      this.errorMessage.set('Fehler beim Löschen des Accounts. Bitte versuche es später erneut.');
    } finally {
      this.isDeleting.set(false);
    }
  }
}

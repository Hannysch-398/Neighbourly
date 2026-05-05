import {Component} from '@angular/core';

@Component({
  selector: 'app-account-delete-area',
  imports: [],
  templateUrl: './account-delete-area.html',
  styleUrl: './account-delete-area.css',
})
export class AccountDeleteArea {
  isConfirming = false;
  successMessage = '';
  errorMessage = '';


  triggerConfirmation() {
    this.isConfirming = true;
  }

  cancel() {
    this.isConfirming = false;
  }

  confirmDelete() {
    this.successMessage = 'Dein Account wurde erfolgreich gelöscht. Du wirst ausgeloggt...';
    this.isConfirming = false;
  }
}

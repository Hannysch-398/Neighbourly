import { Component } from '@angular/core';
import {ChangePassword} from '../change-password/change-password';
import {AccountDeleteArea} from '../account-delete-area/account-delete-area';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-account-settings',
  imports: [
    ChangePassword,
    AccountDeleteArea,
    RouterLink
  ],
  templateUrl: './account-settings.html',
  styleUrl: './account-settings.css',
})
export class AccountSettings {

}

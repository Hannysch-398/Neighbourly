import { Component } from '@angular/core';
import {AccountDeleteArea} from '../account-delete-area/account-delete-area';

@Component({
  selector: 'app-profile',
  imports: [AccountDeleteArea],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {

}

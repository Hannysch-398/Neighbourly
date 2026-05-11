import { Component } from '@angular/core';
import {AccountDeleteArea} from '../account-delete-area/account-delete-area';
import {Rating} from '../rating/rating';

@Component({
  selector: 'app-profile',
  imports: [AccountDeleteArea, Rating],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {

}

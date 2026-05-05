import { Component, signal } from '@angular/core';
import { RegisterForm } from '../RegisterForm/RegisterForm';
import {SignInFormComponent} from '../SignInForm/SignInForm';


@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [RegisterForm, SignInFormComponent],
  templateUrl: './auth-page.html',
  styleUrls: ['./auth-page.css']
})
export class AuthPageComponent {

  isSignUp = signal(false);

  showSignUp() {
    this.isSignUp.set(true);
  }

  showSignIn() {
    this.isSignUp.set(false);
  }
}

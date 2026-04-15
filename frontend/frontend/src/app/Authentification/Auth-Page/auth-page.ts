import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth-page.component.html',
})
export class AuthPageComponent {

  isSignUp = signal(true);

  showSignIn() {
    this.isSignUp.set(false);
  }

  showSignUp() {
    this.isSignUp.set(true);
  }
}

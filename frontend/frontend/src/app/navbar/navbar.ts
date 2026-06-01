import {Component, computed, inject} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private readonly authService = inject(AuthService);

  createPostRoute() {
    return this.authService.isLoggedIn() ? '/posts/create' : '/auth';
  }

  accountRoute() {
    return this.authService.isLoggedIn() ? '/profile' : '/auth';
  }

  createPostAriaLabel() {
    return this.authService.isLoggedIn()
      ? 'Beitrag erstellen'
      : 'Zur Anmeldung gehen und Beitrag erstellen';
  }

  accountAriaLabel() {
    return this.authService.isLoggedIn() ? 'Zum Profil gehen' : 'Zur Anmeldung gehen';
  }
}

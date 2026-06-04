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

  accountRoute() {
    return this.authService.isLoggedIn() ? '/profile' : '/auth';
  }

  createPostRoute() {
    return this.authService.isLoggedIn() ? '/posts/create' : '/auth';
  }

  createPostAriaLabel() {
    return this.authService.isLoggedIn()
      ? 'Beitrag erstellen'
      : 'Zur Anmeldung gehen und Beitrag erstellen';
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  logout() {
    this.authService.logout();
  }
  accountAriaLabel() {
    return this.authService.isLoggedIn() ? 'Zum Profil gehen' : 'Zur Anmeldung gehen';
  }
}

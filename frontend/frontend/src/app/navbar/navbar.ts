import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../Service/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private readonly authService = inject(AuthService);

  readonly accountRoute = computed(() =>
    this.authService.isLoggedIn() ? '/profile' : '/auth'
  );

  readonly createPostRoute = computed(() =>
    this.authService.isLoggedIn() ? '/posts/create' : '/auth'
  );

  readonly accountAriaLabel = computed(() =>
    this.authService.isLoggedIn() ? 'Zum Profil gehen' : 'Zur Anmeldung gehen'
  );

  readonly createPostAriaLabel = computed(() =>
    this.authService.isLoggedIn()
      ? 'Beitrag erstellen'
      : 'Zur Anmeldung gehen und Beitrag erstellen'
  );
}

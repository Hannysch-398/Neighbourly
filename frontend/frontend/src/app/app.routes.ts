import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadComponent: () =>
      import('./Authentification/Auth-Page/auth-page')
        .then(m => m.AuthPageComponent),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./profile/profile').then(m => m.Profile),
    canActivate: [authGuard],
  },
  {
    path: 'account-delete-area',
    loadComponent: () =>
      import('./account-delete-area/account-delete-area').then(m => m.AccountDeleteArea),
    canActivate: [authGuard],
  },
  {
    path: 'access-denied',
    loadComponent: () =>
      import('./access-denied/access-denied').then(m => m.AccessDenied),
  },
];

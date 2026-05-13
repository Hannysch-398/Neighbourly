import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

import { MapComponent } from './map-component/map-component';
import { ChangePassword } from './change-password/change-password';
import { VerifyEmail } from './verify-email/verify-email';
import { CreatePost } from './create-post/create-post';

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
    path: 'profile/settings',
    loadComponent: () =>
      import('./account-settings/account-settings').then(m => m.AccountSettings),
    canActivate: [authGuard],
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./profile/profile').then(m => m.Profile),
    canActivate: [authGuard],
  },
  {
    path: 'access-denied',
    loadComponent: () =>
      import('./access-denied/access-denied')
        .then(m => m.AccessDenied),
  },
  {
    path: 'map',
    component: MapComponent,
  },
  {
    path: 'verify-email',
    component: VerifyEmail,
  },
  {
    path: 'posts/create',
    component: CreatePost
  }
];

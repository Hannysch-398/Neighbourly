import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

import { MapComponent } from './map-component/map-component';
import { ChangePassword } from './change-password/change-password';
import { VerifyEmail } from './verify-email/verify-email';
import { CreatePost } from './create-post/create-post';
import { PostDetailComponent } from './post-detail/post-detail';
import { PostsListComponent } from './posts-list/posts-list';

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
    path: 'profile/me/change-password',
    component: ChangePassword,
    canActivate: [authGuard],
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
      import('./account-delete-area/account-delete-area')
        .then(m => m.AccountDeleteArea),
    canActivate: [authGuard],
  },
  {
    path: 'access-denied',
    loadComponent: () => import('./access-denied/access-denied').then((m) => m.AccessDenied),
  },
  {
    path: 'map',
    component: MapComponent,
  },
  {
    path: 'posts',
    component: PostsListComponent,
  },
  {
    path: 'posts/create',
    component: CreatePost
  },
  {
    path: 'posts/:id',
    component: PostDetailComponent
  },
  {
    path: 'verify-email',
    component: VerifyEmail,
  }
];

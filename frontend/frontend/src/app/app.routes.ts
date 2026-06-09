import { PostDetailComponent } from './post-detail/post-detail';
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { VerifyEmail } from './verify-email/verify-email';
import { CreatePost } from './create-post/create-post';
import { PostsListComponent } from './posts-list/posts-list';
import { MapAndOverlayComponent } from './map-and-overlay-component/map-and-overlay-component';
import { NotFound } from './not-found/not-found';
import { Chat } from './chat/chat';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadComponent: () =>
      import('./authentification/auth-page/auth-page').then((m) => m.AuthPageComponent),
  },
  {
    path: 'profile/settings',
    loadComponent: () =>
      import('./account-settings/account-settings').then((m) => m.AccountSettings),
    canActivate: [authGuard],
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile/profile').then((m) => m.Profile),
    canActivate: [authGuard],
  },
  {
    path: 'access-denied',
    loadComponent: () => import('./access-denied/access-denied').then((m) => m.AccessDenied),
  },
  {
    path: 'map',
    component: MapAndOverlayComponent,
  },
  {
    path: 'posts',
    component: PostsListComponent,
  },
  {
    path: 'verify-email',
    component: VerifyEmail,
  },
  {
    path: 'posts/create',
    component: CreatePost,
    canActivate: [authGuard],
  },
  {
    path: 'posts/:id/edit',
    component: CreatePost,
    canActivate: [authGuard],
  },
  {
    path: 'posts/:id',
    component: PostDetailComponent,
  },
    {
    path: 'chat',
    component: Chat,
    canActivate: [authGuard],
  },

  {
    path: 'posts/:id',
    loadComponent: () =>
      import('./post-detail/post-detail').then((m) => m.PostDetailComponent),
  },
  {
    path: '404',
    component: NotFound,
  },
];


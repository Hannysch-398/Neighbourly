
import {MapComponent} from './map-component/map-component';
import { Routes } from '@angular/router';
import { ChangePassword } from './change-password/change-password';
import { VerifyEmail } from './verify-email/verify-email';
import { Profile } from './profile/profile';



export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadComponent: () =>
      import('./Authentification/Auth-Page/auth-page').then((m) => m.AuthPageComponent),
  },
  { path: 'profile/me/change-password', component: ChangePassword },
  {path: "profile",
    loadComponent: () =>
      import('./profile/profile').then(m => m.Profile)
  }, 
  {path:"map", component: MapComponent},
  {
    path: 'verify-email',
    component: VerifyEmail,
  },
  // {path: "profile/login", component: AuthPage}
];

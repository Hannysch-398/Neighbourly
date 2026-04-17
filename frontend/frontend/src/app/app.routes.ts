import {RouterModule, Routes} from '@angular/router';
import {RegisterForm} from './Authentification/RegisterForm/RegisterForm';


export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./Authentification/Auth-Page/auth-page')
        .then(m => m.AuthPageComponent)
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./profile/profile').then(m => m.Profile)
  }
];

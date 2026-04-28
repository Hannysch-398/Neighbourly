import { Routes} from '@angular/router';



export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: 'auth',
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

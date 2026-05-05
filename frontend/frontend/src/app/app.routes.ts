<<<<<<< feature/NEBO-114-FE-und-Empty-States
import { Routes} from '@angular/router';
=======
import { Routes } from '@angular/router';
import { VerifyEmail } from './verify-email/verify-email';
import { Profile } from './profile/profile';
>>>>>>> develop

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
  {
    path: 'profile',
    loadComponent: () => import('./profile/profile').then((m) => m.Profile),
<<<<<<< feature/NEBO-114-FE-und-Empty-States
  }
=======
  },
  {
    path: 'verify-email',
    component: VerifyEmail,
  },
  // {path: "profile/login", component: AuthPage}
>>>>>>> develop
];

import { Routes } from '@angular/router';
import {ChangePassword} from './change-password/change-password';

export const routes: Routes = [
  {
    path: 'profile',
    loadComponent: () =>
      import('./profile/profile').then(m => m.Profile)
  },{path: "profile/:id/change-password", component: ChangePassword}
];

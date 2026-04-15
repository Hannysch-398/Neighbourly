import { Routes } from '@angular/router';
import { Rating } from './rating/rating';

export const routes: Routes = [
  {
    path: 'profile',
    loadComponent: () => import('./profile/profile').then((m) => m.Profile),
  },
  { path: 'profile/rating', component: Rating },
];

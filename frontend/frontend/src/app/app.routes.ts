import {RouterModule, Routes} from '@angular/router';
import {RegisterForm} from './RegisterForm/RegisterForm';

export const routes: Routes = [

  { path: 'register', component: RegisterForm, title: 'Register' },  // ← Root-Pfad
  { path: '**', redirectTo: '' },
];

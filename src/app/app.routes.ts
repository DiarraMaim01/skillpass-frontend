import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './login/login';
import { Register } from './register/register';
import { Tests } from './tests/tests';
import { Admin } from './admin/admin';

export const routes: Routes = [
  { path: '', component: Home },              // Page d'accueil
  { path: 'login', component: Login },        // Page login
  { path: 'register', component: Register },  // Page inscription
  { path: 'tests', component: Tests },        // Page des tests
  { path: 'admin', component: Admin },        // Page admin
  { path: '**', redirectTo: '' }                       // Redirection si route inconnue
];

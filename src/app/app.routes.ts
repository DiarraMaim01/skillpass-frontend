import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './login/login';
import { Register } from './register/register';
import { Tests } from './tests/tests';
import { Admin } from './admin/admin';
import { List } from './questions/list/list';
import { authGuard, adminGuard } from './guards/auth-guard';
import { Detail } from './questions/detail/detail';
import { Form } from './questions/form/form';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'tests', component: Tests, canActivate: [authGuard] },
  { path: 'questions', component: List, canActivate: [authGuard, adminGuard] },
  { path: 'questions/new', component: Form, canActivate: [authGuard, adminGuard] },
{ path: 'questions/edit/:id', component: Form, canActivate: [authGuard, adminGuard] },
  { path: 'questions/:id', component: Detail, canActivate: [authGuard, adminGuard] },
  { path: 'admin', component: Admin, canActivate: [authGuard, adminGuard] },
  { path: '**', redirectTo: '' }
];           // Redirection si route inconnue



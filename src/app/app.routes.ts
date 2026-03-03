import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './login/login';
import { Register } from './register/register';
import { Admin } from './admin/admin';
import { List } from './questions/list/list';
import { authGuard, adminGuard } from './guards/auth-guard';
import { Detail } from './questions/detail/detail';
import { Form } from './questions/form/form';
import { TestsList } from './tests/list/list';
import { TestDetail } from './tests/detail/detail';
import { TestPlay } from './tests/play/play';
import { TestResult } from './tests/result/result';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'questions', component: List, canActivate: [authGuard, adminGuard] },
  { path: 'questions/new', component: Form, canActivate: [authGuard, adminGuard] },
{ path: 'questions/edit/:id', component: Form, canActivate: [authGuard, adminGuard] },
  { path: 'questions/:id', component: Detail, canActivate: [authGuard, adminGuard] },
  { path: 'admin', component: Admin, canActivate: [authGuard, adminGuard] },

  // test
  { path: 'tests', component: TestsList, canActivate: [authGuard] },
{ path: 'tests/:id', component: TestDetail, canActivate: [authGuard] },
{ path: 'tests/:id/play', component: TestPlay, canActivate: [authGuard] },
{ path: 'tests/:id/result', component: TestResult, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];           // Redirection si route inconnue



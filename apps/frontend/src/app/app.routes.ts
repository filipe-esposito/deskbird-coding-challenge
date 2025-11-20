import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login-form').then((m) => m.LoginFormComponent),
  },
  {
    path: 'users',
    loadComponent: () =>
      import('./features/users/users').then((m) => m.UsersComponent),
  },
];

import { Route } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';
import { NotAuthGuard } from './shared/guards/not-auth.guard';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: 'login',
    canActivate: [NotAuthGuard],
    loadComponent: () =>
      import('./features/auth/login-form').then((m) => m.LoginFormComponent),
  },
  {
    path: 'users',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./features/users/users').then((m) => m.UsersComponent),
  },
];

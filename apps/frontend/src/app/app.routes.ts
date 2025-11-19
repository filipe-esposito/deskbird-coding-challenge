import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'users',
    loadComponent: () =>
      import('./features/users/users').then((m) => m.UsersComponent),
  },
];

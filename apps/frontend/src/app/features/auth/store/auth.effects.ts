import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { tap, map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private router = inject(Router);

  login$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.login),
        tap(({ user }) => {
          localStorage.setItem('user', JSON.stringify(user));
          this.router.navigate(['/users']);
        })
      ),
    { dispatch: false }
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          localStorage.removeItem('user');
          this.router.navigate(['/login']);
        })
      ),
    { dispatch: false }
  );

  loadSession$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loadSession),
      map(() => {
        const user = localStorage.getItem('user');

        return AuthActions.sessionLoaded({
          user: user ? JSON.parse(user) : null,
        });
      })
    )
  );
}

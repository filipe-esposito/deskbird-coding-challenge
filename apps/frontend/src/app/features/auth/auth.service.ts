import { inject, Injectable, Injector, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { BASE_API_URL } from '../../app.config';
import { IUser } from '../../shared/models/user.model';
import { select, Store } from '@ngrx/store';
import * as AuthActions from './store/auth.actions';
import { selectAuthUser } from './store/auth.selectors';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private loginApiUrl = `${BASE_API_URL}/login`;
  private store = inject(Store);
  private injector = inject(Injector);

  login(username: string, password: string): Observable<any> {
    return this.http.post(this.loginApiUrl, { username, password });
  }

  setCurrentUser(user: IUser) {
    this.store.dispatch(AuthActions.login({ user }));
  }

  getCurrentUser(): Signal<IUser | null> {
    return toSignal(this.store.pipe(select(selectAuthUser)), {
      injector: this.injector,
      initialValue: null,
    });
  }

  isUserLoggedIn(): boolean {
    const user: Signal<IUser | null> = this.getCurrentUser();

    return !!user();
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
  }
}

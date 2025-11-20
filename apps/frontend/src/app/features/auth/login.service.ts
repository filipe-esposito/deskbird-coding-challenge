import { inject, Injectable, Signal, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BASE_API_URL } from '../../app.config';
import { IUser } from '../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private loginApiUrl = `${BASE_API_URL}/login`;

  login(username: string, password: string): Observable<any> {
    return this.http.post(this.loginApiUrl, { username, password });
  }

  // TODO replace with NgRx store
  private currentUser = signal<IUser | undefined>(undefined);

  setCurrentUser(user: IUser) {
    this.currentUser.set(user);
  }

  getCurrentUser(): Signal<IUser | undefined> {
    return this.currentUser;
  }

  logout() {
    this.currentUser.set(undefined);
  }
}

import { Injectable, inject, Signal, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IUser } from '../../models/user.model';
import { BASE_API_URL } from '../../app.config';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private http = inject(HttpClient);
  private usersApiUrl = `${BASE_API_URL}/users`;

  private users = signal<IUser[]>([]);

  constructor() {
    this.refreshUsers();
  }

  refreshUsers() {
    this.http.get<IUser[]>(this.usersApiUrl).subscribe({
      next: (users) => this.users.set(users),
      error: () => this.users.set([]),
    });
  }

  getUsers(): Signal<IUser[]> {
    return this.users.asReadonly();
  }

  addUser(newUser: IUser) {
    this.http.post<IUser>(this.usersApiUrl, newUser).subscribe({
      next: () => this.refreshUsers(),
    });
  }

  updateUser(updatedUser: IUser) {
    const updateUserApiUrl = `${this.usersApiUrl}/${updatedUser.id}`;

    this.http.patch<IUser>(updateUserApiUrl, updatedUser).subscribe({
      next: () => this.refreshUsers(),
    });
  }

  deleteUser(userId: number) {
    const deleteUserApiUrl = `${this.usersApiUrl}/${userId}`;

    this.http.delete<void>(deleteUserApiUrl).subscribe({
      next: () => this.refreshUsers(),
    });
  }
}

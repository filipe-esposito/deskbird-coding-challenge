import { Injectable, Signal, signal } from '@angular/core';
import { IUser, UserRole } from '../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private users = signal([
    { name: 'John Doe', username: 'john.doe', role: UserRole.ADMIN },
    { name: 'Jane Smith', username: 'jane.smith', role: UserRole.REGULAR },
    { name: 'Bob Johnson', username: 'bob.johnson', role: UserRole.REGULAR },
  ]);

  getUsers(): Signal<IUser[]> {
    return this.users.asReadonly();
  }

  addUser(newUser: any) {
    this.users.update((users) => [...users, newUser]);
  }

  updateUser(updatedUser: any) {
    this.users.update((users) => {
      const index = users.findIndex((u) => u.username === updatedUser.username);

      if (index !== -1) {
        const newUsers = [...users];
        newUsers[index] = { ...updatedUser };
        return newUsers;
      }

      return users;
    });
  }
}

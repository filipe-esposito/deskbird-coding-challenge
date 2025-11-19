import { Component, signal, inject, Signal } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { UsersService } from './users.service';
import { IUser, UserRole } from '../../models/user.model';

@Component({
  selector: 'dcc-users',
  templateUrl: './users.html',
  imports: [
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    SelectModule,
    FormsModule,
  ],
})
export class UsersComponent {
  private usersService = inject(UsersService);

  users: Signal<IUser[]> = this.usersService.getUsers();
  selectedUser = signal<IUser | undefined>(undefined);
  roleOptions = signal(
    Object.entries(UserRole).map(([key, value]) => ({
      label: value,
      value: key,
    }))
  );
  displayDialog = signal(false);
  isEditMode = signal(false);

  currentUserRole = signal<UserRole>(UserRole.ADMIN); // TODO replace mocked value with real auth logic

  readonly userRoles = UserRole;

  addUser() {
    this.selectedUser.set({
      name: '',
      username: '',
      role: UserRole.REGULAR,
      password: '',
    });
    this.isEditMode.set(false);
    this.displayDialog.set(true);
  }

  editUser(user: IUser) {
    this.selectedUser.set({ ...user });
    this.isEditMode.set(true);
    this.displayDialog.set(true);
  }

  // TODO replace these methods with saving user data at once? (maybe using a form?)
  updateName(name: string) {
    this.selectedUser.update((user) => ({ ...user, name }));
  }
  updateUsername(username: string) {
    this.selectedUser.update((user) => ({ ...user, username }));
  }
  updatePassword(password: string) {
    this.selectedUser.update((user) => ({ ...user, password }));
  }
  updateRole(role: UserRole) {
    this.selectedUser.update((user) => ({ ...user, role }));
  }

  closeDialog() {
    this.displayDialog.set(false);
    this.selectedUser.set(undefined);
  }

  saveUser() {
    const currentSelectedUser = this.selectedUser();

    if (!currentSelectedUser) {
      return;
    }

    // TODO add form validations

    if (this.isEditMode()) {
      this.usersService.updateUser(currentSelectedUser);
    } else {
      this.usersService.addUser(currentSelectedUser);
    }

    this.closeDialog();
  }
}

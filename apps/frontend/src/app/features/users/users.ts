import { Component, signal, inject, Signal } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { UsersService } from './users.service';
import { IUser } from '../../models/user.model';

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
  displayEditDialog = signal(false);
  displayDeleteDialog = signal(false);
  isEditMode = signal(false);
  roleOptions = signal([
    {
      label: 'Regular',
      value: false,
    },
    {
      label: 'Admin',
      value: true,
    },
  ]);

  isCurrentUserAdmin = signal<boolean>(true); // TODO replace mocked value with real auth logic

  addUser() {
    this.selectedUser.set({
      name: '',
      username: '',
      isAdmin: false,
      password: '',
    });
    this.isEditMode.set(false);
    this.displayEditDialog.set(true);
  }

  confirmDeleteUser(user: IUser) {
    this.selectedUser.set(user);
    this.displayDeleteDialog.set(true);
  }

  deleteUserConfirmed() {
    const user = this.selectedUser();
    if (user && user.id) {
      this.usersService.deleteUser(user.id);
    }
    this.displayDeleteDialog.set(false);
    this.selectedUser.set(undefined);
  }

  cancelDeleteUser() {
    this.displayDeleteDialog.set(false);
    this.selectedUser.set(undefined);
  }

  editUser(user: IUser) {
    this.selectedUser.set({ ...user });
    this.isEditMode.set(true);
    this.displayEditDialog.set(true);
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
  updateRole(isAdmin: boolean) {
    this.selectedUser.update((user) => ({ ...user, isAdmin }));
  }

  closeDialog() {
    this.displayEditDialog.set(false);
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

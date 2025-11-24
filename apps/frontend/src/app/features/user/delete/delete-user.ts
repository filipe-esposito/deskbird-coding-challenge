import { Component, inject, input, signal } from '@angular/core';
import { IUser } from '@deskbird-coding-challenge/shared-lib';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { UserService } from '../users.service';

@Component({
  selector: 'dcc-delete-user',
  templateUrl: './delete-user.html',
  imports: [ButtonModule, DialogModule],
})
export class DeleteUserComponent {
  private userService = inject(UserService);

  user = input<IUser>();

  displayDialog = signal(false);

  confirmDeleteUser() {
    this.displayDialog.set(true);
  }

  deleteUserConfirmed() {
    const user = this.user();
    if (user && user?.id) {
      this.userService.deleteUser(user.id);
    }

    this.displayDialog.set(false);
  }

  cancelDeleteUser() {
    this.displayDialog.set(false);
  }
}

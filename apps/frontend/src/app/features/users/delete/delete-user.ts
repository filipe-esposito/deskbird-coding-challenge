import { Component, inject, input, signal } from '@angular/core';
import { IUser } from '../../../shared/models/user.model';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { UsersService } from '../users.service';

@Component({
  selector: 'dcc-delete-user',
  templateUrl: './delete-user.html',
  imports: [ButtonModule, DialogModule],
})
export class DeleteUserComponent {
  private usersService = inject(UsersService);

  user = input<IUser>();

  displayDialog = signal(false);

  confirmDeleteUser() {
    this.displayDialog.set(true);
  }

  deleteUserConfirmed() {
    const user = this.user();
    if (user && user?.id) {
      this.usersService.deleteUser(user.id);
    }

    this.displayDialog.set(false);
  }

  cancelDeleteUser() {
    this.displayDialog.set(false);
  }
}

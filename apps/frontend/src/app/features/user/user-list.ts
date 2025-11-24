import { Component, inject, Signal } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { UserService } from './users.service';
import { IUser } from '@deskbird-coding-challenge/shared-lib';
import { AuthService } from '../auth/auth.service';
import { LogoutComponent } from '../auth/logout';
import { EditUserComponent } from './edit/edit-user';
import { roleOptions } from '../../shared/utils/form';
import { DeleteUserComponent } from './delete/delete-user';
import { CreateUserComponent } from './create/create-user';

@Component({
  selector: 'dcc-user-list',
  templateUrl: './user-list.html',
  imports: [
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    SelectModule,
    LogoutComponent,
    CreateUserComponent,
    EditUserComponent,
    DeleteUserComponent,
  ],
})
export class UserListComponent {
  private userService = inject(UserService);
  private authService = inject(AuthService);

  users: Signal<IUser[]> = this.userService.getUsers();

  currentUser: Signal<IUser | null> = this.authService.getCurrentUser();

  readonly roleOptions = roleOptions;

  displayUserRole(isAdmin: boolean): string {
    return (
      this.roleOptions().find((option) => option.value === isAdmin)?.label ??
      'Regular'
    );
  }
}

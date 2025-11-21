import { Component, inject, Signal } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { UsersService } from './users.service';
import { IUser } from '@deskbird-coding-challenge/shared-lib';
import { AuthService } from '../auth/auth.service';
import { LogoutComponent } from '../auth/logout';
import { EditUserComponent } from './edit/edit-user';
import { roleOptions, shouldDisplayError } from '../../shared/utils/form';
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
  private usersService = inject(UsersService);
  private authService = inject(AuthService);

  users: Signal<IUser[]> = this.usersService.getUsers();

  currentUser: Signal<IUser | null> = this.authService.getCurrentUser();

  readonly roleOptions = roleOptions;
  readonly shouldDisplayError = shouldDisplayError;

  displayUserRole(isAdmin: boolean): string {
    return (
      this.roleOptions().find((option) => option.value === isAdmin)?.label ??
      'Regular'
    );
  }
}

import { Component, inject, input, signal } from '@angular/core';
import { IUser } from '@deskbird-coding-challenge/shared-lib';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { UsersService } from '../users.service';
import {
  noSpaceValidator,
  roleOptions,
  shouldDisplayError,
} from '../../../shared/utils/form';

@Component({
  selector: 'dcc-edit-user',
  templateUrl: './edit-user.html',
  imports: [
    ButtonModule,
    DialogModule,
    InputTextModule,
    SelectModule,
    ReactiveFormsModule,
  ],
})
export class EditUserComponent {
  private usersService = inject(UsersService);
  private fb = inject(FormBuilder);

  user = input<IUser>();

  displayDialog = signal(false);

  editUserForm: FormGroup = this.fb.group({
    name: [this.user()?.name, Validators.required],
    username: [this.user()?.username, [Validators.required, noSpaceValidator]],
    password: [''],
    isAdmin: [this.user()?.isAdmin, Validators.required],
  });

  readonly roleOptions = roleOptions;
  readonly shouldDisplayError = shouldDisplayError;

  editUser() {
    this.editUserForm.reset({
      name: this.user()?.name,
      username: this.user()?.username,
      isAdmin: this.user()?.isAdmin,
      password: '',
    });

    this.displayDialog.set(true);
  }

  closeDialog() {
    this.displayDialog.set(false);
    this.editUserForm.reset();
  }

  saveUser() {
    if (this.editUserForm.invalid) {
      this.editUserForm.markAllAsTouched();
      return;
    }

    const formValue = this.editUserForm.value satisfies IUser;

    const userToUpdate = { ...this.user(), ...formValue };
    this.usersService.updateUser(userToUpdate);

    this.closeDialog();
  }
}

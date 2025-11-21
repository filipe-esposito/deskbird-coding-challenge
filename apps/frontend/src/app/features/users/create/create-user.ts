import { Component, inject, signal } from '@angular/core';
import { IUser } from '../../../shared/models/user.model';
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
  selector: 'dcc-create-user',
  templateUrl: './create-user.html',
  imports: [
    ButtonModule,
    DialogModule,
    InputTextModule,
    SelectModule,
    ReactiveFormsModule,
  ],
})
export class CreateUserComponent {
  private usersService = inject(UsersService);
  private fb = inject(FormBuilder);

  displayDialog = signal(false);

  createUserForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    username: ['', [Validators.required, noSpaceValidator]],
    password: ['', [Validators.required]],
    isAdmin: ['', Validators.required],
  });

  readonly roleOptions = roleOptions;
  readonly shouldDisplayError = shouldDisplayError;

  addUser() {
    this.createUserForm.reset();
    this.displayDialog.set(true);
  }

  closeDialog() {
    this.createUserForm.reset();
    this.displayDialog.set(false);
  }

  saveUser() {
    if (this.createUserForm.invalid) {
      this.createUserForm.markAllAsTouched();
      return;
    }

    const formValue = this.createUserForm.value satisfies IUser;
    this.usersService.addUser(formValue);

    this.closeDialog();
  }
}

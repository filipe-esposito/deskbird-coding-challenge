import { Component, signal, inject, Signal } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import {
  FormBuilder,
  Validators,
  FormGroup,
  AbstractControl,
  ReactiveFormsModule,
  AsyncValidatorFn,
} from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { UsersService } from './users.service';
import { IUser } from '../../models/user.model';
import { of } from 'rxjs';
import { AuthService } from '../auth/login.service';
import { LogoutComponent } from '../auth/logout';

@Component({
  selector: 'dcc-users',
  templateUrl: './users.html',
  imports: [
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    SelectModule,
    ReactiveFormsModule,
    LogoutComponent,
  ],
})
export class UsersComponent {
  private usersService = inject(UsersService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

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

  currentUser: Signal<IUser | undefined> = this.authService.getCurrentUser();

  userForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    username: ['', [Validators.required, this.noSpaceValidator]],
    password: ['', [], [this.passwordRequiredAsyncValidator()]],
    isAdmin: [false, Validators.required],
  });

  addUser() {
    this.selectedUser.set({
      name: '',
      username: '',
      isAdmin: false,
      password: '',
    });
    this.userForm.reset();

    this.isEditMode.set(false);
    this.updatePasswordValidator();
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
    this.userForm.reset({
      name: user.name,
      username: user.username,
      isAdmin: user.isAdmin,
      password: '',
    });

    this.isEditMode.set(true);
    this.updatePasswordValidator();
    this.displayEditDialog.set(true);
  }

  closeEditDialog() {
    this.displayEditDialog.set(false);
    this.selectedUser.set(undefined);
    this.userForm.reset();
  }

  saveUser() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const formValue = this.userForm.value as IUser;

    if (this.isEditMode()) {
      const userToUpdate = { ...this.selectedUser(), ...formValue };
      this.usersService.updateUser(userToUpdate);
    } else {
      this.usersService.addUser(formValue);
    }

    this.closeEditDialog();
  }

  // Helper for error display on the template
  shouldDisplayError(control: AbstractControl | null) {
    return control && control.invalid && (control.dirty || control.touched);
  }

  private noSpaceValidator(control: AbstractControl) {
    const value = control.value as string;
    if (value && value.includes(' ')) {
      return { noSpace: true };
    }
    return null;
  }

  // Async validator for the `password` field
  private passwordRequiredAsyncValidator(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      if (!this.isEditMode() && !control.value) {
        return of({ required: true });
      }

      return of(null);
    };
  }

  // Helper for async password validation
  private updatePasswordValidator() {
    this.userForm
      .get('password')
      ?.setAsyncValidators(this.passwordRequiredAsyncValidator());
    this.userForm.get('password')?.updateValueAndValidity();
  }
}

import { Component, inject, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from './auth.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'dcc-login',
  templateUrl: './login-form.html',
  imports: [ReactiveFormsModule, ButtonModule, InputTextModule],
})
export class LoginFormComponent implements OnDestroy {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  loginForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });
  errorMessage = '';

  onSubmit() {
    if (!this.validateFields()) return;

    let username = this.loginForm.value.username;
    username = username.trim();

    const password = this.loginForm.value.password;

    this.subscriptions.add(
      this.authService.login(username, password).subscribe({
        next: (res) => {
          this.authService.setCurrentUser(res.user);
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = error.error.message;
        },
      })
    );
  }

  private validateFields(): boolean {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Both fields are required.';

      return false;
    }

    this.errorMessage = '';

    return true;
  }

  private subscriptions = new Subscription();

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}

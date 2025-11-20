import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LoginService } from './login.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'dcc-login',
  templateUrl: './login-form.html',
  imports: [ReactiveFormsModule, ButtonModule, InputTextModule],
})
export class LoginFormComponent {
  private fb = inject(FormBuilder);
  private loginService = inject(LoginService);
  private router = inject(Router);

  loginForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });
  errorMessage = '';

  validateFields(): boolean {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Both fields are required.';

      return false;
    }

    this.errorMessage = '';

    return true;
  }

  onSubmit() {
    if (!this.validateFields()) return;

    let username = this.loginForm.value.username;
    username = username.trim();

    const password = this.loginForm.value.password;

    this.loginService.login(username, password).subscribe({
      next: (res) => {
        this.loginService.setCurrentUser(res.user);
        this.router.navigate(['/users']);
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = error.error.message;
      },
    });
  }
}

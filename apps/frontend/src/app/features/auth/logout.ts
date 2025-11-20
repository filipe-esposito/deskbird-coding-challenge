import { Component, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'dcc-logout',
  templateUrl: './logout.html',
  imports: [ButtonModule, DialogModule],
})
export class LogoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  displayDialog = signal(false);

  logout() {
    this.displayDialog.set(true);
  }

  logoutConfirmed() {
    this.displayDialog.set(false);

    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

import { Component, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { AuthService } from './auth.service';

@Component({
  selector: 'dcc-logout',
  templateUrl: './logout.html',
  imports: [ButtonModule, DialogModule],
})
export class LogoutComponent {
  private authService = inject(AuthService);

  displayDialog = signal(false);

  logout() {
    this.displayDialog.set(true);
  }

  logoutConfirmed() {
    this.displayDialog.set(false);
    this.authService.logout();
  }
}

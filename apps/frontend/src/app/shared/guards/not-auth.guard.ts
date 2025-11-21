import { inject, Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../../features/auth/auth.service';

@Injectable({ providedIn: 'root' })
export class NotAuthGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(): boolean | UrlTree {
    return this.authService.isUserLoggedIn()
      ? this.router.createUrlTree(['/users'])
      : true;
  }
}

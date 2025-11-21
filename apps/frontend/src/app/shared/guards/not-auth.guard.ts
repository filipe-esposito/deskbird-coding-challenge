import { inject, Injectable, Signal } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../../features/auth/auth.service';
import { IUser } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class NotAuthGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(): boolean | UrlTree {
    const user: Signal<IUser | null> = this.authService.getCurrentUser();

    return user() ? this.router.createUrlTree(['/users']) : true;
  }
}

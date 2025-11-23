import { NotAuthGuard } from './not-auth.guard';
import { AuthService } from '../../features/auth/auth.service';
import { Router, UrlTree } from '@angular/router';
import { TestBed } from '@angular/core/testing';

describe('NotAuthGuard', () => {
  let guard: NotAuthGuard;
  let authServiceMock: { isUserLoggedIn: jest.Mock };
  let routerMock: { createUrlTree: jest.Mock };

  beforeEach(() => {
    authServiceMock = { isUserLoggedIn: jest.fn() };
    routerMock = { createUrlTree: jest.fn().mockReturnValue({} as UrlTree) };

    TestBed.configureTestingModule({
      providers: [
        NotAuthGuard,
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    guard = TestBed.inject(NotAuthGuard);
  });

  describe('if the user is logged in', () => {
    it('should NOT activate the route by returning a `UrlTree` with the `/users` route', () => {
      authServiceMock.isUserLoggedIn.mockReturnValue(true);

      const result = guard.canActivate();

      expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/users']);
      expect(result).toBe(routerMock.createUrlTree.mock.results[0].value);
    });
  });

  describe('if the user is NOT logged in', () => {
    it('should activate the route', () => {
      authServiceMock.isUserLoggedIn.mockReturnValue(false);

      const result = guard.canActivate();

      expect(result).toBe(true);
    });
  });
});

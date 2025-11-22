import { LoginFormComponent } from './login-form';
import { AuthService } from './auth.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('LoginFormComponent', () => {
  let fixture: ComponentFixture<LoginFormComponent>;
  let component: LoginFormComponent;
  const authServiceSpy = { login: jest.fn(), setCurrentUser: jest.fn() };

  beforeEach(async () => {
    authServiceSpy.login.mockClear();
    authServiceSpy.setCurrentUser.mockClear();

    await TestBed.configureTestingModule({
      imports: [LoginFormComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        importProvidersFrom(BrowserAnimationsModule),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('when the user submits valid credentials', () => {
    it('should call service method for logging in with the correct parameters', () => {
      const username = 'testuser';
      const password = 'testpass';
      component.loginForm.setValue({ username, password });
      authServiceSpy.login.mockReturnValue({ subscribe: jest.fn() });

      component.onSubmit();

      expect(authServiceSpy.login).toHaveBeenCalledWith(username, password);
    });
  });

  describe('when the login was successful', () => {
    it('should call service for setting the current user with the returned user as a parameter', () => {
      const username = 'testuser';
      const password = 'testpass';
      component.loginForm.setValue({ username, password });
      const returnedUser = { id: 1, name: 'Test User' };
      authServiceSpy.login.mockReturnValue({
        subscribe: ({ next }: any) => next({ user: returnedUser }),
      });

      component.onSubmit();

      expect(authServiceSpy.setCurrentUser).toHaveBeenCalledWith(returnedUser);
    });
  });

  describe('when the login was NOT successful', () => {
    it('should set the `errorMessage` with the returned error message', () => {
      const username = 'testuser';
      const password = 'wrongpass';
      component.loginForm.setValue({ username, password });
      const errorResponse = {
        error: { message: 'Invalid credentials' },
      };
      authServiceSpy.login.mockReturnValue({
        subscribe: ({ error }: any) => error(errorResponse),
      });

      component.onSubmit();

      expect(component.errorMessage).toBe('Invalid credentials');
    });
  });

  describe('when the user submits with invalid credentials', () => {
    it('should NOT call service method', () => {
      component.loginForm.setValue({ username: '', password: '' });

      component.onSubmit();

      expect(authServiceSpy.login).not.toHaveBeenCalled();
    });
  });
});

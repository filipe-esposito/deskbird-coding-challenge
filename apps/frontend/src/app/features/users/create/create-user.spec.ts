import { CreateUserComponent } from './create-user';
import { UsersService } from '../users.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('CreateUserComponent', () => {
  let fixture: ComponentFixture<CreateUserComponent>;
  let component: CreateUserComponent;
  const usersServiceSpy = { addUser: jest.fn() };

  beforeEach(async () => {
    usersServiceSpy.addUser.mockClear();

    await TestBed.configureTestingModule({
      imports: [CreateUserComponent],
      providers: [
        { provide: UsersService, useValue: usersServiceSpy },
        importProvidersFrom(BrowserAnimationsModule),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('when the user clicks on the main button', () => {
    it('should open the dialog', () => {
      expect(component.displayDialog()).toBe(false);

      component.addUser();

      expect(component.displayDialog()).toBe(true);
    });
  });

  describe('when the user submits valid data', () => {
    it('should call service method for creating a user with the correct data', () => {
      const userData = {
        name: 'Test User',
        username: 'test@example.com',
        password: 'testpass',
        isAdmin: true,
      };
      component.createUserForm.setValue(userData);
      usersServiceSpy.addUser.mockReturnValue({ subscribe: jest.fn() });

      component.saveUser();

      expect(usersServiceSpy.addUser).toHaveBeenCalledWith(userData);
    });

    it('should close the dialog', () => {
      const userData = {
        name: 'Test User',
        username: 'test@example.com',
        password: 'testpass',
        isAdmin: true,
      };
      component.createUserForm.setValue(userData);
      usersServiceSpy.addUser.mockReturnValue({ subscribe: jest.fn() });

      component.saveUser();

      expect(component.displayDialog()).toBe(false);
    });

    it('should reset the form after successful creation', () => {
      const userData = {
        name: 'Test User',
        username: 'test@example.com',
        password: 'testpass',
        isAdmin: true,
      };
      component.createUserForm.setValue(userData);
      usersServiceSpy.addUser.mockReturnValue({
        subscribe: (handlers: any) => handlers.next({ id: 1, ...userData }),
      });

      component.saveUser();

      expect(component.createUserForm.value).toEqual({
        name: null,
        username: null,
        password: null,
        isAdmin: null,
      });
    });
  });

  describe('when the user submits invalid data', () => {
    it('should NOT call service method for creating a user', () => {
      component.createUserForm.setValue({
        name: '',
        username: '',
        password: '',
        isAdmin: false,
      });

      component.saveUser();

      expect(usersServiceSpy.addUser).not.toHaveBeenCalled();
    });
  });
});

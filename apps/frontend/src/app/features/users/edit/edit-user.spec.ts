import { EditUserComponent } from './edit-user';
import { UsersService } from '../users.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const userData = {
  id: 1,
  name: 'Updated User',
  username: 'updated@example.com',
  password: '',
  isAdmin: true,
};

describe('EditUserComponent', () => {
  let fixture: ComponentFixture<EditUserComponent>;
  let component: EditUserComponent;
  const usersServiceSpy = { updateUser: jest.fn() };

  beforeEach(async () => {
    usersServiceSpy.updateUser.mockClear();

    await TestBed.configureTestingModule({
      imports: [EditUserComponent],
      providers: [
        { provide: UsersService, useValue: usersServiceSpy },
        importProvidersFrom(BrowserAnimationsModule),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditUserComponent);
    fixture.componentRef.setInput('user', userData);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('when the user clicks on the main button', () => {
    it('should open the dialog', () => {
      expect(component.displayDialog()).toBe(false);

      component.editUser();

      expect(component.displayDialog()).toBe(true);
    });

    it('should populate the form with the relevant values from input data', () => {
      component.editUser();

      expect(component.editUserForm.value).toEqual({
        name: userData.name,
        username: userData.username,
        password: '',
        isAdmin: userData.isAdmin,
      });
    });
  });

  describe('when the user submits valid data', () => {
    beforeEach(() => {
      component.editUser();
    });

    it('should call service method for updating a user with the correct data', () => {
      usersServiceSpy.updateUser.mockReturnValue({ subscribe: jest.fn() });

      component.saveUser();

      expect(usersServiceSpy.updateUser).toHaveBeenCalledWith(userData);
    });

    it('should close the dialog', () => {
      usersServiceSpy.updateUser.mockReturnValue({ subscribe: jest.fn() });

      component.saveUser();

      expect(component.displayDialog()).toBe(false);
    });

    it('should reset the form after successful update', () => {
      usersServiceSpy.updateUser.mockReturnValue({
        subscribe: (handlers: any) => handlers.next({ ...userData }),
      });

      component.saveUser();

      expect(component.editUserForm.value).toEqual({
        name: null,
        username: null,
        password: null,
        isAdmin: null,
      });
    });
  });

  describe('when the user submits invalid data', () => {
    it('should NOT call service method for updating a user', () => {
      component.editUserForm.setValue({
        name: '',
        username: '',
        password: '',
        isAdmin: false,
      });

      component.saveUser();

      expect(usersServiceSpy.updateUser).not.toHaveBeenCalled();
    });
  });
});

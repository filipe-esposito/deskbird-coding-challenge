import { EditUserComponent } from './edit-user';
import { UserService } from '../users.service';
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
  const userServiceSpy = { updateUser: jest.fn() };

  beforeEach(async () => {
    userServiceSpy.updateUser.mockClear();

    await TestBed.configureTestingModule({
      imports: [EditUserComponent],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
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
      userServiceSpy.updateUser.mockReturnValue({ subscribe: jest.fn() });

      component.saveUser();

      expect(userServiceSpy.updateUser).toHaveBeenCalledWith(userData);
    });

    it('should close the dialog', () => {
      userServiceSpy.updateUser.mockReturnValue({ subscribe: jest.fn() });

      component.saveUser();

      expect(component.displayDialog()).toBe(false);
    });

    it('should reset the form after successful update', () => {
      userServiceSpy.updateUser.mockReturnValue({
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

      expect(userServiceSpy.updateUser).not.toHaveBeenCalled();
    });
  });
});

import { DeleteUserComponent } from './delete-user';
import { UsersService } from '../users.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('DeleteUserComponent', () => {
  let fixture: ComponentFixture<DeleteUserComponent>;
  let component: DeleteUserComponent;
  const usersServiceSpy = { deleteUser: jest.fn() };

  beforeEach(async () => {
    usersServiceSpy.deleteUser.mockClear();

    await TestBed.configureTestingModule({
      imports: [DeleteUserComponent],
      providers: [
        { provide: UsersService, useValue: usersServiceSpy },
        importProvidersFrom(BrowserAnimationsModule),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('when the user clicks on the main button', () => {
    it('should open the confirmation dialog', () => {
      expect(component.displayDialog()).toBe(false);

      component.confirmDeleteUser();

      expect(component.displayDialog()).toBe(true);
    });
  });

  describe('when the user confirms deletion', () => {
    it('should call service method for deleting the user with the correct id', () => {
      const userId = 42;
      fixture.componentRef.setInput('user', { id: userId, name: 'Test User' });
      usersServiceSpy.deleteUser.mockReturnValue({ subscribe: jest.fn() });

      component.deleteUserConfirmed();

      expect(usersServiceSpy.deleteUser).toHaveBeenCalledWith(userId);
    });

    it('should close the confirmation dialog', () => {
      fixture.componentRef.setInput('user', { id: 42, name: 'Test User' });
      usersServiceSpy.deleteUser.mockReturnValue({ subscribe: jest.fn() });

      component.deleteUserConfirmed();

      expect(component.displayDialog()).toBe(false);
    });
  });

  describe('when the user cancels deletion', () => {
    it('should NOT call service method for deleting the user', () => {
      fixture.componentRef.setInput('user', { id: 42, name: 'Test User' });

      component.cancelDeleteUser();

      expect(usersServiceSpy.deleteUser).not.toHaveBeenCalled();
    });

    it('should close the confirmation dialog', () => {
      fixture.componentRef.setInput('user', { id: 42, name: 'Test User' });
      usersServiceSpy.deleteUser.mockReturnValue({ subscribe: jest.fn() });

      component.cancelDeleteUser();

      expect(component.displayDialog()).toBe(false);
    });
  });
});

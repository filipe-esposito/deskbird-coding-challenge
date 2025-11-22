import { UserListComponent } from './user-list';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  queryElementByTestId,
  queryElementsByTestId,
} from '../../shared/utils/unit-tests';

const mockUsers = [
  { id: 1, name: 'Alice', username: 'alice@example.com', isAdmin: false },
  { id: 2, name: 'Bob', username: 'bob@example.com', isAdmin: true },
];

describe('UserListComponent', () => {
  let fixture: ComponentFixture<UserListComponent>;
  let component: UserListComponent;
  const usersServiceSpy = {
    getUsers: jest.fn(),
  };
  const authServiceSpy = {
    getCurrentUser: jest.fn(),
  };

  beforeEach(async () => {
    usersServiceSpy.getUsers.mockClear();
    authServiceSpy.getCurrentUser.mockClear();

    await TestBed.configureTestingModule({
      imports: [UserListComponent],
      providers: [
        { provide: UsersService, useValue: usersServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        importProvidersFrom(BrowserAnimationsModule),
      ],
    }).compileComponents();
  });

  describe('if the current user is an admin', () => {
    beforeEach(() => {
      authServiceSpy.getCurrentUser.mockReturnValue(() => ({
        id: 42,
        isAdmin: true,
      }));
      usersServiceSpy.getUsers.mockReturnValue(() => mockUsers);

      fixture = TestBed.createComponent(UserListComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('the `Create user` button should be visible', () => {
      fixture.detectChanges();

      const createUserButton = queryElementByTestId(fixture, 'create-user-btn');
      expect(createUserButton).not.toBeNull();
    });

    it('the `Delete user` buttons should be visible', () => {
      fixture.detectChanges();

      const deleteUserButtons = queryElementsByTestId(
        fixture,
        'delete-user-btn'
      );
      expect(deleteUserButtons.length).toBeGreaterThan(0);
    });

    it('the `Edit user` buttons should be visible', () => {
      fixture.detectChanges();

      const editUserButtons = queryElementsByTestId(fixture, 'edit-user-btn');
      expect(editUserButtons.length).toBeGreaterThan(0);
    });
  });

  describe('if the current user is NOT an admin', () => {
    beforeEach(() => {
      authServiceSpy.getCurrentUser.mockReturnValue(() => ({
        id: 42,
        isAdmin: false,
      }));
      usersServiceSpy.getUsers.mockReturnValue(() => mockUsers);

      fixture = TestBed.createComponent(UserListComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('the `Create user` button should NOT be visible', () => {
      fixture.detectChanges();

      const createUserButton = queryElementByTestId(fixture, 'create-user-btn');
      expect(createUserButton).toBeNull();
    });

    it('the `Delete user` buttons should NOT be visible', () => {
      fixture.detectChanges();

      const deleteUserButtons = queryElementsByTestId(
        fixture,
        'delete-user-btn'
      );
      expect(deleteUserButtons.length).toBe(0);
    });

    it('the `Edit user` buttons should NOT be visible', () => {
      fixture.detectChanges();

      const editUserButtons = queryElementsByTestId(fixture, 'edit-user-btn');
      expect(editUserButtons.length).toBe(0);
    });
  });

  it('the `Delete user` button should not be visible on the user list for the list item related to the current user', () => {
    const currentUser = {
      id: 2,
      isAdmin: true,
    };
    authServiceSpy.getCurrentUser.mockReturnValue(() => currentUser);
    usersServiceSpy.getUsers.mockReturnValue(() => mockUsers);
    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const deleteUserButtons = queryElementsByTestId(fixture, 'delete-user-btn');

    expect(deleteUserButtons.length).toBe(mockUsers.length - 1);
  });

  describe('should display the correct role label for users', () => {
    it('when a user from the list is an admin', () => {
      const currentUser = {
        id: 1,
        isAdmin: true,
      };
      authServiceSpy.getCurrentUser.mockReturnValue(() => currentUser);
      usersServiceSpy.getUsers.mockReturnValue(() => mockUsers);
      fixture = TestBed.createComponent(UserListComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      const result = component.displayUserRole(true);

      expect(result).toBe('Admin');
    });

    it('when a user from the list is NOT an admin', () => {
      const currentUser = {
        id: 1,
        isAdmin: false,
      };
      authServiceSpy.getCurrentUser.mockReturnValue(() => currentUser);
      usersServiceSpy.getUsers.mockReturnValue(() => mockUsers);
      fixture = TestBed.createComponent(UserListComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      const result = component.displayUserRole(false);

      expect(result).toBe('Regular');
    });
  });
});

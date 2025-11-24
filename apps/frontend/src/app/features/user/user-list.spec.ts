import { UserListComponent } from './user-list';
import { UserService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  queryElementByTestId,
  queryElementsByTestId,
} from '../../shared/utils/unit-tests';
import { IUser } from '@deskbird-coding-challenge/shared-lib';

const mockUsers: IUser[] = [
  { id: 1, name: 'Alice', username: 'alice@example.com', isAdmin: false },
  { id: 2, name: 'Bob', username: 'bob@example.com', isAdmin: true },
];

const userServiceSpy = {
  getUsers: jest.fn(),
};
const authServiceSpy = {
  getCurrentUser: jest.fn(),
};

describe('UserListComponent', () => {
  let fixture: ComponentFixture<UserListComponent>;
  let component: UserListComponent;

  beforeEach(async () => {
    userServiceSpy.getUsers.mockClear();
    authServiceSpy.getCurrentUser.mockClear();

    await TestBed.configureTestingModule({
      imports: [UserListComponent],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        importProvidersFrom(BrowserAnimationsModule),
      ],
    }).compileComponents();
  });

  describe('if the current user is an admin', () => {
    beforeEach(() => {
      fixture = configureFixtureWithCurrentUser({
        id: 42,
        isAdmin: true,
      });
      component = fixture.componentInstance;
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
      fixture = configureFixtureWithCurrentUser({
        id: 42,
        isAdmin: false,
      });
      component = fixture.componentInstance;
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
    fixture = configureFixtureWithCurrentUser({
      id: 2,
      isAdmin: true,
    });
    component = fixture.componentInstance;

    const deleteUserButtons = queryElementsByTestId(fixture, 'delete-user-btn');

    expect(deleteUserButtons.length).toBe(mockUsers.length - 1);
  });

  describe('should display the correct role label for users', () => {
    it('when a user from the list is an admin', () => {
      fixture = configureFixtureWithCurrentUser({
        id: 1,
        isAdmin: true,
      });
      component = fixture.componentInstance;

      const result = component.displayUserRole(true);

      expect(result).toBe('Admin');
    });

    it('when a user from the list is NOT an admin', () => {
      fixture = configureFixtureWithCurrentUser({
        id: 1,
        isAdmin: false,
      });
      component = fixture.componentInstance;

      const result = component.displayUserRole(false);

      expect(result).toBe('Regular');
    });
  });
});

function configureFixtureWithCurrentUser(
  currentUser: IUser
): ComponentFixture<UserListComponent> {
  authServiceSpy.getCurrentUser.mockReturnValue(() => currentUser);
  userServiceSpy.getUsers.mockReturnValue(() => mockUsers);
  const fixture = TestBed.createComponent(UserListComponent);
  fixture.detectChanges();

  return fixture;
}

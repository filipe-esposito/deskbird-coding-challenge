import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { UserService } from './users.service';
import { IUser } from '@deskbird-coding-challenge/shared-lib';
import { BASE_API_URL } from '../../app.config';

// TODO add NgRx to the `user` feature and update unit tests accordingly
describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  const usersApiUrl = `${BASE_API_URL}/users`;

  const mockUsers: IUser[] = [
    { id: 1, name: 'John Doe', username: 'john@example.com', isAdmin: true },
    { id: 2, name: 'Jane Smith', username: 'jane@example.com', isAdmin: true },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);

    // Flush the initial GET request from constructor
    const req = httpMock.expectOne(usersApiUrl);
    req.flush(mockUsers);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch users on initialization', () => {
    const users = service.getUsers();

    expect(users()).toEqual(mockUsers);
  });

  describe('when creating a new user', () => {
    it('should add a new user and refresh the list', () => {
      const newUser: IUser = {
        id: 3,
        name: 'New User',
        username: 'new@example.com',
        isAdmin: true,
      };
      const updatedUsers = [...mockUsers, newUser];

      service.addUser(newUser);

      const postReq = httpMock.expectOne(usersApiUrl);
      expect(postReq.request.method).toBe('POST');
      expect(postReq.request.body).toEqual(newUser);
      postReq.flush(newUser);
      const getReq = httpMock.expectOne(usersApiUrl);
      expect(getReq.request.method).toBe('GET');
      getReq.flush(updatedUsers);
      expect(service.getUsers()()).toEqual(updatedUsers);
    });
  });

  describe('when updating an existing user', () => {
    it('should send a PATCH request and refresh the list', () => {
      const updatedUser: IUser = {
        id: 1,
        name: 'John Updated',
        username: 'john@example.com',
        isAdmin: true,
      };
      const updatedUsers = [updatedUser, mockUsers[1]];

      service.updateUser(updatedUser);

      const patchReq = httpMock.expectOne(`${usersApiUrl}/${updatedUser.id}`);
      expect(patchReq.request.method).toBe('PATCH');
      expect(patchReq.request.body).toEqual(updatedUser);
      patchReq.flush(updatedUser);
      const getReq = httpMock.expectOne(usersApiUrl);
      expect(getReq.request.method).toBe('GET');
      getReq.flush(updatedUsers);
      expect(service.getUsers()()).toEqual(updatedUsers);
    });
  });

  describe('when deleting a user', () => {
    it('should send a DELETE request to the correct URL and refresh the user list', () => {
      const userIdToDelete = 1;
      const remainingUsers = [mockUsers[1]];

      service.deleteUser(userIdToDelete);

      const deleteReq = httpMock.expectOne(`${usersApiUrl}/${userIdToDelete}`);
      expect(deleteReq.request.method).toBe('DELETE');
      deleteReq.flush(null);
      const getReq = httpMock.expectOne(usersApiUrl);
      expect(getReq.request.method).toBe('GET');
      getReq.flush(remainingUsers);
      expect(service.getUsers()()).toEqual(remainingUsers);
    });
  });
});

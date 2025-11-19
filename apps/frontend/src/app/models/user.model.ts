// TODO replace with interfaces from shared-lib

export interface IUser {
  id?: number;
  name?: string;
  username?: string;
  password?: string;
  role?: UserRole;
}

export enum UserRole {
  ADMIN = 'Admin',
  REGULAR = 'Regular',
}

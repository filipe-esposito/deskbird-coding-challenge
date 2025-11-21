import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { IUser } from '@deskbird-coding-challenge/shared-lib';

const userFromStorage: string | null = localStorage.getItem('user');
const initialUser: IUser | null = userFromStorage
  ? JSON.parse(userFromStorage)
  : null;

export interface AuthState {
  user: IUser | null;
}

export const initialState: AuthState = {
  user: initialUser,
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.login, (state, { user }) => ({ ...state, user })),
  on(AuthActions.logout, (state) => ({ ...state, user: null })),
  on(AuthActions.sessionLoaded, (state, { user }) => ({ ...state, user }))
);

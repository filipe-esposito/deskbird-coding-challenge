import { createAction, props } from '@ngrx/store';
import { IUser } from '../../../shared/models/user.model';

export const login = createAction('[Auth] Login', props<{ user: IUser }>());

export const logout = createAction('[Auth] Logout');

export const loadSession = createAction('[Auth] Load Session');

export const sessionLoaded = createAction(
  '[Auth] Session Loaded',
  props<{ user: IUser | null }>()
);

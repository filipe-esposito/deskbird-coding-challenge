import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AuthState } from './auth.reducers';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectAuthUser = createSelector(
  selectAuthState,
  (state) => state.user
);

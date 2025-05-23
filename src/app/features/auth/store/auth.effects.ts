import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as AuthActions from './auth.actions';
import {AuthApi} from '../services/auth.api';

@Injectable()
export class AuthEffects {
    constructor(private actions$: Actions) { }

    login$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.login),
            mergeMap((action) =>
                from(AuthApi.login(action.email, action.password)).pipe(
                    map((response) => {
                        // Stocker le token après succès
                        if (response.data.token) {
                            localStorage.setItem('auth_token', response.data.token);
                        }
                        return AuthActions.loginSuccess({ user: response.data });
                    }),
                    catchError((error) => {
                        console.error('Login error:', error);
                        const errorMessage = error.response?.data?.message || error.message || 'Erreur de connexion';
                        return of(AuthActions.loginFailure({ error: errorMessage }));
                    })
                )
            )
        )
    );

    register$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.register),
            mergeMap((action) =>
                from(AuthApi.register(action.userData)).pipe(
                    map((response) => {
                        console.log('Registration success:', response.data);
                        return AuthActions.registerSuccess({ user: response.data.response });
                    }),
                    catchError((error) => {
                        console.error('Registration error:', error);
                        const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de l\'inscription';
                        return of(AuthActions.registerFailure({ error: errorMessage }));
                    })
                )
            )
        )
    );

    logout$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.logout),
            mergeMap(() =>
                from(AuthApi.logout()).pipe(
                    map(() => {
                        localStorage.removeItem('auth_token');
                        localStorage.removeItem('is_admin');
                        return AuthActions.logoutSuccess();
                    }),
                    catchError((error) => {
                        console.error('Logout error:', error);
                        // Même en cas d'erreur, on supprime le token local
                        localStorage.removeItem('auth_token');
                        localStorage.removeItem('is_admin');
                        return of(AuthActions.logoutFailure({ error: error.message }));
                    })
                )
            )
        )
    );
}
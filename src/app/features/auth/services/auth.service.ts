import { Injectable } from "@angular/core"
import { BehaviorSubject, type Observable, of } from "rxjs"
import { Store } from '@ngrx/store';
import axios from 'axios';
import * as AuthActions from '../store/auth.actions';
import { Actions } from '@ngrx/effects';
import { selectCurrentUser } from "../store/auth.selectors";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken())
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable()

  constructor(private store: Store) {
    // Écouter les changements d'état d'authentification
    this.store.select(selectCurrentUser).subscribe(user => {
      this.isAuthenticatedSubject.next(!!user);
    });
  }

  // Les méthodes suivantes déclenchent les actions NgRx
  login(email: string, password: string) {
    this.store.dispatch(AuthActions.login({ email, password }));
  }

  register(userData: any) {
    this.store.dispatch(AuthActions.register({ userData }));
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('is_admin');
    this.isAuthenticatedSubject.next(false);
    this.store.dispatch(AuthActions.logout());
  }

  private hasToken(): boolean {
    return !!localStorage.getItem("auth_token")
  }

  isLoggedIn(): boolean {
    return this.hasToken()
  }

  isAdmin(): boolean {
    return localStorage.getItem('is_admin') === 'true';
  }
}

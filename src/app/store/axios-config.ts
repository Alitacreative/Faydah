// src/app/core/axios-config.ts
import axios from 'axios';
import { environment } from '../../environments/environment';
import * as AuthActions from '../features/auth/store/auth.actions';

let isRedirecting = false; // Flag pour éviter les boucles

export function configureAxios(store: any) {
  axios.defaults.baseURL = environment.apiUrl;

  axios.interceptors.request.use(config => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  axios.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 401 && !isRedirecting) {
        isRedirecting = true;
        localStorage.removeItem('auth_token');
        localStorage.removeItem('is_admin');
        // store.dispatch(AuthActions.logout());
        
        // Réinitialiser le flag après un délai
        setTimeout(() => {
          isRedirecting = false;
        }, 1000);
      }
      return Promise.reject(error);
    }
  );
}



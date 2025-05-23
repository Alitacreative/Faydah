import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { configureAxios } from '../store/axios-config';

/**
 * Fonction appelée au démarrage de l'application pour configurer Axios.
 */
export function axiosInitializer(): () => void {
  return () => {
    const store = inject(Store);
    configureAxios(store);
  };
}


/**
 * @author Dr_EPL
 * @summary "Initialisation d'Axios avec NgRx"
 * @copyright 2025
 */
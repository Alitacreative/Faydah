import { AuthState } from "../features/auth/store/auth.state";

// Interface représentant l'état global de l'application
export interface AppState {
  auth: AuthState;
  // Ajoutez ici d'autres états pour d'autres fonctionnalités
  // Exemple :
  // user: UserState;
  // products: ProductsState;
}
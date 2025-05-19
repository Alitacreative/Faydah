export interface User {
  id: number; // <-- ajoute ceci
  nom: string;
  prenom: string;
  age: number;
  sexe: string;
  role: string;
  dahira: string;
  position: {
    lat: number;
    lng: number;
  };
}

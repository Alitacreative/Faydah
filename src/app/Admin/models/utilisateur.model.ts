export interface User {
    id: number;
    nom: string;
    prenom: string;
    age: number;
    sexe: 'homme' | 'femme';
    role: string;
    dahira: string;
    position: {
      lat: number;
      lng: number;
    };
  }
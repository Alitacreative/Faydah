export interface Tourisme {
  id?: string;
  title: string;
  location: string;
  description: string;
  image: string;
  duration: string;
  participants: number;
  date: string;
  category: 'Religieux' | 'Culturel' | 'Retraite' | 'Pèlerinage';
  status: 'En cours' | 'Terminé' | 'À venir';
}

export interface Participant {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'Disciple' | 'Moukhadam' | 'Visiteur';
}
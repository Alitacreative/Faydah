import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/utilisateur.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // Source de données pour les utilisateurs
  private usersSubject = new BehaviorSubject<User[]>([]);
  public users$ = this.usersSubject.asObservable();
  
  // Source de données pour les filtres appliqués
  private filtersSubject = new BehaviorSubject<any>({});
  public filters$ = this.filtersSubject.asObservable();

  constructor() {
    // Initialiser avec des données de test
    this.fetchUsers();
  }

  // Simuler une requête API
  private fetchUsers() {
    // Données de test
    const mockUsers: User[] = [
      {
        id: 1,
        nom: 'Diop',
        prenom: 'Moussa',
        age: 28,
        sexe: 'homme',
        role: 'admin',
        dahira: 'Touba',
        position: { lat: 14.7645, lng: -17.3660 }
      },
      {
        id: 2,
        nom: 'Fall',
        prenom: 'Aissatou',
        age: 24,
        sexe: 'femme',
        role: 'membre',
        dahira: 'Tivaouane',
        position: { lat: 14.7565, lng: -17.3860 }
      },
      {
        id: 3,
        nom: 'Ndiaye',
        prenom: 'Amadou',
        age: 35,
        sexe: 'homme',
        role: 'moderateur',
        dahira: 'Medina Baye',
        position: { lat: 14.7745, lng: -17.3960 }
      },
      {
        id: 4,
        nom: 'Sow',
        prenom: 'Fatou',
        age: 22,
        sexe: 'femme',
        role: 'membre',
        dahira: 'Touba',
        position: { lat: 14.7545, lng: -17.3560 }
      },
      {
        id: 5,
        nom: 'Ba',
        prenom: 'Omar',
        age: 40,
        sexe: 'homme',
        role: 'admin',
        dahira: 'Tivaouane',
        position: { lat: 14.7845, lng: -17.3360 }
      }
    ];

    this.usersSubject.next(mockUsers);
  }

  // Obtenir tous les utilisateurs
  getAllUsers(): Observable<User[]> {
    return this.users$;
  }

  // Appliquer des filtres aux utilisateurs
  applyFilters(filters: any) {
    this.filtersSubject.next(filters);
  }

  // Obtenir les utilisateurs filtrés
  getFilteredUsers(): Observable<User[]> {
    return new Observable<User[]>(observer => {
      // S'abonner aux utilisateurs et aux filtres
      const usersSub = this.users$.subscribe(users => {
        const filtersSub = this.filters$.subscribe(filters => {
          // Appliquer les filtres
          let filteredUsers = [...users];
          
          if (filters.role) {
            filteredUsers = filteredUsers.filter(user => user.role === filters.role);
          }
          
          if (filters.sexe) {
            filteredUsers = filteredUsers.filter(user => user.sexe === filters.sexe);
          }
          
          if (filters.dahira) {
            filteredUsers = filteredUsers.filter(user => user.dahira === filters.dahira);
          }
          
          if (filters.ageMin !== undefined) {
            filteredUsers = filteredUsers.filter(user => user.age >= filters.ageMin);
          }
          
          if (filters.ageMax !== undefined) {
            filteredUsers = filteredUsers.filter(user => user.age <= filters.ageMax);
          }
          
          observer.next(filteredUsers);
        });
        
        return () => {
          filtersSub.unsubscribe();
        };
      });
      
      return () => {
        usersSub.unsubscribe();
      };
    });
  }
}
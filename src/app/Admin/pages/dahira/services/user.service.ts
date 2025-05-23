import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
//   private apiUrl = `${environment.apiUrl}/users`;
  
  // Données mockées pour le développement
  private mockUsers: User[] = Array(20).fill(null).map((_, i) => ({
    id: `user-${i + 1}`,
    firstName: `Prénom${i + 1}`,
    lastName: `Nom${i + 1}`,
    email: `user${i + 1}@example.com`,
    phoneNumber: `+2217${i}${i}${i}${i}${i}${i}${i}`,
    dahiraId: i < 10 ? `dahira-${i % 3 + 1}` : undefined,
    createdAt: new Date(),
    updatedAt: new Date()
  }));

  constructor(private http: HttpClient) {}

  // Obtenir tous les utilisateurs sans Dahira (pour l'ajout de membres)
  getUsersWithoutDahira(search: string = ''): Observable<User[]> {
    // Pour la démo
    let filteredUsers = this.mockUsers.filter(u => !u.dahiraId);
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredUsers = filteredUsers.filter(
        u => u.firstName.toLowerCase().includes(searchLower) || 
             u.lastName.toLowerCase().includes(searchLower) ||
             u.email.toLowerCase().includes(searchLower)
      );
    }
    
    return of(filteredUsers);
    
    // Dans une vraie implémentation :
    // return this.http.get<User[]>(`${this.apiUrl}/without-dahira?search=${search}`);
  }

  // Obtenir un utilisateur par ID
  getUserById(id: string): Observable<User> {
    // Pour la démo
    const user = this.mockUsers.find(u => u.id === id);
    return of(user as User);
    
    // Dans une vraie implémentation :
    // return this.http.get<User>(`${this.apiUrl}/${id}`);
  }
}
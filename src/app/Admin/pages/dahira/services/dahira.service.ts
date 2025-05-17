import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Dahira, DahiraMember, MemberRole } from '../models/dahira.model';

@Injectable({
  providedIn: 'root'
})
export class DahiraService {
//   private apiUrl = `${environment.apiUrl}/dahiras`;
  private dahirasSubject = new BehaviorSubject<Dahira[]>([]);
  public dahiras$ = this.dahirasSubject.asObservable();
  
  // Données mockées pour le développement
  private mockDahiras: Dahira[] = Array(12).fill(null).map((_, i) => ({
    id: `dahira-${i + 1}`,
    name: `Dahira Mouhamadou Mourtada ${i + 1}`,
    memberCount: 160,
    location: `Location ${i + 1}`,
    createdAt: new Date(),
    updatedAt: new Date()
  }));

  constructor(private http: HttpClient) {
    // Initialiser avec les données mockées
    this.dahirasSubject.next(this.mockDahiras);
  }

  // Obtenir tous les Dahiras (paginés)
  getDahiras(page: number = 1, limit: number = 10, search: string = '', filters: any = {}): Observable<{ dahiras: Dahira[], total: number }> {
    // Pour la démo, nous filtrons les données mockées
    let filteredDahiras = [...this.mockDahiras];
    
    // Appliquer la recherche
    if (search) {
      const searchLower = search.toLowerCase();
      filteredDahiras = filteredDahiras.filter(
        d => d.name.toLowerCase().includes(searchLower)
      );
    }
    
    // Appliquer les filtres (à implémenter selon les besoins)
    
    // Calculer la pagination
    const total = filteredDahiras.length;
    const startIndex = (page - 1) * limit;
    const paginatedDahiras = filteredDahiras.slice(startIndex, startIndex + limit);
    
    return of({ dahiras: paginatedDahiras, total });
    
    // Dans une vraie implémentation, utilisez HTTP :
    // return this.http.get<{ dahiras: Dahira[], total: number }>
    //   (`${this.apiUrl}?page=${page}&limit=${limit}&search=${search}`);
  }

  // Obtenir un Dahira par ID
  getDahiraById(id: string): Observable<Dahira> {
    // Pour la démo, nous utilisons les données mockées
    const dahira = this.mockDahiras.find(d => d.id === id);
    return of(dahira as Dahira);
    
    // Dans une vraie implémentation :
    // return this.http.get<Dahira>(`${this.apiUrl}/${id}`);
  }

  // Obtenir les membres d'un Dahira
  getDahiraMembers(dahiraId: string): Observable<DahiraMember[]> {
    // Simuler des membres pour la démo
    const mockMembers: DahiraMember[] = Array(10).fill(null).map((_, i) => ({
      userId: `user-${i + 1}`,
      dahiraId,
      user: {
        id: `user-${i + 1}`,
        firstName: `Prénom${i + 1}`,
        lastName: `Nom${i + 1}`,
        email: `user${i + 1}@example.com`,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      role: i === 0 ? MemberRole.RESPONSIBLE : 
            i < 3 ? MemberRole.MOUKHADAM : MemberRole.DISCIPLE,
      joinedAt: new Date()
    }));
    
    return of(mockMembers);
    
    // Dans une vraie implémentation :
    // return this.http.get<DahiraMember[]>(`${this.apiUrl}/${dahiraId}/members`);
  }

  // Créer un nouveau Dahira
  createDahira(dahira: Partial<Dahira>): Observable<Dahira> {
    // Pour la démo
    const newDahira: Dahira = {
      id: `dahira-${this.mockDahiras.length + 1}`,
      name: dahira.name || '',
      memberCount: 0,
      location: dahira.location,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.mockDahiras.push(newDahira);
    this.dahirasSubject.next([...this.mockDahiras]);
    
    return of(newDahira);
    
    // Dans une vraie implémentation :
    // return this.http.post<Dahira>(this.apiUrl, dahira).pipe(
    //   tap(newDahira => {
    //     const currentDahiras = this.dahirasSubject.value;
    //     this.dahirasSubject.next([...currentDahiras, newDahira]);
    //   })
    // );
  }

  // Mettre à jour un Dahira
  updateDahira(id: string, changes: Partial<Dahira>): Observable<Dahira> {
    // Pour la démo
    const index = this.mockDahiras.findIndex(d => d.id === id);
    if (index !== -1) {
      this.mockDahiras[index] = {
        ...this.mockDahiras[index],
        ...changes,
        updatedAt: new Date()
      };
      this.dahirasSubject.next([...this.mockDahiras]);
      return of(this.mockDahiras[index]);
    }
    
    // Dans une vraie implémentation :
    // return this.http.put<Dahira>(`${this.apiUrl}/${id}`, changes).pipe(
    //   tap(updatedDahira => {
    //     const currentDahiras = this.dahirasSubject.value;
    //     const index = currentDahiras.findIndex(d => d.id === id);
    //     if (index !== -1) {
    //       currentDahiras[index] = updatedDahira;
    //       this.dahirasSubject.next([...currentDahiras]);
    //     }
    //   })
    // );
    
    return of({} as Dahira);
  }

  // Supprimer un Dahira
  deleteDahira(id: string): Observable<boolean> {
    // Pour la démo
    const index = this.mockDahiras.findIndex(d => d.id === id);
    if (index !== -1) {
      this.mockDahiras.splice(index, 1);
      this.dahirasSubject.next([...this.mockDahiras]);
      return of(true);
    }
    
    // Dans une vraie implémentation :
    // return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
    //   map(() => {
    //     const currentDahiras = this.dahirasSubject.value;
    //     this.dahirasSubject.next(currentDahiras.filter(d => d.id !== id));
    //     return true;
    //   })
    // );
    
    return of(false);
  }

  // Ajouter un membre à un Dahira
  addMemberToDahira(dahiraId: string, userId: string, role: MemberRole): Observable<boolean> {
    // Dans une vraie implémentation :
    // return this.http.post<void>(`${this.apiUrl}/${dahiraId}/members`, { userId, role }).pipe(
    //   map(() => true)
    // );
    
    return of(true);
  }

  // Retirer un membre d'un Dahira
  removeMemberFromDahira(dahiraId: string, userId: string): Observable<boolean> {
    // Dans une vraie implémentation :
    // return this.http.delete<void>(`${this.apiUrl}/${dahiraId}/members/${userId}`).pipe(
    //   map(() => true)
    // );
    
    return of(true);
  }
}
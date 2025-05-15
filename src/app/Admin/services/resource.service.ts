import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Resource } from '../pages/ressources/models/resource.model';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {
  private resources: Resource[] = [
    {
      id: '1',
      title: 'Conférence sur le développement personnel',
      description: 'Enregistrement de la conférence donnée par Dr. Ahmed sur le développement personnel.',
      type: 'Conférences',
      dateAdded: '25 mars 2025'
    },
    {
      id: '2',
      title: 'Conférence sur le développement personnel',
      description: 'Enregistrement de la conférence donnée par Dr. Ahmed sur le développement personnel.',
      type: 'Conférences',
      dateAdded: '25 mars 2025'
    },
    {
      id: '3',
      title: 'Conférence sur le développement personnel',
      description: 'Enregistrement de la conférence donnée par Dr. Ahmed sur le développement personnel.',
      type: 'Conférences',
      dateAdded: '25 mars 2025'
    },
    {
      id: '4',
      title: 'Conférence sur le développement personnel',
      description: 'Enregistrement de la conférence donnée par Dr. Ahmed sur le développement personnel.',
      type: 'Conférences',
      dateAdded: '25 mars 2025'
    },
    {
      id: '5',
      title: 'Conférence sur le développement personnel',
      description: 'Enregistrement de la conférence donnée par Dr. Ahmed sur le développement personnel.',
      type: 'Conférences',
      dateAdded: '25 mars 2025'
    },
    {
      id: '6',
      title: 'Conférence sur le développement personnel',
      description: 'Enregistrement de la conférence donnée par Dr. Ahmed sur le développement personnel.',
      type: 'Conférences',
      dateAdded: '25 mars 2025'
    }
  ];

  private resourcesSubject = new BehaviorSubject<Resource[]>(this.resources);
  private currentFilterSubject = new BehaviorSubject<string>('Toutes');

  constructor() {}

  getResources(): Observable<Resource[]> {
    return this.resourcesSubject.asObservable();
  }

  getCurrentFilter(): Observable<string> {
    return this.currentFilterSubject.asObservable();
  }

  filterResources(filter: string): void {
    this.currentFilterSubject.next(filter);
    
    if (filter === 'Toutes') {
      this.resourcesSubject.next(this.resources);
    } else {
      const filteredResources = this.resources.filter(resource => resource.type === filter);
      this.resourcesSubject.next(filteredResources);
    }
  }

  addResource(resource: Resource): void {
    this.resources.push(resource);
    this.filterResources(this.currentFilterSubject.value);
  }
}
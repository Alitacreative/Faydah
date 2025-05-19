import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Resource } from '../model/resource.model';

@Injectable({
  providedIn: 'root'
})
export class ResourcesService {
  // Mock data - dans un vrai scénario, cela viendrait du backend
  private resources: Resource[] = [
    {
      id: '1',
      title: 'Conférence sur le développement personnel',
      description: 'Enregistrement de la conférence donnée par Dr. Ahmed sur le développement personnel.',
      category: 'Conférences',
      dateAdded: '25 mars 2025',
      author: 'Dr. Ahmed',
      fileType: 'video',
      fileUrl: 'assets/videos/conference1.mp4'
    },
    {
      id: '2',
      title: 'Conférence sur le développement personnel',
      description: 'Enregistrement de la conférence donnée par Dr. Ahmed sur le développement personnel.',
      category: 'Conférences',
      dateAdded: '25 mars 2025',
      author: 'Dr. Ahmed',
      fileType: 'video',
      fileUrl: 'assets/videos/conference2.mp4'
    },
    {
      id: '3',
      title: 'Conférence sur le développement personnel',
      description: 'Enregistrement de la conférence donnée par Dr. Ahmed sur le développement personnel.',
      category: 'Conférences',
      dateAdded: '25 mars 2025',
      author: 'Dr. Ahmed',
      fileType: 'audio',
      fileUrl: 'assets/audios/conference3.mp3'
    },
    {
      id: '4',
      title: 'Conférence sur le développement personnel',
      description: 'Enregistrement de la conférence donnée par Dr. Ahmed sur le développement personnel.',
      category: 'Conférences',
      dateAdded: '25 mars 2025',
      author: 'Dr. Ahmed',
      fileType: 'pdf',
      fileUrl: 'assets/pdfs/conference4.pdf'
    },
    {
      id: '5',
      title: 'Conférence sur le développement personnel',
      description: 'Enregistrement de la conférence donnée par Dr. Ahmed sur le développement personnel.',
      category: 'Conférences',
      dateAdded: '25 mars 2025',
      author: 'Dr. Ahmed',
      fileType: 'image',
      fileUrl: 'assets/images/conference5.jpg'
    },
    {
      id: '6',
      title: 'Conférence sur le développement personnel',
      description: 'Enregistrement de la conférence donnée par Dr. Ahmed sur le développement personnel.',
      category: 'Conférences',
      dateAdded: '25 mars 2025',
      author: 'Dr. Ahmed',
      fileType: 'video',
      fileUrl: 'assets/videos/conference6.mp4'
    }
  ];

  private resourcesSubject = new BehaviorSubject<Resource[]>(this.resources);
  private selectedCategorySubject = new BehaviorSubject<string>('Toutes');

  constructor() {}

  getResources(): Observable<Resource[]> {
    return this.resourcesSubject.asObservable();
  }

  getSelectedCategory(): Observable<string> {
    return this.selectedCategorySubject.asObservable();
  }

  setSelectedCategory(category: string): void {
    this.selectedCategorySubject.next(category);
    this.filterResources(category);
  }

  private filterResources(category: string): void {
    if (category === 'Toutes') {
      this.resourcesSubject.next(this.resources);
    } else {
      const filtered = this.resources.filter(res => res.category === category);
      this.resourcesSubject.next(filtered);
    }
  }

  getResourceById(id: string): Resource | undefined {
    return this.resources.find(res => res.id === id);
  }

  addResource(resource: Omit<Resource, 'id'>): void {
    const newResource: Resource = {
      ...resource,
      id: (this.resources.length + 1).toString()
    };
    
    this.resources.push(newResource);
    this.filterResources(this.selectedCategorySubject.value);
  }

  updateResource(id: string, updatedResource: Partial<Resource>): void {
    const index = this.resources.findIndex(res => res.id === id);
    if (index !== -1) {
      this.resources[index] = { ...this.resources[index], ...updatedResource };
      this.filterResources(this.selectedCategorySubject.value);
    }
  }

  deleteResource(id: string): void {
    this.resources = this.resources.filter(res => res.id !== id);
    this.filterResources(this.selectedCategorySubject.value);
  }

  searchResources(term: string): void {
    if (!term.trim()) {
      this.filterResources(this.selectedCategorySubject.value);
      return;
    }
    
    const filtered = this.resources.filter(res => {
      return res.title.toLowerCase().includes(term.toLowerCase()) || 
             res.description.toLowerCase().includes(term.toLowerCase());
    });
    
    this.resourcesSubject.next(filtered);
  }
}
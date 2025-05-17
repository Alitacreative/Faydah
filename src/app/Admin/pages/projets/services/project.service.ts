

// src/app/services/project.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Project } from '../models/projet.model';

@Injectable({
    providedIn: 'root'
})
export class ProjectService {
    private projects: Project[] = [
        {
            id: '1',
            title: 'Rénovation du centre',
            description: 'Travaux de rénovation du centre communautaire incluant peinture, électricité et plomberie.',
            status: 'en_cours',
            progress: 75,
            dueDate: new Date('2025-06-30'),
            contributors: [
                { id: '1', name: 'Marie Dupont', amount: 1200, date: new Date('2025-01-15') },
                { id: '2', name: 'Jean Martin', amount: 850, date: new Date('2025-01-20') }
            ]
        },
        {
            id: '2',
            title: 'Bibliothèque numérique',
            description: 'Création d\'une bibliothèque numérique de ressources spirituelles et éducatives.',
            status: 'termine',
            progress: 100,
            dueDate: new Date('2025-06-30'),
            contributors: [
                { id: '3', name: 'Sophie Laurent', amount: 500, date: new Date('2025-02-10') },
                { id: '4', name: 'Thomas Petit', amount: 350, date: new Date('2025-02-12') }
            ]
        },
        {
            id: '3',
            title: 'Rénovation du centre',
            description: 'Travaux de rénovation du centre communautaire incluant peinture, électricité et plomberie.',
            status: 'en_cours',
            progress: 75,
            dueDate: new Date('2025-06-30'),
            contributors: []
        },
        {
            id: '4',
            title: 'Rénovation du centre',
            description: 'Travaux de rénovation du centre communautaire incluant peinture, électricité et plomberie.',
            status: 'en_attente',
            progress: 75,
            dueDate: new Date('2025-06-30'),
            contributors: []
        },
        {
            id: '5',
            title: 'Rénovation du centre',
            description: 'Travaux de rénovation du centre communautaire incluant peinture, électricité et plomberie.',
            status: 'en_cours',
            progress: 75,
            dueDate: new Date('2025-06-30'),
            contributors: []
        },
        {
            id: '6',
            title: 'Rénovation du centre',
            description: 'Travaux de rénovation du centre communautaire incluant peinture, électricité et plomberie.',
            status: 'en_cours',
            progress: 75,
            dueDate: new Date('2025-06-30'),
            contributors: []
        }
    ];

    private projectsSubject = new BehaviorSubject<Project[]>(this.projects);

    getProjects(): Observable<Project[]> {
        return this.projectsSubject.asObservable();
    }

    getProjectById(id: string): Project | undefined {
        return this.projects.find(p => p.id === id);
    }

    addProject(project: Project): void {
        project.id = Date.now().toString();
        this.projects.push(project);
        this.projectsSubject.next([...this.projects]);
    }

    updateProject(project: Project): void {
        const index = this.projects.findIndex(p => p.id === project.id);
        if (index !== -1) {
            this.projects[index] = { ...project };
            this.projectsSubject.next([...this.projects]);
        } 
    }

    changeStatus(id: string, status: 'en_cours' | 'en_attente' | 'termine'): void {
        const index = this.projects.findIndex(p => p.id === id);
        if (index !== -1) {
            this.projects[index].status = status;
            this.projectsSubject.next([...this.projects]);  
        }
    }

    archiveProject(id: string): void {
        // Dans une vraie application, vous pourriez avoir une propriété 'archived' ou déplacer vers un autre tableau
        const index = this.projects.findIndex(p => p.id === id);
        if (index !== -1) {
            this.projects.splice(index, 1);
            this.projectsSubject.next([...this.projects]);
        }
    }
}
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Participant, Tourisme } from '../models/tourisme.model';



@Injectable({
  providedIn: 'root'
})
export class EventService {
  private events: Tourisme[] = [
    {
      id: '1',
      title: "Mosquée Hassan II",
      location: "Casablanca, Maroc",
      description: "Une des plus grandes mosquées du monde avec un minaret de 210 mètres de hauteur.",
      image: "assets/images/1.png",
      duration: "1 jour",
      participants: 25,
      date: "15-16 juin 2025",
      category: "Religieux",
      status: "À venir"
    },
    {
      id: '2',
      title: "Médina de Fès",
      location: "Fès, Maroc",
      description: "La plus ancienne médina du monde, un labyrinthe de ruelles et d'artisanat traditionnel.",
      image: "assets/images/1.png",
      duration: "3 jours",
      participants: 18,
      date: "20-23 juillet 2025",
      category: "Culturel",
      status: "À venir"
    },
    {
      id: '3',
      title: "Retraite spirituelle dans l'Atlas",
      location: "Montagnes de l'Atlas, Maroc",
      description: "Une retraite de méditation et de développement spirituel dans un cadre naturel exceptionnel.",
      image: "assets/images/1.png",
      duration: "5 jours",
      participants: 12,
      date: "5-10 août 2025",
      category: "Retraite",
      status: "À venir"
    },
    {
      id: '4',
      title: "Zaouïa de Moulay Idriss",
      location: "Moulay Idriss, Maroc",
      description: "Un important lieu de pèlerinage et centre spirituel au Maroc.",
      image: "assets/images/1.png",
      duration: "2 jours",
      participants: 20,
      date: "25-27 août 2025",
      category: "Pèlerinage",
      status: "À venir"
    },
    {
      id: '5',
      title: "Vallée du Drâa",
      location: "Sud du Maroc",
      description: "Exploration spirituelle des oasis et des kasbahs de la vallée du Drâa.",
      image: "assets/images/1.png",
      duration: "4 jours",
      participants: 15,
      date: "10-14 septembre 2025",
      category: "Culturel",
      status: "À venir"
    },
    {
      id: '6',
      title: "Chefchaouen - La ville bleue",
      location: "Chefchaouen, Maroc",
      description: "Découverte de la ville bleue et de ses traditions spirituelles.",
      image: "assets/images/1.png",
      duration: "3 jours",
      participants: 22,
      date: "1-4 octobre 2025",
      category: "Culturel",
      status: "À venir"
    }
  ];

  private eventsSubject = new BehaviorSubject<Tourisme[]>(this.events);
  private participantsMap = new Map<string, Participant[]>();

  constructor() {
    // Initialisation des participants pour chaque événement
    this.initParticipants();
    this.updateEventStatus();
  }

  private initParticipants() {
    // Des participants fictifs pour les événements
    const statuses: ('Disciple' | 'Moukhadam' | 'Visiteur')[] = ['Disciple', 'Moukhadam', 'Visiteur'];
    
    this.events.forEach(event => {
      const participants: Participant[] = [];
      
      for (let i = 0; i < Math.min(event.participants, 10); i++) {
        participants.push({
          id: `part_${event.id}_${i}`,
          name: `Participant ${i+1}`,
          email: `participant${i+1}@example.com`,
          phone: `+212 6${Math.floor(10000000 + Math.random() * 90000000)}`,
          status: statuses[Math.floor(Math.random() * statuses.length)]
        });
      }
      
      this.participantsMap.set(event.id!, participants);
    });
  }

  private updateEventStatus() {
    const currentDate = new Date();
    
    this.events.forEach(event => {
      const dateParts = event.date.split('-');
      let endDate: Date;
      
      if (dateParts.length === 2) {
        // Format "15-16 juin 2025"
        const lastDateStr = dateParts[1].trim();
        const [day, month, year] = lastDateStr.split(' ');
        const monthIndex = this.getMonthIndex(month);
        endDate = new Date(parseInt(year), monthIndex, parseInt(day));
      } else {
        // Format simple
        const [day, month, year] = dateParts[0].split(' ');
        const monthIndex = this.getMonthIndex(month);
        endDate = new Date(parseInt(year), monthIndex, parseInt(day));
      }
      
      if (currentDate > endDate) {
        event.status = 'Terminé';
      } else if (currentDate <= endDate) {
        // On pourrait ajouter une logique plus complexe pour "En cours"
        event.status = 'À venir';
      }
    });
  }
  
  private getMonthIndex(month: string): number {
    const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 
                    'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
    return months.indexOf(month.toLowerCase());
  }

  getEvents(): Observable<Tourisme[]> {
    return this.eventsSubject.asObservable();
  }

  getFilteredEvents(category: string, searchTerm: string = ''): Tourisme[] {
    let filteredEvents = [...this.events];
    
    if (category && category !== 'Toutes') {
      filteredEvents = filteredEvents.filter(event => event.category === category);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredEvents = filteredEvents.filter(event => 
        event.title.toLowerCase().includes(term) || 
        event.location.toLowerCase().includes(term) ||
        event.description.toLowerCase().includes(term)
      );
    }
    
    return filteredEvents;
  }

  getEventById(id: string): Tourisme | undefined {
    return this.events.find(event => event.id === id);
  }

  addEvent(event: Tourisme): void {
    const newEvent = {
      ...event,
      id: `${this.events.length + 1}`,
      status: 'À venir',
      image: "assets/images/1.png"
    };
    
    this.events.push(newEvent as Tourisme);
    this.participantsMap.set(newEvent.id!, []);
    this.eventsSubject.next([...this.events]);
  }

  updateEvent(event: Tourisme): void {
    const index = this.events.findIndex(e => e.id === event.id);
    if (index !== -1) {
      this.events[index] = { ...event };
      this.eventsSubject.next([...this.events]);
    }
  }

  deleteEvent(eventId: string): void {
    this.events = this.events.filter(event => event.id !== eventId);
    this.participantsMap.delete(eventId);
    this.eventsSubject.next([...this.events]);
  }

  // Gestion des participants
  getParticipants(eventId: string): Participant[] {
    return this.participantsMap.get(eventId) || [];
  }

  addParticipant(eventId: string, participant: Participant): void {
    if (!this.participantsMap.has(eventId)) {
      this.participantsMap.set(eventId, []);
    }
    
    const participants = this.participantsMap.get(eventId)!;
    participants.push(participant);
    
    // Mettre à jour le nombre de participants dans l'événement
    const event = this.getEventById(eventId);
    if (event) {
      event.participants = participants.length;
      this.updateEvent(event);
    }
  }

  removeParticipant(eventId: string, participantId: string): void {
    if (this.participantsMap.has(eventId)) {
      const participants = this.participantsMap.get(eventId)!;
      const updatedParticipants = participants.filter(p => p.id !== participantId);
      this.participantsMap.set(eventId, updatedParticipants);
      
      // Mettre à jour le nombre de participants dans l'événement
      const event = this.getEventById(eventId);
      if (event) {
        event.participants = updatedParticipants.length;
        this.updateEvent(event);
      }
    }
  }

  // Simuler des utilisateurs disponibles pour ajouter aux événements
  getAvailableUsers(): Participant[] {
    const users: Participant[] = [];
    
    for (let i = 0; i < 20; i++) {
      const statuses: ('Disciple' | 'Moukhadam' | 'Visiteur')[] = ['Disciple', 'Moukhadam', 'Visiteur'];
      users.push({
        id: `user_${i+1}`,
        name: `Utilisateur ${i+1}`,
        email: `user${i+1}@example.com`,
        phone: `+212 6${Math.floor(10000000 + Math.random() * 90000000)}`,
        status: statuses[Math.floor(Math.random() * statuses.length)]
      });
    }
    
    return users;
  }
}
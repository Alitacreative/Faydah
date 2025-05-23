import { Component, OnInit } from '@angular/core';
import { Participant, Tourisme } from './models/tourisme.model';
import { EventService } from './services/tourisme.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tourisme',
  templateUrl: './tourisme.page.html',
  styleUrls: ['./tourisme.page.scss'],
  standalone: false
})
export class TourismePage implements OnInit {

  events: Tourisme[] = [];
  filteredEvents: Tourisme[] = [];

  isHovered: boolean = false;
  
  // État de l'interface
  activeFilter: string = 'Toutes';
  searchTerm: string = '';
  activeMenuId: string | null = null;
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 1;
  
  // Modals
  showAddModal: boolean = false;
  showEditModal: boolean = false;
  showDeleteConfirmation: boolean = false;
  showAddParticipantModal: boolean = false;
  
  // Données actives
  selectedEvent: Tourisme | null = null;
  newEvent: Tourisme = this.getEmptyEvent();
  
  // Participants
  participants: Participant[] = [];
  participantSearchQuery: string = '';
  filteredParticipants: Participant[] = [];
  availableUsers: Participant[] = [];
  filteredAvailableUsers: Participant[] = [];

  constructor(private eventService: EventService, private router: Router) {}

  ngOnInit() {
    this.loadEvents();
    this.availableUsers = this.eventService.getAvailableUsers();
  }

  loadEvents() {
    this.eventService.getEvents().subscribe(events => {
      this.events = events;
      this.applyFilters();
    });
  }

  // Filtrage et recherche
  search(event: any) {
    this.searchTerm = event.target.value;
    this.applyFilters();
  }

  setFilter(filter: string) {
    this.activeFilter = filter;
    this.applyFilters();
    this.currentPage = 1;
  }

  applyFilters() {
    this.filteredEvents = this.eventService.getFilteredEvents(this.activeFilter, this.searchTerm);
    this.totalPages = Math.ceil(this.filteredEvents.length / this.itemsPerPage);
  }

  // Pagination
  getPaginatedEvents(): Tourisme[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredEvents.slice(startIndex, endIndex);
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getPageArray(): number[] {
    return Array(this.totalPages).fill(0).map((_, i) => i);
  }

  // Menu contextuel
  toggleMenu(eventId: string, event: Event) {
    event.stopPropagation();
    this.activeMenuId = this.activeMenuId === eventId ? null : eventId;
  }

  closeMenu() {
    this.activeMenuId = null;
  }

  // Actions sur les événements
  viewDetails(event: Tourisme) {
    this.router.navigate(['admin/tourisme/detail', event.id]);
  }

  reserve(event: Tourisme, e: MouseEvent) {
    e.stopPropagation();
    // Logique de réservation - pourrait être implémentée ultérieurement
    console.log('Réserver pour:', event.title);
    // Vous pourriez ouvrir une modale de réservation ici
  }

  // Modales
  openAddModal() {
    this.newEvent = this.getEmptyEvent();
    this.showAddModal = true;
  }

  closeAddModal() {
    this.showAddModal = false;
  }

  openEditModal(event: Tourisme, e: MouseEvent) {
    e.stopPropagation();
    this.selectedEvent = { ...event };
    this.showEditModal = true;
    this.activeMenuId = null;
  }

  closeEditModal() {
    this.showEditModal = false;
  }

  confirmDelete(event: Tourisme, e: MouseEvent) {
    e.stopPropagation();
    this.selectedEvent = event;
    this.showDeleteConfirmation = true;
    this.activeMenuId = null;
  }

  closeDeleteConfirmation() {
    this.showDeleteConfirmation = false;
  }

  // CRUD des événements
  addEvent() {
    this.eventService.addEvent(this.newEvent);
    this.closeAddModal();
  }

  updateEvent() {
    if (this.selectedEvent) {
      this.eventService.updateEvent(this.selectedEvent);
      this.closeEditModal();
    }
  }

  deleteEvent() {
    if (this.selectedEvent && this.selectedEvent.id) {
      this.eventService.deleteEvent(this.selectedEvent.id);
      this.closeDeleteConfirmation();
    }
  }

  // Gestion des participants
  loadParticipants(eventId: string) {
    this.participants = this.eventService.getParticipants(eventId);
    this.filteredParticipants = [...this.participants];
  }

  searchParticipants(event: any) {
    const query = event.target.value.toLowerCase();
    this.filteredParticipants = this.participants.filter(participant => 
      participant.name.toLowerCase().includes(query) || 
      participant.email.toLowerCase().includes(query) ||
      participant.phone.toLowerCase().includes(query)
    );
  }

  getFilteredParticipants() {
    return this.filteredParticipants;
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  }

  removeParticipant(participant: Participant) {
    if (this.selectedEvent && this.selectedEvent.id) {
      this.eventService.removeParticipant(this.selectedEvent.id, participant.id);
      this.loadParticipants(this.selectedEvent.id);
    }
  }

  // Ajout de participant
  openAddParticipantModal() {
    this.participantSearchQuery = '';
    this.filteredAvailableUsers = [...this.availableUsers];
    this.showAddParticipantModal = true;
  }

  closeAddParticipantModal() {
    this.showAddParticipantModal = false;
  }

  searchAvailableUsers() {
    const query = this.participantSearchQuery.toLowerCase();
    this.filteredAvailableUsers = this.availableUsers.filter(user => 
      user.name.toLowerCase().includes(query) || 
      user.email.toLowerCase().includes(query)
    );
  }

  selectUserToAdd(user: Participant) {
    if (this.selectedEvent && this.selectedEvent.id) {
      // Créer une copie pour éviter des problèmes de référence
      const newParticipant = { ...user, id: `part_${this.selectedEvent.id}_${Date.now()}` };
      this.eventService.addParticipant(this.selectedEvent.id, newParticipant);
      this.loadParticipants(this.selectedEvent.id);
      this.closeAddParticipantModal();
    }
  }

  // Helpers
  private getEmptyEvent(): Tourisme {
    return {
  title: '',
  location: '',
  description: '',
  image: '/api/placeholder/400/200',
  duration: '',
  participants: 0,
  date: '',
  category: 'Religieux',
  status: 'En cours'
};
  }
}
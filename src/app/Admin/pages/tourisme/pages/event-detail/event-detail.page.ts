import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Participant, Tourisme } from '../../models/tourisme.model';
import { EventService } from '../../services/tourisme.service';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.page.html',
  styleUrls: ['./event-detail.page.scss'],
  standalone: false
})
export class EventDetailPage implements OnInit {
  // Données de l'événement
  event: Tourisme | null = null;
  eventId: string | null = null;
  
  // État des modales
  showEditModal: boolean = false;
  showDeleteConfirmation: boolean = false;
  showAddParticipantModal: boolean = false;
  
  // Participants
  participants: Participant[] = [];
  filteredParticipants: Participant[] = [];
  participantSearchQuery: string = '';
  availableUsers: Participant[] = [];
  filteredAvailableUsers: Participant[] = [];
  
  // Donnée temporaire pour édition
  selectedParticipant: Participant | null = null;

  constructor(
    private eventService: EventService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // Récupérer l'ID depuis l'URL
    this.route.paramMap.subscribe(params => {
      this.eventId = params.get('id');
      if (this.eventId) {
        this.loadEvent();
        this.loadParticipants();
        this.availableUsers = this.eventService.getAvailableUsers();
        this.filteredAvailableUsers = [...this.availableUsers];
      } else {
        this.router.navigate(['/admin/tourisme']);
      }
    });
  }

  /**
   * Navigation
   */
  goBack() {
    this.router.navigate(['/admin/tourisme']);
  }

  /**
   * Chargement des données
   */
  loadEvent() {
    if (!this.eventId) return;
    // Vérifier si l'événement existe
      if (this.eventService.getEventById(this.eventId)) {
        this.event = this.eventService.getEventById(this.eventId)! ;
      } else {
        this.router.navigate(['/admin/tourisme']);
      }
  }

  loadParticipants() {
    if (!this.eventId) return;
    
    this.participants = this.eventService.getParticipants(this.eventId);
    this.filteredParticipants = [...this.participants];
  }

  /**
   * Actions sur l'événement
   */
  reserve(event: Tourisme, e: MouseEvent) {
    e.stopPropagation();
    console.log('Réservation pour:', event.title);
    // Logique de réservation à implémenter
  }


  /**
   * Gestion de la modal de suppression
   */
  confirmDelete(event: Participant | null) {
    if (!event) return;
    
    this.selectedParticipant = event;
    this.showDeleteConfirmation = true; 
  }

  closeDeleteConfirmation() {
    this.showDeleteConfirmation = false;
  }

  deleteEvent() {
    if (this.eventId && this.selectedParticipant) {
      this.eventService.removeParticipant(this.eventId, this.selectedParticipant.id);
      this.loadParticipants();
      this.closeDeleteConfirmation();
    }
  }

  /**
   * Gestion des participants
   */
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


  /**
   * Ajout de participants
   */
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
    if (this.eventId) {
      // Créer une copie pour éviter des problèmes de référence
      const newParticipant = { ...user, id: `part_${this.eventId}_${Date.now()}` };
      this.eventService.addParticipant(this.eventId, newParticipant);
      this.loadParticipants();
      this.closeAddParticipantModal();
    }
  }
}

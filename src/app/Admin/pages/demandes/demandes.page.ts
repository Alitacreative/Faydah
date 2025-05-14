import { Component, OnInit } from '@angular/core';
import { Demande } from './model/demandes.interface';
import { Router } from '@angular/router';
import { ConfettiService } from '../../services/confetti.service';

@Component({
  selector: 'app-demandes',
  templateUrl: './demandes.page.html',
  styleUrls: ['./demandes.page.scss'],
  standalone: false
})
export class DemandesPage implements OnInit {

  protected Math = Math;
  demands: Demande[] = [];
  filteredDemands: Demande[] = [];
  searchText: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  selectedStatus: string = 'Tous les status';
  selectedType: string = 'Tous les types';
  
  statusOptions = ['Tous les status', 'En attente', 'Approuvée', 'Rejetée'];
  typeOptions = ['Tous les types', 'Adhésion', 'Renouvellement', 'Autre'];
  
  pendingCount: number = 0;
  approvedCount: number = 0;
  rejectedCount: number = 0;

  // Modal properties
  showActionsPopup: number | null = null;
  showRejectModal: boolean = false;
  selectedDemand: Demande | null = null;
  rejectReason: string = '';

  constructor(private router: Router, private confettiService: ConfettiService) {}

  ngOnInit() {
    this.generateDummyData();
    this.filterDemands();
    this.updateCounts();
  }

  generateDummyData() {
    for (let i = 1; i <= 20; i++) {
      let status: 'En attente' | 'Approuvée' | 'Rejetée';
      
      if (i <= 5) {
        status = 'Approuvée';
      } else if (i <= 7) {
        status = 'En attente';
      } else if (i === 8) {
        status = 'Rejetée';
      } else {
        status = 'Approuvée';
      }
      
      this.demands.push({
        id: i,
        demandeur: 'Ahmed Benali',
        role: 'Disciple',
        type: 'Adhésion',
        sujet: "Demande d'adhésion à au Dahira ....",
        date: '10/05/2025',
        statut: status
      });
    }
  }

  updateCounts() {
    this.pendingCount = this.demands.filter(d => d.statut === 'En attente').length;
    this.approvedCount = this.demands.filter(d => d.statut === 'Approuvée').length;
    this.rejectedCount = this.demands.filter(d => d.statut === 'Rejetée').length;
  }

  filterDemands() {
    this.filteredDemands = this.demands.filter(demand => {
      // Filter by search text
      const searchMatch = !this.searchText || 
        demand.demandeur.toLowerCase().includes(this.searchText.toLowerCase()) ||
        demand.sujet.toLowerCase().includes(this.searchText.toLowerCase());
      
      // Filter by status
      const statusMatch = this.selectedStatus === 'Tous les status' || 
        demand.statut === this.selectedStatus;
      
      // Filter by type
      const typeMatch = this.selectedType === 'Tous les types' || 
        demand.type === this.selectedType;
      
      return searchMatch && statusMatch && typeMatch;
    });
  }

  onSearch() {
    this.currentPage = 1;
    this.filterDemands();
  }

  onStatusChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedStatus = select.value;
    this.currentPage = 1;
    this.filterDemands();
  }

  onTypeChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedType = select.value;
    this.currentPage = 1;
    this.filterDemands();
  }

  get pageCount(): number {
    return Math.ceil(this.filteredDemands.length / this.itemsPerPage);
  }

  get pages(): number[] {
    const pagesArray = [];
    for (let i = 1; i <= this.pageCount; i++) {
      pagesArray.push(i);
    }
    return pagesArray;
  }

  get paginatedDemands(): Demande[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredDemands.slice(startIndex, startIndex + this.itemsPerPage);
  }

  nextPage() {
    if (this.currentPage < this.pageCount) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Approuvée': return 'bg-green-100 text-green-800';
      case 'En attente': return 'bg-orange-100 text-orange-800';
      case 'Rejetée': return 'bg-red-100 text-red-800';
      default: return '';
    }
  }

  toggleActionsPopup(id: number | null): void {
    if (this.showActionsPopup === id) {
      this.showActionsPopup = null;
    } else {
      this.showActionsPopup = id;
    }
  }

  viewDetails(demand: Demande): void {
    // Navigate to details page
    this.router.navigate(['admin/demandes/demande/', demand.id]);
    this.showActionsPopup = null;
  }

  approveDemand(demand: Demande): void {
    demand.statut = 'Approuvée';
    this.updateCounts();
    this.showActionsPopup = null;
    this.confettiService.triggerConfetti();
    
  }

  openRejectModal(demand: Demande): void {
    this.selectedDemand = demand;
    this.rejectReason = '';
    this.showRejectModal = true;
    this.showActionsPopup = null;
  }

  closeRejectModal(): void {
    this.showRejectModal = false;
    this.selectedDemand = null;
  }

  confirmReject(): void {
    if (this.selectedDemand && this.rejectReason.trim()) {
      this.selectedDemand.statut = 'Rejetée';
      this.selectedDemand.motifRejet = this.rejectReason;
      this.updateCounts();
      this.closeRejectModal();
    }
  }

  // Close popups when clicking outside
  closePopupsOnOutsideClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.actions-popup') && !target.closest('.actions-button')) {
      this.showActionsPopup = null;
    }
  }
}
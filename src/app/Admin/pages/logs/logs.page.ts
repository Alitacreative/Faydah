import { Component, OnInit } from '@angular/core';
import { LogEntry } from './models/log.model';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.page.html',
  styleUrls: ['./logs.page.scss'],
  standalone: false
})
export class LogsPage implements OnInit {
  Math = Math;
  logs: LogEntry[] = [];
  filteredLogs: LogEntry[] = [];
  searchTerm = '';
  selectedStatus = 'all';
  selectedPeriod = 'today';

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;

  constructor() { }

  ngOnInit(): void {
    this.generateSampleLogs();
    this.filterLogs();
  }

  generateSampleLogs(): void {
    this.logs = [
      {
        id: 'LOG-2025-001',
        user: 'Dumont',
        action: 'Connexion',
        target: 'Système',
        timestamp: '19/05/2025 14:32:15',
        status: 'success',
      },
      {
        id: 'LOG-2025-002',
        user: 'Dumont',
        action: 'Création',
        target: 'Utilisateur: Ahmed Benali',
        timestamp: '19/05/2025 14:45:22',
        status: 'success',
      },
      {
        id: 'LOG-2025-003',
        user: 'Leslie Alexander',
        action: 'Modification',
        target: 'Projet: Rénovation du centre',
        timestamp: '19/05/2025 15:12:05',
        status: 'success',
      },
      {
        id: 'LOG-2025-004',
        user: 'Système',
        action: 'Sauvegarde',
        target: 'Base de données',
        timestamp: '19/05/2025 16:00:00',
        status: 'success',
      },
      {
        id: 'LOG-2025-005',
        user: 'Guy Hawkins',
        action: 'Tentative de connexion',
        target: 'Système',
        timestamp: '19/05/2025 16:23:45',
        status: 'warning',
        details: 'Mot de passe incorrect',
      },
      {
        id: 'LOG-2025-006',
        user: 'Kristin Watson',
        action: 'Suppression',
        target: 'Message: Discussion #2354',
        timestamp: '19/05/2025 16:45:12',
        status: 'warning',
      },
      {
        id: 'LOG-2025-007',
        user: 'Système',
        action: 'Erreur',
        target: 'API externe',
        timestamp: '19/05/2025 17:02:33',
        status: 'error',
        details: 'Timeout lors de la connexion à l\'API de paiement',
      },
      {
        id: 'LOG-2025-008',
        user: 'Robert Fox',
        action: 'Paiement',
        target: 'Cotisation: COT-2025-001',
        timestamp: '19/05/2025 17:15:40',
        status: 'success',
      },
      {
        id: 'LOG-2025-009',
        user: 'Dumont',
        action: 'Exportation',
        target: 'Rapport: Utilisateurs actifs',
        timestamp: '19/05/2025 17:30:22',
        status: 'success',
      },
      {
        id: 'LOG-2025-010',
        user: 'Système',
        action: 'Maintenance',
        target: 'Système',
        timestamp: '19/05/2025 18:00:00',
        status: 'warning',
        details: 'Maintenance planifiée dans 30 minutes',
      },
      {
        id: 'LOG-2025-011',
        user: 'Admin',
        action: 'Mise à jour',
        target: 'Configuration système',
        timestamp: '19/05/2025 18:30:00',
        status: 'success',
      },
      {
        id: 'LOG-2025-012',
        user: 'Système',
        action: 'Notification',
        target: 'Tous les utilisateurs',
        timestamp: '19/05/2025 19:00:00',
        status: 'success',
      },
      {
        id: 'LOG-2025-013',
        user: 'Jean Dupont',
        action: 'Tentative d\'accès',
        target: 'Section admin',
        timestamp: '19/05/2025 19:15:00',
        status: 'error',
        details: 'Permissions insuffisantes',
      }
    ];
  }

  filterLogs(): void {
    this.currentPage = 1; // Reset to first page when filters change
    
    this.filteredLogs = this.logs.filter(log => {
      // Filter by search term
      const matchesSearch = !this.searchTerm || 
        log.user.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        log.target.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      // Filter by status
      const matchesStatus = this.selectedStatus === 'all' || 
        log.status === this.selectedStatus;
      
      // Filter by period (simplified for demo - in real app you'd compare dates)
      const matchesPeriod = this.selectedPeriod === 'all' || 
        (this.selectedPeriod === 'today' && log.timestamp.includes('19/05/2025')) ||
        (this.selectedPeriod === 'week' && true) || // Would check if within current week
        (this.selectedPeriod === 'month' && true);  // Would check if within current month
      
      return matchesSearch && matchesStatus && matchesPeriod;
    });
  }

  // Pagination logic
  get pageCount(): number {
    return Math.ceil(this.filteredLogs.length / this.itemsPerPage);
  }

  get pages(): number[] {
    const pagesArray = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.pageCount, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pagesArray.push(i);
    }
    
    return pagesArray;
  }

  get paginatedLogs(): LogEntry[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredLogs.slice(startIndex, startIndex + this.itemsPerPage);
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.pageCount) {
      this.currentPage++;
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.pageCount) {
      this.currentPage = page;
    }
  }

  // Helper methods
  getStatusClass(status: string): string {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-amber-100 text-amber-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'success': return 'check-circle';
      case 'warning': return 'alert-triangle';
      case 'error': return 'x-circle';
      default: return 'info';
    }
  }

  get successCount(): number {
    return this.logs.filter(l => l.status === 'success').length;
  }

  get warningCount(): number {
    return this.logs.filter(l => l.status === 'warning').length;
  }

  get errorCount(): number {
    return this.logs.filter(l => l.status === 'error').length;
  }
}


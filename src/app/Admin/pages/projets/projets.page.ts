import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Project } from './models/projet.model';
import { ProjectService } from './services/project.service';
import { EditProjetModalComponent } from './components/edit-projet-modal/edit-projet-modal.component';
import { AddProjetModalComponent } from './components/add-projet-modal/add-projet-modal.component';

@Component({
  selector: 'app-projets',
  templateUrl: './projets.page.html',
  styleUrls: ['./projets.page.scss'],
  standalone: false
})
export class ProjetsPage implements OnInit {

  allProjects: Project[] = [];
  filteredProjects: Project[] = [];
  searchTerm: string = '';
  activeMenuId: string | null = null;
  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 1;
  filters: string[] = ['Tous', 'En cours', 'En attente', 'Terminées'];
  activeFilter: string = 'Tous';
  
  // Variables pour la modale d'ajout de projet
  showAddModal: boolean = false;
  showEditModal: boolean = false;
  selectedProject: Project | null = null;

  constructor(
    private projectService: ProjectService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.projectService.getProjects().subscribe(projects => {
      this.allProjects = projects;
      this.applyFilters();
    });
  }

  applyFilters() {
    let filtered = [...this.allProjects];
    
    // Appliquer le filtre de statut
    if (this.activeFilter !== 'Tous') {
      const statusMap: { [key: string]: string } = {
        'En cours': 'en_cours',
        'En attente': 'en_attente',
        'Terminées': 'termine'
      };
      filtered = filtered.filter(project => project.status === statusMap[this.activeFilter]);
    }
    
    // Appliquer la recherche
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(project => 
        project.title.toLowerCase().includes(term) || 
        project.description.toLowerCase().includes(term)
      );
    }
    
    this.filteredProjects = filtered;
    this.totalPages = Math.ceil(this.filteredProjects.length / this.itemsPerPage);
    this.currentPage = Math.min(this.currentPage, this.totalPages) || 1;
  }

  setFilter(filter: string) {
    this.activeFilter = filter;
    this.currentPage = 1;
    this.applyFilters();
  }

  search(event: any) {
    this.searchTerm = event.target.value;
    this.currentPage = 1;
    this.applyFilters();
  }

  getPaginatedProjects() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredProjects.slice(startIndex, startIndex + this.itemsPerPage);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Gestion du menu contextuel
  toggleMenu(id: string, event: Event) {
    event.stopPropagation();
    this.activeMenuId = this.activeMenuId === id ? null : id;
  }

  closeMenu() {
    this.activeMenuId = null;
  }

  // Actions du menu
  viewDetails(projectId: string) {
    this.closeMenu();
    this.router.navigate(['admin/projets/detail', projectId]);
  }

  // Gestion des modales
  openAddModal() {
    this.showAddModal = true;
  }

  closeAddModal() {
    this.showAddModal = false;
  }

  onAddProject(project: Project) {
    this.projectService.addProject(project);
    this.closeAddModal();
    this.loadProjects();
  }

  openEditModal(project: Project, event: Event) {
    event.stopPropagation();
    this.closeMenu();
    this.selectedProject = project;
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.selectedProject = null;
  }

  onEditProject(project: Project) {
    this.projectService.updateProject(project);
    this.closeEditModal();
    this.loadProjects();
  }

  changeStatus(projectId: string, status: 'en_cours' | 'en_attente' | 'termine', event: Event) {
    event.stopPropagation();
    this.closeMenu();
    this.projectService.changeStatus(projectId, status);
  }

  archiveProject(projectId: string, event: Event) {
    event.stopPropagation();
    this.closeMenu();
    this.projectService.archiveProject(projectId);
  }

  getStatusLabel(status: string): string {
    const statusMap: { [key: string]: string } = {
      'en_cours': 'En cours',
      'en_attente': 'En attente',
      'termine': 'Terminé'
    };
    return statusMap[status] || status;
  }

  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'en_cours': 'bg-green-100 text-green-800',
      'en_attente': 'bg-yellow-100 text-yellow-800',
      'termine': 'bg-red-100 text-red-800'
    };
    return statusClasses[status] || '';
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }
}
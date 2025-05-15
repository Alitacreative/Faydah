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
  currentFilter: string = 'Tous';
  searchTerm: string = '';
  activeMenuId: string | null = null;
  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 1;

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private modalController: ModalController
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
    if (this.currentFilter !== 'Tous') {
      const statusMap: { [key: string]: string } = {
        'En cours': 'en_cours',
        'En attente': 'en_attente',
        'Terminées': 'termine'
      };
      filtered = filtered.filter(project => project.status === statusMap[this.currentFilter]);
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
    this.currentFilter = filter;
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

  async addProject() {
    const modal = await this.modalController.create({
      component: AddProjetModalComponent
    });
    
    await modal.present();
    
    const { data } = await modal.onDidDismiss();
    if (data && data.project) {
      this.projectService.addProject(data.project);
    }
  }

  async editProject(project: Project, event: Event) {
    event.stopPropagation();
    this.closeMenu();
    
    const modal = await this.modalController.create({
      component: EditProjetModalComponent,
      componentProps: {
        project: { ...project }
      }
    });
    
    await modal.present();
    
    const { data } = await modal.onDidDismiss();
    if (data && data.project) {
      this.projectService.updateProject(data.project);
    }
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
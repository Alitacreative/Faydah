import { Component, OnInit } from '@angular/core';
import { ConfettiService } from '../../services/confetti.service';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { Dahira } from './models/dahira.model';
import { DahiraService } from './services/dahira.service';

@Component({
  selector: 'app-dahira',
  templateUrl: './dahira.page.html',
  styleUrls: ['./dahira.page.scss'],
  standalone: false
})
export class DahiraPage implements OnInit {

  
  startConfetti() {
    this.confettiService.triggerConfetti();
  }
  dahiras: Dahira[] = [];
  totalItems: number = 0;
  currentPage: number = 1;
  itemsPerPage: number = 12;
  searchTerm: string = '';
  filters: any = {};
  loading: boolean = false;
  showAddModal: boolean = false;
  showEditModal: boolean = false;
  showConfirmDeleteModal: boolean = false;
  selectedDahira: Dahira | null = null;
  protected Math = Math;
  
  // Pour le menu contextuel
  activeContextMenu: string | null = null;
  contextMenuPosition = { top: '0px', left: '0px' };
  
  // Pour la recherche
  searchSubject = new Subject<string>();
  
  constructor(
  private confettiService: ConfettiService,
    private dahiraService: DahiraService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDahiras();
    
    // Configuration de la recherche avec debounce
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      this.searchTerm = term;
      this.currentPage = 1; // Réinitialiser à la première page lors d'une recherche
      this.loadDahiras();
    });
  }

  loadDahiras(): void {
    this.loading = true;
    this.dahiraService.getDahiras(this.currentPage, this.itemsPerPage, this.searchTerm, this.filters)
      .subscribe({
        next: (result) => {
          this.dahiras = result.dahiras;
          this.totalItems = result.total;
          this.loading = false;
        },
        error: (error) => {
          console.error('Erreur lors du chargement des dahiras', error);
          this.loading = false;
        }
      });
  }

  onSearch(term: string): void {
    this.searchSubject.next(term);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadDahiras();
  }

  onFilterChange(filters: any): void {
    this.filters = filters;
    this.currentPage = 1; // Réinitialiser à la première page lors d'un changement de filtre
    this.loadDahiras();
  }

  showContextMenu(event: MouseEvent, dahira: Dahira): void {
    event.preventDefault();
    event.stopPropagation();
    
    this.selectedDahira = dahira;
    this.activeContextMenu = dahira.id;
    
    // Positionner le menu contextuel
    const menuWidth = 200; // Largeur estimée du menu
    const windowWidth = window.innerWidth;
    const clickX = event.clientX;
    
    // Éviter que le menu ne sorte de l'écran par la droite
    const left = clickX + menuWidth > windowWidth
      ? windowWidth - menuWidth - 10
      : clickX;
    
    this.contextMenuPosition = {
      top: `${event.clientY}px`,
      left: `${left}px`
    };
  }

  closeContextMenu(): void {
    this.activeContextMenu = null;
  }

  viewDahiraDetails(dahira: Dahira): void {
    this.router.navigate(['admin/dahira/detail', dahira.id]);
  }

  openAddModal(): void {
    this.showAddModal = true;
  }

  openEditModal(dahira: Dahira): void {
    this.selectedDahira = dahira;
    this.showEditModal = true;
    this.closeContextMenu();
  }

  openDeleteConfirmation(dahira: Dahira): void {
    this.selectedDahira = dahira;
    this.showConfirmDeleteModal = true;
    this.closeContextMenu();
  }

  onAddDahira(dahira: any): void {
    this.dahiraService.createDahira(dahira).subscribe({
      next: () => {
        this.showAddModal = false;
        this.loadDahiras();
      },
      error: (error) => console.error('Erreur lors de la création du dahira', error)
    });
  }

  onEditDahira(changes: any): void {
    if (this.selectedDahira) {
      this.dahiraService.updateDahira(this.selectedDahira.id, changes).subscribe({
        next: () => {
          this.showEditModal = false;
          this.loadDahiras();
        },
        error: (error) => console.error('Erreur lors de la modification du dahira', error)
      });
    }
  }

  onDeleteDahira(): void {
    if (this.selectedDahira) {
      this.dahiraService.deleteDahira(this.selectedDahira.id).subscribe({
        next: (success) => {
          if (success) {
            this.showConfirmDeleteModal = false;
            this.loadDahiras();
          }
        },
        error: (error) => console.error('Erreur lors de la suppression du dahira', error)
      });
    }
  }

  onCardClick(dahira: Dahira): void {
    this.viewDahiraDetails(dahira);
  }

  // Fermer les modales
  closeAddModal(): void {
    this.showAddModal = false;
  }

  closeEditModal(): void {
    this.showEditModal = false;
  }

  closeDeleteModal(): void {
    this.showConfirmDeleteModal = false;
  }
}
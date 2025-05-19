import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Resource } from '../../pages/resources/model/resource.model';

@Component({
  selector: 'app-resource-card',
  templateUrl: './resource-card.component.html',
  styleUrls: ['./resource-card.component.scss'],
  standalone: false,
})
export class ResourceCardComponent implements OnInit {
  @Input() resource!: Resource;

  // ✅ Ajoute cette variable pour contrôler l'affichage du menu
  menuOpen: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  // ✅ Fonction pour basculer le menu
  toggleMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.menuOpen = !this.menuOpen;
  }

  formatDate(dateInput: string | Date): string {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) {
      return 'Date invalide';
    }

    const day = date.getDate();
    const month = this.getMonthName(date.getMonth());
    const year = date.getFullYear();
    return `Ajouté le ${day} ${month} ${year}`;
  }

  getMonthName(month: number): string {
    const months = [
      'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
      'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
    ];
    return months[month] ?? '';
  }

  openResourceDetails(id: string | number): void {
    if (id) {
      this.router.navigate(['resource', id]);
    }
  }

  viewResource(resource: Resource): void {
    this.router.navigate(['resource', resource.id]);
  }

  editResource(resource: Resource): void {
    this.router.navigate(['edit-resource', resource.id]);
  }

  deleteResource(resource: Resource): void {
    console.log('Suppression demandée pour :', resource);
    // Ajoute ici ta logique de suppression si besoin
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Tourisme } from 'src/app/Admin/pages/tourisme/models/tourisme.model';

@Component({
  selector: 'app-tourisme',
  templateUrl: './tourisme.page.html',
  styleUrls: ['./tourisme.page.scss'],
  standalone: false
})
export class TourismePage implements OnInit {
  // Données des événements
  events: Tourisme[] = [];
  allEvents: Tourisme[] = [];
  eventsPostules: Tourisme[] = [
    {
      id: '2',
      title: "Basilique Notre-Dame de la Paix",
      location: "Yamoussoukro, Côte d'Ivoire",
      description: "La plus grande église du monde, inspirée de la basilique Saint-Pierre de Rome.",
      image: "assets/images/2.png",
      duration: "2 jours",
      participants: 40,
      date: "20-21 juillet 2025",
      category: "Culturel",
      status: "En cours"
    },
    {
      id: '5',
      title: "Visite de la Grande Mosquée de Paris",
      location: "Paris, France",
      description: "Découverte architecturale et culturelle de la Grande Mosquée de Paris.",
      image: "assets/images/5.png",
      duration: "1 jour",
      participants: 30,
      date: "10 octobre 2025",
      category: "Culturel",
      status: "À venir"
    }
  ];

  // États de l'interface
  loading: boolean = false;
  error: string | null = null;

  // Recherche
  searchTerm: string = '';

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 8;

  get totalItems(): number {
    return this.getFilteredEvents().length;
  }

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.loading = true;
    this.error = null;
    // Mock data
    this.allEvents = [
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
        title: "Basilique Notre-Dame de la Paix",
        location: "Yamoussoukro, Côte d'Ivoire",
        description: "La plus grande église du monde, inspirée de la basilique Saint-Pierre de Rome.",
        image: "assets/images/1.png",
        duration: "2 jours",
        participants: 40,
        date: "20-21 juillet 2025",
        category: "Culturel",
        status: "En cours"
      },
      {
        id: '3',
        title: "Retraite Spirituelle au Désert",
        location: "Timbuktu, Mali",
        description: "Un séjour de méditation et de prière dans le désert, guidé par des maîtres soufis.",
        image: "assets/images/1.png",
        duration: "5 jours",
        participants: 15,
        date: "10-15 août 2025",
        category: "Retraite",
        status: "À venir"
      },
      {
        id: '4',
        title: "Pèlerinage à Touba",
        location: "Touba, Sénégal",
        description: "Le grand Magal de Touba, rassemblement religieux majeur du Mouridisme.",
        image: "assets/images/1.png",
        duration: "3 jours",
        participants: 100,
        date: "1-3 septembre 2025",
        category: "Pèlerinage",
        status: "Terminé"
      },
      {
        id: '5',
        title: "Visite de la Grande Mosquée de Paris",
        location: "Paris, France",
        description: "Découverte architecturale et culturelle de la Grande Mosquée de Paris.",
        image: "assets/images/1.png",
        duration: "1 jour",
        participants: 30,
        date: "10 octobre 2025",
        category: "Culturel",
        status: "À venir"
      },
      {
        id: '6',
        title: "Séjour Soufi à Fès",
        location: "Fès, Maroc",
        description: "Immersion dans la tradition soufie marocaine, visites de zaouïas et rencontres spirituelles.",
        image: "assets/images/1.png",
        duration: "4 jours",
        participants: 20,
        date: "5-9 novembre 2025",
        category: "Retraite",
        status: "À venir"
      },
      {
        id: '7',
        title: "Randonnée Spirituelle au Mont Sinaï",
        location: "Mont Sinaï, Égypte",
        description: "Ascension du Mont Sinaï, méditation et prières au lever du soleil.",
        image: "assets/images/1.png",
        duration: "2 jours",
        participants: 18,
        date: "20-21 décembre 2025",
        category: "Religieux",
        status: "À venir"
      },
      {
        id: '8',
        title: "Pèlerinage à la Mecque",
        location: "La Mecque, Arabie Saoudite",
        description: "Le Hajj, cinquième pilier de l'Islam, voyage spirituel incontournable.",
        image: "assets/images/1.png",
        duration: "7 jours",
        participants: 200,
        date: "8-14 janvier 2026",
        category: "Pèlerinage",
        status: "À venir"
      }
    ];
    this.applyFiltersAndPagination();
    this.loading = false;
  }

  // Recherche
  onSearch(searchValue: string): void {
    this.searchTerm = searchValue.toLowerCase();
    this.currentPage = 1;
    this.applyFiltersAndPagination();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.currentPage = 1;
    this.applyFiltersAndPagination();
  }

  getFilteredEvents(): Tourisme[] {
    if (!this.searchTerm) {
      return this.allEvents;
    }
    return this.allEvents.filter(event =>
      event.title.toLowerCase().includes(this.searchTerm) ||
      event.description.toLowerCase().includes(this.searchTerm) ||
      event.location.toLowerCase().includes(this.searchTerm) ||
      event.category.toLowerCase().includes(this.searchTerm) ||
      event.status.toLowerCase().includes(this.searchTerm)
    );
  }

  applyFiltersAndPagination(): void {
    const filteredEvents = this.getFilteredEvents();
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.events = filteredEvents.slice(startIndex, endIndex);
  }

  hasResults(): boolean {
    return this.allEvents.length > 0 && this.events.length > 0;
  }

  isEmptySearch(): boolean {
    return this.searchTerm !== '' && this.getFilteredEvents().length === 0;
  }

  getTotalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.getTotalPages()) {
      this.currentPage = page;
      this.applyFiltersAndPagination();
    }
  }

  getVisiblePages(): number[] {
    const totalPages = this.getTotalPages();
    const currentPage = this.currentPage;
    const visiblePages: number[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        visiblePages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          visiblePages.push(i);
        }
        visiblePages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        visiblePages.push(1);
        for (let i = totalPages - 4; i <= totalPages; i++) {
          visiblePages.push(i);
        }
      } else {
        visiblePages.push(1);
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          visiblePages.push(i);
        }
        visiblePages.push(totalPages);
      }
    }
    return visiblePages;
  }

  trackByPage(index: number, page: number): number {
    return page;
  }

  onCardClick(event: Tourisme): void {
    this.router.navigate(['features/tourisme', event.id]);
  }

  refresh(): void {
    this.loadEvents();
  }

  hasPostules(): boolean {
    return this.eventsPostules && this.eventsPostules.length > 0;
  }
}

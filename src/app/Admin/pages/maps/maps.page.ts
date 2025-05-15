import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../services/utilisateur.service';
import { Subscription } from 'rxjs';
import { User } from '../../models/utilisateur.model';
import { GoogleMapsLoaderService } from './google-maps.service';


@Component({
  selector: 'app-maps',
  templateUrl: './maps.page.html',
  styleUrls: ['./maps.page.scss'],
  standalone: false
})
export class MapsPage implements OnInit {

  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;
  
  private map: google.maps.Map | null = null;
  private markers: google.maps.Marker[] = [];
  private infoWindow: google.maps.InfoWindow | null = null;
  
  // Options de filtre
  filters = {
    role: '',
    sexe: '',
    dahira: '',
    ageMin: 0,
    ageMax: 100
  };
  
  // Listes pour les sélections de filtre
  roles: string[] = ['admin', 'moderateur', 'membre'];
  sexes: string[] = ['homme', 'femme'];
  dahiras: string[] = ['Touba', 'Tivaouane', 'Medina Baye'];
  
  // Filtre actif ou non
  isFilterPanelOpen = false;
  
  // Pour gérer les souscriptions
  private subscription = new Subscription();

  constructor(
    private userService: UserService,
    private ngZone: NgZone,
    private mapsLoader: GoogleMapsLoaderService
  ) {}

  ngOnInit() {
    this.mapsLoader.load().then(() => {
      this.initMap(); // <- Appel sécurisé après chargement de l'API
      // this.subscription.add(
      //   this.userService.getFilteredUsers().subscribe(users => {
      //     this.updateMarkers(users);
      //   })
      // );
    }).catch(err => {
      console.error('Erreur de chargement de Google Maps', err);
    });
  }

  ngOnDestroy() {
    // Nettoyer les souscriptions
    this.subscription.unsubscribe();
  }
  

  private initMap(): void {
    // Créer la carte Google Maps
    const mapOptions: google.maps.MapOptions = {
      center: { lat: 14.7645, lng: -17.3660 }, // Dakar, Sénégal
      zoom: 12,
      styles: [ /* Aucun style personnalisé pour conserver l'apparence par défaut */ ],
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true
    };
    
    this.map = new google.maps.Map(this.mapContainer.nativeElement, mapOptions);
    this.infoWindow = new google.maps.InfoWindow();
    
    // Chargement initial des utilisateurs
    this.loadUsers();
  }

  private loadUsers(): void {
    this.userService.getAllUsers().subscribe(users => {
      // this.updateMarkers(users);
    });
  }

  // private updateMarkers(users: User[]): void {
  //   // Supprimer les marqueurs existants
  //   this.clearMarkers();
    
  //   if (!this.map) return;
    
  //   // Ajouter de nouveaux marqueurs
  //   const bounds = new google.maps.LatLngBounds();
    
  //   users.forEach(user => {
  //     const position = new google.maps.LatLng(user.position.lat, user.position.lng);
  //     bounds.extend(position);
      
  //     const marker = new google.maps.Marker({
  //       position: position,
  //       map: this.map,
  //       title: `${user.prenom} ${user.nom}`,
  //       animation: google.maps.Animation.DROP
  //     });
      
  //     // Contenu de l'infoWindow
  //     const contentString = `
  //       <div class="p-2">
  //         <h3 class="font-bold text-lg">${user.prenom} ${user.nom}</h3>
  //         <p><strong>Âge:</strong> ${user.age}</p>
  //         <p><strong>Sexe:</strong> ${user.sexe}</p>
  //         <p><strong>Rôle:</strong> ${user.role}</p>
  //         <p><strong>Dahira:</strong> ${user.dahira}</p>
  //       </div>
  //     `;
      
  //     // Ajouter un écouteur d'événement pour l'affichage de l'infoWindow
  //     marker.addListener('click', () => {
  //       // Utiliser NgZone pour s'assurer que Angular détecte les changements
  //       this.ngZone.run(() => {
  //         if (this.infoWindow && this.map) {
  //           this.infoWindow.setContent(contentString);
  //           this.infoWindow.open(this.map, marker);
  //         }
  //       });
  //     });
      
  //     this.markers.push(marker);
  //   });
    
  //   // Ajuster la vue aux marqueurs
  //   if (users.length > 0 && this.map) {
  //     this.map.fitBounds(bounds);
  //     // Zoom out un peu si on n'a qu'un seul marqueur
  //     if (users.length === 1) {
  //       google.maps.event.addListenerOnce(this.map, 'bounds_changed', () => {
  //         if (this.map) this.map.setZoom(Math.min(15, this.map.getZoom() || 12));
  //       });
  //     }
  //   }
  // }
  
  private clearMarkers(): void {
    // Supprimer tous les marqueurs de la carte
    this.markers.forEach(marker => {
      marker.setMap(null);
    });
    this.markers = [];
  }

  toggleFilterPanel(): void {
    this.isFilterPanelOpen = !this.isFilterPanelOpen;
  }

  applyFilters(): void {
    this.userService.applyFilters(this.filters);
  }

  resetFilters(): void {
    this.filters = {
      role: '',
      sexe: '',
      dahira: '',
      ageMin: 0,
      ageMax: 100
    };
    this.applyFilters();
  }
}
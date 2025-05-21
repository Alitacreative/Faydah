import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import * as L from 'leaflet';
import 'leaflet.markercluster';

interface MapItem {
  name: string;
  type: 'disciple' | 'dahira' | 'mouqadam';
  lat: number;
  lng: number;
  country: string;
  region: string;
  department: string;
  members?: number;
  disciples?: number;
}

@Component({
  selector: 'app-maps',
  templateUrl: './maps.page.html',
  styleUrls: ['./maps.page.scss'],
  standalone: false,
})
export class MapsPage implements OnInit {
  @ViewChild('map', { static: true }) mapElement!: ElementRef;

  private map!: L.Map;
  private markers = L.markerClusterGroup();
  private mapInitialized = false;

  public disciples: MapItem[] = [];
  public dahiras: MapItem[] = [];
  public mouqadams: MapItem[] = [];

  public selectedFilter = 'all';
  public searchText = '';
  public selectedCountry = 'all';
  public countries = [
    { code: 'all', name: 'Tous les pays' },
    { code: 'SN', name: 'Sénégal' },
    { code: 'ML', name: 'Mali' },
    { code: 'CI', name: 'Côte d\'Ivoire' },
    { code: 'US', name: 'États-Unis' },
    { code: 'FR', name: 'France' },
    { code: 'UK', name: 'Royaume-Uni' },
    { code: 'MA', name: 'Maroc' },
    { code: 'NG', name: 'Nigeria' },
  ];
  public regions: { name: string }[] = [];
  public selectedRegion = 'all';
  public departments: { name: string }[] = [];
  public selectedDepartment = 'all';

  public stats = {
    totalDisciples: 0,
    totalDahiras: 0,
    totalMouqadams: 0,
    countriesCount: 0,
  };

  constructor(private loadingController: LoadingController) {}

  async ngOnInit() {
    await this.presentLoading();
    this.loadMockData();
    this.initializeMap();
    this.calculateStats();
    this.loadMapMarkers();
    this.loadingController.dismiss();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Chargement de la carte...',
      duration: 1500,
    });
    await loading.present();
  }

  initializeMap() {
    if (this.mapInitialized) return;

    this.map = L.map(this.mapElement.nativeElement, {
      center: [14.6937, -17.4441],
      zoom: 3,
      zoomControl: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.map.addLayer(this.markers);
    this.mapInitialized = true;
  }

  loadMockData() {
    this.disciples = [
      { name: 'Ali Ndiaye', type: 'disciple', lat: 14.6928, lng: -17.4467, country: 'SN', region: 'Dakar', department: 'Pikine' }
    ];
    this.dahiras = [
      { name: 'Dahira Touba Marseille', type: 'dahira', lat: 43.2965, lng: 5.3698, country: 'FR', region: 'PACA', department: 'Bouches-du-Rhône', members: 120 }
    ];
    this.mouqadams = [
      { name: 'Serigne Babacar Diop', type: 'mouqadam', lat: 6.5244, lng: 3.3792, country: 'NG', region: 'Lagos', department: 'Ikeja', disciples: 50 }
    ];

    const allItems = [...this.disciples, ...this.dahiras, ...this.mouqadams];
    this.regions = [...new Set(allItems.map(item => item.region))].map(region => ({ name: region }));
    this.departments = [...new Set(allItems.map(item => item.department))].map(dept => ({ name: dept }));
  }

  loadMapMarkers() {
    this.markers.clearLayers();

    const discipleIcon = L.icon({
      iconUrl: 'assets/icons/disciple-marker.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34]
    });

    const dahiraIcon = L.icon({
      iconUrl: 'assets/icons/dahira-marker.png',
      iconSize: [30, 46],
      iconAnchor: [15, 46],
      popupAnchor: [1, -34]
    });

    const mouqadamIcon = L.icon({
      iconUrl: 'assets/icons/mouqadam-marker.png',
      iconSize: [35, 51],
      iconAnchor: [17, 51],
      popupAnchor: [1, -34]
    });

    let filteredItems: MapItem[] = [];

    if (this.selectedFilter === 'all' || this.selectedFilter === 'disciple') {
      filteredItems = [...filteredItems, ...this.disciples];
    }
    if (this.selectedFilter === 'all' || this.selectedFilter === 'dahira') {
      filteredItems = [...filteredItems, ...this.dahiras];
    }
    if (this.selectedFilter === 'all' || this.selectedFilter === 'mouqadam') {
      filteredItems = [...filteredItems, ...this.mouqadams];
    }

    filteredItems = filteredItems.filter(item => {
      let match = true;
      if (this.selectedCountry !== 'all') match = match && item.country === this.selectedCountry;
      if (this.selectedRegion !== 'all') match = match && item.region === this.selectedRegion;
      if (this.selectedDepartment !== 'all') match = match && item.department === this.selectedDepartment;
      if (this.searchText) match = match && item.name.toLowerCase().includes(this.searchText.toLowerCase());
      return match;
    });

    const bounds: L.LatLngExpression[] = [];

    filteredItems.forEach(item => {
      let marker: L.Marker<any> | undefined;
      let popupContent = `<h4>${item.name}</h4><p>Type: ${item.type}</p><p>Pays: ${this.getCountryName(item.country)}</p><p>Région: ${item.region}</p><p>Département: ${item.department}</p>`;

      if (item.type === 'disciple') {
        marker = L.marker([item.lat, item.lng], { icon: discipleIcon });
      } else if (item.type === 'dahira') {
        popupContent += `<p>Membres: ${item.members ?? 0}</p>`;
        marker = L.marker([item.lat, item.lng], { icon: dahiraIcon });
      } else if (item.type === 'mouqadam') {
        popupContent += `<p>Disciples: ${item.disciples ?? 0}</p>`;
        marker = L.marker([item.lat, item.lng], { icon: mouqadamIcon });
      }

      if (marker) {
        marker.bindPopup(popupContent);
        this.markers.addLayer(marker);
        bounds.push([item.lat, item.lng]);
      }
    });

    if (bounds.length > 0) {
      const latLngBounds = L.latLngBounds(bounds);
      this.map.fitBounds(latLngBounds, { padding: [50, 50] });
    }
  }

  getCountryName(code: string): string {
    const country = this.countries.find(c => c.code === code);
    return country ? country.name : code;
  }

  filterChanged() {
    this.loadMapMarkers();
  }

  searchChanged() {
    this.loadMapMarkers();
  }

  countryChanged() {
    this.selectedRegion = 'all';
    this.selectedDepartment = 'all';
    this.loadMapMarkers();
  }

  regionChanged() {
    this.selectedDepartment = 'all';
    this.loadMapMarkers();
  }

  departmentChanged() {
    this.loadMapMarkers();
  }

  calculateStats() {
    const allItems = [...this.disciples, ...this.dahiras, ...this.mouqadams];
    const uniqueCountries = new Set(allItems.map(item => item.country));

    this.stats = {
      totalDisciples: this.disciples.length,
      totalDahiras: this.dahiras.length,
      totalMouqadams: this.mouqadams.length,
      countriesCount: uniqueCountries.size,
    };
  }

  resetFilters() {
    this.selectedFilter = 'all';
    this.selectedCountry = 'all';
    this.selectedRegion = 'all';
    this.selectedDepartment = 'all';
    this.searchText = '';
    this.loadMapMarkers();
  }

  exportData() {
    const allItems = [...this.disciples, ...this.dahiras, ...this.mouqadams];
    let csvContent = 'Nom,Type,Pays,Région,Département,Latitude,Longitude\n';

    allItems.forEach(item => {
      csvContent += `"${item.name}",${item.type},"${item.country}","${item.region}","${item.department}",${item.lat},${item.lng}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'donnees_disciples.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }
}

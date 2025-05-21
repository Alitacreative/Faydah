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
  private map: any;
  private markers = L.markerClusterGroup();
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
    this.loadMapMarkers();
    this.calculateStats();
    this.loadingController.dismiss();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Chargement de la carte...',
      duration: 2000
    });
    await loading.present();
  }

  initializeMap() {
    this.map = L.map(this.mapElement.nativeElement).setView([14.6937, -17.4441], 3);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.map.addLayer(this.markers);
  }

  loadMockData() {
    this.disciples = [/* ... données disciples ... */];
    this.dahiras = [/* ... données dahiras ... */];
    this.mouqadams = [/* ... données mouqadams ... */];

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

    if (this.selectedFilter === 'all' || this.selectedFilter === 'disciples') {
      filteredItems = [...filteredItems, ...this.disciples];
    }
    if (this.selectedFilter === 'all' || this.selectedFilter === 'dahiras') {
      filteredItems = [...filteredItems, ...this.dahiras];
    }
    if (this.selectedFilter === 'all' || this.selectedFilter === 'mouqadams') {
      filteredItems = [...filteredItems, ...this.mouqadams];
    }

    filteredItems = filteredItems.filter(item => {
      let matches = true;
      if (this.selectedCountry !== 'all') matches = matches && item.country === this.selectedCountry;
      if (this.selectedRegion !== 'all') matches = matches && item.region === this.selectedRegion;
      if (this.selectedDepartment !== 'all') matches = matches && item.department === this.selectedDepartment;
      if (this.searchText) matches = matches && item.name.toLowerCase().includes(this.searchText.toLowerCase());
      return matches;
    });

    filteredItems.forEach(item => {
      let marker: L.Marker<any> | undefined;
      let popupContent = '';

      if (item.type === 'disciple') {
        marker = L.marker([item.lat, item.lng], { icon: discipleIcon });
        popupContent = `<h4>${item.name}</h4><p>Type: Disciple</p><p>Pays: ${this.getCountryName(item.country)}</p><p>Région: ${item.region}</p><p>Département: ${item.department}</p>`;
      } else if (item.type === 'dahira') {
        marker = L.marker([item.lat, item.lng], { icon: dahiraIcon });
        popupContent = `<h4>${item.name}</h4><p>Type: Dahira</p><p>Membres: ${item.members}</p><p>Pays: ${this.getCountryName(item.country)}</p><p>Région: ${item.region}</p><p>Département: ${item.department}</p>`;
      } else if (item.type === 'mouqadam') {
        marker = L.marker([item.lat, item.lng], { icon: mouqadamIcon });
        popupContent = `<h4>${item.name}</h4><p>Type: Mouqadam</p><p>Disciples: ${item.disciples}</p><p>Pays: ${this.getCountryName(item.country)}</p><p>Région: ${item.region}</p><p>Département: ${item.department}</p>`;
      }

      if (marker) {
        marker.bindPopup(popupContent);
        this.markers.addLayer(marker);
      }
    });

    if (filteredItems.length > 0) {
      const group = L.featureGroup(filteredItems.map(item => L.marker([item.lat, item.lng])));
      this.map.fitBounds(group.getBounds(), { padding: [50, 50] });
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
      countriesCount: uniqueCountries.size
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
    // Implémentation simple d'export CSV par exemple
    const allItems = [...this.disciples, ...this.dahiras, ...this.mouqadams];
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Nom,Type,Pays,Région,Département,Latitude,Longitude\n';

    allItems.forEach(item => {
      const row = [
        `"${item.name}"`,
        item.type,
        `"${this.getCountryName(item.country)}"`,
        `"${item.region}"`,
        `"${item.department}"`,
        item.lat,
        item.lng
      ].join(',');
      csvContent += row + '\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'cartographie_disciples.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

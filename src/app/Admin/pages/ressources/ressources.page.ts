import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ResourceService } from '../../services/resource.service';
import { Resource } from './models/resource.model';
import { AddResourceModalComponent } from '../../components/add-resource-modal/add-resource-modal.component';

@Component({
  selector: 'app-ressources',
  templateUrl: './ressources.page.html',
  styleUrls: ['./ressources.page.scss'],
  standalone: false,
})
export class RessourcesPage implements OnInit {
  resources: Resource[] = [];
  currentFilter = 'Toutes';
  filters = ['Toutes', 'Zikrs', 'Livres', 'Conférences', 'Tafsirs'];
  searchQuery = '';

  constructor(
    private resourceService: ResourceService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.resourceService.getResources().subscribe(resources => {
      this.resources = resources;
    });

    this.resourceService.getCurrentFilter().subscribe(filter => {
      this.currentFilter = filter;
    });
  }

  async openAddResourceModal() {
    const modal = await this.modalCtrl.create({
      component: AddResourceModalComponent
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm' && data) {
      this.resourceService.addResource(data);
    }
  }

  setFilter(filter: string) {
    this.resourceService.filterResources(filter);
  }

  searchResources(event: any) {
    this.searchQuery = event.target.value.toLowerCase();
  }
}
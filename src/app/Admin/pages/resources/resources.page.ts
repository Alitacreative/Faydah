import { Component, OnInit } from '@angular/core';
import { ResourcesService } from './services/resource.service';
import { Resource } from './model/resource.model';
import { Observable } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { AddResourceModalComponent } from '../../components/add-resource-modal/add-resource-modal.component';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.page.html',
  styleUrls: ['./resources.page.scss'],
  standalone:false,
})
export class ResourcesPage implements OnInit {
  resources$: Observable<Resource[]>;
  selectedCategory$: Observable<string>;
  searchTerm = '';

  categories = ['Toutes', 'Zikrs', 'Livres', 'Conférences', 'Tafsirs'];

  constructor(
    private resourcesService: ResourcesService,
    private modalController: ModalController
  ) {
    this.resources$ = this.resourcesService.getResources();
    this.selectedCategory$ = this.resourcesService.getSelectedCategory();
  }

  ngOnInit() {}

  setCategory(category: string) {
    this.resourcesService.setSelectedCategory(category);
  }

  search(event: any) {
    this.searchTerm = event.target.value;
    this.resourcesService.searchResources(this.searchTerm);
  }

  async openAddResourceModal() {
    const modal = await this.modalController.create({
      component: AddResourceModalComponent,
      cssClass: 'add-resource-modal'
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data && data.resource) {
      this.resourcesService.addResource(data.resource);
    }
  }
}
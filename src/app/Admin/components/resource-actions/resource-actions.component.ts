import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';
import { ResourcesService } from '../../pages/resources/services/resource.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { AddResourceModalComponent } from '../add-resource-modal/add-resource-modal.component';

@Component({
  selector: 'app-resource-actions',
  templateUrl: './resource-actions.component.html',
  styleUrls: ['./resource-actions.component.scss'],
  standalone:false,
})
export class ResourceActionsComponent implements OnInit {
  resourceId: string;
  
  constructor(
    private navParams: NavParams,
    private popoverController: PopoverController,
    private resourcesService: ResourcesService,
    private router: Router,
    private alertController: AlertController,
    private modalController: ModalController
  ) { 
    this.resourceId = this.navParams.get('resourceId');
  }

  ngOnInit() {}

  viewDetails() {
    this.popoverController.dismiss({
      action: 'view'
    });
    this.router.navigate(['/resource', this.resourceId]);
  }

  async editResource() {
    const resource = this.resourcesService.getResourceById(this.resourceId);
    
    if (!resource) {
      return;
    }
    
    const modal = await this.modalController.create({
      component: AddResourceModalComponent,
      componentProps: {
        isEdit: true,
        resource: {...resource}
      }
    });
    
    await modal.present();
    
    const { data } = await modal.onDidDismiss();
    if (data && data.resource) {
      this.resourcesService.updateResource(this.resourceId, data.resource);
    }
    
    this.popoverController.dismiss();
  }

  async deleteResource() {
    const alert = await this.alertController.create({
      header: 'Confirmer la suppression',
      message: 'Êtes-vous sûr de vouloir supprimer cette ressource ?',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel'
        }, {
          text: 'Supprimer',
          handler: () => {
            this.resourcesService.deleteResource(this.resourceId);
            this.popoverController.dismiss();
          }
        }
      ]
    });

    await alert.present();
  }
}
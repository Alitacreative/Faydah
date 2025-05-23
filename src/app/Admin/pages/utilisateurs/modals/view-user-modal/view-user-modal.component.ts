import { Component, Input } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';

import { EditUserModalComponent } from '../edit-user-modal/edit-user-modal.component';

@Component({
  selector: 'app-view-user-modal',
  templateUrl: './view-user-modal.component.html',
  styleUrls: ['./view-user-modal.component.scss'],
  standalone: false
})
export class ViewUserModalComponent {
  @Input() user: any;

  constructor(
    private modalController: ModalController,
    private alertController: AlertController
  ) {}

  dismiss() {
    this.modalController.dismiss();
  }

  async editUser() {
    // Fermer ce modal
    await this.modalController.dismiss();
    
    // Ouvrir le modal d'édition
    const modal = await this.modalController.create({
      component: EditUserModalComponent,
      componentProps: {
        user: {...this.user} // Passer une copie pour éviter les modifications accidentelles
      },
      cssClass: 'edit-user-modal'
    });
    
    await modal.present();
    
    // Attendre la fermeture du modal et retourner les données mises à jour
    const { data } = await modal.onWillDismiss();
    if (data) {
      this.modalController.dismiss(data, 'edit');
    }
  }

  async confirmDelete() {
    const alert = await this.alertController.create({
      header: 'Confirmation',
      message: `Êtes-vous sûr de vouloir supprimer ${this.user.name} ?`,
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel'
        },
        {
          text: 'Supprimer',
          role: 'destructive',
          handler: () => {
            this.modalController.dismiss(this.user, 'delete');
          }
        }
      ]
    });

    await alert.present();
  }
}
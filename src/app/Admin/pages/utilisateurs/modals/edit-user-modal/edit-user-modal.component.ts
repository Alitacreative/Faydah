import { Component, Input, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-edit-user-modal',
  templateUrl: './edit-user-modal.component.html',
  styleUrls: ['./edit-user-modal.component.scss'],
  standalone: false
})
export class EditUserModalComponent implements OnInit {
  @Input() user: any;
  editedUser: any = {};
  categories: string[] = ['Disciples', 'Dahira', 'Mouqadam', 'Visiteurs', 'Resp. Dahira'];

  constructor(
    private modalController: ModalController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    // Créer une copie pour éviter la modification directe
    this.editedUser = { ...this.user };
    
    // Valeurs par défaut si elles n'existent pas
    if (!this.editedUser.email) this.editedUser.email = '';
    if (!this.editedUser.phone) this.editedUser.phone = '';
    if (!this.editedUser.address) this.editedUser.address = '';
  }

  dismiss() {
    this.modalController.dismiss();
  }

  async saveUser() {
    // Validation simple
    if (!this.editedUser.name) {
      this.presentAlert('Erreur', 'Le nom est obligatoire');
      return;
    }

    // Retourner l'utilisateur modifié
    this.modalController.dismiss(this.editedUser);
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });

    await alert.present();
  }
}
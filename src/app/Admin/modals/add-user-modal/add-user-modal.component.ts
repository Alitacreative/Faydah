import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-add-user-modal',
  templateUrl: './add-user-modal.component.html',
  styleUrls: ['./add-user-modal.component.scss'],
  standalone:false
})
export class AddUserModalComponent implements OnInit {
  newUser = {
    name: '',
    category: 'Disciples',
    email: '',
    phone: '',
    image: 'assets/avatars/default-avatar.png'
  };

  categories = ['Disciples', 'Dahira', 'Mouqadam', 'Visiteurs', 'Resp. Dahira'];

  constructor(private modalController: ModalController) { }

  ngOnInit() {}

  dismiss() {
    this.modalController.dismiss();
  }

  saveUser() {
    if (this.newUser.name.trim()) {
      this.modalController.dismiss(this.newUser);
    }
  }
}
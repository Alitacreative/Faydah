import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController, AlertController, ActionSheetController } from '@ionic/angular';
import { AddUserModalComponent } from '../../modals/add-user-modal/add-user-modal.component';
import { FilterUsersModalComponent } from '../../modals/filter-users-modal/filter-users-modal.component';
// import { UserService, User } from '../services/user.service'; // Décommente si tu utilises un service
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-utilisateurs',
  templateUrl: './utilisateurs.page.html',
  styleUrls: ['./utilisateurs.page.scss'],
  standalone: false,
})
export class UtilisateursPage implements OnInit, OnDestroy {
  searchTerm: string = '';
  activeFilter: string = 'Tous';

  // Utilise soit un service, soit des données mockées
  users = [
    { id: 1, name: 'Robert Fox', category: 'Disciples', image: 'assets/images/1.png' },
    { id: 2, name: 'Ralph Edwards', category: 'Dahira', image: 'assets/images/1.png' },
    { id: 3, name: 'Ronald Richards', category: 'Mouqadam', image: 'assets/images/1.png' },
    { id: 4, name: 'Brooklyn Simmons', category: 'Mouqadam', image: 'assets/images/1.png' },
    { id: 5, name: 'Kristin Watson', category: 'Mouqadam', image: 'assets/images/1.png' },
    { id: 6, name: 'Courtney Henry', category: 'Mouqadam', image: 'assets/images/1.png' },
    { id: 7, name: 'Guy Hawkins', category: 'Disciples', image: 'assets/images/1.png' },
    { id: 8, name: 'Leslie Alexander', category: 'Disciples', image: 'assets/images/1.png' },
    { id: 9, name: 'Jerome Bell', category: 'Disciples', image: 'assets/images/1.png' },
    { id: 10, name: 'Bessie Cooper', category: 'Disciples', image: 'assets/images/1.png' },
    { id: 11, name: 'Esther Howard', category: 'Disciples', image: 'assets/images/1.png' },
    { id: 12, name: 'Devon Lane', category: 'Disciples', image: 'assets/images/1.png' },
  ];

  filters = ['Tous', 'Disciples', 'Visiteurs', 'Resp. Dahira'];
  // private userSubscription: Subscription; // Active si tu utilises un service

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private actionSheetController: ActionSheetController,
    // private userService: UserService // Active si tu utilises un service
  ) {}

  ngOnInit() {
    // Utilise cette logique si tu travailles avec un service :
    // this.userSubscription = this.userService.users$.subscribe(users => {
    //   this.users = users;
    // });
  }

  ngOnDestroy() {
    // if (this.userSubscription) {
    //   this.userSubscription.unsubscribe();
    // }
  }

  get filteredUsers() {
    let filtered = [...this.users];
    if (this.activeFilter !== 'Tous') {
      filtered = filtered.filter(user => user.category === this.activeFilter);
    }
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(term) ||
        user.category.toLowerCase().includes(term)
      );
    }
    return filtered;
  }

  setFilter(filter: string) {
    this.activeFilter = filter;
  }

  async openAddUserModal() {
    const modal = await this.modalController.create({
      component: AddUserModalComponent,
      cssClass: 'add-user-modal'
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      const newId = Math.max(...this.users.map(u => u.id)) + 1;
      this.users.push({
        id: newId,
        name: data.name,
        category: data.category,
        image: data.image
      });

      this.presentToast(`${data.name} a été ajouté avec succès`);
    }
  }

  async openFilterModal() {
    const modal = await this.modalController.create({
      component: FilterUsersModalComponent,
      cssClass: 'filter-users-modal'
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      console.log('Filtres appliqués:', data);
      // Appliquer les filtres personnalisés ici
    }
  }

  async openUserOptions(user: any) {
    const actionSheet = await this.actionSheetController.create({
      header: user.name,
      buttons: [
        {
          text: 'Voir le profil',
          icon: 'person-outline',
          handler: () => {
            console.log('Voir le profil de', user.name);
          }
        },
        {
          text: 'Modifier',
          icon: 'create-outline',
          handler: () => {
            this.editUser(user);
          }
        },
        {
          text: 'Supprimer',
          icon: 'trash-outline',
          role: 'destructive',
          handler: () => {
            this.confirmDeleteUser(user);
          }
        },
        {
          text: 'Annuler',
          icon: 'close-outline',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
  }

  async editUser(user: any) {
    console.log('Éditer utilisateur:', user);
  }

  async confirmDeleteUser(user: any) {
    const alert = await this.alertController.create({
      header: 'Confirmation',
      message: `Êtes-vous sûr de vouloir supprimer ${user.name} ?`,
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel'
        },
        {
          text: 'Supprimer',
          role: 'destructive',
          handler: () => {
            this.deleteUser(user);
          }
        }
      ]
    });

    await alert.present();
  }

  deleteUser(user: any) {
    this.users = this.users.filter(u => u.id !== user.id);
    this.presentToast(`${user.name} a été supprimé`);
  }

  async presentToast(message: string) {
    const alert = await this.alertController.create({
      header: 'Notification',
      message,
      buttons: ['OK'],
      cssClass: 'custom-alert'
    });

    await alert.present();
    setTimeout(() => {
      alert.dismiss();
    }, 2000);
  }
}

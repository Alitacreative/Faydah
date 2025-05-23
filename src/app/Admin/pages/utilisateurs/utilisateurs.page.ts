import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController, AlertController, ActionSheetController } from '@ionic/angular';
import { AddUserModalComponent } from './modals/add-user-modal/add-user-modal.component';
import { FilterUsersModalComponent } from './modals/filter-users-modal/filter-users-modal.component';
import { ViewUserModalComponent } from './modals/view-user-modal/view-user-modal.component';
import { EditUserModalComponent } from './modals/edit-user-modal/edit-user-modal.component';
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
    { id: 1, name: 'Robert Fox', category: 'Disciples', image: 'assets/images/1.png', email: 'robert.fox@example.com', phone: '+33 6 12 34 56 01', address: '123 Rue de Paris' },
    { id: 2, name: 'Ralph Edwards', category: 'Dahira', image: 'assets/images/1.png', email: 'ralph.edwards@example.com', phone: '+33 6 12 34 56 02' },
    { id: 3, name: 'Ronald Richards', category: 'Mouqadam', image: 'assets/images/1.png', email: 'ronald.richards@example.com', phone: '+33 6 12 34 56 03' },
    { id: 4, name: 'Brooklyn Simmons', category: 'Mouqadam', image: 'assets/images/1.png', email: 'brooklyn.simmons@example.com', phone: '+33 6 12 34 56 04' },
    { id: 5, name: 'Kristin Watson', category: 'Mouqadam', image: 'assets/images/1.png', email: 'kristin.watson@example.com', phone: '+33 6 12 34 56 05' },
    { id: 6, name: 'Courtney Henry', category: 'Mouqadam', image: 'assets/images/1.png', email: 'courtney.henry@example.com', phone: '+33 6 12 34 56 06' },
    { id: 7, name: 'Guy Hawkins', category: 'Disciples', image: 'assets/images/1.png', email: 'guy.hawkins@example.com', phone: '+33 6 12 34 56 07' },
    { id: 8, name: 'Leslie Alexander', category: 'Disciples', image: 'assets/images/1.png', email: 'leslie.alexander@example.com', phone: '+33 6 12 34 56 08' },
    { id: 9, name: 'Jerome Bell', category: 'Disciples', image: 'assets/images/1.png', email: 'jerome.bell@example.com', phone: '+33 6 12 34 56 09' },
    { id: 10, name: 'Bessie Cooper', category: 'Disciples', image: 'assets/images/1.png', email: 'bessie.cooper@example.com', phone: '+33 6 12 34 56 10' },
    { id: 11, name: 'Esther Howard', category: 'Disciples', image: 'assets/images/1.png', email: 'esther.howard@example.com', phone: '+33 6 12 34 56 11' },
    { id: 12, name: 'Devon Lane', category: 'Disciples', image: 'assets/images/1.png', email: 'devon.lane@example.com', phone: '+33 6 12 34 56 12' },
  ];

  filters = ['Tous', 'Disciples', 'Visiteurs', 'Dahira', 'Mouqadam', 'Resp. Dahira'];
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
        image: data.image || 'assets/images/1.png',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || ''
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
            this.viewUserProfile(user);
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

  async viewUserProfile(user: any) {
    const modal = await this.modalController.create({
      component: ViewUserModalComponent,
      componentProps: {
        user: user
      },
      cssClass: 'view-user-modal'
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    
    if (role === 'delete' && data) {
      this.deleteUser(data);
    } else if (role === 'edit' && data) {
      this.updateUser(data);
    }
  }

  async editUser(user: any) {
    const modal = await this.modalController.create({
      component: EditUserModalComponent,
      componentProps: {
        user: {...user} // Passer une copie
      },
      cssClass: 'edit-user-modal'
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.updateUser(data);
    }
  }

  updateUser(updatedUser: any) {
    const index = this.users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      this.users[index] = updatedUser;
      this.presentToast(`${updatedUser.name} a été mis à jour`);
    }
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
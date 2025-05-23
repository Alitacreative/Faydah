import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // <-- nécessaire pour ngModel
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

import { UtilisateursPage } from './utilisateurs.page';
import { AddUserModalComponent } from './modals/add-user-modal/add-user-modal.component';
import { FilterUsersModalComponent } from './modals/filter-users-modal/filter-users-modal.component';
import { EditUserModalComponent } from './modals/edit-user-modal/edit-user-modal.component';  // <-- import ajouté
import { LeftMenuComponent } from '../../components/left-menu/left-menu.component';

const routes: Routes = [
  {
    path: '',
    component: UtilisateursPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,       // <-- déjà là, bien !
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    UtilisateursPage,
    AddUserModalComponent,
    FilterUsersModalComponent,
    EditUserModalComponent,  // <-- déclaration ajoutée
    LeftMenuComponent
  ]
})
export class UtilisateursPageModule {}
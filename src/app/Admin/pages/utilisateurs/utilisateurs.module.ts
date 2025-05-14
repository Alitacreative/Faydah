import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

import { UtilisateursPage } from './utilisateurs.page';
import { AddUserModalComponent } from '../../modals/add-user-modal/add-user-modal.component';
import { FilterUsersModalComponent } from '../../modals/filter-users-modal/filter-users-modal.component';
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
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    UtilisateursPage,
    AddUserModalComponent,
    FilterUsersModalComponent,
    LeftMenuComponent
  ]
})
export class UtilisateursPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

import { RessourcesPage } from './ressources.page';
import { ResourceCardModule } from '../../components/resource-card/resource-card.module';
import { AddResourceModalModule } from '../../components/add-resource-modal/add-resource-modal.module';

const routes: Routes = [
  {
    path: '',
    component: RessourcesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResourceCardModule,
    AddResourceModalModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RessourcesPage]
})
export class RessourcesPageModule {}
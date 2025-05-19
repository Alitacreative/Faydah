import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

import { ResourcesPage } from './resources.page';
import { ResourceCardComponent } from '../../components/resource-card/resource-card.component';
import { ResourceActionsComponent } from '../../components/resource-actions/resource-actions.component';
import { AddResourceModalComponent } from '../../components/add-resource-modal/add-resource-modal.component';

const routes: Routes = [
  {
    path: '',
    component: ResourcesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    ResourcesPage,
    ResourceCardComponent,
    ResourceActionsComponent,
    AddResourceModalComponent
  ]
})
export class ResourcesPageModule {}

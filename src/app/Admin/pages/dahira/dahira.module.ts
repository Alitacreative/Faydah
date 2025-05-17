import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DahiraPageRoutingModule } from './dahira-routing.module';

import { DahiraPage } from './dahira.page';
import { AddDahiraModalComponent } from "./components/add-dahira-modal/add-dahira-modal.component";
import { EditDahiraModalComponent } from "./components/edit-dahira-modal/edit-dahira-modal.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DahiraPageRoutingModule,
    AddDahiraModalComponent,
    EditDahiraModalComponent
],
  declarations: [DahiraPage]
})
export class DahiraPageModule {}

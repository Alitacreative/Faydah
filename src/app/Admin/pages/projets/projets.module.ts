import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProjetsPageRoutingModule } from './projets-routing.module';

import { ProjetsPage } from './projets.page';
import { AddProjetModalComponent } from "./components/add-projet-modal/add-projet-modal.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProjetsPageRoutingModule,
    AddProjetModalComponent
],
  declarations: [ProjetsPage]
})
export class ProjetsPageModule {}

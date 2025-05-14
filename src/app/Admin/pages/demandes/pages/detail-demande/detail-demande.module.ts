import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailDemandePageRoutingModule } from './detail-demande-routing.module';

import { DetailDemandePage } from './detail-demande.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailDemandePageRoutingModule
  ],
  declarations: [DetailDemandePage]
})
export class DetailDemandePageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TourismePageRoutingModule } from './tourisme-routing.module';

import { TourismePage } from './tourisme.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TourismePageRoutingModule
  ],
  declarations: [TourismePage]
})
export class TourismePageModule {}

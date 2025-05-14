import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DahiraPageRoutingModule } from './dahira-routing.module';

import { DahiraPage } from './dahira.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DahiraPageRoutingModule
  ],
  declarations: [DahiraPage]
})
export class DahiraPageModule {}

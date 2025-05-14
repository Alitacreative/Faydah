import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AddResourceModalComponent } from './add-resource-modal.component';

@NgModule({
  declarations: [
    AddResourceModalComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    AddResourceModalComponent
  ]
})
export class AddResourceModalModule {}

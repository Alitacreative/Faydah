import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ResourceCardComponent } from './resource-card.component';

@NgModule({
  declarations: [
    ResourceCardComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    ResourceCardComponent
  ]
})
export class ResourceCardModule {}
